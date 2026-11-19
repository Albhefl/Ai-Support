# Ai-Support

Repositorio de entregables. Cada tarea se integra a `main` únicamente mediante Pull Request desde su propia rama.

| Tarea | Carpeta | Rama |
|---|---|---|
| 1 · Laboratorio PWA semana 10 (fallos, contratos y recuperación) | [`tarea-1-laboratorio-pwa/`](tarea-1-laboratorio-pwa/) | `tarea-1/laboratorio-pwa` |
| 2 · Reto práctico AI Support Engine (motor tradicional + generativo + API) | `ai-support-engine/` | `tarea-2/ai-support-engine` |
| 3 · Clasificador ML (tickets.csv + TF-IDF + LogisticRegression) | `ai-support-engine/ml/` | `tarea-3/clasificador-ml` |

## Reglas del repositorio
- **Nunca** se hace commit ni push directo a `main`; todo entra por Pull Request.
- Activar el hook que bloquea `git push` a `main` después de clonar:
  ```bash
  git config core.hooksPath .githooks
  ```
- Commits con formato convencional (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- Los secretos viven en `.env` (ignorado por git); solo se versiona `.env.example`.
