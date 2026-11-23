/* KOST calorie wave animation. */
let waveFrame=0,waveObserver=null,waveCanvasRef=null;
const waveReducedMotion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function initEnergyWave(){
 if(waveFrame){cancelAnimationFrame(waveFrame);waveFrame=0;}
 if(waveObserver){waveObserver.disconnect();waveObserver=null;}
 const canvas=document.querySelector('.xmb-energy-canvas');
 const card=canvas?.closest('.xmb-energy');
 waveCanvasRef=canvas;
 if(!canvas||!card||typeof canvas.getContext!=='function')return;
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 let w=1,h=1,lastFrame=0;
 function palette(){
  const theme=document.documentElement.dataset.theme==='dark'?'dark':'light';
  return theme==='dark'?{
   fillTop:'rgba(198,116,255,.06)',
   fillMid:'rgba(169,102,255,.16)',
   fillBottom:'rgba(62,18,104,.02)',
   auraStops:['rgba(137,50,255,0)','rgba(156,72,255,.08)','rgba(208,62,255,.20)','rgba(121,236,255,.09)','rgba(238,154,255,.03)'],
   lineA:'rgba(247,207,255,.82)', lineB:'rgba(205,118,255,.58)', lineC:'rgba(121,236,255,.55)',
   shadow:'#d677ff', shadow2:'#8f56ff', particleA:'255,214,255', particleB:'147,236,255'
  }:{
   fillTop:'rgba(194,162,255,.08)',
   fillMid:'rgba(237,166,240,.18)',
   fillBottom:'rgba(111,235,255,.06)',
   auraStops:['rgba(166,130,255,0)','rgba(185,147,255,.08)','rgba(236,154,255,.18)','rgba(118,236,255,.14)','rgba(255,210,245,.04)'],
   lineA:'rgba(255,255,255,.90)', lineB:'rgba(177,125,255,.42)', lineC:'rgba(118,236,255,.46)',
   shadow:'#e8b8ff', shadow2:'#a78dff', particleA:'255,255,255', particleB:'173,132,255'
  };
 }
 function resize(){
  const box=canvas.getBoundingClientRect();
  w=Math.max(1,Math.round(box.width));h=Math.max(1,Math.round(box.height));
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
 }
 resize(); if('ResizeObserver' in window){waveObserver=new ResizeObserver(resize);waveObserver.observe(canvas);}
 function progressRatio(){
  const raw=parseFloat(getComputedStyle(card).getPropertyValue('--energy-progress'));
  return Math.max(0,Math.min(1,isFinite(raw)?raw/100:0));
 }
 function sy(x,ts,k,baseY){
  return baseY+8*Math.sin((x/w)*7.4-ts*.65+k*.35)+11*Math.sin((x/w)*3.15+ts*.31+k*.18)+k*2.35;
 }
 function renderWave(ms){
  if(waveCanvasRef!==canvas||!canvas.isConnected)return;
  if(document.hidden&&!waveReducedMotion){waveFrame=requestAnimationFrame(renderWave);return;}
  if(ms-lastFrame<42&&!waveReducedMotion){waveFrame=requestAnimationFrame(renderWave);return;}
  lastFrame=ms;
  const bounds=canvas.getBoundingClientRect(),view=device.getBoundingClientRect();
  if(!waveReducedMotion&&(bounds.bottom<view.top-60||bounds.top>view.bottom+60)){waveFrame=requestAnimationFrame(renderWave);return;}
  const tt=ms/1000,p=palette(),progress=progressRatio();
  const baseY=h*(.82-progress*.42);
  const fillTop=Math.max(h*.23,baseY-18);
  ctx.clearRect(0,0,w,h);
  ctx.save();
  ctx.globalCompositeOperation='screen';
  const bg=ctx.createLinearGradient(0,fillTop,0,h);
  bg.addColorStop(0,p.fillTop);bg.addColorStop(.45,p.fillMid);bg.addColorStop(1,p.fillBottom);
  ctx.fillStyle=bg;ctx.fillRect(0,fillTop,w,h-fillTop);
  for(let k=0;k<3;k++){
   ctx.beginPath();
   for(let x=0;x<=w+3;x+=3){const y=sy(x,tt,k-1,baseY)+k*7;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
   const aura=ctx.createLinearGradient(0,0,w,0);
   aura.addColorStop(0,p.auraStops[0]);aura.addColorStop(.24,p.auraStops[1]);aura.addColorStop(.56,p.auraStops[2]);aura.addColorStop(.82,p.auraStops[3]);aura.addColorStop(1,p.auraStops[4]);
   ctx.strokeStyle=aura;ctx.lineWidth=17+k*8;ctx.shadowColor=p.shadow2;ctx.shadowBlur=30;ctx.stroke();
  }
  for(let k=0;k<12;k++){
   ctx.beginPath();
   for(let x=0;x<=w+2;x+=2){const y=sy(x,tt,k-5,baseY)+Math.sin((x/w)*8.4-tt*.44+k*.37)*3;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
   const line=ctx.createLinearGradient(0,0,w,0);
   line.addColorStop(0,'rgba(255,255,255,0)');
   line.addColorStop(.2,k%3===0?p.lineB:'rgba(255,255,255,.03)');
   line.addColorStop(.48,k%3===0?p.lineA:p.lineB);
   line.addColorStop(.78,k%4===0?p.lineC:p.lineB);
   line.addColorStop(1,'rgba(255,255,255,.03)');
   ctx.strokeStyle=line;ctx.lineWidth=k%4===0?1.5:.8;ctx.shadowColor=k%3===0?p.shadow:p.shadow2;ctx.shadowBlur=k%4===0?12:6;ctx.stroke();
  }
  ctx.shadowBlur=10;
  for(let j=0;j<36;j++){
   const travel=(j*.61803398875+tt*(.007+(j%6)*.0008))%1;
   const x=w*(.12+travel*.92);
   const y=sy(x,tt,(j%11)-6,baseY)+Math.sin(j*1.91+tt*.22)*14;
   const a=(.2+.48*(.5+.5*Math.sin(j*2.2+tt*.48)))*Math.min(1,(x/w)*2.0);
   ctx.beginPath();
   ctx.fillStyle=`rgba(${j%4===0?p.particleA:p.particleB},${a.toFixed(3)})`;
   ctx.arc(x,y,(j%7===0?1.6:.75),0,Math.PI*2);
   ctx.shadowColor=j%4===0?p.shadow:p.shadow2;
   ctx.fill();
  }
  ctx.restore();
  if(!waveReducedMotion)waveFrame=requestAnimationFrame(renderWave);
 }
 waveFrame=requestAnimationFrame(renderWave);
}

function render(keepScroll=false){const top=keepScroll?frame.scrollTop:0;document.documentElement.dataset.theme=state.theme||'light';document.documentElement.lang=state.lang==='en'?'en':'nb';const meta=document.querySelector('meta[name=theme-color]');if(meta)meta.setAttribute('content',state.theme==='dark'?'#091314':'#f7f5fb');device.querySelector('.nav')?.remove();device.querySelector('.toast')?.remove();frame.innerHTML=state.onboardingDone?`<div class="page page-${state.page}">${({today,week,recipes,recipe,miniRecipe,cook:cooking,shop:shopV12,deals,pantry,budget,settings})[state.page]?.()||today()}</div>`:onboarding();if(state.onboardingDone&&!['recipe','cook','miniRecipe'].includes(state.page))device.insertAdjacentHTML('beforeend',nav());if(state.onboardingDone&&state.page==='recipes')updateRecipeResults();if(typeof localizeDOM==='function')localizeDOM(device);frame.scrollTop=keepScroll?top:0;save();initEnergyWave();}
