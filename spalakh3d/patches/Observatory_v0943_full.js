// ПІСЛЯСВІТ — ОБСЕРВАТОРІЯ ХИБНОГО СВІТЛА • 3D CINEMATIC NIGHT v0.9.8 (v0.9.43 bridge surface / softer lens, foot anchoring v0.9.23, v0.9.36 beams/tail/domes, v0.9.34 visual polish, graphics pass v0.9.25, soft-depth parallax v0.9.30, wide ribbon v0.9.31, clean depth v0.9.32, magic flame / 3D depth v0.9.33)
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
 bright:.12,flash:0,trail:[],trailTick:0,flameTrail:[],flameTick:0,groundTimer:0,
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
 s.shield=1.8;s.flash=.2;s.trail=[];s.flameTrail=[];s.flameTick=0;s.alert=0;s.camPhase=safeRight?'wide':'intro';s.camLock=.45;
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
// v0.9.31: dense position sampling for a CONTINUOUS, layered, 2D-like luminous tail.
// Gameplay movement unchanged; samples only record the already-computed character motion.
if(!Array.isArray(s.flameTrail))s.flameTrail=[];
s.flameTick=(s.flameTick||0)+dt;
const flameSpeed=Math.abs(s.vx),flameNorm=clamp(flameSpeed/202,0,1);
if(s.flameLastFacing!==undefined&&s.flameLastFacing!==s.face)s.flameTrail=[];
s.flameLastFacing=s.face;
if(flameSpeed>12&&s.flameTick>=(.026-.014*flameNorm)){
 const back=s.face||1;
 s.flameTrail.push({
  x:s.x-back*(12+7*flameNorm),y:s.y-48,
  age:0,life:.20+.54*flameNorm,v:flameNorm,face:back,
  seed:s.elapsed*8.9
 });
 s.flameTick=0;
}
for(const q of s.flameTrail)q.age+=dt;
s.flameTrail=s.flameTrail.filter(q=>q.age<q.life).slice(-78);
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
// v0.9.23: foot contact measured from real PNG alpha + real platform meshes (see FOOT ANCHORING block).
// Game character physics, gravity, puzzle rules, camera and animations remain unchanged.
const spriteFrames={"Idle":["SpalakhIdle0","SpalakhIdle1","SpalakhIdle2","SpalakhIdle3","SpalakhIdle4","SpalakhIdle5","SpalakhIdle6","SpalakhIdle7","SpalakhIdle8","SpalakhIdle9","SpalakhIdle10","SpalakhIdle11","SpalakhIdle12","SpalakhIdle13","SpalakhIdle14","SpalakhIdle15"],"Run":["SpalakhRun0","SpalakhRun1","SpalakhRun2","SpalakhRun3","SpalakhRun4","SpalakhRun5","SpalakhRun6"],"Jump":["SpalakhJump0","SpalakhJump1","SpalakhJump2"],"Fall":["SpalakhFall0","SpalakhFall1","SpalakhFall2"],"Land":["SpalakhLand0","SpalakhLand1","SpalakhLand2","SpalakhLand3"],"Slow":["SpalakhSlow0","SpalakhSlow1","SpalakhSlow2","SpalakhSlow3","SpalakhSlow4","SpalakhSlow5","SpalakhSlow6","SpalakhSlow7"],"Crouch":["SpalakhCrouch0","SpalakhCrouch1","SpalakhCrouch2","SpalakhCrouch3","SpalakhCrouch4"]};
const spriteRate={Idle:8,Run:13,Jump:9,Fall:9,Land:26,Slow:10,Crouch:6};
const spriteNames=["SpalakhIdle0","SpalakhIdle1","SpalakhIdle2","SpalakhIdle3","SpalakhIdle4","SpalakhIdle5","SpalakhIdle6","SpalakhIdle7","SpalakhIdle8","SpalakhIdle9","SpalakhIdle10","SpalakhIdle11","SpalakhIdle12","SpalakhIdle13","SpalakhIdle14","SpalakhIdle15","SpalakhRun0","SpalakhRun1","SpalakhRun2","SpalakhRun3","SpalakhRun4","SpalakhRun5","SpalakhRun6","SpalakhJump0","SpalakhJump1","SpalakhJump2","SpalakhFall0","SpalakhFall1","SpalakhFall2","SpalakhLand0","SpalakhLand1","SpalakhLand2","SpalakhLand3","SpalakhSlow0","SpalakhSlow1","SpalakhSlow2","SpalakhSlow3","SpalakhSlow4","SpalakhSlow5","SpalakhSlow6","SpalakhSlow7","SpalakhCrouch0","SpalakhCrouch1","SpalakhCrouch2","SpalakhCrouch3","SpalakhCrouch4"];
const cycle=s.dead?'Fall':(s.ground&&s.groundTimer>0?'Land':!s.ground?(s.vy<0?'Jump':'Fall'):input.crouch?(Math.abs(s.vx)>18?'Slow':'Crouch'):Math.abs(s.vx)>65?'Run':'Idle');
if(s.animCycleName!==cycle){s.animCycleName=cycle;s.animCycleTime=0;}
else s.animCycleTime=(s.animCycleTime||0)+dt;
const frames=spriteFrames[cycle],count=frames.length;
const rawIndex=cycle==='Land'
 ?Math.floor(Math.max(0,.14-s.groundTimer)/.14*count)
 :Math.floor(s.animCycleTime*spriteRate[cycle]);
// Jump/Fall are one-shot poses; looping their 3 frames caused a visible reset (flash) midair.
const frameIndex=(cycle==='Land'||cycle==='Jump'||cycle==='Fall')?clamp(rawIndex,0,count-1):((rawIndex%count)+count)%count;
const visibleName=frames[frameIndex];

