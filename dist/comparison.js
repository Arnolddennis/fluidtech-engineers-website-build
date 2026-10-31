(() => {
 const selects=[...document.querySelectorAll('[data-compare-select]')];if(!selects.length)return;
 const products=window.FLUIDTECH_DATA.products,core=window.FluidtechComparison;
 let state=core.selection(products,location.search);
 const only=document.querySelector('#compare-differences');only.checked=new URLSearchParams(location.search).get('differences')==='1';
 const status=document.querySelector('#compare-status');
 const element=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 function render(){
  selects.forEach((select,index)=>{
   const p=index?state.right:state.left,other=index?state.left:state.right;
   select.value=p.slug;[...select.options].forEach(o=>o.disabled=o.value===other.slug);
   const panel=select.closest('.comparison-panel'),models=panel.querySelector('[data-compare-model]');models.replaceChildren();
   for(const m of p.models?.headers.slice(1)||['Application-specific']){const o=element('option',m);o.value=p.models?m:'';models.append(o);}models.value=index?state.rm:state.lm;models.disabled=!p.models;
   const view=panel.querySelector('[data-compare-view]');view.replaceChildren();
   const image=element('img');image.src=p.image;image.alt=p.name;image.width=640;image.height=420;image.decoding='async';image.loading='lazy';window.FluidtechImages?.apply(image,p.image,'(max-width: 700px) 90vw, 40vw');
   const heading=element('h3',p.name),intro=element('p',p.intro),links=element('div',undefined,'comparison-links');
   const detail=element('a','View product details ↗','text-link');detail.href=p.url;
   const pdf=element('a','Download datasheet (English PDF) ↓','text-link');pdf.href='/datasheets/'+p.slug+'.pdf';pdf.dataset.comparePdf='';pdf.download='';
   links.append(detail,pdf);view.append(image,heading,intro,links);
  });
  const table=document.querySelector('[data-comparison-table]');table.replaceChildren();
  const caption=element('caption','Model specifications');table.append(caption);
  const head=element('thead'),tr=element('tr');['Specification',state.left.name,state.right.name].forEach(text=>{const th=element('th',text);th.scope='col';tr.append(th);});head.append(tr);table.append(head);
  const body=element('tbody');let count=0;
  for(const row of core.rows(state)){if(only.checked&&!row.different)continue;const tr=element('tr');tr.classList.toggle('is-different',row.different);const th=element('th',row.label);th.scope='row';tr.append(th,...row.values.map(v=>element('td',v)));body.append(tr);count++;}table.append(body);
  const url=core.url(location.href,state,only.checked);history.replaceState(null,'',url);
  document.querySelector('#comparison-link').value=url;
  const enquiry=new URL('/contact-us/',location.origin);enquiry.searchParams.set('product',`${state.left.name}${state.lm?' ('+state.lm+')':''} / ${state.right.name}${state.rm?' ('+state.rm+')':''}`);const lang=window.FluidtechI18n?.language||'en';if(lang!=='en')enquiry.searchParams.set('lang',lang);document.querySelector('[data-compare-enquiry]').href=enquiry.href;
  status.textContent=count?'Comparison updated.':'No differences in the listed specifications.';
 }
 selects.forEach((select,index)=>select.addEventListener('change',()=>{const q=new URLSearchParams({left:index?state.left.slug:select.value,right:index?select.value:state.right.slug,lm:index?state.lm:'',rm:index?'':state.rm});state=core.selection(products,q.toString());render();}));
 document.querySelectorAll('[data-compare-model]').forEach((select,index)=>select.addEventListener('change',()=>{state[index?'rm':'lm']=select.value;render();}));
 only.addEventListener('change',render);
 document.querySelector('#copy-comparison').addEventListener('click',async()=>{const field=document.querySelector('#comparison-link');try{await navigator.clipboard.writeText(field.value);status.textContent='Comparison link copied.';}catch(_){field.hidden=false;field.focus();field.select();status.textContent='Copy the link shown below.';}});
 addEventListener('popstate',()=>{state=core.selection(products,location.search);only.checked=new URLSearchParams(location.search).get('differences')==='1';render();});
 document.addEventListener('fluidtech:languagechange',render);
 render();
})();
