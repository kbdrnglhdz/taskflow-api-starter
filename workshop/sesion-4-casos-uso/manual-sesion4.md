# Manual del Participante - Sesión 4: Casos de Uso Reales

## 📋 Descripción de la sesión

Esta sesión te permitirá aplicar OpenCode a problemas reales del proyecto. Implementarás agentes y skills especializados para resolver casos específicos como refactorización, generación de documentación, mejora de tipos y creación de tests.

**Objetivo:** Resolver problemas reales del código usando agentes y skills personalizados

---

## 📚 Teoría: Agentes Personalizados en Profundidad

### Crear agentes con CLI

OpenCode incluye un comando interactivo para crear agentes:

```bash
opencode agent create
```

Este comando:
1. Pregunta dónde guardar el agente (global o por proyecto)
2. Solicita descripción de lo que debe hacer el agente
3. Genera un prompt y system prompt adecuados
4. Permite seleccionar qué herramientas puede usar el agente
5. Crea un archivo Markdown con la configuración

### Estructura completa de un agente

```markdown
---
name: mi-agente
description: Descripción breve del agente
mode: subagent  # primary, subagent, all
model: anthropic/claude-sonnet-4-5
temperature: 0.1
steps: 10  # Pasos máximos
hidden: false  # Ocultar del menú @
tools:
  write: false
  edit: false
  bash: false
  glob: true
  grep: true
permission:
  edit: deny
  bash:
    "*": ask
    "git *": allow
  webfetch: deny
color: "#FF5733"
top_p: 0.9
---

Eres un asistente especializado en...
```

### Opciones avanzadas de agentes

#### Temperatura

Controla la aleatoriedad y creatividad de las respuestas:
- **0.0-0.2**: Respuestas muy enfocadas (análisis, revisión)
- **0.3-0.5**: Respuestas equilibradas (desarrollo general)
- **0.6-1.0**: Respuestas más creativas (lluvia de ideas)

#### Pasos máximos

Controla la cantidad máxima de iteraciones que un agente puede realizar:

```json
{
  "agent": {
    "quick-thinker": {
      "steps": 5
    }
  }
}
```

#### Ocultar agentes

Oculta un subagente del menú de autocompletar `@`:

```markdown
---
mode: subagent
hidden: true
---
```

#### Permisos de tarea

Controla qué subagentes puede invocar un agente:

```markdown
---
permission:
  task:
    "*": deny
    "orchestrator-*": allow
    "code-reviewer": ask
---
```

### Casos de uso comunes de agentes

| Agente | Configuración recomendada |
|--------|---------------------------|
| **Review** | `edit: deny, bash: ask, read: allow` |
| **Refactor** | `edit: ask, bash: deny, read: allow` |
| **Debug** | `edit: deny, bash: allow, read: allow` |
| **Docs** | `edit: ask, bash: deny, read: allow` |
| **Security** | `edit: deny, bash: false, read: allow` |

---

## 📚 Teoría: Skills Personalizados en Profundidad

### Estructura avanzada de un skill

```markdown
---
name: mi-skill
description: Descripción detallada del skill
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: ci/cd
---

## What I do
Descripción detallada de las capacidades del skill

## When to use me
Cuándo usar este skill

## Instructions
Instrucciones paso a paso para el agente
```

### Metadatos del skill

El campo `metadata` permite agregar información adicional:

```yaml
metadata:
  audience: maintainers  # Target audience
  workflow: github       # Related workflow
  version: 1.0.0         # Skill version
```

### Validación de nombres

El nombre del skill debe:
- Tener entre 1 y 64 caracteres
- Ser minúsculas con guiones simples
- No comenzar ni terminar con `-`
- No contener `--` consecutivos
- Coincidir con el nombre del directorio

### Solucionar problemas de carga

Si un skill no aparece:
1. Verificar que `SKILL.md` esté en mayúsculas
2. Verificar el frontmatter incluya `name` y `description`
3. Asegurar nombres únicos en todas las ubicaciones
4. Verificar los permisos

---

## 📚 Teoría: Casos de Uso

### Caso A: Refactorización de Controladores

**Problema:** Los controladores tienen lógica anidada y son difíciles de testear.

**Solución:** Extraer lógica a servicios separados.

**Patrón de diseño:**

```typescript
// Antes (controlador con lógica mezclada)
export const createTask = async (req, res) => {
  const { title, description } = req.body;
  
  // Validación
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }
  
  // Lógica de negocio
  const task = await db.tasks.create({
    title,
    description,
    userId: req.user.id
  });
  
  // Respuesta
  res.status(201).json(task);
};

// Después (controlador + servicio)
export const createTask = async (req, res) => {
  try {
    const task = await taskService.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Beneficios:**
- Controlador más limpio
- Lógica de negocio reutilizable
- Más fácil de testear
- Mejor separación de responsabilidades

> **Referencia:** [Patrones de diseño en TypeScript](https://www.typescriptlang.org/docs/)

### Caso B: Documentación OpenAPI

**Problema:** No hay documentación de la API.

**Solución:** Generar especificación automáticamente.

**Estructura OpenAPI 3.0:**

```yaml
openapi: 3.0.0
info:
  title: TaskFlow API
  version: 1.0.0
paths:
  /tasks:
    get:
      summary: List tasks
      responses:
        '200':
          description: List of tasks
