// Shared core for ПІСЛЯСВІТ: КАСКАД ТІНЕЙ 0.10 (inserted into each GDevelop scene)
(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(x,y,a,b)=>Math.hypot(x-a,y-b);
const press=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const I={left:press('a')||press('Left'),right:press('d')||press('Right'),
 jump:press('Space')||press('w')||press('Up'),throw:press('f')||press('F'),
 use:press('e')||press('E'),grab:press('g')||press('G'),
 crouch:press('s')||press('Down'),reset:press('r')||press('R'),
 shift:press('Shift')||press('LShift'),journal:press('Tab')};
const DT=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const GAME=runtimeScene.getGame();
function newDungeon(){return {
 lightMode:'A',ballastPhase:'hanging',ballastY:950,ballastV:0,
 ballastDropped:false,archiveRoofBroken:false,shortcutOpen:false,
 ballastTimer:0,interactBlocked:false,
 archiveShelfX:476,archiveBlackout:false,clueDiscovered:false,
 keyCollected:false,keyInserted:false,finalStep:0,finalCompleted:false,
 checkpoint:{room:1,x:425,y:635},arrival:'START',spawnOverride:null,
 deaths:0,time:0,gameWon:false,
  oxygenParts:{archive:false,uv:false,spiderDrop:false,gravity:false,chase:false},
  uvSpider:'alive',spiderX:940,spiderY:1036,spiderLiftY:1036,spiderLiftTime:0,uvHold:0,
  shaftShoved:false,shaftProjectileReady:false,shaftProjectileUsed:false,
  shaftFallingLamp:'ready',shaftLampY:745,shaftLampClock:0,
  shaftRock:'ready',shaftRockY:1190,shaftRockClock:0,
  shaftLightSensor:false,gravityFlipped:false,gravityLamp:false,
  chaseBlackout:false,chaseClock:0,chaseCaught:false,diverRead:false
};}
if(!GAME.__cascadeDungeon)GAME.__cascadeDungeon=newDungeon();
const D=GAME.__cascadeDungeon;
D.time+=DT;
if(!runtimeScene.__cascadeLocal)runtimeScene.__cascadeLocal={
 first:true,x:0,y:0,vx:0,vy:0,ground:true,face:1,coyote:0,jumpBuffer:0,
 jumpHeld:false,groundTimer:0,elapsed:0,trail:[],trailClock:0,brightness:.12,
 msg:'',msgClock:0,useHeld:false,grabHeld:false,resetHeld:false,
 shield:1.7,alert:{},dead:false,deathClock:0,fx:0,transition:false,
 paused:false,worldLight:[],clueTimer:0,grabShelf:false,carrySpider:false,wrongFx:0,
 finishFx:0
};
const S=runtimeScene.__cascadeLocal;
S.elapsed+=DT;S.msgClock=Math.max(0,S.msgClock-DT);
S.shield=Math.max(0,S.shield-DT);S.fx=Math.max(0,S.fx-DT*2);
S.wrongFx=Math.max(0,S.wrongFx-DT*1.9);
S.finishFx=Math.max(0,S.finishFx-DT*1.1);
const E=I.use&&!S.useHeld&&!D.interactBlocked,G=I.grab&&!S.grabHeld;
if(!I.use)D.interactBlocked=false;
const R=I.reset&&!S.resetHeld;
S.useHeld=I.use;S.grabHeld=I.grab;S.resetHeld=I.reset;
function message(txt,seconds=3.5){S.msg=txt;S.msgClock=seconds;}
function get(name){return runtimeScene.getObjects(name)[0];}
function setText(name,value){const o=get(name);if(o&&o.setString)o.setString(value);}
const onFloor=(x,y,p)=>x+13>p.x&&x-13<p.x+p.w&&y>=p.y-10&&y<=p.y+12;
function isLit(x,y,pools){return pools.some(p=>dist(x,y,p.x,p.y)<p.r);}
function setCheckpoint(room,x,y){D.checkpoint={room,x,y};}
function movePlayer(platforms,modifier={}){
 if(S.dead||S.transition)return;
 const dir=Number(I.right)-Number(I.left);
 if(dir)S.face=dir;
 let baseSpeed=I.crouch?68:I.shift?310:205;
 if(modifier.slow&&modifier.slow(S.x,S.y))baseSpeed=I.crouch?44:92;
 if(S.grabShelf)baseSpeed=107;
 if(S.carrySpider)baseSpeed=150;
 const target=dir*baseSpeed;
 const ice=modifier.ice&&modifier.ice(S.x,S.y);
 const accel=dir?(S.ground?(ice?600:1450):1020):(S.ground?(ice?160:2250):980);
 S.vx+=clamp(target-S.vx,-accel*DT,accel*DT);
 if(S.ground)S.coyote=.13;else S.coyote=Math.max(0,S.coyote-DT);
 if(I.jump&&!S.jumpHeld)S.jumpBuffer=.14;
 else S.jumpBuffer=Math.max(0,S.jumpBuffer-DT);
 if(S.jumpBuffer>0&&(S.ground||S.coyote>0)&&!I.crouch&&!S.grabShelf){
  S.vy=-566;S.ground=false;S.coyote=0;S.jumpBuffer=0;S.fx=.24;
 }
 if(S.jumpHeld&&!I.jump&&S.vy< -160)S.vy*=.55;
 S.jumpHeld=I.jump;
 if(!S.ground){
  const gravity=S.vy<0&&I.jump?975:1380;
  S.vy=clamp(S.vy+gravity*DT,-610,850);
 }
 const oldY=S.y,oldX=S.x;
 S.x=clamp(S.x+S.vx*DT,18,1263);
 S.y+=S.vy*DT;
 let landed=false;
 for(const p of platforms){
  if(S.vy>=0&&oldY<=p.y+8&&S.y>=p.y&&S.x+13>p.x&&S.x-13<p.x+p.w){
   S.y=p.y;S.vy=0;landed=true;break;
  }
 }
 if(!S.ground&&landed)S.groundTimer=.15;
 S.ground=landed;S.groundTimer=Math.max(0,S.groundTimer-DT);
 if(S.grabShelf){
  const move=S.x-oldX;
  D.archiveShelfX=clamp(D.archiveShelfX+move,345,694);
  S.x=clamp(D.archiveShelfX+(S.shelfSide||-1)*70,18,1262);
  S.y=635;S.ground=true;S.vy=0;
 }
 const targetLight=clamp(.12+.81*Math.pow(Math.min(1,Math.abs(S.vx)/215),1.2)+(S.fx>.1?.07:0),.12,1);
 S.brightness+=(targetLight-S.brightness)*(1-Math.exp(-DT*(targetLight>S.brightness?8:3)));
 S.trailClock+=DT;
 if(Math.abs(S.vx)>59&&S.trailClock>=.029){
  S.trail.push({x:S.x-S.face*17,y:S.y-44,p:S.brightness,age:0});S.trailClock=0;
 }
 for(const v of S.trail)v.age+=DT;
 S.trail=S.trail.filter(v=>v.age<.85).slice(-38);
 if(S.y>(modifier.deathY||2700))hurt('ПАДІННЯ');
}
function hurt(reason){
 if(S.dead||S.shield>0||D.gameWon)return;
 S.dead=true;S.deathClock=.78;S.fx=.85;S.vx=0;S.vy=0;D.deaths++;
 message('СПАЛАХ ЗГАС: '+reason+' · ПРОГРЕС ЗБЕРЕЖЕНО',2.8);
}
function goTo(room,arrival,spawn){
 if(S.transition)return;
 S.transition=true;
 D.arrival=arrival;
 D.interactBlocked=true;
 D.spawnOverride=spawn||null;
 gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,
  ['','R01_CascadeHall','R02_CascadeShaft','R03_CascadeArchive','R04_ZeroGravity','R05_BlackoutRun'][room],false);
}
function deathTick(){
 if(!S.dead)return;
 S.deathClock-=DT;
 if(S.deathClock<=0){
  const cp=D.checkpoint;
  goTo(cp.room,'CHECKPOINT',{x:cp.x,y:cp.y});
 }
}
function spiders(positions,pools,detection=130){
 for(let n=0;n<positions.length;n++){
  const sp=positions[n],sx=sp.x+Math.sin(S.elapsed*(.64+n*.17))*13;
  const isSeen=dist(S.x,S.y-38,sx,sp.y-35)<detection&&!isLit(S.x,S.y-40,pools);
  S.alert[n]=clamp((S.alert[n]||0)+(isSeen?DT*1.2:-DT*1.7),0,1.15);
  if(S.alert[n]>=1)hurt('ПАВУК ПОБАЧИВ СПАЛАХА В ТЕМРЯВІ');
 }
}
function spawn(initial){
 if(!S.first)return;
 S.first=false;
 const where=D.spawnOverride||initial;
 S.x=where.x;S.y=where.y;
 S.vx=0;S.vy=0;S.ground=true;
 D.spawnOverride=null;
 S.shield=1.75;
}
let FG=runtimeScene.__cascadeGfx;
if(!FG){
 FG=runtimeScene.__cascadeGfx={ok:false};
 try{
  const renderer=runtimeScene.getLayer('').getRenderer();
  if(typeof PIXI==='undefined'||!PIXI.Graphics||!renderer||!renderer.addRendererObject)throw Error('PIXI Graphics unavailable');
  for(const [n,z] of [['far',-40],['middle',-32],['back',-27],['world',7],['glows',15],['front',24]]){
   FG[n]=new PIXI.Graphics();renderer.addRendererObject(FG[n],z);
  }
  FG.ok=true;
 }catch(err){FG.error=String(err);}
}
function rect(g,x,y,w,h,c,a=1){
 g.lineStyle(0);g.beginFill(c,a);g.drawRoundedRect(x,y,w,h,Math.min(9,Math.max(1,h/3)));g.endFill();
}
function disk(g,x,y,r,c,a=1){g.lineStyle(0);g.beginFill(c,a);g.drawCircle(x,y,r);g.endFill();}
function ln(g,x,y,u,v,c=0x7096a7,a=.65,size=2){g.lineStyle(size,c,a);g.moveTo(x,y);g.lineTo(u,v);}
function glow(g,x,y,r,c,a){for(let t=5;t>=1;t--)disk(g,x,y,r*(.4+t*.15),c,a*(6-t)/23);}
function drawBase(height=720){
 if(!FG.ok)return;
 const far=FG.far,m=FG.middle,b=FG.back;
 far.clear();m.clear();b.clear();
 rect(far,0,0,1280,height,0x07111e);
 for(let x=15;x<1280;x+=72)ln(far,x,0,x,height,0x36586d,.12,1);
 for(let y=18;y<height;y+=78)ln(far,0,y,1280,y,0x3a596e,.13,1);
 for(let x=54;x<1280;x+=251){
  rect(m,x,42,55,height-84,0x132d40,.47);
  ln(m,x+10,54,x+10,height-58,0x7199b0,.13,2);
 }
 for(let y=174;y<height;y+=350){
  ln(b,10,y,1260,y,0x316174,.23,5);
  for(let x=90;x<1250;x+=187)rect(b,x,y-20,55,42,0x243d52,.24);
 }
}
function platform(g,p){
 rect(g,p.x,p.y,p.w,p.h,p.h>40?0x203748:0x30495c,.98);
 rect(g,p.x+2,p.y,p.w-4,4,0x98bfd0,.67);
 for(let x=p.x+11;x<p.x+p.w-10;x+=32)ln(g,x,p.y+9,x-8,p.y+Math.min(20,p.h),0x86a9b5,.21,1);
}
function drawSpider(g,sp,n,pools){
 const x=sp.x+Math.sin(S.elapsed*(.64+n*.17))*13,y=sp.y;
 const hiddenSpider=isLit(x,y-37,pools),c=hiddenSpider?0x637d85:0xbf6176;
 const scale=sp.scale||1;
 for(let side of [-1,1])for(let k=0;k<4;k++){
  const yy=y-17*scale+k*7*scale;
  ln(g,x+side*12*scale,yy,x+side*(29+k*6)*scale,
   yy-14*scale+k*8*scale,c,.84,scale>1?4:2.8);
 }
 disk(g,x,y-30*scale,20*scale,0x17212c);
 for(let dx of [-7,7])disk(g,x+dx*scale,y-38*scale,3.1*scale,hiddenSpider?0x77979c:0xff5f7c);
 if(!hiddenSpider)glow(g,x,y-39*scale,31*scale,0xf45377,.12);
}
function drawLights(pools){
 if(!FG.ok)return;
 const back=FG.back;
 for(const p of pools)glow(back,p.x,p.y,p.r,0x91fbea,.18);
}
function drawActor(pools,camY=360){
 if(FG.ok){
  const glowLayer=FG.glows;glowLayer.clear();
  for(const v of S.trail){
   const alpha=Math.max(0,1-v.age/.85)*v.p;
   glow(glowLayer,v.x,v.y,22,0xff5477,.11*alpha);
   disk(glowLayer,v.x,v.y,4+v.p*5,0xff7591,.52*alpha);
  }
  const inLight=isLit(S.x,S.y-40,pools);
  if(!S.dead){
   glow(glowLayer,S.x,S.y-45,36+S.brightness*35,0xfb5477,inLight?.028:.055+S.brightness*.10);
   glow(glowLayer,S.x,S.y-16,27,0xff82aa,inLight?.021:.09);
  }
  if(S.dead)glow(glowLayer,S.x,S.y-44,45,0xff5f7d,.23);
 }
 const p=get('Player');
 if(p){
  const v=Math.abs(S.vx);
  const anim=S.dead?'Fall':!S.ground?(S.vy<0?'Jump':'Fall'):
   S.groundTimer>0?'Land':I.crouch?'Crouch':v>159?'Run':v>21?'Slow':'Idle';
  if(p.getAnimationName&&p.getAnimationName()!==anim&&p.setAnimationName)p.setAnimationName(anim);
  if(p.setAnimationSpeedScale)p.setAnimationSpeedScale(anim==='Run'?clamp(v/230,.8,1.35):1);
  const scale=.55;if(p.setScale)p.setScale(scale);
  p.setPosition(S.x-192*scale,S.y-242*scale);
  if(p.flipX)p.flipX(S.face<0);
  if(p.setOpacity)p.setOpacity(S.dead?0:(isLit(S.x,S.y-40,pools)?53:clamp(159+S.brightness*91,159,255)));
 }
}
function fragmentsText(){
 const p=D.oxygenParts;
 return (p.archive?'27%':'___')+' '+(p.uv?'КИ':'__')+(p.spiderDrop?'С':'_')+(p.gravity?'Н':'_')+(p.chase?'Ю':'_');
}
function allFragments(){return Object.values(D.oxygenParts).every(Boolean);}
function hudBase(room,title,objective,pools,extra=''){
 setText('HUDTitle','ПІСЛЯСВІТ / КАСКАД ТІНЕЙ     '+room+'   '+title);
 setText('HUDStatus','РЕЖИМ '+D.lightMode+'   БАЛАСТ '+(D.ballastDropped?'✓':'○')+
  '   КЛЮЧ '+(D.keyCollected?'✓':'○')+
  '   '+(isLit(S.x,S.y-40,pools)?'НЕВИДИМИЙ У СВІТЛІ':'ПОМІТНИЙ В ТЕМРЯВІ')+
  '   ФРАЗА '+fragmentsText()+'   СМЕРТІ '+D.deaths);
 setText('HUDTask',objective);
 setText('HUDHint','A/D — РУХ  SPACE — СТРИБОК  E — ДІЯ  G — ШТОВХАТИ  S — ПРИСІСТИ  TAB — ЖУРНАЛ  R — КОНТР. ТОЧКА');
 setText('HUDMessage',S.msgClock>0?S.msg:'');
 setText('HUDWin',D.gameWon?'КАСКАД ТІНЕЙ ПРОЙДЕНО!':'');
 const win=get('HUDWin');if(win&&win.setOpacity)win.setOpacity(D.gameWon?255:0);
 if(I.journal)setText('HUDMessage','ЖУРНАЛ: '+(D.clueDiscovered?'III → I → IV → II':'ШИФР НЕ ЗНАЙДЕНО')+
  ' · БАЛАСТ '+(D.ballastDropped?'СКИНУТО':'НЕ СКИНУТО')+' · КЛЮЧ '+(D.keyCollected?'Є':'НЕ ЗНАЙДЕНО')+' · ОКСИГЕН: '+fragmentsText());
}
if(R){
 if(I.shift){GAME.__cascadeDungeon=newDungeon();goTo(1,'START',{x:420,y:635});}
 else{
  const cp=D.checkpoint;
  goTo(cp.room,'CHECKPOINT',{x:cp.x,y:cp.y});
 }
}
