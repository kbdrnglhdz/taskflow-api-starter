Te voy a generar el **paso a paso completo para cada sesión**, integrando el proyecto base y todos los archivos de agentes, skills y commands. Cada sesión incluye: objetivos, preparación previa, comandos exactos, archivos a crear (con contenido listo para copiar), y verificación de éxito.

---

# 📘 Taller Opencode: Paso a paso por sesión

## Estructura del repositorio final (lo que construirán)

```
taskflow-api-starter/              # Clonado al inicio
├── AGENTS.md                      # Sesión 1
├── opencode.json                  # Sesión 1
├── .opencode/
│   ├── agents/
│   │   └── taskflow-reviewer.md   # Sesión 2
│   ├── skills/
│   │   ├── changelog-generator/
│   │   │   └── SKILL.md           # Sesión 2
│   │   └── lint/
│   │       └── SKILL.md           # Sesión 3
│   └── commands/
│       └── review-pr.md           # Sesión 3
├── .github/workflows/
│   ├── ci.yml                     # Ya existe (base)
│   └── opencode-review.yml        # Sesión 3
├── .husky/
│   └── pre-commit                 # Sesión 3
├── RETROSPECTIVA.md               # Sesión 5
└── ROADMAP-OPECODE.md             # Sesión 5
```

---

# Sesión 1 – Gobernanza y configuración

**Duración:** 45 minutos  
**Objetivo:** Establecer las reglas de IA y permisos básicos.

## Paso 1.1: Clonar e instalar (5 min)

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/taskflow-api-starter
cd taskflow-api-starter

# Instalar dependencias
npm install --prefix backend
npm install --prefix frontend

# Instalar Opencode (si no está)
curl -fsSL https://opencode.ai/install | bash

# Configurar API key
opencode config set api_key $TU_API_KEY
```

## Paso 1.2: Inicializar Opencode (5 min)

```bash
opencode init
```

Este comando crea archivos por defecto. **Los reemplazaremos** con los siguientes.

## Paso 1.3: Crear AGENTS.md (10 min)

Crea el archivo `AGENTS.md` en la raíz:

```markdown
# AGENTS.md - Reglas del equipo para agentes de IA

Este archivo define las convenciones y restricciones que todos los agentes de Opencode deben seguir al generar o modificar código en este repositorio.

## Reglas obligatorias

- Usar **TypeScript estricto** (modo `strict: true` en tsconfig). No usar `any` explícito ni implícito.
- Las nuevas rutas de API deben incluir **tests de integración** con Supertest que cubran al menos los casos felices y errores de validación.
- Toda entrada de usuario (body, query, params) debe ser **validada con Zod** antes de llegar al controlador. No se aceptan validaciones manuales con `if`.
- Los commits deben seguir **Conventional Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
- Los nombres de archivo deben ser **kebab-case** (ej. `task-controller.ts`, no `taskController.ts` ni `comment-controller.js`).
- Los mensajes de error de la API deben tener formato consistente: `{ "error": "descripción" }` con el código HTTP adecuado (4xx para errores de cliente, 5xx para servidor).

## Opcional pero recomendado

- Documentar los endpoints con OpenAPI (swagger-jsdoc) cuando se añadan o modifiquen.
- Mantener cobertura de tests > 80% para código nuevo.

## Permisos por defecto para agentes

Si no se especifica lo contrario en el agente, los permisos son:
- `edit: "ask"`   (preguntar antes de editar archivos)
- `bash: "deny"`  (no ejecutar comandos sin permiso explícito)
```

## Paso 1.4: Crear opencode.json (5 min)

Crea `opencode.json` en la raíz:

```json
{
  "permissions": {
    "edit": "ask",
    "bash": "deny",
    "read": "allow"
  }
}
```

## Paso 1.5: Verificar (10 min)

```bash
# Preguntar al agente sobre el estado actual
opencode ask "¿Qué estructura tiene el proyecto? ¿Cumple las reglas de AGENTS.md?"
```

**Respuesta esperada:** El agente debe identificar violaciones (uso de `any`, validación manual, nombres inconsistentes).

## Paso 1.6: Commit y PR (10 min)

```bash
git add AGENTS.md opencode.json
git commit -m "docs: añadir gobernanza inicial con AGENTS.md y opencode.json"
git checkout -b sesion1-gobernanza
git push origin sesion1-gobernanza
# Crear PR en GitHub
```

**✅ Éxito:** El equipo revisa y aprueba el PR. El repositorio ahora tiene reglas de IA.

---

# Sesión 2 – Agentes y skills personalizados

**Duración:** 60 minutos  
**Objetivo:** Crear un agente revisor y un skill generador de changelog.

## Paso 2.1: Crear estructura de carpetas (2 min)

```bash
mkdir -p .opencode/agents
mkdir -p .opencode/skills/changelog-generator
```

## Paso 2.2: Crear agente taskflow-reviewer (15 min)

Crea `.opencode/agents/taskflow-reviewer.md`:

```markdown
---
name: taskflow-reviewer
description: Revisor senior de código para TaskFlow. Se enfoca en validación Zod, manejo de errores, cobertura de tests y cumplimiento de AGENTS.md.
permissions:
  edit: deny
  bash: ask
  read: allow
