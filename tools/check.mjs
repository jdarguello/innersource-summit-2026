import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),read=p=>fs.readFile(new URL(p,root),'utf8');
const original=await read('presentation-full.html'),current=await read('presentation.html');
const sections=s=>s.match(/<section class="slide\b[^>]*>[\s\S]*?<\/section>/g);
const clean=s=>s.replace(/<div class="speaker-badge"[^>]*>[\s\S]*?<\/div>/g,'');
const schedule=JSON.parse(await read('deck/storyboard.json')),openingCount=schedule.length,totalCount=openingCount+19;
assert.equal(schedule.reduce((a,s)=>a+s.seconds,0),480);
const oldSections=sections(original),newSections=sections(current);
const coverDesign=s=>s.replace(/data-time="[^"]+"/,'').replace(/<aside class="notes">[\s\S]*?<\/aside>/,'');
assert.equal(coverDesign(clean(newSections[0])),coverDesign(oldSections[0]));
assert.deepEqual(newSections.slice(openingCount).map(clean),oldSections.slice(4));
assert.equal(current.match(/<script>([\s\S]*?)<\/script>/)[1],original.match(/<script>([\s\S]*?)<\/script>/)[1]);
assert.equal(current.match(/<style>([\s\S]*?)<\/style>/)[1],original.match(/<style>([\s\S]*?)<\/style>/)[1]);
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:720}});
const errors=[],issues=[];page.on('pageerror',e=>errors.push(e.message));
await fs.mkdir(new URL('qa/integrated/',root),{recursive:true});
const url='http://127.0.0.1:4173/presentation.html?motion=reduce';await page.goto(url);await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('.slide').count(),totalCount);assert.equal(await page.locator('.opening').count(),openingCount-1);
let states=0;
for(let n=1;n<=openingCount;n++){
 await page.goto(`${url}#${n}`);
 const max=Number(await page.locator('.slide.active').getAttribute('data-max'));
 for(let k=0;k<=max;k++){
  if(k)await page.keyboard.press('ArrowRight');states++;
  if(n>1){const found=await page.evaluate(()=>{
   const s=document.querySelector('.slide.active'),r=s.getBoundingClientRect(),out=[];
   const visible=el=>{let e=el;while(e&&e!==s){const c=getComputedStyle(e);if(c.visibility==='hidden'||Number(c.opacity)===0||c.display==='none')return false;e=e.parentElement;}return true;};
   const els=[...s.querySelectorAll('h2,.callout,.opening-line,svg text,.speaker-badge')].filter(visible);
   for(const el of els){const b=el.getBoundingClientRect(),t=el.textContent.trim();if(b.left<r.left-1||b.right>r.right+1||b.top<r.top||b.bottom>r.bottom-32)out.push({type:'bounds',t});if(el.matches('.callout,h2')&&el.scrollWidth>el.clientWidth+2)out.push({type:'clip',t});}
   for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){if(els[i].contains(els[j])||els[j].contains(els[i]))continue;const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>6&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>6)out.push({type:'overlap',a:els[i].textContent,b:els[j].textContent});}
   return out;
  });issues.push(...found.map(f=>({slide:n,step:k,...f})));}
 }
 await page.screenshot({path:new URL(`qa/integrated/slide-${n}.png`,root).pathname});
}
assert.equal(await page.locator('.slide.active .speaker-badge').getAttribute('data-speaker'),'OSCAR');
await page.keyboard.press('n');assert.equal(await page.locator('#notesPanel').isVisible(),true);await page.keyboard.press('n');await page.keyboard.press('b');assert.equal(await page.locator('#blk').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#blk').isVisible(),false);
await page.goto(`${url}#${openingCount}`);await page.keyboard.press('a');await page.keyboard.press('ArrowRight');assert.match(await page.locator('.slide.active').getAttribute('data-title'),/OpenTofu/);assert.equal(await page.locator('.slide.active .speaker-badge').getAttribute('data-speaker'),'JUAN DAVID');
for(const v of [{width:1440,height:900},{width:1024,height:768},{width:390,height:844}]){await page.setViewportSize(v);await page.goto(`${url}#4.3`);await page.waitForFunction(()=>{const r=document.querySelector('#deck').getBoundingClientRect();return r.x>=-1&&r.y>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;});}
await page.setViewportSize({width:1280,height:720});await page.goto(`http://127.0.0.1:4173/presentation.html?motion=full#${openingCount}`);await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);assert(await page.evaluate(()=>document.getAnimations().length)>0);await page.keyboard.press('ArrowRight');await page.waitForTimeout(700);await page.screenshot({path:new URL('qa/integrated/motion.png',root).pathname});for(let k=0;k<30;k++)await page.keyboard.press('ArrowLeft');await page.waitForTimeout(600);assert.equal(await page.locator('.slide.active').count(),1);assert.equal(await page.locator('.slide.leaving').count(),0);
// New illustration motion must pause with the original black-screen control.
await page.goto(`http://127.0.0.1:4173/presentation.html?motion=full#${openingCount}`);await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);
assert(await page.evaluate(()=>document.getAnimations().some(a=>a.effect.target.hasAttribute('data-cue'))));
await page.keyboard.press('b');assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.effect.target.hasAttribute('data-cue')&&a.playState==='running').length),0);await page.keyboard.press('Escape');
await page.goto('http://127.0.0.1:4173/presentation.html?motion=reduce#4.3');assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.effect.target.hasAttribute('data-cue')).length),0);
// Stateful explanatory motion: an engineer moves between teams and reverses.
await page.goto(`${url}#3`);
const position=()=>page.locator('.slide.active [data-poses]').evaluate(el=>getComputedStyle(el).transform);
const initialPosition=await position();await page.keyboard.press('ArrowRight');const nextPosition=await position();assert.notEqual(initialPosition,nextPosition);await page.keyboard.press('ArrowLeft');assert.equal(await position(),initialPosition);
// Desired vs actual: the running-state token reaches the target and can roll back.
await page.goto(`${url}#${openingCount}.2`);const stateBefore=await position();await page.keyboard.press('ArrowRight');assert.notEqual(await position(),stateBefore);await page.keyboard.press('ArrowLeft');assert.equal(await position(),stateBefore);
await page.goto('http://127.0.0.1:4173/presentation.html?motion=full#3');await page.keyboard.press('ArrowRight');await page.waitForTimeout(160);assert(await page.evaluate(()=>document.getAnimations().some(a=>a.effect.target.hasAttribute('data-poses'))));
await page.keyboard.press('b');assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.effect.target.hasAttribute('data-poses')&&a.playState==='running').length),0);await page.keyboard.press('Escape');
// Proposed context engineering: a fresh observation replaces the stale result.
await page.goto(`${url}#10.2`);
const contextStatus=()=>page.locator('.context-slide [data-poses]').evaluateAll(els=>els.map(el=>({text:el.textContent,opacity:getComputedStyle(el).opacity})));
let facts=await contextStatus();assert.equal(facts[0].opacity,'1');assert.equal(facts[1].opacity,'0');
await page.keyboard.press('ArrowRight');facts=await contextStatus();assert.equal(facts[0].opacity,'0');assert.equal(facts[1].opacity,'1');assert.match(facts[1].text,/healthy/);
await page.keyboard.press('ArrowLeft');facts=await contextStatus();assert.equal(facts[0].opacity,'1');assert.equal(facts[1].opacity,'0');
assert.match(await page.locator('.context-slide .notes').textContent(),/not something GitOps delivers automatically/);
assert.equal(await page.locator('.context-slide .notes a').count(),2);
const actionOpacity=text=>page.getByText(text,{exact:true}).evaluate(el=>getComputedStyle(el.closest('[data-poses]')).opacity);
assert.equal(await actionOpacity('Wait for rollout'),'1');assert.equal(await actionOpacity('Verify health'),'0');
await page.keyboard.press('ArrowRight');assert.equal(await actionOpacity('Wait for rollout'),'0');assert.equal(await actionOpacity('Verify health'),'1');
await page.keyboard.press('ArrowLeft');assert.equal(await actionOpacity('Wait for rollout'),'1');assert.equal(await actionOpacity('Verify health'),'0');
await page.goto('http://127.0.0.1:4173/presentation.html?print=1');assert.equal(await page.locator('.slide.active').count(),totalCount);
const report={openingSlides:openingCount,openingDuration:'8:00',totalSlides:totalCount,states,originalCoverAndShell:'cover design, base CSS and player unchanged; cover timing/notes updated',technicalSlides:'19 unchanged; speaker metadata added',issues,errors,controls:'passed',motion:'flow dots, interrupt and reverse passed',responsive:'passed',print:`${totalCount} scenes`,inheritedLimitation:'Original assets/ files are absent in upstream repository; not modified by this change.'};await fs.writeFile(new URL('qa/integrated/report.json',root),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(issues.length||errors.length)process.exit(1);
