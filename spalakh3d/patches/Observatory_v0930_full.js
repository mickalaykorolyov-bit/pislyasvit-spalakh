// ПІСЛЯСВІТ — ОБСЕРВАТОРІЯ ХИБНОГО СВІТЛА • 3D CINEMATIC NIGHT v0.9.8 (foot anchoring v0.9.23, graphics pass v0.9.25, soft-depth parallax v0.9.30)
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
 // v0.9.29: fire-light ribbon sampled behind Spalakh, independent of the old cube sparks.
 // Faster movement = longer-lived, denser flame. Standing = short dying embers, never a detached trail.
 if(!Array.isArray(s.flameTrail))s.flameTrail=[];
 s.flameTick=(s.flameTick||0)+dt;
 const flameSpeed=Math.abs(s.vx),flameNorm=clamp(flameSpeed/202,0,1);
 if(flameSpeed>18&&s.flameTick>=(.055-.034*flameNorm)){
  const backward=s.face||1;
  s.flameTrail.push({x:s.x-backward*(13+flameNorm*13),y:s.y-47,age:0,
   life:.15+.53*flameNorm,v:flameNorm,face:backward,seed:(s.elapsed*17)%6.283});
  s.flameTick=0;
 }
 for(const q of s.flameTrail)q.age+=dt;
 s.flameTrail=s.flameTrail.filter(q=>q.age<q.life).slice(-26);
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
}
const aura=first('SpalakhAura'),ground=first('SpalakhGroundGlow');
if(aura)move(aura,visualPs-175,s.spriteVisualDepth-10,surfaceZ-55);
if(ground){
 ground.hide(s.dead||!s.ground);
 // Horizontal glow lies on the real visible surface, even during Land.
 move(ground,visualPs-85,s.spriteVisualDepth-45,surfaceZ+2);
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
for(let i=0;i<3;i++){
 const plane=beamPlanes[i],model=spotlightModels[i],target=panelTargets[i];
 const decal=impactDecals[i],impactLight=impactLights[i];
 if(!plane||!model||!target){
  if(plane)plane.hide(true);if(decal)decal.hide(true);if(impactLight)impactLight.hide(true);
  continue;
 }
 const srcX=model.getX()+model.getWidth()*.5,srcZ=model.getZ()+model.getDepth()*.48;
 const aimX=worldX(target.x),aimZ=worldZ(target.y);
 const impact=projectorImpact(srcX,srcZ,aimX,aimZ);
 const endX=impact?impact.x:aimX,endZ=impact?impact.z:aimZ;
 const dx=srcX-endX,dz=srcZ-endZ,beamLength=Math.max(90,Math.hypot(dx,dz));
 const angleY=Math.atan2(dx,dz)*180/Math.PI;
 const midX=(srcX+endX)*.5,midZ=(srcZ+endZ)*.5;
 plane.hide(false);
 if(typeof plane.setRotationY==='function')plane.setRotationY(angleY);
 move(plane,midX-plane.getWidth()*.5,model.getY()+model.getHeight()+12,midZ-beamLength*.5);
 if(typeof plane.setDepth==='function')plane.setDepth(beamLength);
 if(decal){
  decal.hide(!impact);
  if(impact){
   const px1=worldX(impact.floor.x),px2=worldX(impact.floor.x+impact.floor.w);
   const offsetX=Math.max(px1,Math.min(px2-decal.getWidth(),impact.x-decal.getWidth()*.5));
   move(decal,offsetX,-80,impact.z+2);
  }
 }
 if(impactLight){
  impactLight.hide(!impact);
  if(impact)move(impactLight,impact.x,-50,impact.z+55);
 }
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

// ===== v0.9.30 — SOFT DEPTH PARALLAX / selective underwater depth of field =====
// Only four BACKGROUND Cube3DObjects: no camera, puzzle, collisions, character, or HUD changes.
// Blur is baked once into runtime CanvasTexture; per-frame work stops after textures are ready.
// The distant PNGs are blended 30% toward a defocused version, with gentler blur near gameplay.
{
 const specs=[
  {name:'ParallaxSkyWaterPNG', blur:13, mix:.30, opacity:1,    tint:[1,1,1]},
  {name:'ParallaxRuinsPNG',    blur:10, mix:.30, opacity:.76,  tint:[.90,.98,1]},
  {name:'ParallaxShipPNG',     blur:7,  mix:.24, opacity:.72,  tint:[.89,.96,1]},
  {name:'ParallaxForegroundFramePNG',blur:3,mix:.08,opacity:.56,tint:[.85,.94,1]}
 ];
 const pd=runtimeScene.__spalakhParallaxDepth||(runtimeScene.__spalakhParallaxDepth={
   applied:{},attempts:{},textures:{},warned:false
 });
 // GDevelop's Cube3DObject exposes the underlying Three.js mesh.
 // If unavailable (old engine/Preview), the native objects remain unchanged.
 if(typeof THREE!=='undefined'&&typeof document!=='undefined'){
  function softenTexture(source,cfg){
   if(!source||!source.image)return null;
   const img=source.image,w0=img.naturalWidth||img.videoWidth||img.width;
   const h0=img.naturalHeight||img.videoHeight||img.height;
   if(!(w0>0&&h0>0))return null;
   const key=source.uuid+'|'+cfg.name;
   if(pd.textures[key])return pd.textures[key];
   const scale=Math.min(1,2048/Math.max(w0,h0));
   const w=Math.max(1,Math.round(w0*scale)),h=Math.max(1,Math.round(h0*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const ctx=canvas.getContext('2d',{willReadFrequently:false});
   if(!ctx)return null;
   // Original remains the base so alpha silhouettes do not turn into detached halos.
   ctx.drawImage(img,0,0,w,h);
   ctx.save();
   ctx.filter='blur('+Math.max(0.1,cfg.blur*scale).toFixed(2)+'px)';
   ctx.globalAlpha=cfg.mix;
   ctx.drawImage(img,0,0,w,h);
   ctx.restore();
   // Detect CORS-tainted source before creating a WebGL-bound texture.
   ctx.getImageData(0,0,1,1);
   const tex=new THREE.CanvasTexture(canvas);
   tex.flipY=source.flipY;
   if('colorSpace' in source)tex.colorSpace=source.colorSpace;
   if('encoding' in source)tex.encoding=source.encoding;
   tex.wrapS=source.wrapS;tex.wrapT=source.wrapT;
   tex.minFilter=THREE.LinearMipmapLinearFilter;
   tex.magFilter=THREE.LinearFilter;
   tex.generateMipmaps=true;tex.needsUpdate=true;
   pd.textures[key]=tex;
   return tex;
  }
  for(const cfg of specs){
   if(pd.attempts[cfg.name]>=24)continue;
   const o=runtimeScene.getObjects(cfg.name)[0];
   const three=o&&o.get3DRendererObject&&o.get3DRendererObject();
   if(!three||typeof three.traverse!=='function')continue;
   if(pd.applied[cfg.name]===three.uuid)continue;
   let mapped=0,notReady=false;
   try{
    three.traverse(node=>{
     if(!node.isMesh||!node.material)return;
     const original=Array.isArray(node.material)?node.material:[node.material];
     const materials=original.map(m=>{
      if(!m)return m;
      // Clone the per-face materials: never alter shared textures of play platforms.
      const c=m.clone(),src=m.map;
      if(src){
       const image=src.image;
       const ready=image&&(image.naturalWidth||image.videoWidth||image.width)>0;
       if(!ready)notReady=true;
       else{
        try{
         const soft=softenTexture(src,cfg);
         if(soft){c.map=soft;mapped++;}
        }catch(e){
         // CORS-locked image or CanvasTexture unsupported: leave original art in place.
         if(!pd.warned){pd.warned=true;console.warn('[parallax] texture blur fallback:',e&&e.message);}
        }
       }
      }
      if(c.color&&typeof c.color.setRGB==='function')
       c.color.setRGB(cfg.tint[0],cfg.tint[1],cfg.tint[2]);
      c.opacity=cfg.opacity;
      c.transparent=true;
      c.depthWrite=false;
      c.needsUpdate=true;
      return c;
     });
     node.material=Array.isArray(node.material)?materials:materials[0];
    });
   }catch(e){
    if(!pd.warned){pd.warned=true;console.warn('[parallax] material fallback:',e&&e.message);}
   }
   if(mapped>0&&!notReady)pd.applied[cfg.name]=three.uuid;
   else pd.attempts[cfg.name]=(pd.attempts[cfg.name]||0)+1;
  }
 }
}

// ===== v0.9.25 GRAPHICS PASS 1 — atmosphere only (reads s.elapsed; writes nothing to gameplay state) =====
// GFX_QUALITY: 0 = off (v0.9.24 look), 1 = medium, 2 = high.
// Every call below is guarded: if an API is missing in this GDevelop build the effect is skipped, never the game.
const GFX_QUALITY=2;
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
   try{gdjs.evtTools.runtimeScene.setBackgroundColor(runtimeScene,'8;31;52');}
   catch(e){try{runtimeScene.setBackgroundColor(8,31,52);}catch(e2){console.warn('[gfx] background colour unavailable');}}
   // 2) distance haze: exponential scene fog (three.js Scene.fog), light enough not to wash out the play plane
   try{
    const sc=runtimeScene.getLayer('').getRenderer().getThreeScene();
    if(sc&&typeof THREE!=='undefined')sc.fog=new THREE.FogExp2(0x123e5c,GFX_QUALITY>1?0.00034:0.00022);
    else console.warn('[gfx] scene fog unavailable (no three scene / THREE)');
   }catch(e){console.warn('[gfx] scene fog unavailable:',e&&e.message);}
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
 // 5) soft glow behind corals / anemones
 for(const name of ['ObsCoralGlowCyan','ObsCoralGlowPink']){
  const gl=runtimeScene.getObjects(name);
  for(let i=0;i<gl.length;i++){
   const o=gl[i];
   if(GFX_QUALITY<1){o.hide(true);continue;}
   o.hide(false);
   setOp(o,.5+.22*Math.sin(t*1.05+i*1.3+(name==='ObsCoralGlowPink'?2:0)));
  }
 }
}
// v0.9.29: soft fire ribbon using textured, transparent XZ billboards (NOT the cube sparks).
// Position uses animated character's visual depth; it cannot move in front of Spalakh.
const sparkCubes=runtimeScene.getObjects('Spark');for(const o of sparkCubes)o.hide(true);
const tailOuter=runtimeScene.getObjects('SpalakhTrailRose');
const tailCore=runtimeScene.getObjects('SpalakhTrailGold');
const tailFlare=runtimeScene.getObjects('SpalakhTrailFlare');
const flamePoints=s.flameTrail||[];
function flameLayer(objects,kind){
 for(let i=0;i<objects.length;i++){
  const o=objects[i],q=flamePoints[flamePoints.length-1-i];
  if(!q||s.dead||s.won){o.hide(true);continue;}
  const fade=clamp(1-q.age/q.life,0,1);
  const wave=Math.sin(s.elapsed*9+q.seed+i*.81);
  const expand=q.v*(.88+.12*Math.sin(s.elapsed*4+i));
  const size=(kind==='outer'?94:kind==='core'?50:26)*(0.32+0.82*expand)*(.45+.55*fade);
  const height=size*(kind==='outer'?.83:kind==='core'?.67:.58);
  if(typeof o.setWidth==='function')o.setWidth(size);
  if(typeof o.setDepth==='function')o.setDepth(height);
  const px=worldX(q.x)+(q.face*(kind==='outer'?-10:5))-(size*.5);
  const pz=worldZ(q.y)+10+Math.sin(q.seed+s.elapsed*8)*6 + (kind==='outer'?8:24);
  const py=s.spriteVisualDepth-(kind==='outer'?29:kind==='core'?24:19);
  move(o,px,py,pz);
  if(typeof o.setOpacity==='function')o.setOpacity(Math.round(255*fade*(kind==='outer'?.54:kind==='core'?.72:.68)));
  // Hide the last tail samples rather than creating hard edges; no collision/stealth influence.
  o.hide(fade<.035);
 }
}
flameLayer(tailOuter,'outer');flameLayer(tailCore,'core');flameLayer(tailFlare,'flare');
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
