"""Build searchable English datasheets directly from the published catalogue."""
from pathlib import Path
import json,html
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,Image,KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
ROOT=Path(__file__).resolve().parents[1]/'dist';out=ROOT/'datasheets';out.mkdir(exist_ok=True)
products=json.loads((ROOT/'data.js').read_text().split('=',1)[1].strip().rstrip(';'))['products']
fontdir=Path('/System/Library/Fonts/Supplemental')
pdfmetrics.registerFont(TTFont('FluidSans',str(fontdir/'Arial.ttf')))
pdfmetrics.registerFont(TTFont('FluidSansBold',str(fontdir/'Arial Bold.ttf')))
blue=colors.HexColor('#004670');muted=colors.HexColor('#526776');line=colors.HexColor('#dae5ed');orange=colors.HexColor('#f39422')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyFluid',fontName='FluidSans',fontSize=9.5,leading=14,textColor=muted,spaceAfter=8))
styles.add(ParagraphStyle(name='TitleFluid',fontName='FluidSansBold',fontSize=25,leading=29,textColor=blue,spaceAfter=12))
styles.add(ParagraphStyle(name='SectionFluid',fontName='FluidSansBold',fontSize=12,leading=16,textColor=blue,spaceBefore=14,spaceAfter=8))
styles.add(ParagraphStyle(name='CellFluid',fontName='FluidSans',fontSize=8,leading=11,textColor=blue))
styles.add(ParagraphStyle(name='HeaderFluid',parent=styles['CellFluid'],fontName='FluidSansBold',textColor=colors.white))
def para(text,style='BodyFluid'):return Paragraph(html.escape(text),styles[style])
def chrome(c,doc):
 w,h=doc.pagesize;c.setFillColor(blue);c.rect(0,h-78,w,78,fill=1,stroke=0)
 c.setFont('FluidSansBold',14);c.setFillColor(colors.white);c.drawString(36,h-31,'FLUIDTECH ENGINEERS INDIA')
 c.setFont('FluidSans',8);c.drawString(36,h-47,'PRIVATE LIMITED  /  PRODUCT DATASHEET')
 c.setStrokeColor(orange);c.setLineWidth(3);c.line(36,h-64,w-36,h-64)
 c.setStrokeColor(line);c.setLineWidth(.6);c.line(36,57,w-36,57)
 c.setFillColor(muted);c.setFont('FluidSans',8);c.drawString(36,42,'fluidtechindia@gmail.com  |  +91 75400 40091 / +91 75400 40093')
 c.drawString(36,29,'Reference catalogue · Revision 2026-10-31');c.drawRightString(w-36,29,str(doc.page))
for p in products:
 doc=SimpleDocTemplate(str(out/f"{p['slug']}.pdf"),pagesize=(595.28,841.89),leftMargin=36,rightMargin=36,topMargin=97,bottomMargin=73,title=p['name']+' | Fluidtech',author='Fluidtech Engineers India Private Limited')
 story=[para(p['name'],'TitleFluid'),para(p['category'])]
 image=Image(str(ROOT/p['image'].lstrip('/')));image._restrictSize(220,170)
 intro=Table([[ [para(p['intro']),para('Discuss your material, target result and planned capacity with our engineers.')],image]],colWidths=[275,248]);intro.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),12)]));story.append(intro)
 story.append(para('Technical overview','SectionFluid'))
 if p['models']:
  m=p['models'];rows=[[para(v,'HeaderFluid')for v in m['headers']]]+[[para(v,'CellFluid')for v in row]for row in m['rows']]
  widths=[150]+[(523-150)/(len(m['headers'])-1)]*(len(m['headers'])-1)
 elif p['metrics']:
  rows=[[para(v,'HeaderFluid') for v in ['Specification','Published range']]]+[[para(v,'CellFluid')for v in row]for row in p['metrics']];widths=[240,283]
 else:rows=None;story.append(para('Model-specific capacities, drive ratings and dimensions are not published in the current catalogue. Request an application review for a confirmed configuration.'))
 if rows:
  table=Table(rows,colWidths=widths,repeatRows=1,hAlign='LEFT');table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),blue),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#f0f5f9'),colors.white]),('GRID',(0,0),(-1,-1),.4,line),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),('LEFTPADDING',(0,0),(-1,-1),8)]));story.append(table)
 if p['slug']=='three-roll-mill':story.extend([Spacer(1,8),para('Motor ratings and machine dimensions retain the supplied source order. Motor functions and dimension axes are not specified.')])
 story.extend([para('Configuration & application review','SectionFluid'),para('Reference catalogue information. Confirm final specifications, throughput and suitability with Fluidtech before ordering. Images illustrate the product; options and configuration may vary.'),para('Tell us the material, viscosity, required batch size or flow rate, and target result. We will help select the appropriate equipment.')])
 if p['applications']:story.append(para('Listed applications: '+', '.join(p['applications'])+'.'))
 story.append(Paragraph('<link href="https://fluidtech-rebuilt-dd-oct26.dennisdavid.chatgpt.site'+p['url']+'" color="#004670">View product online →</link>',styles['BodyFluid']))
 doc.build(story,onFirstPage=chrome,onLaterPages=chrome)
 path=ROOT/p['url'].strip('/')/'index.html';s=path.read_text()
 link=f'<a class="text-link datasheet-link" href="/datasheets/{p["slug"]}.pdf" download>Download datasheet (English PDF) ↓</a>'
 if '/datasheets/' not in s:s=s.replace('Technical overview ↓</a>','Technical overview ↓</a>'+link)
 path.write_text(s)
print('Generated',len(products),'datasheets')
