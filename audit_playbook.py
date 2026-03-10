import csv
from collections import defaultdict

rows = []
with open('playbook.csv', newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f'Total rows: {len(rows)}')

# Check which Phase-Day combos exist
combos = defaultdict(set)
for r in rows:
    key = 'P' + r['Phase'] + '-D' + r['Day']
    combos[key].add(r['Block'])

print('\n=== Phase-Day combos present ===')
for k in sorted(combos.keys()):
    print('  ' + k + ': ' + str(sorted(combos[k])))

print('\n=== Missing combos ===')
for p in ['1','2','3']:
    for d in ['1','2','3','4','5','6']:
        key = 'P' + p + '-D' + d
        if key not in combos:
            print('  MISSING: ' + key)

print('\n=== HA variant coverage (by Phase-Day) ===')
ha_days = defaultdict(list)
for r in rows:
    if r['Variant'] == 'HIGH_ALERT':
        key = 'P' + r['Phase'] + '-D' + r['Day']
        ha_days[key].append(r['Slot'])
for k in sorted(ha_days.keys()):
    print('  ' + k + ' HA slots: ' + str(ha_days[k]))

print('\n=== STR slot counts per Phase-Day ===')
str_counts = defaultdict(int)
for r in rows:
    if r['Block'] == 'STRENGTH':
        key = 'P' + r['Phase'] + '-D' + r['Day']
        str_counts[key] += 1
for k in sorted(str_counts.keys()):
    print('  ' + k + ': ' + str(str_counts[k]) + ' strength slots')
