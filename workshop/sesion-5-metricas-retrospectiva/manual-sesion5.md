# Manual del Participante - Sesión 5: Métricas, Retrospectiva y Roadmap

## 📋 Descripción de la sesión

Esta sesión final te permitirá medir el impacto real del taller, reflexionar sobre las lecciones aprendidas y planificar la evolución de OpenCode en tu equipo. Es el momento de evaluar qué funcionó, qué mejoró y hacia dónde continuar.

**Objetivo:** Medir impacto, crear retrospectiva y definir roadmap

---

## 📚 Teoría: Midiendo el Impacto de IA en Desarrollo

### ¿Por qué medir el impacto?

Medir el impacto de las herramientas de IA en el desarrollo de software es crucial para:
- **Justificar la inversión** en herramientas y capacitación
- **Identificar áreas de mejora** en los flujos de trabajo
- **Demostrar valor** al equipo y stakeholders
- **Tomar decisiones informadas** sobre la adopción continua

### Métricas de calidad de código

#### Reducción de `any` en TypeScript

El tipo `any` en TypeScript es un indicador de baja calidad de tipos. Reducir su uso mejora:
- Seguridad en tiempo de ejecución
- Mantenibilidad del código
- Experiencia de desarrollo (autocomplete, refactoring)

```bash
# Contar usos de any
grep -r "any" backend/src --include="*.ts" | wc -l
```

#### Cobertura de tests

La cobertura de pruebas indica qué porcentaje del código está ejercitado por tests:

```bash
npm test -- --coverage
```

**Benchmarks:**
- < 50%: Cobertura baja
- 50-80%: Cobertura aceptable
- > 80%: Cobertura buena

#### Complejidad ciclomática

Las funciones largas (>20 líneas) indican posible complejidad excesiva:

```bash
find backend/src -name "*.ts" -exec awk 'NF && /function/ {line=NR; start=1} NR==line+20 {print FILENAME":"line}' {} \;
```

### Métricas de productividad

#### Tiempo de revisión de PRs

Medir el tiempo promedio de revisión antes y después de OpenCode:

```bash
gh pr list --state merged --json createdAt,mergedAt --limit 20
```

#### Velocidad de desarrollo

- Tasks completados por sprint
- Bugs reportados en producción
- Debt técnico acumulado

---

## 📚 Teoría: Retrospectiva de Equipo

### ¿Qué es una retrospectiva?

La retrospectiva es una reunión donde el equipo reflexiona sobre un período de trabajo para identificar:
- **Qué funcionó bien** (continuar haciendo)
- **Qué puede mejorar** (empezar/hacer menos)
- **Qué actions tomar** (compromisos concretos)

### Estructura de retrospectiva

```
1. Set the stage (5 min)
   - ¿Cómo nos sentimos en este sprint?

2. Gather data (10 min)
   - ¿Qué pasó? Métricas y hechos

3. Generate insights (15 min)
   - ¿Por qué pasaron las cosas?

4. Decide actions (10 min)
   - ¿Qué vamos a hacer diferente?

5. Close (5 min)
   - Resumen y compromisos
```

### Plantilla de retrospectiva para OpenCode

```markdown
# Retrospectiva del taller OpenCode

## Métricas de impacto

| Indicador | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| Número de `any` | X | Y | Z% |
| Cobertura de tests | X% | Y% | Z% |
| Funciones >20 líneas | X | Y | Z% |
| Tiempo revisión PRs | Xh | Yh | Z% |

## ¿Qué funcionó bien?
- Agente X: [descripción]
- Skill Y: [descripción]
- Flujo Z: [descripción]

## ¿Qué puede mejorar?
- [Área 1]
- [Área 2]

## Dificultades encontradas
- Permisos: [ej. el agente no podía ejecutar npm test]
- Prompts: [ej. el agente ignoraba reglas]
- Alucinaciones: [ej. inventó funciones]

## Recomendaciones
1. [Recomendación 1]
2. [Recomendación 2]

## Compromisos
- [Compromiso del equipo]
```

---

## 📚 Teoría: Roadmap de IA

### ¿Qué es un roadmap de IA?

Un roadmap de IA es un plan a mediano/largo plazo que define:
- **Visión**: Qué queremos lograr con IA
- **Roadmap**: Cómo llegaremos ahí
- **Prioridades**: Qué es más importante

### Estructura típica de un roadmap

```
## Visión
[Descripción de la visión a 6-12 meses]

## Sprint N (inmediato)
- [ ] Iniciativa 1
- [ ] Iniciativa 2

## Sprint N+1 (corto plazo)
- [ ] Iniciativa 3
- [ ] Iniciativa 4

## Sprint N+2 (medio plazo)
- [ ] Iniciativa 5

## Cómo priorizar
- Impacto vs esfuerzo
- Dependencias entre iniciativas
- Capacitación del equipo
```

### Roadmap ejemplo para OpenCode

```markdown
# Roadmap OpenCode - Próximos Sprints

## Visión
Integrar OpenCode como asistente estándar del equipo para:
- Revisiones automatizadas
- Documentación automática
- Mejora continua de calidad

## Sprint 6 (próximo)
- [ ] Automatizar documentación OpenAPI
- [ ] Agente de seguridad (SQL injection, XSS)
- [ ] Integración Slack para notificaciones

## Sprint 7
- [ ] Migración de BD con agente dedicado
- [ ] Skill de migraciones
- [ ] Agente de rendimiento (N+1 queries)

## Sprint 8
- [ ] Dashboard de métricas de IA
- [ ] Skill de actualización de dependencias
- [ ] Hook pre-push con revisión automática

## Priorización
- Alto impacto + bajo esfuerzo = inmediatamente
- Alto impacto + alto esfuerzo = planificar
- Bajo impacto = eliminar
```

