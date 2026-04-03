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