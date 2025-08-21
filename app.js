// Year (if used anywhere)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle + remember
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
function setTheme(dark){
  root.classList.toggle('dark', dark);
  if (toggle) toggle.textContent = dark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved === 'dark');
else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
if (toggle) {
  toggle.addEventListener('click', () => setTheme(!root.classList.contains('dark')));
  // Keyboard: press "D" to toggle
  window.addEventListener('keydown', (e)=>{ if (e.key.toLowerCase()==='d') setTheme(!root.classList.contains('dark')); });
}

// Scroll progress bar
const bar = document.getElementById('bar');
function updateProgress(){
  const h = document.documentElement;
  const s = h.scrollTop;
  const d = h.scrollHeight - h.clientHeight;
  const pct = d ? (s/d)*100 : 0;
  if (bar) bar.style.width = pct + '%';
}
updateProgress();
window.addEventListener('scroll', updateProgress, { passive:true });

// Reveal-on-scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach((el)=>{ if (el.isIntersecting) el.target.classList.add('is-visible'); });
},{ threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// Magnetic social links (subtle)
(function(){
  const zone = document.getElementById('socialMagnet');
  if (!zone) return;
  const strength = 0.12;
  zone.addEventListener('mousemove', (e)=>{
    zone.querySelectorAll('.mag').forEach(a=>{
      const r = a.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top + r.height/2);
      a.style.transform = `translate(${dx*strength}px, ${dy*strength}px)`;
    });
  });
  zone.addEventListener('mouseleave', ()=>{
    zone.querySelectorAll('.mag').forEach(a=> a.style.transform = 'translate(0,0)');
  });
})();

// Portrait spotlight follow
(function(){
  const wrap = document.getElementById('portrait');
  const spot = document.getElementById('spot');
  if (!wrap || !spot) return;
  function move(e){
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left)/r.width)*100;
    const y = ((e.clientY - r.top)/r.height)*100;
    spot.style.background = `radial-gradient(240px 240px at ${x}% ${y}%, rgba(255,255,255,.75), rgba(255,255,255,0) 60%)`;
    spot.style.opacity = .9;
  }
  function leave(){ spot.style.opacity = 0; }
  wrap.addEventListener('mousemove', move);
  wrap.addEventListener('mouseleave', leave);
})();

// Footer parallax for [data-parallax] elements within footer
(function(){
  const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
  const footer = document.getElementById('footer');
  if (!footer || nodes.length === 0) return;
  let ticking = false;
  function onScroll(){
    if (ticking) return;
    requestAnimationFrame(()=>{
      const start = footer.offsetTop - window.innerHeight; // start easing in before footer fully shows
      const end = footer.offsetTop + footer.offsetHeight;
      const sY = window.scrollY;
      nodes.forEach(el => {
        const speed = parseFloat(el.dataset.speed || 0.2);
        const progress = Math.min(1, Math.max(0, (sY - start) / Math.max(1, end - start)));
        const translate = (sY - start) * speed * 0.25; // damp movement
        el.style.transform = `translate3d(0, ${translate}px, 0)`;
        el.style.opacity = (0.75 + progress * 0.25).toFixed(3);
      });
      ticking = false;
    });
    ticking = true;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
})();

// Reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.mag').forEach(el => el.style.transition = 'none');
}
