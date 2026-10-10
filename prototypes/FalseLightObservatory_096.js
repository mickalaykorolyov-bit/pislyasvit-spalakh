// ПІСЛЯСВІТ — ОБСЕРВАТОРІЯ ХИБНОГО СВІТЛА • 0.9.6
// One scene. Three refractors reconfigure light as shelter and physical bridge.
(function(){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const d=(x,y,a,b)=>Math.hypot(x-a,y-b);
const keys=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const input={l:keys('a')||keys('Left'),r:keys('d')||keys('Right'),
 jump:keys('Space')||keys('Up')||keys('w'),
 interact:keys('e')||keys('E'),crouch:keys('s')||keys('Down'),
 reset:keys('r')||keys('R')};
const dt=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const FLOOR=[
{x:0,y:635,w:425,h:85},{x:700,y:635,w:580,h:85},
{x:85,y:536,w:149,h:18},{x:205,y:448,w:129,h:18},
{x:705,y:516,w:160,h:18},{x:858,y:500,w:149,h:18},
{x:964,y:402,w:182,h:18},{x:1111,y:306,w:153,h:18}
];
const LIGHT_BRIDGE=[
{x:423,y:635,w:92,h:15},{x:512,y:635,w:96,h:15},{x:606,y:635,w:95,h:15}
];
const PANELS=[{x:292,y:590},{x:782,y:481},{x:1059,y:365}];
const PROJECTORS=[{x:290,y:126},{x:670,y:105},{x:1059,y:105}];
const SPIDERS=[{x:810,y:586},{x:942,y:586},{x:1132,y:586}];
const IRIS={x:1060,y:538,w:37,h:97};
function fresh(){
 return {x:101,y:635,vx:0,vy:0,ground:true,face:1,elapsed:0,
 modes:[0,0,0],turns:0,rewired:false,crossed:false,seenIris:false,
 bright:.12,flash:0,trail:[],trailTick:0,groundTimer:0,
 shield:1.5,alert:0,dead:false,deadClock:0,deaths:0,
 jumpHeld:false,eHeld:false,jumpBuffer:0,jumpHold:0,coyote:0,
 message:'ОПТИЧНІ ПРИСТРОЇ МОЖНА ПОВЕРТАТИ КЛАВІШЕЮ E.',messageClock:5.7,
 won:false,stage:'bridge'};
}
if(!runtimeScene.__observatory096)runtimeScene.__observatory096=fresh();
const s=runtimeScene.__observatory096;
const obj=k=>runtimeScene.getObjects(k)[0];
const hud=(k,text)=>{const o=obj(k);if(o&&o.setString)o.setString(text);};
const announce=(message,t=3.3)=>{s.message=message;s.messageClock=t;};
const bridge=()=>s.modes[0]===1;
const irisOpen=()=>bridge()&&s.modes[1]===2&&s.modes[2]===2;
const travellingRay=()=>866+130*Math.sin(s.elapsed*.74);
const coneSpots=()=>{
 const rays=[{x:116,y:584,r:140,name:'start'}];
 // M1: physical bridge and a hand-off safe pool at its far shore.
 if(s.modes[0]===0)rays.push({x:310,y:588,r:103});
 if(s.modes[0]===1){
  rays.push({x:474,y:583,r:104},{x:573,y:583,r:103},{x:673,y:583,r:117},{x:732,y:583,r:95});
 }
 if(s.modes[0]===2)rays.push({x:830,y:583,r:113});
 // M2: a walking spotlight, then a fixed beam that doubles as iris input.
 if(s.modes[1]===0)rays.push({x:778,y:478,r:102});
 if(s.modes[1]===1)rays.push({x:travellingRay(),y:583,r:141});
 if(s.modes[1]===2)rays.push({x:913,y:583,r:174});
 // M3: a rehearsal arc or long final cover.
 if(s.modes[2]===0)rays.push({x:1060,y:382,r:110});
 if(s.modes[2]===1)rays.push({x:1045+78*Math.sin(s.elapsed*.68),y:552,r:103});
 if(s.modes[2]===2)rays.push({x:1151,y:583,r:180});
 return rays;
};
const sheltered=(x,y)=>coneSpots().some(spot=>d(x,y,spot.x,spot.y)<spot.r);
const hidden=()=>sheltered(s.x,s.y-39);
function die(reason){
 if(s.dead||s.shield>0||s.won)return;
 s.dead=true;s.deadClock=.88;s.deaths++;s.vx=0;s.vy=0;s.flash=.85;
 s.alert=0;announce('СПАЛАХ ЗГАС: '+reason+' · НАЛАШТУВАННЯ ЗБЕРЕЖЕНІ',3.1);
}
function revive(){
 s.dead=false;
 const safeRight=s.modes[0]===1&&s.crossed;
 s.x=safeRight?727:101;s.y=635;s.vx=0;s.vy=0;s.ground=true;
 s.shield=1.8;s.flash=.2;s.trail=[];s.alert=0;
}
function adjust(n){
 const from=s.modes[n];
 s.modes[n]=(from+1)%3;s.turns++;s.flash=.34;
 const targets=[
 ['ПЕРШИЙ ПРОМІНЬ — У ЛІВИЙ КУТ','СВІТЛОВИЙ МІСТ МАТЕРІАЛІЗУВАВСЯ!','ПЕРШИЙ ПРОМІНЬ — ДО ПАВУКІВ'],
 ['ДРУГЕ ДЗЕРКАЛО — ВГОРУ','ПРОМІНЬ РУХАЄТЬСЯ. МОЖНА ЙТИ РАЗОМ ІЗ НИМ!','ДРУГИЙ ПРОМІНЬ ЗАКРІПИВСЯ НА ОПТИЧНОМУ ЗАМКУ'],
 ['ТРЕТЄ ДЗЕРКАЛО — ВГОРУ','ТРЕТІЙ ПРОМІНЬ КОЛИВАЄТЬСЯ','ТРЕТІЙ ПРОМІНЬ ОСВІТЛЮЄ ВИХІД']
 ];
 announce(targets[n][s.modes[n]],3.5);
 if(n===1&&s.crossed&&from===1&&s.modes[n]===2)s.rewired=true;
 if(irisOpen())announce('ДВА ПРОМЕНІ ПЕРЕТНУЛИСЯ — ОПТИЧНА ПЕРЕГОРОДКА РОЗКРИЛАСЯ!',4.2);
}
if(input.reset){Object.assign(s,fresh());s.shield=1.4;}
if(dt){
 s.elapsed+=dt;s.messageClock=Math.max(0,s.messageClock-dt);
 s.flash=Math.max(0,s.flash-dt*2.1);s.shield=Math.max(0,s.shield-dt);
 if(s.dead){s.deadClock-=dt;if(s.deadClock<=0)revive();}
}
if(!s.dead&&!s.won&&dt){
 const dir=Number(input.r)-Number(input.l);
 if(dir)s.face=dir;
 const preferred=dir*(input.crouch?70:202),accel=dir?(s.ground?1510:1090):(s.ground?2370:1200);
 s.vx+=clamp(preferred-s.vx,-accel*dt,accel*dt);
 if(s.ground)s.coyote=.135;else s.coyote=Math.max(0,s.coyote-dt);
 if(input.jump&&!s.jumpHeld)s.jumpBuffer=.14;
 else s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);
 if(s.jumpBuffer>0&&(s.ground||s.coyote>0)&&!input.crouch){
  s.vy=-557;s.ground=false;s.coyote=0;s.jumpBuffer=0;s.jumpHold=0;s.flash=.20;
 }
 if(s.jumpHeld&&!input.jump&&s.vy< -155)s.vy*=.57;
 s.jumpHeld=input.jump;
 if(!s.ground){
  if(s.vy<0&&input.jump&&s.jumpHold<.18){s.vy+=780*dt;s.jumpHold+=dt;}
  else s.vy+=(s.vy<0?1260:1390)*dt;
  s.vy=clamp(s.vy,-590,870);
 }
 const priorY=s.y,priorX=s.x;
 s.x=clamp(s.x+s.vx*dt,18,1260);s.y+=s.vy*dt;
 let landed=false;
 const surfaces=bridge()?FLOOR.concat(LIGHT_BRIDGE):FLOOR;
 for(const p of surfaces){
  if(s.vy>=0&&priorY<=p.y+8&&s.y>=p.y&&s.x+13>p.x&&s.x-13<p.x+p.w){
   s.y=p.y;s.vy=0;landed=true;break;
  }
 }
 if(!s.ground&&landed)s.groundTimer=.14;
 s.ground=landed;s.groundTimer=Math.max(0,s.groundTimer-dt);
 if(!bridge()&&s.x>428&&s.x<698&&s.y>650)die('БЕЗ СВІТЛА МІСТ НЕ ІСНУЄ');
 if(s.y>785)die('ПРІРВА');
 if(s.x>710)s.crossed=true;
 // The optical iris is a wall, not just a decorative goal marker.
 if(!irisOpen()&&s.y>524){
  if(priorX<IRIS.x&&s.x+12>IRIS.x){s.x=IRIS.x-12;s.vx=0;}
  if(priorX>IRIS.x+IRIS.w&&s.x-12<IRIS.x+IRIS.w){s.x=IRIS.x+IRIS.w+12;s.vx=0;}
  if(s.x>1014&&s.x<1060)s.seenIris=true;
 }
 // E operates one refractor at a time. No speed skill, throwing, lifting, switches, locks, keys.
 if(input.interact&&!s.eHeld){
  let choice=-1,best=85;
  for(let n=0;n<3;n++){
   const p=PANELS[n],range=d(s.x,s.y-38,p.x,p.y);
   if(range<best){choice=n;best=range;}
  }
  if(choice>=0)adjust(choice);
 }
 s.eHeld=input.interact;
 const target=clamp(.13+.79*Math.min(1,Math.abs(s.vx)/225)+(s.flash>.13?.08:0),.13,1);
 s.bright+=(target-s.bright)*(1-Math.exp(-dt*(target>s.bright?8:3.1)));
 s.trailTick+=dt;
 if(Math.abs(s.vx)>53&&s.trailTick>.029){
  s.trail.push({x:s.x-s.face*16,y:s.y-44,age:0,p:s.bright});s.trailTick=0;
 }
 for(const q of s.trail)q.age+=dt;
 s.trail=s.trail.filter(x=>x.age<.83).slice(-35);
 // Spiders are vision-based only. Being inside ANY light zone is invisibility.
 let threat=false;
 for(const sp of SPIDERS){
  const x=sp.x+Math.sin(s.elapsed*.75+sp.x*.011)*19;
  if(d(s.x,s.y-36,x,sp.y-27)<144&&!hidden())threat=true;
 }
 s.alert=clamp(s.alert+(threat?dt*1.13:-dt*1.85),0,1.25);
 if(s.alert>=1)die('ПАВУК ПОБАЧИВ ТЕБЕ В ТЕМРЯВІ');
 if(s.x>1235&&s.y>576){
  if(irisOpen()&&hidden()){s.won=true;s.flash=1;announce('ОБСЕРВАТОРІЮ ПРОЙДЕНО! ТИ ЗІБРАВ КОРИДОР ІЗ ПРОМЕНІВ.',99);}
  else{s.x=1206;s.vx=0;announce('ПЕРЕНАЛАШТУЙ ОПТИКУ, ЩОБ ВИХІД ПОБАЧИВ СВІТЛО.',2);}
 }
}
s.eHeld=input.interact;
