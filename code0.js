gdjs.UnderwaterHarborCode = {};
gdjs.UnderwaterHarborCode.localVariables = [];
gdjs.UnderwaterHarborCode.idToCallbackMap = new Map();
gdjs.UnderwaterHarborCode.GDPlayerObjects1= [];
gdjs.UnderwaterHarborCode.GDBackgroundObjects1= [];
gdjs.UnderwaterHarborCode.GDPlatformObjects1= [];
gdjs.UnderwaterHarborCode.GDCrabObjects1= [];
gdjs.UnderwaterHarborCode.GDGlowObjects1= [];
gdjs.UnderwaterHarborCode.GDSensorObjects1= [];
gdjs.UnderwaterHarborCode.GDGateObjects1= [];
gdjs.UnderwaterHarborCode.GDBuoyObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDHintObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDStatusObjects1= [];
gdjs.UnderwaterHarborCode.GDWorldLightObjects1= [];
gdjs.UnderwaterHarborCode.GDFloorLightObjects1= [];
gdjs.UnderwaterHarborCode.GDTrailObjects1= [];
gdjs.UnderwaterHarborCode.GDPlatformLightObjects1= [];
gdjs.UnderwaterHarborCode.GDCrabLightObjects1= [];
gdjs.UnderwaterHarborCode.GDFogObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDSenseObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorPierLargeObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorPierRuinsObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorStoneAObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorStoneBObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorShipPieceObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorKelpAObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorKelpBObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorForegroundNetObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorBuoyLineObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorCrabPotObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorTrashAObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorTrashBObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorBottleObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDStageObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDVictoryObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDVictorySubObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDRestartObjects1= [];
gdjs.UnderwaterHarborCode.GDGoalGlowObjects1= [];
gdjs.UnderwaterHarborCode.GDDecorKelpCoverObjects1= [];
gdjs.UnderwaterHarborCode.GDBubbleFarObjects1= [];
gdjs.UnderwaterHarborCode.GDBubbleNearObjects1= [];
gdjs.UnderwaterHarborCode.GDSiltMoteObjects1= [];
gdjs.UnderwaterHarborCode.GDDashPulseObjects1= [];
gdjs.UnderwaterHarborCode.GDHUDSoundObjects1= [];
gdjs.UnderwaterHarborCode.GDParaWaterObjects1= [];
gdjs.UnderwaterHarborCode.GDParaWreckObjects1= [];
gdjs.UnderwaterHarborCode.GDParaPierObjects1= [];
gdjs.UnderwaterHarborCode.GDParaSeabedObjects1= [];
gdjs.UnderwaterHarborCode.GDParaNetObjects1= [];
gdjs.UnderwaterHarborCode.GDSensorHalo084iObjects1= [];


