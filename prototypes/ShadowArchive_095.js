// ПІСЛЯСВІТ • АРХІВ ТІНЕЙ • standalone spatial puzzle
// GDevelop JavaScript event. Screen 1280x720, existing Spalakh player sprite.
(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(x,y,a,b)=>Math.hypot(x-a,y-b);
const press=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const i={l:press('a')||press('Left'),r:press('d')||press('Right'),
 j:press('Space')||press('w')||press('Up'),crouch:press('s')||press('Down'),
 use:press('e')||press('E'),grab:press('g')||press('G'),
 reset:press('r')||press('R')};
const dt=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const P=[{x:0,y:628,w:1280,h:92},
{x:122,y:525,w:190,h:19},{x:322,y:430,w:180,h:19},
{x:510,y:333,w:176,h:19},{x:705,y:422,w:175,h:19},
{x:890,y:328,w:170,h:19},{x:1076,y:259,w:176,h:19}];
const PEDESTALS=[{x:261,y:485},{x:570,y:294},{x:803,y:382},{x:987,y:288}];
const SEQUENCE=[2,0,3,1];
const SWITCH={x:586,y:591}, KEY={x:384,y:394}, PRESSURE={x:973,y:612}, WALL={x:1109,y:490};
const spiderBases=[720,869,1022,1190];
const corridorBulbs=[745,845,945,1045,1159];
const clamp0=x=>Math.max(0,x);
function make(){
 return {x:92,y:628,vx:0,vy:0,ground:true,face:1,time:0,
 bright:.12,trail:[],trailAccum:0,glowPulse:0,
 blackout:false,clueSeen:false,clueTime:0,key:false,
 code:0,codeFlash:0,wrong:0,
 cartX:459,cartGrab:false,cartSide:-1,plateTime:0,wallBroken:false,
 spiderAlert:0,spiderScream:0,shield:1.2,dead:false,deathTime:0,deaths:0,
 pistonState:'idle',pistonY:55,pistonClock:0,
 frozenTimer:0,coyote:0,jumpBuf:0,jumpHeld:false,jumpHold:0,
 eHeld:false,gHeld:false,stepOn:false,landTimer:0,won:false,
 msg:'АРХІВ ТІНЕЙ: СВІТЛО ХОВАЄ ТЕБЕ. ЗНАЙДИ ПРИХОВАНИЙ ШИФР.',msgTime:5.5};
}
if(!runtimeScene.__shadowArchive)runtimeScene.__shadowArchive=make();
const s=runtimeScene.__shadowArchive;
const get=name=>runtimeScene.getObjects(name)[0];
const hud=(name,value)=>{const o=get(name);if(o&&o.setString)o.setString(value);};
const say=(msg,duration=3)=>{s.msg=msg;s.msgTime=duration;};
const fixedLit=(x,y)=>{
 if(dist(x,y,110,585)<148)return true; // teaching light at entrance
 if(dist(x,y,474,582)<134&&!s.blackout)return true; // floodlight that can be extinguished
 for(const p of PEDESTALS)if(dist(x,y,p.x,p.y)<96)return true; // stand safely at control panels
 for(let n=0;n<5;n++)if(s.code===4&&dist(x,y,corridorBulbs[n],582)<101)return true;
 return false;
};
const lit=(x,y)=>fixedLit(x,y)||dist(x,y,s.cartX,584)<122;
const hidden=()=>lit(s.x,s.y-42);
function die(reason){
 if(s.dead||s.shield>0||s.won)return;
 s.dead=true;s.deathTime=.95;s.deaths++;s.vx=0;s.vy=0;
 s.spiderAlert=0;s.cartGrab=false;s.glowPulse=.9;
 say('СПАЛАХ ЗГАС: '+reason+' · ПРОГРЕС ЗБЕРЕЖЕНО',3);
}
function respawn(){
 s.dead=false;s.x=100;s.y=628;s.vx=0;s.vy=0;s.ground=true;
 s.shield=1.8;s.bright=.12;s.trail=[];s.spiderAlert=0;s.glowPulse=.2;s.cartGrab=false;
}
function badCode(){
 s.wrong++;s.code=0;s.codeFlash=.9;
 say('ПОМИЛКА ПОСЛІДОВНОСТІ! ЛАМПИ СКИНУТО. ПЕРЕВІР ЗАПИС У ТЕМРЯВІ.',4.4);
 if(s.pistonState==='idle'){s.pistonState='warn';s.pistonClock=.85;}
}
function pressBeacon(n){
 if(!s.clueSeen){say('СПОЧАТКУ ЗНАЙДИ ШИФР. ВИМКНИ СВІТЛО В АРХІВІ.',3.4);return;}
 if(s.code===4)return;
 if(SEQUENCE[s.code]===n){
  s.code++;s.codeFlash=.5;s.glowPulse=.65;
  say('СИГНАЛ '+s.code+'/4 · ПРАВИЛЬНИЙ СИМВОЛ!',2.9);
  if(s.code===4)say('ШИФР РОЗКРИТО! КОРИДОР ОСВІТЛЕНО. АЛЕ СТІНА ЩЕ ЦІЛА.',5.4);
 }else badCode();
}
if(i.reset){Object.assign(s,make());s.shield=1.45;}
if(dt){
 s.time+=dt;s.msgTime=Math.max(0,s.msgTime-dt);s.codeFlash=Math.max(0,s.codeFlash-dt*2);
 s.glowPulse=Math.max(0,s.glowPulse-dt*2);
 s.shield=Math.max(0,s.shield-dt);
 if(s.dead){s.deathTime-=dt;if(s.deathTime<=0)respawn();}
}
if(dt&&!s.won){
 // A WRONG combination releases a warning piston; only the warning makes it fair.
 if(s.pistonState==='warn'){
  s.pistonClock-=dt;
  if(s.pistonClock<=0){s.pistonState='drop';s.pistonY=56;}
 }else if(s.pistonState==='drop'){
  s.pistonY=Math.min(613,s.pistonY+770*dt);
  if(!s.dead&&Math.abs(s.x-692)<41&&Math.abs(s.y-s.pistonY)<90)die('АВАРІЙНИЙ ПРЕС');
  if(s.pistonY>=613){s.pistonState='rise';s.pistonClock=.35;}
 }else if(s.pistonState==='rise'){
  s.pistonClock-=dt;
  if(s.pistonClock<=0){s.pistonY=Math.max(55,s.pistonY-500*dt);if(s.pistonY<=55)s.pistonState='idle';}
 }
}
if(!s.dead&&!s.won&&dt){
 const direction=Number(i.r)-Number(i.l);
 if(direction!==0)s.face=direction;
 const onResin=s.ground&&s.x>268&&s.x<375&&s.y>600;
 const maxSpeed=i.crouch?71:onResin?100:210;
 const target=direction*maxSpeed;
 const accel=direction===0?(s.ground?2050:900):(s.ground?1430:870);
 s.vx+=clamp(target-s.vx,-accel*dt,accel*dt);
 if(s.cartGrab){
  // The cart's safe light moves together with its carrier; it needs no physics cheats.
  const limitLeft=360,limitRight=1000;
  if((s.cartX<=limitLeft&&direction<0)||(s.cartX>=limitRight&&direction>0)){s.vx=0;}
 }
 if(s.ground)s.coyote=.12;else s.coyote=Math.max(0,s.coyote-dt);
 if(i.j&&!s.jumpHeld)s.jumpBuf=.13;
 else s.jumpBuf=Math.max(0,s.jumpBuf-dt);
 if(s.jumpBuf>0&&(s.ground||s.coyote>0)&&!s.cartGrab&&!i.crouch){
  s.vy=-570;s.ground=false;s.coyote=0;s.jumpBuf=0;s.jumpHold=0;
  s.glowPulse=.18;
 }
 if(s.jumpHeld&&!i.j&&s.vy< -160)s.vy*=.57;
 s.jumpHeld=i.j;
 if(!s.ground){
  if(s.vy<0&&i.j&&s.jumpHold<.19){s.vy+=780*dt;s.jumpHold+=dt;}
  else s.vy+=(s.vy<0?1230:1360)*dt;
  s.vy=clamp(s.vy,-590,790);
 }
 const oldFeet=s.y,oldX=s.x;
 s.x=clamp(s.x+s.vx*dt,17,1262);s.y+=s.vy*dt;
 let landed=false;
 for(const p of P)if(s.vy>=0&&oldFeet<=p.y+8&&s.y>=p.y&&s.x+14>p.x&&s.x-14<p.x+p.w){
  s.y=p.y;s.vy=0;landed=true;break;
 }
 if(!s.ground&&landed)s.landTimer=.16;
 s.ground=landed;s.landTimer=Math.max(0,s.landTimer-dt);
 // Wall: its broken crawl-space is strictly accessible at floor level while crouching.
 const triesWall=oldX<=WALL.x&&s.x>WALL.x-15||oldX>=WALL.x+39&&s.x<WALL.x+39;
 if(triesWall){
  const canCrawl=s.wallBroken&&i.crouch&&s.y>602;
  if(!canCrawl&&oldX<=WALL.x&&s.x>WALL.x-15){s.x=WALL.x-15;s.vx=0;}
  if(!canCrawl&&oldX>=WALL.x+39&&s.x<WALL.x+39){s.x=WALL.x+39;s.vx=0;}
 }
 if(s.y>770)die('ПРОВАЛЛЯ');
 const prevX=oldX;
 if(s.cartGrab){
  s.cartX=clamp(s.cartX+s.x-prevX,360,1000);
  s.x=clamp(s.cartX+s.cartSide*64,17,1262);
 }
 // Auto drop carrying if feet leave ground.
 if(s.cartGrab&&!s.ground)s.cartGrab=false;
 // G grabs / releases the light cart. Its *position* is essential to the pressure switch.
 if(i.grab&&!s.gHeld){
  if(s.cartGrab){s.cartGrab=false;say('ВІЗОК ВІДПУЩЕНО. ВІН ЗАЛИШИВСЯ ОСВІТЛЮВАТИ ПРОСТІР.',3);}
  else if(s.ground&&Math.abs(s.x-s.cartX)<93&&s.y>590){
   s.cartGrab=true;s.cartSide=s.x<s.cartX?-1:1;
   s.x=s.cartX+s.cartSide*64;say('ТИ ШТОВХАЄШ ЛАМПУ. СВІТЛОВА ЗОНА РУХАЄТЬСЯ РАЗОМ З НЕЮ.',3.5);
  }
 }
 s.gHeld=i.grab;
 const onPlate=s.cartX>947&&s.cartX<1003;
 s.plateTime=clamp(s.plateTime+(onPlate?dt*1.95:-dt*.52),0,1);
 if(s.plateTime>=1&&!s.wallBroken){
  s.wallBroken=true;s.glowPulse=.7;
  say('ГІДРАВЛІЧНИЙ ПРЕС ПРОБИВ СТІНУ! ВНИЗУ УТВОРИЛАСЯ ЩІЛИНА. S — ПРИСІСТИ.',5.1);
 }
 // E near the roof switch, one of four coded beacons, or the hidden key.
 if(i.use&&!s.eHeld){
  const nearSwitch=dist(s.x,s.y-37,SWITCH.x,SWITCH.y)<78;
  const nearKey=dist(s.x,s.y-39,KEY.x,KEY.y)<68;
  if(nearKey&&!s.key&&s.blackout){
   s.key=true;s.glowPulse=.45;say('ТИ ЗНАЙШОВ КЛЮЧ У ТЕМРЯВІ! ТЕПЕР ЗАВЕРШИ ШИФР.',4);
  }else if(nearSwitch){
   s.blackout=!s.blackout;
   if(s.blackout)say('АРХІВ ПОГАС! ДИВИСЬ НА ГЛІФИ НАД ГОЛОВОЮ — ЦЕ ПОРЯДОК ЛАМП.',5);
   else say('ГОЛОВНЕ СВІТЛО УВІМКНЕНО. ШИФР ТИ ВЖЕ БАЧИВ.',3);
  }else{
   const n=PEDESTALS.findIndex(p=>dist(s.x,s.y-43,p.x,p.y)<80);
   if(n>=0)pressBeacon(n);
  }
 }
 s.eHeld=i.use;
 if(s.blackout&&!s.clueSeen){
  s.clueTime+=dt;
  if(s.clueTime>.45){s.clueSeen=true;say('ЗАПАМ’ЯТАЙ: III → I → IV → II. КЛЮЧ ТЕЖ ВИДНО ЛИШЕ В ТЕМРЯВІ.',5.1);}
 }
 // The only stealth law: uncovered Spalakh is noticed in the dark.
 const luminosity=.12+Math.min(1,Math.abs(s.vx)/210)*.77+(s.glowPulse>.1?.08:0);
 s.bright+=(clamp(luminosity,.12,1)-s.bright)*(1-Math.exp(-dt*(s.bright<luminosity?7.8:3.0)));
 s.trailAccum+=dt;
 if(Math.abs(s.vx)>55&&s.trailAccum>.03){
  s.trail.push({x:s.x-s.face*16,y:s.y-46,age:0,p:s.bright});
  s.trailAccum=0;
 }
 for(const point of s.trail)point.age+=dt;
 s.trail=s.trail.filter(p=>p.age<.88).slice(-33);
 let nearSpider=false;
 for(const x of spiderBases){
  const sx=x+Math.sin(s.time*(.56+x*.001))*13;
  if(Math.abs(s.x-sx)<140&&Math.abs(s.y-43-590)<125&&!hidden())nearSpider=true;
 }
 s.spiderAlert=clamp(s.spiderAlert+(nearSpider?dt*1.18:-dt*1.5),0,1.2);
 if(s.spiderAlert>=1)die('ПАВУК ПОМІТИВ СПАЛАХА У ТЕМРЯВІ');
 // End of journey: break through wall, return with key, light the corridor.
 if(s.x>1237&&s.y>589){
  if(s.code===4&&s.wallBroken&&s.key&&hidden()){
   s.won=true;s.glowPulse=.9;
   say('АРХІВ ТІНЕЙ ПРОЙДЕНО: КЛЮЧ, ШИФР, ПРОЛАМАНА СТІНА!',99);
  }else{
   s.x=1211;s.vx=0;
   say('ВИХІД ЗАМКНЕНО. ПОТРІБНІ КЛЮЧ, ШИФР І ПРОЛАМАНА СТІНА.',2);
  }
 }
}
s.gHeld=i.grab;s.eHeld=i.use;
