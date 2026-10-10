// ПІСЛЯСВІТ — СВІТЛОПАД / standalone GDevelop prototype 0.9.4
(function(){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const distance=(x,y,a,b)=>Math.hypot(x-a,y-b);
const key=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const i={left:key('a')||key('Left'),right:key('d')||key('Right'),
 jump:key('Space')||key('w')||key('Up'),
 dash:key('x')||key('k'),slide:key('s')||key('Down'),
 boost:key('Shift')||key('LShift'),use:key('e')||key('E'),
 throw:key('f')||key('F'),restart:key('r')||key('R')};
const dt=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const platforms=[
 {x:0,y:635,w:1280,h:85},{x:90,y:524,w:150,h:19},
 {x:220,y:440,w:133,h:18},{x:388,y:393,w:193,h:18},
 {x:560,y:445,w:124,h:18},{x:775,y:373,w:174,h:18},
 {x:931,y:307,w:186,h:18},{x:1070,y:408,w:122,h:18}
];
const springs=[{x:334,y:631,w:68},{x:793,y:631,w:72}];
const hook={x:485,y:264},gate={x:588,y:560,w:197,h:75},
target={x:1081,y:213},ammo={x:855,y:347};
const lampPos=[486,786,1085],bulbX=[899,1022,1145];
const spiders=[920,1065,1179];
const lampStart=[115,96,108];
function fresh(){
 return {x:108,y:635,vx:0,vy:0,ground:true,face:1,time:0,
 light:.12,flash:0,trail:[],trailAcc:0,
 lamps:lampPos.map((x,n)=>({x,y:lampStart[n],state:'ready',countdown:0,vy:0})),
 litAt:-1,slideMeters:0,slideHeld:false,sliding:false,
 bounceCd:0,lastSpring:-1,stone:false,shot:null,
 dashTimer:0,dashCooldown:0,dashHeld:false,useHeld:false,throwHeld:false,
 jumpHeld:false,jumpBuffer:0,jumpHold:0,coyote:0,
 dead:false,deathTime:0,deaths:0,shield:1.3,alert:0,landTimer:0,
 message:'ТРИ ЛАМПИ ПІД СТЕЛЕЮ. ВОНИ ВАЖКІ — НЕ СТОЙ ПІД НИМИ!',messageTime:5,
 won:false};
}
if(!runtimeScene.__lightfall094)runtimeScene.__lightfall094=fresh();
const s=runtimeScene.__lightfall094;
const get=n=>runtimeScene.getObjects(n)[0];
const hud=(n,v)=>{const o=get(n);if(o&&o.setString)o.setString(v);};
const say=(msg,t=3.6)=>{s.message=msg;s.messageTime=t;};
const active=n=>s.lamps[n].state==='landed';
const complete=()=>s.lamps.every(l=>l.state==='landed');
const bulb=n=>complete()&&s.time-s.litAt>=n*.38;
function shelter(x,y){
 if(distance(x,y,823,584)<83)return true;
 for(let n=0;n<3;n++)if(bulb(n)&&distance(x,y,bulbX[n],584)<133)return true;
 for(const l of s.lamps)if(l.state==='landed'&&distance(x,y,l.x,584)<90)return true;
 return false;
}
function trigger(n,msg){
 if(s.lamps[n].state!=='ready')return;
 const l=s.lamps[n];l.state='warning';l.countdown=.72;s.flash=.3;
 say(msg+' · УВАГА: ВАЖКА ЛАМПА ПАДАТИМЕ ЗА МИТЬ!',4.2);
}
function extinguish(reason){
 if(s.dead||s.shield>0||s.won)return;
 s.dead=true;s.deathTime=.92;s.deaths++;s.vx=0;s.vy=0;s.flash=.9;
 say('СПАЛАХ ЗГАС · '+reason,2.5);
}
function recover(){
 s.dead=false;s.x=active(0)?470:108;s.y=635;
 s.vx=0;s.vy=0;s.ground=true;s.light=.12;s.alert=0;
 s.shield=1.65;s.trail=[];s.bounceCd=.3;s.dashTimer=0;
 s.stone=false;s.shot=null;
}
if(i.restart){Object.assign(s,fresh());s.shield=1.4;}
if(dt){
 s.time+=dt;s.messageTime=Math.max(0,s.messageTime-dt);
 s.shield=Math.max(0,s.shield-dt);s.flash=Math.max(0,s.flash-dt*2.2);
 s.bounceCd=Math.max(0,s.bounceCd-dt);
 s.dashTimer=Math.max(0,s.dashTimer-dt);
 s.dashCooldown=Math.max(0,s.dashCooldown-dt);
 if(s.dead){s.deathTime-=dt;if(s.deathTime<=0)recover();}
}
// Falling lamps are world simulations independent of Spalakh's death.
if(dt){
 for(let n=0;n<3;n++){
  const l=s.lamps[n];
  if(l.state==='warning'){
   l.countdown-=dt;
   if(l.countdown<=0){l.state='falling';l.vy=0;say('ЛАМПА '+(n+1)+' ПАДАЄ! ВІДІЙДИ ВБІК!',2.1);}
  }else if(l.state==='falling'){
   const fromY=l.y;
   l.vy=Math.min(930,l.vy+1530*dt);l.y+=l.vy*dt;
   if(!s.dead&&!s.won&&Math.abs(s.x-l.x)<58&&s.y>l.y-17&&s.y<l.y+132&&s.shield<=0)
    extinguish('ЛАМПА ВПАЛА НА СПАЛАХА');
   if(l.y>=563){
    l.y=563;l.state='landed';l.vy=0;s.flash=.65;
    say('ЛАМПА '+(n+1)+' ВПАЛА. ТЕПЕР ВОНА ДАЄ СВІТЛО!',3.5);
    if(complete()){s.litAt=s.time;say('УСІ ЛАМПИ ВПАЛИ! КОРИДОР ОСВІТЛЮЄТЬСЯ. ПАВУКИ ТЕБЕ НЕ ПОБАЧАТЬ!',5.8);}
   }
  }
 }
}
