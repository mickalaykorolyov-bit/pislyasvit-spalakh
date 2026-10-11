// ПІСЛЯСВІТ — ОБСЕРВАТОРІЯ ХИБНОГО СВІТЛА • 3D CINEMATIC NIGHT v0.9.8
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
 won:false,stage:'bridge',camPhase:'intro',camLock:0,cam:{x:355,y:790,z:250,pitch:88}};
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
 if(s.modes[0]===0)rays.push({x:310,y:588,r:103,source:0});
 if(s.modes[0]===1){
  rays.push({x:474,y:583,r:104,source:0},{x:573,y:583,r:103,source:0},{x:673,y:583,r:117,source:0},{x:732,y:583,r:95,source:0});
 }
 if(s.modes[0]===2)rays.push({x:830,y:583,r:113,source:0});
 // M2: a walking spotlight, then a fixed beam that doubles as iris input.
 if(s.modes[1]===0)rays.push({x:778,y:478,r:102,source:1});
 if(s.modes[1]===1)rays.push({x:travellingRay(),y:583,r:141,source:1});
 if(s.modes[1]===2)rays.push({x:913,y:583,r:174,source:1});
 // M3: a rehearsal arc or long final cover.
 if(s.modes[2]===0)rays.push({x:1060,y:382,r:110,source:2});
 if(s.modes[2]===1)rays.push({x:1045+78*Math.sin(s.elapsed*.68),y:552,r:103,source:2});
 if(s.modes[2]===2)rays.push({x:1151,y:583,r:180,source:2});
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
 s.shield=1.8;s.flash=.2;s.trail=[];s.alert=0;s.camPhase=safeRight?'wide':'intro';s.camLock=.45;
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


const worldX=x=>x*2,worldZ=y=>(635-y)*2.2,first=n=>runtimeScene.getObjects(n)[0];
const move=(o,x,y,z)=>{if(!o)return;o.setX(x);o.setY(y);if(typeof o.setZ==='function')o.setZ(z);};
const show=(name,visible)=>runtimeScene.getObjects(name).forEach(o=>o.hide(!visible));
const ps=worldX(s.x),pz=worldZ(s.y);
// v0.9.20: per-frame contact anchors. Game collision coordinates remain authoritative.
// Surface classification is latched while airborne: jumping cannot move the sprite between 3D depth lanes.
const spriteFrames={"Idle":["SpalakhIdle0","SpalakhIdle1","SpalakhIdle2","SpalakhIdle3","SpalakhIdle4","SpalakhIdle5"],"Run":["SpalakhRun0","SpalakhRun1","SpalakhRun2","SpalakhRun3","SpalakhRun4","SpalakhRun5","SpalakhRun6"],"Jump":["SpalakhJump0","SpalakhJump1","SpalakhJump2"],"Fall":["SpalakhFall0","SpalakhFall1","SpalakhFall2"],"Land":["SpalakhLand0","SpalakhLand1","SpalakhLand2","SpalakhLand3"]};
const spriteRate={Idle:6,Run:13,Jump:9,Fall:9,Land:18};
const spriteNames=["SpalakhIdle0","SpalakhIdle1","SpalakhIdle2","SpalakhIdle3","SpalakhIdle4","SpalakhIdle5","SpalakhRun0","SpalakhRun1","SpalakhRun2","SpalakhRun3","SpalakhRun4","SpalakhRun5","SpalakhRun6","SpalakhJump0","SpalakhJump1","SpalakhJump2","SpalakhFall0","SpalakhFall1","SpalakhFall2","SpalakhLand0","SpalakhLand1","SpalakhLand2","SpalakhLand3"];
const cycle=s.dead?'Fall':(s.ground&&s.groundTimer>0?'Land':!s.ground?(s.vy<0?'Jump':'Fall'):Math.abs(s.vx)>65?'Run':'Idle');
const frames=spriteFrames[cycle],count=frames.length;
const rawIndex=cycle==='Land'?
 Math.floor(Math.max(0,.14-s.groundTimer)/.14*count):
 Math.floor(s.elapsed*spriteRate[cycle]);
