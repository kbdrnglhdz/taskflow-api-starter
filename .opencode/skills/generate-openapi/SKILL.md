---
name: generate-openapi
description: Analiza las rutas de Express y genera un archivo openapi.yaml (versión 3.0.0).
---

# OpenAPI Generator Skill

Este skill inspecciona el código fuente de las rutas y controladores para producir una especificación OpenAPI.

## Instrucciones

1. Recorre recursivamente `backend/src/routes` y `backend/src/controllers`.
2. Para cada ruta (`app.get`, `app.post`, etc.) extrae:
   - Método HTTP
   - Path (ej. `/tasks/:id`)
   - Parámetros de path, query (si se detecta `req.params` o `req.query`)
   - Body (si hay `req.body`, asumir `application/json`)
   - Códigos de respuesta comunes (200, 201, 400, 404, 500)
3. Genera un objeto OpenAPI con las secciones: `paths`, `components/schemas` (para Task y Comment).
4. Escribe el archivo `openapi.yaml` en la raíz del proyecto.
5. Si existe, sugiere mejoras manuales (descripciones, ejemplos).

El resultado debe ser válido según [Swagger Editor](https://editor.swagger.io/).
