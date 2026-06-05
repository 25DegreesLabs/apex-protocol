# APEX PROTOCOL — WorkoutLog Schema Reference
## Version 1.0 / June 2026

---

## Model

**One row per set.**

Every set logged by Emmanuel produces exactly one row. There is no fixed limit on exercises or sets per session. A session with 5 exercises × 3 sets = 15 rows. A future session with 7 exercises × 4 sets = 28 rows. The sheet schema never changes.

---

## Sheet name

```
WorkoutLog
```

Case-sensitive. Must match exactly.

---

## Columns

| Col | Field Name | Header | Type | Required | Notes |
|-----|-----------|--------|------|----------|-------|
| A | `date` | Date | Date | Yes | Session date. Format: dd MMM yyyy. Written as ISO string from app, formatted by script. |
| B | `block` | Block | Text | Yes | Training block identifier. Matches the `block` field in the plan JSON. e.g. `phase1`, `phase2`. |
| C | `day` | Day | Number | Yes | Day number within the block. 1–4 in Phase 1. |
| D | `exercisePlanId` | ExercisePlanId | Text | Yes | **Stable, immutable identifier** for the exercise. Format: `p{phase}-d{day}-ex{n}`. Never change this once live. History lookups depend on it. |
| E | `exerciseName` | ExerciseName | Text | Yes | Human-readable exercise name at the time of logging. May change across phases — the `exercisePlanId` is the stable key. |
| F | `target` | Target | Text | Yes | Muscle group or movement pattern. e.g. `Chest / Anterior Deltoid`. |
| G | `supersetLabel` | SupersetLabel | Text | **Optional** | Superset group identifier. e.g. `A1`, `A2`, `B1`. **Leave blank (empty string or null) for single, non-superset exercises.** Rows with a blank SupersetLabel are valid and fully supported. |
| H | `prescribedSets` | PrescribedSets | Number | Yes | Number of sets prescribed in the plan for this exercise. |
| I | `prescribedReps` | PrescribedReps | Text | Yes | Rep target from the plan. Always a string to support ranges. e.g. `10–12`, `8–10`, `AMRAP`. |
| J | `prescribedRpe` | PrescribedRpe | Number | Yes | RPE target from the plan. Integer 1–10. |
| K | `setNumber` | SetNumber | Number | Yes | Set number within this exercise in this session. Starts at 1. |
| L | `load` | Load (kg) | Number | Conditional | Weight used by Emmanuel in kg. Decimal allowed (e.g. 17.5). **Empty/null = incomplete set.** Incomplete sets are skipped by the script unless `repsCompleted` is also present. |
| M | `repsCompleted` | RepsCompleted | Number | Conditional | Reps completed by Emmanuel. **Empty/null = incomplete set.** |
| N | `rpeLogged` | RpeLogged | Number | Optional | RPE logged by Emmanuel after the set. Integer 1–10. Can be null if Emmanuel did not log RPE. |
| O | `notes` | Notes | Text | Optional | Session-level free text note. Same value repeated on every row of the session. Can be empty. |

---

## Completeness rule

A set row is considered complete and worth logging when it has:
- a valid `exercisePlanId` (not null/empty), AND
- a valid `setNumber` (not null/zero), AND
- at least one of: `load` OR `repsCompleted` (not null/empty)

Rows that fail this check are silently skipped by the Apps Script.

---

## `supersetLabel` — detail

This field is explicitly optional. The three valid states are:

| State | Value in payload | Value in sheet | Meaning |
|-------|-----------------|----------------|---------|
| Superset | `"A1"` | `A1` | Part of superset group A, first exercise |
| Superset | `"A2"` | `A2` | Part of superset group A, second exercise |
| Single exercise | `null` or `""` | *(blank cell)* | Standalone, no superset |

Mixed days (some exercises with a label, some without) produce mixed rows. This is correct and expected. No schema change is needed.

---

## `exercisePlanId` — immutability rule

> **This is the most important rule in the entire schema.**

The `exercisePlanId` is the stable key used to look up an exercise's history. It must never be changed once it is live in the sheet.

- New exercise = new `id`. Always.
- If you rename an exercise, update the name in the plan but **do not change the id**.
- If you retire an exercise and replace it with a different one, the new exercise gets a new id (e.g. `p1-d1-ex4b` or `p2-d1-ex1`).
- Changing an existing id breaks history lookups for that exercise.

---

## Future phase extension

When a new training block is introduced:

1. Add a new plan JSON file with new exercise ids (e.g. `p2-d1-ex1`, `p2-d1-ex2`...).
2. New sessions log to the same `WorkoutLog` sheet under `block: "phase2"`.
3. Filter by column B (Block) to see phase-specific data.
4. No new columns needed.
5. No script changes needed.

---

## Optional: Sessions summary tab

A lightweight `Sessions` tab can be added to the sheet using Google Sheets formulas only (no script changes). It provides one row per session for the coach to review at a glance.

Suggested formula approach using `QUERY()`:

```
=QUERY(WorkoutLog!A:O,
  "SELECT A, B, C, COUNT(K), MAX(O)
   WHERE A IS NOT NULL AND A != 'Date'
   GROUP BY A, B, C
   ORDER BY A DESC",
  1)
```

Column headers for Sessions tab: `Date`, `Block`, `Day`, `SetsLogged`, `Notes`

This is optional and does not affect the logging pipeline.
