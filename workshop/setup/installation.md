# Guía de Instalación y Configuración

Esta guía detalla cómo configurar las herramientas necesarias para el taller de Opencode.

---

## 1. Instalar y configurar Husky

Husky es un herramienta que permite ejecutar scripts antes de eventos de Git (como commit o push).

### Instalación

```bash
# 1. Instalar husky como dependencia de desarrollo
npm install --save-dev husky

# 2. Inicializar husky (crea la configuración)
npx husky install
```

### Configurar el hook de pre-commit

```bash
# 1. Copiar el archivo de hook desde workshop/setup
cp workshop/setup/.husky/pre-commit .husky/pre-commit

# 2. Hacer ejecutable el hook
chmod +x .husky/pre-commit
```

### Verificar la configuración

```bash
# Verificar que el hook existe
ls -la .husky/pre-commit

# Probar el hook con un commit de prueba
echo "// test" >> test.ts
git add test.ts
git commit -m "test: verificar hook"
```

### Solución de problemas

**Si el hook no se ejecuta:**
- Verificar que husky esté instalado: `npm list husky`
- Asegurarse de que `.husky/pre-commit` sea ejecutable: `chmod +x .husky/pre-commit`

**Para deshabilitar temporalmente el hook:**
```bash
git commit --no-verify -m "mensaje"
```

---

## 2. Configurar GitHub Actions Workflow

El workflow de GitHub Actions ejecuta automáticamente revisiones de código en cada Pull Request.

### Pasos para configurar

#### Paso 1: Copiar el workflow

```bash
# Copiar el archivo de workflow
mkdir -p .github/workflows
cp workshop/setup/.github/workflows/opencode-review.yml .github/workflows/opencode-review.yml
```

#### Paso 2: Configurar el secreto de API

1. Ir a **GitHub → Repositorio → Settings**
2. En el menú lateral, hacer clic en **Secrets and variables → Actions**
3. Hacer clic en **New repository secret**
4. Nombre: `GOOGLE_API_KEY`
5. Valor: Tu API key de Google
6. Hacer clic en **Add secret**

#### Paso 3: Verificar la configuración

```bash
# Hacer un cambio y crear un PR
git checkout -b test-pr
echo "// test" >> test.ts
git add test.ts
git commit -m "test: verificar workflow"
git push origin test-pr
```

Luego, crear un Pull Request desde GitHub y esperar a que el workflow agregue un comentario.

### Estructura del workflow

```yaml
# Este workflow:
# 1. Se ejecuta cuando se abre o actualiza un PR
# 2. Instala Node.js 20
# 3. Instala Opencode
# 4. Obtiene los archivos modificados
# 5. Ejecuta taskflow-reviewer en los archivos
# 6. Comenta el PR con la revisión
```

---

## 3. Configurar ESLint y Prettier (opcional)

Si el proyecto no tiene ESLint configurado, seguir estos pasos:

### Instalar dependencias

```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

### Inicializar ESLint

```bash
npx eslint --init
```

Responder las preguntas:
- How would you like to use ESLint? → **To check syntax and find problems**
- What type of modules does your project use? → **JavaScript modules (import/export)**
- Does your project use TypeScript? → **Yes**
- Where does your code run? → **Node**
- What format do you want your config file to be in? → **JSON**

### Configurar Prettier

Crear archivo `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Configurar package.json (scripts)

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\""
  }
}
```

---

## 4. Instalar Opencode

### Instalación

```bash
# En macOS/Linux
curl -fsSL https://opencode.ai/install | bash

# En Windows (PowerShell)
irm https://opencode.ai/install | iex
```

### Configurar API Key

```bash
opencode config set api_key TU_API_KEY
```

### Verificar la instalación

```bash
opencode --version
opencode config list
```

---

## 5. Verificación final

Después de configurar todo, ejecutar:

```bash
# 1. Verificar Husky
ls -la .husky/

# 2. Verificar GitHub Actions
ls -la .github/workflows/

# 3. Verificar Opencode
opencode --version

# 4. Probar el agente revisor
opencode run --agent taskflow-reviewer --files package.json

# 5. Probar el skill lint
opencode skill lint
```

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npx husky install` | Inicializar husky |
| `npx husky add .husky/pre-commit "comando"` | Añadir nuevo hook |
| `git commit --no-verify` | Hacer commit sin ejecutar hooks |
| `opencode skill lint` | Ejecutar lint manualmente |
| `opencode ask "pregunta"` | Hacer preguntas al agente |

---

## Recursos adicionales

- [Documentación de Husky](https://typicode.github.io/husky/)
- [Documentación de GitHub Actions](https://docs.github.com/es/actions)
- [Documentación de Opencode](https://opencode.ai/docs)