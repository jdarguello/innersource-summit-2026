import re,json,html
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
# Use the user-supplied portraits in the original cover's image slots.
assert result.count('src="assets/oscar.jpg"')==1
assert result.count('src="assets/headshot.jpg"')==1
result=result.replace('src="assets/oscar.jpg"','src="assets/oscar.png"',1)
result=result.replace('src="assets/headshot.jpg"','src="assets/juan.png"',1)
# Current speaker data supplied by Oscar; the original snapshot remains intact.
profile=json.loads((root/'deck/speaker.json').read_text())
assert result.count('Oscar<br>Lobaton</div>')==1
result=result.replace('Oscar<br>Lobaton</div>','Oscar<br>Lobaton Salas</div>',1)
assert result.count('Role · Company …</div>')==2
result=result.replace('Role · Company …</div>',html.escape(profile['role'])+'</div>')
result=result.replace('<div class="n">Oscar Lobaton</div>','<div class="n">'+html.escape(profile['name'])+'</div>',1)
result=result.replace('class="role ph-role"','class="role"',1)
result=result.replace('<div class="r ph">','<div class="r">',1)
# The bio lives in notes so the cover stays readable and the eight-minute script
# stays short. It is available to the host, rather than an extra timed scene.
bio='<p class="speaker-bio"><b>Speaker bio · Oscar Lobaton Salas</b><br>'+html.escape(profile['bio'])+'</p>'
cover_note_start=result.index('<aside class="notes">',result.index('<section class="slide'))
cover_note_end=result.index('</aside>',cover_note_start)
result=result[:cover_note_end]+bio+result[cover_note_end:]
result=result.replace("Oscar's role, company, LinkedIn and GitHub","Oscar's LinkedIn and GitHub")
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
# Hidden scenes retain their source and numbering; navigation skips them.
for number,scene in enumerate(schedule,1):
 if scene.get('hidden'):
  pattern=r'(<section class="slide\b[^>]*\bintro'+f'{number:02}'+r'\b[^>]*)(>)'
  result,n=re.subn(pattern,r'\1 data-hidden="true"\2',result,count=1)
  assert n==1
hidden_navigation="""  function skipHidden(n, direction = 1) {
    n = clamp(n, 0, slides.length - 1);
    const shown = slides.map((s, k) => s.hasAttribute('data-hidden') ? -1 : k).filter(k => k >= 0);
    return direction < 0 ? (shown.filter(k => k <= n).at(-1) ?? shown[0]) : (shown.find(k => k >= n) ?? shown.at(-1));
  }
"""
a='  /* ---------- state → DOM ---------- */'
assert result.count(a)==1
result=result.replace(a,hidden_navigation+a)
a='    motion.cancel();\n    const from = slides[i];'
assert result.count(a)==1
result=result.replace(a,'    n = skipHidden(n, n < i ? -1 : 1);\n'+a)
a='let i = clamp((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, slides.length - 1);'
assert result.count(a)==1
result=result.replace(a,'let i = skipHidden(clamp((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, slides.length - 1));')
a="slides.forEach(s => { s.classList.add('active'); applyState(s, maxOf(s)); });"
assert result.count(a)==1
result=result.replace(a,"slides.filter(s => !s.hasAttribute('data-hidden')).forEach(s => { s.classList.add('active'); applyState(s, maxOf(s)); });")

a='const n = clamp((a || 1) - 1, 0, slides.length - 1), s = b || 0;'
assert result.count(a)==1
result=result.replace(a,'const n = skipHidden(clamp((a || 1) - 1, 0, slides.length - 1)), s = b || 0;')
a='if (n !== i || s !== step) render(n, s,'
assert result.count(a)==1
result=result.replace(a,'if (n !== i || s !== step || n !== (a || 1) - 1) render(n, s,')
assert count==total_count
result=result.replace('</head>','<style id="opening-visual-style">'+(root/'deck/opening.css').read_text()+'</style></head>',1)
result=result.replace('<div id="deck">',(root/'deck/illustrations.svg').read_text()+'\n<div id="deck">',1)
addon=f'<nav class="speaker-map" aria-label="Presenter sections"><a href="#2"><b>Oscar</b> · 1–{opening_count}</a><a href="#{opening_count+1}"><b>Juan David</b> · {opening_count+1}–{total_count-2}</a></nav><script id="opening-visual-motion">'+(root/'deck/opening-motion.js').read_text()+'</script>'
assert result.count('</body>')==1
result=result.replace('</body>',addon+'\n</body>')
(root/'presentation.html').write_text(result)
print(f'Built {total_count} slides · {opening_count}-slide / 8:00 opening · original technical content and player preserved')
