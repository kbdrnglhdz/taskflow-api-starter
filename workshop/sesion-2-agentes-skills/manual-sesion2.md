# Manual del Participante - Sesión 2: Agentes y Skills Personalizados

## 📋 Descripción de la sesión

Esta sesión te enseñará a crear agentes y skills personalizados en OpenCode. Los agentes son asistentes especializados que puedes configurar para tareas específicas, mientras que los skills son instrucciones reutilizables que los agentes pueden cargar bajo demanda.

**Objetivo:** Crear un agente revisor de código personalizado y un skill generador de changelog

---

## 📚 Teoría: Agentes en OpenCode

### ¿Qué son los Agentes?

Los **agentes** son asistentes de IA especializados que se pueden configurar para tareas y flujos de trabajo específicos. Permiten crear herramientas enfocadas con:
- Indicaciones (prompts) personalizadas
- Modelos específicos
- Acceso a herramientas configurado

> **Referencia:** [Documentación OpenCode - Agentes](https://opencode.ai/docs/es/agents)

### Tipos de Agentes

#### Agentes Primarios

Los **agentes primarios** son los asistentes principales con los que interactúas directamente:
- Se recorren usando la tecla **Tab** o la combinación `switch_agent`
- Manejan la conversación principal
- El acceso a las herramientas se configura mediante permisos

OpenCode viene con dos agentes primarios integrados:
- **Build**: Agente principal por defecto con todas las herramientas habilitadas
- **Plan**: Agente restringido para planificación y análisis

> **Consejo:** Usa el agente Plan cuando quieras analizar código sin hacer cambios.

#### Subagentes

Los **subagentes** son asistentes especializados que los agentes principales pueden invocar:
- Se invocan automáticamente según sus descripciones
- Puedes invocarlos manualmente **@ mencionándolos** en tus mensajes

OpenCode viene con dos subagentes integrados:
- **General**: Agente de uso general para tareas de varios pasos
- **Explore**: Agente rápido y de solo lectura para explorar bases de código

### Cómo usar los agentes

1. **Cambiar entre agentes principales:** Usa la tecla **Tab** durante una sesión
2. **Invocar subagentes:** Usa `@subagente` en tus mensajes
3. **Navegar entre sesiones:** Usa las teclas configuradas para moverte entre sesiones padre e hijos

> **Referencia:** [Documentación - Uso de agentes](https://opencode.ai/docs/es/agents#uso)

---

## 📚 Teoría: Crear Agentes Personalizados

### Ubicaciones

Los agentes se pueden definir en:
- **Global:** `~/.config/opencode/agents/`
- **Por proyecto:** `.opencode/agents/`

### Estructura de un agente (Markdown)

```markdown
---
name: mi-agente
description: Descripción breve de lo que hace el agente
mode: subagent
model: anthropic/claude-sonnet-4-5
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
  bash: ask
  webfetch: deny
---

Aquí va la indicación (prompt) del agente...
```

### Opciones de configuración

| Opción | Descripción |
|--------|-------------|
| `name` | Nombre del agente |
| `description` | Descripción breve (obligatoria) |
| `mode` | `primary`, `subagent` o `all` |
| `model` | Modelo a usar |
| `temperature` | Controla la aleatoriedad (0.0-1.0) |
| `tools` | Qué herramientas están disponibles |
| `permission` | Permisos (edit, bash, webfetch) |
| `hidden` | Ocultar del menú @ |
| `steps` | Pasos máximos del agente |

### Temperatura

La **temperatura** controla la aleatoriedad y creatividad de las respuestas:
- **0.0-0.2**: Respuestas muy enfocadas y deterministas (bueno para análisis)
- **0.3-0.5**: Respuestas equilibradas (bueno para desarrollo general)
- **0.6-1.0**: Respuestas más creativas (bueno para lluvia de ideas)

### Herramientas por agente

Puedes controlar qué herramientas están disponibles en cada agente:

```markdown
---
tools:
  write: true
  edit: true
  bash: true
  glob: true
  grep: true
---
```

> **Referencia:** [Documentación - Herramientas](https://opencode.ai/docs/es/tools)

### Permisos por agente

Puedes establecer permisos específicos por agente:

```markdown
---
permission:
  edit: deny
  bash: ask
  webfetch: deny
---
```

También puedes usar patrones más granulares:

```markdown
---
permission:
  bash:
    "*": ask
    "git *": allow
    "npm *": allow
---
```

> **Referencia:** [Documentación - Permisos](https://opencode.ai/docs/es/permissions)

### Crear agentes con CLI

OpenCode incluye un comando interactivo para crear agentes:

```bash
opencode agent create
```

Este comando:
1. Pregunta dónde guardar el agente (global o proyecto)
2. Descripción de lo que debe hacer el agente
3. Genera un prompt adecuado
4. Permite seleccionar las herramientas disponibles
5. Crea el archivo Markdown con la configuración

---

## 📚 Teoría: Skills en OpenCode

### ¿Qué son los Skills?

Los **skills** (habilidades) permiten a OpenCode descubrir instrucciones reutilizables de tu repositorio. Los skills se cargan bajo demanda a través de la herramienta nativa `skill`.

Los agentes ven las habilidades disponibles y pueden cargar el contenido completo cuando sea necesario.

> **Referencia:** [Documentación OpenCode - Skills](https://opencode.ai/docs/es/skills)

### Estructura de un Skill

Cada skill debe tener:
1. Una carpeta con el nombre del skill
2. Un archivo `SKILL.md` dentro

```
.opencode/skills/
├── git-release/
│   └── SKILL.md
└── lint/
    └── SKILL.md
```

### Frontmatter (YAML)

```yaml
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---
```

**Campos obligatorios:**
- `name`: Nombre del skill
  - 1-64 caracteres
  - Minúsculas con guiones simples
  - No comienza ni termina con `-`
  - No contiene `--` consecutivos
  - Debe coincidir con el nombre del directorio

**Campos opcionales:**
- `description`: Descripción (1-1024 caracteres)
- `license`: Licencia
- `compatibility`: Compatibilidad (opencode, claude, etc.)
- `metadata`: Metadatos adicionales

### Ubicaciones de Skills

OpenCode busca skills en:
- **Proyecto:** `.opencode/skills/<name>/SKILL.md`
- **Global:** `~/.config/opencode/skills/<name>/SKILL.md`
- **Compatible Claude:** `.claude/skills/<name>/SKILL.md`
- **Compatible Agentes:** `.agents/skills/<name>/SKILL.md`

### Cómo funcionan los skills

1. OpenCode descubre los skills disponibles
2. Los muestra en la descripción de la herramienta `skill`
3. El agente puede cargar un skill usando la herramienta `skill({ name: "nombre" })`
4. El contenido del SKILL.md se inyecta en el contexto

### Ejemplo de skill

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
---

## What I do
- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me
Use this when you are preparing a tagged release.
Ask clarifying questions if the target versioning scheme is unclear.
```

---

## 📚 Teoría: Permisos de Skills

### Configurar permisos

Controla qué agentes pueden acceder a los skills:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Permiso | Comportamiento |
|---------|----------------|
| `allow` | La habilidad se carga inmediatamente |
| `deny` | Habilidad oculta al agente, acceso rechazado |
| `ask` | Se solicita al usuario aprobación antes de cargar |

**Patrones:** Usa comodines como `internal-*` para coincidir con múltiples skills.

### Anulación por agente

Otorga a agentes específicos permisos diferentes:

**Para agentes personalizados:**

```markdown
---
permission:
  skill:
    "documents-*": allow
---
```

**Para agentes integrados:**

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

### Deshabilitar skills

**Para agentes personalizados:**

```markdown
---
tools:
  skill: false
---
```

**Para agentes integrados:**

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

---

## 📚 Teoría: Comandos en OpenCode

### ¿Qué son los comandos?

Los **comandos personalizados** permiten especificar un mensaje que deseas ejecutar cuando el comando se ejecuta en la TUI.

```
/mi-comando
```

Se suman a los comandos integrados como `/init`, `/undo`, `/redo`, `/share`, `/help`.

> **Referencia:** [Documentación OpenCode - Comandos](https://opencode.ai/docs/es/commands)

### Estructura de un comando

```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
```

El frontmatter define las propiedades, el contenido se convierte en la plantilla.

### Opciones de configuración

| Opción | Descripción |
|--------|-------------|
| `template` | El mensaje que se enviará al LLM |
| `description` | Descripción mostrada en TUI |
| `agent` | Qué agente debe ejecutar el comando |
| `subtask` | Forzar invocación de subagente |
| `model` | Anular el modelo predeterminado |

### Marcadores especiales

**Argumentos:**
- `$ARGUMENTS` — Todos los argumentos
- `$1`, `$2`, `$3` — Argumentos posicionales

**Salida del shell:**
- ``!`command` `` — Inyectar salida de un comando

**Referencias de archivos:**
- `@archivo` — Incluir contenido de un archivo

---

## 🛠️ Práctica: Ejercicios de la sesión

### Ejercicio 1: Crear estructura de carpetas

```bash
mkdir -p .opencode/agents
mkdir -p .opencode/skills/changelog-generator
```

### Ejercicio 2: Crear un agente personalizado

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

Tu tarea es revisar los archivos que se te indiquen y generar un reporte en el siguiente formato:

## Hallazgos

### ❌ Violaciones críticas
- Lista de problemas que rompen las reglas de AGENTS.md

### ⚠️ Advertencias
- Código que funciona pero es frágil

### ✅ Buenas prácticas observadas
- Cosas que se hacen correctamente

### 🧪 Tests
- ¿Hay tests de integración?

### 🔧 Sugerencias de refactor
- Propuesta concreta de mejora

Reglas específicas:
- No sugieras cambios de formato o estilo que no estén en AGENTS.md
- Para cada hallazgo, cita la línea exacta
- Sé constructivo y profesional
```

### Ejercicio 3: Probar el agente

```bash
opencode run --agent taskflow-reviewer --files backend/src/controllers/taskController.ts
```

### Ejercicio 4: Crear un skill

Crea `.opencode/skills/changelog-generator/SKILL.md`:

```markdown
---
name: changelog-generator
description: Genera o actualiza CHANGELOG.md basado en los commits Conventional Commits desde el último tag.
---

# Changelog Generator Skill

Este skill analiza el historial de Git desde el tag más reciente y genera un archivo CHANGELOG.md siguiendo el formato Keep a Changelog.

## Instrucciones

1. Obtén la lista de commits desde el último tag:
   - git describe --tags --abbrev=0
   - git log <last_tag>..HEAD --oneline

2. Clasifica cada commit según su tipo (feat, fix, docs, etc.)

3. Genera o actualiza CHANGELOG.md en la raíz

4. Si el archivo ya existe, fusiona los nuevos cambios al principio
```

### Ejercicio 5: Probar el skill

```bash
opencode skill changelog-generator
```

### Ejercicio 6: Commit de cambios

```bash
git add .opencode/
git add CHANGELOG.md
git commit -m "feat: añadir agente taskflow-reviewer y skill changelog-generator"
```

---

## 📋 Checklist de la sesión

- [ ] Estructura de carpetas `.opencode/` creada
- [ ] Agente `taskflow-reviewer.md` creado
- [ ] Agente probado con archivos del proyecto
- [ ] Skill `changelog-generator/SKILL.md` creado
- [ ] Skill probado y funcionando
- [ ] Commit realizado con Conventional Commits

---

## 📖 Referencias

- [Documentación OpenCode - Agentes](https://opencode.ai/docs/es/agents)
- [Documentación OpenCode - Skills](https://opencode.ai/docs/es/skills)
- [Documentación OpenCode - Comandos](https://opencode.ai/docs/es/commands)
- [Documentación OpenCode - Permisos](https://opencode.ai/docs/es/permissions)
- [Documentación OpenCode - Configuración](https://opencode.ai/docs/es/config)
- [Keep a Changelog](https://keepachangelog.com/)