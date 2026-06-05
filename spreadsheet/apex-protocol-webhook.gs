/**
 * APEX PROTOCOL — Workout Logger
 * Google Apps Script — Webhook endpoint
 * ─────────────────────────────────────────────────────────────
 * Project: Apex Protocol / Emmanuel (Project B)
 * Author:  Pepe x Metzcore
 * Version: 1.0
 *
 * PAYLOAD CONTRACT
 * ─────────────────
 * Expects a POST request with a JSON body matching this envelope:
 *
 *   {
 *     "type":    "apex_session",
 *     "version": "1",
 *     "meta": {
 *       "date":  "2026-06-05",
 *       "block": "phase1",
 *       "day":   1,
 *       "notes": ""
 *     },
 *     "rows": [
 *       {
 *         "date":            "2026-06-05",
 *         "block":           "phase1",
 *         "day":             1,
 *         "exercisePlanId":  "p1-d1-ex1",
 *         "exerciseName":    "Dumbbell Bench Press",
 *         "target":          "Chest / Anterior Deltoid",
 *         "supersetLabel":   "A1",        ← null or "" for single exercises
 *         "prescribedSets":  3,
 *         "prescribedReps":  "10–12",
 *         "prescribedRpe":   7,
 *         "setNumber":       1,
 *         "load":            20,
 *         "repsCompleted":   12,
 *         "rpeLogged":       7,
 *         "notes":           ""
 *       },
 *       ...
 *     ]
 *   }
 *
 * SHEET CONTRACT
 * ──────────────
 * Target sheet name: "WorkoutLog"
 * Columns (A–O):
 *   A  Date            B  Block        C  Day
 *   D  ExercisePlanId  E  ExerciseName F  Target
 *   G  SupersetLabel   H  PrescribedSets  I  PrescribedReps
 *   J  PrescribedRpe   K  SetNumber    L  Load
 *   M  RepsCompleted   N  RpeLogged    O  Notes
 *
 * DEPLOYMENT
 * ──────────
 * See README-deploy.md in this folder for full setup instructions.
 */

// ── Sheet name constants ──────────────────────────────────────────────────────
var SHEET_NAME_LOG      = 'WorkoutLog';
var PAYLOAD_TYPE        = 'apex_session';
var PAYLOAD_VERSION     = '1';

// Column order for WorkoutLog — must stay in sync with README-deploy.md
var COLUMNS = [
  'date',
  'block',
  'day',
  'exercisePlanId',
  'exerciseName',
  'target',
  'supersetLabel',
  'prescribedSets',
  'prescribedReps',
  'prescribedRpe',
  'setNumber',
  'load',
  'repsCompleted',
  'rpeLogged',
  'notes'
];

// ── Main webhook handler ──────────────────────────────────────────────────────

/**
 * doPost — called by the app via fetch() POST.
 * Apps Script deployed as a web app receives POST via this function.
 */
