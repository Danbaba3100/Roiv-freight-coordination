document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.main-nav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  // Reveal key content as it enters the viewport. No animation library required.
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealGroups=[
    '.stat-grid > div',
    '.intro-photo-wrap',
    '.intro-text > *',
    '.fleet-card',
    '.process-premium-grid > *',
    '.process-steps article',
    '.values-grid article',
    '.cta-premium-inner > *'
  ];
  revealGroups.forEach(selector=>{
    document.querySelectorAll(selector).forEach((element,index)=>{
      element.setAttribute('data-reveal','');
      element.style.setProperty('--reveal-delay',Math.min(index%5,4)*100+'ms');
    });
  });

  const revealItems=document.querySelectorAll('[data-reveal]');
  if(reduceMotion||!('IntersectionObserver' in window)){
    revealItems.forEach(element=>element.classList.add('is-visible'));
  }else{
    const observer=new IntersectionObserver((entries,activeObserver)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -45px 0px'});
    revealItems.forEach(element=>observer.observe(element));
  }

  const form=document.querySelector('[data-contact-form]');
  if(form){
    const status=form.querySelector('[data-form-status]');
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!form.reportValidity()) return;
      const submit=form.querySelector('button[type="submit"]');
      const original=submit.textContent;
      submit.disabled=true;
      submit.textContent='Sending enquiry…';
      if(status) status.textContent='Sending your enquiry. Please wait.';
      try{
        const response=await fetch(form.action,{
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const result=await response.json();
        if(result.success===true || result.success==='true'){
          form.reset();
          if(status) status.textContent='Thank you. Your enquiry has been submitted. Roiv Freight Coordination will follow up using the contact details you provided.';
        }else{
          throw new Error(result.message || 'The enquiry could not be submitted.');
        }
      }catch(error){
        if(status) status.textContent='We could not confirm submission. Please email info@roivfreightc.com or call (307) 317-4460 directly.';
      }finally{
        submit.disabled=false;
        submit.textContent=original;
      }
    });
  }
});