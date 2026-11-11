"""Package the final static deck for Pages without publishing working files."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parents[1]
site = root / '_site'
if site.exists():
    shutil.rmtree(site)
site.mkdir()
source = root / 'presentation-final.html'
assert source.is_file()
assert 'function scheduleIntro()' in source.read_text()
shutil.copy2(source, site / 'index.html')
shutil.copy2(source, site / 'presentation-final.html')
shutil.copytree(root / 'assets', site / 'assets')
(site / '.nojekyll').touch()
assert (site / 'index.html').read_bytes() == source.read_bytes()
print('Pages package: final deck at / and /presentation-final.html; local assets included.')
