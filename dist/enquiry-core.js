/* Pure enquiry rules shared by the form and its deterministic tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FluidtechEnquiry=api;})(typeof window==='object'?window:globalThis,()=>{
  function validate(input){
    const values=Object.fromEntries(['name','email','reason'].map(key=>[key,String(input[key]||'').trim()]));
    const errors={};
    if(!values.name)errors.name='Please enter your name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))errors.email='Please enter a valid email address.';
    if(!values.reason)errors.reason='Please tell us the reason for your enquiry.';
    else if(values.reason.length>1500)errors.reason='Please keep your enquiry within 1,500 characters.';
    return {valid:!Object.keys(errors).length,values,errors};
  }
  function isReturn(search,pending,now){const timestamp=Number(pending);return new URLSearchParams(search).get('submitted')==='1'&&Number.isFinite(timestamp)&&timestamp>0&&now>=timestamp&&now-timestamp<3600000;}
  function returnUrl(origin,language){const url=new URL('/contact-us/',origin);url.searchParams.set('submitted','1');if(['de','es','fr'].includes(language))url.searchParams.set('lang',language);url.hash='inquiry-form';return url.href;}
  return {validate,isReturn,returnUrl};
});
