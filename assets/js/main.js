/* Minimal JS for interactivity: mobile menu, menu tabs, review carousel, and photo gallery slider */
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
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  }, {passive:true});

  // Gallery slider
  const gallery = document.querySelector('.gallery-slider');
  if(gallery){
    const slides = gallery.querySelectorAll('.slide');
    const slidesList = gallery.querySelector('.slides');
    const prev = gallery.querySelector('.gallery-btn.prev');
    const next = gallery.querySelector('.gallery-btn.next');
    const thumbs = gallery.querySelectorAll('.thumb');
    let index = 0;
    const total = slides.length;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function update() {
      const offset = -index * 100;
      slidesList.style.transform = `translateX(${offset}%)`;
      // update thumbs
      thumbs.forEach(t => t.classList.remove('active'));
      const active = gallery.querySelector(`.thumb[data-index="${index}"]`);
      if(active) active.classList.add('active');
      // disable buttons at ends
      prev.disabled = index === 0;
      next.disabled = index === total - 1;
    }

    function go(n){
      index = Math.max(0, Math.min(total - 1, n));
      update();
    }

    prev.addEventListener('click', ()=> go(index - 1));
    next.addEventListener('click', ()=> go(index + 1));

    thumbs.forEach(t => t.addEventListener('click', (e)=>{
      const i = Number(t.dataset.index);
      go(i);
    }));

    // Keyboard support
    gallery.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowLeft') go(index - 1);
      if(e.key === 'ArrowRight') go(index + 1);
    });

    // Touch / swipe support
    let startX = 0; let deltaX = 0; let isDownSwipe = false;
    const minSwipe = 30;
    slidesList.addEventListener('touchstart', (e)=>{ isDownSwipe = true; startX = e.touches[0].clientX; deltaX = 0; });
    slidesList.addEventListener('touchmove', (e)=>{ if(!isDownSwipe) return; deltaX = e.touches[0].clientX - startX; });
    slidesList.addEventListener('touchend', ()=>{ isDownSwipe = false; if(Math.abs(deltaX) > minSwipe){ if(deltaX > 0) go(index -1); else go(index +1); } });

    // initial state
    if(reduced) slidesList.style.transition = 'none';
    update();
  }

});

/* Runtime guard: if WebP sources fail to load on GitHub Pages (404), swap to existing JPEG fallbacks.
   This is non-destructive and only changes src at runtime so users see images instead of alt text.
*/
(function(){
  function getFallbackForName(name){
    name = name.toLowerCase();
    if(name.includes('hero')) return './1.jpeg';
    if(name.includes('coffee')) return './2.jpeg';
    if(name.includes('interior')) return './3.jpeg';
    if(name.includes('pastry')) return './4.jpeg';
    if(name.includes('detail')) return './5.jpeg';
    // fallback to first uploaded image
    return './1.jpeg';
  }

  function applyFallbackToImg(img){
    if(!img) return;
    // If currentSrc or src references a webp or assets/images path that 404ed, replace with a fallback
    try{
      const srcToCheck = (img.currentSrc && img.currentSrc.length) ? img.currentSrc : img.src || '';
      if(/\.webp(\?|$)/i.test(srcToCheck) || /assets\/images\//i.test(srcToCheck)){
        const filenameMatch = srcToCheck.match(/([a-z0-9-_]+)\.webp/i);
        const name = filenameMatch ? filenameMatch[1] : srcToCheck;
        const fallback = getFallbackForName(name);
        if(img.src !== fallback){
          img.dataset._fallbackApplied = '1';
          img.src = fallback;
        }
      }
    }catch(e){ /* ignore */ }

    // ensure we have an error handler that swaps to a JPEG fallback if the image fails
    img.addEventListener('error', function onErr(){
      if(img.dataset._fallbackErr) return; // already tried
      img.dataset._fallbackErr = '1';
      // derive fallback from filename
      const src = img.src || '';
      const m = src.match(/([a-z0-9-_]+)(?:-[0-9]{2,4})?\.(webp|jpg|jpeg|png)/i);
      const base = m ? m[1] : src;
      const fallback = getFallbackForName(base);
      if(img.src !== fallback){ img.src = fallback; }
    });
  }

  // Remove <source> nodes that reference non-existing webp files (prevents additional 404 attempts)
  document.querySelectorAll('source').forEach(s => {
    try{
      // if the srcset contains assets/images/*.webp and those files don't exist on the server, removing the <source> is safe
      if(s.srcset && /assets\/images\/.+\.webp/i.test(s.srcset)) s.parentNode && s.parentNode.removeChild(s);
    }catch(e){}
  });

  // Apply to existing imgs
  document.querySelectorAll('img').forEach(img => applyFallbackToImg(img));

  // Observe future img additions (in case of dynamic update)
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(node => {
        if(node && node.tagName === 'IMG') applyFallbackToImg(node);
        if(node && node.querySelectorAll) node.querySelectorAll('img').forEach(i => applyFallbackToImg(i));
      });
    });
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();
