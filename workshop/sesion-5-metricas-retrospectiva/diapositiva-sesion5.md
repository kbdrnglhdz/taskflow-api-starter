# Sesión 5 – Métricas, Retrospectiva y Roadmap

**Objetivo:** Medir el impacto del taller y planificar la siguiente evolución.

---

## 📚 Fundamentos teóricos

### Conceptos clave del taller

A lo largo de este taller has aprendido a configurar y usar OpenCode para mejorar el flujo de desarrollo de tu equipo:

1. **Gobernanza (Sesión 1)**
   - AGENTS.md: Reglas del equipo para agentes de IA
   - opencode.json: Configuración de permisos y herramientas
   - Inicialización de proyectos con OpenCode

2. **Agentes y Skills (Sesión 2)**
   - Agentes personalizados: Revisores, refactorizadores, etc.
   - Skills: Instrucciones reutilizables para tareas específicas

3. **Integración (Sesión 3)**
   - Comandos personalizados
   - GitHub Actions para revisión automática
   - Husky para hooks de pre-commit

4. **Casos de uso reales (Sesión 4)**
   - Crear agentes para refactorización
   - Skills para OpenAPI, eliminación de `any`, tests

### Midiendo el impacto

Para medir el éxito de adoptar OpenCode en el equipo, considera:

- **Calidad del código**: Reducción de `any`, mayor cobertura de tests
- **Productividad**: Tiempo ahorrado en revisiones, generación de documentación
- **Consistencia**: Uso de Conventional Commits, formato de errores
- **Adopción**: Cuántos miembros del equipo usan OpenCode regularmente

---

### Resumen de la sesión 5

En esta sesión aprenderás a:
1. Medir el impacto del taller con métricas reales
2. Crear una retrospectiva del equipo
3. Definir un roadmap para los siguientes sprints
4. Realizar una demo final

**Métricas a capturar:**
- Número de `any` antes/después
- Cobertura de tests
- Funciones largas detectadas
- Tiempo de revisión de PRs

**Entregables:**
- RETROSPECTIVA.md: Lecciones aprendidas y recomendaciones
- ROADMAP-OPECODE.md: Plan para los siguientes sprints
- Demo en vivo del flujo completo

**Siguientes pasos recomendados:**
- Sprint 6: Automatizar OpenAPI + Agente de seguridad
- Sprint 7: Migración de BD + Skill de migraciones
- Sprint 8: Dashboard de métricas + Actualizar dependencias

---

## 5.1 Objetivo de la sesión

- Medir el impacto del taller con métricas reales
- Crear una retrospectiva del equipo
- Definir un roadmap para los siguientes sprints
- Realizar una demo final de lo construido

---

## 5.2 Medir impacto (15 min)

Ejecutar estos comandos y anotar los resultados:

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
# Anotar % de statements

# 3. Funciones largas (>20 líneas)
find backend/src -name "*.ts" -exec awk 'NF && /function/ {line=NR; start=1} NR==line+20 {print FILENAME":"line}' {} \;

# 4. Tiempo de revisión de PRs (si hay historial)
gh pr list --state merged --json createdAt,reviewDecision --limit 10
```

---

## 5.3 Crear RETROSPECTIVA.md (15 min)

Crea el archivo `RETROSPECTIVA.md` en la raíz del proyecto.

```markdown
# Retrospectiva del taller Opencode

## Métricas de impacto

| Indicador | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| Número de `any` | [X] | [Y] | [Z]% |
| Cobertura de tests | [X]% | [Y]% | [Z]% |
| Funciones >20 líneas | [X] | [Y] | [Z]% |
| Tiempo revisión PRs | [X]h | [Y]h | [Z]% |

## ¿Qué agentes/skills resultaron más útiles?

- taskflow-reviewer: [opinión del equipo]
- changelog-generator: [opinión]
- [otros]

## Dificultades encontradas

- Permisos: [ej. el agente no podía ejecutar npm test por deny]
- Prompts: [ej. el agente ignoraba la regla de Zod]
- Alucinaciones: [ej. inventó funciones que no existen]

## Recomendaciones para el equipo

1. [Ej: Revisar manualmente los cambios del agente antes de commitear]
2. [Ej: Añadir más ejemplos en AGENTS.md]
3. [Ej: Usar opciones de permisos más granulares]

## Conclusión

[Párrafo resumen: ¿valió la pena? ¿Seguiremos usando Opencode?]
```

---

## 5.4 Crear ROADMAP-OPECODE.md (10 min)

Crea el archivo `ROADMAP-OPECODE.md` en la raíz del proyecto.

```markdown
# Roadmap de Opencode para los próximos sprints

## Sprint 6 (siguiente)
- [ ] Automatizar generación de documentación OpenAPI con skill `generate-openapi`
- [ ] Agente de seguridad: detectar SQL injection y XSS
- [ ] Integrar con Slack: notificar cuando un PR pasa la revisión automática

## Sprint 7
- [ ] Migrar de SQLite a PostgreSQL usando agente `db-migrator`
- [ ] Skill para generar migraciones de base de datos
- [ ] Agente de rendimiento: detectar N+1 queries

## Sprint 8
- [ ] Dashboard de métricas de IA (cuántas revisiones, tiempo ahorrado)
- [ ] Skill para actualizar dependencias obsoletas
- [ ] Hook de pre-push que ejecuta el agente `taskflow-reviewer`

## Cómo priorizar
- Cada sprint: 1 agente + 1 skill + 1 integración
- Revisar RETROSPECTIVA.md para ajustar
```

---

## 5.5 Demo final (5 minutos por grupo)

Cada grupo demuestra:

1. **Un cambio real**: ej. añadir un endpoint nuevo
2. **El flujo completo**: commit → hook lint → PR → revisión automática → merge
3. **El changelog generado automáticamente**

---

## 5.6 Commit final (2 min)

```bash
git add RETROSPECTIVA.md ROADMAP-OPECODE.md
git commit -m "docs: añadir retrospectiva y roadmap del taller"
git push origin main
```

---

## ✅ Éxito de la sesión

- Métricas documentadas con datos reales
- Retrospectiva completada con recomendaciones
- Roadmap definido para los próximos sprints
- Demo en vivo del flujo completo

---

## Archivos de esta sesión

```
workshop/sesion-5-metricas-retrospectiva/
├── diapositivas.md
├── RETROSPECTIVA.md
└── ROADMAP-OPECODE.md
```

---

## 📋 Checklist final de éxito

| Sesión | Entregable | ¿Listo? |
|--------|------------|---------|
| 1 | PR con AGENTS.md y opencode.json aprobado | ☐ |
| 2 | Carpeta .opencode/ con agente y skill funcionando | ☐ |
| 3 | GitHub Actions comentando en PRs + hook pre-commit | ☐ |
| 4 | 2-3 PRs con mejoras sustanciales (refactor, tests, documentación) | ☐ |
| 5 | RETROSPECTIVA.md y ROADMAP-OPECODE.md + demo en vivo | ☐ |