// ===== v0.9.23 — MEASURED FOOT ANCHORING =====
// Root cause of v0.9.22: the contact point was a hand-fitted screen-space pair (depth, lift) valid for ONE camera pose,
// plus frame offsets guessed by eye. Here the contact is measured from the real assets:
//  (1) gap[frame]  = transparent rows under the lowest opaque pixel of each Spalakh PNG (alpha scan of the loaded texture),
//  (2) surface Z   = visible top of the supporting 3D platform (ray cast straight down onto the real GLB mesh at the sprite's X/Y).
// finalZ = surfaceZ - gap[frame]: feet touch the true 3D surface from any camera pose. Physics, camera, puzzles are untouched.
// If THREE / texture pixels are not available, the v0.9.22 presets below are used unchanged as a fallback.
const FOOT_DEBUG=false; // true => console.log of measured gaps, mesh-vs-collider table and per-support data
const PLANE_Z=196,ALPHA_MIN=110,MIN_ROW_PX=3,TOL=40,EMBED=.35,FLAT_EPS=2.5,FLAT_MARGIN=10;
const SURFACE_PRESET={
 Main:   {depth:-108,standLift:12,landLift:15,inset:8},
 Bridge: {depth:-92, standLift:16,landLift:18,inset:8},
 Mid:    {depth:-18, standLift:1, landLift:3, inset:5},
 Upper:  {depth:-11, standLift:1, landLift:2, inset:5}
};
// Legacy per-frame corrections: used ONLY when measurement is unavailable.
const footCorrection={
 Idle:[2,1,3,2,1,2,2,1,2,2,1,2,2,1,2,1],
 Slow:[2,1,0,2,2,1,2,1],
 Crouch:[2,1,2,1,2],
 Run:[2,1,0,2,1,3,1],
 Jump:[0,-1,-2],
 Fall:[-1,0,-2],
 Land:[4,3,2,1]
};
const fx=runtimeScene.__spalakhFoot||(runtimeScene.__spalakhFoot={gap:{},px:{},tries:{},plats:null,rc:null,flat:{},logged:{},tableDone:false});
if(FOOT_DEBUG&&typeof window!=='undefined')window.__spalakhFoot=fx;
// 1) PNG foot gap: world units between the plane's lower edge (object Z) and the lowest opaque pixel.
function scanFrame(name){
 if(fx.gap[name]!==undefined||(fx.tries[name]||0)>=8)return;
 fx.tries[name]=(fx.tries[name]||0)+1;
 try{
  const m=/^Spalakh([A-Za-z]+)(\d+)$/.exec(name);
  if(!m)return;
  const res='spalakh3d/sprite2d/'+m[1].toLowerCase()+'_'+String(Number(m[2])).padStart(2,'0')+'.png';
  const tex=runtimeScene.getGame().getImageManager().getThreeTexture(res);
  const img=tex&&tex.image;
  const w0=img&&(img.naturalWidth||img.width),h0=img&&(img.naturalHeight||img.height);
  if(!(w0>0&&h0>0))return; // not decoded yet — retried on a later frame
  const k=Math.min(1,768/w0),w=Math.max(1,Math.round(w0*k)),h=Math.max(1,Math.round(h0*k));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const cx=cv.getContext('2d',{willReadFrequently:true});
  cx.drawImage(img,0,0,w,h);
  const data=cx.getImageData(0,0,w,h).data;
  let row=-1;
  for(let y=h-1;y>=0&&row<0;y--){
   let n=0;
   for(let x=0;x<w;x++){if(data[(y*w+x)*4+3]>=ALPHA_MIN&&++n>=MIN_ROW_PX){row=y;break;}}
  }
  if(row<0){fx.tries[name]=99;return;}
  fx.px[name]=h-(row+1);
  fx.gap[name]=(h-(row+1))/h*PLANE_Z;
  if(FOOT_DEBUG)console.log('[foot] '+name+' png '+w0+'x'+h0+' bottomPad(px@'+h+')='+fx.px[name]+' gap='+fx.gap[name].toFixed(2)+'u');
 }catch(e){
  if(!fx.logged.scan){fx.logged.scan=1;console.warn('[foot] PNG alpha scan unavailable, legacy offsets used:',e&&e.message);}
  fx.tries[name]=99;
 }
}
// Airborne frames share one gap per cycle (mean), so the body does not bob between Jump/Fall frames.
function cycleGap(cyc){
 let sum=0,n=0;
 for(const f of spriteFrames[cyc]){const g=fx.gap[f];if(g!==undefined){sum+=g;n++;}}
 return n?sum/n:undefined;
}
// 2) Real platform meshes (ObsGround / ObsStep / ObsBridge) and downward ray casts.
function getPlatforms(){
 if(typeof THREE==='undefined')return null;
 if(fx.plats)return fx.plats;
 try{
  const list=[];
  for(const name of ['ObsGround','ObsStep','ObsBridge']){
   for(const o of runtimeScene.getObjects(name)){
    const t=o.get3DRendererObject&&o.get3DRendererObject();
    if(!t)return null;
    t.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(t);
    if(box.isEmpty())return null; // GLB not ready yet — retry next frame
    list.push({name,o,t,box});
   }
  }
  fx.plats=list.length?list:null;
  return fx.plats;
 }catch(e){
  if(!fx.logged.plat){fx.logged.plat=1;console.warn('[foot] platform meshes unavailable, legacy offsets used:',e&&e.message);}
  return null;
 }
}
function castDown(targets,x,y,zExpected){
 try{
  const rc=fx.rc||(fx.rc=new THREE.Raycaster());
  rc.set(new THREE.Vector3(x,y,zExpected+TOL+60),new THREE.Vector3(0,0,-1));
  rc.near=0;rc.far=2*TOL+120;
  const hits=rc.intersectObjects(targets,true);
  for(const h of hits)if(Math.abs(h.point.z-zExpected)<=TOL)return h.point.z;
 }catch(e){}
 return null;
}
// Platform whose real mesh spans world X and whose real top is near the collider top.
function findPlat(x,zExpected,preferBridge){
 const P=getPlatforms();if(!P)return null;
 let best=null,score=Infinity;
 for(const r of P){
  const b=r.box;
  if(r.name==='ObsBridge'&&!bridge())continue;
  if(x<b.min.x-1||x>b.max.x+1)continue;
  const dz=Math.abs(b.max.z-zExpected);if(dz>TOL)continue;
  const sc=dz+((r.name==='ObsBridge')===!!preferBridge?0:.5);
  if(sc<score){best=r;score=sc;}
 }
 return best;
}
// Flat part of the visible top in Y (bevel/rim excluded), measured once per platform.
function flatRange(rec,zExpected){
 const key=rec.t.uuid;
 if(fx.flat[key])return fx.flat[key];
 const b=rec.box,xc=(b.min.x+b.max.x)/2,y0=b.min.y+3,y1=b.max.y-3,N=24,zs=[];
 let top=-Infinity;
 for(let i=0;i<=N;i++){
  const y=y0+(y1-y0)*i/N,z=castDown([rec.t],xc,y,zExpected);
  zs.push(z===null?null:{y,z});
  if(z!==null&&z>top)top=z;
 }
 let lo=Infinity,hi=-Infinity;
 for(const e of zs)if(e&&e.z>=top-FLAT_EPS){lo=Math.min(lo,e.y);hi=Math.max(hi,e.y);}
 const f=hi>lo?{lo,hi,top}:{lo:b.min.y+FLAT_MARGIN,hi:b.max.y-FLAT_MARGIN,top:null};
 fx.flat[key]=f;
 if(FOOT_DEBUG)console.log('[foot] flat top '+rec.name+' x['+b.min.x.toFixed(0)+'..'+b.max.x.toFixed(0)+'] y['+f.lo.toFixed(1)+'..'+f.hi.toFixed(1)+'] z='+(f.top===null?'n/a':f.top.toFixed(2))+' (collider z='+zExpected.toFixed(2)+')');
 return f;
}
// Debug table: every collider vs the real mesh top under it.
function colliderTable(){
 if(fx.tableDone||!FOOT_DEBUG)return;
 const P=getPlatforms();if(!P)return;
 fx.tableDone=true;
 const all=FLOOR.map((f,i)=>({n:'FLOOR'+i,f})).concat(LIGHT_BRIDGE.map((f,i)=>({n:'BRIDGE'+i,f,br:1})));
 for(const c of all){
  const f=c.f,xm=worldX(f.x+f.w/2),ze=worldZ(f.y);
  const saved=s.modes[0];
  const rec=P.find(r=>(r.name==='ObsBridge')===!!c.br&&xm>=r.box.min.x-1&&xm<=r.box.max.x+1&&Math.abs(r.box.max.z-ze)<=TOL);
  if(!rec){console.log('[foot] '+c.n+' NO MESH within '+TOL+'u of collider top z='+ze.toFixed(1));continue;}
  const fr=flatRange(rec,ze);
  console.log('[foot] '+c.n+' collider z='+ze.toFixed(2)+' meshBoxTop='+rec.box.max.z.toFixed(2)+' flatTop='+(fr.top===null?'n/a':fr.top.toFixed(2))+' delta='+(fr.top===null?'n/a':(fr.top-ze).toFixed(2)));
 }
}
// Identify actual supporting collider, rather than reclassifying by sprite position.
function findCurrentSupport(){
 if(!s.ground)return null;
 const surfaces=FLOOR.concat(bridge()?LIGHT_BRIDGE:[]);
 let best=null,score=Infinity;
 for(const floor of surfaces){
  if(Math.abs(floor.y-s.y)>.5)continue;
  if(s.x+13<=floor.x||s.x-13>=floor.x+floor.w)continue;
  const distance=Math.abs(s.x-clamp(s.x,floor.x,floor.x+floor.w));
  // If bridge shares a seam with a floor, select the contact whose center is nearest.
  const isBridgePiece=bridge()&&LIGHT_BRIDGE.includes(floor);
  const thisScore=distance+(isBridgePiece?-.01:0);
  if(thisScore<score){best={floor,isBridgePiece};score=thisScore;}
 }
 return best;
}
// Warm the PNG scan (visible frame first, then at most two more per frame).
scanFrame(visibleName);
{let budget=2;for(const n of spriteNames){if(budget<=0)break;if(fx.gap[n]===undefined&&(fx.tries[n]||0)<8){scanFrame(n);budget--;}}}
colliderTable();
const support=findCurrentSupport();
if(typeof s.lastSupportKind!=='string')s.lastSupportKind='Main';
if(typeof s.visualLastGroundY!=='number')s.visualLastGroundY=635;
if(s.ground){
 s.visualLastGroundY=s.y;
 const kind=support?.isBridgePiece?'Bridge'
  :s.y>=610?'Main':s.y>=465?'Mid':'Upper';
 s.lastSupportKind=kind;
}
const surfaceKind=s.lastSupportKind;
const preset=SURFACE_PRESET[surfaceKind]||SURFACE_PRESET.Main;
// Clamping modifies the artwork only; the collision body retains its real coordinates.
let renderX=s.x;
if(s.ground&&support){
 const floor=support.floor;
 const left=floor.x+preset.inset,right=floor.x+floor.w-preset.inset;
 if(left<=right)renderX=clamp(s.x,left,right);
}
const visualPs=worldX(renderX);
// Plane depth: authored preferred depth, kept inside the flat part of the real top. Updated on the ground only,
// so the sprite never changes depth plane in the air.
if(typeof s.footDepthTarget!=='number')s.footDepthTarget=preset.depth;
let platRec=null;
if(s.ground&&support){
 platRec=findPlat(visualPs,pz,support.isBridgePiece);
 if(platRec){
  const fr=flatRange(platRec,pz),lo=fr.lo+FLAT_MARGIN,hi=fr.hi-FLAT_MARGIN;
  s.footDepthTarget=lo<=hi?clamp(preset.depth,lo,hi):(fr.lo+fr.hi)/2;
 }else s.footDepthTarget=preset.depth;
}
const desiredDepth=s.footDepthTarget;
if(typeof s.spriteVisualDepth!=='number')s.spriteVisualDepth=desiredDepth;
s.spriteVisualDepth+=(desiredDepth-s.spriteVisualDepth)*(1-Math.exp(-16*dt));
// Visible top of the supporting platform under the sprite (plane centre = depth + half thickness 2).
if(s.ground&&support&&platRec){
 const zHit=castDown([platRec.t],visualPs,s.spriteVisualDepth+2,pz);
 if(zHit!==null){
  const off=zHit-pz;
  s.footOff=(s.footValid&&typeof s.footOff==='number')?s.footOff+(off-s.footOff)*(1-Math.exp(-45*dt)):off;
  s.footValid=true;
 }
}
const gapFrame=s.ground?fx.gap[visibleName]:cycleGap(cycle);
const measured=s.footValid&&typeof s.footOff==='number'&&gapFrame!==undefined;
let finalFootZ;
if(measured){
 finalFootZ=pz+s.footOff-gapFrame+EMBED;
}else{
 const frameOffset=footCorrection[cycle][frameIndex]||0;
 const contactLift=!s.ground?0:cycle==='Land'?preset.landLift:preset.standLift;
 const airBias=cycle==='Jump'?-2:cycle==='Fall'?-4:0;
 finalFootZ=pz+contactLift+frameOffset+airBias;
}
const surfaceZ=measured?pz+s.footOff:pz;
if(FOOT_DEBUG&&s.ground&&support&&s.elapsed-(fx.lastLog||0)>1){
 fx.lastLog=s.elapsed;
 console.log('[foot] '+cycle+frameIndex+' kind='+surfaceKind+' measured='+measured+' physZ='+pz.toFixed(1)+' surfZ='+surfaceZ.toFixed(2)+' gap='+(gapFrame===undefined?'n/a':gapFrame.toFixed(2))+' planeZ='+finalFootZ.toFixed(2)+' depth='+s.spriteVisualDepth.toFixed(1)+' mesh='+(platRec?platRec.name:'none'));
}
for(const spriteName of spriteNames){
 const sprite=first(spriteName);
 if(!sprite)continue;
 const active=spriteName===visibleName&&!s.dead;
 sprite.hide(!active);
 if(!active)continue;
 // Z is the lower edge of this vertical XZ sprite sheet.
 move(sprite,visualPs-150,s.spriteVisualDepth,finalFootZ);
 if(typeof sprite.getAngle==='function'&&typeof sprite.setAngle==='function'&&sprite.getAngle()!==0)sprite.setAngle(0);
 if(typeof sprite.flipX==='function')sprite.flipX(s.face>0);
  // Depth write on transparent 300x196 sprite faces created the square mask.
  const render=sprite.get3DRendererObject&&sprite.get3DRendererObject();
  if(render&&render.traverse)render.traverse(node=>{
   if(!node.isMesh)return;
   if(!node.userData.alphaFix38){
    const multi=Array.isArray(node.material),ms=multi?node.material:[node.material];
    const out=ms.map(m=>{
     if(!m)return m;const a=m.clone();
     // Native sprite textures have large transparent margins. They must never occlude the hero
     // (or be occluded by a transparent safety/beam plane's depth buffer).
     a.transparent=true;a.depthWrite=false;a.depthTest=false;
     a.alphaTest=Math.max(.065,a.alphaTest||0);a.needsUpdate=true;
     return a;
    });
    node.material=multi?out:out[0];node.userData.alphaFix38=true;
   }
   node.renderOrder=960; // character is composited above 3D decorations; HUD remains a separate layer
  });
}
const aura=first('SpalakhAura'),ground=first('SpalakhGroundGlow');
if(aura){
  // Native 350x250 double-sided glow plane visibly leaves a square matte around Spalakh.
  // Keep its GDevelop object as a resource but do NOT render its geometry.
  aura.hide(true);
  move(aura,visualPs-175,s.spriteVisualDepth-10,surfaceZ-55);
  const r=aura.get3DRendererObject&&aura.get3DRendererObject();
  if(r&&r.traverse)r.traverse(n=>{
   if(!n.isMesh)return;
   if(!n.userData.alphaAura38){
    const mult=Array.isArray(n.material),ms=mult?n.material:[n.material];
    const out=ms.map(m=>{
     if(!m)return m;const c=m.clone();
     c.transparent=true;c.depthWrite=false;c.depthTest=true;
     c.alphaTest=Math.max(.025,c.alphaTest||0);c.needsUpdate=true;return c;
    });
    n.material=mult?out:out[0];n.userData.alphaAura38=true;
   }
   n.renderOrder=49;
  });
 }
if(ground){
 // A native 170x100 textured cube can leave a rectangular depth footprint over other geometry.
 // The separate feathered radial halo already provides the character glow without a quad mask.
 ground.hide(true);
}

// ===== v0.9.41: never let other transparent art planes write rectangular depth masks =====
if(typeof THREE!=='undefined'){
 for(const name of [
  'ObsCoralGlowCyan','ObsCoralGlowPink','ObsCoralGlowViolet','ObsCoralGlowYellow','ObsCoralGlowWhite',
  'ObsCoralSpillCyan','ObsCoralSpillPink','ObsCoralSpillViolet','ObsCoralSpillYellow','ObsCoralSpillWhite',
  'ObsSpotlightFootprint'
 ])for(const item of runtimeScene.getObjects(name)){
  const root=item.get3DRendererObject&&item.get3DRendererObject();
  if(!root||!root.traverse)continue;
  root.traverse(node=>{
   if(!node.isMesh||node.userData.spalakhAlphaSafe41)return;
   const materials=Array.isArray(node.material)?node.material:[node.material];
   const safe=materials.map(src=>{
    if(!src)return src;
    const m=src.clone();m.transparent=true;m.depthWrite=false;
    m.alphaTest=Math.max(.025,m.alphaTest||0);m.needsUpdate=true;return m;
   });
   node.material=Array.isArray(node.material)?safe:safe[0];
   node.userData.spalakhAlphaSafe41=true;
  });
 }
}

