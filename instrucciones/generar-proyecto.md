Crea un proyecto completo llamado "taskflow-api-starter" que sea una aplicación web simple de gestión de tareas (TaskFlow), con backend y frontend, que contenga **intencionalmente** los siguientes problemas de código, gobernanza y DevOps. No intentes corregirlos; el propósito es que el equipo los descubra y resuelva durante un taller usando Opencode.

## Requisitos funcionales mínimos
- Backend: API REST con Express (TypeScript) que permita:
  - CRUD de tareas (campos: id, título, descripción, completada, createdAt).
  - CRUD de comentarios asociados a tareas.
- Frontend: interfaz simple (React o Vue) que liste tareas y permita añadir/editar/eliminar tareas y comentarios.

## Problemas deliberados a incluir

### Backend (TypeScript/Express)
1. **Uso de `any`**:
   - En controladores, `req.user` tipado como `any`.
   - En bloques `catch`, el error se captura como `any`.
2. **Validación manual sin Zod**:
   - Validar campos con `if (!req.body.title)` etc., incompleta (por ejemplo, no validar tipos ni formatos).
3. **Manejo de errores inconsistente**:
   - Unas rutas devuelven `{ message: "error" }`, otras `{ error: "descripción" }`.
   - Códigos de estado HTTP mezclados (200 para errores de validación).
4. **Pruebas insuficientes**:
   - Cobertura < 50% (solo pruebas unitarias de utilidades).
   - Sin pruebas de integración para rutas de comentarios.
5. **Documentación**:
   - Sin OpenAPI (swagger). Solo un README.md desactualizado que no coincide con las rutas reales.
6. **Convenciones inconsistentes**:
   - Mezcla de `camelCase` y `kebab-case` en nombres de archivos (ej. `taskController.ts` vs `comment-controller.js`).
   - Commits de ejemplo en el historial (si lo generas con git) que no siguen Conventional Commits.

### Frontend (React o Vue)
- Consumo de API con manejo de errores frágil (asume siempre éxito).
- Uso de `any` en estados o props.
- Sin tests.

### Gobernanza y DevOps
- **No existe `AGENTS.md`** en la raíz.
- **No hay `opencode.json`** (por tanto, cualquier comando bash está permitido sin restricciones).
- **CI** (GitHub Actions): solo ejecuta `npm test` (no lint, no type-check, no revisión con IA).
- **Sin pre-commit hooks** (no hay husky/lint-staged).

## Estructura esperada del proyecto

```
taskflow-api-starter/
├── backend/
│   ├── src/
│   │   ├── controllers/    (con any y validación manual)
│   │   ├── routes/         (inconsistencia en nombres)
│   │   ├── models/         (datos en memoria o SQLite simple)
│   │   └── index.ts
│   ├── tests/              (solo algunos unitarios)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     (manejo de errores pobre)
│   │   └── App.jsx/tsx
│   └── package.json
├── .github/workflows/ci.yml   (solo npm test)
├── README.md                  (desactualizado)
└── .gitignore
```

Genera todo el código fuente con los problemas indicados. No incluyas correcciones ni mejoras. El objetivo es que el código funcione mínimamente pero sea frágil, inseguro y mal mantenible.