gdjs.UnderwaterHarborCode.userFunc0xde38e8 = function GDJSInlineCode(runtimeScene) {
// ПІСЛЯСВІТ 0.8.4k VISUAL POLISH · 0.6.6 — CHARACTER POLISH: gameplay preserved from 0.5; environment and audio are decorative
// Uses the integrated watercolor level art from v0.4; only visual presentation is refined.
if (!runtimeScene.__spalakhPrototype) {
/* ПІСЛЯСВІТ 0.5 — FIRST REAL LEVEL (preserved simulation)
   Pure physics/light/stealth simulation: frame-rate-independent, no engine calls.
   Player position is feet-center; x/y values use original prototype world units.
*/
var SpalakhSim = (function () {
  'use strict';
  const WORLD_W = 2560;
  const PLATFORMS = [
    {x:0,y:616,w:730,h:104},{x:817,y:616,w:528,h:104},
    {x:1455,y:616,w:558,h:104},{x:2110,y:616,w:450,h:104},
    {x:412,y:498,w:250,h:45},{x:1010,y:490,w:250,h:46},
    {x:1655,y:476,w:320,h:45},{x:2130,y:446,w:225,h:46}
  ];
  const CONFIG = Object.freeze({
    slowSpeed:68, walkSpeed:188, runSpeed:312,
    groundAccel:1420, airAccel:880, groundBrake:1900, airBrake:700,
    jumpVelocity:-500, gravityHold:740, gravityRelease:1360, gravityFall:1250,
    maxFall:750, jumpHoldMax:.18, coyoteTime:.105, jumpBufferTime:.13,
    dashSpeed:618, dashDuration:.145, dashCooldown:1.04,
    lightIdle:.065, lightRise:7.2, lightFade:2.5,
    sensorThreshold:.73
  });
  const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
// v0.8.4n: Directional beams; identical geometry for gameplay and renderer.
function stealthRigs084n(level){
 return level==='harbor'?
 [{x:1700,y:300,reach:425,spread:.23,phase:.3,rate:.78,sway:.66},
  {x:1985,y:280,reach:420,spread:.22,phase:2.1,rate:.69,sway:.61}]:
 [{x:2800,y:460,reach:510,spread:.24,phase:.45,rate:.74,sway:.62},
  {x:3485,y:455,reach:495,spread:.23,phase:2.5,rate:.63,sway:.63},
  {x:4160,y:450,reach:480,spread:.24,phase:4.2,rate:.79,sway:.57}];
}
function beamAngle084n(l,t){return Math.sin(t*l.rate+l.phase)*l.sway;}
function beamHit084n(l,x,y,t){
 const a=beamAngle084n(l,t),ux=Math.sin(a),uy=Math.cos(a),dx=x-l.x,dy=y-l.y;
 const f=dx*ux+dy*uy;if(f<=20||f>=l.reach)return 0;
 const side=Math.abs(dx*uy-dy*ux),half=12+f*l.spread;
 return Math.max(0,Math.min(1,(half-side)/(half*.66)))*
  Math.max(0,Math.min(1,(l.reach-f)/100))*Math.max(0,Math.min(1,(f-20)/90));
}
function beamField084n(ls,x,y,t){
 let n=0;for(const l of ls)n=Math.max(n,beamHit084n(l,x,y,t));return n;
}
const spotlights084n=stealthRigs084n('harbor');
  const approach=(n,target,rate)=>n+clamp(target-n,-rate,rate);
  const near=(a,b)=>Math.abs(a-b);
  function createState(){return {
    x:154,y:616,vx:0,vy:0,grounded:true,facing:1,dashFacing:1,
    brightness:CONFIG.lightIdle,lightState:'STEALTH',glowRadius:78,
    time:0,jumpHeld:false,jumpHoldTime:0,jumpBuffer:0,coyote:CONFIG.coyoteTime,
    dashHeld:false,dashTimer:0,dashCooldown:0,
    sensorOn:false,sensorProgress:0,sensorScanState:'OFF',relayOn:false,relayProgress:0,won:false,flash:0,deaths:0,checkpointX:154,gateBlocked:false,stage:0,respawnShield:0,camouflaged:false,beamExposure:0,inShadow:false,visibility:0,
    crabX:1690,crabY:616,crabV:45,crabPatrolDirection:1,crabState:'patrol',
    crabAlert:0,crabSearchTimer:0,crabLostTimer:0,crabLastSeenX:1690,
    crabDetectNoise:false,crabDetectLight:false,crabDetected:false,
    hint:'A/D — рух · SPACE — стрибок · S — тихо · X — ривок.',
    paused:false
  };}
  function resetPosition(s){
    s.x=s.checkpointX||154;s.y=616;s.vx=0;s.vy=0;s.grounded=true;s.facing=1;s.dashFacing=1;
    s.coyote=CONFIG.coyoteTime;s.jumpBuffer=0;s.jumpHoldTime=0;
    s.dashTimer=0;s.dashCooldown=.35;s.relayProgress=0;
    s.brightness=CONFIG.lightIdle;s.lightState='STEALTH';s.glowRadius=78;
    s.flash=.34;s.deaths++;s.respawnShield=1.10;
    if(!s.sensorOn){s.sensorProgress=0;s.sensorScanState='OFF';}
    s.crabX=1690;s.crabV=45;s.crabState='patrol';s.crabAlert=0;
    s.crabSearchTimer=0;s.crabLostTimer=0;
    s.crabDetectNoise=false;s.crabDetectLight=false;s.crabDetected=false;
    s.beamExposure=0;s.inShadow=false;s.visibility=0;s.camouflaged=false;
    s.hint='Спалах згас. Тепер спробуй пройти обережніше.';
  }
  function beginJump(s){
    s.vy=CONFIG.jumpVelocity;
    s.grounded=false;s.coyote=0;s.jumpBuffer=0;s.jumpHoldTime=0;
    s.flash=Math.max(s.flash,.20);
  }
  function step(s,input,dt,platforms){
    dt=clamp(Number.isFinite(dt)?dt:.016,0,.04);
    if(s.won || s.paused || dt<=0) return s;
    const P=platforms||PLATFORMS;
    s.time+=dt;
    s.respawnShield=Math.max(0,s.respawnShield-dt);
    s.flash=Math.max(0,s.flash-dt*1.65);
    s.dashTimer=Math.max(0,s.dashTimer-dt);
    s.dashCooldown=Math.max(0,s.dashCooldown-dt);
    const dir=(input.right?1:0)-(input.left?1:0);
    const sneak=!!input.down;
    if(dir!==0&&s.dashTimer<=0)s.facing=dir;

    // Buffer jump press so pressing before landing is forgiving.
    if(input.jump&&!s.jumpHeld)s.jumpBuffer=CONFIG.jumpBufferTime;
    else s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);
    if(s.grounded)s.coyote=CONFIG.coyoteTime;
    else s.coyote=Math.max(0,s.coyote-dt);
    const jumpAvailable=s.grounded||s.coyote>0;
    if(s.jumpBuffer>0&&jumpAvailable&&s.dashTimer<=0)beginJump(s);
    // A released jump shortens the rise, without changing the initial impulse.
    if(s.jumpHeld&&!input.jump&&s.vy< -135)s.vy*=.53;
    s.jumpHeld=!!input.jump;

    // Dash is an edge-triggered burst with a definite duration/cooldown.
    if(input.dash&&!s.dashHeld&&s.dashCooldown<=0){
      s.dashFacing=s.facing;
      s.dashTimer=CONFIG.dashDuration;
      s.dashCooldown=CONFIG.dashCooldown;
      s.flash=Math.max(s.flash,.39);
      s.vx=s.dashFacing*CONFIG.dashSpeed;
    }
    s.dashHeld=!!input.dash;
    if(s.dashTimer>0){
      s.vx=s.dashFacing*CONFIG.dashSpeed;
    }else{
      const target=dir*(sneak?CONFIG.slowSpeed:(input.boost?CONFIG.runSpeed:CONFIG.walkSpeed));
      const rate=(dir===0 ? (s.grounded?CONFIG.groundBrake:CONFIG.airBrake):
        (s.grounded?CONFIG.groundAccel:CONFIG.airAccel));
      s.vx=approach(s.vx,target,rate*dt);
    }

    if(!s.grounded || s.vy!==0){
      if(s.vy<0){
        if(input.jump && s.jumpHoldTime<CONFIG.jumpHoldMax){
          s.jumpHoldTime+=dt;
          s.vy+=CONFIG.gravityHold*dt;
        }else s.vy+=CONFIG.gravityRelease*dt;
      }else s.vy+=CONFIG.gravityFall*dt;
      s.vy=clamp(s.vy,-650,CONFIG.maxFall);
    }
    const oldFeetY=s.y;
    const oldX=s.x;
    s.x=clamp(s.x+s.vx*dt,22,WORLD_W-22);
    // Locked gate is a real wall, not just a graphic.
    s.gateBlocked=false;
    if(!s.sensorOn && oldX<=2222 && s.x>2222){s.x=2222;s.vx=0;s.gateBlocked=true;}
    if(!s.sensorOn && s.x>=2222 && dir>0){s.x=2222;s.vx=0;s.gateBlocked=true;}
    s.y+=s.vy*dt;
    let landed=false;
    for(const p of P){
      if(s.vy>=0 && oldFeetY<=p.y+6 && s.y>=p.y && s.x+15>p.x && s.x-15<p.x+p.w){
        s.y=p.y;s.vy=0;landed=true;break;
      }
    }
    s.grounded=landed;
    if(landed){
      s.coyote=CONFIG.coyoteTime;
      if(s.jumpBuffer>0 && s.dashTimer<=0)beginJump(s);
    }
    if(s.y>810)resetPosition(s);

    // Light is continuous, not a boolean; sneaking has a lower target because
    // movement is slower. Dash and jumping briefly produce an optical pulse.
    const physicalSpeed=near(s.vx,0);
    let target=CONFIG.lightIdle+Math.pow(clamp(physicalSpeed/CONFIG.runSpeed,0,1),1.42)*.76;
    if(sneak)target=Math.min(.19,target);
    if(s.dashTimer>0)target=1;
    if(s.flash>0)target=Math.max(target,.32+s.flash*.82);
    target=clamp(target,CONFIG.lightIdle,1);
    const response=target>s.brightness?CONFIG.lightRise:CONFIG.lightFade;
    s.brightness=clamp(s.brightness+(target-s.brightness)*(1-Math.exp(-response*dt)),CONFIG.lightIdle,1);
    s.lightState=s.brightness<.22?'STEALTH':s.brightness<.72?'VISIBLE':'FLARE';
    s.glowRadius=78+350*s.brightness;

    // The crab is a first test creature: footsteps trigger vibrations, while
    // strong light can betray the player even if nearly motionless.
    const dx=s.x-s.crabX, vertical=near(s.y,s.crabY);
    const audibleRange=(s.dashTimer>0?305:(sneak?0:(physicalSpeed>245?250:172)));
    const noise=audibleRange>0 && near(dx,0)<audibleRange && vertical<100 && physicalSpeed>92;
    // 0.8.4k: old searchlights have no rendering or invisible detection volumes.
    s.beamExposure=0;
    s.inShadow=s.grounded&&s.y>480&&((s.x>1510&&s.x<1900)||(s.x>1160&&s.x<1280));
    s.camouflaged=s.inShadow&&sneak&&s.brightness<.35&&physicalSpeed<95&&s.dashTimer<=0;
    s.visibility=clamp(s.brightness*.81+s.beamExposure*(.45+.27*s.brightness)+
      (s.dashTimer>0?.23:0)-(s.inShadow?.21:0),0,1);
    if(s.camouflaged)s.visibility=Math.min(s.visibility,.09);
    const lightRadius=105+s.visibility*380;
    const seen=!s.camouflaged&&s.visibility>.25&&
      Math.hypot(dx,(s.y-110)-(s.crabY-64))<lightRadius;
    s.crabDetectNoise=noise;
    s.crabDetectLight=seen;
    s.crabDetected=noise||seen;
    if(s.crabDetected){
      const gain=Math.max(noise?(1.05+physicalSpeed/460):0,seen?(.7+s.visibility*1.8+s.beamExposure*.32):0);
      s.crabAlert=clamp(s.crabAlert+gain*dt,0,1.3);
      s.crabLastSeenX=s.x;
      s.crabLostTimer=0;
    }else{
      s.crabLostTimer+=dt;
      s.crabAlert=clamp(s.crabAlert-(s.crabState==='chase'?.25:.43)*dt,0,1.3);
    }
    if(s.crabAlert>=.77 && s.crabDetected){
      s.crabState='chase';s.crabSearchTimer=1.15;
    }else if(s.crabState==='chase' && s.crabLostTimer>.75){
      s.crabState='search';s.crabSearchTimer=1.4;
    }else if(s.crabState==='search'){
      s.crabSearchTimer=Math.max(0,s.crabSearchTimer-dt);
      if(s.crabDetected && s.crabAlert>.45)s.crabState='alert';
      else if(s.crabSearchTimer<=0 && s.crabAlert<.25)s.crabState='patrol';
    }else if(s.crabState!=='chase'){
      s.crabState=s.crabAlert>=.25?'alert':'patrol';
    }
    if(s.crabState==='chase'){
      s.crabV=Math.sign(s.crabLastSeenX-s.crabX||s.crabPatrolDirection)*142;
    }else if(s.crabState==='search'){
      s.crabV=Math.sign(s.crabLastSeenX-s.crabX||s.crabPatrolDirection)*60;
    }else if(s.crabState==='alert'){
      s.crabV=Math.sign(s.crabLastSeenX-s.crabX||s.crabPatrolDirection)*58;
    }else{
      if(s.crabX<=1590)s.crabPatrolDirection=1;
      if(s.crabX>=1780)s.crabPatrolDirection=-1;
      s.crabV=43*s.crabPatrolDirection;
    }
    s.crabX=clamp(s.crabX+s.crabV*dt,1530,1875);
    if(s.crabX===1530||s.crabX===1875)s.crabPatrolDirection=s.crabX===1530?1:-1;
    // Kelp camouflage: when dark and crouched, the crab cannot catch Spalakh.
    if(near(s.x,s.crabX)<41&&near(s.y,s.crabY)<64&&!s.camouflaged&&s.respawnShield<=0)resetPosition(s);

    // 0.8.4i LIGHT READOUT: react to Spalakh's actual brightness, not mere proximity.
    // Charge lasts about 0.52 s under sustained bright motion; dash light lingers briefly.
    // The sensor clearly displays OFF (red), SCAN (amber blinking), ON (green).
    if(!s.sensorOn){
      const distance=Math.hypot(s.x-1055,(s.y-110)-476);
      const energy=s.brightness+(s.dashTimer>0?.25:0)+(s.flash>.16?.10:0);
      if(distance<155&&energy>=.49){
        s.sensorProgress=Math.min(.52,s.sensorProgress+dt*(energy>.81?1.30:1.0));
      }else s.sensorProgress=Math.max(0,s.sensorProgress-dt*.45);
      s.sensorScanState=s.sensorProgress>.025?'SCAN':'OFF';
      if(s.sensorProgress>=.52){
        s.sensorOn=true;s.sensorScanState='ON';s.flash=.6;
        s.hint='СЕНСОР АКТИВОВАНО · ЗЕЛЕНИЙ СИГНАЛ! Далі краб.';
      }
     }else s.sensorScanState='ON';
    // 0.8.4k: extra relay removed; the primary sensor opens the route.
    // Checkpoint after opening the sensor, before the crab. The player does not
    // need to replay the introduction after a failed stealth attempt.
    if(s.sensorOn && s.x>1490)s.checkpointX=1490;
    if(s.sensorOn && s.x>2115)s.checkpointX=2115;
    if(s.sensorOn && s.x>2430 && s.y>365){
      s.won=true;s.stage=5;
      s.hint='Перший сигнал знайдено! Відпусти SPACE та натисни ще раз, щоб спуститися в Глибину.';
    }
    if(!s.won){
      // Stage progression; hint priority follows the current gameplay objective.
      if(s.x<510)s.stage=0;
      else if(!s.sensorOn)s.stage=1;
      else if(s.x<1970)s.stage=2;
      else if(s.x<2310)s.stage=3;
      else s.stage=4;
      if(s.gateBlocked)s.hint='ШЛЮЗ: ОСВІТЛИ ОСНОВНИЙ СЕНСОР, ЩОБ ВІДКРИТИ ПРОХІД.';
      else if(s.crabState==='chase' && s.x>1330 && s.x<1980)s.hint='КРАБ ПОМІТИВ СВІТЛО! Сховайся або тікай.';
      else if(s.stage===0)s.hint='A/D — рух · SPACE — стрибок · S — тихо · X — ривок.';
      else if(s.stage===1)s.hint=s.sensorScanState==='SCAN'?('СЕНСОР ЗЧИТУЄ СЯЙВО · '+Math.round(s.sensorProgress/.52*100)+'% · НЕ ЗГАСАЙ'):('СЕНСОР ЧЕРВОНИЙ · ПІДБІЖИ АБО ЗРОБИ РИВОК X, ЩОБ ЙОГО ОСВІТИТИ');
      else if(s.stage===2)s.hint='Завмри, щоб згаснути. Потім S — тихо крізь водорості повз краба.';
      else if(s.stage===3)s.hint='Шлюз відкритий. Рухайся до аварійного буя.';
      else s.hint='Підійди до буя. Сигнал може привести до джерела світла.';
    }
    return s;
  }
  return {WORLD_W,PLATFORMS,CONFIG,createState,resetPosition,step,stealthRigs084n,beamAngle084n,beamHit084n,beamField084n};
})();


  runtimeScene.__spalakhPrototype = {
    sim:SpalakhSim, state:SpalakhSim.createState(), cameraX:640,
    landingTimer:0, priorGrounded:true, lightSmooth:.08,
    bodyVisibility:0, lastBodyTint:-1,
    trailHistory:[], trailAcc:0, animName:'Idle', lastDeaths:0
  };
}
const run = runtimeScene.__spalakhPrototype;

