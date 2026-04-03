# Setup - Archivos de configuración e instalación

Esta carpeta contiene los archivos de configuración necesarios para el taller de Opencode.

---

## Contenido

### `.github/workflows/opencode-review.yml`

Workflow de GitHub Actions que ejecuta automáticamente la revisión de código en cada Pull Request.

**Qué hace:**
1. Se ejecuta cuando se abre o actualiza un PR
2. Instala Opencode
3. Obtiene los archivos modificados
4. Ejecuta el agente `taskflow-reviewer` en los archivos cambiados
5. Deja un comentario automático en el PR con la revisión

**Cómo configurarlo:**
1. Copiar `.github/workflows/opencode-review.yml` a la raíz del proyecto
2. Ir a GitHub → Settings → Secrets and variables → Actions
3. Crear un secreto `OPENCODE_API_KEY` con tu API key

---

### `.husky/pre-commit`

Hook de pre-commit que ejecuta el skill de lint antes de cada commit.

**Cómo configurarlo:**

```bash
# 1. Instalar husky como dependencia de desarrollo
npm install --save-dev husky

# 2. Inicializar husky
npx husky install

# 3. Copiar el hook
cp workshop/setup/.husky/pre-commit .husky/pre-commit

# 4. Hacer ejecutable el hook
chmod +x .husky/pre-commit
```

**Qué hace:**
- Antes de cada commit, ejecuta `opencode skill lint`
- Aplica ESLint y Prettier a los archivos modificados
- Si hay errores, el commit se cancela

---

## Archivos en esta carpeta

```
workshop/setup/
├── .github/
│   └── workflows/
│       └── opencode-review.yml    # GitHub Actions workflow
├── .husky/
│   └── pre-commit                  # Hook de pre-commit
└── README.md                       # Este archivo
```

---

## Notas

- Los archivos en esta carpeta son **comunes** a varias sesiones
- El workflow se usa en la **Sesión 3** (Integración con flujos existentes)
- El hook de pre-commit se usa en la **Sesión 3** (skill lint)
- Ambos archivos deben copiarse a la raíz del proyecto durante el taller