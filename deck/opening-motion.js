/* Illustration entrances and scoped, lifecycle-managed organic loops. The original player owns navigation,
   slide transitions, flow paths, notes and reduced-motion state. */
(() => {
 const deck=document.querySelector('#deck');
 const live=new Set(),loops=new Map();let lastScene=null,lastStep=-1;
 const poseOf=(el,step)=>{const poses=JSON.parse(el.dataset.poses);const keys=Object.keys(poses).map(Number).filter(k=>k<=step).sort((a,b)=>a-b);return poses[keys.at(-1)]||poses[0];};
 const query=new URLSearchParams(location.search);
 const reduce=()=>document.documentElement.classList.contains('reduce-motion')||query.has('print');
 const stop=()=>{live.forEach(a=>a.cancel());live.clear();};
 const stopLoops=()=>{loops.forEach(a=>a.cancel());loops.clear();};
 function syncLoops(scene,reset=false){
  if(reset)stopLoops();
  const eligible=new Set();
  if(scene?.classList.contains('opening')&&!reduce()){
   scene.querySelectorAll('[data-loop]').forEach(el=>{
    let parent=el,visible=true;
    while(parent&&parent!==scene){
     if(parent.hasAttribute('data-step')&&!parent.classList.contains('on'))visible=false;
     if(parent.hasAttribute('data-poses')&&Number(parent.style.opacity)===0)visible=false;
     parent=parent.parentElement;
    }
    if(visible)eligible.add(el);
   });
  }
  loops.forEach((a,el)=>{if(!eligible.has(el)){a.cancel();loops.delete(el);}});
  eligible.forEach(el=>{
   if(loops.has(el))return;
   const kind=el.dataset.loop,amplitude=Number(el.dataset.amplitude)||2.5;
   let frames,easing='linear';
   if(kind==='rotate')frames=[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}];
   else if(kind==='route')frames=[{strokeDashoffset:'0px'},{strokeDashoffset:'-220px'}];
   else if(kind==='packet'){const dx=Number(el.dataset.dx)||0,dy=Number(el.dataset.dy)||0;frames=[{offset:0,transform:'translate(0,0)',opacity:0},{offset:.12,transform:'translate(0,0)',opacity:1},{offset:.7,transform:`translate(${dx}px,${dy}px)`,opacity:1},{offset:.78,transform:`translate(${dx}px,${dy}px)`,opacity:0},{offset:1,transform:`translate(${dx}px,${dy}px)`,opacity:0}];}
   else if(kind==='pulse')frames=[{offset:0,transform:'scale(1)',opacity:.6},{offset:.65,transform:'scale(2.6)',opacity:0},{offset:1,transform:'scale(2.6)',opacity:0}];
   else {easing='ease-in-out';frames=[{offset:0,transform:'translate(0px,0px)'},{offset:.3,transform:`translate(1px,-${amplitude}px)`},{offset:.65,transform:`translate(-.7px,-${amplitude*.45}px)`},{offset:1,transform:'translate(0px,0px)'}];}
   const a=el.animate(frames,{duration:Number(el.dataset.period)||5800,delay:1700,iterations:Infinity,easing});
   loops.set(el,a);
  });
  const paused=document.hidden||document.querySelector('#blk.on');
  loops.forEach(a=>paused?a.pause():a.play());
 }
 const play=(el)=>{
  if(reduce())return;
  const kind=el.dataset.cue,duration=Number(el.dataset.duration)||900,delay=Number(el.dataset.delay)||0;
  let frames;
  if(kind==='travel') {const [x,y]=(el.dataset.from||'-200,0').split(',').map(Number);frames=[{transform:`translate(${x}px,${y}px) rotate(-10deg)`,opacity:0},{offset:.12,opacity:1},{transform:'translate(0,0) rotate(0deg)',opacity:1}];}
  else if(kind==='assemble')frames=[{transform:'translateY(-30px)',opacity:0},{transform:'translateY(0)',opacity:1}];
  else if(kind==='tilt')frames=[{transform:'translateY(18px) rotate(-5deg)',opacity:0},{transform:'translateY(0) rotate(0deg)',opacity:1}];
  else if(kind==='spin')frames=[{transform:'rotate(-100deg) scale(.88)',opacity:0},{transform:'rotate(0deg) scale(1)',opacity:1}];
  else frames=[{transform:'translateY(22px)',opacity:0},{transform:'translateY(0)',opacity:1}];
  const a=el.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});live.add(a);a.finished.then(()=>live.delete(a),()=>live.delete(a));
 };
 function sync(records=[]){
  const scene=deck.querySelector('.slide.active'),step=Number(scene?.dataset.at||0);
  const changed=scene!==lastScene,stepped=step!==lastStep;
  const replay=records.some(r=>r.type==='attributes'&&r.attributeName==='class'&&r.target.closest?.('.opening')&&r.target.hasAttribute('data-step')&&r.oldValue?.includes('on')&&r.target.classList.contains('on'));
  if(changed||stepped||replay){
   const posed=[...deck.querySelectorAll('.opening [data-poses]')];
   const current=new Map(posed.map(el=>[el,{transform:getComputedStyle(el).transform,opacity:getComputedStyle(el).opacity}]));
   stop();
   posed.forEach(el=>{
    const onScene=el.closest('.slide')===scene;
    const target=poseOf(el,onScene?step:Number(el.closest('.slide').dataset.at||0));
    const from=changed||replay?poseOf(el,0):current.get(el);
    el.style.transform=target.transform;el.style.opacity=target.opacity;
    if(onScene&&!reduce()&&(from.transform!==target.transform||from.opacity!==target.opacity)){
     const switching=el.dataset.switch==='context',entering=Number(target.opacity)>Number(from.opacity);
     const a=el.animate([from,target],{duration:switching?(entering?420:180):1250,delay:switching&&entering?220:0,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});live.add(a);a.finished.then(()=>live.delete(a),()=>live.delete(a));
    }
   });
   if(scene?.classList.contains('opening')&&!reduce()){
   const cues=[...scene.querySelectorAll('[data-cue]')].filter(el=>{const parent=el.closest('[data-step]');return parent&&Number(parent.dataset.step)<=step&&(changed||replay||Number(parent.dataset.step)===step);});
   cues.forEach((el,n)=>play(el));
  }lastScene=scene;lastStep=step;}
  const paused=document.hidden||document.querySelector('#blk.on');live.forEach(a=>paused?a.pause():a.play());
  if(reduce())stop();
  syncLoops(scene,changed||replay);
 }
 new MutationObserver(sync).observe(deck,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class','data-at']});
 new MutationObserver(()=>sync()).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 new MutationObserver(()=>sync()).observe(document.querySelector('#blk'),{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',()=>sync());addEventListener('pagehide',()=>{stop();stopLoops();});
 // A missing upstream raster must not display a broken icon and duplicated alt.
 document.querySelectorAll('.lockup img').forEach(img=>{const fallback=()=>{img.classList.add('asset-missing');img.parentElement.classList.add('asset-fallback');};img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();});
 sync();
})();