---

Eres un revisor de código experto en Node.js/TypeScript y buenas prácticas para APIs REST.

Tu tarea es revisar los archivos que se te indiquen (o el último cambio) y generar un reporte en el siguiente formato:

## Hallazgos

### ❌ Violaciones críticas
- Lista de problemas que rompen las reglas de AGENTS.md (uso de `any`, falta de validación Zod, nombres incorrectos, errores inconsistentes).

### ⚠️ Advertencias
- Código que funciona pero es frágil (ej. promesas sin catch, falta de tipado en `req.user`).

### ✅ Buenas prácticas observadas
- Cosas que se hacen correctamente.

### 🧪 Tests
- ¿Hay tests de integración? ¿Cubren los nuevos cambios? Si falta alguno, sugiere un nombre de archivo y casos a probar.

### 🔧 Sugerencias de refactor
- Propuesta concreta de mejora (ej. extraer lógica a un servicio, usar Zod schema).

Reglas específicas:
- No sugieras cambios de formato o estilo que no estén en AGENTS.md.
- Para cada hallazgo, cita la línea exacta o el bloque de código.
- Si ejecutas `npm test` (con permiso `bash: ask`), puedes incluir la salida de la cobertura.

Sé constructivo y profesional.
```

## Paso 2.3: Probar el agente (10 min)

```bash
# Revisar un archivo problemático
opencode run --agent taskflow-reviewer --files backend/src/controllers/taskController.ts
```

**Resultado esperado:** El agente debe detectar `any`, validación manual, errores inconsistentes.

## Paso 2.4: Crear skill changelog-generator (20 min)

Crea `.opencode/skills/changelog-generator/SKILL.md`:

```markdown
---
name: changelog-generator
description: Genera o actualiza CHANGELOG.md basado en los commits Conventional Commits desde el último tag.
---

# Changelog Generator Skill