// v0.6: atmosphere state is independent of the saved gameplay state.
if (!run.atmos) run.atmos = {
  elapsed:0, muted:false, lastMuteDown:false, audioStarted:false,
  lastDash:0, lastCrab:'patrol', lastSensor:false, lastWin:false,
  nextCreak:6.5, creakCounter:0, decorBase:null, netBase:null,
  ringAge:99, ringX:0, ringY:0
};
const atmo=run.atmos;

const pressed = key => gdjs.evtTools.input.isKeyPressed(runtimeScene,key);
const input = {
  left:pressed('Left')||pressed('a'), right:pressed('Right')||pressed('d'),
  down:pressed('Down')||pressed('s'), jump:pressed('Space')||pressed('Up')||pressed('w'),
  boost:pressed('LShift')||pressed('Shift'), dash:pressed('x')||pressed('k')
};
if(pressed('r')) {
  run.state=run.sim.createState();run.landingTimer=0;run.trailHistory=[];
  run.trailAcc=0;run.priorGrounded=true;run.lightSmooth=.08;run.lastDeaths=0;run.bodyVisibility=0;run.lastBodyTint=-1;run.transitionSpaceArmed=false;run.transitionStarted=false;run._dashVisualRemaining=0;run._dashVisualWasActive=false;run.idleElapsed084o=0;
}
const a=run.state;
const delta=Math.max(0,Math.min(.04,gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)));
const platforms=runtimeScene.getObjects('Platform');
const rects=platforms.map(p=>({x:p.getX(),y:p.getY(),w:p.getWidth(),h:p.getHeight()}));
// 0.8.4m — moving mechanical bridges. Adds only explicit ride motion,
// without changing acceleration, gravity, jump buffering or collision geometry.
function puzzleDeckStep084m(actor,decks,clock,active) {
  for(const deck of decks) {
    const wasActive=!!deck.active,oldX=deck.x,oldY=deck.y;
    deck.active=!!active;
    if(!deck.active)continue;
    const phase=clock*deck.rate+deck.phase;
    deck.x=deck.baseX+deck.dx*Math.sin(phase);
    deck.y=deck.baseY+deck.dy*Math.cos(phase*.77);
    // Carry only when the player's feet were already resting on this deck.
    if(wasActive && actor.grounded && Math.abs(actor.y-oldY)<3.5 &&
       actor.x+15>oldX && actor.x-15<oldX+deck.w) {
      actor.x+=deck.x-oldX;actor.y+=deck.y-oldY;
    }
  }
}

const puzzle084m=(run.puzzle084m ||= {decks:[
  {id:'signalBridge',baseX:1355,baseY:574,dx:39,dy:13,w:108,rate:.90,phase:0,x:1355,y:587,active:false},
  {id:'relayBridge',baseX:2020,baseY:574,dx:27,dy:9,w:106,rate:1.06,phase:1.4,x:2047,y:578,active:false}
]});
puzzleDeckStep084m(a,puzzle084m.decks.slice(0,1),a.time+delta,a.sensorOn);
puzzleDeckStep084m(a,puzzle084m.decks.slice(1),a.time+delta,a.sensorOn);
for(const deck of puzzle084m.decks)if(deck.active)rects.push({x:deck.x,y:deck.y,w:deck.w,h:18});

// Visual polish: collision platforms stay for physics, but become invisible in the scene.
for(const p of platforms){ if(p.setOpacity)p.setOpacity(0); }
// 0.8.4k: approved decorative PNGs are preserved, not replaced.
// Make each visual platform from uniformly scaled natural endcaps and tiled middle.
function updatePlatformWrappers084k(scene){
  if(typeof PIXI==='undefined'||!PIXI.Texture||!PIXI.Sprite||!PIXI.TilingSprite||!PIXI.Container)return;
  const renderer=scene.getLayer('')?.getRenderer();
  if(!renderer||!renderer.addRendererObject)return;
  const cache=scene.__platformWrap084k ||= {items:[],failed:{}};
  for(const name of ['DecorPierLarge','DecorPierRuins','DecorStoneA','DecorStoneB']){
    for(const object of scene.getObjects(name)){
      const old=cache.items.find(e=>e.object===object);
      if(old){
        if(object.setOpacity)object.setOpacity(0);
        old.container.position.set(object.getX(),object.getY());
        continue;
      }
      const key=name+'@'+object.getX()+':'+object.getY();
      if(cache.failed[key])continue;
      try{
        const texture=object.getRendererObject?.()?.texture;
        if(!texture?.baseTexture||!texture.frame||texture.rotate)continue;
        const frame=texture.frame,srcW=Math.floor(frame.width),srcH=Math.floor(frame.height);
        const width=object.getWidth(),height=object.getHeight();
        if(srcW<12||srcH<12||width<20||height<20)continue;
        const scale=height/srcH;  // uniform X/Y scale, never force-fit source width
        const capPixels=Math.max(2,Math.min(Math.floor(srcW*.22),
          Math.floor(width*.27/scale),Math.floor((srcW-4)/3)));
        const capW=capPixels*scale,middleW=width-2*capW;
        if(middleW<2)continue;
        const fragment=(sx,sw)=>new PIXI.Texture(texture.baseTexture,
          new PIXI.Rectangle(frame.x+sx,frame.y,sw,srcH));
        const left=new PIXI.Sprite(fragment(0,capPixels));
        left.scale.set(scale);left.position.set(0,0);
        const mid=new PIXI.TilingSprite(fragment(capPixels,srcW-2*capPixels),middleW,height);
        mid.tileScale.set(scale,scale);mid.position.set(capW,0);
        const right=new PIXI.Sprite(fragment(srcW-capPixels,capPixels));
        right.scale.set(scale);right.position.set(width-capW,0);
        const container=new PIXI.Container();
        container.addChild(mid,left,right);
        container.position.set(object.getX(),object.getY());
        renderer.addRendererObject(container,object.getZOrder()+.08);
        cache.items.push({object,container});
        if(object.setOpacity)object.setOpacity(0);
      }catch(_error){
        // Safe fallback for unavailable Pixi texture: retain original source art.
        cache.failed[key]=true;
      }
    }
  }
}
updatePlatformWrappers084k(runtimeScene);
// Push the existing watercolor harbor backdrop into depth, without repainting the original image.
const back=runtimeScene.getObjects('Background')[0];
if(back&&back.setOpacity)back.setOpacity(139);
// Secondary props sit below the foreground focal point in value/contrast.
for(const name of ['DecorTrashA','DecorTrashB','DecorBottle','DecorBuoyLine']){
  for(const piece of runtimeScene.getObjects(name))if(piece.setOpacity)piece.setOpacity(200);
}
const coverKelp=runtimeScene.getObjects('DecorKelpCover')[0];
if(coverKelp&&coverKelp.setOpacity)coverKelp.setOpacity(120);
const fgNet=runtimeScene.getObjects('DecorForegroundNet')[0];
if(fgNet){ if(fgNet.setOpacity)fgNet.setOpacity(255); }

// Snapshot the existing game state. No physics/collision/detection values are touched.
const beforeAtmos={grounded:a.grounded,dashTimer:a.dashTimer,sensorOn:a.sensorOn,crabState:a.crabState,won:a.won,deaths:a.deaths};
const muteDown=pressed('m')||pressed('M');
if(muteDown&&!atmo.lastMuteDown)atmo.muted=!atmo.muted;
atmo.lastMuteDown=muteDown;
atmo.elapsed+=delta;

