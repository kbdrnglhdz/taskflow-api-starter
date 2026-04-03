# Manual del Participante - Sesión 1: Gobernanza y Configuración

## 📋 Descripción de la sesión

Esta sesión establece las bases para trabajar con OpenCode de manera efectiva en equipo. Aprenderás a configurar el entorno, establecer reglas de gobernanza y definir permisos que controlan cómo los agentes de IA interactúan con tu código.

**Objetivo:** Establecer las reglas de IA y permisos básicos para el equipo

---

## 📚 Teoría: Fundamentos de OpenCode

### ¿Qué es OpenCode?

**OpenCode** es un agente de código de IA de código abierto disponible como:
- Interfaz basada en terminal (TUI)
- Aplicación de escritorio
- Extensión de IDE

Permite usar cualquier proveedor de LLM configurando sus claves de API. Para nuevos usuarios, se recomienda **OpenCode Zen**, que es una selección de modelos probados y verificados por el equipo de OpenCode.

> **Referencia:** [Documentación OpenCode - Introducción](https://opencode.ai/docs/es)

### Instalación de OpenCode

OpenCode puede instalarse de varias formas:

```bash
# Método más sencillo (macOS/Linux)
curl -fsSL https://opencode.ai/install | bash

# Con npm
npm install -g opencode-ai

# Con Homebrew (macOS)
brew install anomalyco/tap/opencode

# Con pnpm
pnpm install -g opencode-ai

# Con Bun
bun install -g opencode-ai
```

#### Requisitos previos

1. **Emulador de terminal moderno:**
   - [WezTerm](https://wezterm.org) - multiplataforma
   - [Alacritty](https://alacritty.org) - multiplataforma
   - [Ghostty](https://ghostty.org) - Linux y macOS
   - [Kitty](https://sw.kovidgoyal.net/kitty/) - Linux y macOS

2. **Claves de API** de los proveedores de LLM que quieras usar

> **Referencia:** [Documentación - Instalación](https://opencode.ai/docs/es#instalar)

### Configuración de API Key

```bash
# Usando el comando interactivo
/opencode connect

# O configurando manualmente
opencode config set api_key TU_API_KEY
```

> **Referencia:** [Documentación - Proveedores](https://opencode.ai/docs/es/providers)

---

## 📚 Teoría: El archivo AGENTS.md

### ¿Qué es AGENTS.md?

`AGENTS.md` es un **archivo especial** que define las convenciones y restricciones que todos los agentes de OpenCode deben seguir al generar o modificar código en el proyecto.

### ¿Por qué es importante?

1. **OpenCode analiza este archivo** para entender la estructura del proyecto
2. **Define patrones de código** que se usan en el proyecto
3. **Establece reglas específicas del equipo** que los agentes deben respetar
4. **Se recomienda versionar este archivo en Git** para que todo el equipo siga las mismas reglas

### El comando /init

```bash
opencode init
```

Este comando analiza el proyecto y crea un archivo AGENTS.md con la estructura del proyecto. Puedes personalizarlo según las necesidades de tu equipo.

> **Referencia:** [Documentación - Introducción](https://opencode.ai/docs/es#inicializar)

### Estructura de AGENTS.md

El archivo AGENTS.md puede contener:

```markdown
# AGENTS.md - Reglas del equipo para agentes de IA

Este archivo define las convenciones y restricciones...

## Reglas obligatorias

- Usar **TypeScript estricto** (modo `strict: true`)
- Las nuevas rutas de API deben incluir **tests de integración**
- Toda entrada de usuario debe ser **validada con Zod**
- Los commits deben seguir **Conventional Commits**
- Los nombres de archivo deben ser **kebab-case**
- Los mensajes de error deben tener formato consistente

## Opcional pero recomendado

- Documentar endpoints con OpenAPI
- Mantener cobertura de tests > 80%

## Permisos por defecto

- `edit: "ask"` (preguntar antes de editar)
- `bash: "deny"` (no ejecutar comandos sin permiso)
```

---

## 📚 Teoría: opencode.json

### ¿Qué es opencode.json?

Es el **archivo de configuración principal** de OpenCode. Permite configurar permisos, agentes personalizados, skills, commands, modelos y herramientas.

### Ubicaciones de configuración

OpenCode busca configuración en varios lugares (en orden de precedencia):

1. **Remota** (`.well-known/opencode`): valores predeterminados de la organización
2. **Global** (`~/.config/opencode/opencode.json`): preferencias del usuario
3. **Personalizada** (`OPENCODE_CONFIG` env var): anulaciones personalizadas
4. **Por proyecto** (`opencode.json` en el proyecto): configuración específica
5. **Directorio `.opencode`**: agentes, comandos, plugins
6. **En línea** (`OPENCODE_CONFIG_CONTENT` env var): anulaciones del tiempo de ejecución

> **Nota:** Los archivos de configuración se **fusionan**, no se reemplazan. Las configuraciones posteriores anulan las anteriores solo para claves en conflicto.

> **Referencia:** [Documentación - Configuración](https://opencode.ai/docs/es/config)

### Esquema de configuración

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": {
    "edit": "ask",
    "bash": "deny",
    "read": "allow"
  },
  "model": "anthropic/claude-sonnet-4-5",
  "theme": "opencode",
  "autoupdate": true
}
```

> **Referencia:** [Documentación - Esquema](https://opencode.ai/docs/es/config#esquema)

---

## 📚 Teoría: Permisos en OpenCode

### ¿Qué son los permisos?

Los permisos controlan **qué acciones puede realizar un agente** de IA. OpenCode usa la configuración `permission` para decidir si una acción debe ejecutarse automáticamente, solicitar aprobación o bloquearse.

### Valores de permisos

| Valor | Comportamiento |
|-------|----------------|
| `"allow"` | Ejecutar sin aprobación |
| `"ask"` | Solicitar aprobación antes de ejecutar |
| `"deny"` | Bloquea la acción completamente |

### Permisos disponibles

- `read` — leer un archivo
- `edit` — todas las modificaciones de archivos (cubre `edit`, `write`, `patch`, `multiedit`)
- `glob` — globbing de archivos
- `grep` — búsqueda de contenido
- `list` — enumerar archivos en un directorio
- `bash` — ejecutar comandos de shell
- `task` — lanzamiento de subagentes
- `skill` — cargar una habilidad
- `webfetch` — obtener una URL
- `websearch` — búsqueda web
- `external_directory` — acceder a rutas fuera del directorio de trabajo

### Valores predeterminados

Si no especificas nada, OpenCode comienza desde valores predeterminados permisivos:

- La mayoría de los permisos están predeterminados en `"allow"`
- `external_directory` por defecto es `"ask"`
- `read` es `"allow"`, pero los archivos `.env` están denegados por defecto

```json
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"
    }
  }
}
```

### Reglas granulares

Puedes usar **comodines** para patrones más específicos:

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny"
    }
  }
}
```

**Comodines disponibles:**
- `*` — coincide con cero o más de cualquier carácter
- `?` — coincide exactamente con un carácter

> **Referencia:** [Documentación - Permisos](https://opencode.ai/docs/es/permissions)

---

## 📚 Teoría: El modelo de agente

### Agentes integrados

OpenCode viene con dos agentes principales integrados:

1. **Build** (predeterminado): Agente principal con todas las herramientas habilitadas para trabajo de desarrollo completo
2. **Plan**: Agente restringido para planificación y análisis. Por defecto, `edit` y `bash` están en `ask`

También hay subagentes:
- **General**: Uso general para tareas de varios pasos
- **Explore**: Solo lectura para explorar bases de código

### Cambiar entre agentes

- Usa la tecla **Tab** para cambiar entre agentes principales durante una sesión
- Usa la tecla **@** para mencionar subagentes en tus mensajes

> **Referencia:** [Documentación - Agentes](https://opencode.ai/docs/es/agents)

---

## 🛠️ Práctica: Ejercicios de la sesión

### Ejercicio 1: Instalar OpenCode

```bash
# Verificar instalación
opencode --version

# Si no está instalado
curl -fsSL https://opencode.ai/install | bash
```

### Ejercicio 2: Configurar API Key

```bash
# Conectar con OpenCode Zen (recomendado)
/connect

# O configurar manualmente
opencode config set api_key TU_API_KEY
```

### Ejercicio 3: Inicializar un proyecto

```bash
cd tu-proyecto
opencode init
```

### Ejercicio 4: Crear AGENTS.md

Crea un archivo `AGENTS.md` en la raíz de tu proyecto con las reglas de tu equipo:

```markdown
# AGENTS.md - Reglas del equipo para agentes de IA

[Tu contenido aquí]
```

### Ejercicio 5: Configurar opencode.json

Crea un archivo `opencode.json` con los permisos deseados:

```json
{
  "permissions": {
    "edit": "ask",
    "bash": "deny",
    "read": "allow"
  }
}
```

### Ejercicio 6: Verificar configuración

```bash
opencode ask "¿Qué estructura tiene el proyecto? ¿Cumple las reglas de AGENTS.md?"
```

---

## 📋 Checklist de la sesión

- [ ] OpenCode instalado correctamente
- [ ] API Key configurada
- [ ] Proyecto inicializado con `opencode init`
- [ ] AGENTS.md creado con reglas del equipo
- [ ] opencode.json configurado con permisos
- [ ] Verificación completada
- [ ] Commit realizado con Conventional Commits

---

## 📖 Referencias

- [Introducción a OpenCode](https://opencode.ai/docs/es)
- [Configuración](https://opencode.ai/docs/es/config)
- [Permisos](https://opencode.ai/docs/es/permissions)
- [Agentes](https://opencode.ai/docs/es/agents)
- [Proveedores](https://opencode.ai/docs/es/providers)