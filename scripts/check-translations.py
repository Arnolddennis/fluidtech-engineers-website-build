"""Check every public page/data string against the three maintained dictionaries."""
from html.parser import HTMLParser
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]/'dist'
strings=set()
class Content(HTMLParser):
 def __init__(self): super().__init__(); self.skip=0
 def handle_starttag(self, tag, attrs):
  if tag in ('script','style'): self.skip+=1
  attrs=dict(attrs)
  for k,v in attrs.items():
   if k in ('aria-label','placeholder','alt') and v: strings.add(' '.join(v.split()))
  if tag=='meta' and attrs.get('name',attrs.get('property')) in ('description','og:title','og:description'):
   strings.add(' '.join(attrs.get('content','').split()))
 def handle_endtag(self,tag):
  if tag in ('script','style'): self.skip=max(0,self.skip-1)
 def handle_data(self,data):
  text=' '.join(data.split())
  if not self.skip and re.search('[a-zA-Z]',text): strings.add(text)
pages=list(ROOT.rglob('*.html'))
for page in pages:
 text=page.read_text()
 assert text.count('data-language-select')==1, page
 assert '/i18n.js?v=' in text and '/translations.js?v=' in text and '/i18n.css?v=' in text, page
 Content().feed(text)
data=json.loads((ROOT/'data.js').read_text().split('=',1)[1].strip().rstrip(';'))
def walk(value):
 if isinstance(value,dict):
  for key,item in value.items():
   if key not in ('slug','url','image','family','number'): walk(item)
 elif isinstance(value,list):
  for item in value:walk(item)
 elif isinstance(value,str) and re.search('[a-zA-Z]',value):strings.add(' '.join(value.split()))
walk(data)
preserved=set(json.loads((Path(__file__).parent/'translation-preserved.json').read_text()))
keys=None
for language in ('de','es','fr'):
 dictionary=json.loads((ROOT/'locales'/f'{language}.json').read_text())
 assert keys is None or keys==set(dictionary),'Dictionary keys differ'
 keys=set(dictionary)
 missing=[s for s in strings if s not in keys and s not in preserved and not re.match(r'^FEATTO-',s) and not re.match(r'^[\d.,–−\s]+(?:L|kW|L/h)$',s)]
 assert not missing, (language,sorted(missing))
 assert all(isinstance(v,str) and v.strip() for v in dictionary.values()),'Empty translation'
print(f'PASS: {len(pages)} pages, {len(strings)} unique source strings, {len(keys)} entries per language; no missing translations.')
