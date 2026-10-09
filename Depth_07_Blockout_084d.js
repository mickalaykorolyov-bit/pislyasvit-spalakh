// ПІСЛЯСВІТ 0.8.1 — ABYSS ATMOSPHERE. Dark new parallax, fog, lamp halos; gameplay preserved.
if (!runtimeScene.__depth07) {
  const cfg = {
    worldWidth:5760, worldHeight:1080,
    walk:188, run:312, sneak:68,
    groundAccel:1420, airAccel:880, groundBrake:1900, airBrake:700,
    jumpVelocity:-500, gravityHold:740, gravityRelease:1360, gravityFall:1250,
    maxFall:750, jumpHoldMax:.18, coyote:.105, jumpBuffer:.13,
    dashSpeed:618, dashDuration:.145, dashCooldown:1.04,
    lightIdle:.065,lightRise:7.2,lightFade:2.5
  };
  runtimeScene.__depth07={
    cfg, x:145,y:900,vx:0,vy:0,grounded:true,facing:1,dashFacing:1,
    brightness:.065,visualLight:.065,bodyVisibility:0,lastBodyTint:-1,flash:0,lightState:'STEALTH',
    dashTimer:0,dashCooldown:0,dashHeld:false,jumpHeld:false,jumpBuffer:0,jumpHold:0,coyote:.105,
    cameraX:640,elapsed:0,landTimer:0,animation:'',dead:0,shield:0,dying:false,deathTimer:0,deathCause:'',deathAtX:0,deathAtY:0,
    sensorA:false,sensorB:false,gateOpen:false,checkpoint:false,exitCheckpoint:false,win:false,
    sensorProgressA:0,sensorProgressB:0,stage:0,
    fishX:2920,fishY:832,fishDir:1,fishState:'SLEEP',fishAlert:0,
    fishTimer:0,fishLastX:2920,fishWake:false,fishNotice:false,fishLostSightTimer:0,fishChaseTime:0,fishLungeTime:0,fishLungeDir:1,fishCooldown:0,
    particles:[], trailTime:0,muted:false,muteHeld:false,wasGrounded:true,
    carried:null,pickups:null,projectile:null,throwSplash:null,pickHeld:false,throwHeld:false,throwCooldown:0,
    fishStun:0,fishGrace:0,fishNoiseX:2920,fishNoiseTimer:0,throwCount:0,fishStunCount:0,
    envLamps:null,envCargo:null,litPool:false,ambientLight:0,inLightCover:false,activeCoverLamp:-1,coverEntered:false,circuitTimers:[0,0],alarmTimer:0,alarmEver:false,worldMessage:"",worldMessageTimer:0,worldHit:null,worldHits:0,
    firstLampTutorial:false,firstCoverTutorial:false,firstFishWarning:false,midCheckpointAnnounced:false,worldMarker:""
  };
}
const s=runtimeScene.__depth07;
const C=s.cfg;
const pickupSpawns=[{id:0,type:'shell',x:1470,y:794,used:false},{id:1,type:'bolt',x:2230,y:779,used:false},{id:2,type:'stone',x:2820,y:773,used:false},{id:3,type:'shell',x:3190,y:711,used:false},{id:4,type:'bolt',x:3760,y:777,used:false},{id:5,type:'stone',x:4085,y:722,used:false},{id:6,type:'bolt',x:4400,y:792,used:false},{id:7,type:'stone',x:935,y:710,used:false}];
if(!s.pickups)s.pickups=pickupSpawns.map(p=>({...p}));
// Ordered as the player encounters them. Each refuge is reachable by a throw from an existing ledge.
const lampSpecs=[{x:1695,y:710},{x:2630,y:710},{x:4145,y:680},{x:3510,y:690}];
const cargoSpecs=[{x:3345,y:638,floor:914},{x:3935,y:694,floor:915}];
const switchSpecs=[{x:1190,y:628,circuit:0},{x:4210,y:651,circuit:1}];
const alarmSpec={x:2350,y:595};
const resetEnvironment=()=>{
 s.envLamps=lampSpecs.map(l=>({...l,on:false})); s.litPool=false;s.ambientLight=0;
 s.inLightCover=false;s.activeCoverLamp=-1;s.coverEntered=false;s.fishLostSightTimer=0;
 s.envCargo=cargoSpecs.map(c=>({...c,started:false,falling:false,landed:false,delay:0,vy:0}));
 s.circuitTimers=[0,0];s.alarmTimer=0;s.alarmEver=false;s.worldMessage='';s.worldMessageTimer=0;s.worldHit=null;
};
if(!s.envLamps||!s.envCargo)resetEnvironment();
const worldFeedback=(msg,x,y)=>{s.worldMessage=msg;s.worldMessageTimer=2.2;s.worldHit={x,y,t:.4};s.worldHits++;};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const near=(a,b)=>Math.abs(a-b);
const key=(k)=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const i={left:key('Left')||key('a'),right:key('Right')||key('d'),down:key('Down')||key('s'),jump:key('Space')||key('Up')||key('w'),boost:key('LShift')||key('Shift'),dash:key('x')||key('k'),pick:key('e')||key('E'),throw:key('f')||key('F')||key('q')||key('Q')};
const dt=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.04);
const get=(name)=>runtimeScene.getObjects(name)[0];
const objects=(name)=>runtimeScene.getObjects(name);
const rects=objects('Platform').map(o=>({x:o.getX(),y:o.getY(),w:o.getWidth(),h:o.getHeight()}));
for(const p of objects('Platform')) if(p.setOpacity)p.setOpacity(0);
for(const nm of ['DepthPlatformLip074','Stone01','Stone02','Stone03','Stone04']) for(const p of objects(nm)) if(p.setOpacity)p.setOpacity(0);
const stateRespawn=()=>{
  s.x=s.exitCheckpoint?4460:(s.checkpoint?1905:145);s.y=s.exitCheckpoint?825:900;s.vx=0;s.vy=0;s.grounded=true;
  s.dashTimer=0;s.dashCooldown=.34;s.brightness=C.lightIdle;s.visualLight=C.lightIdle;s.bodyVisibility=0;s.lastBodyTint=-1;
  s.flash=.27;s.fishX=2920;s.fishY=832;s.fishDir=1;s.fishAlert=0;s.fishState=s.sensorA?'PATROL':'SLEEP';s.fishTimer=0;
  s.shield=1.55;s.dying=false;s.deathTimer=0;s.landTimer=0;
  s.fishChaseTime=0;s.fishLungeTime=0;s.fishCooldown=0;s.fishNotice=false;s.fishLostSightTimer=0;
  // On death replenish finite world pickups, never duplicate while alive.
  s.carried=null;s.projectile=null;s.throwSplash=null;s.pickups=pickupSpawns.map(p=>({...p}));
  s.fishStun=0;s.fishGrace=0;s.fishNoiseTimer=0;s.pickHeld=false;s.throwHeld=false;s.throwCooldown=.2;
  resetEnvironment();
};
const killSpalakh=(reason)=>{
  if(s.dying||s.shield>0||s.win)return;
  s.dying=true;s.deathTimer=.92;s.dead+=1;s.deathCause=reason;
  s.deathAtX=s.x;s.deathAtY=s.y-97;s.vx=0;s.vy=0;s.dashTimer=0;
  s.brightness=C.lightIdle;s.visualLight=C.lightIdle;
};
const gameReset=()=>{
  s.sensorA=false;s.sensorB=false;s.gateOpen=false;s.checkpoint=false;s.exitCheckpoint=false;s.win=false;
  s.sensorProgressA=0;s.sensorProgressB=0;s.fishWake=false;s.fishState='SLEEP';s.dead=0;
  s.dying=false;s.deathTimer=0;s.deathCause='';s.fishChaseTime=0;s.fishLungeTime=0;s.fishCooldown=0;s.shield=0;
  s.x=145;s.y=900;s.vx=0;s.vy=0;s.grounded=true;s.cameraX=640;
  s.brightness=C.lightIdle;s.visualLight=C.lightIdle;s.bodyVisibility=0;s.lastBodyTint=-1;s.fishX=2920;s.fishY=832;s.fishAlert=0;
  s.carried=null;s.projectile=null;s.throwSplash=null;s.pickups=pickupSpawns.map(p=>({...p}));
  s.fishStun=0;s.fishGrace=0;s.fishNoiseTimer=0;s.throwCount=0;s.fishStunCount=0;
  s.pickHeld=false;s.throwHeld=false;s.throwCooldown=0;
  s.worldHits=0;s.firstLampTutorial=false;s.firstCoverTutorial=false;
  s.firstFishWarning=false;s.midCheckpointAnnounced=false;s.worldMarker="";resetEnvironment();
};
const mute=key('m')||key('M'); if(mute&&!s.muteHeld)s.muted=!s.muted;s.muteHeld=mute;
if(key('r'))gameReset();
const advance=(value,goal,rate)=>value+clamp(goal-value,-rate,rate);
if(s.dying && dt>0){
  s.elapsed+=dt;
  s.deathTimer=Math.max(0,s.deathTimer-dt);
  if(s.deathTimer<=0)stateRespawn();
}
if(!s.win && dt>0 && !s.dying){
  s.elapsed+=dt;
  s.shield=Math.max(0,s.shield-dt);
  s.flash=Math.max(0,s.flash-dt*1.65);
  s.dashTimer=Math.max(0,s.dashTimer-dt);
  s.dashCooldown=Math.max(0,s.dashCooldown-dt);
  s.throwCooldown=Math.max(0,s.throwCooldown-dt);
  s.fishGrace=Math.max(0,s.fishGrace-dt);
  s.fishNoiseTimer=Math.max(0,s.fishNoiseTimer-dt);
  s.alarmTimer=Math.max(0,s.alarmTimer-dt);
  s.worldMessageTimer=Math.max(0,s.worldMessageTimer-dt);
  if(s.worldHit){s.worldHit.t-=dt;if(s.worldHit.t<=0)s.worldHit=null;}
  for(let n=0;n<s.circuitTimers.length;n++)s.circuitTimers[n]=Math.max(0,s.circuitTimers[n]-dt);
  // Hanging cargo: 0.38s warning before a lethal fall. Resets after death.
  for(const c of s.envCargo){
    if(!c.started||c.landed)continue;
    if(c.delay>0){c.delay=Math.max(0,c.delay-dt);continue;}
    c.falling=true;c.vy=Math.min(820,c.vy+1350*dt);
    c.y+=c.vy*dt;
    if(Math.abs(s.x-c.x)<66&&Math.abs((s.y-76)-c.y)<72&&s.shield<=0)killSpalakh('ПАДІННЯ ВАНТАЖУ');
    if(s.fishWake&&s.fishStun<=0&&Math.abs(s.fishX-c.x)<92&&Math.abs((s.fishY-80)-c.y)<98){
      s.fishStun=2.45;s.fishState='STUN';s.fishAlert=0;s.fishLungeTime=0;s.fishChaseTime=0;
      s.fishStunCount++;worldFeedback('ВАНТАЖ ОГЛУШИВ РИБУ',c.x,c.y);
    }
    if(c.y>=c.floor-57){c.y=c.floor-57;c.vy=0;c.falling=false;c.landed=true;worldFeedback('ВАНТАЖ УПАВ — ПРОХІД ВІЛЬНИЙ',c.x,c.y);}
  }
  if(s.throwSplash){s.throwSplash.t-=dt;if(s.throwSplash.t<=0)s.throwSplash=null;}
  const dir=(i.right?1:0)-(i.left?1:0);
  if(dir!==0&&s.dashTimer<=0)s.facing=dir;
  // Buffered jump, coyote time and variable jump height: unchanged from 0.6.6.1.
  if(i.jump&&!s.jumpHeld)s.jumpBuffer=C.jumpBuffer;else s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);
  if(s.grounded)s.coyote=C.coyote;else s.coyote=Math.max(0,s.coyote-dt);
  if(s.jumpBuffer>0&&(s.grounded||s.coyote>0)&&s.dashTimer<=0){
    s.vy=C.jumpVelocity;s.grounded=false;s.coyote=0;s.jumpBuffer=0;s.jumpHold=0;s.flash=Math.max(s.flash,.20);
  }
  if(s.jumpHeld&&!i.jump&&s.vy< -135)s.vy*=.53;
  s.jumpHeld=i.jump;
  if(i.dash&&!s.dashHeld&&s.dashCooldown<=0){
    s.dashFacing=s.facing;s.dashTimer=C.dashDuration;s.dashCooldown=C.dashCooldown;s.flash=.39;s.vx=s.dashFacing*C.dashSpeed;
  }
  s.dashHeld=i.dash;
  if(s.dashTimer>0)s.vx=s.dashFacing*C.dashSpeed;
  else {
    const target=dir*(i.down?C.sneak:(i.boost?C.run:C.walk));
    const rate=dir===0?(s.grounded?C.groundBrake:C.airBrake):(s.grounded?C.groundAccel:C.airAccel);
    s.vx=advance(s.vx,target,rate*dt);
  }
  if(!s.grounded||s.vy!==0){
    if(s.vy<0){if(i.jump && s.jumpHold<C.jumpHoldMax){s.jumpHold+=dt;s.vy+=C.gravityHold*dt;}else s.vy+=C.gravityRelease*dt;}
    else s.vy+=C.gravityFall*dt;
    s.vy=clamp(s.vy,-650,C.maxFall);
  }
  const oldY=s.y,oldX=s.x;
  s.x=clamp(s.x+s.vx*dt,22,C.worldWidth-26);
  // World-coordinate closed gate: gameplay blocker is independent of artwork.
  if(!s.gateOpen && oldX<=4663 && s.x>4663){s.x=4663;s.vx=0;}
  if(!s.gateOpen && s.x>=4663 && dir>0){s.x=4663;s.vx=0;}
  s.y+=s.vy*dt;
  let landed=false;
  for(const p of rects){
    if(s.vy>=0 && oldY<=p.y+6 && s.y>=p.y && s.x+15>p.x && s.x-15<p.x+p.w){s.y=p.y;s.vy=0;landed=true;break;}
  }
  if(!s.grounded&&landed)s.landTimer=.14;
  s.grounded=landed;
  if(landed)s.coyote=C.coyote;
  s.landTimer=Math.max(0,s.landTimer-dt);
  if(s.y>1140)killSpalakh('ТЕМНЕ ПРОВАЛЛЯ');
  let target=C.lightIdle+Math.pow(clamp(Math.abs(s.vx)/C.run,0,1),1.42)*.76;
  if(i.down)target=Math.min(.19,target);
  if(s.dashTimer>0)target=1;
  if(s.flash>0)target=Math.max(target,.32+s.flash*.82);
  target=clamp(target,C.lightIdle,1);
  s.brightness=clamp(s.brightness+(target-s.brightness)*(1-Math.exp(-(target>s.brightness?C.lightRise:C.lightFade)*dt)),C.lightIdle,1);
  s.lightState=s.brightness<.22?'STEALTH':s.brightness<.72?'VISIBLE':'FLARE';
  s.visualLight+=(s.brightness-s.visualLight)*(1-Math.exp(-(s.brightness>s.visualLight?7:2.5)*dt));
  // Sensor A and B use identical light scale; a short correctly timed dash triggers them.
  const chargeSensor=(which,tx,ty)=>{
    if(s[which])return;
    const distance=Math.hypot(s.x-tx,(s.y-95)-ty);
    const lit=(s.brightness>=.70 || (s.dashTimer>0 && s.flash>.20));
    const progressKey=which==='sensorA'?'sensorProgressA':'sensorProgressB';
    if(distance<155&&lit)s[progressKey]=Math.min(.20,s[progressKey]+dt);
    else s[progressKey]=Math.max(0,s[progressKey]-dt*2.4);
    if(s[progressKey]>=.17){s[which]=true;s.flash=.58;if(which==='sensorA')s.fishWake=true;}
  };
  chargeSensor('sensorA',1707,735);
  chargeSensor('sensorB',4177,750);
  if(s.sensorA&&s.x>1890)s.checkpoint=true;
  if(s.sensorA&&s.sensorB)s.gateOpen=true;
  // A second checkpoint after successfully escaping the fish's patrol zone:
  // preserves both sensors, resets the consumable world on death, and never soft-locks.
  if(s.sensorB&&s.x>4400&&!s.exitCheckpoint){
    s.exitCheckpoint=true;
    if(!s.midCheckpointAnnounced)worldFeedback('КОНТРОЛЬНА ТОЧКА · ШЛЮЗ ПОПЕРЕДУ',s.x,s.y-95);
    s.midCheckpointAnnounced=true;
  }
  // 0.7.3 — Limited scavenged objects: E = take one nearby, F/Q = throw. No gun or infinite ammo.
  const nearby=s.pickups.filter(p=>!p.used&&Math.abs(s.x-p.x)<114&&Math.abs((s.y-33)-p.y)<97)
    .sort((a,b)=>Math.hypot(s.x-a.x,(s.y-33)-a.y)-Math.hypot(s.x-b.x,(s.y-33)-b.y))[0];
  if(i.pick&&!s.pickHeld&&s.carried===null&&nearby){nearby.used=true;s.carried=nearby.type;s.flash=Math.max(s.flash,.07);}
  s.pickHeld=i.pick;
  if(i.throw&&!s.throwHeld&&s.carried!==null&&s.throwCooldown<=0&&s.projectile===null){
    s.projectile={type:s.carried,x:s.x+s.facing*43,y:s.y-91,vx:s.facing*635+s.vx*.14,vy:-205,rot:0,ttl:2.0};
    s.carried=null;s.throwCount++;s.throwCooldown=.28;
  }
  s.throwHeld=i.throw;
  if(s.projectile){
    const b=s.projectile,oy=b.y,ox=b.x;
    b.x+=b.vx*dt;b.vy+=780*dt;b.y+=b.vy*dt;b.rot+=dt*670*Math.sign(b.vx);b.ttl-=dt;
    let impact=false;
    // Continuous swept hit test: fast projectiles cannot tunnel through small world targets.
    const sweptHit=(tx,ty,r)=>{
      const dx=b.x-ox,dy=b.y-oy,den=dx*dx+dy*dy;
      const t=den>0?clamp(((tx-ox)*dx+(ty-oy)*dy)/den,0,1):0;
      return Math.hypot(ox+t*dx-tx,oy+t*dy-ty)<=r;
    };
    // Our world's defining rule: in darkness Spalakh is a glowing target.
    // Throw at an OFF lamp to switch it ON and create an illuminated hiding pool.
    for(const lamp of s.envLamps){if(!impact&&!lamp.on&&sweptHit(lamp.x,lamp.y,68)){
       lamp.on=true;worldFeedback('ЛАМПА УВІМКНЕНА · ЗАЙДИ У СВІТЛО',lamp.x,lamp.y);
       if(lamp===s.envLamps[0])s.firstLampTutorial=true;
       impact=true;
    }}
    // Cargo requires one throw, then shakes for 0.38s before dropping.
    for(const c of s.envCargo){if(!impact&&!c.started&&sweptHit(c.x,c.y,63)){
       c.started=true;c.delay=.38;worldFeedback('ВАНТАЖ ЗІРВАВСЯ! ВІДІЙДИ!',c.x,c.y);impact=true;
    }}
    // Copper electrical switches open their respective circuit temporarily.
    for(const sw of switchSpecs){if(!impact&&sweptHit(sw.x,sw.y,54)){
       s.circuitTimers[sw.circuit]=6.0;
       worldFeedback('ЕЛЕКТРОЛІНІЮ ВИМКНЕНО НА 6 СЕКУНД',sw.x,sw.y);impact=true;
    }}
    // Dangerous accident: hitting the red alarm panel energizes a new local arc.
    if(!impact&&sweptHit(alarmSpec.x,alarmSpec.y,56)){
       s.alarmTimer=3.5;s.alarmEver=true;
       worldFeedback('АВАРІЙНИЙ БЛОК: НЕБЕЗПЕЧНИЙ РОЗРЯД!',alarmSpec.x,alarmSpec.y);impact=true;
       if(s.fishWake){s.fishNoiseX=2490;s.fishNoiseTimer=4.0;}
    }
    // Direct hits interrupt the fish's charge for 2.35 seconds. Fish is not killed.
    if(!impact&&s.fishWake&&Math.hypot(b.x-s.fishX,b.y-(s.fishY-70))<86){
      s.fishStun=2.35;s.fishGrace=0;s.fishState='STUN';s.fishAlert=0;s.fishLungeTime=0;
      s.fishChaseTime=0;s.fishNotice=false;s.fishStunCount++;s.fishLastX=b.x;impact=true;
    }
    // Ordinary misses fall onto a solid ledge and make noise at the landing point.
    if(!impact&&b.vy>0&&rects.some(p=>oy<=p.y&&b.y>=p.y&&b.x>=p.x&&b.x<=p.x+p.w))impact=true;
    if(!impact&&(b.ttl<=0||b.x<0||b.x>C.worldWidth||b.y>C.worldHeight))impact=true;
    if(!impact&&!s.gateOpen&&b.x>4640&&b.x<4690&&Math.abs(b.y-790)<175)impact=true;
    if(impact){
      s.throwSplash={x:b.x,y:b.y,t:.36};
      // A missed throw is a distraction if the fish can hear the splash.
      if(s.fishWake&&s.fishStun<=0&&Math.abs(s.fishX-b.x)<820){
        s.fishNoiseX=clamp(b.x,2450,4410);s.fishNoiseTimer=3.0;
        if(!['LUNGE','CHASE'].includes(s.fishState))s.fishState='INVESTIGATE';
      }
      s.projectile=null;
    }
  }
  if(s.sensorA&&s.x>2380&&!s.firstFishWarning){
    s.firstFishWarning=true;
    worldFeedback('ЛІГВО РИБИ · ШУКАЙ СВІТЛО, АБО ВІДВОЛІКАЙ ЇЇ',s.x,s.y-95);
  }
  // 0.7.2 — Fair danger loop: warning -> pursuit -> committed lethal lunge.
  // Faster than a sprint in close range; can still be outplayed by dimming, hiding or jumping.
  if(s.fishWake&&s.fishState==='SLEEP')s.fishState='PATROL';
  const fishDx=s.x-s.fishX, fishDy=(s.y-95)-(s.fishY-70);
  const stealthZone=[[2480,2620],[3040,3210],[3660,3790],[4300,4440]].some(([a,b])=>s.x>=a&&s.x<=b);
  const hidden=i.down&&s.brightness<.22&&stealthZone&&s.grounded;
  const playerDist=Math.hypot(fishDx,fishDy*.80);
  // 0.7.7 — External light provides actual camouflage. Spalakh's self-glow
  // still activates optical sensors but must NOT reveal him inside a lit refuge.
  // Pool art is 620x620. Enter at 220px, leave at 245px (hysteresis prevents HUD flicker).
  const coverDistance=(l)=>Math.hypot(s.x-l.x,(s.y-95)-(l.y+52));
  s.ambientLight=s.envLamps.reduce((m,l)=>l.on?Math.max(m,clamp(1-coverDistance(l)/300,0,1)):m,0);
  const wasCovered=s.inLightCover;
  let active=s.activeCoverLamp;
  // Keep the previously occupied refuge slightly longer at its edge.
  if(active<0||!s.envLamps[active]||!s.envLamps[active].on||coverDistance(s.envLamps[active])>245){
    active=-1;
    let nearest=220;
    for(let k=0;k<s.envLamps.length;k++){
      const lamp=s.envLamps[k];if(!lamp.on)continue;
      const d=coverDistance(lamp);
      if(d<=nearest){nearest=d;active=k;}
    }
  }
  s.activeCoverLamp=active;
  s.inLightCover=active>=0;
  s.litPool=s.inLightCover; // legacy HUD compatibility
  s.coverEntered=s.inLightCover&&!wasCovered;
  if(s.coverEntered&&!s.firstCoverTutorial){
    s.firstCoverTutorial=true;
    worldFeedback('У СВІТЛІ ТЕБЕ НЕ ВИДНО · НЕ ТОРКАЙСЯ РИБИ',s.x,s.y-100);
  }
  // In dark water even a dim Spalakh contrasts with the environment.
  const darkRadius=220+430*s.brightness;
  s.detectionRadius=s.inLightCover?0:darkRadius;
  s.fishNotice=s.fishWake&&s.fishStun<=0&&!hidden&&!s.inLightCover&&s.shield<=0&&playerDist<s.detectionRadius;
  // Entering light suppresses visual pursuit after a brief last-position search.
  // A physically committed LUNGE is not cancelled by cover.
  if(s.fishWake){
    if(s.fishStun>0){
      s.fishStun=Math.max(0,s.fishStun-dt);
      s.fishNotice=false;s.fishAlert=0;s.fishState='STUN';
      if(s.fishStun===0){s.fishState='SEARCH';s.fishTimer=0;s.fishGrace=1.05;}
    }else{
    s.fishCooldown=Math.max(0,s.fishCooldown-dt);
    if(s.fishNotice){s.fishAlert=clamp(s.fishAlert+(1.1+s.brightness*.65)*dt,0,1.1);s.fishLastX=s.x;s.fishTimer=0;}
    else {s.fishAlert=clamp(s.fishAlert-.66*dt,0,1.1);s.fishTimer+=dt;}
    if(!s.fishNotice&&s.inLightCover&&['ALERT','CHASE'].includes(s.fishState))s.fishLostSightTimer+=dt;
    else s.fishLostSightTimer=0;
    // After 0.55s concealed, pursuit changes to investigation of LAST visible position.
    // Never update fishLastX when hidden by lamp light; investigate noises separately.
    if(s.fishLostSightTimer>=.55&&['ALERT','CHASE'].includes(s.fishState)){
      s.fishState='SEARCH';s.fishTimer=0;s.fishChaseTime=0;s.fishAlert=0;
      s.fishLostSightTimer=0;
    }
    // Once a lunge begins, direction is committed. Jumping or turning away can evade it.
    if(s.fishState==='LUNGE'){
      s.fishX+=s.fishLungeDir*770*dt;
      s.fishLungeTime-=dt;
      if(s.fishLungeTime<=0){s.fishState='RECOVER';s.fishCooldown=1.05;s.fishTimer=0;}
    }else if(s.fishState==='RECOVER'){
      if(s.fishCooldown<=0){s.fishState=s.fishNotice?'ALERT':'SEARCH';s.fishChaseTime=0;}
    }else if(s.fishNotice&&s.fishAlert>.65){
      if(s.fishState!=='CHASE')s.fishChaseTime=0;
      s.fishState='CHASE';
      s.fishChaseTime+=dt;
      s.fishX+=Math.sign(s.fishLastX-s.fishX||s.fishDir)*455*dt;
      // Visible chase wind-up lasts about half a second before the charge.
      if(s.fishChaseTime>.48&&near(s.x,s.fishX)<365){
        s.fishState='LUNGE';s.fishLungeTime=.42;
        s.fishLungeDir=Math.sign((s.x+s.vx*.25)-s.fishX)||s.fishDir;
      }
    }else if(s.fishState==='CHASE'){
      if(s.fishTimer>(s.inLightCover?.55:.50)){s.fishState='SEARCH';s.fishChaseTime=0;s.fishAlert=0;}
      else s.fishX+=Math.sign(s.fishLastX-s.fishX||s.fishDir)*410*dt;
    }else if(s.fishState==='SEARCH'){
      s.fishX+=Math.sign(s.fishLastX-s.fishX||s.fishDir)*88*dt;
      if(s.fishTimer>3.0)s.fishState='PATROL';
    }else if(s.fishNoiseTimer>0&&!s.fishNotice){
      s.fishState='INVESTIGATE';
      const dx=s.fishNoiseX-s.fishX;
      if(Math.abs(dx)>18)s.fishX+=Math.sign(dx)*152*dt;
    }else if(s.fishNotice){
      s.fishState='ALERT';
    }else if(s.fishAlert>.12){
      s.fishState='ALERT';
    }else {
      s.fishState='PATROL';
      if(s.fishX<2510)s.fishDir=1;
      if(s.fishX>4310)s.fishDir=-1;
      s.fishX+=65*s.fishDir*dt;
    }
    } // end fish non-stunned AI
    s.fishX=clamp(s.fishX,2430,4480);
    s.fishY=832+Math.sin(s.elapsed*1.6)*16;
    // Even at a lit refuge or among reeds, the fish's BODY is still deadly.
    if(near(s.x,s.fishX)<62&&near(s.y-65,s.fishY)<86&&s.shield<=0&&s.fishStun<=0&&s.fishGrace<=0){
      killSpalakh('РИБА-ВУДИЛЬНИК');
    }
  }
  // Static sharp debris: jump over, avoid with elevated platforms.
  for(const h of [{x:2150,y:900,w:135},{x:3590,y:915,w:136},{x:5065,y:920,w:135}]){
    if(!s.dying && s.grounded && s.x>h.x-12 && s.x<h.x+h.w+12 && s.y>=h.y-27){
      killSpalakh('ГОСТРІ УЛАМКИ');
    }
  }
  // Electrified cables: visible flashes, alternating ON/OFF cycle with a safe opening.
  const shockSpecs=[{cx:1300,top:808,bottom:930,offset:0},{cx:4295,top:800,bottom:925,offset:1.65}];
  for(let k=0;k<shockSpecs.length;k++){
    const h=shockSpecs[k];
    const active=s.circuitTimers[k]<=0&&(s.elapsed+h.offset)%3.30<1.35;
    if(active&&!s.dying && Math.abs(s.x-h.cx)<54 && s.y>=h.top && s.y<=h.bottom+15){
      killSpalakh('ЕЛЕКТРИЧНИЙ РОЗРЯД');
    }
  }
  // Optional triggered alarm has its own lethal arc, easily avoided by waiting or jumping.
  if(s.alarmTimer>0&&!s.dying&&Math.abs(s.x-2485)<77&&s.y>801&&s.y<936)killSpalakh('АВАРІЙНА ЕЛЕКТРОДУГА');
  if(!s.dying&&s.x>5625&&s.gateOpen){s.win=true;}
  s.stage=s.x<960?0:s.x<1920?1:s.x<3360?2:s.x<4560?3:4;
}
// Camera follows horizontally; vertical camera centers on the 1080px world, keeping all gameplay visible.
const desiredX=clamp(s.x+190,640,C.worldWidth-640);
s.cameraX+=(desiredX-s.cameraX)*(1-Math.exp(-6*Math.max(dt,.001)));
const cameraY=720;
gdjs.evtTools.camera.setCameraX(runtimeScene,s.cameraX,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,cameraY,'',0);
const scroll=s.cameraX-640;
// 0.8.3a: seven watercolor parallax planes, seamlessly wrapped every 1280px.
const planes083=[
 ['DepthWater',.05,255],['DepthHaze083',.10,58],
 ['DepthWreck',.18,108],['DepthPier',.32,94],
 ['DepthReef',.50,118],['DepthNearFrame083',.72,40],
 ['DepthForeground',1.05,58]
];
for(const [name,rate,opacity] of planes083){
  const els=objects(name);
  for(let n=0;n<els.length;n++){
    const sprite=els[n];
    sprite.setPosition(n*1280+scroll*(1-rate),360);
    if(sprite.setOpacity)sprite.setOpacity(opacity);
  }
}
// Screen-anchored peripheral underwater glass. Does not distort gameplay coordinates.
// Press G to compare the scene with/without water glass. HUD is a separate upper layer.
if(s.glass083Enabled===undefined)s.glass083Enabled=true;
if(s.glass083Held===undefined)s.glass083Held=false;
const glassG083=gdjs.evtTools.input.isKeyPressed(runtimeScene,'g');
if(glassG083&&!s.glass083Held)s.glass083Enabled=!s.glass083Enabled;
s.glass083Held=glassG083;
const glass083=[
 ['OverlayWaterA083',6,Math.sin(s.elapsed*.47)*1.4,Math.sin(s.elapsed*.28)*.7],
 ['OverlayWaterB083',5,-Math.sin(s.elapsed*.33+1)*1.2,Math.cos(s.elapsed*.30)*.7],
 ['OverlayGlassTint083',26,0,0],
 ['OverlayEdgeAberration083',16,0,0],
 ['OverlayVignette083',34,0,0],
 ['OverlayNoise083',7,0,0]
];
for(const [name,opacity,driftX,driftY] of glass083){
 const layer=get(name);
 if(!layer)continue;
 layer.setPosition(s.cameraX-640+driftX,360+driftY);
 if(layer.setOpacity)layer.setOpacity(s.glass083Enabled?opacity:0);
}
// 0.8.4b — Cinematic underwater optics. Filter is applied ONLY to the default gameplay
// container, not the independent HUD layer. Preserve all physics/collision coordinates.
// G = glass on/off, H = true refraction on/off, J = motes on/off.
if(s.refract084On===undefined)s.refract084On=true;
if(s.refract084Held===undefined)s.refract084Held=false;
const refrKey084=key('h');if(refrKey084&&!s.refract084Held)s.refract084On=!s.refract084On;
s.refract084Held=refrKey084;
if(!runtimeScene.__optics084){
 const state={filter:null,container:null,originalFilters:null,error:'',created:false};
 runtimeScene.__optics084=state;
 try{
  if(typeof PIXI==='undefined'||!PIXI.Filter)throw new Error('Pixi 7 filter unavailable');
  const canvas=runtimeScene.getLayer('').getRendererObject();
  if(!canvas)throw new Error('Pixi layer container unavailable');
  const frag=[
    'precision mediump float;',
    'varying vec2 vTextureCoord;',
    'uniform sampler2D uSampler;',
    'uniform float uTime;',
    'uniform float uStrength;',
    'void main(){',
    ' vec2 uv=vTextureCoord;',
    ' vec2 d=(uv-vec2(0.5))*vec2(1.0,0.83);',
    ' float edge=smoothstep(0.14,0.72,length(d));',
    ' float swell=sin(uv.y*7.0+uTime*0.16+sin(uv.x*4.0-uTime*0.09))*0.5+0.5;',
    ' float a=sin(uv.y*33.0+uTime*0.55+sin(uv.x*17.0+uTime*0.32));',
    ' float b=sin(uv.x*27.0-uTime*0.41+uv.y*15.0);',
    ' vec2 wiggle=vec2(a+b*0.5,cos(uv.x*31.0+uTime*0.36)+swell*0.9)*0.0026*(0.18+0.82*edge*edge)*uStrength;',
    ' vec2 sampleUv=clamp(uv+wiggle,vec2(0.002),vec2(0.998));',
    ' float ca=edge*0.0024*uStrength;',
    ' vec4 color=texture2D(uSampler,sampleUv);',
    ' float red=texture2D(uSampler,clamp(sampleUv+vec2(ca,0.0),vec2(0.002),vec2(0.998))).r;',
    ' float blue=texture2D(uSampler,clamp(sampleUv-vec2(ca,0.0),vec2(0.002),vec2(0.998))).b;',
    ' color.rgb=mix(color.rgb,vec3(red,color.g,blue),edge*0.92);',
    ' color.rgb*=vec3(1.0-0.035*edge,1.0,1.0+0.045*edge);',
    ' gl_FragColor=color;',
    '}'
  ].join('\n');
  const filt=new PIXI.Filter(undefined,frag,{uTime:0,uStrength:0.7});
  filt.padding=0;
  state.container=canvas;state.originalFilters=canvas.filters?canvas.filters.slice():[];
  canvas.filters=state.originalFilters.concat([filt]);
  // Avoid allocating a render texture for all 5760 pixels of the game world.
  if(PIXI.Rectangle)canvas.filterArea=new PIXI.Rectangle(0,0,1280,720);
  state.filter=filt;state.created=true;state.applied=true;
 }catch(e){state.error=String(e&&e.message||e);}
}
const optics084=runtimeScene.__optics084;
if(optics084.filter&&optics084.container){
 const want=!!(s.glass083Enabled&&s.refract084On);
 if(want!==optics084.applied){
  const active=optics084.container.filters||[];
  // A genuine GPU on/off comparison: remove filter entirely when disabled.
  if(want){if(!active.includes(optics084.filter))optics084.container.filters=active.concat([optics084.filter]);}
  else optics084.container.filters=active.filter(f=>f!==optics084.filter);
  optics084.applied=want;
 }
 if(want){optics084.filter.uniforms.uTime=s.elapsed;optics084.filter.uniforms.uStrength=1.12;}
}