function doPost(e) {
  try {
    // 1. Parse payload
    var raw     = e.postData && e.postData.contents ? e.postData.contents : '';
    var payload = JSON.parse(raw);

    // 2. Validate type + version
    if (payload.type !== PAYLOAD_TYPE) {
      return jsonResponse({ ok: false, error: 'Unknown payload type: ' + payload.type });
    }
    if (String(payload.version) !== PAYLOAD_VERSION) {
      return jsonResponse({ ok: false, error: 'Unsupported payload version: ' + payload.version });
    }

    // 3. Validate rows array
    if (!Array.isArray(payload.rows) || payload.rows.length === 0) {
      return jsonResponse({ ok: false, error: 'No rows in payload.' });
    }

    // 4. Get sheet
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var log = ss.getSheetByName(SHEET_NAME_LOG);
    if (!log) {
      return jsonResponse({ ok: false, error: 'Sheet not found: ' + SHEET_NAME_LOG });
    }

    // 5. Ensure header row exists
    ensureHeaders(log);

    // 6. Process rows — filter incomplete sets, append valid ones
    var appended = 0;
    var skipped  = 0;

    payload.rows.forEach(function(row) {
      if (!isRowComplete(row)) {
        skipped++;
        return;
      }
      var sheetRow = buildSheetRow(row);
      log.appendRow(sheetRow);

      // Format the date cell in col A as readable date
      var lastRow = log.getLastRow();
      log.getRange(lastRow, 1).setNumberFormat('dd MMM yyyy');

      appended++;
    });

    return jsonResponse({
      ok:       true,
      appended: appended,
      skipped:  skipped
    });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── Row validation ────────────────────────────────────────────────────────────

/**
 * A row is considered complete when it has:
 * - An exercise plan id
 * - A set number
 * - At least one of: load, repsCompleted (partial efforts still count)
 *
 * Rows with no load AND no reps are silently skipped.
 */
function isRowComplete(row) {
  if (!row.exercisePlanId)          return false;
  if (!row.setNumber)               return false;
  var hasLoad = row.load !== null && row.load !== '' && row.load !== undefined;
  var hasReps = row.repsCompleted !== null && row.repsCompleted !== '' && row.repsCompleted !== undefined;
  return hasLoad || hasReps;
}

// ── Row builder ───────────────────────────────────────────────────────────────

/**
 * Maps a payload row object to an ordered array matching COLUMNS.
 * Any field not present in the payload falls back to an empty string.
 */
function buildSheetRow(row) {
  return COLUMNS.map(function(col) {
    var val = row[col];
    if (val === null || val === undefined) return '';
    return val;
  });
}

// ── Header management ─────────────────────────────────────────────────────────

/**
 * If the sheet is empty, writes the header row using COLUMNS names.
 * Column headers are the human-readable equivalents of the field names.
 */
var HEADERS = [
  'Date',
  'Block',
  'Day',
  'ExercisePlanId',
  'ExerciseName',
  'Target',
  'SupersetLabel',
  'PrescribedSets',
  'PrescribedReps',
  'PrescribedRpe',
  'SetNumber',
  'Load (kg)',
  'RepsCompleted',
  'RpeLogged',
  'Notes'
];

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1a1a2e')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
}

// ── Response helper ───────────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Manual test helper (run from script editor to verify sheet setup) ─────────

/**
 * testInject — paste a sample payload and run this from the script editor.
 * Does NOT require the web app to be deployed.
 * Useful during initial setup to verify sheet structure.
 */
function testInject() {
  var samplePayload = {
    type:    'apex_session',
    version: '1',
    meta: {
      date:  '2026-06-05',
      block: 'phase1',
      day:   1,
      notes: 'Test inject'
    },
    rows: [
      {
        date:           '2026-06-05',
        block:          'phase1',
        day:            1,
        exercisePlanId: 'p1-d1-ex1',
        exerciseName:   'Dumbbell Bench Press',
        target:         'Chest / Anterior Deltoid',
        supersetLabel:  'A1',
        prescribedSets: 3,
        prescribedReps: '10–12',
        prescribedRpe:  7,
        setNumber:      1,
        load:           20,
        repsCompleted:  12,
        rpeLogged:      7,
        notes:          'Test inject'
      },
      {
        date:           '2026-06-05',
        block:          'phase1',
        day:            1,
        exercisePlanId: 'p1-d1-ex1',
        exerciseName:   'Dumbbell Bench Press',
        target:         'Chest / Anterior Deltoid',
        supersetLabel:  'A1',
        prescribedSets: 3,
        prescribedReps: '10–12',
        prescribedRpe:  7,
        setNumber:      2,
        load:           20,
        repsCompleted:  10,
        rpeLogged:      8,
        notes:          'Test inject'
      },
      {
        date:           '2026-06-05',
        block:          'phase1',
        day:            1,
        exercisePlanId: 'p1-d1-ex2',
        exerciseName:   'Dumbbell Row',
        target:         'Lats / Rear Deltoid',
        supersetLabel:  'A2',
        prescribedSets: 3,
        prescribedReps: '10–12',
        prescribedRpe:  7,
        setNumber:      1,
        load:           18,
        repsCompleted:  12,
        rpeLogged:      6,
        notes:          'Test inject'
      },
      {
        // Incomplete row — should be skipped (no load, no reps)
        date:           '2026-06-05',
        block:          'phase1',
        day:            1,
        exercisePlanId: 'p1-d1-ex3',
        exerciseName:   'Lateral Raise',
        target:         'Medial Deltoid',
        supersetLabel:  null,
        prescribedSets: 3,
        prescribedReps: '12–15',
        prescribedRpe:  6,
        setNumber:      1,
        load:           null,
        repsCompleted:  null,
        rpeLogged:      null,
        notes:          ''
      }
    ]
  };

  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName(SHEET_NAME_LOG);
  if (!log) {
    SpreadsheetApp.getUi().alert('Sheet "' + SHEET_NAME_LOG + '" not found. Create it first.');
    return;
  }

  ensureHeaders(log);

  var appended = 0;
  var skipped  = 0;

  samplePayload.rows.forEach(function(row) {
    if (!isRowComplete(row)) {
      skipped++;
      return;
    }
    var sheetRow = buildSheetRow(row);
    log.appendRow(sheetRow);
    var lastRow = log.getLastRow();
    log.getRange(lastRow, 1).setNumberFormat('dd MMM yyyy');
    appended++;
  });

  SpreadsheetApp.getUi().alert(
    '✅ Test Inject Complete',
    'Rows appended: ' + appended + '\nRows skipped (incomplete): ' + skipped,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
