# Sesión 4 – Casos de uso reales

**Objetivo:** Resolver problemas reales del código usando agentes y skills personalizados.

---

## 📚 Fundamentos teóricos

### Crear agentes personalizados

OpenCode permite crear nuevos agentes usando el comando:

```bash
opencode agent create
```

Este comando interactivo:
1. Pregunta dónde guardar el agente (global o por proyecto)
2. Descripción de lo que debe hacer el agente
3. Genera un prompt y system prompt adecuados
4. Permite seleccionar qué herramientas puede usar el agente
5. Crea un archivo Markdown con la configuración

### Estructura de un agente personalizado

```markdown
---
name: mi-agente
description: Descripción breve del agente
mode: subagent  # primary, subagent, all
tools:
  bash: false
  write: false
  edit: false
---

Eres un asistente especializado en...
```

### Casos de uso comunes de agentes

| Agente | Descripción |
|--------|-------------|
| **Review** | Revisión de código con acceso de solo lectura |
| **Debug** | Investigar problemas con bash y lectura |
| **Docs** | Escritura de documentación |
| **Security** | Auditoría de seguridad |

### Configurar permisos granulares

```markdown
---
permissions:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
  webfetch: deny
---
```

- `"ask"`: Solicitar aprobación antes de ejecutar
- `"allow"`: Permitir sin aprobación
- `"deny"`: Desactiva la herramienta

---

### Resumen de la sesión 4

En esta sesión aprenderás a:
1. Crear agentes especializados para diferentes tareas
2. Crear skills para automatización de procesos
3. Aplicar casos de uso reales al proyecto

**Casos de uso disponibles:**
- **Caso A**: Refactorización de controladores a servicios
- **Caso B**: Generación de documentación OpenAPI
- **Caso C**: Eliminación de `any` del código
- **Caso D**: Generación de tests faltantes

**Patrones de permisos:**
- Agente de revisión: `edit: deny, bash: ask, read: allow`
- Agente de refactor: `edit: ask, bash: deny, read: allow`
- Agente de debug: `edit: deny, bash: allow, read: allow`

---

## 4.1 Objetivo de la sesión

Los participantes eligen **2 o 3 casos** de los siguientes. Cada caso requiere crear un nuevo agente o skill.

---

## Caso A: Refactorizar controlador a servicios

**Problema:** `taskController.ts` tiene lógica anidada y difícil de testear.

**Solución:** Crear agente `refactor-assistant`

Crea el archivo `.opencode/agents/refactor-assistant.md`:

```markdown
---
name: refactor-assistant
description: Especialista en extraer lógica de controladores a servicios y reducir la complejidad ciclomática.
permissions:
  edit: ask
  bash: deny
  read: allow
---

Eres un asistente de refactorización para Express + TypeScript.

Dado un controlador que contiene lógica anidada o difícil de testear, debes:

1. Identificar las responsabilidades que no pertenecen al controlador (validación, acceso a base de datos, lógica de negocio).
2. Crear un nuevo archivo de servicio en `backend/src/services/` con nombre descriptivo (ej. `task-service.ts`).
3. Mover la lógica al servicio, manteniendo el controlador solo para orquestar request/response.
4. Actualizar las importaciones y los tests existentes (si los hay).
5. Asegurar que el nuevo servicio esté tipado correctamente (sin `any`).

Sigue las reglas de AGENTS.md. Antes de editar, muestra un plan de acción y espera confirmación.
```

**Ejecución:**

```bash
opencode run --agent refactor-assistant --files backend/src/controllers/taskController.ts
```

---

## Caso B: Generar documentación OpenAPI

**Problema:** No hay documentación de la API.

**Solución:** Skill `generate-openapi`

Crea el archivo `.opencode/skills/generate-openapi/SKILL.md`:

```markdown
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
```

**Ejecución:**

```bash
opencode skill generate-openapi
```

---

## Caso C: Eliminar `any` del código

**Problema:** Hay múltiples usos de `any` en el backend.

**Solución:** Skill `remove-any`

Crea el archivo `.opencode/skills/remove-any/SKILL.md`:

```markdown
---
name: remove-any
description: Encuentra y reemplaza usos de `any` por tipos concretos en archivos TypeScript.
---

# Skill Remove-Any

Analiza archivos `.ts` y `.tsx` en busca de `any` (explícito o implícito como `error: any`) y sugiere el tipo correcto basado en el contexto.

## Instrucciones

1. Para cada archivo dado (o todo el proyecto si no se especifica), busca:
   - Parámetros de función tipados como `any`
   - Variables con tipo `any`
   - `as any`
   - Bloque `catch (error: any)`

2. Intenta inferir el tipo real:
   - Si es `req.user`, asumir `{ id: number; email: string }` (definir interfaz User).
   - Si es `error` en catch, usar `unknown` y luego hacer type guards.
   - Si es un array sin tipo, añadir `unknown[]` o una interfaz.

3. Para cada caso, propone un cambio con el tipo correcto y muestra la línea original.

4. Opcionalmente, puede aplicar los cambios si el usuario lo confirma (usando `edit: ask`).

5. Genera un informe de cuántos `any` quedan después de los cambios sugeridos.
```

**Ejecución:**

```bash
opencode skill remove-any --files backend/src/
```

---

## Caso D: Generar tests faltantes

**Problema:** Cobertura de pruebas < 50%.

**Solución:** Skill `generate-tests`

Crea el archivo `.opencode/skills/generate-tests/SKILL.md`:

```markdown
---
name: generate-tests
description: Genera pruebas faltantes con Jest y Supertest para rutas de Express que tengan cobertura < 80%.
---

# Test Generator Skill

Evalúa la cobertura actual (si existe) o analiza los controladores para crear tests de integración.

## Instrucciones

1. Identifica los archivos de ruta en `backend/src/routes`.
2. Para cada endpoint sin test correspondiente en `backend/tests/integration/`, genera un archivo `*.test.ts` con:
   - Setup de `supertest(app)`
   - Test de caso feliz (status 200/201)
   - Test de validación (datos incorrectos → 400)
   - Test de recurso no encontrado (si aplica → 404)
   - Test de error interno (simulando fallo en servicio)
3. Usa la estructura típica de Jest: `describe`, `it`, `expect`.
4. No borres tests existentes, solo añade los faltantes.
5. Si el proyecto ya tiene `jest.config.js`, respeta su configuración.

Ejemplo de test generado:

```typescript
import request from 'supertest';
import app from '../../src/index';

describe('POST /tasks', () => {
  it('should create a task with valid data', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test task' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
```
```

**Ejecución:**

```bash
opencode skill generate-tests --focus backend/src/controllers/commentController.ts
```

---

## 4.2 Entregable de la sesión

```bash
# Cada grupo hace commit de sus mejoras
git add .
git commit -m "feat: refactor taskController a servicios + tests"
git push origin main

# Crear PR con los cambios generados por IA + ajustes manuales
```

---

## ✅ Éxito de la sesión

2-3 PRs con mejoras sustanciales usando agentes y skills:
- Refactorización de controladores a servicios
- Documentación OpenAPI automática
- Eliminación de `any` del código
- Tests de integración generados

---

## Archivos de esta sesión

```
workshop/sesion-4-casos-uso/
├── diapositivas.md
└── .opencode/
    ├── agents/
    │   └── refactor-assistant.md
    └── skills/
        ├── generate-openapi/
        │   └── SKILL.md
        ├── remove-any/
        │   └── SKILL.md
        └── generate-tests/
            └── SKILL.md
```