const frameIndex=cycle==='Land'?clamp(rawIndex,0,count-1):(rawIndex%count);
const visibleName=frames[frameIndex];
// Each PNG frame has its own visual foot baseline (in GDevelop 3D world units).
// Keeping the base near the physical floor prevents hovering on narrow ledges.
const footCorrection={
 Idle:[2,1,3,2,1,2],
 Run:[2,1,0,2,1,3,1],
 Jump:[0,-1,-2],
 Fall:[-1,0,-2],
 Land:[4,3,2,1]
};
if(typeof s.visualLastGroundY!=='number')s.visualLastGroundY=635;
if(s.ground)s.visualLastGroundY=s.y;
const contactY=s.visualLastGroundY;
// Bridge has a different stage geometry; classify it separately from the main floor.
const isBridge=s.modes[0]===1&&s.x>=423&&s.x<=703&&contactY>=610;
const surfaceKind=isBridge?'Bridge':contactY>=610?'Main':contactY>=465?'Mid':'Upper';
const surfaceDepth={Main:-35,Bridge:-24,Mid:-18,Upper:-11};
const surfaceLift={Main:4,Bridge:2,Mid:1,Upper:1};
const desiredDepth=surfaceDepth[surfaceKind];
if(typeof s.spriteVisualDepth!=='number')s.spriteVisualDepth=desiredDepth;
// Keep the sprite stable when moving from one collider to another.
s.spriteVisualDepth+=(desiredDepth-s.spriteVisualDepth)*(1-Math.exp(-12*dt));
const footFrameOffset=footCorrection[cycle][frameIndex]||0;
const finalFootZ=pz+surfaceLift[surfaceKind]+footFrameOffset;
for(const spriteName of spriteNames){
 const sprite=first(spriteName);
 if(!sprite)continue;
 const active=spriteName===visibleName&&!s.dead;
 sprite.hide(!active);
 if(!active)continue;
 // Texture lies on a vertical XZ face; Z here is the bottom of the image plane.
 move(sprite,ps-150,s.spriteVisualDepth,finalFootZ);
 if(typeof sprite.getAngle==='function'&&typeof sprite.setAngle==='function'&&sprite.getAngle()!==0)sprite.setAngle(0);
 if(typeof sprite.flipX==='function')sprite.flipX(s.face>0);
}
const aura=first('SpalakhAura'),ground=first('SpalakhGroundGlow');
if(aura)move(aura,ps-175,s.spriteVisualDepth-10,pz-55);
if(ground){
 ground.hide(s.dead||!s.ground);
 // Ground glow follows the *physical* collision plane, not the air-frame offset.
 move(ground,ps-85,s.spriteVisualDepth+4,pz+1);
}