// 0.8.4l — movement polish: visual-only inertia, eased silhouettes and landing ripples.
// Never changes physics coordinates, collision sizes, velocity, coyote time or jump buffering.
function polishGait084l(state, speed) {
  const previous=state._motionGait084l||'Idle';
  const gait=(speed>237||(previous==='Run'&&speed>190))?'Run':
    (speed>42||(previous!=='Idle'&&speed>23))?'Slow':'Idle';
  state._motionGait084l=gait;
  return gait;
}
function polishMovement084l(scene, actor, dt, animation, inactive, deathCount) {
  let fx=scene.__movementPolish084l;
  if(!fx){
    fx=scene.__movementPolish084l={
      previousGrounded:!!actor.grounded,previousVy:actor.vy||0,previousX:actor.x,
      lastDeath:deathCount, smoothVx:actor.vx||0, landPulse:0, takeoffPulse:0,
      rings:[],flecks:[],graphics:null
    };
    // Use the same GDevelop world-layer graphics API as the existing trail/sparks.
    try {
      const renderer=scene.getLayer('').getRenderer();
      if(typeof PIXI!=='undefined' && PIXI.Graphics && renderer && renderer.addRendererObject){
        fx.graphics=new PIXI.Graphics();
        renderer.addRendererObject(fx.graphics,18.65);
      }
    } catch(ignoreGraphics) { fx.graphics=null; }
  }
  dt=Math.max(0,Math.min(.04,Number.isFinite(dt)?dt:0));
  const clamp084=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  const reset=!!inactive||fx.lastDeath!==deathCount||
    Math.abs((fx.previousX===undefined?actor.x:fx.previousX)-actor.x)>145;
  if(reset){
    fx.landPulse=0;fx.takeoffPulse=0;fx.smoothVx=actor.vx||0;
    fx.rings.length=0;fx.flecks.length=0;
    if(fx.graphics)fx.graphics.clear();
  } else {
    const touchDown=!fx.previousGrounded&&!!actor.grounded;
    const takeoff=fx.previousGrounded&&!actor.grounded&&actor.vy< -45;
    if(touchDown){
      const impact=clamp084((Math.max(0,fx.previousVy)-155)/480,.38,1);
      fx.landPulse=.72+.28*impact;
      fx.rings.push({x:actor.x,y:actor.y,age:0,power:impact});
      // A few tiny glowing particles, under the body, at the contact point.
      for(let j=0;j<6;j++)fx.flecks.push({
        x:actor.x+(j-2.5)*2,y:actor.y-5, vx:(j-2.5)*(27+impact*12),
        vy:-59-(j%3)*17,age:0
      });
    }
    if(takeoff)fx.takeoffPulse=1;
    fx.landPulse=Math.max(0,fx.landPulse-dt*3.4);
    fx.takeoffPulse=Math.max(0,fx.takeoffPulse-dt*6.7);
    fx.smoothVx+=((actor.vx||0)-fx.smoothVx)*(1-Math.exp(-dt*11));
    for(const ring of fx.rings)ring.age+=dt;
    fx.rings=fx.rings.filter(r=>r.age<.34);
    for(const f of fx.flecks){
      f.age+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=210*dt;
    }
    fx.flecks=fx.flecks.filter(f=>f.age<.28);
  }
  fx.previousGrounded=!!actor.grounded;
  fx.previousVy=actor.vy||0;
  fx.previousX=actor.x;
  fx.lastDeath=deathCount;
  const velocityGap=fx.smoothVx-(actor.vx||0);
  // Maximum 4 world pixels of visual lag; logical feet and collision remain exact.
  const offsetX=clamp084(velocityGap*.019,-4,4);
  const inertia=actor.grounded?Math.min(1,Math.abs(velocityGap)/320):0;
  const scaleX=1+.027*fx.landPulse-.012*fx.takeoffPulse+.006*inertia;
  const scaleY=1-.053*fx.landPulse+.028*fx.takeoffPulse-.003*inertia;
  if(fx.graphics){
    try{
      fx.graphics.clear();
      for(const ring of fx.rings){
        const t=ring.age/.34, fade=(1-t)*(1-t);
        fx.graphics.lineStyle(1.5+ring.power*1.1,0xffae65,.42*fade);
        fx.graphics.drawEllipse(ring.x,ring.y-2,7+t*56,1.5+t*11);
        fx.graphics.lineStyle(1,0xf67149,.17*fade);
        fx.graphics.drawEllipse(ring.x,ring.y-2,3+t*38,1+t*6);
      }
      for(const f of fx.flecks){
        const fade=Math.max(0,1-f.age/.28);
        fx.graphics.beginFill(0xff9d67,.33*fade);
        fx.graphics.drawCircle(f.x,f.y,1.5);
        fx.graphics.endFill();
      }
    }catch(ignoreVisualError){try{fx.graphics.clear();}catch(ignoreClear){}}
  }
  return {scaleX,scaleY,offsetX};
}

const previousGrounded=a.grounded;
run.sim.step(a,input,delta,rects.length ? rects : undefined);
if(a.deaths!==run.lastDeaths){run.trailHistory=[];run.trailAcc=0;run.bodyVisibility=0;run.lastBodyTint=-1;run.lastDeaths=a.deaths;}
if(!previousGrounded && a.grounded && a.vy===0)run.landingTimer=.40;
run.landingTimer=Math.max(0,run.landingTimer-delta);
// 0.2 light motion: independent inertia, slower dimming than ignition.
const heatTarget=Math.max(.05,Math.min(1,a.brightness));
const smoothing=heatTarget>run.lightSmooth?7.0:2.5;
run.lightSmooth+=(heatTarget-run.lightSmooth)*(1-Math.exp(-smoothing*delta));
const heat=Math.min(1,Math.max(.05,run.lightSmooth));
const rhythm=Math.sin(a.time*8.2);
// No body-size oscillation. Only flame-tendril pixels change across frames.
const speed=Math.abs(a.vx);
// Animation priority: dash / aerial / land / sneak / run / walk / idle.
// Visual-only dash tail: finish the six-frame animation without changing dash physics.
if(a.dashTimer>0 && !run._dashVisualWasActive)run._dashVisualRemaining=.18;
else run._dashVisualRemaining=Math.max(0,(run._dashVisualRemaining||0)-delta);
run._dashVisualWasActive=a.dashTimer>0;
// Speed hysteresis prevents Idle / Slow / Run flicker at threshold velocities.
const gait084l=polishGait084l(run,speed);
// Keep Jump at the apex for a few milliseconds; walking off an edge starts with Fall.
if(a.vy< -55)run._airAscended084l=true;
if(a.grounded)run._airAscended084l=false;
const airPose084l=(a.vy<0||(run._airAscended084l&&a.vy<35))?'Jump':'Fall';
let anim=(a.dashTimer>0||run._dashVisualRemaining>0)?'Dash':(!a.grounded?airPose084l:
  (run.landingTimer>0?'Land':(input.down?'Crouch':gait084l)));