---

## 📚 Teoría: Evolución de OpenCode

### Conceptos avanzados

#### MCP (Model Context Protocol)

MCP es un protocolo que permite a OpenCode conectarse con herramientas externas:
- Bases de datos
- Sistemas de gestión de proyectos
- Herramientas de CI/CD

> **Referencia:** [Documentación MCP](https://opencode.ai/docs/es/mcp-servers)

#### Formateadores personalizados

OpenCode puede usar formateadores externos:

```json
{
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "extensions": [".js", ".ts"]
    }
  }
}
```

> **Referencia:** [Documentación Formateadores](https://opencode.ai/docs/es/formatters)

#### Themes y personalización

Personaliza la interfaz de OpenCode:

```json
{
  "theme": "opencode",
  "tui": {
    "scroll_speed": 3,
    "diff_style": "auto"
  }
}
```

> **Referencia:** [Documentación Temas](https://opencode.ai/docs/es/themes)

---

## 📚 Teoría: Demo y Presentación

### Cómo preparar una demo efectiva

1. **Elige un escenario real**: Algo que el equipo haya hecho
2. **Practica beforehand**: Asegúrate de que funcione
3. **Cuenta una historia**: Desde el problema hasta la solución
4. **Muestra el valor**: Resalta lo que se ganó
5. **Deja tiempo para preguntas**: 2-3 minutos

### Estructura de demo (5 minutos)

```
1. Contexto (30 seg)
   - Qué vamos a demostrar

2. Demo en vivo (3 min)
   - El flujo completo funcionando

3. Resultados (1 min)
   - Métricas o beneficios

4. Q&A (30 seg)
   - Preguntas del equipo
```

### Flujo completo a demostrar

```
1. Developer escribe código
2. git add + git commit
3. Hook pre-commit ejecuta lint
4. Push a feature branch
5. Abre PR
6. GitHub Actions ejecuta revisión automática
7. Comentario aparece en PR
8. Code review tradicional
9. Merge
10. Changelog actualizado automáticamente
```

---

## 🛠️ Práctica: Ejercicios de la sesión

### Ejercicio 1: Medir impacto

```bash
# 1. Contar any antes/después
echo "Antes (sesión 1):"
git checkout sesion1-gobernanza
grep -r "any" backend/src --include="*.ts" | wc -l

echo "Después (ahora):"
git checkout main
grep -r "any" backend/src --include="*.ts" | wc -l

# 2. Cobertura de pruebas
cd backend
npm test -- --coverage

# 3. Funciones largas
find backend/src -name "*.ts" -exec awk 'NF && /function/ {line=NR; start=1} NR==line+20 {print FILENAME":"line}' {} \;

# 4. PRs y tiempos
gh pr list --state merged --json createdAt,mergedAt --limit 10
```

### Ejercicio 2: Crear RETROSPECTIVA.md

Crea el archivo en la raíz del proyecto con:
- Métricas reales (antes vs después)
- Qué funcionó bien
- Dificultades encontradas
- Recomendaciones
- Conclusión

### Ejercicio 3: Crear ROADMAP-OPECODE.md

Planifica los próximos 3 sprints:
- Sprint 6: Próximo mes
- Sprint 7: Próximos 2 meses
- Sprint 8: Próximos 3 meses

### Ejercicio 4: Preparar demo

Prepara una demo de 5 minutos mostrando:
1. Un cambio real implementado
2. El flujo completo (commit → hook → PR → review)
3. El changelog generado

### Ejercicio 5: Commit final

```bash
git add RETROSPECTIVA.md ROADMAP-OPECODE.md
git commit -m "docs: añadir retrospectiva y roadmap del taller"
git push origin main
```

---

## 📋 Checklist final de éxito

| Sesión | Entregable | ¿Listo? |
|--------|------------|---------|
| 1 | PR con AGENTS.md y opencode.json aprobado | ☐ |
| 2 | Carpeta .opencode/ con agente y skill funcionando | ☐ |
| 3 | GitHub Actions comentando en PRs + hook pre-commit | ☐ |
| 4 | 2-3 PRs con mejoras sustanciales | ☐ |
| 5 | RETROSPECTIVA.md y ROADMAP-OPECODE.md + demo | ☐ |

---

## 📖 Referencias

- [Documentación OpenCode - Configuración](https://opencode.ai/docs/es/config)
- [Documentación OpenCode - Agentes](https://opencode.ai/docs/es/agents)
- [Documentación OpenCode - Skills](https://opencode.ai/docs/es/skills)
- [Documentación OpenCode - MCP](https://opencode.ai/docs/es/mcp-servers)
- [Documentación OpenCode - Formateadores](https://opencode.ai/docs/es/formatters)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2.html)
- [Jest Coverage](https://jestjs.io/docs/configuration#collectcoverage-boolean)

---

## 🎉 ¡Felicitaciones!

Has completado el taller de OpenCode. Ahora tienes las herramientas para:

1. **Configurar** OpenCode en tus proyectos
2. **Crear** agentes y skills personalizados
3. **Integrar** con flujos de CI/CD y hooks
4. **Medir** el impacto de IA en tu equipo
5. **Planificar** la evolución futura

¡Sigue experimentando y mejorando!