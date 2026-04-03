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