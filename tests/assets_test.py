import unittest,json,re
from pathlib import Path
from PIL import Image
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]/'dist'
DATA=json.loads((ROOT/'data.js').read_text().split('=',1)[1].strip().rstrip(';'))['products']
class Images(unittest.TestCase):
 def test_responsive_images_preserve_proportions_and_reduce_bytes(self):
  mapping=json.loads((ROOT/'image-manifest.json').read_text())
  self.assertGreaterEqual(len(mapping),11)
  for source,item in mapping.items():
   original=ROOT/source.lstrip('/')
   with Image.open(original) as im:w,h=im.size
   self.assertGreaterEqual(len(item['variants']),2)
   for variant in item['variants']:
    target=ROOT/variant['src'].lstrip('/')
    with Image.open(target) as im:vw,vh=im.size
    self.assertEqual(vw,variant['width']);self.assertLess(abs(vw/vh-w/h),.01)
    self.assertLess(target.stat().st_size,original.stat().st_size)
  home=(ROOT/'index.html').read_text();self.assertIn('srcset=',home);self.assertIn('fetchpriority="high"',home)
 def test_originals_and_dynamic_images_remain_mapped(self):
  mapping=json.loads((ROOT/'image-manifest.json').read_text())
  for p in DATA:self.assertIn(p['image'],mapping)
  self.assertIn('FluidtechImages.apply',(ROOT/'app.js').read_text())
class Datasheets(unittest.TestCase):
 def test_every_product_has_readable_complete_datasheet_and_download(self):
  for p in DATA:
   file=ROOT/'datasheets'/f"{p['slug']}.pdf";reader=PdfReader(file);text=' '.join(page.extract_text() for page in reader.pages)
   self.assertIn(p['name'],text);self.assertIn('fluidtechindia@gmail.com',text)
   self.assertLessEqual(len(reader.pages),3)
   if p['models']:
    for row in p['models']['rows']:
     for val in row:self.assertIn(val,text)
   elif not p['metrics']:self.assertIn('not published',text)
   html=(ROOT/p['url'].strip('/')/'index.html').read_text();self.assertIn(f'/datasheets/{p["slug"]}.pdf',html)
if __name__=='__main__':unittest.main()