const pools=runtimeScene.getObjects('ObsSafeGlow'),lamps=runtimeScene.getObjects('ObsPoolLight'),spots=coneSpots();
for(let i=0;i<pools.length;i++){const o=pools[i],spot=spots[i];o.hide(!spot);if(spot)move(o,worldX(spot.x)-180,-55,worldZ(spot.y)-30);}
for(let i=0;i<lamps.length;i++){const o=lamps[i],spot=spots[i];o.hide(!spot);if(spot){o.setX(worldX(spot.x));o.setY(-55);if(typeof o.setZ==='function')o.setZ(worldZ(spot.y)+35);}}
show('ObsBridge',bridge());show('ObsIris',!irisOpen());show('ObsIrisLine',!irisOpen());
show('ObsBridgeRim',bridge());
show('ObsGateFrame',!irisOpen());show('ObsGateCore',!irisOpen());
const gateLamp=first('ObsPinkGateLight');if(gateLamp)gateLamp.hide(irisOpen());
// Neon front badges face the camera even when GLB materials are one-sided in Preview.
// Render exactly three cyan beam cones tied to real optics, not decorative fake safe zones.
const beamPlanes=runtimeScene.getObjects('ObsLightCone');
const panelTargets=[
 s.modes[0]===0?{x:310,y:588}:s.modes[0]===1?{x:573,y:583}:{x:830,y:583},
 s.modes[1]===0?{x:778,y:478}:s.modes[1]===1?{x:travellingRay(),y:583}:{x:913,y:583},
 s.modes[2]===0?{x:1060,y:382}:s.modes[2]===1?{x:1045+78*Math.sin(s.elapsed*.68),y:552}:{x:1151,y:583}
];
// Every light cone is now geometrically attached to its own hanging 3D spotlight.
const spotlightModels=[runtimeScene.getObjects('ObsSpotlight')[0],runtimeScene.getObjects('ObsSpotlightVintage')[0],runtimeScene.getObjects('ObsSpotlight')[1]];
for(let i=0;i<3;i++){
 const plane=beamPlanes[i],model=spotlightModels[i],target=panelTargets[i];
 if(!plane||!model){if(plane)plane.hide(true);continue;}
 const srcX=model.getX()+model.getWidth()*.5;
 const srcZ=model.getZ()+model.getDepth()*.48;
 const targetX=worldX(target.x),targetZ=worldZ(target.y);
 const deltaX=srcX-targetX,deltaZ=srcZ-targetZ;
 const beamLength=Math.max(90,Math.hypot(deltaX,deltaZ));
 const angleY=Math.atan2(deltaX,deltaZ)*180/Math.PI;
 const midX=(srcX+targetX)*.5,midZ=(srcZ+targetZ)*.5;
 plane.hide(false);
 if(typeof plane.setRotationY==='function')plane.setRotationY(angleY);
 // Center the beam rectangle between the lamp lens and the physical illuminated spot.
 move(plane,midX-plane.getWidth()*.5,model.getY()+model.getHeight()+12,midZ-beamLength*.5);
 if(typeof plane.setDepth==='function')plane.setDepth(beamLength);
}
for(const [i,o] of runtimeScene.getObjects('ObsDial').entries())o.setColor(s.modes[i]===1?'111;244;226':s.modes[i]===2?'172;228;169':'169;132;200');
// Each spider uses two emissive, spherical GLB eyes anchored to the front of its head.
const visibleSpiders=runtimeScene.getObjects('ObsSpider3D');
const eyes=runtimeScene.getObjects('ObsSpiderRedEye');
const redLights=runtimeScene.getObjects('ObsSpiderRedLight');
for(let i=0;i<visibleSpiders.length;i++){
 const spider=visibleSpiders[i],originalX=SPIDERS[i]?.x;
 if(!spider||originalX===undefined)continue;
 const dx=Math.sin(s.elapsed*.75+originalX*.011)*19*2;
 spider.setX(worldX(originalX)-61+dx);
 // GDevelop 3D: Z is vertical, Y is front/back. No more red boxes under the spider.
 const eyesZ=spider.getZ()+spider.getDepth()*.90;
 const eyesY=spider.getY()+spider.getHeight()*.90;
 for(let eyeIndex=0;eyeIndex<2;eyeIndex++){
  const eye=eyes[i*2+eyeIndex];
  const localX=eyeIndex===0?.41:.59;
  const x=spider.getX()+spider.getWidth()*localX;
  if(eye)move(eye,x-eye.getWidth()*.5,eyesY-eye.getHeight()*.5,eyesZ-eye.getDepth()*.5);
 }
 const redLight=redLights[i];
 if(redLight)move(redLight,spider.getX()+spider.getWidth()*.5,eyesY+3,eyesZ);
}

const trails=runtimeScene.getObjects('Spark');
for(let i=0;i<trails.length;i++){let tr=s.trail[s.trail.length-i-1],o=trails[i];o.hide(!tr);if(tr)move(o,worldX(tr.x),18,worldZ(tr.y));}
const status=(name,value)=>{const o=first(name);if(o&&o.setString)o.setString(value);};
const shelteredHere=hidden();
status('ObsStatus','РЕФРАКТОРИ '+s.modes.map((mode,i)=>'ABC'[i]+':'+(mode+1)).join('  ')+
 '   •   МІСТ '+(bridge()?'✓':'○')+'   •   ЗАТВОР '+(irisOpen()?'✓':'○')+
 '   •   '+(shelteredHere?'У СВІТЛІ':'У ТЕМРЯВІ')+'   •   ЗАГИБЕЛЕЙ '+s.deaths);
