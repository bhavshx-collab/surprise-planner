import json
data = json.load(open('lint.json', encoding='utf-8'))
for f in data:
  for msg in f['messages']:
    if msg['severity'] == 2:
      print(f"{f['filePath'].split('\\')[-1]}:{msg['line']} - {msg.get('ruleId', 'none')} : {msg['message']}")
