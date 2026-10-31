"""Generate delivery variants without changing source photographs or machine geometry."""
from pathlib import Path
import json,re,html
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]/'dist'
data=json.loads((ROOT/'data.js').read_text().split('=',1)[1].strip().rstrip(';'))
sources=[p['image'] for p in data['products']]+['/assets/brand/home-banner-cable-connection.png','/assets/products/horizontal-bead-mill-home.png']
out=ROOT/'assets/responsive';out.mkdir(exist_ok=True)
mapping={}
for source in sources:
 original=ImageOps.exif_transpose(Image.open(ROOT/source.lstrip('/'))).convert('RGB');w,h=original.size
 variants=[]
 for width in sorted(set([min(480,w),min(960,w),min(1600,w)])):
  target=out/f'{Path(source).stem}-{width}.webp'
  original.resize((width,round(h*width/w)),Image.Resampling.LANCZOS).save(target,'WEBP',quality=85,method=6)
  variants.append({'src':'/'+str(target.relative_to(ROOT)),'width':width})
 mapping[source]={'variants':variants,'width':w,'height':h}
(ROOT/'image-manifest.json').write_text(json.dumps(mapping,indent=2)+'\n')
script='window.FLUIDTECH_IMAGES = '+json.dumps(mapping,separators=(',',':'))+';\n'+'''window.FluidtechImages = {apply(image, source, sizes) {
 const item=window.FLUIDTECH_IMAGES[source];
 if(!item){image.removeAttribute('srcset');image.removeAttribute('sizes');image.src=source;return;}
 image.srcset=item.variants.map(v=>v.src+' '+v.width+'w').join(', ');
 image.sizes=sizes||'(max-width: 700px) 92vw, 50vw';
 image.src=item.variants[item.variants.length-1].src;
 image.width=item.width;image.height=item.height;
}};\n'''
(ROOT/'responsive-images.js').write_text(script)
for path in ROOT.rglob('*.html'):
 s=path.read_text()
 def replace(match):
  tag=match.group(0);m=re.search(r'\bsrc="([^"]+)"',tag)
  if not m:return tag
  source=m.group(1)
  # Re-running is idempotent: preserve already-generated image tags.
  if source not in mapping:return tag
  item=mapping[source];vs=item['variants']
  tag=re.sub(r'\bsrc="[^"]+"','src="'+vs[-1]['src']+'"',tag)
  tag=re.sub(r'\s(?:srcset|sizes)="[^"]*"','',tag)
  size='(max-width: 700px) 100vw, 72vw' if 'home-banner' in source else '(max-width: 700px) 92vw, 50vw'
  return tag[:-1]+' srcset="'+', '.join(v['src']+' '+str(v['width'])+'w' for v in vs)+'" sizes="'+size+'">'
 s=re.sub(r'<img\b[^>]*>',replace,s)
 if '/responsive-images.js?' not in s:s=s.replace('<script src="/data.js', '<script src="/responsive-images.js?v=1" defer></script><script src="/data.js')
 path.write_text(s)
print('Created responsive variants for',len(mapping),'images')