components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
```

**Herramientas relacionadas:**
- [Swagger Editor](https://editor.swagger.io/)
- [OpenAPI Specification](https://spec.openapis.org/)

### Caso C: Eliminación de `any`

**Problema:** El código tiene tipos `any` que reducen la seguridad.

**Solución:** Reemplazar con tipos concretos.

**Patrones comunes:**

```typescript
// ❌ Evitar
function process(data: any): any { ... }
const result = data as any;
catch (error: any) { ... }

// ✅ Preferir
function process(data: unknown): Task { ... }
if (typeof data === 'object') { ... }
catch (error: unknown) {
  if (error instanceof Error) { ... }
}
```

**Estrategias:**
- Usar `unknown` en lugar de `any`
- Type guards para validar tipos
- Interfaces definidas para objetos
- Genéricos para funciones reutilizables

> **Referencia:** [TypeScript - Tipos avanzados](https://www.typescriptlang.org/docs/handbook/2.html)

### Caso D: Generación de Tests

**Problema:** Cobertura de pruebas baja.

**Solución:** Generar tests de integración automáticamente.

**Estructura de test con Supertest:**

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

  it('should return 404 for non-existent task', async () => {
    const res = await request(app)
      .get('/tasks/99999');
    
    expect(res.status).toBe(404);
  });
});
```

**Mejores prácticas:**
- Tests de caso feliz
- Tests de validación
- Tests de errores
- Tests de recursos no encontrados

> **Referencia:** [Supertest](https://github.com/ladjs/supertest)

---

## 🛠️ Práctica: Implementar los Casos de Uso

### Caso A: Refactor-assistant

**Archivo:** `.opencode/agents/refactor-assistant.md`

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

1. Identificar las responsabilidades que no pertenecen al controlador
2. Crear un nuevo archivo de servicio en `backend/src/services/`
3. Mover la lógica al servicio, manteniendo el controlador solo para orquestar
4. Actualizar las importaciones y los tests existentes
5. Asegurar que el nuevo servicio esté tipado correctamente (sin `any`)

Sigue las reglas de AGENTS.md. Antes de editar, muestra un plan de acción.
```

**Ejecución:**

```bash
opencode run --agent refactor-assistant --files backend/src/controllers/taskController.ts
```

### Caso B: generate-openapi

**Archivo:** `.opencode/skills/generate-openapi/SKILL.md`

```markdown
---
name: generate-openapi
description: Analiza las rutas de Express y genera un archivo openapi.yaml (versión 3.0.0).
---

# OpenAPI Generator Skill

Este skill inspecciona el código fuente de las rutas y controladores para producir una especificación OpenAPI.

## Instrucciones

1. Recorre recursivamente `backend/src/routes` y `backend/src/controllers`.
2. Para cada ruta extrae:
   - Método HTTP
   - Path
   - Parámetros de path, query
   - Body
   - Códigos de respuesta
3. Genera un objeto OpenAPI con las secciones: paths, components/schemas
4. Escribe el archivo `openapi.yaml` en la raíz del proyecto
```

**Ejecución:**

```bash
opencode skill generate-openapi
```

### Caso C: remove-any

**Archivo:** `.opencode/skills/remove-any/SKILL.md`

```markdown
---
name: remove-any
description: Encuentra y reemplaza usos de `any` por tipos concretos en archivos TypeScript.
---

# Skill Remove-Any

Analiza archivos `.ts` y `.tsx` en busca de `any` y sugiere el tipo correcto.

## Instrucciones

1. Busca:
   - Parámetros de función tipados como `any`
   - Variables con tipo `any`
   - `as any`
   - Bloque `catch (error: any)`

2. Infiere el tipo real:
   - Si es `req.user`, asumir `{ id: number; email: string }`
   - Si es `error` en catch, usar `unknown` y type guards

3. Proporciona los cambios sugeridos

4. Genera un informe de cuántos `any` quedan
```

**Ejecución:**

```bash
opencode skill remove-any --files backend/src/
```

### Caso D: generate-tests

**Archivo:** `.opencode/skills/generate-tests/SKILL.md`

```markdown
---
name: generate-tests
description: Genera pruebas faltantes con Jest y Supertest para rutas de Express que tengan cobertura < 80%.
---

# Test Generator Skill

Evalúa la cobertura actual o analiza los controladores para crear tests.

## Instrucciones

1. Identifica los archivos de ruta en `backend/src/routes`
2. Para cada endpoint sin test, genera un archivo `*.test.ts` con:
   - Setup de supertest(app)
   - Test de caso feliz (200/201)
   - Test de validación (400)
   - Test de recurso no encontrado (404)
   - Test de error interno (500)
3. Usa la estructura típica de Jest
4. No borres tests existentes
```

**Ejecución:**

```bash
opencode skill generate-tests --focus backend/src/controllers/commentController.ts
```

---

## 📋 Checklist de la sesión

- [ ] Caso A: Agente `refactor-assistant` creado y probado
- [ ] Caso B: Skill `generate-openapi` creado y probado
- [ ] Caso C: Skill `remove-any` creado y probado
- [ ] Caso D: Skill `generate-tests` creado y probado
- [ ] Al menos 2 casos implementados completamente
- [ ] PRs creados con las mejoras

---

## 📖 Referencias

- [Documentación OpenCode - Agentes](https://opencode.ai/docs/es/agents)
- [Documentación OpenCode - Skills](https://opencode.ai/docs/es/skills)
- [OpenAPI Specification](https://spec.openapis.org/)
- [Swagger Editor](https://editor.swagger.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2.html)
- [Supertest](https://github.com/ladjs/supertest)
- [Jest Documentation](https://jestjs.io/)