Este skill analiza el historial de Git desde el tag más reciente (o desde el primer commit si no hay tags) y genera un archivo `CHANGELOG.md` siguiendo el formato [Keep a Changelog](https://keepachangelog.com/).

## Instrucciones para el agente

1. Obtén la lista de commits desde el último tag:
   ```bash
   git describe --tags --abbrev=0  # último tag
   git log <last_tag>..HEAD --oneline --pretty=format:"%s"
   ```
   Si no hay tags, usa `git log --oneline`.

2. Clasifica cada commit según su tipo (feat, fix, docs, style, refactor, perf, test, chore, etc.) y extrae el mensaje (después del tipo y ámbito opcional).

3. Genera o actualiza `CHANGELOG.md` en la raíz. El formato debe ser:

```markdown
# Changelog

## [No publicado] - Fecha actual

### Añadido
- feat: descripción del commit (autor @username)

### Corregido
- fix: descripción

### Cambiado
- refactor: descripción

### Eliminado
- ...

### Documentación
- docs: ...

### Pruebas
- test: ...

### Mantenimiento
- chore: ...
```

4. Si el archivo ya existe, fusiona los nuevos cambios al principio (sección `[No publicado]`). No elimines secciones anteriores.

5. Escribe el archivo con codificación UTF-8.

## Ejemplo de uso

Usuario: "Usa el skill changelog-generator para crear el changelog inicial"

Agente: Ejecuta los comandos, genera el archivo y responde "CHANGELOG.md generado con X commits."
```

## Paso 2.5: Probar el skill (8 min)

```bash
# Ejecutar el skill manualmente
opencode skill changelog-generator
```

**Resultado esperado:** Se crea `CHANGELOG.md` en la raíz.

## Paso 2.6: Commit (5 min)

```bash
git add .opencode/
git add CHANGELOG.md
git commit -m "feat: añadir agente taskflow-reviewer y skill changelog-generator"
git push origin main
```

**✅ Éxito:** El agente puede revisar código y el skill genera changelogs automáticos.

---

# Sesión 3 – Integración con flujos existentes

**Duración:** 60 minutos  
**Objetivo:** Conectar Opencode con CI, PRs y hooks locales.

## Paso 3.1: Crear comando /review-pr (10 min)

Crea `.opencode/commands/review-pr.md`:

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

## Paso 3.2: Probar el comando (5 min)

```bash
# Hacer un cambio pequeño
echo "// cambio de prueba" >> backend/src/index.ts

# Ejecutar el comando
opencode run --command review-pr
```

## Paso 3.3: Crear workflow de GitHub Actions (20 min)

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
      - name: Run Opencode review
        if: steps.changed-files.outputs.files != ''
        env:
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
        run: |
          opencode run --agent taskflow-reviewer "Revisa los archivos modificados y genera un reporte" -f ${{ steps.changed-files.outputs.files }} > review.txt
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

## Paso 3.4: Configurar secreto en GitHub (5 min)

```bash
# Instrucciones para cada participante:
# 1. Ir a GitHub → Repositorio → Settings → Secrets and variables → Actions
# 2. Añadir secreto: OPENCODE_API_KEY = valor de su API key
```

## Paso 3.5: Crear skill lint y hook pre-commit (15 min)

Primero, crear el skill: `.opencode/skills/lint/SKILL.md`

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

Luego, instalar husky y configurar el hook:

```bash
# Instalar husky
npm install --save-dev husky
npx husky install

# Añadir pre-commit hook
npx husky add .husky/pre-commit "opencode skill lint"

# Hacer ejecutable el hook
chmod +x .husky/pre-commit
```

## Paso 3.6: Verificar el hook (5 min)

```bash
# Hacer un cambio con mala sintaxis
echo "const   x   =   1" >> backend/src/index.ts
git add backend/src/index.ts

# Intentar commit (debe fallar o corregir)
git commit -m "test: probar hook"
```

**✅ Éxito:** El hook ejecuta lint automáticamente.

## Paso 3.7: Commit y PR (5 min)

```bash
git add .opencode/commands/ .github/workflows/opencode-review.yml .husky/ .opencode/skills/lint/
git commit -m "ci: integrar Opencode con PR review y pre-commit hook"
git push origin main
```

---

# Sesión 4 – Casos de uso reales

**Duración:** 90 minutos  
**Objetivo:** Resolver problemas reales del código usando agentes/skills personalizados.

Los participantes eligen **2 o 3** de estos casos. Cada caso requiere crear un nuevo agente/skill.

## Caso A: Refactorizar controlador a servicios

**Problema:** `taskController.ts` tiene lógica anidada y difícil de testear.

**Solución:** Crear agente `refactor-assistant`

Crea `.opencode/agents/refactor-assistant.md`:

```markdown
---
name: refactor-assistant
description: Especialista en extraer lógica de controladores a servicios y reducir la complejidad ciclomática.
permissions:
  edit: ask
  bash: deny
  read: allow
---

Eres un asistente de refactorización para Express + TypeScript.

Dado un controlador que contiene lógica anidada o difícil de testear, debes:

1. Identificar las responsabilidades que no pertenecen al controlador (validación, acceso a base de datos, lógica de negocio).
2. Crear un nuevo archivo de servicio en `backend/src/services/` con nombre descriptivo (ej. `task-service.ts`).
3. Mover la lógica al servicio, manteniendo el controlador solo para orquestar request/response.
4. Actualizar las importaciones y los tests existentes (si los hay).
5. Asegurar que el nuevo servicio esté tipado correctamente (sin `any`).

Sigue las reglas de AGENTS.md. Antes de editar, muestra un plan de acción y espera confirmación.
```

**Ejecución:**
```bash
opencode run --agent refactor-assistant --files backend/src/controllers/taskController.ts
```

---

## Caso B: Generar documentación OpenAPI

**Problema:** No hay documentación de la API.

**Solución:** Skill `generate-openapi`

Crea `.opencode/skills/generate-openapi/SKILL.md`:

```markdown
---
name: generate-openapi
description: Analiza las rutas de Express y genera un archivo openapi.yaml (versión 3.0.0).
---

# OpenAPI Generator Skill

Este skill inspecciona el código fuente de las rutas y controladores para producir una especificación OpenAPI.

## Instrucciones

1. Recorre recursivamente `backend/src/routes` y `backend/src/controllers`.
2. Para cada ruta (`app.get`, `app.post`, etc.) extrae:
   - Método HTTP
   - Path (ej. `/tasks/:id`)
   - Parámetros de path, query (si se detecta `req.params` o `req.query`)
   - Body (si hay `req.body`, asumir `application/json`)
   - Códigos de respuesta comunes (200, 201, 400, 404, 500)
3. Genera un objeto OpenAPI con las secciones: `paths`, `components/schemas` (para Task y Comment).
4. Escribe el archivo `openapi.yaml` en la raíz del proyecto.
5. Si existe, sugiere mejoras manuales (descripciones, ejemplos).

El resultado debe ser válido según [Swagger Editor](https://editor.swagger.io/).
```

**Ejecución:**
```bash
opencode skill generate-openapi
```

---

## Caso C: Eliminar `any` del código

**Problema:** Hay múltiples usos de `any` en el backend.

**Solución:** Skill `remove-any`

Crea `.opencode/skills/remove-any/SKILL.md`:

```markdown
---
name: remove-any
description: Encuentra y reemplaza usos de `any` por tipos concretos en archivos TypeScript.
---

# Skill Remove-Any

Analiza archivos `.ts` y `.tsx` en busca de `any` (explícito o implícito como `error: any`) y sugiere el tipo correcto basado en el contexto.

## Instrucciones

1. Para cada archivo dado (o todo el proyecto si no se especifica), busca:
   - Parámetros de función tipados como `any`
   - Variables con tipo `any`
   - `as any`
   - Bloque `catch (error: any)`

2. Intenta inferir el tipo real:
   - Si es `req.user`, asumir `{ id: number; email: string }` (definir interfaz User).
   - Si es `error` en catch, usar `unknown` y luego hacer type guards.
   - Si es un array sin tipo, añadir `unknown[]` o una interfaz.

3. Para cada caso, propone un cambio con el tipo correcto y muestra la línea original.

4. Opcionalmente, puede aplicar los cambios si el usuario lo confirma (usando `edit: ask`).

5. Genera un informe de cuántos `any` quedan después de los cambios sugeridos.
```

**Ejecución:**
```bash
opencode skill remove-any --files backend/src/
```

---

## Caso D: Generar tests faltantes

**Problema:** Cobertura de pruebas < 50%.

**Solución:** Skill `generate-tests`

Crea `.opencode/skills/generate-tests/SKILL.md`:

```markdown
---
name: generate-tests
description: Genera pruebas faltantes con Jest y Supertest para rutas de Express que tengan cobertura < 80%.
---

# Test Generator Skill

Evalúa la cobertura actual (si existe) o analiza los controladores para crear tests de integración.

## Instrucciones

1. Identifica los archivos de ruta en `backend/src/routes`.
2. Para cada endpoint sin test correspondiente en `backend/tests/integration/`, genera un archivo `*.test.ts` con:
   - Setup de `supertest(app)`
   - Test de caso feliz (status 200/201)
   - Test de validación (datos incorrectos → 400)
   - Test de recurso no encontrado (si aplica → 404)
   - Test de error interno (simulando fallo en servicio)
3. Usa la estructura típica de Jest: `describe`, `it`, `expect`.
4. No borres tests existentes, solo añade los faltantes.
5. Si el proyecto ya tiene `jest.config.js`, respeta su configuración.

Ejemplo de test generado:

```typescript
import request from 'supertest';
import app from '../../src/index';

describe('POST /tasks', () => {
  it('should create a task with valid data', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test task' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
```
```

**Ejecución:**
```bash
opencode skill generate-tests --focus backend/src/controllers/commentController.ts
```

---

## Entregable de la Sesión 4

```bash
# Cada grupo hace commit de sus mejoras
git add .
git commit -m "feat: refactor taskController a servicios + tests"
git push origin main
# Crear PR con los cambios generados por IA + ajustes manuales
```

**✅ Éxito:** 2-3 PRs con mejoras sustanciales usando agentes/skills.

---

# Sesión 5 – Métricas, retrospectiva y roadmap

**Duración:** 45 minutos  
**Objetivo:** Medir impacto y planificar siguiente evolución.

## Paso 5.1: Medir impacto (15 min)

Ejecutar estos comandos y anotar resultados:

```bash
# 1. Contar any antes/después
echo "Antes (sesión 1):"
git checkout sesion1-gobernanza
grep -r "any" backend/src --include="*.ts" | wc -l

echo "Después (ahora):"
git checkout main
grep -r "any" backend/src --include="*.ts" | wc -l

# 2. Cobertura de pruebas
cd backend
npm test -- --coverage
# Anotar % de statements

# 3. Funciones largas (>20 líneas)
find backend/src -name "*.ts" -exec awk 'NF && /function/ {line=NR; start=1} NR==line+20 {print FILENAME":"line}' {} \;

# 4. Tiempo de revisión de PRs (si hay historial)
gh pr list --state merged --json createdAt,reviewDecision --limit 10
```

## Paso 5.2: Crear RETROSPECTIVA.md (15 min)

Crea `RETROSPECTIVA.md` en la raíz:

```markdown
# Retrospectiva del taller Opencode

## Métricas de impacto

| Indicador | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| Número de `any` | [X] | [Y] | [Z]% |
| Cobertura de tests | [X]% | [Y]% | [Z]% |
| Funciones >20 líneas | [X] | [Y] | [Z]% |
| Tiempo revisión PRs | [X]h | [Y]h | [Z]% |

## ¿Qué agentes/skills resultaron más útiles?

- taskflow-reviewer: [opinión del equipo]
- changelog-generator: [opinión]
- [otros]

## Dificultades encontradas

- Permisos: [ej. el agente no podía ejecutar npm test por deny]
- Prompts: [ej. el agente ignoraba la regla de Zod]
- Alucinaciones: [ej. inventó funciones que no existen]

## Recomendaciones para el equipo

1. [Ej: Revisar manualmente los cambios del agente antes de commitear]
2. [Ej: Añadir más ejemplos en AGENTS.md]
3. [Ej: Usar opciones de permisos más granulares]

## Conclusión

[Párrafo resumen: ¿valió la pena? ¿Seguiremos usando Opencode?]
```

## Paso 5.3: Crear ROADMAP-OPECODE.md (10 min)

Crea `ROADMAP-OPECODE.md`:

```markdown
# Roadmap de Opencode para los próximos sprints

## Sprint 6 (siguiente)
- [ ] Automatizar generación de documentación OpenAPI con skill `generate-openapi`
- [ ] Agente de seguridad: detectar SQL injection y XSS
- [ ] Integrar con Slack: notificar cuando un PR pasa la revisión automática

## Sprint 7
- [ ] Migrar de SQLite a PostgreSQL usando agente `db-migrator`
- [ ] Skill para generar migraciones de base de datos
- [ ] Agente de rendimiento: detectar N+1 queries

## Sprint 8
- [ ] Dashboard de métricas de IA (cuántas revisiones, tiempo ahorrado)
- [ ] Skill para actualizar dependencias obsoletas
- [ ] Hook de pre-push que ejecuta el agente `taskflow-reviewer`

## Cómo priorizar
- Cada sprint: 1 agente + 1 skill + 1 integración
- Revisar RETROSPECTIVA.md para ajustar
```

## Paso 5.4: Demo final (5 minutos por grupo)

Cada grupo demuestra:
1. Un cambio real (ej. añadir un endpoint nuevo)
2. El flujo completo: commit → hook lint → PR → revisión automática → merge
3. Mostrar el changelog generado automáticamente

## Paso 5.5: Commit final (2 min)

```bash
git add RETROSPECTIVA.md ROADMAP-OPECODE.md
git commit -m "docs: añadir retrospectiva y roadmap del taller"
git push origin main
```

**✅ Éxito:** Repositorio completamente instrumentado, métricas documentadas, roadmap definido.

---

# 🎯 Checklist de éxito por sesión

| Sesión | Entregable | ¿Listo? |
|--------|------------|---------|
| 1 | PR con AGENTS.md y opencode.json aprobado | ☐ |
| 2 | Carpeta .opencode/ con agente y skill funcionando | ☐ |
| 3 | GitHub Actions comentando en PRs + hook pre-commit | ☐ |
| 4 | 2-3 PRs con mejoras sustanciales (refactor, tests, documentación) | ☐ |
| 5 | RETROSPECTIVA.md y ROADMAP-OPECODE.md + demo en vivo | ☐ |

---