// 0.8.1: calm drifting local mist in 5 carefully separated pockets, *visual only*.
const mist081=[[650,660,53],[2230,625,62],[2840,570,87],[3550,620,64],[4540,685,54]];
const mistObjs081=objects('DepthFog');
for(let idx=0;idx<mistObjs081.length;idx++){
  const fog=mistObjs081[idx],slot=mist081[idx];
  if(!slot)continue;
  fog.setPosition(slot[0]+Math.sin(s.elapsed*.48+idx*1.6)*23,slot[1]+Math.cos(s.elapsed*.31+idx*1.9)*9);
  if(fog.setOpacity)fog.setOpacity(Math.round(clamp(slot[2]+Math.sin(s.elapsed*.85+idx)*9,0,170)));
}
// Temporary fish and organic light effect.
const fish=get('AnglerFish'),lure=get('AnglerLure'),fishGlow=get('FishGlow');
// 0.8.2.1 ART QUALITY FIX: animated watercolor fish, same AI and physics collider.
if(fish){
 const fishAnim082=s.fishStun>0?'Stun':(
  s.fishState==='SLEEP'?'Sleep':s.fishState==='ALERT'?'Alert':
  s.fishState==='LUNGE'?'Lunge':s.fishState==='CHASE'?'Chase':
  s.fishState==='RECOVER'||s.fishState==='STUN'?'Stun':'Patrol');
 if(s.fishVisualAnim082!==fishAnim082){
   if(fish.setAnimationName)fish.setAnimationName(fishAnim082);
   s.fishVisualAnim082=fishAnim082;
 }
 fish.setPosition(s.fishX-165,s.fishY-188);
 if(fish.setOpacity)fish.setOpacity(255);
 if(fish.flipX)fish.flipX(s.fishState==='CHASE'?(s.fishLastX<s.fishX):(s.fishDir<0));
 if(fish.setAngle)fish.setAngle(s.fishStun>0?Math.sin(s.elapsed*24)*5:0);
}
// Lure is part of the painted fish: duplicate placeholder lure and unattached halo are disabled.
if(lure&&lure.setOpacity)lure.setOpacity(0);
if(fishGlow&&fishGlow.setOpacity)fishGlow.setOpacity(0);
for(const [nm,active] of [['DepthSensorA',s.sensorA],['DepthSensorB',s.sensorB]]){const ob=get(nm);if(ob&&ob.setOpacity)ob.setOpacity(active?255:205);}
for(const [nm,active] of [['SensorGlowA',s.sensorA],['SensorGlowB',s.sensorB]]){const ob=get(nm);if(ob&&ob.setOpacity)ob.setOpacity(active?205:65);}
const gate=get('DepthGate');if(gate&&gate.setOpacity)gate.setOpacity(s.gateOpen?0:255);
// Character: fixed feet pivot across all 8 animations; only the sprite's opacity and tint fade, not its scale or collision.
const P=get('Player');const speed=Math.abs(s.vx);
const anim=s.dashTimer>0?'Dash':(!s.grounded?(s.vy<0?'Jump':'Fall'):
 (i.down?'Crouch':(s.landTimer>0?'Land':(speed>215?'Run':(speed>30?'Slow':'Idle')))));
