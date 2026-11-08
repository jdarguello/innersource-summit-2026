"""Append/update only the final deck's closing; preserve Juan's existing scenes."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'presentation-final.html'
s=p.read_text()
fragment=(root/'deck/closing.html').read_text()
pattern=r'<!-- FINAL SOCIAL CLOSING -->[\s\S]*?<!-- END FINAL SOCIAL CLOSING -->\n?'
if re.search(pattern,s):
 s,n=re.subn(pattern,lambda _:fragment,s,count=1)
 assert n==1
else:
 anchor='\n</div>\n\n<div id="blk"'
 assert s.count(anchor)==1
 s=s.replace(anchor,'\n'+fragment+anchor,1)
# Reuse the existing loop lifecycle manager for the subtle closing illustration.
s=s.replace("scene?.classList.contains('opening')&&!reduce()","scene?.matches('.opening,.social-close')&&!reduce()")
p.write_text(s)
print('Updated final closing, slide 25; prior scenes preserved.')
