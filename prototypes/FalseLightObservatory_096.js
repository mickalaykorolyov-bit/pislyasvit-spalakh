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
const IRIS={x:1060,y:136,w:37,h:499};
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
 if(!irisOpen()&&s.y>IRIS.y){
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

// All shapes are intentionally schematic; collision and optics share exact coordinates.
let fx=runtimeScene.__falseLightFx;
if(!fx){
 fx=runtimeScene.__falseLightFx={ok:false};
 try{
  const renderer=runtimeScene.getLayer('').getRenderer();
  if(typeof PIXI==='undefined'||!PIXI.Graphics||!renderer||!renderer.addRendererObject)throw Error('PIXI renderer not available');
  for(const [k,z] of [['background',-40],['world',7],['glow',14],['hudworld',22]]){
   fx[k]=new PIXI.Graphics();renderer.addRendererObject(fx[k],z);
  }
  fx.ok=true;
 }catch(err){fx.err=String(err);}
}
function disk(g,x,y,r,c,a=1){g.lineStyle(0);g.beginFill(c,a);g.drawCircle(x,y,r);g.endFill();}
function rect(g,x,y,w,h,c,a=1,r=8){g.lineStyle(0);g.beginFill(c,a);g.drawRoundedRect(x,y,w,h,Math.min(r,h/3));g.endFill();}
function line(g,x,y,X,Y,c,a=.7,t=2){g.lineStyle(t,c,a);g.moveTo(x,y);g.lineTo(X,Y);}
function bloom(g,x,y,r,c,a){
 for(let k=6;k>=1;k--)disk(g,x,y,r*(.33+k*.14),c,a*(7-k)/31);
}
if(fx.ok){
 const bg=fx.background,w=fx.world,light=fx.glow,over=fx.hudworld;
 bg.clear();w.clear();light.clear();over.clear();
 rect(bg,0,0,1280,720,0x050e1b);
 bg.lineStyle(1,0x395c76,.18);
 for(let xx=17;xx<1280;xx+=57){bg.moveTo(xx,0);bg.lineTo(xx,720);}
 for(let yy=12;yy<720;yy+=58){bg.moveTo(0,yy);bg.lineTo(1280,yy);}
 // Very large optical mechanisms dominate the high space.
 for(const [xx,yy,ww,hh] of [[24,100,92,420],[369,41,61,290],[799,68,70,260],[1180,49,58,330]]){
  rect(bg,xx,yy,ww,hh,0x112d3e,.43);
  line(bg,xx+15,yy+3,xx+15,yy+hh-4,0x739eb0,.17,1);
 }
 // The same pools rendered here are evaluated for *real* stealth protection.
 const spots=coneSpots();
 for(const ray of spots){
  const isStart=ray.name==='start';
  const tint=isStart?0x9cecf9:0x91ffe5;
  // In-water optic cone, not a fake background decoration.
  bloom(bg,ray.x,ray.y,ray.r,tint,isStart?.13:.20);
  if(!isStart){
   const source=ray.x<610?PROJECTORS[0]:ray.x<985?PROJECTORS[1]:PROJECTORS[2];
   bg.beginFill(0xa2e8f6,.026);bg.drawPolygon([
    source.x,source.y+25,ray.x-42,ray.y,ray.x+42,ray.y]);bg.endFill();
  }
 }
 // Permanent opening lamp establishes the single unchanging stealth rule.
 line(w,112,522,112,552,0x96b7be,.6,2);disk(w,112,558,11,0xb1fff2);
 bloom(bg,112,587,140,0xa4e8f8,.075);
 for(const p of FLOOR){
  rect(w,p.x,p.y,p.w,p.h,p.h>50?0x1c3446:0x284658,.97);
  rect(w,p.x+2,p.y,p.w-4,4,0x7cb5c8,.78,2);
  for(let xx=p.x+12;xx<p.x+p.w-11;xx+=36)
   line(w,xx,p.y+8,xx-8,p.y+15,0x9fc0c8,.22,1);
 }
 // A 275-pixel crevasse. Only the first refractor can make its bridge solid.
 rect(bg,426,635,273,80,0x020712,.99);
 for(let xx=431;xx<692;xx+=27){
  line(bg,xx,665,xx+8,678,0xe4657e,.37,2);
 }
 if(bridge()){
  for(const p of LIGHT_BRIDGE){
   bloom(light,p.x+p.w*.5,633,56,0x86fff0,.14);
   rect(w,p.x,p.y,p.w,p.h,0x47958f,.70);
   rect(w,p.x+3,p.y,p.w-6,5,0x9cffd7,.96,3);
   for(let xx=p.x+14;xx<p.x+p.w-10;xx+=24)
    line(w,xx,641,xx+9,647,0x71e7d1,.35,2);
  }
 }else{
  for(const p of LIGHT_BRIDGE){
   rect(w,p.x,p.y,p.w,p.h,0x35505c,.13);
   line(w,p.x,p.y+2,p.x+p.w,p.y+2,0x5a9a9f,.35,1);
  }
 }
 // Giant periscopes, each showing the three angle settings. Optical pipes connect machines.
 for(let n=0;n<3;n++){
  const o=PROJECTORS[n],col=0xb6fbe7,mode=s.modes[n];
  line(w,o.x,0,o.x,o.y-43,0x628ca5,.61,3);
  bloom(w,o.x,o.y,68,0x85dbe8,.12);
  w.lineStyle(5,0x80c3d2,.70);w.drawCircle(o.x,o.y,51);
  w.lineStyle(2,0x9ae9ef,.39);w.drawCircle(o.x,o.y,66);
  disk(w,o.x,o.y,35,0x163747,.94);
  const phi=(-Math.PI/2)+(mode*2*Math.PI/3);
  line(w,o.x,o.y,o.x+38*Math.cos(phi),o.y+38*Math.sin(phi),0xd3fff0,.92,6);
  for(let k=0;k<3;k++){
   const theta=-Math.PI/2+k*2*Math.PI/3;
   const x=o.x+57*Math.cos(theta),y=o.y+57*Math.sin(theta);
   disk(w,x,y,k===mode?7:4,k===mode?0x99ffd0:0x628193,k===mode?1:.66);
  }
  line(w,o.x,o.y+35,o.x,o.y+86,0x658d9e,.45,2);
 }
 // Panel objects: large enough to be unmistakable. An E prompt is spatially anchored.
 for(let n=0;n<3;n++){
  const p=PANELS[n],mode=s.modes[n],c=mode===0?0xf3b992:mode===1?0x81eee7:0x9cffbc;
  bloom(w,p.x,p.y,44,c,.11);
  rect(w,p.x-32,p.y-23,64,45,0x244655,.96);
  w.lineStyle(3,c,.96);w.drawRoundedRect(p.x-32,p.y-23,64,45,8);
  disk(w,p.x,p.y-4,14,0x1a313e);
  w.lineStyle(4,c,.9);
  line(w,p.x,p.y-4,p.x+11*Math.cos(mode*2*Math.PI/3),p.y-4+11*Math.sin(mode*2*Math.PI/3),c,.95,3);
  for(let a=0;a<3;a++)disk(w,p.x-19+a*19,p.y+14,3,a===mode?0xa8ffcf:0x526c74);
 }
 // Ceiling cables and the solid-height optic iris at the far right.
 const open=irisOpen();
 if(open)bloom(bg,IRIS.x+17,430,92,0x8fffb7,.16);
 else bloom(bg,IRIS.x+17,430,56,0xec6980,.10);
 line(w,IRIS.x,133,IRIS.x,635,open?0x71f2bb:0xf38c95,.77,3);
 line(w,IRIS.x+IRIS.w,133,IRIS.x+IRIS.w,635,open?0x71f2bb:0xf38c95,.77,3);
 if(!open){
  rect(w,IRIS.x,IRIS.y,IRIS.w,IRIS.h,0x60344d,.79);
  for(let y=IRIS.y+15;y<634;y+=23){
   line(w,IRIS.x+4,y,IRIS.x+IRIS.w-3,y+13,0xf1a1a0,.31,2);
  }
  disk(w,IRIS.x+IRIS.w/2,411,12,0xff7789,.86);
 }else{
  rect(w,IRIS.x+13,IRIS.y,11,IRIS.h,0x2d735b,.17);
  for(let y=IRIS.y+15;y<634;y+=28)
   disk(w,IRIS.x+19,y,3.5,0x84ffd0,.70);
 }
 // Spiders blink red in shadow but fold their legs in any projected lamp light.
 for(let n=0;n<SPIDERS.length;n++){
  const sp=SPIDERS[n],x=sp.x+Math.sin(s.elapsed*.75+sp.x*.011)*19,y=sp.y;
  const asleep=sheltered(x,y-27);
  const c=asleep?0x587b83:0xbd536b;
  for(let side of [-1,1])for(let arm=0;arm<4;arm++){
   const yy=y-17+arm*7;
   line(w,x+side*13,yy,x+side*(30+arm*6),yy-16+arm*7,c,.85,n===2?3.7:2.6);
  }
  disk(w,x,y-30,n===2?25:20,0x151d2d);
  disk(w,x-8,y-36,3,asleep?0x77979b:0xff5a76);
  disk(w,x+8,y-36,3,asleep?0x77979b:0xff5a76);
  if(!asleep)bloom(w,x,y-37,29,0xf65877,.12);
 }
 const ready=irisOpen();
 rect(w,1220,554,48,81,ready?0x1c6651:0x4b3042,.98);
 w.lineStyle(3,ready?0x89ffd1:0xf38399,.97);w.drawRoundedRect(1220,554,48,81,9);
 for(let yy=568;yy<622;yy+=17)rect(w,1229,yy,30,5,ready?0x97ffd3:0xda8294,.95);
 if(ready)bloom(w,1245,589,55,0x9ffbcf,.14);
 // Body-attached glowing feet + living red trail.
 for(const q of s.trail){
  const alpha=clamp((1-q.age/.83)*q.p,0,1);
  bloom(light,q.x,q.y,20,0xff5277,.16*alpha);
  disk(light,q.x,q.y,4+q.p*5,0xff6b87,.63*alpha);
 }
 const isHidden=hidden();
 if(!s.dead){
  bloom(light,s.x,s.y-41,35+s.bright*32,0xff527d,isHidden?.027:.05+s.bright*.12);
  bloom(light,s.x,s.y-17,25,0xff8da3,isHidden?.018:.08);
 }
 if(s.dead)bloom(over,s.x,s.y-49,74*(1-s.deadClock/.88)+18,0xf9557b,.25);
 if(s.alert>.025){
  over.lineStyle(4,0xfa617d,clamp(s.alert,0,1)*.79);
  over.drawRoundedRect(7,7,1266,705,17);
  rect(over,979,111,262*clamp(s.alert,0,1),7,0xfa5579,.85);
 }
}

// The original Spalakh sprite and its eight animation cycles are preserved.
const p=obj('Player');
if(p){
 const motion=Math.abs(s.vx);
 const anim=s.dead?'Fall':!s.ground?(s.vy<0?'Jump':'Fall'):
  s.groundTimer>.01?'Land':input.crouch?'Crouch':motion>151?'Run':motion>18?'Slow':'Idle';
 if(p.getAnimationName&&p.getAnimationName()!==anim&&p.setAnimationName)p.setAnimationName(anim);
 if(p.setAnimationSpeedScale)p.setAnimationSpeedScale(anim==='Run'?clamp(motion/219,.85,1.35):1);
 const scale=.55;if(p.setScale)p.setScale(scale);
 p.setPosition(s.x-192*scale,s.y-242*scale);
 if(p.flipX)p.flipX(s.face<0);
 if(p.setOpacity)p.setOpacity(s.dead?0:(hidden()?54:clamp(157+s.bright*94,157,255)));
}
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
hud('HUDTitle','ПІСЛЯСВІТ   /   ОБСЕРВАТОРІЯ ХИБНОГО СВІТЛА');
hud('HUDStatus','ОПТИКА '+s.modes.map((mode,n)=>(n+1)+':'+(mode+1)).join('    ')+
 '      МІСТ '+(bridge()?'✓':'○')+
 '      ЗАТВОР '+(irisOpen()?'✓':'○')+
 '      '+(hidden()?'НЕВИДИМИЙ У СВІТЛІ':'ПОМІТНИЙ У ТЕМРЯВІ')+
 '      ЗАГИБЕЛЕЙ '+s.deaths);
let task='ПОШУКАЙ ОПТИЧНИЙ ПУЛЬТ, ЯКИЙ КЕРУЄ ПРОМЕНЕМ. E ПОВЕРТАЄ ДЗЕРКАЛО.';
if(!bridge())task='01 / ПОДИВИСЬ НА ПРОВАЛЛЯ. ЗРОБИ СВІТЛОВУ ПІДЛОГУ ЛІВИМ РЕФРАКТОРОМ [E].';
else if(!s.crossed)task='02 / СВІТЛОВИЙ МІСТ РЕАЛЬНИЙ. ПЕРЕТНИ ПРОВАЛЛЯ ТА ПІДНІМИСЯ ДО СЕРЕДНЬОГО ПУЛЬТА.';
else if(s.modes[1]===0)task='03 / ДРУГИЙ РЕФРАКТОР МОЖЕ ЗАПУСТИТИ РУХОМЕ СВІТЛО. ПОВЕРНИ ЙОГО [E].';
else if(s.modes[2]===0)task='04 / СУПРОВОДЖУЙ РУХОМИЙ ПРОМІНЬ ДО ВЕРХНЬОГО ПРАВОГО ПУЛЬТА.';
else if(s.modes[2]!==2)task='05 / СПРОБУЙ ПЕРЕНАПРАВИТИ ТРЕТІЙ ПРОМІНЬ НА ФІНАЛЬНИЙ ПРОХІД.';
else if(!irisOpen())task='06 / ПЕРЕГОРОДКА НЕ ПІДДАЄТЬСЯ. МОЖЛИВО, ПОТРІБНО ПЕРЕНАЛАШТУВАТИ ДРУГИЙ ПРОМІНЬ.';
else task='СВІТЛОВИЙ КОРИДОР БЕЗПЕЧНИЙ. ПАВУКИ НЕ БАЧАТЬ СПАЛАХА — ДОЙДИ ДО ВИХОДУ.';
if(s.x>780&&s.y>570&&!hidden())task='УВАГА! У ТЕМРЯВІ ПАВУКИ БАЧАТЬ СПАЛАХА. ТРИМАЙСЯ ПІД ПРОМЕНЕМ.';
if(s.won)task='ОБСЕРВАТОРІЮ ПРОЙДЕНО — ТИ ПРОКЛАВ ДОРОГУ ІЗ СВІТЛА.';
hud('HUDTask',task);
hud('HUDHint','A/D — РУХ     SPACE — СТРИБОК     E — ПОВЕРНУТИ ОПТИКУ     S — ПРИСІСТИ     R — СПОЧАТКУ');
hud('HUDMessage',s.messageClock>0?s.message:'');
hud('W01','A   '+['ТУМАН','МІСТ','ГЛИБИНА'][s.modes[0]]);
hud('W02','B   '+['КУПОЛ','МАЯТНИК','ЗАТВОР'][s.modes[1]]);
hud('W03','C   '+['КУПОЛ','ХВИЛЯ','ВИХІД'][s.modes[2]]);
hud('W04',bridge()?'МІСТ ІЗ ПРОМЕНЯ': 'ТУТ НЕМАЄ ПІДЛОГИ');
hud('W05',irisOpen()?'ОПТИЧНИЙ ЗАТВОР ВІДКРИТО':'ОПТИЧНИЙ ЗАТВОР ЗАКРИТО');
hud('WLamp',hidden()?'ПАВУКИ НЕ ПОМІЧАЮТЬ СПАЛАХА':'ПАВУКИ БАЧАТЬ СВІТЛО СПАЛАХА');
hud('HUDWin',s.won?'ОБСЕРВАТОРІЮ ПРОЙДЕНО!':'');
const win=obj('HUDWin');if(win&&win.setOpacity)win.setOpacity(s.won?255:0);
})();
