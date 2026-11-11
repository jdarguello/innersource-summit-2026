import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:720}}),base='http://127.0.0.1:4173/presentation-final.html';
const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.clock.install();
const at=()=>p.locator('.slide.active').evaluate(e=>({number:[...document.querySelectorAll('.slide')].indexOf(e)+1,step:+e.dataset.at,max:+e.dataset.max}));
await p.goto(base+'?motion=reduce#4');await p.mouse.click(35,650);assert.equal((await at()).number,5,'One click must advance the whole opening slide');
for(const n of [2,3,4,5,6,7,8,10,11]){
 await p.goto(base+'?motion=reduce#'+n);assert.equal((await at()).step,0);await p.clock.runFor(2000);assert.equal((await at()).step,0,'Initial content gets reading time');
 await p.clock.runFor(1700);assert.equal((await at()).step,1,'First reveal starts automatically');
 await p.clock.runFor(13000);assert.equal((await at()).step,(await at()).max);assert.equal((await at()).number,n,'Never advances slide automatically');
}
await p.goto(base+'?motion=full#4');await p.clock.runFor(1500);await p.keyboard.press('b');await p.clock.runFor(10000);assert.equal((await at()).step,0);await p.keyboard.press('Escape');await p.clock.runFor(2200);assert.equal((await at()).step,1);
await p.keyboard.press('r');assert.equal((await at()).step,0);await p.clock.runFor(3700);assert.equal((await at()).step,1);
await p.keyboard.press('a');assert.equal((await at()).step,(await at()).max);await p.clock.runFor(15000);assert.equal((await at()).number,4);
await p.goto(base+'?motion=reduce#8');await p.keyboard.press('ArrowRight');assert.equal((await at()).number,10);await p.keyboard.press('ArrowLeft');assert.equal((await at()).number,8);assert.equal((await at()).step,(await at()).max);
await p.goto(base+'?motion=reduce#11');await p.keyboard.press('ArrowRight');assert.equal((await at()).number,12);assert.equal((await at()).step,0);await p.clock.runFor(15000);assert.equal((await at()).step,0,'Juan remains manual');await p.keyboard.press('ArrowRight');assert.equal((await at()).number,12);assert.equal((await at()).step,1);
// Timers belonging to a slide that was left cannot reveal another slide.
await p.goto(base+'?motion=reduce#4');await p.clock.runFor(1500);await p.keyboard.press('Shift+ArrowRight');await p.clock.runFor(2100);assert.equal((await at()).number,5);assert.equal((await at()).step,0);
await p.goto(base+'?motion=reduce#10');await p.clock.runFor(14000);assert.equal(await p.getByText('Verify health',{exact:true}).evaluate(e=>getComputedStyle(e.closest('[data-poses]')).opacity),'1');
await fs.mkdir('qa/oneclick',{recursive:true});await p.screenshot({path:'qa/oneclick/context.png'});
await p.goto(base+'?print=1');assert.equal(await p.locator('.slide.active').count(),23);assert.deepEqual(errors,[]);await b.close();console.log('PASS: all opening sequences, one-click navigation, no auto slide change, pause, replay, reveal-all, stale timer cleanup, context update, hidden slides, Juan manual, print.');
