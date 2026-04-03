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

## Sprint 9

- [ ] Agente de documentación: generar README.md automáticamente
- [ ] Integración con Docker: validar Dockerfiles
- [ ] Skill para análisis de complejidad ciclomática

## Cómo priorizar

- Cada sprint: 1 agente + 1 skill + 1 integración
- Revisar RETROSPECTIVA.md para ajustar
- Priorizar por impacto en calidad de código y automatización
