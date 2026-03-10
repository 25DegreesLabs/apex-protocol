"""
Convert playbook.csv → src/data/playbook.js (ES module)
Run this whenever playbook.csv changes.
Usage: python scripts/csv_to_js.py
"""
import csv, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, 'playbook.csv')
OUT_PATH = os.path.join(ROOT, 'app', 'src', 'data', 'playbook.js')

rows = []
with open(CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Strip whitespace from all fields
        clean = {k.strip(): v.strip() for k, v in row.items() if k}
        if clean.get('Key'):
            rows.append(clean)

js_content = f"// Auto-generated from playbook.csv — do not edit directly\n"
js_content += f"// Run: python scripts/csv_to_js.py to regenerate\n"
js_content += f"const PLAYBOOK = {json.dumps(rows, indent=2, ensure_ascii=False)};\n"
js_content += f"export default PLAYBOOK;\n"

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"✅ Generated {OUT_PATH} with {len(rows)} rows")