// 0.8.4o: each Idle cycle is 4s. Freeze frame 0 for exactly 2s;
// then play frames 1–15 at 0.12s per frame, holding the last through the cycle end.
function idleFrame084o(time) {
  const phase=((time%4)+4)%4;
  return phase<2?0:Math.min(15,1+Math.floor((phase-2)/.12));
}
const pl=runtimeScene.getObjects('Player')[0];
const movementVisual084l=polishMovement084l(runtimeScene,a,delta,anim,pressed('r')||a.won,a.deaths);
if(pl){
  // Only switch animation when the state changes: do not restart it on every tick.
  if(run._renderAnimation!==anim){
    if(pl.setAnimationName)pl.setAnimationName(anim);
    run._renderAnimation=anim;
  }
  if(pl.setAnimationSpeedScale)pl.setAnimationSpeedScale(anim==='Run'?Math.max(.6,Math.min(1.45,speed/310)):(anim==='Slow'?Math.max(.7,Math.min(1.2,speed/150)):1));
  // Manual Idle timing applies only while standing: no change to other animations.
  if(anim==='Idle'){
    run.idleElapsed084o=((run.idleElapsed084o||0)+delta)%4;
    if(pl.setAnimationFrame){
      const targetFrame084o=idleFrame084o(run.idleElapsed084o);
      if(!pl.getAnimationFrame||pl.getAnimationFrame()!==targetFrame084o)pl.setAnimationFrame(targetFrame084o);
    }
  }else run.idleElapsed084o=0;
  // 0.8.4e: feet are y242 in EVERY normalised RGBA frame, on the 384x256 canvas.
  // Render position does not change with animation; logical collision foot = a.y.
  const PLAYER_RENDER_SCALE=.60;
  const renderScaleX084l=PLAYER_RENDER_SCALE*movementVisual084l.scaleX;
  const renderScaleY084l=PLAYER_RENDER_SCALE*movementVisual084l.scaleY;
  if(pl.setScale)pl.setScale(PLAYER_RENDER_SCALE);
  if(pl.setScaleX&&pl.setScaleY){
    pl.setScaleX(renderScaleX084l);pl.setScaleY(renderScaleY084l);
  }
  const pivotScaleX084l=(pl.setScaleX&&pl.setScaleY)?renderScaleX084l:PLAYER_RENDER_SCALE;
  const pivotScaleY084l=(pl.setScaleX&&pl.setScaleY)?renderScaleY084l:PLAYER_RENDER_SCALE;
  pl.setPosition(a.x-192*pivotScaleX084l+movementVisual084l.offsetX,a.y-242*pivotScaleY084l);
  if(pl.flipX)pl.flipX(a.facing<0);
  // v0.8.0: exactly ~4 seconds to dim after stillness, then subtle breathing light.
  // Body tint/opacity only: no change to brightness, physics, sensor logic or stealth.
  const motion=Math.max(Math.min(1,speed/188),a.dashTimer>0?1:0,a.grounded?0:.68);
  const still=motion<.045;
  if(still) run.bodyVisibility=Math.max(0,run.bodyVisibility-delta/4.0);
  else run.bodyVisibility+=(motion-run.bodyVisibility)*(1-Math.exp(-9.2*delta));
  const visible=Math.max(0,Math.min(1,run.bodyVisibility));
  // The very subtle 3.6s pulse starts only AFTER reaching the final resting opacity.
  run.restPulseTimer=(still&&visible<.002)?(run.restPulseTimer||0)+delta:0;
  const pulseRamp=Math.min(1,run.restPulseTimer/.65);
  const breathing=pulseRamp*(.5+.5*Math.sin(run.restPulseTimer*(2*Math.PI/3.6)));
  // 50% body opacity when motionless, regardless of the older four-second dim cycle.
  const stopped084o=a.grounded&&speed<9&&a.dashTimer<=0;
  if(pl.setOpacity)pl.setOpacity(stopped084o?128:Math.max(128,Math.round(78+177*visible+14*breathing)));
  const tint=Math.min(255,Math.round((135+120*visible+11*breathing)/5)*5);
  if(pl.setColor&&run.lastBodyTint!==tint){pl.setColor(tint+';'+tint+';'+tint);run.lastBodyTint=tint;}
  // Only brief takeoff/landing squash is applied; breathing never changes collision geometry.
}
// Player halo: centered near the yellow glowing head rather than at the feet.
const halo=runtimeScene.getObjects('Glow')[0];
if(halo){
  halo.setPosition(a.x-205,a.y-319);
  if(halo.setOpacity)halo.setOpacity(10+135*heat);
  if(halo.setScale)halo.setScale(.48+heat*.36+rhythm*.008);
}
// Worldlight and pool are soft, painterly light-projections. They illuminate
// watercolor visually without requiring fragile shader/lighting extensions.
const wl=runtimeScene.getObjects('WorldLight')[0];
if(wl){
  if(wl.setPosition)wl.setPosition(a.x-318,a.y-321);
  if(wl.setOpacity)wl.setOpacity(8+135*heat);
  if(wl.setScale)wl.setScale(.58+heat*.38);
}
const pool=runtimeScene.getObjects('FloorLight')[0];
if(pool){
  pool.setPosition(a.x-272,a.y-47);
  if(pool.setOpacity)pool.setOpacity(a.grounded?(14+140*heat):(10+82*heat));
  if(pool.setScaleX)pool.setScaleX(.60+heat*.46);
}
// 0.8.4p — WARM FAIRY FEET AURA (visual only).
// Separate pink-red bloom under the sprite; does not affect stealth illumination,
// collision, movement, light sensors, the original FloorLight or animation opacity.
function updateFairyFeetGlow084p(scene,actor,t,behindZ,inactive,visualOffsetX) {
  let fx=scene.__fairyFeetGlow084p;
  if(!fx){
    fx=scene.__fairyFeetGlow084p={bloom:null,sparks:null};
    try{
      const renderer=scene.getLayer('').getRenderer();
      if(typeof PIXI==='undefined'||!PIXI.Graphics||!renderer||!renderer.addRendererObject)
        throw new Error('PIXI renderer unavailable');
      fx.bloom=new PIXI.Graphics();
      fx.sparks=new PIXI.Graphics();
      if(PIXI.BLEND_MODES&&PIXI.BLEND_MODES.ADD!==undefined)
        fx.bloom.blendMode=PIXI.BLEND_MODES.ADD;
      try{
        const Blur=PIXI.filters&&PIXI.filters.BlurFilter;
        if(Blur){
          const soft=new Blur(13,3);
          soft.padding=65; // Avoid hard clipping around the feet.
          fx.bloom.filters=[soft];
        }
      }catch(_blurUnavailable){} // Concentric translucent ellipses still work.
      renderer.addRendererObject(fx.bloom,behindZ);
      renderer.addRendererObject(fx.sparks,behindZ+.01);
    }catch(_rendererUnavailable){fx.bloom=null;fx.sparks=null;}
  }
  if(!fx.bloom||!fx.sparks)return;
  try{
    fx.bloom.clear();fx.sparks.clear();
    if(inactive){fx.bloom.visible=false;fx.sparks.visible=false;return;}
    fx.bloom.visible=true;fx.sparks.visible=true;
    const x=actor.x+(visualOffsetX||0),y=actor.y-19;
    const light=Math.max(.05,Math.min(1,actor.brightness||.065));
    const pulse=.93+.07*Math.sin(t*3.4);
    const strength=(.72+.28*light)*pulse;
    // Rose halo around ankles: broader diffusion, warm peach center.
    for(const [rx,ry,dy,color,alpha] of [
      [75,47,-3,0xff427f,.055],
      [61,39,-2,0xff508f,.075],
      [49,32, 0,0xff5c91,.095],
      [38,26, 2,0xff678c,.125],
      [29,20, 3,0xff8b80,.15],
      [19,14, 4,0xffb395,.18],
      [11, 9, 4,0xffd7b2,.14]
    ]){
      fx.bloom.beginFill(color,alpha*strength);
      fx.bloom.drawEllipse(x,y+dy,rx,ry);
      fx.bloom.endFill();
    }
    // A faint reflected rose pool hugs the surface; follows the character in air.
    if(actor.grounded){
      fx.bloom.beginFill(0xff6488,.11*strength);
      fx.bloom.drawEllipse(x,actor.y-1,75,11);
      fx.bloom.endFill();
    }
    // Three subtle floating glints; small enough not to obscure feet animation.
    const glintAlpha=.13+.15*light;
    for(let k=0;k<3;k++){
      const phase=t*(.8+k*.21)+k*2.1;
      const sx=x+Math.sin(phase)*((k+1)*12);
      const sy=y-8-k*9+Math.cos(phase*1.3)*4;
      fx.sparks.beginFill(k===1?0xffb5c5:0xffc3a8,
        glintAlpha*(.65+.35*Math.sin(phase*2.2)));
      fx.sparks.drawCircle(sx,sy,1.3+(k===1?.5:0));
      fx.sparks.endFill();
    }
  }catch(_visualOnlyError){
    try{fx.bloom.clear();fx.sparks.clear();}catch(_ignore){}
  }
}

