# APEX PROTOCOL — Schema Specification
## Document of Record — Project B Data Model

### 1. Overview
Project B (Apex Protocol) requires a completely new workout logging architecture for Emmanuel. The old Combatos/Fighter’s OS pipeline — which relied on a rigid 4-exercise × 4-set grid, a complex payload mapper, and a heavily fixed Google Sheet structure — is being replaced.

This document serves as the single source of truth for the new data model. It defines the contracts between the React frontend, the logging payload, and the Google Apps Script webhook to ensure complete stability across future training phases.

---

### 2. Locked Decisions
The following architectural decisions are final and must guide all refactoring work:
- **Logging Model:** One row per set in the Google Sheet.
- **Source of Truth:** Training plans will be stored locally as structured JSON files.
- **Flexibility:** The system natively supports dynamic exercise counts and dynamic set counts without needing schema updates.
- **Supersets:** The `supersetLabel` field is optional.
- **Webhook Configuration:** The webhook URL is strictly an internal app constant. It will **not** be exposed in the user-facing UI.
- **Backend Status:** The new Google Sheet and Apps Script pipeline have already been created and deployed.

---

### 3. Training-Plan Data Contract
Training plans will be imported into the app via a single JSON file per phase (e.g., `plan-phase1.json` stored in `app/src/data/`). 

**Top-level Structure:**
- The file contains a `days` object keyed by the day number (e.g., `"1"`, `"2"`).
- Rest days should be explicitly set to `null` (e.g., `"3": null`).

**Day Object:**
- `dayNumber` (Number)
- `focus` (String)
- `warmup` (Array of Strings)
- `exercises` (Array of Exercise Objects)

**Exercise Object:**
- `id` (String): A stable, globally unique identifier (e.g., `"p1-d1-ex1"`). **Must never change** even if the exercise name changes.
- `name` (String): Display name of the exercise.
- `target` (String): Target muscle or movement.
- `supersetLabel` (String | null): Superset identifier (e.g., `"A1"`, `"B1"`). Must explicitly be `null` or `""` for standalone exercises.
- `prescribedSets` (Number): Number of sets to perform.
- `prescribedReps` (String): Rep target, stored as a string to support ranges (e.g., `"10–12"`).
- `prescribedRpe` (Number): RPE target (1–10).
- `quickNote` (String): Short coaching cue.

---

### 4. In-App Workout Session State Contract
The React Context (managed via `DBProvider` in `db/index.jsx`) must hold the current in-progress workout as a dynamic array, replacing the old string-keyed (`ex1-s1`) objects.

**`activeSession` Shape:**
```json
{
  "block": "phase1",
  "day": 1,
  "date": "2026-06-05",
  "notes": "",
  "exercises": [
    {
      "planId": "p1-d1-ex1",
      "name": "Dumbbell Bench Press",
      "supersetLabel": "A1",
      "sets": [
        { "setNumber": 1, "load": "", "reps": "", "rpe": "" },
        { "setNumber": 2, "load": "", "reps": "", "rpe": "" }
      ]
    }
  ]
}
```
- The state initialises empty set objects based on `prescribedSets` when the user selects a day.
- Notes are tracked globally per session, not per exercise.

---

### 5. Outbound Logging Payload Contract
When the user taps "Log Session", the app must construct a flat, set-based array and wrap it in an envelope (`apex_session`) for the webhook. 

**Payload Envelope:**
```json
{
  "type": "apex_session",
  "version": "1",
  "meta": {
    "date": "2026-06-05",
    "block": "phase1",
    "day": 1,
    "notes": "Session notes here"
  },
  "rows": [ ... ]
}
```

**Row Object (One per set):**
- Each row contains session metadata (`date`, `block`, `day`, `notes`) repeated on every row.
- Each row contains the plan metadata (`exercisePlanId`, `exerciseName`, `target`, `supersetLabel`, `prescribedSets`, `prescribedReps`, `prescribedRpe`).
- Each row contains the actual logged data (`setNumber`, `load`, `repsCompleted`, `rpeLogged`).

*Note: The webhook URL injection is currently out of scope for this document and will happen natively during the payload builder implementation.*

---

### 6. WorkoutLog Google Sheet Schema
The deployed Google Sheet has 18 permanent columns. The Apps Script matches JSON payload keys to these exact headers.

1. `Date`
2. `Block`
3. `Day`
4. `ExercisePlanId` (Immutable key)
5. `ExerciseName`
6. `Target`
7. `SupersetLabel`
8. `PrescribedSets`
9. `PrescribedReps`
10. `PrescribedRpe`
11. `SetNumber`
12. `Load (kg)`
13. `RepsCompleted`
14. `RpeLogged`
15. `Notes`
16. `SessionType` ← **Added June 2026.** Values: `training` | `rest` | `recovery`.
17. `SessionId` ← **Added June 2026.** Unique ID for grouping rows of a single session. Used for soft deletion.
18. `Status` ← **Added June 2026.** Values: `active` | `cancelled`. Soft delete flag.

---

### 7. Supersets vs Single Exercises Rule
The schema guarantees compatibility for any combination of supersets and single exercises.
- **Rule:** `supersetLabel` is strictly optional.
- Standalone exercises send `null` or `""` for this field in the payload.
- A training day can consist of 100% supersets, 100% single exercises, or any mix in between.
- No schema or Apps Script changes are required when the plan's superset composition changes.

---

### 8. Future-Block Compatibility Rules
To ensure zero technical debt when deploying Phase 2 and beyond:
1. **Plan Data is the Switch:** Changing a training block only requires creating a new `plan-phaseX.json` file and importing it into the app.
2. **Stable IDs:** Any new exercise introduced in a new block must be assigned a completely new, unique `id` (e.g., `p2-d1-ex1`). 
3. **No Schema Edits:** Because the Google Sheet accepts a flat list of sets with repeated metadata, changes in total set volume or exercise volume do not require adding or removing columns.

---

### 9. Implementation Notes for Upcoming Refactor
When executing the frontend refactor, adhere to the following checklist:
- Remove all `%1RM` and `e1RM` calculation logic (e.g., from `utils/math.js` and `useHistory.js`).
- Remove the old `ex1-s1` mapping logic inside `HUD.jsx` and `db/index.jsx`.
- The webhook URL must be converted into a hardcoded application constant inside the app codebase.
- Do **not** point the old Fighter's OS payload at the new Apex Protocol webhook. The webhook configuration swap must occur in the exact same commit as the payload generation rewrite.

---

### 10. Open Items / Non-Goals
- **Incomplete Sets:** The logic to filter out incomplete sets (e.g., a set where the user left `load` and `reps` blank) is handled by the Google Apps Script. The frontend payload builder should just send all sets, or do minimal filtering.
- **Session Completeness Metric:** The previous system tracked a % complete. This is currently omitted from the new schema as it relies heavily on static exercise counts.
- **History Rendering UI:** How the app queries Dexie to display previous weights using `exercisePlanId` will be defined during the UI implementation phase.
