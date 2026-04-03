# Manual del Participante - Sesión 3: Integración con Flujos Existentes

## 📋 Descripción de la sesión

Esta sesión te enseñará a integrar OpenCode con tus flujos de trabajo existentes: sistemas CI/CD, Pull Requests y hooks locales. Aprenderás a automatizar la revisión de código y mantener estándares de calidad automáticamente.

**Objetivo:** Conectar OpenCode con CI/CD, Pull Requests y hooks locales

---

## 📚 Teoría: Comandos Personalizados en OpenCode

### ¿Qué son los comandos?

Los **comandos personalizados** permiten especificar un mensaje que deseas ejecutar cuando el comando se ejecuta en la TUI de OpenCode. Se usan con el prefijo `/`:

```
/mi-comando
```

Los comandos personalizados se suman a los comandos integrados como `/init`, `/undo`, `/redo`, `/share`, `/help`.

> **Referencia:** [Documentación OpenCode - Comandos](https://opencode.ai/docs/es/commands)

### Ubicaciones de comandos

Los comandos se definen en archivos de Markdown:
- **Global:** `~/.config/opencode/commands/`
- **Por proyecto:** `.opencode/commands/`

### Estructura de un comando

```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
```

El frontmatter define las propiedades del comando. El contenido se convierte en la plantilla que se envía al LLM.

### Opciones de configuración

| Opción | Descripción |
|--------|-------------|
| `template` | El mensaje que se enviará al LLM (obligatorio) |
| `description` | Descripción mostrada en TUI |
| `agent` | Qué agente debe ejecutar el comando |
| `model` | Anular el modelo predeterminado |
| `subtask` | Boolean para forzar invocación de subagente |

> **Referencia:** [Documentación - Opciones de comandos](https://opencode.ai/docs/es/commands#opciones)

### Marcadores de posición

#### Argumentos

Puedes pasar argumentos a comandos usando marcadores:

- `$ARGUMENTS` — Todo lo pasado después del comando
- `$1` — Primer argumento
- `$2` — Segundo argumento
- `$3` — Tercer argumento

**Ejemplo:**

```markdown
---
description: Create a new component
---
Create a new React component named $ARGUMENTS with TypeScript support.
```

Uso: `/component Button` → `$ARGUMENTS` = `Button`

#### Inyectar salida de shell

Usa ``!`command` `` para inyectar la salida de un comando bash:

```markdown
---
description: Analyze test coverage
---
Here are the current test results:
!`npm test`
Based on these results, suggest improvements.
```

Los comandos se ejecutan en el directorio raíz del proyecto y su salida pasa a formar parte del mensaje.

#### Referencias de archivos

Incluye archivos usando `@` seguido del nombre:

```markdown
---
description: Review component
---
Review the component in @src/components/Button.tsx.
```

El contenido del archivo se incluye automáticamente en el mensaje.

### Comandos integrados

OpenCode incluye comandos integrados:

| Comando | Descripción |
|---------|-------------|
| `/init` | Inicializa el proyecto |
| `/undo` | Deshace los últimos cambios |
| `/redo` | Rehace los cambios deshechos |
| `/share` | Comparte la conversación actual |
| `/connect` | Conecta con un proveedor |
| `/help` | Muestra ayuda |

> **Nota:** Los comandos personalizados pueden anular los comandos integrados.

---

## 📚 Teoría: GitHub Actions

### ¿Qué es GitHub Actions?

GitHub Actions es una plataforma de CI/CD que permite automatizar flujos de trabajo. Puedes ejecutar cualquier proceso en respuesta a eventos de GitHub.

### Estructura de un workflow

Los workflows se definen en archivos YAML en `.github/workflows/`:

```yaml
name: Nombre del workflow

on:
  # Evento que dispara el workflow
  pull_request:
    types: [opened, synchronize]

jobs:
  nombre-del-job:
    runs-on: ubuntu-latest
    steps:
      - name: Paso 1
        run: comando
```

### Eventos comunes

| Evento | Descripción |
|--------|-------------|
| `push` | Se ejecuta en cada push |
| `pull_request` | Se ejecuta en PRs |
| `workflow_dispatch` | Ejecución manual |
| `schedule` | Ejecución programada (cron) |

### Secrets en GitHub

Los **secrets** permiten almacenar valores sensibles:
1. Ve a **Settings → Secrets and variables → Actions**
2. Añade un nuevo secret
3. Accede con `${{ secrets.NOMBRE }}`

---

## 📚 Teoría: Git Hooks con Husky

### ¿Qué es Husky?

Husky es una herramienta que permite ejecutar scripts antes de eventos de Git (commit, push, etc.).

### Instalación

```bash
npm install --save-dev husky
npx husky install
```

### Crear un hook

```bash
npx husky add .husky/pre-commit "npm test"
chmod +x .husky/pre-commit
```

### Hooks comunes

| Hook | Cuando se ejecuta |
|------|-------------------|
| `pre-commit` | Antes de cada commit |
| `commit-msg` | Antes del mensaje de commit |
| `pre-push` | Antes de hacer push |

### Saltar hooks

```bash
git commit --no-verify -m "mensaje"  # Saltar pre-commit
```

---

## 📚 Teoría: Integración de OpenCode con GitHub Actions

### Workflow de revisión automática

Un workflow típico de OpenCode en GitHub Actions:

1. **Disparador:** PR abierto o actualizado
2. **Instalación:** Instalar OpenCode
3. **Obtención de cambios:** Identificar archivos modificados
4. **Ejecución:** Ejecutar el agente revisor
5. **Comentario:** Publicar resultado en el PR

### Estructura del workflow

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

      - name: Install Opencode
        run: curl -fsSL https://opencode.ai/install | bash

      - name: Get changed files
        run: |
          git fetch origin main
          FILES=$(git diff --name-only origin/main...HEAD | tr '\n' ' ')
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: Run Opencode
        run: opencode run --agent revisor --files ${{ steps.changed-files.outputs.files }}

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            // Publicar comentario
```

### Permisos necesarios

| Permiso | Descripción |
|---------|-------------|
| `pull-requests: write` | Para comentar en PRs |
| `contents: read` | Para leer el código |

---

## 📚 Teoría: Integración con Hooks Locales

### Pre-commit hook con OpenCode

El hook de pre-commit puede ejecutar un skill de OpenCode:

```bash
#!/bin/sh
opencode skill lint
```

### Skill de lint

Un skill de lint típico:

1. Obtiene la lista de archivos staged
2. Ejecuta linters/formatters (ESLint, Prettier)
3. Si hay errores, sale con código 1 (cancela commit)
4. Si todo bien, re-añade los archivos al stage

### Flujo completo

```
Developer escribe código
    ↓
git add archivos
    ↓
git commit
    ↓
Hook pre-commit ejecuta: opencode skill lint
    ↓
Si hay errores → Commit cancelado
Si todo bien → Commit exitoso
```

---

## 📚 Teoría: Compartir Conversaciones

### El comando /share

OpenCode permite compartir conversaciones con el equipo:

```bash
/share
```

Esto crea un enlace a la conversación actual y lo copia en el portapapeles.

**Nota:** Las conversaciones no se comparten de forma predeterminada.

> **Referencia:** [Documentación OpenCode - Compartir](https://opencode.ai/docs/es/share)

---

## 🛠️ Práctica: Ejercicios de la sesión

### Ejercicio 1: Crear comando /review-pr

Crea `.opencode/commands/review-pr.md`:

```markdown
---
name: review-pr
description: Revisa los archivos modificados en el último commit usando el agente taskflow-reviewer.
---

Ejecuta el siguiente flujo:

1. Identifica los archivos modificados:
   - git diff --name-only HEAD^ HEAD (último commit)
   - git diff --name-only origin/main...HEAD (para PRs)

2. Pasa esos archivos al agente taskflow-reviewer

3. Muestra el resultado al usuario

4. Si no hay archivos modificados, informa "No hay cambios para revisar"
```

### Ejercicio 2: Probar el comando

```bash
echo "// cambio de prueba" >> backend/src/index.ts
opencode run --command review-pr
```

### Ejercicio 3: Crear workflow de GitHub Actions

Crea `.github/workflows/opencode-review.yml`:

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

      - name: Run Opencode
        env:
          OPENCODE_API_KEY: ${{ secrets.OPENCODE_API_KEY }}
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

### Ejercicio 4: Configurar secreto en GitHub

1. Ve a **GitHub → Repositorio → Settings → Secrets and variables → Actions**
2. Añade un nuevo secret: `OPENCODE_API_KEY`
3. Pega tu API key

### Ejercicio 5: Crear skill de lint

Crea `.opencode/skills/lint/SKILL.md`:

```markdown
---
name: lint
description: Ejecuta ESLint y Prettier sobre los archivos staged y reporta errores.
---

# Skill lint

Este skill se usa como pre-commit hook para asegurar el estilo de código.

## Instrucciones

1. Obtén la lista de archivos staged:
   git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$'

2. Para cada archivo, ejecuta:
   npx eslint --fix <archivo>
   npx prettier --write <archivo>

3. Si algún comando falla, reporta el error y termina con código 1

4. Si todo está bien, re-añade los archivos al stage:
   git add <archivo>

5. Responde con "✅ Lint y formato aplicados correctamente" o con los errores
```

### Ejercicio 6: Instalar Husky

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "opencode skill lint"
chmod +x .husky/pre-commit
```

### Ejercicio 7: Verificar el hook

```bash
echo "const   x   =   1" >> backend/src/index.ts
git add backend/src/index.ts
git commit -m "test: probar hook"
```

---

## 📋 Checklist de la sesión

- [ ] Comando `/review-pr` creado en `.opencode/commands/`
- [ ] Workflow de GitHub Actions creado
- [ ] Secreto `OPENCODE_API_KEY` configurado en GitHub
- [ ] Skill de lint creado en `.opencode/skills/lint/`
- [ ] Husky instalado y configurado
- [ ] Hook de pre-commit funcionando
- [ ] Commit realizado

---

## 📖 Referencias

- [Documentación OpenCode - Comandos](https://opencode.ai/docs/es/commands)
- [Documentación OpenCode - Permisos](https://opencode.ai/docs/es/permissions)
- [Documentación OpenCode - Compartir](https://opencode.ai/docs/es/share)
- [Documentación GitHub Actions](https://docs.github.com/es/actions)
- [Documentación Husky](https://typicode.github.io/husky/)