let task=!bridge()?'01 / ПУЛЬТ A: ПОВЕРНИ ПРОМІНЬ ТА СТВОРИ СВІТЛОВИЙ МІСТ [E].'
 :!s.crossed?'02 / ПЕРЕЙДИ ПРОВАЛЛЯ ТА ЗНАЙДИ ПУЛЬТ B.'
 :s.modes[1]===0?'03 / ПУЛЬТ B: АКТИВУЙ РУХОМЕ СВІТЛО [E].'
 :s.modes[2]===0?'04 / РУХАЙСЯ РАЗОМ ІЗ ПРОМЕНЕМ ДО ПУЛЬТА C.'
 :s.modes[2]!==2?'05 / ПУЛЬТ C: ОСВІТЛИ ВИХІД [E].'
 :!irisOpen()?'06 / ПЕРЕНАЛАШТУЙ ПУЛЬТ B ДЛЯ ВІДКРИТТЯ ЗАТВОРА.'
 :'ПРОЙДИ ЧЕРЕЗ ОСВІТЛЕНИЙ КОРИДОР ДО ВИХОДУ.';
if(s.alert>.55&&!shelteredHere)task='НЕБЕЗПЕКА: ПАВУКИ ПОМІЧАЮТЬ СПАЛАХА У ТЕМРЯВІ!';
if(s.won)task='ОБСЕРВАТОРІЮ ПРОЙДЕНО — ТИ ПРОКЛАВ ШЛЯХ ІЗ СВІТЛА.';
status('ObsTask',task);
const nearby=PANELS.map((pos,i)=>({name:'ABC'[i],distance:Math.hypot(s.x-pos.x,s.y-38-pos.y)})).sort((a,b)=>a.distance-b.distance)[0];
const actionPrompt=nearby.distance<85?'ПУЛЬТ '+nearby.name+'  •  E — ПОВЕРНУТИ ПРОМІНЬ':'';
status('ObsMessage',s.messageClock>0?s.message:actionPrompt);
status('ObsWin',s.won?'ОБСЕРВАТОРІЮ ПРОЙДЕНО!':'');
// CAMERA v0.9.8: smooth cinematic close / full reveal / exit with a near-side angle.
// The intro returns whenever Spalakh walks back to the left start area.
const nearA=d(s.x,s.y-38,PANELS[0].x,PANELS[0].y);
s.camLock=Math.max(0,(s.camLock||0)-dt);
const setCamPhase=next=>{if(s.camPhase!==next){s.camPhase=next;s.camLock=.32;}};
if(s.camLock<=0){
 if((s.camPhase==='wide'||s.camPhase==='exit')&&s.x<174&&nearA>118&&!s.won){
  setCamPhase('intro');
 }else if(s.camPhase==='intro'&&nearA<102){
  setCamPhase('wide');
 }else if(s.camPhase==='wide'&&(s.won||(irisOpen()&&s.x>1115&&s.y>490))){
  setCamPhase('exit');
 }else if(s.camPhase==='exit'&&s.x<1030&&!s.won){
  setCamPhase('wide');
 }
}
const camTargets={
 intro:{x:clamp(worldX(s.x)+150,340,565),y:790,z:250,pitch:88},
 wide:{x:1280,y:1780,z:610,pitch:87.5},
 exit:{x:clamp(worldX(s.x)-90,2160,2350),y:790,z:255,pitch:88}
};
const aim=camTargets[s.camPhase]||camTargets.wide;
if(!s.cam)s.cam={x:355,y:790,z:250,pitch:88};
// Slow frame-rate-independent interpolation for focal point, zoom and camera angle.
const easeXY=1-Math.exp(-1.52*dt);
const easeZoom=1-Math.exp(-1.02*dt);
const easeAngle=1-Math.exp(-.95*dt);
s.cam.x+=(aim.x-s.cam.x)*easeXY;
s.cam.y+=(aim.y-s.cam.y)*easeZoom;
s.cam.z+=(aim.z-s.cam.z)*easeZoom;
s.cam.pitch+=(aim.pitch-s.cam.pitch)*easeAngle;
gdjs.evtTools.camera.setCameraX(runtimeScene,s.cam.x,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,s.cam.y,'',0);
gdjs.scene3d.camera.setCameraZ(runtimeScene,s.cam.z,'',0);
gdjs.scene3d.camera.setCameraRotationX(runtimeScene,s.cam.pitch,'',0);
gdjs.scene3d.camera.setCameraRotationY(runtimeScene,0,'',0);
})();