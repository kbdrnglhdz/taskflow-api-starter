# Sesión 3 – Integración con flujos existentes

**Objetivo:** Conectar Opencode con CI/CD, Pull Requests y hooks locales.

---

## 📚 Fundamentos teóricos

### ¿Qué son los Comandos en OpenCode?

Los **comandos personalizados** permiten especificar un mensaje que deseas ejecutar cuando ese comando se ejecuta en la TUI de OpenCode.

```
/mi-comando
```

Los comandos personalizados se suman a los comandos integrados como `/init`, `/undo`, `/redo`, `/share`, `/help`.

#### Crear un Comando

Los comandos se crean mediante archivos de Markdown en el directorio `commands/`:

```
.opencode/commands/test.md
```

```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---
Run the full test suite with coverage report and show any failures.
```

#### Opciones de configuración

| Opción | Descripción |
|--------|-------------|
| `description` | Descripción breve del comando |
| `agent` | Qué agente ejecuta el comando |
| `model` | Modelo a usar |
| `subtask` | Boolean para forzar invocación de subagente |
| `template` | El mensaje que se envía al LLM |

#### Marcadores de posición

- `$ARGUMENTS`: Todo lo pasado después del comando
- `$1`, `$2`, `$3`: Argumentos posicionales individuales

#### Inyectar salida de shell

Usa ``!`command` `` para inyectar la salida de un comando:

```markdown
---
description: Analyze test coverage
---
Here are the current test results:
!`npm test`
```

