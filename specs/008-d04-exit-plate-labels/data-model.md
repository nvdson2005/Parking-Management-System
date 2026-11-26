# Data model: Show both plates in the exit preview (A-68 D-04)

No stored data changes. No migration.

## Exit preview (view only)

What the Staff exit screen shows before confirming an exit.

| Field | Source | Shown as |
|---|---|---|
| Entry plate | `ExitPreview.plateSnapshot` from `previewExit` (the plate recorded at entry) | "Biển số lúc vào" / "Plate at entry" |
| Observed plate | the plate Staff typed in the form (`observedPlate`), trimmed | "Biển số quan sát" / "Observed plate"; marked when `plateMismatch` is true |
| Zone, vehicle type, fee group, entry time, fee | `ExitPreview` | unchanged |
| Plates match | `ExitPreview.plateMismatch` (computed by `previewExit` with `plateCompareKey`) | drives the mark, the warning and the confirm rule, as today |

Rule kept: any change to an input clears the preview, so the observed plate shown is the one that was compared.
