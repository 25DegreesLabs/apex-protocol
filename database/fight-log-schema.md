# Fight Log — Schema Reference

This file documents the column structure of the `Fight Log` Google Sheet tab.
The PWA appends one row per logged session via the Apps Script Webhook.

## Google Sheet: `Fight Log`
Tab name: `FightLog`

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | Date | Date | ISO 8601, set by webhook |
| B | Day | Number | 1–6 (rolling day) |
| C | Phase | Number | 1, 2, or 3 |
| D | Hip_Score | Number | 1–5 |
| E | Ex1_S1_kg | Number | Exercise 1, Set 1 load |
| F | Ex1_S1_reps | Number | Exercise 1, Set 1 reps |
| G | Ex1_S2_kg | Number | |
| H | Ex1_S2_reps | Number | |
| I | Ex1_S3_kg | Number | |
| J | Ex1_S3_reps | Number | |
| K | Ex1_S4_kg | Number | |
| L | Ex1_S4_reps | Number | |
| M–X | Ex2–Ex4 sets | Number | Same pattern ×3 |
| Y | Core_Accessories | Text | e.g. "Hanging Leg Raises — 3x15" (Multi-line) |
| Z | Mob_Done | Number | Count of mobility checkboxes ticked (0–5) |
| AA | Clr_Done | Number | Count of cooldown checkboxes ticked (0–5) |
| AB | Bag_Rounds | Number | Bag rounds completed |
| AC | Bag_Course | Text | e.g. "Varga" |
| AD | Bag_Modules| Text | e.g. "Counters 1" |
| AE | Bag_Workouts| Text| e.g. "4.1 Bagwork Counters" |
| AF | Notes | Text | Session notes |
| AG | Completeness_% | Number | 0–100 |

## JSON Payload (sent by PWA → Webhook)

```json
{
  "date": "2026-03-10",
  "day": 1,
  "phase": 1,
  "hipScore": 3,
  "strength": [
    { "ex": 1, "sets": [{ "kg": 80, "reps": 5 }, { "kg": 82, "reps": 4 }, ...] },
    ...
  ],
  "core": [
    { "ex": "Hanging Leg Raises", "sets": 3, "reps": 15 }
  ],
  "mobDone": 4,
  "clrDone": 5,
  "bagRounds": 6,
  "bagCourse": "Varga",
  "bagModules": "Counters 1",
  "bagWorkouts": "4.1 Bagwork Counters",
  "notes": "Felt strong today",
  "completeness": 87.5
}
```