if(P){
  if(s.animation!==anim){if(P.setAnimationName)P.setAnimationName(anim);s.animation=anim;}
  if(P.setAnimationSpeedScale)P.setAnimationSpeedScale(anim==='Run'?clamp(speed/310,.72,1.15):anim==='Slow'?clamp(speed/150,.82,1.08):1);
  const scaleMap={Idle:.60,Slow:.585,Run:.548,Jump:.575,Fall:.57,Dash:.56,Crouch:.60,Land:.585};
  const footMap={Idle:221,Slow:212,Run:202,Jump:214,Fall:210,Dash:209,Crouch:214,Land:214};
  const anchorMap={Idle:210,Slow:207,Run:192,Jump:207,Fall:197,Dash:197,Crouch:212,Land:212};
  const renderScale=scaleMap[anim]||.60;
  if(P.setScale)P.setScale(renderScale);
  const anchors=anchorMap;
  const core=anchors[anim]||210;
  const foot=footMap[anim]||221;
  P.setPosition(s.x-(s.facing<0?384-core:core)*renderScale,s.y-foot*renderScale);
  if(P.flipX)P.flipX(s.facing<0);
  // v0.7.9.4: four-second resting fade + low-amplitude breathing after full dim.
  // This never changes light refuge detection, player collision, or character scale.
  const motion=Math.max(clamp(speed/C.walk,0,1),s.dashTimer>0?1:0,s.grounded?0:.68);
  const still=motion<.045;
  if(still) s.bodyVisibility=Math.max(0,s.bodyVisibility-dt/4.0);
  else s.bodyVisibility+=(motion-s.bodyVisibility)*(1-Math.exp(-9.2*dt));
  const visible=clamp(s.bodyVisibility,0,1);
  s.restPulseTimer=(still&&visible<.002)?(s.restPulseTimer||0)+dt:0;
  const pulseRamp=Math.min(1,s.restPulseTimer/.65);
  const breathing=pulseRamp*(.5+.5*Math.sin(s.restPulseTimer*(2*Math.PI/3.6)));
  if(P.setOpacity)P.setOpacity(s.dying?0:Math.round(78+177*visible+14*breathing));
  const tint=Math.min(255,Math.round((135+120*visible+11*breathing)/5)*5);
  if(P.setColor&&s.lastBodyTint!==tint){P.setColor(tint+';'+tint+';'+tint);s.lastBodyTint=tint;}
}
const halo=get('Glow');
if(halo){halo.setPosition(s.x-205,s.y-319);if(halo.setOpacity)halo.setOpacity(18+135*s.visualLight);if(halo.setScale)halo.setScale(.48+.36*s.visualLight);}
const worldLight=get('WorldLight');
if(worldLight){worldLight.setPosition(s.x-318,s.y-321);if(worldLight.setOpacity)worldLight.setOpacity(8+135*s.visualLight);if(worldLight.setScale)worldLight.setScale(.58+.38*s.visualLight);}
const floorLight=get('FloorLight');
if(floorLight){floorLight.setPosition(s.x-272,s.y-47);if(floorLight.setOpacity)floorLight.setOpacity(12+130*s.visualLight);if(floorLight.setScaleX)floorLight.setScaleX(.60+.46*s.visualLight);}
// 0.7.9.4 — SOFT BODY COMET: 40px diffused bloom, body-attached origin and feathered leading edge.
// Procedural PIXI ribbon; no PNGs, particle emitters, smoke blobs or gameplay side effects.
function updateSoftComet0794(runtimeScene, actor, dt, deathCount, dying, won, reset, behindZ) {
  let comet = runtimeScene.__softComet0794;
  if (!comet) {
    comet = runtimeScene.__softComet0794 = {
      time:0, points:[], lastDeath:deathCount, wasDying:false,
      aura:null, soft:null, ribbon:null, graphicsOK:false, error:false
    };
    try {
      if (typeof PIXI !== 'undefined' && typeof PIXI.Graphics === 'function') {
        const layer = runtimeScene.getLayer('');
        const renderer = layer && layer.getRenderer && layer.getRenderer();
        if (renderer && typeof renderer.addRendererObject === 'function') {
          comet.aura = new PIXI.Graphics();
          comet.soft = new PIXI.Graphics();
          comet.ribbon = new PIXI.Graphics();
          const additive = PIXI.BLEND_MODES && PIXI.BLEND_MODES.ADD;
          if (additive !== undefined) {
            comet.aura.blendMode=additive;
            comet.soft.blendMode=additive;
            comet.ribbon.blendMode=additive;
          }
          try {
            const Blur = PIXI.filters && PIXI.filters.BlurFilter;
            if (Blur) {
              // Wide gaussian bloom ≈40px around the broad ribbon; enough padding prevents hard clipping.
              const bloom40 = new Blur(52,3);
              bloom40.padding=75;
              comet.aura.filters=[bloom40];
              const feather = new Blur(26,2);
              feather.padding=36;
              comet.soft.filters=[feather];
            }
          } catch (noFilter) { /* Works without a blur filter. */ }
          renderer.addRendererObject(comet.aura,behindZ-.50);
          renderer.addRendererObject(comet.soft,behindZ-.25);
          renderer.addRendererObject(comet.ribbon,behindZ);
          comet.graphicsOK=true;
        }
      }
    } catch (pixiUnavailable) { comet.error=true; }
  }

  dt=Math.min(.05,Math.max(0,Number.isFinite(dt)?dt:.016));
  comet.time+=dt;
  const vx=actor.vx||0, vy=actor.vy||0;
  const speed=Math.hypot(vx,vy*.60);
  const dash=(actor.dashTimer||0)>0;
  const power=dash?1:Math.max(0,Math.min(1,(speed-40)/300));
  const drawing=!dying&&!won&&speed>42;
  const lifespan=dash?.86:(.23+.49*power);
  const facing=actor.facing||1;
  // Feet-center gameplay pivot. This emitter is behind the WHOLE sprite body:
  // center y -78 with a half-span up to 72px at dash = head, wings, torso and feet.
  // Start INSIDE the player body (in front of the feet pivot), where the sprite hides the cap.
  // A feathered leading edge eliminates the visible rectangular cut seen in v0.7.9.3.
  const cx=actor.x+16*facing;
  const cy=actor.y-78;
  if(reset||comet.lastDeath!==deathCount||(dying&&!comet.wasDying)) {
    comet.points.length=0;
    if(comet.aura)comet.aura.clear();
    if(comet.soft)comet.soft.clear();
    if(comet.ribbon)comet.ribbon.clear();
  }
  comet.lastDeath=deathCount;
  comet.wasDying=!!dying;
  if(drawing&&Number.isFinite(cx)&&Number.isFinite(cy)) {
    const last=comet.points[comet.points.length-1];
    // Do not connect two places when respawning or teleporting.
    if(last&&Math.hypot(cx-last.x,cy-last.y)>110)comet.points.length=0;
    const recent=comet.points[comet.points.length-1];
    const dist=recent?Math.hypot(cx-recent.x,cy-recent.y):Infinity;
    if(!recent||dist>2.4||comet.time-recent.t>.025) {
      comet.points.push({x:cx,y:cy,t:comet.time,life:lifespan,power,dash});
    }
  }
  comet.points=comet.points.filter(p=>comet.time-p.t<p.life);
  if(comet.points.length>100)comet.points.splice(0,comet.points.length-100);
  if(!comet.graphicsOK)return;
  try {
    comet.aura.clear();
    comet.soft.clear();
    comet.ribbon.clear();
    if(comet.points.length<2)return;
    const path=comet.points.slice();
    const latest=path[path.length-1];
    if(drawing&&Math.hypot(cx-latest.x,cy-latest.y)>.4) {
      path.push({x:cx,y:cy,t:comet.time,life:lifespan,power,dash});
    }
    if(path.length<2)return;
    const curve=[];
    // Interpolated trajectory follows direction changes instead of drawing straight lasers.
    for(let i=0;i<path.length-1;i++) {
      const p0=path[Math.max(0,i-1)],p1=path[i],p2=path[i+1],p3=path[Math.min(path.length-1,i+2)];
      for(let j=0;j<2;j++) {
        const u=j/2,u2=u*u,u3=u2*u;
        const sm=k=>.5*((2*p1[k])+(-p0[k]+p2[k])*u+
          (2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*u2+
          (-p0[k]+3*p1[k]-3*p2[k]+p3[k])*u3);
        curve.push({x:sm('x'),y:sm('y'),t:p1.t+(p2.t-p1.t)*u,
          life:p1.life+(p2.life-p1.life)*u,power:p1.power+(p2.power-p1.power)*u});
      }
    }
    curve.push(path[path.length-1]);
    // Colors progress from pale yellow at the WHOLE BODY to orange and deep crimson at the tip.
    const stops=[
      {p:0,c:[255,249,191]},{p:.17,c:[255,219,100]},
      {p:.38,c:[255,148,50]},{p:.67,c:[244,65,57]},
      {p:1,c:[183,20,68]}
    ];
    const rgb=age=>{
      age=Math.max(0,Math.min(1,age));
      let k=1;while(k<stops.length-1&&age>stops[k].p)k++;
      const a=stops[k-1],b=stops[k],t=(age-a.p)/(b.p-a.p);
      const v=a.c.map((n,i)=>Math.round(n+(b.c[i]-n)*t));
      return (v[0]<<16)|(v[1]<<8)|v[2];
    };
    const info=[];
    for(let i=0;i<curve.length;i++) {
      const p=curve[i],prev=curve[Math.max(0,i-1)],next=curve[Math.min(curve.length-1,i+1)];
      const dx=next.x-prev.x,dy=next.y-prev.y,denom=Math.hypot(dx,dy)||1;
      let nx=-dy/denom,ny=dx/denom;
      // Keep the cross section oriented consistently through reversals/loops.
      if(info.length && nx*info[info.length-1].nx+ny*info[info.length-1].ny<0) {nx=-nx;ny=-ny;}
      const age=Math.max(0,Math.min(1,(comet.time-p.t)/Math.max(.08,p.life)));
      const fade=Math.pow(1-age,1.18);
      // Newest segment fades in BELOW the body instead of ending in a sharp vertical slab.
      const headU=Math.min(1,age/.085);
      const featheredHead=.14+.86*(headU*headU*(3-2*headU));
      // The broad shoulder covers 100–145 px of character silhouette, then narrows to a tip.
      // No circular sprites: every band is a continuous tapered mesh.
      const shoulder=.91+.09*Math.sin(Math.PI*Math.min(1,age/.56));
      const bodyHalfWidth=(43+30*p.power)*shoulder*Math.pow(1-age,.87);
      info.push({x:p.x,y:p.y,nx,ny,width:bodyHalfWidth,
        alpha:fade*featheredHead*(.57+.43*p.power),age});
    }
    // From diffuse outer bloom to dense gold core. Bands share identical broad geometry.
    const bands=[
      {gfx:comet.aura,  scale:1.98,opacity:.28,colorOffset:.13},
      {gfx:comet.soft,  scale:1.46,opacity:.31,colorOffset:.09},
      {gfx:comet.ribbon,scale:.94,opacity:.24,colorOffset:.05},
      {gfx:comet.ribbon,scale:.66,opacity:.32,colorOffset:-.02},
      {gfx:comet.ribbon,scale:.37,opacity:.38,colorOffset:-.10},
      {gfx:comet.ribbon,scale:.17,opacity:.36,colorOffset:-.15}
    ];
    for(const band of bands) {
      for(let i=0;i<info.length-1;i++) {
        const p=info[i],q=info[i+1];
        const opacity=band.opacity*(p.alpha+q.alpha)*.5;
        if(opacity<.007)continue;
        const pw=p.width*band.scale,qw=q.width*band.scale;
        const c=rgb((p.age+q.age)*.5+band.colorOffset);
        band.gfx.beginFill(c,opacity);
        band.gfx.drawPolygon([
          p.x+p.nx*pw,p.y+p.ny*pw,
          q.x+q.nx*qw,q.y+q.ny*qw,
          q.x-q.nx*qw,q.y-q.ny*qw,
          p.x-p.nx*pw,p.y-p.ny*pw
        ]);
        band.gfx.endFill();
      }
    }
  } catch(renderFailure) {
    // Visuals must never be able to stop gameplay.
    comet.error=true;comet.graphicsOK=false;
    if(comet.aura)comet.aura.clear();
    if(comet.soft)comet.soft.clear();
    if(comet.ribbon)comet.ribbon.clear();
  }
}

const actor0794=s;
updateSoftComet0794(runtimeScene,actor0794,dt,s.dead,s.dying,
  s.win,key('r'),16);
// 0.8.4d — five tiny ember pixels peel off the trail on jump/dash, bounce once on nearby
// colliders, settle, then fade. Purely visual, programmatic PIXI graphics — no gameplay effect.
function updateTrailSparks084d(runtimeScene, actor, dt, reset, dying, won){
  let fx=runtimeScene.__trailSparks084d;
  if(!fx){
    fx=runtimeScene.__trailSparks084d={list:[],g:null,lastDash:false,lastJump:false,ok:false};
    try{
      if(typeof PIXI!=='undefined'&&typeof PIXI.Graphics==='function'){
        const renderer=runtimeScene.getLayer('').getRenderer();
        if(renderer&&typeof renderer.addRendererObject==='function'){
          fx.g=new PIXI.Graphics();
          const additive=PIXI.BLEND_MODES&&PIXI.BLEND_MODES.ADD;
          if(additive!==undefined)fx.g.blendMode=additive;
          try{
            const Blur=PIXI.filters&&PIXI.filters.BlurFilter;
            if(Blur){const blur=new Blur(2,1);blur.padding=10;fx.g.filters=[blur];}
          }catch(_e){}
          renderer.addRendererObject(fx.g,16.6);
          fx.ok=true;
        }
      }
    }catch(_e){}
  }
  if(reset||dying||won){fx.list.length=0;if(fx.g)fx.g.clear();}
  const dashNow=(actor.dashTimer||0)>0.02;
  const jumpNow=!actor.grounded&&(actor.vy||0)<-55;
  const shouldBurst=(dashNow&&!fx.lastDash)||(jumpNow&&!fx.lastJump);
  if(shouldBurst){
    for(let i=0;i<5;i++){
      const ang=(-actor.facing||-1)*(1.95+Math.random()*0.42)+(Math.random()-.5)*0.48;
      const mag=90+Math.random()*115+Math.abs(actor.vx||0)*0.08;
      fx.list.push({
        x:actor.x-actor.facing*(12+Math.random()*10),
        y:actor.y-66+Math.random()*20,
        px:actor.x,py:actor.y,
        vx:Math.cos(ang)*mag,
        vy:-36-Math.random()*65+Math.sin(ang)*16,
        life:.85+Math.random()*.28,
        age:0,bounce:0,rest:false,restT:0,size:2+Math.floor(Math.random()*2)
      });
    }
  }
  fx.lastDash=dashNow; fx.lastJump=jumpNow;
  const plats=objects('Platform');
  const gravity=820;
  for(const p of fx.list){
    p.age+=dt; p.life-=dt*(p.rest?1.55:0.9);
    if(!p.rest){
      p.px=p.x; p.py=p.y;
      p.vy+=gravity*dt;
      p.x+=p.vx*dt; p.y+=p.vy*dt;
      for(const pl of plats){
        const left=pl.getX?pl.getX():0, top=pl.getY?pl.getY():0;
        const w=pl.getWidth?pl.getWidth():0, h=pl.getHeight?pl.getHeight():0;
        if(p.x>=left-2&&p.x<=left+w+2&&p.py<=top&&p.y>=top&&p.vy>0){
          p.y=top;
          if(p.bounce<1&&Math.abs(p.vy)>48){
            p.vy*=-0.24; p.vx*=0.58; p.bounce++;
          }else{
            p.rest=true; p.vx=0; p.vy=0; p.restT=0;
          }
          break;
        }
      }
    }else p.restT+=dt;
  }
  fx.list=fx.list.filter(p=>p.life>0&&p.age<1.55);
  if(!fx.ok||!fx.g)return;
  fx.g.clear();
  for(const p of fx.list){
    const fade=p.rest?Math.max(0,1-p.restT/0.55):Math.max(0,p.life/1.1);
    if(fade<=0.02)continue;
    fx.g.beginFill(0xff3b2f,0.24*fade);
    fx.g.drawRect(p.x-(p.size+2),p.y-(p.size+2),p.size+4,p.size+4);
    fx.g.endFill();
    fx.g.beginFill(0xff6a39,0.68*fade);
    fx.g.drawRect(p.x-p.size*.5,p.y-p.size*.5,p.size,p.size);
    fx.g.endFill();
  }
}
updateTrailSparks084d(runtimeScene,actor0794,dt,key('r'),s.dying,s.win);
const hud=(nm,str)=>{const obj=get(nm);if(obj&&obj.setString)obj.setString(str);};
const stageNames=['РОЗВІДКА','УВІМКНИ СВІТЛО','ТЕРИТОРІЯ РИБИ','НЕБЕЗПЕЧНИЙ СЕНСОР','ВИХІД'];
hud('HUDStatus','ГЛИБИНА   0.8.4d');
hud('HUDStage',String(s.stage+1).padStart(2,'0')+'/05 · '+stageNames[s.stage]);
hud('HUDSense',(s.inLightCover?'У СВІТЛІ · СХОВАНИЙ':'У ТЕМРЯВІ · ПОМІТНИЙ')+
  ' · РИБА: '+(s.fishState==='SLEEP'?'СОН':s.fishState==='STUN'?'ОГЛУШЕНА':s.fishState==='INVESTIGATE'?'НА ШУМ':
  s.fishState==='LUNGE'?'АТАКА':s.fishState==='CHASE'?'ПОГОНЯ':s.fishState==='ALERT'?'НАСТОРОЖЕНА':
  s.fishState==='SEARCH'?'ШУКАЄ':s.fishState==='RECOVER'?'ВІДНОВЛЕННЯ':'ПАТРУЛЬ'));
hud('HUDPuzzle','СЕНСОРИ '+(Number(s.sensorA)+Number(s.sensorB))+'/2  ·  '+(s.gateOpen?'ШЛЮЗ ВІДКРИТО':'ШЛЮЗ ЗАЧИНЕНО'));
const firstSafe=s.envLamps[0].on;
const entrySafe=s.envLamps[1].on;
const sensorSafe=s.envLamps[2].on;
const midSafe=s.envLamps[3].on;
let goal='';
if(s.dying)goal='СПАЛАХ ЗГАС · ПОВЕРНЕННЯ ДО КОНТРОЛЬНОЇ ТОЧКИ';
else if(s.win)goal='ГЛИБИНА ПРОЙДЕНА';
else if(['LUNGE','CHASE'].includes(s.fishState)&&!s.inLightCover)
  goal='НЕБЕЗПЕКА! БІЖИ ДО СВІТЛА · S У ВОДОРОСТЯХ · F КИНЬ ПРЕДМЕТ';
else if(s.x<930)goal='A/D РУХ · SPACE СТРИБОК · SHIFT БІГ · X РИВОК';
else if(s.x<1460&&!s.sensorA)goal='ПОПЕРЕДУ СТРУМ: ДОЧЕКАЙСЯ ПАУЗИ АБО ВЛУЧ У ЩИТ';
else if(!s.sensorA&&s.x<1940){
  if(!firstSafe)goal=s.carried?'F — КИНЬ ПРЕДМЕТ У ЛАМПУ':'E — ПІДБЕРИ ПРЕДМЕТ · F — УВІМКНИ ЛАМПУ';
  else goal=s.inLightCover?'ТИ СХОВАНИЙ · X — СПАЛАХ БІЛЯ СЕНСОРА A':'ЗАЙДИ У СВІТЛО, ПОТІМ АКТИВУЙ СЕНСОР A (X)';
}else if(s.x<2390){
  goal=entrySafe?'СВІТЛО ПОПЕРЕДУ: РИБА НЕ ПОМІЧАЄ ТЕБЕ ВСЕРЕДИНІ':'ПІДБЕРИ ПРЕДМЕТ · УВІМКНИ ЛАМПУ ПЕРЕД ЛІГВОМ';
}else if(s.x<3335){
  if(!entrySafe)goal='УВІМКНИ ПЕРШУ ЛАМПУ ЛІГВА · КИДОК F';
  else if(s.inLightCover)goal='ТУТ БЕЗПЕЧНО ВІД ПОГЛЯДУ РИБИ · ЧЕКАЙ ПАТРУЛЯ';
  else goal='ТЕМРЯВА: СХОВАЙСЯ В ЗАРОСТЯХ (S) АБО ОГЛУШИ РИБУ (F)';
}else if(s.x<3910){
  if(!midSafe)goal='ВАНТАЖ НАД ЛІГВОМ: ЗБИЙ ЙОГО АБО ПРОБЕРИСЬ ДО ЛАМПИ';
  else goal='ДРУГЕ СВІТЛОВЕ УКРИТТЯ · ПЕРЕХОДЬ ДО СЕНСОРА B';
}else if(!s.sensorB&&s.x<4570){
  if(!sensorSafe)goal='ПІДБЕРИ ПРЕДМЕТ · УВІМКНИ ЛАМПУ БІЛЯ СЕНСОРА B';
  else if(s.inLightCover)goal='СЕНСОР B: РИВОК X · ЕЛЕКТРОДУГА ВСЕ ЩЕ НЕБЕЗПЕЧНА';
  else goal='ЗАЙДИ У СВІТЛОВЕ КОЛО · АКТИВУЙ СЕНСОР B РИВКОМ';
}else if(s.gateOpen)goal='ШЛЮЗ ВІДКРИТО · ОМИНИ УЛАМКИ · ЗНАЙДИ МАЯЧОК';
else goal='ЩЕ ОДИН СЕНСОР НЕ АКТИВОВАНО · ПОВЕРНИСЯ ЛІВОРУЧ';
hud('HUDHint',s.worldMessageTimer>0?s.worldMessage:s.coverEntered?'У СВІТЛІ ТЕБЕ НЕ ВИДНО · РИБА ВТРАЧАЄ СЛІД':goal);
// World-space marker highlights only ONE interactable near the player; no intrusive giant HUD.
const marker=get('DepthMarker080');
if(marker){
  const points=[];
  if(s.carried===null){for(const p of s.pickups)if(!p.used)points.push({x:p.x,y:p.y-85,label:'E · ВЗЯТИ',r:180,p:0});}
  for(const l of s.envLamps)if(!l.on)points.push({x:l.x,y:l.y-125,label:'F · ЛАМПА',r:450,p:s.carried?0:2});
  if(!s.sensorA)points.push({x:1707,y:620,label:'X · СЕНСОР A',r:205,p:firstSafe?1:3});
  else if(!s.sensorB)points.push({x:4177,y:630,label:'X · СЕНСОР B',r:220,p:sensorSafe?1:3});
  const choice=points.filter(t=>Math.abs(s.x-t.x)<t.r&&Math.abs(s.y-95-t.y)<280)
    .sort((a,b)=>(a.p-b.p)||Math.abs(s.x-a.x)-Math.abs(s.x-b.x))[0];
  if(choice&&!s.dying&&!s.win){
    marker.setPosition(choice.x-61,choice.y-20);
    marker.setString(choice.label);
    marker.setOpacity(Math.round(195+60*(.5+.5*Math.sin(s.elapsed*3.2))));
  }else marker.setOpacity(0);
}
hud('HUDDeaths','ЗГАСАНЬ: '+s.dead);
const available=s.pickups.filter(p=>!p.used).length;
hud('HUDCarry',s.carried!==null?'У РУКАХ: '+({stone:'КАМІНЬ',bolt:'ГАЙКА',shell:'МУШЛЯ'}[s.carried])+'  ·  F КИНУТИ':
  'ПРЕДМЕТ: НЕМАЄ  ·  E ПІДІБРАТИ  ·  ЗНАХІДОК: '+available);
const pickupHelp=get('HUDAroundPickup');
const nearest=s.carried===null?s.pickups.filter(p=>!p.used&&Math.hypot(s.x-p.x,(s.y-33)-p.y)<114)
 .sort((a,b)=>Math.hypot(s.x-a.x,(s.y-33)-a.y)-Math.hypot(s.x-b.x,(s.y-33)-b.y))[0]:null;
if(pickupHelp){if(nearest){pickupHelp.setPosition(nearest.x-53,nearest.y-123);pickupHelp.setString('E · ВЗЯТИ');pickupHelp.setOpacity(255);}else pickupHelp.setOpacity(0);}
const names={stone:'Stone',bolt:'Bolt',shell:'Shell'};
for(const p of s.pickups){const o=get('ThrowPickup'+String(p.id+1));if(o)o.setOpacity(p.used?0:255);}
for(const [type,nm] of Object.entries(names)){
 const held=get('Carry'+nm),flying=get('Flying'+nm);
 if(held){if(s.carried===type&&!s.dying){held.setPosition(s.x+s.facing*18-20,s.y-91);held.setOpacity(255);if(held.setAngle)held.setAngle(-s.facing*13);}else held.setOpacity(0);}
 if(flying){if(s.projectile&&s.projectile.type===type){flying.setPosition(s.projectile.x-23,s.projectile.y-23);flying.setOpacity(255);if(flying.setAngle)flying.setAngle(s.projectile.rot);}else flying.setOpacity(0);}
}
const thrownRipple=get('ThrownRipple');if(thrownRipple){if(s.throwSplash){thrownRipple.setPosition(s.throwSplash.x-55,s.throwSplash.y-42);thrownRipple.setOpacity(Math.round(255*Math.min(1,s.throwSplash.t/.28)));}else thrownRipple.setOpacity(0);}
const stunnedFX=get('FishStunFX');if(stunnedFX){stunnedFX.setPosition(s.fishX-52,s.fishY-203);stunnedFX.setOpacity(s.fishStun>0?245:0);}
const warning=get('FishWarning');
if(warning){
  warning.setPosition(s.fishX-25,s.fishY-255);
  if(warning.setString)warning.setString(s.fishState==='STUN'?'✦':s.fishState==='LUNGE'?'!!':s.fishState==='CHASE'?'!':s.fishState==='ALERT'?'!':s.fishState==='INVESTIGATE'?'?':'');
  if(warning.setOpacity)warning.setOpacity(['STUN','INVESTIGATE','LUNGE','CHASE','ALERT'].includes(s.fishState)?255:0);
}
// Hazard art follows its fixed colliders; no alpha trick that hides active dangers.
const arcs=objects('HazardElectricArc');
for(let k=0;k<arcs.length;k++){
  const active=s.circuitTimers[k]<=0&&(s.elapsed+(k?1.65:0))%3.30<1.35;
  if(arcs[k].setOpacity)arcs[k].setOpacity(active?Math.round(220+35*(.5+.5*Math.sin(s.elapsed*22+k*3))):0);
}
// World-interactive watercolor sprites follow the same coordinate space as the player.
for(let k=0;k<s.envLamps.length;k++){
 const l=s.envLamps[k],on=objects('EnvLampOn')[k],off=objects('EnvLampOff')[k],pool=objects('EnvLampLightPool')[k];
 if(on)on.setOpacity(l.on?255:0);
 if(off)off.setOpacity(l.on?0:255);
 if(pool)pool.setOpacity(l.on?Math.round(192+32*Math.sin(s.elapsed*2.3+k)):0);
}
for(let k=0;k<s.envCargo.length;k++){
 const c=s.envCargo[k],sprite=objects('EnvCargo')[k];
 if(sprite){sprite.setPosition(c.x-70,c.y-170);sprite.setOpacity(255);
   if(sprite.setAngle)sprite.setAngle(c.delay>0?Math.sin(s.elapsed*45)*5:c.landed?8:0);}
}
for(let k=0;k<switchSpecs.length;k++){
 const active=s.circuitTimers[k]>0;
 const ready=objects('EnvSwitchReady')[k],off=objects('EnvSwitchDisabled')[k];
 if(ready)ready.setOpacity(active?0:255);
 if(off)off.setOpacity(active?255:0);
}
const ai=get('EnvAlarmIdle'),aa=get('EnvAlarmActive'),arc=get('EnvAlarmArc');
if(ai)ai.setOpacity(s.alarmTimer>0?0:255);
if(aa)aa.setOpacity(s.alarmTimer>0?255:0);
if(arc)arc.setOpacity(s.alarmTimer>0?255:0);
// 0.8.4b — painterly amber bloom and light shafts (visual only).
for(let j=0;j<s.envLamps.length;j++){
 const on=s.envLamps[j].on;
 const bloom=objects('FXLampBloom084')[j],shaft=objects('FXLampShaft084')[j];
 const pulse=0.97+0.03*Math.sin(s.elapsed*1.6+j*1.8);
 if(bloom&&bloom.setOpacity)bloom.setOpacity(on?Math.round(160*pulse):0);
 if(shaft&&shaft.setOpacity)shaft.setOpacity(on?Math.round(144*pulse):0);
}
const angGlow084=get('FXAnglerLureGlow084');
if(angGlow084){
 // Lure is hand-painted on the fish PNG; cold light is separate so no duplicate lure is rendered.
 const glowX=s.fishX-188,glowY=s.fishY-183;
 angGlow084.setPosition(glowX-80,glowY-80);
 angGlow084.setOpacity(s.fishStun>0?43:Math.round(75+15*Math.sin(s.elapsed*1.9)));
}
// Lightweight particle field anchored to screen (no gameplay interaction).
if(s.motes084On===undefined)s.motes084On=true;
if(s.motes084Held===undefined)s.motes084Held=false;
const motKey084=key('j');if(motKey084&&!s.motes084Held)s.motes084On=!s.motes084On;
s.motes084Held=motKey084;
if(!runtimeScene.__dust084){
 const ds={dots:[],g:null,error:''};runtimeScene.__dust084=ds;
 try{
  const lay=runtimeScene.getLayer('').getRenderer();
  if(typeof PIXI==='undefined'||!PIXI.Graphics||!lay||!lay.addRendererObject)throw new Error('Pixi graphics unavailable');
  ds.g=new PIXI.Graphics();lay.addRendererObject(ds.g,62);
  for(let i=0;i<92;i++)ds.dots.push({x:Math.random()*1280,y:Math.random()*720,vx:-4+Math.random()*10,vy:-8+Math.random()*11,r:.55+Math.random()*1.85,p:Math.random()*6.283,alpha:.08+Math.random()*.19});
 }catch(e){ds.error=String(e&&e.message||e);ds.g=null;}
}
const ds084=runtimeScene.__dust084;
if(ds084.g){
 ds084.g.clear();
 if(s.motes084On){
  const sx=s.cameraX-640,sy=360;
  for(const dot of ds084.dots){
   dot.x=(dot.x+dot.vx*dt+1280)%1280;dot.y=(dot.y+dot.vy*dt+720)%720;
   const fade=(.65+.35*Math.sin(s.elapsed*.78+dot.p));
   ds084.g.beginFill(0xb2d9e6,Math.max(.015,dot.alpha*fade));
   ds084.g.drawCircle(sx+dot.x,sy+dot.y,dot.r);ds084.g.endFill();
  }
 }
}

const impactFx=get('EnvImpact');
if(impactFx){if(s.worldHit){impactFx.setPosition(s.worldHit.x-85,s.worldHit.y-85);
  impactFx.setOpacity(Math.round(255*clamp(s.worldHit.t/.26,0,1)));}
  else impactFx.setOpacity(0);
}
const burst=get('DeathBurst');
if(burst){
  burst.setPosition(s.deathAtX-110,s.deathAtY-110);
  if(burst.setOpacity)burst.setOpacity(s.dying?Math.round(255*Math.min(1,s.deathTimer/.28)):0);
  if(burst.setScale)burst.setScale(s.dying?1.05+(1-s.deathTimer/.92)*.38:1);
}
hud('HUDDeath',s.dying?'СПАЛАХ ЗГАС · '+s.deathCause+'  ·  ПОВТОРНА СПРОБА...':'');
if(get('HUDDeath')?.setOpacity)get('HUDDeath').setOpacity(s.dying?255:0);

const victory=get('HUDVictory'),victorySub=get('HUDVictorySub'),restart=get('HUDRestart');
for(const obj of [victory,victorySub,restart])if(obj&&obj.setOpacity)obj.setOpacity(s.win?255:0);
if(s.win){hud('HUDVictory','ГЛИБИНА ПРОЙДЕНА');hud('HUDVictorySub','Я когось шукав...  Сигнал десь нижче.');}