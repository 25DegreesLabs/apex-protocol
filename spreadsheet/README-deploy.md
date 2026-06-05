# APEX PROTOCOL — Spreadsheet Pipeline
## Deployment & Setup Instructions

**Project:** Apex Protocol / Emmanuel (Project B)
**Author:** Pepe x Metzcore
**Last updated:** June 2026

---

## Files in this folder

| File | Purpose |
|------|---------|
| `apex-protocol-webhook.gs` | Google Apps Script — webhook endpoint |
| `sample-payload.json` | Sample POST payload for manual testing |
| `schema.md` | WorkoutLog column reference |
| `README-deploy.md` | This file |

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) and create a new blank spreadsheet.
2. Name it: **APEX PROTOCOL — Workout Log** (or similar).
3. Inside the sheet, create one tab named exactly:

   ```
   WorkoutLog
   ```

   The tab name is case-sensitive. The Apps Script expects this exact name.

4. Leave the sheet empty — the script will write the header row on first use.

---

## Step 2 — Add the Apps Script

1. With the Google Sheet open, go to **Extensions → Apps Script**.
2. Delete all default code in the editor (the empty `myFunction` stub).
3. Copy the entire contents of `apex-protocol-webhook.gs` and paste it into the editor.
4. Click **Save** (Ctrl+S / Cmd+S). Name the project: `ApexProtocol-Webhook`.

---

## Step 3 — Test the sheet setup (before deploying)

1. In the Apps Script editor, select the function `testInject` from the function dropdown.
2. Click **Run**.
3. Grant permissions when prompted (first run only).
4. Switch back to the Google Sheet — you should see:
   - Row 1: Header row with 15 columns (bold, dark background).
   - Rows 2–4: Three sample sets appended (the fourth row in the sample is incomplete and should be skipped).
5. If you see an alert saying the sheet was not found, verify the tab is named `WorkoutLog` exactly.

---

## Step 4 — Deploy the webhook

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure:
   - **Description:** `Apex Protocol Workout Logger v1`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`  ← required so the app can POST without auth
4. Click **Deploy**.
5. Copy the **Web app URL** — it will look like:

   ```
   https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXXXXX/exec
   ```

6. Save this URL. You will need it in Step 5.

> ⚠️ Every time you redeploy (e.g. after editing the script), Google generates a **new URL**. Always copy the latest URL after redeploying and update it in the app settings.

---

## Step 5 — Connect the app

Once the React app is updated to use the new logging pipeline:

1. Open the app settings in the browser (Settings tab).
2. Paste the webhook URL from Step 4 into the **Webhook URL** field.
3. The app writes this to IndexedDB (Dexie `settings` table, key `webhookUrl`).
4. Log a test session and verify the row appears in the `WorkoutLog` sheet.

> The app sends data using `fetch()` with `mode: 'no-cors'`. This means the response will always be opaque — the app cannot read the JSON response from the script. This is expected behaviour. Verify success by checking the sheet directly.

---

## WorkoutLog schema — column reference

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | Date | Date (dd MMM yyyy) | Session date |
| B | Block | Text | e.g. `phase1`, `phase2` |
| C | Day | Number | Day number (1–4) |
| D | ExercisePlanId | Text | Stable exercise ID — never changes |
| E | ExerciseName | Text | Display name at time of logging |
| F | Target | Text | Muscle / movement pattern |
| G | SupersetLabel | Text | e.g. `A1`, `B2` — blank for single exercises |
| H | PrescribedSets | Number | Sets from the plan |
| I | PrescribedReps | Text | Rep range from the plan (e.g. `10–12`) |
| J | PrescribedRpe | Number | RPE target from the plan |
| K | SetNumber | Number | Set number within the exercise (1, 2, 3…) |
| L | Load (kg) | Number | Weight entered by Emmanuel |
| M | RepsCompleted | Number | Reps completed by Emmanuel |
| N | RpeLogged | Number | RPE logged by Emmanuel |
| O | Notes | Text | Session-level note — same on every row |

**These 15 columns are permanent.** Do not insert, delete, or reorder them. The script maps field names to these positions. If a future update needs to add data, append new columns (P, Q, etc.).

---

## Future phases

When Phase 2 / Phase 3 training plans are ready:

1. Add the new plan JSON file to `app/src/data/` (e.g. `plan-phase2.json`).
2. Update the app to load the new plan for the new block.
3. The `ExercisePlanId` for new exercises will follow the new prefix (`p2-d1-ex1`, etc.).
4. No changes to the Apps Script.
5. No changes to the Google Sheet schema.

The `WorkoutLog` sheet simply accumulates all rows from all phases in one place. You can filter by column B (Block) or D (ExercisePlanId) to separate phases.

---

## Troubleshooting

**Rows not appearing in sheet after logging:**
- Confirm the webhook URL in app settings matches the current deployed URL.
- Check that the sheet tab is named `WorkoutLog` exactly.
- Remember: `no-cors` mode means the app cannot detect script errors. Run `testInject()` manually to verify the script is working.

**Script asks for permissions on every run:**
- Normal on first run. Click "Review permissions" → "Advanced" → "Go to ApexProtocol-Webhook (unsafe)" → Allow.

**Header row missing:**
- The `ensureHeaders()` function only writes headers if the sheet is completely empty (0 rows). If the sheet has a blank row at the top, delete it and run `testInject()` again.

**Date column shows a number instead of a date:**
- The script applies `setNumberFormat('dd MMM yyyy')` to every appended row. If you see a raw number, select the Date column → Format → Number → Date.
