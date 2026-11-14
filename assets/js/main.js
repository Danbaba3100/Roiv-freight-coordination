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

  document.querySelectorAll('[data-year]').forEach(el=>{
    el.textContent=new Date().getFullYear();
  });

  // Apply the same cinematic reveal language across every page.
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealGroups=[
    '.hero-premium .hero-content > *',
    '.page-hero .container > *',
    '.stat-grid > div',
    '.trust-grid > div',
    '.intro-photo-wrap',
    '.intro-text > *',
    '.fleet-card',
    '.service-card',
    '.feature-box',
    '.article-card',
    '.testimonial-card',
    '.process-premium-grid > *',
    '.process-steps article',
    '.process-list > div',
    '.values-grid article',
    '.cta-premium-inner > *',
    '.cta-inner > *',
    '.content-section > .container > *',
    '.content-section .container > .content-narrow > *',
    '.service-detail > *',
    '.contact-grid > *',
    '.seo-faq-wrap > *',
    '.seo-faq',
    '.article-detail-wrap > *',
    '.wyoming-local-grid > *',
    '.local-seo-note .container > *',
    '.site-footer .footer-main > *'
  ];

  const revealSet=new Set();
  revealGroups.forEach(selector=>{
    document.querySelectorAll(selector).forEach(element=>revealSet.add(element));
  });

  revealSet.forEach((element,index)=>{
    if(element.hasAttribute('data-reveal')) return;
    element.setAttribute('data-reveal','');
    element.style.setProperty('--reveal-delay',Math.min(index%6,5)*85+'ms');
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
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    revealItems.forEach(element=>observer.observe(element));
  }
});