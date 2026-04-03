---
name: changelog-generator
description: Genera o actualiza CHANGELOG.md basado en los commits Conventional Commits desde el último tag.
---

# Changelog Generator Skill

Este skill analiza el historial de Git desde el tag más reciente (o desde el primer commit si no hay tags) y genera un archivo `CHANGELOG.md` siguiendo el formato [Keep a Changelog](https://keepachangelog.com/).

## Instrucciones para el agente

1. Obtén la lista de commits desde el último tag:
   ```bash
   git describe --tags --abbrev=0  # último tag
   git log <last_tag>..HEAD --oneline --pretty=format:"%s"
   ```
   Si no hay tags, usa `git log --oneline`.

2. Clasifica cada commit según su tipo (feat, fix, docs, style, refactor, perf, test, chore, etc.) y extrae el mensaje (después del tipo y ámbito opcional).

3. Genera o actualiza `CHANGELOG.md` en la raíz. El formato debe ser:

```markdown
# Changelog

## [No publicado] - Fecha actual

### Añadido
- feat: descripción del commit (autor @username)

### Corregido
- fix: descripción

### Cambiado
- refactor: descripción

### Eliminado
- ...

### Documentación
- docs: ...

### Pruebas
- test: ...

### Mantenimiento
- chore: ...
```

4. Si el archivo ya existe, fusiona los nuevos cambios al principio (sección `[No publicado]`). No elimines secciones anteriores.

5. Escribe el archivo con codificación UTF-8.

## Ejemplo de uso

Usuario: "Usa el skill changelog-generator para crear el changelog inicial"

Agente: Ejecuta los comandos, genera el archivo y responde "CHANGELOG.md generado con X commits."