// ===== v0.9.39: Radial halo replaces the rectangular GDevelop Aura cube =====
if(typeof THREE!=='undefined'){
 try{
  const h=runtimeScene.__spalakhRadial39||(runtimeScene.__spalakhRadial39={scene:null,sprite:null,texture:null,warned:false});
  const rs=runtimeScene.getLayer('').getRenderer().getThreeScene();
  if(rs&&(!h.sprite||h.scene!==rs)){
   if(h.scene&&h.sprite){h.scene.remove(h.sprite);h.sprite.material.dispose();if(h.texture)h.texture.dispose();}
   const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
   const cx=canvas.getContext('2d');
   if(cx){
    cx.clearRect(0,0,128,128);
    const grad=cx.createRadialGradient(64,64,0,64,64,64);
    grad.addColorStop(0,'rgba(255,242,217,.44)');
    grad.addColorStop(.24,'rgba(255,173,104,.23)');
    grad.addColorStop(.55,'rgba(255,84,124,.07)');
    grad.addColorStop(1,'rgba(255,70,110,0)');
    cx.fillStyle=grad;cx.fillRect(0,0,128,128);
    const texture=new THREE.CanvasTexture(canvas);
    const mat=new THREE.SpriteMaterial({map:texture,transparent:true,
     color:0xffffff,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,
     opacity:.4,fog:false});
    const sprite=new THREE.Sprite(mat);
    sprite.frustumCulled=false;sprite.renderOrder=47;
    rs.add(sprite);h.sprite=sprite;h.texture=texture;h.scene=rs;
   }
  }
  if(h.sprite){
   h.sprite.position.set(visualPs,s.spriteVisualDepth-18,finalFootZ+104);
   h.sprite.scale.set(214,195,1);
   h.sprite.material.opacity=(.27+.14*s.bright)*(.97+.03*Math.sin(s.elapsed*2.4));
   h.sprite.visible=!s.dead&&!s.won;
  }
 }catch(error){
  const h=runtimeScene.__spalakhRadial39;
  if(h&&!h.warned){h.warned=true;console.warn('[Spalakh radial39] skipped:',error&&error.message);}
 }
}

