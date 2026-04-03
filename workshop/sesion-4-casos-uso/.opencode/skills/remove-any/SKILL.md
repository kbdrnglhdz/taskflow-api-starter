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