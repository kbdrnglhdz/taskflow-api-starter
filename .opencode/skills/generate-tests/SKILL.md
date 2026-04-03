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
