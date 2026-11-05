import re,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
base=(root/'presentation-full.html').read_text()
start=base.index('<!-- ══════════════ 02 · WHO WE ARE')
end=base.index('<!-- ══════════════ 05 · IAC LAYERS')
schedule=json.loads((root/'deck/storyboard.json').read_text())
opening_count=len(schedule)
fragments=sorted((root/'deck/opening').glob('*.html'))
assert len(fragments)==opening_count-1
result=base[:start]+'\n'.join(p.read_text() for p in fragments)+'\n'+base[end:]
# Preserve Juan's content and the original player before additive enhancement.
assert result[result.index('<!-- ══════════════ 05 · IAC LAYERS'):]==base[end:]
assert result[:start]==base[:start]
total_count=opening_count+19
assert len(re.findall(r'<section class="slide\b',result))==total_count
assert sum(s['seconds'] for s in schedule)==480
# Welcome timing/notes change; the original cover design is preserved.
result=result.replace('data-time="0:30"','data-time="0:20"',1)
cover_note_start=result.index('<aside class="notes">',result.index('<section class="slide'))
cover_note_end=result.index('</aside>',cover_note_start)+len('</aside>')
result=result[:cover_note_start]+'<aside class="notes"><p class="t">0:20 · Oscar + Juan · Welcome</p><p>We are Oscar Lobaton and Juan David Arguello Plata. I will start with the context and the opportunity: taking InnerSource from shared components to a shared platform foundation. Juan David will then show how the architecture works.</p></aside>'+result[cover_note_end:]
# Add only speaker metadata to existing slide markup. No technical content edits.
count=0
def speaker(m):
 global count
 count+=1
 if count==1:name,scope='OSCAR + JUAN',f'WELCOME · 1 / {opening_count}'
 elif count<=opening_count:name,scope='OSCAR',f'INTRODUCTION · {count} / {opening_count}'
 elif count<=total_count-2:name,scope='JUAN DAVID','TECHNICAL'
 else:name,scope='OSCAR + JUAN','CLOSING'
 return m.group(0)+f'<div class="speaker-badge" data-speaker="{name}"><span class="speaker-dot"></span><span>{name}</span><span class="speaker-scope">{scope}</span></div>'
result=re.sub(r'<section class="slide\b[^>]*>',speaker,result)
assert count==total_count
result=result.replace('</head>','<style id="opening-visual-style">'+(root/'deck/opening.css').read_text()+'</style></head>',1)
result=result.replace('<div id="deck">',(root/'deck/illustrations.svg').read_text()+'\n<div id="deck">',1)
addon=f'<nav class="speaker-map" aria-label="Presenter sections"><a href="#2"><b>Oscar</b> · 1–{opening_count}</a><a href="#{opening_count+1}"><b>Juan David</b> · {opening_count+1}–{total_count-2}</a></nav><script id="opening-visual-motion">'+(root/'deck/opening-motion.js').read_text()+'</script>'
assert result.count('</body>')==1
result=result.replace('</body>',addon+'\n</body>')
(root/'presentation.html').write_text(result)
print(f'Built {total_count} slides · {opening_count}-slide / 8:00 opening · original technical content and player preserved')