const pools=runtimeScene.getObjects('ObsSafeGlow'),lamps=runtimeScene.getObjects('ObsPoolLight'),spots=coneSpots();
for(let i=0;i<pools.length;i++){
 // The old 360x255 native glow boxes were depth-writing transparent rectangles.
 // Safe light zones are still computed by coneSpots(), while contact pools use radial shader discs.
 pools[i].hide(true);
}
for(let i=0;i<lamps.length;i++){const o=lamps[i],spot=spots[i];o.hide(!spot);if(spot){o.setX(worldX(spot.x));o.setY(-55);if(typeof o.setZ==='function')o.setZ(worldZ(spot.y)+35);}}
show('ObsBridge',bridge());show('ObsIris',!irisOpen());show('ObsIrisLine',!irisOpen());
show('ObsBridgeRim',bridge());
// v0.9.42: when the bridge is materialised, tint it bright cyan and make it softly glow.
{
 const bg42=runtimeScene.__spalakhBridgeGlow42||(runtimeScene.__spalakhBridgeGlow42={done:{},warned:false});
 if(typeof THREE!=='undefined'){
  try{
   const apply=(name,isRim)=>{
    const objs=runtimeScene.getObjects(name);
    for(let i=0;i<objs.length;i++){
     const o=objs[i],root=o.get3DRendererObject&&o.get3DRendererObject();
     if(!root||!root.traverse)continue;
     const key=name+':'+i;
     if(!bg42.done[key]||bg42.done[key].uuid!==root.uuid){
      const mats=[];
      root.traverse(node=>{
       if(!node.isMesh)return;
       const list=Array.isArray(node.material)?node.material:[node.material];
       const out=list.map(m=>{
        if(!m)return m;
        const c=m.clone();
        c.transparent=!!m.transparent; c.opacity=m.opacity===undefined?1:m.opacity;
        if(c.color)c.color.set(isRim?0x9cf8ff:0x48d8ff);
        if(c.emissive)c.emissive.set(isRim?0xcafcff:0x58e8ff);
        if(c.roughness!==undefined)c.roughness=.18;
        if(c.metalness!==undefined)c.metalness=.03;
        c.needsUpdate=true; mats.push(c);
        return c;
       });
       node.material=Array.isArray(node.material)?out:out[0];
      });
      bg42.done[key]={uuid:root.uuid,mats,isRim};
     }
     const pulse=.92+.08*Math.sin(s.elapsed*2.2+i*.9);
     const entry=bg42.done[key];
     if(entry&&entry.mats)for(const m of entry.mats){
      if(m.color)m.color.set(entry.isRim?0x9cf8ff:0x48d8ff);
      if(m.emissive){m.emissive.set(entry.isRim?0xcafcff:0x58e8ff);m.emissiveIntensity=(entry.isRim?1.35:1.0)*pulse;}
     }
    }
   };
   if(bridge()){apply('ObsBridge',false);apply('ObsBridgeRim',true);}
  }catch(err){if(!bg42.warned){bg42.warned=true;console.warn('[Spalakh bridge42] glow skipped:',err&&err.message);}}
 }
}
show('ObsGateFrame',!irisOpen());show('ObsGateCore',!irisOpen());
const gateLamp=first('ObsPinkGateLight');if(gateLamp)gateLamp.hide(irisOpen());
// Neon front badges face the camera even when GLB materials are one-sided in Preview.
// ===== v0.9.36: SPOTLIGHT BEAMS — start exactly in the lens, narrow→wide, feathered at both ends, soft contact pool =====
// Visual only: panelTargets / s.modes / travellingRay() / projectorImpact() / safe zones are untouched.
// Root cause of the gap at the lens: the source was model.getX()+getWidth()*.5, model.getZ()+getDepth()*.48. The lens is a disc
// that sits at ~(.50,.80,.51) of the GLB's own box (see "lens" material), and with originLocation "ModelOrigin" the box does not
// start at the object's X/Z, so the guessed point was ~45 units sideways and ~35 units below the real lens.
// The lens centre is now MEASURED from the lens mesh (material "lens") of every spotlight, with a computed fallback.
const beamPlanes=runtimeScene.getObjects('ObsLightCone');
for(const b of beamPlanes)b.hide(true); // no fabricated beam gradients
const panelTargets=[
 s.modes[0]===0?{x:310,y:588}:s.modes[0]===1?{x:573,y:583}:{x:830,y:583},
 s.modes[1]===0?{x:778,y:478}:s.modes[1]===1?{x:travellingRay(),y:583}:{x:913,y:583},
 s.modes[2]===0?{x:1060,y:382}:s.modes[2]===1?{x:1045+78*Math.sin(s.elapsed*.68),y:552}:{x:1151,y:583}
];
// v0.9.24: every cyan beam intersects actual physics surfaces, then illuminates them.
function projectorImpact(sx,sz,tx,tz){
 // First prefer the physics deck DIRECTLY under the intended light target.
 // This keeps the visibly illuminated pool aligned with the stealth/light puzzle.
 const floors=FLOOR.concat(bridge()?LIGHT_BRIDGE:[]);
 let goal=null;
 for(const floor of floors){
  const x1=worldX(floor.x),x2=worldX(floor.x+floor.w),z=worldZ(floor.y);
  if(tx<x1+4||tx>x2-4)continue;
  const delta=Math.abs(z-tz);
  if(!goal||delta<goal.delta)goal={x:tx,z,t:1,floor,delta};
 }
 if(goal)return goal;
 // When the target is over a gap, intercept the first ledge reached by the beam.
 const dx=tx-sx,dz=tz-sz;if(Math.abs(dz)<.00001)return null;
 let best=null;
 for(const floor of floors){
  const z=worldZ(floor.y),t=(z-sz)/dz;
  if(t<.15||t>1.4)continue;
  const x=sx+dx*t,x1=worldX(floor.x),x2=worldX(floor.x+floor.w);
  if(x<x1+6||x>x2-6)continue;
  if(!best||t<best.t)best={x,z,t,floor};
 }
 return best;
}
const impactDecals=runtimeScene.getObjects('ObsSpotlightFootprint');
const impactLights=runtimeScene.getObjects('ObsSpotlightImpactLight');
const spotlightModels=[runtimeScene.getObjects('ObsSpotlight')[0],runtimeScene.getObjects('ObsSpotlightVintage')[0],runtimeScene.getObjects('ObsSpotlight')[1]];
// v0.9.41: physically twice the intensity of v0.9.40; visible feathered shafts
// are narrow additive scattering, not opaque gradient polygons or depth-writing mask cards.
const BEAM_K=[.80,.55,.90],BEAM_BASE=.38,BEAM_TINT=[185/255,239/255,251/255];
const bm=runtimeScene.__spalakhBeam36||(runtimeScene.__spalakhBeam36={scene:null,meshes:null,spots:null,pools:null,failed:false,lens:{},warned:false});
// ---- lens centre of a spotlight in world coordinates ----
function lensOf(model,idx){
 const c=bm.lens[idx]||(bm.lens[idx]={off:null,src:'none',tries:0});
 if(c.src!=='measured'&&c.tries<120&&typeof THREE!=='undefined'){
  c.tries++;
  try{
   const root=model.get3DRendererObject&&model.get3DRendererObject();
   if(root&&root.traverse){
    if(root.updateMatrixWorld)root.updateMatrixWorld(true);
    let lensMesh=null;
    root.traverse(n=>{
     if(lensMesh||!n.isMesh)return;
     const ms=Array.isArray(n.material)?n.material:[n.material];
     if(/lens/i.test(n.name||'')||ms.some(m=>m&&/lens/i.test(m.name||'')))lensMesh=n;
    });
    if(lensMesh){
     const box=new THREE.Box3().setFromObject(lensMesh);
     const ctr=box.getCenter(new THREE.Vector3());
     const ox=ctr.x-model.getX(),oy=ctr.y-model.getY(),oz=ctr.z-model.getZ();
     // sanity: the lens must lie inside (a generous margin of) the spotlight's own box
     if(isFinite(ox+oy+oz)&&ox>-model.getWidth()&&ox<model.getWidth()*2&&oz>-model.getDepth()&&oz<model.getDepth()*2){
      c.off={x:ox,y:box.max.y-model.getY(),z:oz};c.src='measured';
     }
    }
   }
  }catch(e){}
 }
 if(!c.off){
  // fallback from the GLB layout: box x[.182,.818] y[.230,.828] z[.262,.980], lens centre (.5,.796,.51), origin = model origin
  c.off={x:model.getWidth()*.50,y:model.getHeight()*.80,z:model.getDepth()*.51};c.src='computed';
 }
 return {x:model.getX()+c.off.x,y:model.getY()+c.off.y,z:model.getZ()+c.off.z};
}
// ---- one reusable feathered mesh per beam (no per-frame allocation) ----
let beamsCustom=false;
if(typeof THREE!=='undefined'&&!bm.failed){
 try{
  const sc=runtimeScene.getLayer('').getRenderer().getThreeScene();
  if(sc){
   if(!bm.meshes||bm.scene!==sc){
    if(bm.scene&&bm.meshes)for(const m of bm.meshes){bm.scene.remove(m);m.geometry.dispose();m.material.dispose();}
    if(bm.scene&&bm.spots)for(const l of bm.spots){bm.scene.remove(l);bm.scene.remove(l.target);}
     if(bm.scene&&bm.pools)for(const d of bm.pools){bm.scene.remove(d);d.geometry.dispose();d.material.dispose();}
     bm.scene=sc;bm.meshes=[];bm.spots=[];bm.pools=[];
    const vert=String.raw`varying vec2 vUvBeam;
void main(){
 vUvBeam=uv;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}`;
    const frag=String.raw`varying vec2 vUvBeam;
uniform float uOpacity;
uniform float uTail;
uniform vec3 uTint;
uniform float uTime;
void main(){
 float t=clamp(vUvBeam.x,0.0,1.0);
 float across=abs(vUvBeam.y*2.0-1.0);
 float core=pow(max(0.0,1.0-smoothstep(0.00,0.30,across)),1.45);
 float halo=0.22*pow(max(0.0,1.0-smoothstep(0.03,1.0,across)),2.25);
 float head=.65+.35*smoothstep(0.0,0.065,t);
 float tail=1.0-smoothstep(uTail,1.0,t);
 float shaft=.975+.025*sin(vUvBeam.y*13.0+uTime*.28+t*2.1);
 float a=uOpacity*(core+halo)*head*tail*shaft;
 if(a<0.004)discard;
 gl_FragColor=vec4(uTint*a,a);                               // premultiplied
}`;
    for(let i=0;i<3;i++){
     const geo=new THREE.BufferGeometry();
     geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6*3),3));
     geo.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([0,0,0,.5,0,1,1,0,1,.5,1,1]),2));
     geo.setIndex([0,1,3,1,4,3,1,2,4,2,5,4]);
     const mat=new THREE.ShaderMaterial({
      uniforms:{uOpacity:{value:BEAM_BASE*BEAM_K[i]},uTail:{value:.8},uTint:{value:new THREE.Vector3(BEAM_TINT[0],BEAM_TINT[1],BEAM_TINT[2])},uTime:{value:0}},
      vertexShader:vert,fragmentShader:frag,
      side:THREE.DoubleSide,transparent:true,premultipliedAlpha:true,
      blending:THREE.AdditiveBlending,depthWrite:false,depthTest:true,fog:false
     });
     const mesh=new THREE.Mesh(geo,mat);
     mesh.frustumCulled=false;mesh.renderOrder=6;mesh.visible=false; // below character, no opacity or depth mask
     sc.add(mesh);bm.meshes.push(mesh);
      const spot=new THREE.SpotLight(0xb2f2ff,11.0*BEAM_K[i],1400,.28,.94,1.2);
      spot.castShadow=false;sc.add(spot);sc.add(spot.target);bm.spots.push(spot);
      const radial=new THREE.ShaderMaterial({
       uniforms:{uOpacity:{value:Math.min(.98,1.12*BEAM_K[i])},uTint:{value:new THREE.Vector3(.55,.87,1)}},
       vertexShader:String.raw`varying vec2 vUvCircle;
void main(){vUvCircle=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
       fragmentShader:String.raw`varying vec2 vUvCircle;uniform float uOpacity;uniform vec3 uTint;
void main(){vec2 d=(vUvCircle-.5)*2.0;float r=dot(d,d);
float a=uOpacity*(.65*(1.0-smoothstep(.18,1.0,r))+.35*exp(-4.0*r));
if(a<.004)discard;gl_FragColor=vec4(uTint,a);}`,
       transparent:true,depthTest:true,depthWrite:false,side:THREE.DoubleSide
      });
      const pool=new THREE.Mesh(new THREE.PlaneGeometry(1,1),radial);
      pool.frustumCulled=false;pool.visible=false;pool.renderOrder=18;
      sc.add(pool);bm.pools.push(pool);
    }
   }
   beamsCustom=true;
  }
 }catch(err){bm.failed=true;if(!bm.warned){bm.warned=true;console.warn('[Spalakh beam36] native beam planes used:',err&&err.message);}}
}
for(let i=0;i<3;i++){
 const plane=beamPlanes[i],model=spotlightModels[i],target=panelTargets[i];
 const decal=impactDecals[i],impactLight=impactLights[i],mesh=beamsCustom?bm.meshes[i]:null;
  const realSpot=beamsCustom?bm.spots[i]:null,circle=beamsCustom?bm.pools[i]:null;
 if(!plane||!model||!target){
  if(plane)plane.hide(true);if(decal)decal.hide(true);if(impactLight)impactLight.hide(true);if(mesh)mesh.visible=false;
   if(realSpot)realSpot.visible=false;if(circle)circle.visible=false;
  continue;
 }
 const lens=lensOf(model,i);
 const srcX=lens.x,srcZ=lens.z;
 const aimX=worldX(target.x),aimZ=worldZ(target.y);
 const impact=projectorImpact(srcX,srcZ,aimX,aimZ);
 const bridgeActive=i===0&&bridge();
 const bridgeX1=worldX(LIGHT_BRIDGE[0].x),bridgeX2=worldX(LIGHT_BRIDGE[LIGHT_BRIDGE.length-1].x+LIGHT_BRIDGE[LIGHT_BRIDGE.length-1].w);
 const bridgeCX=(bridgeX1+bridgeX2)*.5,bridgeZ=worldZ(LIGHT_BRIDGE[0].y);
 const bridgeHit=bridgeActive?projectorImpact(srcX,srcZ,bridgeCX,bridgeZ):null;
 const bridgeSurfaceX=bridgeHit?bridgeHit.x:bridgeCX,bridgeSurfaceZ=bridgeHit?bridgeHit.z:bridgeZ;
 const endX=bridgeActive?bridgeSurfaceX:(impact?impact.x:aimX),endZ=bridgeActive?bridgeSurfaceZ:(impact?impact.z:aimZ);
 const dx=srcX-endX,dz=srcZ-endZ,beamLength=Math.max(90,Math.hypot(dx,dz));
 if(mesh){
  plane.hide(true);                       // the old flat plane is only a fallback now
  const ux=(endX-srcX)/beamLength,uz=(endZ-srcZ)/beamLength,nx=-uz,nz=ux;
  const w0=9,w1=bridgeActive?Math.max(235,(bridgeX2-bridgeX1)*.36):Math.max(60,Math.min(135,beamLength*.115+25));   // bridge reveal fans out much wider over the bridge
  const P=mesh.geometry.attributes.position.array;
  const ex=srcX+ux*beamLength,ez=srcZ+uz*beamLength;
  P[0]=srcX-nx*w0;P[1]=0;P[2]=srcZ-nz*w0;
  P[3]=srcX;P[4]=0;P[5]=srcZ;
  P[6]=srcX+nx*w0;P[7]=0;P[8]=srcZ+nz*w0;
  P[9]=ex-nx*w1;P[10]=0;P[11]=ez-nz*w1;
  P[12]=ex;P[13]=0;P[14]=ez;
  P[15]=ex+nx*w1;P[16]=0;P[17]=ez+nz*w1;
  mesh.geometry.attributes.position.needsUpdate=true;
  mesh.position.y=lens.y;       // emerges from the front of the lens
  mesh.material.uniforms.uTail.value=impact?.86:.35;            // over a gap the beam dissolves into the water
  mesh.material.uniforms.uOpacity.value=(bridgeActive?Math.min(.96,BEAM_BASE*BEAM_K[i]*1.35):BEAM_BASE*BEAM_K[i]);
  mesh.material.uniforms.uTime.value=s.elapsed;
  mesh.visible=bridgeActive||!!impact; // beam A stays visible over the bridge reveal; others only when they hit geometry
   // SpotLight, unlike the visible beam mesh, physically illuminates lit GLB materials.
   if(realSpot){
    realSpot.position.set(srcX,lens.y,srcZ);
    realSpot.target.position.set(endX,-18,endZ);
    realSpot.target.updateMatrixWorld(true);
    realSpot.angle=Math.atan2(Math.max(bridgeActive?(bridgeX2-bridgeX1)*.42:100,beamLength*.14),beamLength);
    realSpot.distance=Math.max(bridgeActive?beamLength*1.9:325,beamLength*1.5);
    realSpot.intensity=(bridgeActive?13.5:11.0)*BEAM_K[i];realSpot.visible=bridgeActive||!!impact;
   }
   if(circle){
    circle.visible=bridgeActive||!!impact;
    if(bridgeActive){
     const bridgeW=(bridgeX2-bridgeX1)*.94;
     circle.position.set(bridgeSurfaceX,-18,bridgeSurfaceZ+8.0);
     circle.scale.set(bridgeW,72,1);
     circle.material.uniforms.uOpacity.value=Math.min(.98,1.22*BEAM_K[i]);
    }else if(impact){
     const slope=Math.min(1.5,Math.abs(dx)/Math.max(1,Math.abs(dz)));
     const W=Math.min(worldX(impact.floor.w)*.7,180+100*slope);
     circle.position.set(impact.x,-18,impact.z+3.2);
     circle.scale.set(W,Math.min(176,Math.max(75,impact.floor.h*2.0)),1);
     circle.material.uniforms.uOpacity.value=Math.min(.98,1.12*BEAM_K[i]);
    }
   }
 }else{
  // fallback: native plane, same source, per-beam saturation applied through object opacity
  const angleY=Math.atan2(dx,dz)*180/Math.PI;
  const midX=(srcX+endX)*.5,midZ=(srcZ+endZ)*.5;
  plane.hide(true); // never show original flat beam if custom renderer falls back
  if(typeof plane.setRotationY==='function')plane.setRotationY(angleY);
  move(plane,midX-plane.getWidth()*.5,model.getY()+model.getHeight()+12,midZ-beamLength*.5);
  if(typeof plane.setDepth==='function')plane.setDepth(beamLength);
  if(typeof plane.setOpacity==='function')plane.setOpacity(Math.round(255*BEAM_K[i]));
 }
 if(decal){
  decal.hide(beamsCustom||(!impact&&!bridgeActive));
  if(bridgeActive){
   const bridgeW=(bridgeX2-bridgeX1)-18,Hh=72;
   if(typeof decal.setWidth==='function')decal.setWidth(bridgeW);
   if(typeof decal.setHeight==='function')decal.setHeight(Hh);
   move(decal,bridgeX1+9,-Hh*.5,bridgeSurfaceZ+7);
   if(typeof decal.setOpacity==='function')decal.setOpacity(Math.round(255*Math.min(1,1.55*BEAM_K[i])));
  }else if(impact){
   // elliptical soft pool: wider when the beam arrives at a shallow angle; lies flat on the deck (normal = +Z)
   const slope=Math.min(1.2,Math.abs(dx)/Math.max(1,Math.abs(dz)));
   const W=190+120*slope,Hh=150;
   if(typeof decal.setWidth==='function')decal.setWidth(W);
   if(typeof decal.setHeight==='function')decal.setHeight(Hh);
   const px1=worldX(impact.floor.x),px2=worldX(impact.floor.x+impact.floor.w);
   const offsetX=Math.max(px1,Math.min(px2-W,impact.x-W*.5));
   move(decal,offsetX,-Hh*.5,impact.z+2);
   if(typeof decal.setOpacity==='function')decal.setOpacity(Math.round(255*Math.min(1,1.7*BEAM_K[i])));
  }
 }
 if(impactLight){
  impactLight.hide(bridgeActive||!impact);
  if(!bridgeActive&&impact)move(impactLight,impact.x,-35,impact.z+35);
 }
}

for(const [i,o] of runtimeScene.getObjects('ObsDial').entries())o.setColor(s.modes[i]===1?'111;244;226':s.modes[i]===2?'172;228;169':'169;132;200');
// v0.9.37 — matte BLACK spiders, with EIGHT independently articulated legs.
 // The model is derived from the user-supplied Block_Spider_Neon GLB:
 // its 32 individual leg pieces are rigged into 8 named pivot groups.
 // No red eyes, red point lights, or emissive eye materials.
 // Original spider patrol trajectory, detection range and stealth rules are unchanged.
 const visibleSpiders=runtimeScene.getObjects('ObsSpider3D');
 // Defense-in-depth: old red-eye objects are kept as definitions for file compatibility,
 // but their scene instances were deleted from v0.9.37.
 for(const old of runtimeScene.getObjects('ObsSpiderRedEye'))old.hide(true);
 for(const old of runtimeScene.getObjects('ObsSpiderRedLight'))old.hide(true);
 const rigState=runtimeScene.__spalakhSpiderRig37||(runtimeScene.__spalakhSpiderRig37={
  cached:{},warned:{}
 });
 for(let spiderIndex=0;spiderIndex<visibleSpiders.length;spiderIndex++){
  const spider=visibleSpiders[spiderIndex],anchor=SPIDERS[spiderIndex];
  if(!spider||!anchor)continue;
  // Preserve v0.9.36 patrol positioning; this block is purely a leg animation.
  const patrolWave=Math.sin(s.elapsed*.75+anchor.x*.011);
  spider.setX(worldX(anchor.x)-61+patrolWave*38);
  const root=spider.get3DRendererObject&&spider.get3DRendererObject();
  if(!root||!root.traverse)continue;
  const id=spider.persistentUuid||('spider_'+spiderIndex);
  let entry=rigState.cached[id];
  if(!entry||entry.uuid!==root.uuid){
   const joints=[];
   root.traverse(node=>{
    const match=/^(L|R)_Leg_([0-3])_Pivot$/.exec(node.name||'');
    if(!match)return;
    const limb=Number(match[2]),side=match[1]==='L'?-1:1;
    joints.push({
     node,limb,side,sideName:match[1],
     homeY:node.position.y,homeRotX:node.rotation.x,
     homeRotY:node.rotation.y,homeRotZ:node.rotation.z
    });
   });
   joints.sort((a,b)=>(a.side-b.side)||(a.limb-b.limb));
   entry={uuid:root.uuid,joints,grounded:false};
   rigState.cached[id]=entry;
   if(joints.length!==8&&!rigState.warned[id]){
    rigState.warned[id]=true;
    console.warn('[Spalakh spider v0.9.37] Expected eight articulated GLB leg groups; got',joints.length);
   }
  }
  if(!entry.grounded&&entry.joints.length===8&&typeof THREE!=='undefined'){
    try{
     root.updateMatrixWorld(true);
     const bounds=new THREE.Box3().setFromObject(root);
     if(!bounds.isEmpty()&&Number.isFinite(bounds.min.z)){
      const delta=worldZ(635)+5-bounds.min.z;
      if(Number.isFinite(delta)&&Math.abs(delta)<185){
       spider.setZ(spider.getZ()+delta);
       entry.grounded=true;
      }
     }
    }catch(err){
     if(!rigState.warned['ground_'+spiderIndex]){
      rigState.warned['ground_'+spiderIndex]=true;
      console.warn('[Spider v0.9.38] foot anchor unavailable',err&&err.message);
     }
    }
   }
   const travel=Math.abs(Math.cos(s.elapsed*.75+anchor.x*.011)); // patrol speed factor
  const baseHz=.60+spiderIndex*.045+travel*.14;
  // Individual body/leg phases: no two spiders (or any two legs) run on the same beat.
  const spiderPhase=spiderIndex*1.71+(anchor.x%77)*.017;
  for(let k=0;k<entry.joints.length;k++){
   const joint=entry.joints[k];
   const side=joint.side,limb=joint.limb;
   // Slight speed asymmetry for every limb prevents mechanical mirror motion.
   const tempo=baseHz*(.89+.055*limb+.035*(side>0?1:0));
   const phase=s.elapsed*tempo*6.2831853+
     spiderPhase+limb*1.71+(side>0?2.34:0)+Math.sin(s.elapsed*.21+k*.9)*.06;
   const stride=Math.sin(phase);
   const lift=Math.pow(Math.max(0,Math.sin(phase+.42)),1.8);
   const subtle=Math.sin(phase*.47+limb*.65);
   joint.node.rotation.y=joint.homeRotY+side*(.045+.05*travel)*stride;
   joint.node.rotation.z=joint.homeRotZ+side*(.055*lift-.025*Math.max(0,-stride));
   joint.node.rotation.x=joint.homeRotX+.025*subtle;
   joint.node.position.y=joint.homeY+.025*lift;
   joint.node.updateMatrix();
  }
 }


const GFX_QUALITY=2;   // 0 = off, 1 = medium, 2 = high (also controls haze density)
const GFX_QUALITY_DEPTH=GFX_QUALITY;
// ===== v0.9.35: DARK GLB RUINS WITH RARE VIOLET SILHOUETTE =====
// Root cause of the pale grey-blue "wall" in v0.9.33: the ruin tints were passed to Color.setRGB() as numbers (0.105,0.215,0.345).
// three.js treats setRGB numbers as LINEAR values and the output is sRGB-encoded, so they were shown as roughly (92,128,161) —
// light grey-blue, about the brightness of the platforms — at opacity .63-.78. The black top of the frame came from a backdrop
// that never filled the view. Now every colour is an sRGB hex (what you write is what is shown), the ruins are much darker
// and the far plane is darkest. The haze is tiny so the ruins are not lightened by fog.
{
 const bg=runtimeScene.__spalakhDepth34||(runtimeScene.__spalakhDepth34={scene:null,gradient:null,tinted:{},mats:[],rims:[],warned:false,fogDone:false});
 if(typeof THREE!=='undefined'){
  try{
   const threeScene=runtimeScene.getLayer('').getRenderer().getThreeScene();
   if(threeScene){
    const hex=h=>new THREE.Color(h);          // sRGB hex -> correctly converted working colour
    if(bg.scene!==threeScene||!bg.gradient){
     if(bg.gradient&&bg.scene){bg.scene.remove(bg.gradient);bg.gradient.geometry.dispose();bg.gradient.material.dispose();}
     bg.scene=threeScene;bg.tinted={};bg.mats=[];bg.rims=[];
     // deep navy gradient: bottom nearly black-blue, top deep blue (never flat black); extends far above the play area
     const stops=[
      {z:-2200,c:0x030a13},{z:-600,c:0x07121e},{z:500,c:0x0b1c30},{z:1700,c:0x10243c},{z:5200,c:0x143450}
     ];
     const left=-5200,right=8200,positions=[],colors=[],indices=[];
     for(let i=0;i<stops.length;i++){
      const col=hex(stops[i].c);
      for(const x of [left,right]){positions.push(x,-1715,stops[i].z);colors.push(col.r,col.g,col.b);}
      if(i<stops.length-1){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
     }
     const geo=new THREE.BufferGeometry();
     geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
     geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
     geo.setIndex(indices);
     const mat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,depthWrite:true,transparent:false,fog:false,toneMapped:false});
     bg.gradient=new THREE.Mesh(geo,mat);
     bg.gradient.frustumCulled=false;bg.gradient.renderOrder=-400;
     threeScene.add(bg.gradient);
     // belt and braces: never a black void even if the gradient plane is outside the frustum
     try{threeScene.background=hex(0x07121f);}catch(e){}
    }
    const native=runtimeScene.getObjects('GradientBackdrop')[0];
    if(native)native.hide(true);
    // sRGB hex colours. Far = darkest & least saturated, near ruins still clearly darker than platforms (platform tops ~#3a3a8a).
    const palette=[
     {names:['BgFarArch33','BgFarColumn33'],hex:0x08121e,alpha:.94,tag:'far'},
     {names:['BgMidArch33','BgMidColumn33'],hex:0x0c1a2b,alpha:.92,tag:'mid'},
     {names:['ObsBackdropArch','ObsBackdropColumn'],hex:0x112338,alpha:.90,tag:'near'}
    ];
    for(const band of palette)for(const name of band.names){
     const objs=runtimeScene.getObjects(name);
     for(let i=0;i<objs.length;i++){
      const o=objs[i],root=o.get3DRendererObject&&o.get3DRendererObject();
      if(!root||!root.traverse)continue;
      const key=name+':'+i;
      if(bg.tinted[key]===root.uuid)continue;
      let touched=0;
      root.traverse(node=>{
       if(!node.isMesh||node.userData.spalakhRim35)return;
       const orig=Array.isArray(node.material)?node.material:[node.material];
       const tinted=orig.map(m=>{
        if(!m)return m;
        const mat=new THREE.MeshBasicMaterial({
         color:hex(band.hex),side:THREE.DoubleSide,transparent:true,opacity:band.alpha,
         depthWrite:false,depthTest:true,fog:true,toneMapped:false
        });
        mat.userData.base=hex(band.hex);mat.userData.tag=band.tag;
        bg.mats.push({mat,tag:band.tag,name,i,key:name+':'+i,x:o.getX?o.getX():0});
        touched++;
        return mat;
       });
       node.material=Array.isArray(node.material)?tinted:tinted[0];
       node.castShadow=false;node.receiveShadow=false;
       // Purple rim: inflated backface silhouette on far/mid GLB meshes.
       if(band.tag!=='near'&&node.geometry&&!node.userData.hasRim35){
        const rm=new THREE.MeshBasicMaterial({color:0x704095,side:THREE.BackSide,
         transparent:true,opacity:0,depthWrite:false,depthTest:true,fog:true,toneMapped:false});
        const rim=new THREE.Mesh(node.geometry,rm);
        rim.scale.setScalar(1.027);rim.frustumCulled=false;
        rim.userData.spalakhRim35=true;node.userData.hasRim35=true;
        node.add(rim);bg.rims.push({key,mat:rm});
       }
      });
      if(touched)bg.tinted[key]=root.uuid;
     }
    }
    // very light haze: separates planes without lifting dark ruins (fog colour is as dark as the far ruins)
    if(!bg.fogDone||!threeScene.fog){
     bg.fogDone=true;
     const dens=GFX_QUALITY_DEPTH>1?0.000042:0.000038;
     if(threeScene.fog&&threeScene.fog.isFogExp2){threeScene.fog.color.set(0x08121e);threeScene.fog.density=dens;}
     else threeScene.fog=new THREE.FogExp2(0x08121e,dens);
    }
    // rare violet pulses: only far/mid arches, at most two zones glow at the same time, 7-9 s cycle, soft ease in/out
    if(bg.mats.length){
     const violet=hex(0x4a2f8f),t=s.elapsed;
     const keys=[];for(const e of bg.mats)if(e.tag!=='near'&&/Arch/.test(e.name)&&keys.indexOf(e.key)<0)keys.push(e.key);
     for(const e of bg.mats){e.mat.color.copy(e.mat.userData.base);}
      for(const rim of bg.rims)rim.mat.opacity=0;
     const slotLen=8.0,slot=Math.floor(t/slotLen),ph=(t/slotLen)-slot;
     const env=Math.pow(Math.sin(Math.PI*ph),2);       // 0 -> 1 -> 0 over one slot
     if(keys.length){
      const pick=k=>keys[Math.floor(Math.abs(Math.sin((slot*2+k)*91.7+k*13.1))*keys.length)%keys.length];
      for(let k=0;k<2;k++){
       const key=pick(k),amt=(k===0?.12:.07)*env;
       for(const e of bg.mats)if(e.key===key)e.mat.color.lerp(violet,amt);
        for(const rim of bg.rims)if(rim.key===key)rim.mat.opacity=Math.max(rim.mat.opacity,(k===0?.20:.12)*env);
      }
     }
    }
   }
  }catch(err){
   if(!bg.warned){bg.warned=true;console.warn('[Spalakh depth34] native 3D fallback',err&&err.message);}
  }
 }
 // Old decorative mist stays almost invisible; never reduce puzzle light.
 for(const fogPlane of runtimeScene.getObjects('ObsDepthMist')){
  if(typeof fogPlane.setOpacity==='function')fogPlane.setOpacity(7);
 }
}
// ===== v0.9.36: DARK DISTANT HOUSES (ObsDome) — calm bodies, muted warm windows =====
// The GLB has separate materials: stone / stoneMid / dome / edge / purple (bodies), cyan (finial) and warm / window (lit windows).
// Only this instance's own scene copy is touched (new materials per instance, nothing shared with platforms or spotlights).
// Colours are sRGB hex through THREE.Color(hex) — no linear-RGB mistake — and unlit like the other background ruins.
{
 const dm=runtimeScene.__spalakhDome36||(runtimeScene.__spalakhDome36={done:{},warned:false});
 if(typeof THREE!=='undefined'){
  try{
   const BODY={stone:0x0a1626,stoneMid:0x0d1b2d,dome:0x0c1a2b,edge:0x132438,purple:0x15193a};
   const LIT={window:0x6c4c2c,warm:0x7a5733,cyan:0x1b5560};   // muted warm windows (amber, not yellow / pink-white), dim finial
   const objs=runtimeScene.getObjects('ObsDome');
   for(let i=0;i<objs.length;i++){
    const o=objs[i],root=o.get3DRendererObject&&o.get3DRendererObject();
    if(!root||!root.traverse)continue;
    const key='dome:'+i;
    if(dm.done[key]===root.uuid)continue;
    let touched=0;
    root.traverse(node=>{
     if(!node.isMesh)return;
     const list=Array.isArray(node.material)?node.material:[node.material];
     const out=list.map(m=>{
      if(!m)return m;
      const nm=m.name||'';
      const hexv=LIT[nm]!==undefined?LIT[nm]:(BODY[nm]!==undefined?BODY[nm]:0x0c1a2b);
      const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(hexv),side:m.side,fog:true,toneMapped:false});
      mat.name=nm;touched++;
      return mat;
     });
     node.material=Array.isArray(node.material)?out:out[0];
     node.castShadow=false;node.receiveShadow=false;
    });
    if(touched)dm.done[key]=root.uuid;
   }
  }catch(err){if(!dm.warned){dm.warned=true;console.warn('[Spalakh dome36] dome tint skipped:',err&&err.message);}}
 }
}
// ===== v0.9.25 GRAPHICS PASS 1 — atmosphere only (reads s.elapsed; writes nothing to gameplay state) =====
// GFX_QUALITY: 0 = off (v0.9.24 look), 1 = medium, 2 = high.
// Every call below is guarded: if an API is missing in this GDevelop build the effect is skipped, never the game.
{
 const g=runtimeScene.__spalakhGfx||(runtimeScene.__spalakhGfx={init:false,warn:{},rnd:null});
 const t=s.elapsed,fr=v=>v-Math.floor(v);
 const hash=(i,k)=>fr(Math.sin(i*127.1+k*311.7)*43758.5453);
 const setOp=(o,k)=>{if(typeof o.setOpacity==='function')o.setOpacity(Math.max(0,Math.min(255,255*k)));};
 const canOp=o=>typeof o.setOpacity==='function';
 if(!g.init){
  g.init=true;
  if(GFX_QUALITY>0){
   // 1) no black void: deep blue-teal clear colour behind everything
   try{gdjs.evtTools.runtimeScene.setBackgroundColor(runtimeScene,'7;18;31');}
   catch(e){try{runtimeScene.setBackgroundColor(7,18,31);}catch(e2){console.warn('[gfx] background colour unavailable');}}
   // 2) scene fog is handled by the v0.9.34 depth block (dark, very light haze)
  }
 }
 // 3) drifting particles in the water (behind the play plane, y < -130)
 const motes=runtimeScene.getObjects('ObsMote');
 const nMotes=GFX_QUALITY>1?motes.length:GFX_QUALITY>0?Math.floor(motes.length/2):0;
 for(let i=0;i<motes.length;i++){
  const o=motes[i];
  if(i>=nMotes){o.hide(true);continue;}
  o.hide(false);
  const bx=-100+hash(i,1)*2800,by=-420+hash(i,2)*280,bz=hash(i,3)*980,vz=5+hash(i,4)*12,ph=hash(i,5)*6.283,sp=.12+hash(i,6)*.3;
  const H=1000,zz=((bz+t*vz)%H+H)%H,edge=Math.min(1,zz/120,(H-zz)/120);
  move(o,bx+Math.sin(t*sp+ph)*38-7,by,zz-10);
  setOp(o,edge*(.22+.38*(.5+.5*Math.sin(t*1.7+ph*3))));
 }
 // 4) faint shafts of light from the upper ruins (hidden if this build has no opacity control, so they can never
 //    be mistaken for the puzzle beams)
 const rays=runtimeScene.getObjects('ObsGodRay');
 for(let i=0;i<rays.length;i++){
  const o=rays[i];
  if(GFX_QUALITY<1||!canOp(o)){o.hide(true);continue;}
  o.hide(false);
  setOp(o,.17+.09*Math.sin(t*.33+i*1.9));
 }
 // 5) coral halos / spill: see v0.9.34 coral block below
}
// ===== v0.9.35: BIOLUMINESCENT CORALS / MORE LOCAL BOUNCE (model emissive + soft halo + real point lights + spill on platforms) =====
// Purely decorative; reads s.elapsed only. Each coral has its own slow, unsynchronised breathing (7-11 s), no strobing.
{
 const NEON={cyan:0x38d8ff,pink:0xff4fb8,violet:0xa86bff,yellow:0xffc85a,white:0xe8f3ff};
 // colour per coral instance (x of the model origin) — five colours spread over the whole room, one colour per coral
 const PLAN={230:'cyan',360:'pink',705:'yellow',910:'white',1460:'cyan',1730:'violet',1780:'yellow',2350:'pink',2380:'violet'};
 const cg=runtimeScene.__spalakhCoral34||(runtimeScene.__spalakhCoral34={done:{},warned:false,lights:null});
 const t=s.elapsed;
 const breathe=(x,k)=>.5+.5*Math.sin(t*(.55+.11*((x/37)%5))+x*1.713+k);   // 0..1, ~7-11 s period, per coral phase
 const setOpacity=(o,v)=>{if(typeof o.setOpacity==='function')o.setOpacity(Math.max(0,Math.min(255,255*v)));};
 // ---- 1) the 3D models themselves glow ----
 if(typeof THREE!=='undefined'){
  try{
   const names=['GLBAnemoneNeon','GLBCoralPinkBlock','GLBCoralVioletBlock','GLBCoralPinkAlt'];
   for(const name of names){
    const objs=runtimeScene.getObjects(name);
    for(let i=0;i<objs.length;i++){
     const o=objs[i],root=o.get3DRendererObject&&o.get3DRendererObject();
     if(!root||!root.traverse)continue;
     const x=Math.round(o.getX()),colName=PLAN[x]||'cyan',key=name+':'+x;
     if(!cg.done[key]||cg.done[key].uuid!==root.uuid){
      const col=new THREE.Color(NEON[colName]);
      const dark=col.clone().multiplyScalar(.30),light=col.clone().lerp(new THREE.Color(0xffffff),.42);
      const mats=[];
      root.traverse(node=>{
       if(!node.isMesh||!node.geometry)return;
       const list=Array.isArray(node.material)?node.material:[node.material];
       const out=list.map(m=>{
        if(!m)return m;
        const c=m.clone();
        if(/rock/i.test(m.name||'')){c.emissive&&c.emissive.set(0x000000);return c;}   // stones only receive light
        if(c.emissive){c.emissive.copy(col);c.emissiveIntensity=.50;}
        mats.push(c);
        return c;
       });
       // own geometry copy so each coral can have its own colour; remap the baked gradient (dark base -> light tips)
       const geo=node.geometry.clone(),a=geo.attributes.color;
       if(a&&list.some(m=>m&&!/rock/i.test(m.name||''))){
        geo.computeBoundingBox();const y0=geo.boundingBox.min.y,y1=geo.boundingBox.max.y,pos=geo.attributes.position;
        const tmp=new THREE.Color();
        for(let v=0;v<a.count;v++){
         const tt=Math.max(0,Math.min(1,(pos.getY(v)-y0)/Math.max(1e-6,y1-y0)));
         tmp.copy(dark).lerp(light,.12+.88*tt);
         a.setXYZ(v,tmp.r,tmp.g,tmp.b);
        }
        a.needsUpdate=true;
       }
       node.geometry=geo;
       node.material=Array.isArray(node.material)?out:out[0];
       node.castShadow=false;
      });
      cg.done[key]={uuid:root.uuid,mats,x};
     }
     const e=cg.done[key];
     if(e&&e.mats){const b=breathe(e.x,0);for(const m of e.mats)m.emissiveIntensity=.40+.26*b;}
    }
   }
  }catch(err){if(!cg.warned){cg.warned=true;console.warn('[Spalakh coral34] model glow skipped:',err&&err.message);}}
 }
 // ---- 2) real point lights next to each coral (reuse, never created at runtime) + breathing ----
 const colOf=n=>n.replace(/^(NeonCoralLight|ObsCoralGlow|ObsCoralSpill)/,'').toLowerCase();
 for(const kind of ['NeonCoralLight']){
  for(const c of ['Cyan','Pink','Violet','Yellow','White']){
   const objs=runtimeScene.getObjects(kind+c);
   for(let i=0;i<objs.length;i++){
    const o=objs[i];
    let L=null;
    try{
     const r=o.get3DRendererObject&&o.get3DRendererObject();
     if(r){if(r.isPointLight)L=r;else if(r.traverse)r.traverse(n=>{if(!L&&n.isPointLight)L=n;});}
     if(!L&&o._renderer&&o._renderer._light)L=o._renderer._light;
    }catch(e){}
    if(!L)continue;
    if(L.userData.base34===undefined)L.userData.base34=L.intensity;
    L.intensity=Math.min(.42,(L.userData.base34*(.88+.20*breathe(Math.round(o.getX())-48,1.3)))/9);
     L.distance=175;L.decay=1.35;
   }
  }
 }
 // ---- 3) halo planes behind the corals + soft spill on the platform top ----
 for(const c of ['Cyan','Pink','Violet','Yellow','White']){
  const gl=runtimeScene.getObjects('ObsCoralGlow'+c);
  for(let i=0;i<gl.length;i++){const o=gl[i];o.hide(false);setOpacity(o,(.37+.17*breathe(Math.round(o.getX())+115,.7))/9);}
  const sp=runtimeScene.getObjects('ObsCoralSpill'+c);
  for(let i=0;i<sp.length;i++){const o=sp[i];o.hide(false);setOpacity(o,(.31+.19*breathe(Math.round(o.getX())+0,2.1))/9);}
 }
}
// ===== v0.9.36: draw order of the hero sprites =====
// Root cause of the square cut-out around Spalakh: the hero is a transparent 300x196 sprite plane that WRITES depth over its whole
// rectangle (transparent padding included). The flame ribbon sits a few units behind that plane and was drawn AFTER it (renderOrder 30+),
// so every flame pixel inside the rectangle failed the depth test -> a clean rectangle that "eats" the tail.
// Now the flame is drawn first (renderOrder 40-43) and the hero sprites / aura last (48-50): the hero is composited over the flame,
// nothing is clipped, and opaque platforms in front still hide the flame normally (no global depthTest:false).
{
 const so=runtimeScene.__spalakhSpriteOrder36||(runtimeScene.__spalakhSpriteOrder36={names:null});
 if(!so.names){
  const fam={Idle:16,Run:7,Jump:3,Fall:3,Land:4,Slow:8,Crouch:5};
  so.names=[];for(const k in fam)for(let i=0;i<fam[k];i++)so.names.push('Spalakh'+k+i);
 }
 const setOrder=(name,ord)=>{
  for(const o of runtimeScene.getObjects(name)){
   const r=o.get3DRendererObject&&o.get3DRendererObject();
   if(r&&r.renderOrder!==ord)r.renderOrder=ord;
  }
 };
 for(const n of so.names)setOrder(n,51);
 setOrder('SpalakhAura',49);
}
// ===== v0.9.35: SHORT ATTACHED MAGIC FLAME WITHOUT LARGE WHITE SHEET =====
// Root cause of the v0.9.33 white blob: two AdditiveBlending ribbons (alpha .78/.92, colours up to 1,1,.77) were stacked on
// a wide strip that folds over itself during jumps/turns, so overlaps accumulated to pure white. Now every band uses
// premultiplied NORMAL blending with a hard alpha cap, depth-writes inside the band (overlaps cannot accumulate) and the
// whole ribbon is clamped to a radius around the character. Only the sparse embers stay additive (low value).
// Fully visual: reads s.* only, never writes physics / hidden-in-light / puzzle state.
const sparkCubes=runtimeScene.getObjects('Spark');for(const o of sparkCubes)o.hide(true);
const tailOuter=runtimeScene.getObjects('SpalakhTrailRose');
const tailCore=runtimeScene.getObjects('SpalakhTrailGold');
const tailFlare=runtimeScene.getObjects('SpalakhTrailFlare');
const flamePoints=s.flameTrail||[];
const magic=runtimeScene.__spalakhMagic35||(runtimeScene.__spalakhMagic35={
 scene:null,strips:null,embers:null,tex:null,version:35,failed:false
});
let fireReady=false;
if(typeof THREE!=='undefined'&&!magic.failed){
 try{
  const sc=runtimeScene.getLayer('').getRenderer().getThreeScene();
  if(sc){
   const MAX=40,CROSS=7,NEMB=12;
   const FLAME_H=150;                       // visual body height in world units (sprite plane is 196 incl. padding)
   if(!magic.strips||magic.scene!==sc){
    const dropOld=()=>{
     if(magic.scene&&magic.strips)for(const old of magic.strips){magic.scene.remove(old);old.geometry.dispose();old.material.dispose();}
     if(magic.scene&&magic.embers){magic.scene.remove(magic.embers);magic.embers.geometry.dispose();magic.embers.material.dispose();}
     if(magic.tex){magic.tex.dispose();magic.tex=null;}
    };
    dropOld();
    magic.scene=sc;magic.strips=[];
    // width = fraction of body height, opacity hard-capped < 1, ramp shift moves the colour along cream→gold→orange→coral
    const bands=[
     {w:.72,op:.30,depth:12,shift:.30,core:0.0,order:40},   // soft coral/orange outer feather
     {w:.46,op:.42,depth:9,shift:.10,core:0.0,order:41},   // golden body
     {w:.19,op:.49,depth:6,shift:-.10,core:1.0,order:42}   // thin cream core, local to the back of the hero
    ];
    const vert=String.raw`varying vec2 vUvRibbon;
void main(){
 vUvRibbon=uv;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}`;
    const frag=String.raw`varying vec2 vUvRibbon;
uniform float uTime;
uniform float uOpacity;
uniform float uShift;
uniform float uCore;
uniform float uFade;
vec3 ramp(float t){
 vec3 cream=vec3(1.0,0.93,0.74);
 vec3 gold =vec3(1.0,0.74,0.27);
 vec3 amber=vec3(1.0,0.47,0.17);
 vec3 coral=vec3(0.93,0.27,0.37);
 t=clamp(t,0.0,1.0);
 vec3 c=mix(cream,gold,smoothstep(0.0,0.22,t));
 c=mix(c,amber,smoothstep(0.18,0.55,t));
 c=mix(c,coral,smoothstep(0.50,1.0,t));
 return c;
}
void main(){
 float t=clamp(vUvRibbon.x,0.0,1.0);
 float across=abs(vUvRibbon.y*2.0-1.0);
 // slow licking turbulence on the borders (more at the tail, none at the source)
 float lick=0.5*sin(t*19.0-uTime*5.2+vUvRibbon.y*2.4)+0.5*sin(t*33.0+uTime*3.3-vUvRibbon.y*3.1);
 float edge=across+0.14*lick*t;
 float feather=pow(max(0.0,1.0-smoothstep(0.18,0.98,edge)),1.45);
 float decay=pow(max(0.0,1.0-t),1.65);
 float head=smoothstep(0.0,0.05,t)*0.35+0.65;   // tiny soft start inside the body
 vec3 rgb=ramp(t*0.92+uShift);
 // locally brighter core, never pure white
 rgb=mix(rgb,vec3(1.0,0.96,0.84),uCore*(1.0-smoothstep(0.0,0.30,t))*0.55);
 rgb=min(rgb,vec3(1.0,0.95,0.84));
 float a=clamp(uOpacity*uFade*feather*decay*head,0.0,0.50);
 if(a<0.012)discard;          // transparent pixels must not write depth
 gl_FragColor=vec4(rgb,a);   // premultiplied alpha
}`;
    for(const band of bands){
     const geo=new THREE.BufferGeometry();
     const positions=new Float32Array(MAX*CROSS*3);
     const uv=new Float32Array(MAX*CROSS*2);
     const idx=[];
     for(let i=0;i<MAX-1;i++)for(let k=0;k<CROSS-1;k++){
      const a=i*CROSS+k,b=(i+1)*CROSS+k;
      idx.push(a,a+1,b,a+1,b+1,b);
     }
     geo.setIndex(idx);
     const posAttr=new THREE.BufferAttribute(positions,3);
     if(posAttr.setUsage)posAttr.setUsage(THREE.DynamicDrawUsage);
     geo.setAttribute('position',posAttr);
     geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
     const mat=new THREE.ShaderMaterial({
      uniforms:{uTime:{value:0},uOpacity:{value:band.op},uShift:{value:band.shift},uCore:{value:band.core},uFade:{value:1}},
      vertexShader:vert,fragmentShader:frag,
      side:THREE.DoubleSide,transparent:true,premultipliedAlpha:false,
      blending:THREE.NormalBlending,depthWrite:false,depthTest:true,fog:false
     });
     const mesh=new THREE.Mesh(geo,mat);
     mesh.frustumCulled=false;mesh.renderOrder=band.order;mesh.userData.flameBand=band;
     mesh.visible=false;
     sc.add(mesh);magic.strips.push(mesh);
    }
    // a few small embers: soft round sprite, low additive value, dim by default
    const eg=new THREE.BufferGeometry();
    eg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NEMB*3),3));
    eg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(NEMB*3),3));
    const cv=document.createElement('canvas');cv.width=32;cv.height=32;
    const cx=cv.getContext('2d');
    if(cx){
     const grd=cx.createRadialGradient(16,16,0,16,16,16);
     grd.addColorStop(0,'rgba(255,238,190,1)');grd.addColorStop(.4,'rgba(255,170,80,.55)');grd.addColorStop(1,'rgba(255,90,90,0)');
     cx.fillStyle=grd;cx.fillRect(0,0,32,32);
    }
    magic.tex=new THREE.CanvasTexture(cv);
    const em=new THREE.PointsMaterial({size:7,map:magic.tex,vertexColors:true,depthTest:true,depthWrite:false,transparent:true,
     blending:THREE.AdditiveBlending,opacity:.42,sizeAttenuation:true,fog:false});
    magic.embers=new THREE.Points(eg,em);
    magic.embers.frustumCulled=false;magic.embers.renderOrder=43;magic.embers.visible=false;
    sc.add(magic.embers);
   }
   const speed=clamp(Math.abs(s.vx)/202,0,1);
   const face=s.face||1;
   // source: attached to the back / shoulder blades of the hero
   const source={x:s.x-face*13,y:s.y-49,age:0,life:1,v:speed};
   const fresh=flamePoints.slice(-(MAX-1)).reverse();
   const chainAll=[source,...fresh];
   // cap length by distance: 0.9..3.0 body heights depending on speed (short when slow)
   const maxLen=FLAME_H*(.55+1.48*speed);
   const centers=[],chain=[];
   let acc=0;
   for(let i=0;i<chainAll.length&&chain.length<MAX;i++){
    const q=chainAll[i];
    const t0=i/Math.max(1,chainAll.length-1);
    const c={x:q.x*2,z:(635-q.y)*2.2+7+(5+9*Math.max(speed,q.v||0))*t0*t0};
    const last=centers[centers.length-1];
    if(last){
     const dd=Math.hypot(c.x-last.x,c.z-last.z);
     if(dd<3)continue;               // no degenerate segments
     if(acc+dd>maxLen)break;
     acc+=dd;
    }
    centers.push(c);chain.push(q);
   }
   const n=centers.length;
   // light smoothing; first point stays exactly on the body
   for(let r=0;r<2;r++){
    for(let i=1;i<n-1;i++){
     const b=centers[i-1],h=centers[i],a=centers[i+1];
     h._x=h.x*.6+(b.x+a.x)*.2;h._z=h.z*.6+(b.z+a.z)*.2;
    }
    for(let i=1;i<n-1;i++){centers[i].x=centers[i]._x;centers[i].z=centers[i]._z;}
   }
   const total=Math.max(1,acc);
   const visible=n>2&&!s.dead&&!s.won;
   const lifeMul=clamp(.52+.48*speed,.52,1);
   let run=0;
   const ts=[];
   for(let i=0;i<n;i++){
    if(i>0)run+=Math.hypot(centers[i].x-centers[i-1].x,centers[i].z-centers[i-1].z);
    ts.push(clamp(run/total,0,1));
   }
   for(let b=0;b<magic.strips.length;b++){
    const m=magic.strips[b],band=m.userData.flameBand;
    m.visible=visible;
    if(!visible){m.geometry.setDrawRange(0,0);continue;}
    const positions=m.geometry.attributes.position.array;
    const tex=m.geometry.attributes.uv.array;
    m.position.y=s.spriteVisualDepth-band.depth;
    m.material.uniforms.uTime.value=s.elapsed;
    m.material.uniforms.uOpacity.value=band.op;
    const maxW=FLAME_H*band.w*(.50+.44*speed);   // hard cap: <= 0.92 body heights, base ~0.5..0.92
    for(let i=0;i<n;i++){
     const q=chain[i],cur=centers[i],t=ts[i];
     const prev=centers[Math.max(0,i-1)],next=centers[Math.min(n-1,i+1)];
     const dx=next.x-prev.x,dz=next.z-prev.z,mag=Math.hypot(dx,dz);
     const nx=mag>1?-dz/mag:0,nz=mag>1?dx/mag:1;
     const age=i===0?0:clamp(q.age/q.life,0,1);
     const width=maxW*Math.pow(Math.max(0,1-t),1.15)*(1-.45*age)*(.83+.17*Math.sin(s.elapsed*5.0-i*.5+b));
     const sway=Math.sin(s.elapsed*3.1-i*.33+b*1.7)*3.5*t;   // slow turbulence, none at the source
     for(let k=0;k<CROSS;k++){
      const side=k/(CROSS-1),off=(i*CROSS+k)*3,uvOff=(i*CROSS+k)*2;
      const delta=(side-.5)*width;
      // radius clamp around the hero keeps the ribbon from ever drifting off
      positions[off]=cur.x+nx*delta+sway;
      positions[off+1]=-Math.min(2.5,i*.05);                 // newer samples are nearer: overlaps never accumulate
      positions[off+2]=cur.z+nz*delta;
      tex[uvOff]=t;tex[uvOff+1]=side;
     }
    }
    m.geometry.setDrawRange(0,(n-1)*(CROSS-1)*6);
    m.geometry.attributes.position.needsUpdate=true;
    m.geometry.attributes.uv.needsUpdate=true;
    m.material.uniforms.uFade.value=lifeMul;
   }
   if(magic.embers){
    const P=magic.embers.geometry.attributes.position.array;
    const C=magic.embers.geometry.attributes.color.array;
    magic.embers.visible=visible&&speed>.18;
    if(magic.embers.visible){
     magic.embers.position.y=s.spriteVisualDepth-5;
     const cnt=P.length/3;
     for(let i=0;i<cnt;i++){
      const ph=((s.elapsed*.9+i/cnt*7.3)%1);              // each ember lives ~1.1 s then re-spawns
      const k=Math.min(n-1,Math.floor(ph*(n-1)*.8)+1),p=centers[k];
      const out=(i%2?1:-1)*(6+10*ph);
      P[i*3]=p.x+Math.sin(i*17.3+s.elapsed*2.1)*8;
      P[i*3+1]=0;
      P[i*3+2]=p.z+out+ph*16;
      const f=Math.pow(1-ph,1.7)*Math.min(1,ph*8)*.35*speed;  // value capped at .55
      C[i*3]=f;C[i*3+1]=f*.62;C[i*3+2]=f*.28;
     }
     magic.embers.geometry.attributes.position.needsUpdate=true;
     magic.embers.geometry.attributes.color.needsUpdate=true;
    }
   }
   fireReady=true;
  }
 }catch(err){
  magic.failed=true;
  if(magic.strips)for(const m of magic.strips)m.visible=false;
  if(magic.embers)magic.embers.visible=false;
  console.warn('[Spalakh magic v0.9.35] using soft native fallback:',err&&err.message);
 }
}
// Native 3D fallback if the ShaderMaterial is unsupported by Preview (sizes capped to the same body-height limits).
if(fireReady){
 for(const group of [tailOuter,tailCore,tailFlare])for(const o of group)o.hide(true);
}else{
 function nativeSoftFlame(objects,kind){
  const nn=flamePoints.length;
  for(let i=0;i<objects.length;i++){
   const o=objects[i];if(!nn||s.dead||s.won){o.hide(true);continue;}
   const k=Math.round(i*(nn-1)/Math.max(1,objects.length-1));
   const q=flamePoints[nn-1-k],t=k/Math.max(1,nn-1);
   const fade=clamp(1-q.age/q.life,0,1);
   const w=(kind==='outer'?76:kind==='core'?49:23)
     *(.42+.55*q.v)*Math.pow(1-t,.78)*(.6+.4*fade);
   const h=w*(kind==='outer'?.68:.55);
   if(o.setWidth)o.setWidth(Math.max(2,w));
   if(o.setDepth)o.setDepth(Math.max(2,h));
   const lift=(5+9*q.v)*t*t;
   move(o,q.x*2-w/2,s.spriteVisualDepth-(kind==='outer'?12:kind==='core'?9:6),
     (635-q.y)*2.2+7+lift-h/2);
   if(o.setOpacity)o.setOpacity(Math.round(255*fade*(kind==='outer'?.33:kind==='core'?.46:.56)));
   o.hide(w<3||fade<.04);
  }
 }
 nativeSoftFlame(tailOuter,'outer');
 nativeSoftFlame(tailCore,'core');
 nativeSoftFlame(tailFlare,'flare');
}
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
// ===== v0.9.41: MACRO TILT-SHIFT — strong shallow focus without artificial foreground overlays =====
// 3D layer EffectComposer only. No decorative corals are painted over the view; HUD stays crisp.
// This is image-space / lens-simulation DOF, not depth-buffer DOF. The narrow, moving focus band tracks Spalakh.
{
 const LENS={
  blurMax:5.0,       // v0.9.43: another 1.5x reduction from v0.9.42 for a clearer miniature look
  focusR0:.24,       // sharp radius around the hero
  focusR1:.92,
  bandSharp:.105,    // sharp tilt-shift strip (fraction of normalized screen height)
  bandSoft:.51,      // rapid roll-off into out-of-focus areas
  tiltSlope:-.075,   // subtle slanted lens plane
  distortion:.074,   // lens barrel warp; centre stays largely stable
  aberration:.0082, // radial chromatic dispersion, close to zero at hero
  vignette:.24
 };
 const fx=runtimeScene.__spalakhLens40||(runtimeScene.__spalakhLens40={pass:null,composer:null,warned:false,failed:false});
 const warn=(what,e)=>{if(!fx.warned){fx.warned=true;console.warn('[Spalakh lens41] '+what+':',e&&e.message?e.message:e);}};
 if(typeof THREE!=='undefined'&&!fx.failed){
  try{
   const layerR=runtimeScene.getLayer('').getRenderer();
   const composer=layerR.getThreeEffectComposer&&layerR.getThreeEffectComposer();
   if(composer&&layerR.addPostProcessingPass){
    if(!fx.pass||fx.composer!==composer||composer.passes.indexOf(fx.pass)<0){
     if(fx.pass&&fx.composer&&fx.composer.passes.indexOf(fx.pass)>=0){try{fx.composer.removePass(fx.pass);}catch(e){}}
     if(fx.pass&&fx.pass.dispose)fx.pass.dispose();
     fx.pass=makeLensPass(layerR);fx.composer=composer;
     layerR.addPostProcessingPass(fx.pass);
    }
   }
  }catch(error){fx.failed=true;warn('pass disabled',error);}
 }
 function makeLensPass(layerR){
  // GDevelop's 3D renderer feeds the already rendered world through readBuffer. No separate scene or
  // foreground geometry is drawn into that buffer (avoids old quad occlusion and foreground masks).
  const tri=new THREE.BufferGeometry();
  tri.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
  const cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const mat=new THREE.ShaderMaterial({
   uniforms:{tDiffuse:{value:null},uRes:{value:new THREE.Vector2(1280,720)},
    uFocus:{value:new THREE.Vector2(.5,.37)},uAspect:{value:1.777},
    uK:{value:LENS.distortion},uCA:{value:LENS.aberration},uBlur:{value:LENS.blurMax},
    uR0:{value:LENS.focusR0},uR1:{value:LENS.focusR1},
    uBand0:{value:LENS.bandSharp},uBand1:{value:LENS.bandSoft},uSlope:{value:LENS.tiltSlope},
    uVig:{value:LENS.vignette}},
   vertexShader:'varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}',
   fragmentShader:[
    'uniform sampler2D tDiffuse;uniform vec2 uRes;uniform vec2 uFocus;uniform float uAspect;',
    'uniform float uK,uCA,uBlur,uR0,uR1,uBand0,uBand1,uSlope,uVig;',
    'varying vec2 vUv;',
    'vec3 fetchCA(vec2 uv,vec2 off){',
    ' vec2 lo=vec2(1.5)/uRes;vec2 hi=vec2(1.0)-lo;',
    ' return vec3(texture2D(tDiffuse,clamp(uv+off,lo,hi)).r,',
    '             texture2D(tDiffuse,clamp(uv,lo,hi)).g,',
    '             texture2D(tDiffuse,clamp(uv-off,lo,hi)).b);',
    '}',
    'void main(){',
    ' vec2 c=vUv-.5;vec2 ca=c*vec2(uAspect,1.);',
    ' float r2=dot(ca,ca);float rmax2=.25*(uAspect*uAspect+1.);float rn=r2/rmax2;',
    ' vec2 duv=c*((1.+uK*r2)/(1.+uK*.49*rmax2));',
    ' vec2 uv=clamp(.5+duv,vec2(.002),vec2(.998));',
    ' vec2 split=duv*uCA*rn;',
    ' vec2 p=(vUv-uFocus);',
    ' float dy=abs(p.y-uSlope*p.x);',
    ' float tilt=smoothstep(uBand0,uBand1,dy);',
    ' float radial=length(p*vec2(uAspect*.82,1.));',
    ' float rr=smoothstep(uR0,uR1,radial);',
    ' float strength=clamp(max(tilt,rr*.64),0.,1.);',
    ' float rad=uBlur*strength*strength*(3.-2.*strength)*(uRes.y/720.);',
    ' vec3 col;',
    ' if(rad<.33){col=fetchCA(uv,split);}',
    ' else{',
    '  vec3 acc=fetchCA(uv,split);float ws=1.;',
    '  for(int i=0;i<19;i++){',
    '   float fi=float(i)+.5;float rr2=sqrt(fi/19.);float th=fi*2.399963;',
    '   vec2 offset=vec2(cos(th),sin(th))*rr2*rad/uRes;',
    '   vec3 v=fetchCA(uv+offset,split);',
    '   float peak=max(v.r,max(v.g,v.b));',
    '   float weight=1.+1.75*smoothstep(.67,1.45,peak);',
    '   acc+=v*weight;ws+=weight;',
    '  }',
    '  col=acc/ws;',
    ' }',
    ' float vg=1.-uVig*smoothstep(.26,1.0,sqrt(rn));',
    ' gl_FragColor=vec4(col*vg,texture2D(tDiffuse,uv).a);',
    '}'].join('\n'),
   depthTest:false,depthWrite:false
  });
  const quad=new THREE.Mesh(tri,mat);quad.frustumCulled=false;
  const scene=new THREE.Scene();scene.add(quad);
  const tmp=new THREE.Vector3(),focus={x:0,y:-.2,init:false};
  return {isPass:true,enabled:true,needsSwap:true,clear:false,renderToScreen:false,
   setSize(){},dispose(){tri.dispose();mat.dispose();},
   render(renderer,writeBuffer,readBuffer){
    const w=readBuffer.width,h=readBuffer.height;
    const halo=runtimeScene.__spalakhRadial39&&runtimeScene.__spalakhRadial39.sprite;
    const activeCamera=layerR.getThreeCamera&&layerR.getThreeCamera();
    let hx=focus.init?focus.x:0,hy=focus.init?focus.y:-.2;
    if(halo&&activeCamera){
     try{
      halo.getWorldPosition(tmp);tmp.project(activeCamera);
      if(isFinite(tmp.x)&&isFinite(tmp.y)&&tmp.z<1){
       hx=Math.max(-1.3,Math.min(1.3,tmp.x));hy=Math.max(-1.3,Math.min(1.3,tmp.y));
      }
     }catch(e){}
    }
    if(!focus.init){focus.x=hx;focus.y=hy;focus.init=true;}
    focus.x+=(hx-focus.x)*.25;focus.y+=(hy-focus.y)*.25;
    const u=mat.uniforms;
    u.tDiffuse.value=readBuffer.texture;
    u.uRes.value.set(w,h);u.uAspect.value=w/h;
    u.uFocus.value.set(.5+.5*focus.x,.5+.5*focus.y);
    const oldClear=renderer.autoClear;
    try{
     renderer.autoClear=false;
     renderer.setRenderTarget(this.renderToScreen?null:writeBuffer);
     if(this.clear)renderer.clear();
     renderer.render(scene,cam);
    }finally{renderer.autoClear=oldClear;}
   }
  };
 }
}
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
// 40% longer, gentler easing for the zoom in/out by the light switches.
const easeXY=1-Math.exp(-(1.52/1.4)*dt);
const easeZoom=1-Math.exp(-(1.02/1.4)*dt);
const easeAngle=1-Math.exp(-(.95/1.4)*dt);
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