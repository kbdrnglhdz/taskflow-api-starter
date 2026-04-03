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
