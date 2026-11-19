| # | Caso | Referencia | Motor ML | Confianza | Formato | Categoría correcta | Cat + Prio correctas |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | `normal-access-01` | `ACCESS` / `MEDIUM` | `ACCESS` / `MEDIUM` | 0.68 | Sí ✅ | Sí ✅ | Sí ✅ |
| 2 | `normal-bug-01` | `BUG` / `MEDIUM` | `BUG` / `MEDIUM` | 0.52 | Sí ✅ | Sí ✅ | Sí ✅ |
| 3 | `normal-feature-01` | `FEATURE` / `LOW` | `FEATURE` / `LOW` | 0.49 | Sí ✅ | Sí ✅ | Sí ✅ |
| 4 | `normal-security-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `CRITICAL` | 0.47 | Sí ✅ | Sí ✅ | Sí ✅ |
| 5 | `complex-bug-access-01` | `BUG` / `HIGH` | `BUG` / `HIGH` | 0.43 | Sí ✅ | Sí ✅ | Sí ✅ |
| 6 | `complex-feature-urgent-01` | `FEATURE` / `MEDIUM` | `FEATURE` / `MEDIUM` | 0.43 | Sí ✅ | Sí ✅ | Sí ✅ |
| 7 | `complex-access-high-01` | `ACCESS` / `HIGH` | `ACCESS` / `HIGH` | 0.60 | Sí ✅ | Sí ✅ | Sí ✅ |
| 8 | `complex-security-precedence-01` | `SECURITY` / `CRITICAL` | `BUG` / `MEDIUM` | 0.32 | Sí ✅ | No ❌ | No ❌ |
| 9 | `adversarial-injection-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `HIGH` | 0.53 | Sí ✅ | Sí ✅ | No ❌ |
| 10 | `adversarial-hide-leak-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `CRITICAL` | 0.39 | Sí ✅ | Sí ✅ | Sí ✅ |
| 11 | `adversarial-change-rules-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `CRITICAL` | 0.48 | Sí ✅ | Sí ✅ | Sí ✅ |
| 12 | `adversarial-exposed-password-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `CRITICAL` | 0.49 | Sí ✅ | Sí ✅ | Sí ✅ |
| 13 | `adversarial-active-vulnerability-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `CRITICAL` | 0.50 | Sí ✅ | Sí ✅ | Sí ✅ |
| 14 | `adversarial-minimize-malware-01` | `SECURITY` / `CRITICAL` | `SECURITY` / `CRITICAL` | 0.43 | Sí ✅ | Sí ✅ | Sí ✅ |

Motor ML - categoría correcta: 13/14 (92.86%)
Motor ML - categoría y prioridad correctas: 12/14 (85.71%)
Motor ML - formato JSON válido: 14/14 (100.00%)
