# Sesión 2 – Agentes y Skills personalizados

**Objetivo:** Crear un agente revisor personalizado y un skill generador de changelog.

---

## 📚 Fundamentos teóricos

### ¿Qué son los Agentes en OpenCode?

Los **agentes** son asistentes de IA especializados que se pueden configurar para tareas y flujos de trabajo específicos. Permiten crear herramientas enfocadas con indicaciones, modelos y acceso a herramientas personalizados.

#### Tipos de Agentes

1. **Agentes Primarios**
   - Los asistentes principales con los que interactúas directamente
   - Se recorre usando la tecla **Tab** o la combinación `switch_agent`
   - Manejan la conversación principal
   - El acceso a las herramientas se configura mediante permisos

2. **Subagentes**
   - Asistentes especializados que los agentes principales pueden invocar
   - También puedes invocarlos manualmente **@ mencionándolos** en mensajes
   - Útiles para tareas específicas

#### Agentes integrados en OpenCode

| Agente | Modo | Descripción |
|--------|------|-------------|
| **Build** | primary | Agente principal por defecto con todas las herramientas habilitadas |
| **Plan** | primary | Agente restringido para planificación y análisis. `edit: ask`, `bash: ask` |
| **General** | subagent | Agente de uso general para tareas de varios pasos |
| **Explore** | subagent | Agente rápido y de solo lectura para explorar código |

#### Configurar Agentes

Los agentes se configuran mediante archivos de Markdown en `.opencode/agents/` o en el archivo `opencode.json`.

**Opciones de configuración:**
- `description`: Descripción breve de lo que hace el agente
- `mode`: `primary`, `subagent` o `all`
- `model`: Modelo a usar
- `temperature`: Controla la aleatoriedad (0.0-1.0)
- `tools`: Qué herramientas están disponibles
- `permissions`: Permisos (edit, bash, webfetch)

Más información: [Documentación OpenCode - Agentes](https://opencode.ai/docs/es/agents)

---

### ¿Qué son los Skills en OpenCode?

Los **skills** (habilidades) permiten a OpenCode descubrir instrucciones reutilizables de su repositorio. Los skills se cargan bajo demanda a través de la herramienta nativa `skill`.

#### Estructura de un Skill

Cada skill debe tener:
- Una carpeta con el nombre del skill
- Un archivo `SKILL.md` dentro

```
.opencode/skills/
├── git-release/
│   └── SKILL.md
└── lint/
    └── SKILL.md
```

#### Frontmatter (YAML)

```yaml
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
---
```

**Campos obligatorios:**
- `name`: Nombre del skill (1-64 caracteres, minúsculas con guiones)
- `description`: Descripción (1-1024 caracteres)

#### Ubicaciones de Skills

- **Proyecto**: `.opencode/skills/<name>/SKILL.md`
- **Global**: `~/.config/opencode/skills/<name>/SKILL.md`
- **Compatible Claude**: `.claude/skills/<name>/SKILL.md`

#### Permisos de Skills

En `opencode.json`:
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

- `allow`: Se carga inmediatamente
- `deny`: Oculto, acceso rechazado
- `ask`: Se solicita aprobación

Más información: [Documentación OpenCode - Skills](https://opencode.ai/docs/es/skills)

---

### Resumen de la sesión 2

En esta sesión aprenderás a:
1. Crear la estructura de carpetas para agentes y skills
2. Crear un agente personalizado de revisión de código
3. Probar el agente con archivos del proyecto
4. Crear un skill para generar changelogs automáticamente
5. Probar el skill y verificar su funcionamiento
6. Hacer commit de los cambios

**Usa el modo Plan para analizar sin hacer cambios:**
Presiona **Tab** para cambiar al agente Plan, que tiene permisos restringidos y no hace cambios en el código.

**Invoca subagentes con @:**
Usa `@general` o `@explore` para invocar subagentes directamente en tus mensajes.

---

## 2.1 Objetivo de la sesión

- Crear un agente especializado en revisión de código (taskflow-reviewer)
- Crear un skill para generar changelogs automáticamente (changelog-generator)
- Probar ambos componentes en el proyecto

---

## 2.2 Crear estructura de carpetas (2 min)

```bash
mkdir -p .opencode/agents
mkdir -p .opencode/skills/changelog-generator
```

---

## 2.3 Crear agente taskflow-reviewer (15 min)

Crea el archivo `.opencode/agents/taskflow-reviewer.md`.

Este agente es un revisor senior especializado en Node.js/TypeScript y buenas prácticas para APIs REST.

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

---

## 2.4 Probar el agente (10 min)

```bash
# Revisar un archivo problemático
opencode run --agent taskflow-reviewer --files backend/src/controllers/taskController.ts
```

**Resultado esperado:** El agente debe detectar:
- Uso de `any`
- Validación manual
- Errores inconsistentes
- Falta de tests de integración

---

## 2.5 Crear skill changelog-generator (20 min)

Crea el archivo `.opencode/skills/changelog-generator/SKILL.md`.

Este skill analiza el historial de Git y genera un archivo CHANGELOG.md siguiendo el formato Keep a Changelog.

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

---

## 2.6 Probar el skill (8 min)

```bash
# Ejecutar el skill manualmente
opencode skill changelog-generator
```

**Resultado esperado:** Se crea `CHANGELOG.md` en la raíz del proyecto.

---

## 2.7 Commit de los cambios (5 min)

```bash
git add .opencode/
git add CHANGELOG.md
git commit -m "feat: añadir agente taskflow-reviewer y skill changelog-generator"
git push origin main
```

---

## ✅ Éxito de la sesión

- El agente `taskflow-reviewer` puede revisar código y detectar violaciones
- El skill `changelog-generator` genera changelogs automáticamente
- Ambos componentes están integrados en el proyecto

---

## Archivos de esta sesión

```
workshop/sesion-2-agentes-skills/
├── diapositivas.md
└── .opencode/
    ├── agents/
    │   └── taskflow-reviewer.md
    └── skills/
        └── changelog-generator/
            └── SKILL.md
```