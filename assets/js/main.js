/* Minimal JS for interactivity: mobile menu, menu tabs, simple carousel */
document.addEventListener('DOMContentLoaded', function(){
  // Mobile menu toggle
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  toggle && toggle.addEventListener('click', function(){
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'flex';
  });

  // Menu tabs
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      document.querySelectorAll('.panel').forEach(p => {
        if(p.id === target){ p.hidden = false; p.classList.add('active') }
        else { p.hidden = true; p.classList.remove('active') }
      });
    });
  });

  // Simple drag/scroll for review carousel (desktop & mobile)
  const carousel = document.querySelector('.review-carousel');
  if(carousel){
    let isDown = false, startX, scrollLeft;
    carousel.addEventListener('mousedown', (e)=>{
      isDown = true; carousel.classList.add('dragging'); startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', ()=>{ isDown = false; carousel.classList.remove('dragging'); });
    carousel.addEventListener('mouseup', ()=>{ isDown = false; carousel.classList.remove('dragging'); });
    carousel.addEventListener('mousemove', (e)=>{
      if(!isDown) return; e.preventDefault(); const x = e.pageX - carousel.offsetLeft; const walk = (x - startX) * 1.5; carousel.scrollLeft = scrollLeft - walk;
    });
  }

  // Subtle header transform on scroll
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    lastScroll = y;
  }, {passive:true});
});