Más información: [Documentación OpenCode - Comandos](https://opencode.ai/docs/es/commands)

---

### GitHub Actions

GitHub Actions permite automatizar flujos de trabajo. En este taller, usamos un workflow que:
1. Se ejecuta cuando se abre o actualiza un PR
2. Instala Opencode
3. Ejecuta el agente revisor en los archivos modificados
4. Comenta automáticamente el PR con la revisión

### Husky

Husky es una herramienta que permite ejecutar scripts antes de eventos de Git (commit, push, etc.). El hook de pre-commit permite ejecutar el skill de lint antes de cada commit, asegurando que el código cumpla con los estándares de formato.

#### Instalar Husky

```bash
npm install --save-dev husky
npx husky install
```

#### Crear un hook

```bash
npx husky add .husky/pre-commit "opencode skill lint"
chmod +x .husky/pre-commit
```

---

### Resumen de la sesión 3

En esta sesión aprenderás a:
1. Crear un comando personalizado `/review-pr`
2. Configurar GitHub Actions para revisión automática de PRs
3. Crear el skill de lint
4. Instalar y configurar Husky
5. Crear un hook de pre-commit

**Flujo de integración:**
- Local: Hook de pre-commit → Lint → Commit
- Remoto: PR → GitHub Actions → Review → Comentario automático

**Comandos útiles:**
- `git commit --no-verify`: Saltar hooks
- `/share`: Compartir conversación con el equipo

---

## 3.1 Objetivo de la sesión

- Crear un comando personalizado para revisar PRs
- Configurar GitHub Actions para comentario automático en PRs
- Crear un hook de pre-commit con lint automático
- Crear el skill de lint

---

## 3.2 Crear comando /review-pr (10 min)

Crea el archivo `.opencode/commands/review-pr.md`.

Este comando identifica los archivos modificados y los pasa al agente revisor.

```markdown
---
name: review-pr
description: Revisa los archivos modificados en el último commit (o en la rama actual vs main) usando el agente taskflow-reviewer.
---

Ejecuta el siguiente flujo:

1. Identifica los archivos modificados en el último commit (si se ejecuta local) o en la diferencia entre la rama actual y `origin/main` (para PRs). Usa:
   ```bash
   git diff --name-only HEAD^ HEAD   # último commit
   # o
   git diff --name-only origin/main...HEAD
   ```

2. Pasa esos archivos al agente `taskflow-reviewer`:
   ```bash
   opencode run --agent taskflow-reviewer --files <lista_de_archivos>
   ```

3. Muestra el resultado al usuario en un formato legible (puede ser el mismo que genera el agente).

4. Si no hay archivos modificados, informa "No hay cambios para revisar".
```

---

## 3.3 Probar el comando (5 min)

```bash
# Hacer un cambio pequeño
echo "// cambio de prueba" >> backend/src/index.ts

# Ejecutar el comando
opencode run --command review-pr
```

---

## 3.4 Crear workflow de GitHub Actions (20 min)

Crea el archivo `.github/workflows/opencode-review.yml`.

Este workflow ejecuta el agente revisor en cada PR y deja un comentario automático.

```yaml
name: Opencode PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Opencode
        run: curl -fsSL https://opencode.ai/install | bash

      - name: Get changed files
        id: changed-files
        run: |
          git fetch origin main
          FILES=$(git diff --name-only origin/main...HEAD | tr '\n' ' ')
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: Run Opencode review
        if: steps.changed-files.outputs.files != ''
        env:
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
        run: |
          opencode run --agent taskflow-reviewer --files ${{ steps.changed-files.outputs.files }} > review.txt
          cat review.txt

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.existsSync('review.txt') ? fs.readFileSync('review.txt', 'utf8') : 'No se encontraron archivos modificados para revisar.';
            const body = `## 🤖 Revisión automática de Opencode\n\n${review}`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
```

---

## 3.5 Configurar secreto en GitHub (5 min)

```bash
# Instrucciones para cada participante:
# 1. Ir a GitHub → Repositorio → Settings → Secrets and variables → Actions
# 2. Añadir secreto: OPENCODE_API_KEY = valor de su API key
```

---

## 3.6 Crear skill lint (15 min)

Crea el archivo `.opencode/skills/lint/SKILL.md`.

Este skill ejecuta ESLint y Prettier sobre los archivos staged.

```markdown
---
name: lint
description: Ejecuta ESLint y Prettier sobre los archivos staged (git) y reporta errores.
---

# Skill lint

Este skill se usa como pre-commit hook para asegurar el estilo de código.

## Instrucciones

1. Obtén la lista de archivos staged (JS/TS/TSX):
   ```bash
   git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$'
   ```

2. Para cada archivo, ejecuta:
   ```bash
   npx eslint --fix <archivo>
   npx prettier --write <archivo>
   ```

3. Si algún comando falla, reporta el error y haz que el skill termine con código de salida 1 (para que el hook cancele el commit).

4. Si todo está bien, re-añade los archivos corregidos al stage:
   ```bash
   git add <archivo>
   ```

5. Responde con "✅ Lint y formato aplicados correctamente" o con la lista de errores no automáticos.
```

---

## 3.7 Instalar Husky y configurar hook (10 min)

```bash
# Instalar husky
npm install --save-dev husky
npx husky install

# Añadir pre-commit hook
npx husky add .husky/pre-commit "opencode skill lint"

# Hacer ejecutable el hook
chmod +x .husky/pre-commit
```

**Contenido del hook `.husky/pre-commit`:**

```bash
#!/bin/sh
opencode skill lint
```

---

## 3.8 Verificar el hook (5 min)

```bash
# Hacer un cambio con mala sintaxis
echo "const   x   =   1" >> backend/src/index.ts
git add backend/src/index.ts

# Intentar commit (debe fallar o corregir)
git commit -m "test: probar hook"
```

**Resultado esperado:** El hook ejecuta lint automáticamente antes del commit.

---

## 3.9 Commit de los cambios (5 min)

```bash
git add .opencode/commands/ .github/workflows/opencode-review.yml .husky/ .opencode/skills/lint/
git commit -m "ci: integrar Opencode con PR review y pre-commit hook"
git push origin main
```

---

## ✅ Éxito de la sesión

- El comando `/review-pr` identifica archivos modificados
- GitHub Actions comenta automáticamente en cada PR
- El hook de pre-commit ejecuta lint automáticamente
- El skill `lint` formatea código antes de cada commit

---

## Archivos de esta sesión

```
workshop/sesion-3-integracion/
├── diapositivas.md
├── .github/
│   └── workflows/
│       └── opencode-review.yml
├── .husky/
│   └── pre-commit
└── .opencode/
    ├── commands/
    │   └── review-pr.md
    └── skills/
        └── lint/
            └── SKILL.md
```