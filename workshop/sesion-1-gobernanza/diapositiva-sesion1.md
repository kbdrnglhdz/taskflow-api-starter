# Sesión 1 – Gobernanza y configuración

**Objetivo:** Establecer las reglas de IA y permisos básicos para el equipo.

---

## 📚 Fundamentos teóricos

### ¿Qué es OpenCode?

**OpenCode** es un agente de código de IA de código abierto. Está disponible como interfaz basada en terminal, aplicación de escritorio o extensión IDE.

![OpenCode TUI](https://opencode.ai/docs/_astro/screenshot.CQjBbRyJ_1dLadc.webp)

OpenCode permite usar cualquier proveedor de LLM configurando sus claves de API. Para nuevos usuarios, se recomienda **OpenCode Zen**, que es una selección de modelos probados y verificados.

#### Instalación

```bash
# En macOS/Linux
curl -fsSL https://opencode.ai/install | bash

# Con npm
npm install -g opencode-ai

# Con Homebrew (macOS)
brew install anomalyco/tap/opencode
```

#### Requisitos previos

1. Un emulador de terminal moderno:
   - WezTerm (multiplataforma)
   - Alacritty (multiplataforma)
   - Ghostty (Linux y macOS)
   - Kitty (Linux y macOS)
2. Claves de API de los proveedores de LLM

#### Configuración de API

```bash
# Conectar con OpenCode Zen
/opencode connect

# O configurar manualmente
opencode config set api_key TU_API_KEY
```

Más información: [Documentación OpenCode - Introducción](https://opencode.ai/docs/es)

---

### AGENTS.md

`AGENTS.md` es un archivo especial que define las convenciones y restricciones que todos los agentes de Opencode deben seguir al generar o modificar código en el proyecto.

**¿Por qué es importante?**
- OpenCode analiza este archivo para entender la estructura del proyecto
- Define patrones de código que se usan en el proyecto
- Establece reglas específicas del equipo
- Se recomienda versionar este archivo en Git

#### El comando /init

```bash
opencode init
```

Este comando analiza el proyecto y crea un archivo AGENTS.md con la estructura del proyecto.

Más información: [Documentación OpenCode - Introducción](https://opencode.ai/docs/es)

---

### opencode.json

Archivo de configuración principal de OpenCode que permite:

- Configurar **permisos** por defecto (edit, bash, read)
- Definir **agentes** personalizados
- Especificar rutas para **skills** y **commands**
- Configurar **modelos** y **herramientas**

#### Esquema de configuración

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": {
    "edit": "ask",
    "bash": "deny",
    "read": "allow"
  },
  "agents": {
    "default": "AGENTS.md"
  },
  "skills": {
    "path": ".opencode/skills"
  },
  "commands": {
    "path": ".opencode/commands"
  }
}
```

#### Permisos

Los permisos controlan qué acciones puede realizar un agente:

| Permiso | Descripción |
|---------|-------------|
| `edit` | Editar archivos |
| `bash` | Ejecutar comandos |
| `read` | Leer archivos |
| `webfetch` | Hacer requests HTTP |

Valores posibles:
- `"ask"`: Solicitar aprobación antes de ejecutar
- `"allow"`: Permitir sin aprobación
- `"deny"`: Desactivar la herramienta

Más información: [Documentación OpenCode - Permisos](https://opencode.ai/docs/es/permissions)

---

### Resumen de la sesión 1

En esta sesión aprenderás a:
1. Instalar OpenCode en tu máquina
2. Configurar tu API key
3. Inicializar un proyecto con OpenCode
4. Crear AGENTS.md con las reglas del equipo
5. Configurar opencode.json con los permisos por defecto
6. Verificar que el agente sigue las reglas

---

## 1.1 Objetivo de la sesión

- Configurar el entorno de Opencode
- Crear las reglas de gobernanza del proyecto
- Definir permisos por defecto para los agentes

---

## 1.2 Clonar e instalar (5 min)

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

---

## 1.3 Inicializar Opencode (5 min)

```bash
opencode init
```

Este comando crea archivos por defecto que **serán reemplazados** con la configuración personalizada.

---

## 1.4 Crear AGENTS.md (10 min)

Crea el archivo `AGENTS.md` en la raíz del proyecto.

Este archivo define las convenciones y restricciones que todos los agentes de Opencode deben seguir.

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

---

## 1.5 Crear opencode.json (5 min)

Crea `opencode.json` en la raíz del proyecto.

```json
{
  "permissions": {
    "edit": "ask",
    "bash": "deny",
    "read": "allow"
  }
}
```

---

## 1.6 Verificar la configuración (10 min)

```bash
# Preguntar al agente sobre el estado actual
opencode ask "¿Qué estructura tiene el proyecto? ¿Cumple las reglas de AGENTS.md?"
```

**Respuesta esperada:** El agente debe identificar violaciones como:
- Uso de `any`
- Validación manual con `if`
- Nombres de archivo inconsistentes

---

## 1.7 Commit y crear PR (10 min)

```bash
git add AGENTS.md opencode.json
git commit -m "docs: añadir gobernanza inicial con AGENTS.md y opencode.json"
git checkout -b sesion1-gobernanza
git push origin sesion1-gobernanza
# Crear PR en GitHub
```

---

## ✅ Éxito de la sesión

El equipo revisa y aprueba el PR. El repositorio ahora tiene reglas de IA que los agentes deben seguir.

---

## Archivos de esta sesión

```
workshop/sesion-1-gobernanza/
├── AGENTS.md        # Reglas del equipo
└── opencode.json    # Configuración de Opencode
```