updateFairyFeetGlow084p(runtimeScene,a,a.time,9.20,a.won,movementVisual084l.offsetX);
// Highlights on platforms: falloff with distance to the light being.
const lit=runtimeScene.getObjects('PlatformLight');
for(let i=0;i<lit.length;i++){
  const light=lit[i],base=platforms[i];if(!base)continue;
  const mx=Math.max(base.getX(),Math.min(a.x,base.getX()+base.getWidth()));
  const my=Math.max(base.getY(),Math.min(a.y-75,base.getY()+base.getHeight()));
  const radius=170+heat*310;
  const dist=Math.hypot(mx-a.x,my-(a.y-75));
  light.setPosition(base.getX(),base.getY());
  const falloff=Math.max(0,1-dist/radius);
  if(light.setOpacity)light.setOpacity(132*heat*falloff*falloff);
}
const crab=runtimeScene.getObjects('Crab')[0];
const crabLit=runtimeScene.getObjects('CrabLight')[0];
if(crab){
  // Art feet = AI ground y616; use fixed sprite dimensions 215x131, independent of AI hitbox.
  crab.setPosition(a.crabX-107.5,a.crabY-131);
  if(crab.flipX)crab.flipX(a.crabV<0);
  if(crab.setOpacity)crab.setOpacity(255);
}
if(crabLit){
  crabLit.setPosition(a.crabX-81,524);
  if(crabLit.flipX)crabLit.flipX(a.crabV<0);
  const d=Math.hypot(a.crabX-a.x, a.y-616);
  if(crabLit.setOpacity)crabLit.setOpacity(200*heat*Math.pow(Math.max(0,1-d/(180+heat*285)),2));
}
// 0.8.0 — SOFT BODY COMET: 40px diffused bloom, body-attached origin and feathered leading edge.
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
              const bloom40 = new Blur(40,3);
              bloom40.padding=90;
              comet.aura.filters=[bloom40];
              const feather = new Blur(16,3);
              feather.padding=40;
              comet.soft.filters=[feather];
              // Keep the ribbon sharp and graphic: only soft and aura get blur.
              // Strong gold/orange core sits inside a soft crimson halo.
            }
          } catch (noFilter) { /* Works without a blur filter. */ }
          // Draw the entire trail safely behind the Player sprite (10 / 17 Z-order).
          renderer.addRendererObject(comet.aura,behindZ-1.00);
          renderer.addRendererObject(comet.soft,behindZ-.80);
          renderer.addRendererObject(comet.ribbon,behindZ-.60);
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
  // Anchor in the centre of the torso, slightly AHEAD of the movement direction.
  // The newest ribbon pixels are therefore masked by Spalakh's actual body.
  const cx=actor.x+18*facing;
  const cy=actor.y-83;
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
      const headU=Math.min(1,age/.135);
      const featheredHead=.12+.88*(headU*headU*(3-2*headU));
      // The broad shoulder covers 100–145 px of character silhouette, then narrows to a tip.
      // No circular sprites: every band is a continuous tapered mesh.
      const shoulder=.91+.09*Math.sin(Math.PI*Math.min(1,age/.56));
      const bodyHalfWidth=(29+24*p.power)*shoulder*Math.pow(1-age,.93);
      info.push({x:p.x,y:p.y,nx,ny,width:bodyHalfWidth,
        alpha:fade*featheredHead*(.57+.43*p.power),age});
    }
    // From diffuse outer bloom to dense gold core. Bands share identical broad geometry.
    const bands=[
      {gfx:comet.aura,  scale:1.84,opacity:.24,colorOffset:.25},
      {gfx:comet.soft,  scale:1.34,opacity:.29,colorOffset:.13},
      {gfx:comet.ribbon,scale:.94,opacity:.24,colorOffset:.045},
      {gfx:comet.ribbon,scale:.70,opacity:.38,colorOffset:-.035},
      {gfx:comet.ribbon,scale:.40,opacity:.55,colorOffset:-.12},
      {gfx:comet.ribbon,scale:.19,opacity:.57,colorOffset:-.18}
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

const actor0794=a;
updateSoftComet0794(runtimeScene,actor0794,delta,a.deaths,false,
  a.won,pressed('r'),9);
// 0.8.4e — pixel sparks: 5 crisp RED squares at each jump/dash, born at the TRAIL TIP.
// Physical positions independent of the player. Pixelated on purpose (NO blur/filter).
function updateSparks084e(scene,actor,dt,reset,deadOrWon){
 let fx=scene.__sparks084e;
 if(!fx){
  fx=scene.__sparks084e={parts:[],graphic:null,grounded:!!actor.grounded,dash:false,death:null,err:''};
  try{
   const r=scene.getLayer('').getRenderer();
   if(typeof PIXI==='undefined'||!PIXI.Graphics||!r||!r.addRendererObject)throw new Error('Graphics unavailable');
   fx.graphic=new PIXI.Graphics();r.addRendererObject(fx.graphic,18.7);
  }catch(e){fx.err=String(e);}
 }
 if(reset||deadOrWon){fx.parts=[];if(fx.graphic)fx.graphic.clear();}
 const nowDash=!!(actor.dashTimer>0);
 const jump=fx.grounded&&!actor.grounded&&actor.vy< -90;
 const dash=nowDash&&!fx.dash;
 if(!reset&&!deadOrWon&&(jump||dash)){
  const trail=scene.__softComet0794;
  // The first/oldest still-visible trail sample is its detached far tip.
  const pts=trail&&trail.points?trail.points:[];
  const p=pts.length>=2?pts[0]:{x:actor.x-actor.facing*40,y:actor.y-56};
  const facing=actor.facing||1;
  for(let j=0;j<5;j++){
   const t=(j-2)/2;
   fx.parts.push({x:p.x+j*.8,y:p.y+t*4, vx:-facing*(105+Math.random()*80)+t*18,
    vy:-100-Math.random()*125,age:0,bounces:0,rest:false,settledAt:0,
    size:3+Math.round(Math.random()*2)});
  }
 }
 fx.grounded=!!actor.grounded;fx.dash=nowDash;
 const solids=[];
 for(const o of scene.getObjects('Platform'))solids.push({x:o.getX(),y:o.getY(),w:o.getWidth(),h:o.getHeight()});
 for(const name of ['EnvCargo','EnvSwitchReady','EnvSwitchDisabled']){
  for(const o of scene.getObjects(name)){
   // Only physically opaque objects affect sparks; non-interactive glows are ignored.
   if(o.getOpacity&&o.getOpacity()<5)continue;
   solids.push({x:o.getX()+4,y:o.getY()+3,w:Math.max(1,o.getWidth()-8),h:Math.max(1,o.getHeight()-6)});
  }
 }
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 for(const p of fx.parts){
  p.age+=dt;
  if(p.rest)continue;
  const steps=Math.max(1,Math.ceil(Math.hypot(p.vx,p.vy)*dt/7));
  for(let k=0;k<steps;k++){
   const d=dt/steps,ox=p.x,oy=p.y;
   p.vy=Math.min(640,p.vy+850*d);
   const nx=ox+p.vx*d, ny=oy+p.vy*d;
   let hit=null;
   for(const b of solids){
    if(nx>=b.x-3&&nx<=b.x+b.w+3&&p.vy>0&&oy<=b.y&&ny>=b.y){
     const t=clamp((b.y-oy)/(ny-oy||1),0,1);
     if(!hit||t<hit.t)hit={t,x:ox+(nx-ox)*t,y:b.y-0.2,nx:0,ny:-1};
    }
    if(nx>=b.x-3&&nx<=b.x+b.w+3&&p.vy<0&&oy>=b.y+b.h&&ny<=b.y+b.h){
     const t=clamp((b.y+b.h-oy)/(ny-oy||1),0,1);
     if(!hit||t<hit.t)hit={t,x:ox+(nx-ox)*t,y:b.y+b.h+0.2,nx:0,ny:1};
    }
    if(ny>=b.y-3&&ny<=b.y+b.h+3&&p.vx>0&&ox<=b.x&&nx>=b.x){
     const t=clamp((b.x-ox)/(nx-ox||1),0,1);
     if(!hit||t<hit.t)hit={t,x:b.x-0.2,y:oy+(ny-oy)*t,nx:-1,ny:0};
    }
    if(ny>=b.y-3&&ny<=b.y+b.h+3&&p.vx<0&&ox>=b.x+b.w&&nx<=b.x+b.w){
     const t=clamp((b.x+b.w-ox)/(nx-ox||1),0,1);
     if(!hit||t<hit.t)hit={t,x:b.x+b.w+0.2,y:oy+(ny-oy)*t,nx:1,ny:0};
    }
   }
   if(hit){
    p.x=hit.x;p.y=hit.y;
    if(hit.nx){p.vx=-p.vx*.45;p.vy*=.82;}else{p.vy=-p.vy*.45;p.vx*=.72;}
    p.bounces++;
    if(p.bounces>=3||Math.hypot(p.vx,p.vy)<55){p.rest=true;p.settledAt=p.age;p.vx=0;p.vy=0;break;}
   }else{p.x=nx;p.y=ny;}
  }
 }
 fx.parts=fx.parts.filter(p=>p.age<4);
 if(!fx.graphic)return;
 const g=fx.graphic;g.clear();
 for(const p of fx.parts){
  const fade=p.age<2.95?1:clamp((4-p.age)/1.05,0,1);
  g.beginFill(0xff2227,fade);g.drawRect(Math.round(p.x),Math.round(p.y),p.size,p.size);g.endFill();
 }
}
updateSparks084e(runtimeScene,a,delta,pressed('r'),a.won);
const fog=runtimeScene.getObjects('Fog')[0];
if(fog){
  fog.setPosition(Math.sin(a.time*.15)*7,Math.cos(a.time*.21)*5);
  if(fog.setOpacity)fog.setOpacity(31);
}
// 0.8.4i optical feedback, anchored to the physical light-sensitive lens.
const sensor=runtimeScene.getObjects('Sensor')[0];
const sensorHalo=runtimeScene.getObjects('SensorHalo084i')[0];
const sensorState=a.sensorOn?'ON':(a.sensorScanState||'OFF');
const sensorFX=(runtimeScene.__sensorFX084i ||= {last:'OFF',ping:0});
if(sensorState==='ON'&&sensorFX.last!=='ON')sensorFX.ping=.56;
sensorFX.last=sensorState;sensorFX.ping=Math.max(0,sensorFX.ping-delta);
if(sensor){
 if(sensor.getAnimationName&&sensor.getAnimationName()!==sensorState&&sensor.setAnimationName)sensor.setAnimationName(sensorState);
 if(sensor.setOpacity)sensor.setOpacity(sensorState==='SCAN'?Math.round(207+46*(.5+.5*Math.sin(atmo.elapsed*21))):255);
 // Do NOT call setScale: it resets custom-size using source pixels (640x640).
 if(sensor.setWidth)sensor.setWidth(118);
 if(sensor.setHeight)sensor.setHeight(118);
}
if(sensorHalo){
 if(sensorHalo.getAnimationName&&sensorHalo.getAnimationName()!==sensorState&&sensorHalo.setAnimationName)sensorHalo.setAnimationName(sensorState);
 const pct=Math.max(0,Math.min(1,(a.sensorProgress||0)/.52));
 if(sensorHalo.setPosition)sensorHalo.setPosition(955,374);
 if(sensorHalo.setOpacity)sensorHalo.setOpacity(sensorState==='OFF'?22:sensorState==='SCAN'?Math.round(78+83*pct+38*Math.sin(atmo.elapsed*19)):Math.round(66+175*sensorFX.ping/.56));
}
const gate=runtimeScene.getObjects('Gate')[0];
if(gate){ if(gate.setOpacity)gate.setOpacity(a.sensorOn?0:82); }
// 0.8.4m — illustrated mechanical signals, doors and moving platforms.
// Pure rendering: all collisions are computed separately from the drawings.
function drawPuzzleMachines084m(scene,clock,decks,relays,doors) {
  let fx=scene.__puzzleArt084m;
  if(!fx) {
    fx=scene.__puzzleArt084m={g:null};
    try{
      const renderer=scene.getLayer('').getRenderer();
      if(typeof PIXI!=='undefined' && PIXI.Graphics && renderer && renderer.addRendererObject){
        fx.g=new PIXI.Graphics();renderer.addRendererObject(fx.g,17.1);
      }
    }catch(_noPuzzleGraphics){fx.g=null;}
  }
  if(!fx.g)return;
  const g=fx.g;g.clear();
  try{
    for(const p of decks) {
      const alpha=p.active?1:.12;
      if(alpha<.15)continue;
      // Supporting cables mark the travel range, wood-and-brass deck is solid.
      g.lineStyle(1,0x8eafb8,.18*alpha);
      g.moveTo(p.baseX-3,p.baseY-45);g.lineTo(p.baseX+5,p.baseY+30);
      g.moveTo(p.baseX+p.w-5,p.baseY-45);g.lineTo(p.baseX+p.w+3,p.baseY+30);
      g.beginFill(0x133343,.86*alpha);g.drawRoundedRect(p.x-3,p.y-5,p.w+6,22,4);g.endFill();
      g.beginFill(0x7a6b54,.92*alpha);g.drawRoundedRect(p.x,p.y-3,p.w,10,3);g.endFill();
      g.lineStyle(2,0x85bec4,.7*alpha);
      g.moveTo(p.x+7,p.y+5);g.lineTo(p.x+p.w-7,p.y+5);
      for(let j=12;j<p.w-6;j+=22){
        g.beginFill(0xe7bc66,.7*alpha);g.drawCircle(p.x+j,p.y+1,1.8);g.endFill();
      }
    }
    for(const r of relays) {
      const t=Math.max(0,Math.min(1,r.progress||0));
      const on=!!r.on, flash=.5+.5*Math.sin(clock*8);
      const col=on?0x71e1ae:(t>.03?0xf6c663:0xd47358);
      g.lineStyle(3,0x1b3946,.95);g.drawCircle(r.x,r.y,32);
      g.lineStyle(4,col,on?.95:.43+.35*flash);g.drawCircle(r.x,r.y,23);
      g.beginFill(0x172b36,.96);g.drawCircle(r.x,r.y,16);g.endFill();
      g.beginFill(col,on?1:.57+.3*flash);g.drawCircle(r.x,r.y,6+4*t);g.endFill();
      g.lineStyle(4,0x344b53,.75);g.moveTo(r.x,r.y+33);g.lineTo(r.x,r.y+72);
      if(!on){
        g.lineStyle(4,0xf7c679,.85);
        g.arc(r.x,r.y,26,-Math.PI/2,-Math.PI/2+t*2*Math.PI);
      }
      if(on){
        g.lineStyle(1.5,0x8affd1,.25+.2*flash);g.drawCircle(r.x,r.y,38+4*flash);
      }
    }
    for(const door of doors) {
      const open=!!door.open;
      const color=open?0x69daba:0xed735e;
      const glow=.65+.3*Math.sin(clock*9);
      const px=door.x,top=door.top,bottom=door.bottom;
      g.lineStyle(5,0x294651,.92);g.moveTo(px-17,top);g.lineTo(px-17,bottom);
      g.moveTo(px+17,top);g.lineTo(px+17,bottom);
      if(!open){
        g.beginFill(0x1f3640,.91);g.drawRect(px-12,top,24,bottom-top);g.endFill();
        g.lineStyle(4,color,glow);
        for(let yy=top+13;yy<bottom-5;yy+=31){g.moveTo(px-11,yy);g.lineTo(px+11,yy+15);}
      }else{
        g.lineStyle(3,color,.6*glow);g.moveTo(px-11,top+10);g.lineTo(px-11,top+55);
        g.moveTo(px+11,bottom-55);g.lineTo(px+11,bottom-10);
      }
      g.beginFill(color,open?.65:glow);g.drawCircle(px,top+6,6);g.endFill();
    }
  }catch(_puzzleVisualIssue){try{g.clear();}catch(_clearFailed){}}
}

drawPuzzleMachines084m(runtimeScene,a.time,puzzle084m.decks,
 [],[]);
// 0.8.4k: tracking searchlight artwork removed.
const hint=runtimeScene.getObjects('HUDHint')[0];
if(hint && hint.setString)hint.setString(a.hint);
const sense=runtimeScene.getObjects('HUDSense')[0];
const lightUA=a.lightState==='STEALTH'?'ТИША':a.lightState==='VISIBLE'?'ПОМІТНО':'СПАЛАХ';
const crabUA=a.crabState==='patrol'?'СПОКІЙ':a.crabState==='alert'?'НАСТОРОЖІ':a.crabState==='chase'?'ПЕРЕСЛІДУЄ':'ШУКАЄ';
if(sense && sense.setString)sense.setString('СВІТЛО '+Math.round(a.brightness*100)+'% · '+(a.camouflaged?'В ТІНІ':a.inShadow?'ТІНЬ':lightUA)+' · КРАБ: '+crabUA);
const stageText=runtimeScene.getObjects('HUDStage')[0];
const stageTitles=['01/05 · ПРОБУДЖЕННЯ','02/05 · СЕНСОР','03/05 · ТИХА ЗОНА','04/05 · ШЛЮЗ','05/05 · АВАРІЙНИЙ БУЙ','РІВЕНЬ ПРОЙДЕНО'];
if(stageText&&stageText.setString)stageText.setString(stageTitles[a.stage]||stageTitles[0]);
const victory=runtimeScene.getObjects('HUDVictory')[0];
const victorySub=runtimeScene.getObjects('HUDVictorySub')[0];
const restart=runtimeScene.getObjects('HUDRestart')[0];
for(const o of [victory,victorySub,restart])if(o&&o.setOpacity)o.setOpacity(a.won?255:0);
const goalGlow=runtimeScene.getObjects('GoalGlow')[0];
if(goalGlow){
  if(goalGlow.setPosition)goalGlow.setPosition(2275,340);
  if(goalGlow.setOpacity)goalGlow.setOpacity(a.won?Math.min(255,185+45*Math.sin(a.time*4)):24+18*Math.sin(a.time*2));
  if(goalGlow.setScale)goalGlow.setScale(a.won?1.15:0.82);
}
const status=runtimeScene.getObjects('HUDStatus')[0];
if(status && status.setString)status.setString(a.won?'ПІСЛЯСВІТ · ПЕРШИЙ СИГНАЛ':a.sensorOn?'ПІСЛЯСВІТ · ШЛЮЗ ВІДКРИТО':'ПІСЛЯСВІТ · ПЕРШИЙ СИГНАЛ');
const cameraTarget=Math.max(640,Math.min(1920,a.x+200));
run.cameraX+=(cameraTarget-run.cameraX)*Math.min(1,delta*3.4);
if(gdjs.evtTools.camera.setCameraX)gdjs.evtTools.camera.setCameraX(runtimeScene,run.cameraX,'',0);
// 0.8.4k: cold marine grading, UNDER all foreground gameplay sprites.
function updateHarborMood084k(scene,cameraCenter){
  if(typeof PIXI==='undefined'||!PIXI.Graphics||!PIXI.Sprite||!PIXI.Texture)return;
  const renderer=scene.getLayer('')?.getRenderer();
  if(!renderer||!renderer.addRendererObject)return;
  const fx=scene.__harborMood084k ||= {shade:null,vignette:null};
  if(!fx.shade){
    try{
      const shade=new PIXI.Graphics();
      shade.beginFill(0x061724,.18);
      shade.drawRect(-80,-50,2730,840);shade.endFill();
      renderer.addRendererObject(shade,-10.5);
      fx.shade=shade;
    }catch(_e){}
  }
  if(!fx.vignette&&typeof document!=='undefined'){
    try{
      const cv=document.createElement('canvas');cv.width=1280;cv.height=720;
      const cx=cv.getContext('2d');
      if(cx){
        const g=cx.createRadialGradient(640,340,240,640,340,790);
        g.addColorStop(0,'rgba(2,11,19,0)');
        g.addColorStop(.56,'rgba(2,11,19,.025)');
        g.addColorStop(1,'rgba(2,11,19,.20)');
        cx.fillStyle=g;cx.fillRect(0,0,1280,720);
        const sprite=new PIXI.Sprite(PIXI.Texture.from(cv));
        renderer.addRendererObject(sprite,-9.6);
        fx.vignette=sprite;
      }
    }catch(_e){}
  }
  if(fx.vignette)fx.vignette.position.set(cameraCenter-640,0);
}
updateHarborMood084k(runtimeScene,run.cameraX);
// ----- 0.6.4 REAL PARALLAX: foreground is blurred and lifted higher -----
const parallaxTravel=run.cameraX-640;
for(const cfg of [
  {name:'ParaWater',rate:.04,alpha:255,baseY:0},
  {name:'ParaWreck',rate:.25,alpha:168,baseY:0},
  {name:'ParaPier',rate:.46,alpha:162,baseY:0},
  {name:'ParaSeabed',rate:.73,alpha:174,baseY:0},
  {name:'ParaNet',rate:1.12,alpha:255,baseY:-54}
]){
  const art=runtimeScene.getObjects(cfg.name)[0];
  if(!art)continue;
  const positionX=parallaxTravel*(1-cfg.rate);
  const floatY=cfg.name==='ParaNet'?Math.sin(atmo.elapsed*.24)*2.0:0;
  art.setPosition(positionX,cfg.baseY+floatY);
  if(art.setOpacity) art.setOpacity(cfg.alpha);
}
// The foreground net stays above Spalakh, but is softened by blur instead of transparency.

// ── v0.6 AMBIENT VISUALS ─────────────────────────────────────────────
// Fixed world positions plus sinusoidal drift. Every environmental sprite is decorative.
const ambientTime=atmo.elapsed;
if(!atmo.decorBase){
 atmo.decorBase={};
 for(const name of ['DecorKelpA','DecorKelpB','DecorKelpCover','DecorTrashA','DecorTrashB','DecorBottle','DecorBuoyLine']){
   atmo.decorBase[name]=runtimeScene.getObjects(name).map(o=>({x:o.getX(),y:o.getY()}));
 }
 const netObject=runtimeScene.getObjects('DecorForegroundNet')[0];
 atmo.netBase=netObject?{x:netObject.getX(),y:netObject.getY()}:null;
}
for(const name of Object.keys(atmo.decorBase)){
 const objects=runtimeScene.getObjects(name);
 const points=atmo.decorBase[name];
 for(let i=0;i<objects.length;i++){
  const obj=objects[i],origin=points[i];if(!obj||!origin)continue;
  const isKelp=name.startsWith('DecorKelp');
  const phase=i*1.31+name.length*.37;
  const xx=Math.sin(ambientTime*(isKelp?.60:.32)+phase)*(isKelp?3.4:2.0);
  const yy=Math.sin(ambientTime*(isKelp?.37:.21)+phase*.9)*(isKelp?0.8:1.7);
  obj.setPosition(origin.x+xx,origin.y+yy);
 }
}
const farBubbles=runtimeScene.getObjects('BubbleFar');
const nearBubbles=runtimeScene.getObjects('BubbleNear');
for(const layerBubbles of [farBubbles,nearBubbles]){
 const near=layerBubbles===nearBubbles;
 for(let i=0;i<layerBubbles.length;i++){
  const b=layerBubbles[i];
  const seed=near?310:37;
  const baseX=24+((i*197+seed)%2510);
  const rise=(ambientTime*(near?34:17)+(i*118+seed))%805;
  b.setPosition(baseX+Math.sin(ambientTime*(near?.8:.43)+i*2.1)*8,725-rise);
  if(b.setOpacity)b.setOpacity((near?100:48)+Math.sin(ambientTime*1.8+i)*12);
 }
}
const motes=runtimeScene.getObjects('SiltMote');
for(let i=0;i<motes.length;i++){
 const m=motes[i];
 const x=((i*143+55)%2540)+Math.sin(ambientTime*.20+i*.9)*16;
 const y=36+((i*99+Math.round(ambientTime*(3.5+(i%3))))%655);
 m.setPosition(x,y);
 if(m.setOpacity)m.setOpacity(25+(Math.sin(ambientTime*.92+i)*.5+.5)*55);
}
const dynamicNet=runtimeScene.getObjects('DecorForegroundNet')[0];
if(dynamicNet && atmo.netBase){
 dynamicNet.setPosition(atmo.netBase.x+Math.sin(ambientTime*.24)*8,atmo.netBase.y+Math.sin(ambientTime*.19)*4);
 // A softer net near Spalakh prevents the foreground from hiding the avatar.
 const overlap=Math.max(0,1-Math.abs(a.x-320)/370);
 if(dynamicNet.setOpacity)dynamicNet.setOpacity(255);
}
// Pure graphical flare pulse attached to dash start; player body scale never changes.
if(beforeAtmos.dashTimer<=0 && a.dashTimer>0){
 atmo.ringAge=0;atmo.ringX=a.x;atmo.ringY=a.y-137;
}
atmo.ringAge+=delta;
const pulse=runtimeScene.getObjects('DashPulse')[0];
if(pulse){
 if(atmo.ringAge<.38){
  const phase=atmo.ringAge/.38;
  const side=146+phase*250;
  pulse.setPosition(atmo.ringX-side/2,atmo.ringY-side/2);
  if(pulse.setWidth)pulse.setWidth(side);
  if(pulse.setHeight)pulse.setHeight(side);
  if(pulse.setOpacity)pulse.setOpacity(150*(1-phase)**1.8);
 }else if(pulse.setOpacity)pulse.setOpacity(0);
}
// Shorter non-intrusive hints, fading after a few seconds of being in the same stage.
if(atmo.lastHintStage!==a.stage){atmo.lastHintStage=a.stage;atmo.hintShownAt=ambientTime;}
const tutorialHint=runtimeScene.getObjects('HUDHint')[0];
if(tutorialHint&&tutorialHint.setOpacity){
 const important=a.gateBlocked||a.crabState==='chase'||a.won;
 const age=ambientTime-(atmo.hintShownAt||0);
 tutorialHint.setOpacity(important||age<5?230:age<8?230*(8-age)/3:0);
}
const soundUI=runtimeScene.getObjects('HUDSound')[0];
if(soundUI&&soundUI.setString)soundUI.setString('M — ЗВУК: '+(atmo.muted?'ВИМКНЕНО':'УВІМКНЕНО'));
// ── v0.6 SOUNDS ──────────────────────────────────────────────────────
// Start ambience only after keyboard interaction (respects browser autoplay rules).
const audio=gdjs.evtTools && gdjs.evtTools.sound;
const interacted=input.left||input.right||input.jump||input.down||input.dash||input.boost;
const soundPath='assets/v06/';
if(audio){
 try{
  if(!atmo.audioStarted && interacted && !atmo.muted){
   audio.playSoundOnChannel(runtimeScene,soundPath+'underwater_ambience.wav',7,true,14,1);
   atmo.audioStarted=true;
  }
  if(atmo.audioStarted && audio.setSoundOnChannelVolume){
   audio.setSoundOnChannelVolume(runtimeScene,7,atmo.muted?0:14);
  }
  function playEffect(file,volume,pitch){
   if(atmo.audioStarted&&!atmo.muted)audio.playSound(runtimeScene,soundPath+file,false,volume,pitch||1);
  }
  if(beforeAtmos.dashTimer<=0 && a.dashTimer>0)playEffect('flare_dash.wav',30,1);
  if(!beforeAtmos.grounded && a.grounded && !a.won)playEffect('soft_landing.wav',18,1);
  if(beforeAtmos.crabState!=='alert' && a.crabState==='alert')playEffect('crab_alert.wav',19,1);
  if(beforeAtmos.crabState!=='chase' && a.crabState==='chase')playEffect('crab_alert.wav',27,1.16);
  if(!beforeAtmos.sensorOn && a.sensorOn)playEffect('sensor_activated.wav',34,1);
  if(!beforeAtmos.won && a.won)playEffect('signal_found.wav',45,1);
  if(ambientTime>=atmo.nextCreak){
    // Staggered, occasional creaks — deterministic schedule.
    atmo.creakCounter++;
    atmo.nextCreak=ambientTime+10.5+(atmo.creakCounter%3)*2.4;
    if(!a.won)playEffect('old_wood_creak.wav',12,0.86+(atmo.creakCounter%3)*.08);
  }
 }catch(audioError){
   // Audio failure should NEVER interrupt player movement or render the blue error screen.
   atmo.audioStarted=false;
   if(!atmo.audioErrorLogged && typeof console!=='undefined'){
      console.warn('ПІСЛЯСВІТ 0.6: звуки недоступні',audioError);
      atmo.audioErrorLogged=true;
   }
 }
}


// 0.7.1 — sequential progression: First Signal -> Depth.
// Only a NEW SPACE press after reaching the victory state can trigger the change.
// A held jump key will not auto-skip the victory message.
if (!a.won) {
  run.transitionSpaceArmed=false;
} else {
  if (!pressed('Space')) run.transitionSpaceArmed=true;
  if (run.transitionSpaceArmed && pressed('Space') && !run.transitionStarted) {
    run.transitionStarted=true;
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, 'Depth_07_Blockout', false);
  }
}
};
gdjs.UnderwaterHarborCode.eventsList0 = function(runtimeScene) {

{


gdjs.UnderwaterHarborCode.userFunc0xde38e8(runtimeScene);

}


};

