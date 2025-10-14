/* ========= WhatsApp ========= */
function enviarWhats(e){
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const msg  = document.getElementById('mensagem').value.trim();
  const fone = '5519991675464';
  const texto = encodeURIComponent(`Olá, me chamo ${nome}. ${msg}`);
  window.open(`https://wa.me/${fone}?text=${texto}`, '_blank');
}

/* ========= Ano Footer ========= */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========= Digitação no título ========= */
const typingEl = document.getElementById('typing');
const typingText = 'Rogério Guimarães';
let ti = 0;
function type(){
  if(ti <= typingText.length){
    typingEl.textContent = typingText.slice(0, ti);
    ti++;
    setTimeout(type, 110);
  } else {
    // brilho pulsante
    typingEl.classList.add('pulse');
  }
}
type();

/* ========= Canvas Partículas + Gradiente Cinemático ========= */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, particles;
function resize(){
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function makeParticles(count=80){
  particles = Array.from({length: count}).map(()=> ({
    x: Math.random()*W,
    y: Math.random()*H,
    vx: (Math.random() - .5) * .8,
    vy: (Math.random() - .5) * .8,
    r: Math.random()*2 + 0.8
  }));
}
makeParticles();

function bgGradient(t){
  const g = ctx.createLinearGradient(0,0,W,H);
  const c1 = `hsla(${225 + Math.sin(t/1000)*10}, 100%, 60%, .15)`; // azul
  const c2 = `hsla(${265 + Math.cos(t/1100)*10}, 100%, 64%, .15)`; // roxo
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

function drawParticles(){
  // linhas de conexão
  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    for(let j=i+1;j<particles.length;j++){
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d2 = dx*dx + dy*dy;
      if(d2 < 140*140){
        const a = 1 - d2/(140*140);
        ctx.strokeStyle = `rgba(108,99,255,${a*0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
      }
    }
  }
  // pontos
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,231,246,.9)';
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(108,99,255,.8)';
    ctx.arc(p.x+1.5,p.y+1.5,p.r*.7,0,Math.PI*2);
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
  });
}

function animate(t=0){
  bgGradient(t);
  drawParticles();
  requestAnimationFrame(animate);
}
animate();

/* ========= Parallax ========= */
const layers = document.querySelectorAll('.layer');
document.addEventListener('mousemove', (e)=>{
  const x = (e.clientX / window.innerWidth) - .5;
  const y = (e.clientY / window.innerHeight) - .5;
  layers.forEach(layer=>{
    const depth = parseFloat(layer.dataset.depth || 0.1);
    layer.style.transform = `translate(${x * depth * 40}px, ${y * depth * 40}px)`;
  });
});

/* ========= Tilt Cards ========= */
const tilts = document.querySelectorAll('.tilt');
tilts.forEach(card=>{
  let rect;
  function update(e){
    rect = rect || card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    const rx = (+y * 8).toFixed(2);
    const ry = (-x * 10).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }
  function reset(){ card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'; rect = null; }
  card.addEventListener('mousemove', update);
  card.addEventListener('mouseleave', reset);
});

/* ========= Reveal on Scroll ========= */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('visible');
      io.unobserve(en.target);
    }
  });
},{threshold:.18});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* ========= Suave ao clicar no menu ========= */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    const el = document.querySelector(href);
    if(el){
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 70, behavior:'smooth' });
    }
  });
});

// pulsar do título via CSS inline para compatibilidade
const style = document.createElement('style');
style.innerHTML = `.pulse{animation:pulse 2.6s ease-in-out infinite}
@keyframes pulse{0%,100%{text-shadow:0 0 10px rgba(0,231,246,.5),0 0 30px rgba(108,99,255,.25)}
50%{text-shadow:0 0 20px rgba(0,231,246,.8),0 0 50px rgba(108,99,255,.45)}}`;
document.head.appendChild(style);
