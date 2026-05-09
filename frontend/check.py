import os, re
d = 'src'
files = os.listdir(d)
lmap = {f.lower(): f for f in files}
err = False
for f in files:
  if f.endswith('.jsx') or f.endswith('.js'):
    text = open(os.path.join(d, f), encoding='utf-8').read()
    for match in re.findall(r'import\s+.*?\s+from\s+[\'\"](?:\.\/|\.\.\/)([^\'\"]+)[\'\"]', text):
      bn = os.path.basename(match)
      exp = bn
      if not exp.endswith('.jsx') and not exp.endswith('.js') and not exp.endswith('.css'):
        if bn.lower() + '.jsx' in lmap: exp += '.jsx'
        elif bn.lower() + '.js' in lmap: exp += '.js'
      act = lmap.get(exp.lower())
      if act and act != exp:
        print(f'Mismatch in {f}: imported {match}, actual file {act}')
        err = True
if not err: print('No case mismatches')