gdjs.UnderwaterHarborCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.UnderwaterHarborCode.GDPlayerObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBackgroundObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDPlatformObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDCrabObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDGlowObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDSensorObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDGateObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBuoyObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDHintObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDStatusObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDWorldLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDFloorLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDTrailObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDPlatformLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDCrabLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDFogObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDSenseObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorPierLargeObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorPierRuinsObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorStoneAObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorStoneBObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorShipPieceObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorKelpAObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorKelpBObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorForegroundNetObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorBuoyLineObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorCrabPotObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorTrashAObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorTrashBObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorBottleObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDStageObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDVictoryObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDVictorySubObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDRestartObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDGoalGlowObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorKelpCoverObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBubbleFarObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBubbleNearObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDSiltMoteObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDashPulseObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDSoundObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaWaterObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaWreckObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaPierObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaSeabedObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaNetObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDSensorHalo084iObjects1.length = 0;

gdjs.UnderwaterHarborCode.eventsList0(runtimeScene);
gdjs.UnderwaterHarborCode.GDPlayerObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBackgroundObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDPlatformObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDCrabObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDGlowObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDSensorObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDGateObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBuoyObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDHintObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDStatusObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDWorldLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDFloorLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDTrailObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDPlatformLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDCrabLightObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDFogObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDSenseObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorPierLargeObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorPierRuinsObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorStoneAObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorStoneBObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorShipPieceObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorKelpAObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorKelpBObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorForegroundNetObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorBuoyLineObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorCrabPotObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorTrashAObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorTrashBObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorBottleObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDStageObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDVictoryObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDVictorySubObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDRestartObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDGoalGlowObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDecorKelpCoverObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBubbleFarObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDBubbleNearObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDSiltMoteObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDDashPulseObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDHUDSoundObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaWaterObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaWreckObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaPierObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaSeabedObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDParaNetObjects1.length = 0;
gdjs.UnderwaterHarborCode.GDSensorHalo084iObjects1.length = 0;


return;

}

gdjs['UnderwaterHarborCode'] = gdjs.UnderwaterHarborCode;
