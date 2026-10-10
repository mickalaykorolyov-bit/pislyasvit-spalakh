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

// World visualization. All collision bounds match simulation above.
let g=runtimeScene.__shadowArchiveGraphics;
if(!g){
 g=runtimeScene.__shadowArchiveGraphics={ok:false};
 try{
  const renderer=runtimeScene.getLayer('').getRenderer();
  if(typeof PIXI==='undefined'||!PIXI.Graphics||!renderer||!renderer.addRendererObject)throw Error('PIXI unavailable');
  for(const [name,z] of [['back',-35],['stage',8],['ribbon',15],['overlay',27]]){
   g[name]=new PIXI.Graphics();renderer.addRendererObject(g[name],z);
  }
  g.ok=true;
 }catch(e){g.error=String(e);}
}
function disk(gg,x,y,r,col,alpha=1){
 gg.lineStyle(0);gg.beginFill(col,alpha);gg.drawCircle(x,y,r);gg.endFill();
}
function box(gg,x,y,w,h,col,alpha=1,round=9){
 gg.lineStyle(0);gg.beginFill(col,alpha);gg.drawRoundedRect(x,y,w,h,Math.min(round,h/3));gg.endFill();
}
function line(gg,x,y,X,Y,c=0x7b9cac,a=.7,thick=2){
 gg.lineStyle(thick,c,a);gg.moveTo(x,y);gg.lineTo(X,Y);
}
function glow(gg,x,y,r,c,a){
 for(let k=6;k>=1;k--)disk(gg,x,y,r*(.32+k*.14),c,a*(7-k)/30);
}
if(g.ok){
 const b=g.back,w=g.stage,fx=g.ribbon,overlay=g.overlay;
 b.clear();w.clear();fx.clear();overlay.clear();
 // Archive's outline and a subtly reactive grid.
 box(b,0,0,1280,720,0x06101c);
 b.lineStyle(1,0x35576b,.20);
 for(let x=24;x<1280;x+=61){b.moveTo(x,0);b.lineTo(x,720);}
 for(let y=23;y<720;y+=57){b.moveTo(0,y);b.lineTo(1280,y);}
 for(const [x,y,ww,hh] of [[44,110,62,480],[310,31,44,290],[664,48,61,270],[1140,61,52,284]]){
  box(b,x,y,ww,hh,0x0c2a3c,.50);
  line(b,x+12,y+6,x+12,y+hh-6,0x9abfd2,.15,1);
 }
 // Put corridor surface behind every lamp's light so cover is ALWAYS visually evident.
 box(b,691,535,589,94,0x0d1a29,.70);
 // An archive fresco that lights up only in darkness.
 box(b,438,135,334,119,s.blackout?0x1f2342:0x102031,s.blackout?.91:.30);
 b.lineStyle(2,s.blackout?0x9887e9:0x345970,s.blackout?.87:.35);
 b.drawRoundedRect(438,135,334,119,8);
 for(let x=454;x<748;x+=20)line(b,x,146,x,244,0x9b8bde,s.blackout?.10:.04,1);
 if(s.blackout){glow(b,600,193,123,0x8a78e0,.10);for(let n=0;n<4;n++)disk(w,482+n*82,197,21,0x5b527f,.55);}
 else for(let n=0;n<5;n++)line(b,464+n*55,155,475+n*48,227,0x8ba8b4,.10,3);
 // Platform structure and boundaries.
 for(const p of P){
  box(w,p.x,p.y,p.w,p.h,p.y>600?0x1f3847:0x273e52,.98);
  box(w,p.x+2,p.y,p.w-4,4,0x8fb6c5,.72);
  for(let xx=p.x+12;xx<p.x+p.w-10;xx+=33)line(w,xx,p.y+8,xx-8,p.y+16,0x7b9fac,.24,1);
 }
 // Resin slows movement but never removes input from the player.
 box(b,269,615,107,12,0x7b4c83,.34);
 for(let xx=274;xx<375;xx+=21){
  glow(b,xx,623,17,0xa6599d,.10);
  disk(w,xx+6,621,3,0xd58bd0,.42);
 }
 // Shelters are correctly tied to the same inLight() used by spiders.
 glow(b,110,583,139,0x9ceef3,.17);
 disk(w,110,557,8,0xb7f9e8);
 box(w,103,539,14,6,0xacfff2);
 if(!s.blackout){glow(b,474,582,133,0x9be8ee,.15);disk(w,474,551,9,0xc3ffef);}
 else{
  line(w,474,525,474,557,0xaa6575,.75,2);
  disk(w,474,556,11,0xab6577);
 }
 // Four control pedestals; active signal colors encode the chosen sequence.
 for(let n=0;n<4;n++){
  const p=PEDESTALS[n];
  const active=SEQUENCE.slice(0,s.code).includes(n);
  const col=active?0x81ffbd:0xf1bb8b;
  glow(b,p.x,p.y,99,0xbbe9ed,.075);
  box(w,p.x-30,p.y-16,60,34,0x2a4053,.96);
  w.lineStyle(4,col,.95);w.drawCircle(p.x,p.y-8,17);
  disk(w,p.x,p.y-8,8,active?0x88ffbc:0xe9a475);
  if(active)glow(w,p.x,p.y-9,34,0x7dffc2,.18);
  line(w,p.x,p.y+20,p.x,p.y+36,0x7e91a4,.60,2);
 }
 // Blackout shutter in central zone is a hand-operated flip handle.
 const swCol=s.blackout?0xe3a6ff:0xa4fbec;
 box(w,SWITCH.x-27,SWITCH.y-14,54,29,0x294155,.97);
 disk(w,SWITCH.x,SWITCH.y-2,10,swCol);
 line(w,SWITCH.x,SWITCH.y-6,SWITCH.x+(s.blackout?15:-13),
 SWITCH.y-29,swCol,1,5);
 glow(w,SWITCH.x,SWITCH.y,32,swCol,.11);
 // Hidden amber key. Visible and pickable ONLY when blackout is engaged.
 if(s.blackout&&!s.key){
  glow(w,KEY.x,KEY.y,37,0xe8be83,.23);
  w.lineStyle(4,0xffdb9b,1);w.drawCircle(KEY.x-10,KEY.y-6,10);
  line(w,KEY.x,KEY.y-6,KEY.x+23,KEY.y-6,0xffdf9f,.97,4);
  line(w,KEY.x+16,KEY.y-6,KEY.x+16,KEY.y+1,0xffdf9f,.94,3);
 }
 // Cart with self-contained illumination. G drags it physically onto its scale.
 glow(b,s.cartX,581,125,0xaff8ed,.21);
 box(w,s.cartX-35,586,70,32,s.cartGrab?0x385963:0x314a5a,.99);
 box(w,s.cartX-18,566,36,22,0x78c5d5,.94);
 disk(w,s.cartX,565,8,0xeaffec);
 for(const side of [-1,1]){
  disk(w,s.cartX+side*24,624,10,0x192d3b);
  disk(w,s.cartX+side*24,624,5,0x7b9dab);
 }
 line(w,s.cartX-45,584,s.cartX+45,584,0xc5fdec,.44,2);
 // Plate only reads the weight of cart, NEVER the player.
 const onPlate=s.cartX>947&&s.cartX<1003;
 box(w,PRESSURE.x-53,623,107,7,onPlate?0x367f6b:0x815460,.95);
 box(w,PRESSURE.x-47,624,94*s.plateTime,4,0x9effc1,.97);
 for(let x=PRESSURE.x-36;x<PRESSURE.x+50;x+=21)
  line(w,x,609,x,621,onPlate?0xa4ffc8:0xe5ac82,.50,2);
 // The demolition tool turns a solid wall into a small crouch-only hole.
 box(w,WALL.x,490,39,s.wallBroken?93:138,0x415162,.97);
 for(let y=505;y<584;y+=23)line(w,WALL.x+6,y,WALL.x+32,y+14,0xa4a8a8,.21,2);
 if(s.wallBroken){
  box(w,WALL.x+3,582,33,9,0x705f60,.93);
  for(const [x,y] of [[WALL.x-8,609],[WALL.x+45,618],[WALL.x+55,604]]){
   box(w,x,y,12,8,0x637580,.8);
  }
  glow(w,WALL.x+22,606,40,0xa2f3bc,.12);
 }else{
  w.lineStyle(3,0xdc8c86,.85);
  w.moveTo(WALL.x+8,527);w.lineTo(WALL.x+21,555);w.lineTo(WALL.x+10,588);
  box(w,WALL.x,615,39,13,0x536273,.96);
 }
 // Visible emergency hydraulic piston punishes wrong code input after WARNING.
 if(s.pistonState!=='idle'){
  const alarm=s.pistonState==='warn';
  box(w,681,56,23,Math.max(26,s.pistonY-32),0x486075,.80);
  box(w,656,s.pistonY-12,72,26,alarm?0xa85d6c:0x967d83,.96);
  if(alarm){
   glow(b,692,600,62,0xff5f78,.17+.11*Math.sin(s.time*17)*Math.sin(s.time*17));
   line(w,692,95,692,628,0xff6f88,.65,2);
  }
 }
 // Powered corridor: physical beams are drawn on top of the dark base and the cart's glow.
 for(let n=0;n<5;n++){
  const x=corridorBulbs[n],on=s.code===4;
  line(w,x,529,x,554,on?0x9effdc:0x776173,.73,2);
  disk(w,x,561,10,on?0xadffea:0x916d78);
  if(on)glow(b,x,580,104,0x9afbef,.22);
 }
 // Each spider has a live position. Spiders see ONLY if light doesn't cover Spalakh.
 for(let n=0;n<spiderBases.length;n++){
  const sx=spiderBases[n]+Math.sin(s.time*(.56+spiderBases[n]*.001))*13,sy=606;
  const safe=lit(sx,sy-29),c=safe?0x647e8e:0xa85269;
  const scale=n===3?1.38:1;
  for(const side of [-1,1])for(let arm=0;arm<4;arm++){
   const yy=sy-19*scale+arm*7*scale;
   line(w,sx+side*14*scale,yy,sx+side*(31+arm*6)*scale,
   yy-16*scale+arm*7*scale,c,.92,n===3?4:2.6);
  }
  disk(w,sx,sy-30*scale,18*scale,0x18212c);
  disk(w,sx-7*scale,sy-37*scale,3.2*scale,safe?0x668a93:0xff657c);
  disk(w,sx+7*scale,sy-37*scale,3.2*scale,safe?0x668a93:0xff657c);
  if(!safe)glow(w,sx,sy-35*scale,31*scale,0xf15c75,.13);
 }
 // Final locked exit.
 const doorOpen=s.code===4&&s.wallBroken&&s.key;
 box(w,1230,547,46,81,doorOpen?0x205e4f:0x492b3f,.97);
 w.lineStyle(3,doorOpen?0x98ffce:0xf0849d,.97);w.drawRoundedRect(1230,547,46,81,7);
 for(let n=0;n<4;n++)box(w,1238,557+n*17,28,4,doorOpen?0x9affcf:0xe48494,.86);
 if(doorOpen)glow(w,1250,594,51,0x82ffc0,.17);
 // The character's own crimson trail is anchored to body position, not an overlay follower.
 for(const p of s.trail){
  const a=(1-p.age/.88)*p.p;
  glow(fx,p.x,p.y,22,0xff5478,.14*a);
  disk(fx,p.x,p.y,4+5*p.p,0xf75b7d,.59*a);
 }
 const inShelter=hidden();
 if(!s.dead){
  glow(fx,s.x,s.y-48,36+s.bright*32,0xf54c78,inShelter?.025:.055+s.bright*.10);
  glow(fx,s.x,s.y-18,28,0xff8698,inShelter?.025:.11);
 }
 if(s.dead)glow(overlay,s.x,s.y-45,40+78*(1-s.deathTime/.95),0xfa587c,.29);
 if(s.spiderAlert>.03){
  overlay.lineStyle(3,0xf95a79,clamp(s.spiderAlert,0,1)*.83);
  overlay.drawRoundedRect(6,7,1268,707,13);
  box(overlay,951,108,283*clamp(s.spiderAlert,0,1),6,0xfa5878,.83);
 }
 if(s.codeFlash>.03){
  overlay.lineStyle(3,0xffb869,s.codeFlash*.55);
  overlay.drawRoundedRect(14,14,1250,685,14);
 }
}

// Spalakh is the original sprite with 52 existing animation frames.
const player=get('Player');
if(player){
 const movement=Math.abs(s.vx);
 const anim=s.dead?'Fall':!s.ground?(s.vy<0?'Jump':'Fall'):
 s.landTimer>0?'Land':i.crouch?'Crouch':movement>159?'Run':movement>22?'Slow':'Idle';
 if(player.getAnimationName&&player.getAnimationName()!==anim&&player.setAnimationName)player.setAnimationName(anim);
 if(player.setAnimationSpeedScale)player.setAnimationSpeedScale(anim==='Run'?clamp(movement/240,.78,1.3):1);
 const scale=i.crouch?.49:.55;
 if(player.setScale)player.setScale(scale);
 player.setPosition(s.x-192*scale,s.y-242*scale);
 if(player.flipX)player.flipX(s.face<0);
 if(player.setOpacity)player.setOpacity(s.dead?0:(hidden()?54:clamp(160+s.bright*89,160,255)));
}
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
hud('HUDTitle','ПІСЛЯСВІТ   /   АРХІВ ТІНЕЙ');
hud('HUDStatus','ШИФР '+s.code+'/4     КЛЮЧ '+(s.key?'✓':'○')+
 '     ПРОЛАМ '+(s.wallBroken?'✓':'○')+
 '     '+(hidden()?'НЕПОМІТНИЙ У СВІТЛІ':'ПОМІТНИЙ У ТЕМРЯВІ')+
 '     ЗАГИБЕЛЕЙ '+s.deaths);
let task='ОГЛЯНЬ КІМНАТУ. ЗНАЙДИ ВИМИКАЧ, ЗАШИФРОВАНІ ЛАМПИ ТА ВІЗОК ЗІ СВІТЛОМ.';
if(!s.clueSeen)task='01 / У ЦЕНТРІ ВНИЗУ Є ВИМИКАЧ. НАТИСНИ E, ЩОБ ПОГАСИТИ АРХІВ І ПОБАЧИТИ ШИФР.';
else if(!s.key&&s.blackout&&Math.abs(s.x-KEY.x)<150&&s.y<490)
 task='ЗОЛОТИЙ КЛЮЧ З’ЯВЛЯЄТЬСЯ ЛИШЕ В ТЕМРЯВІ. ПІДІЙДИ Й НАТИСНИ E.';
else if(!s.key&&!s.blackout)task='ПОВЕРНИСЯ ДО ВИМИКАЧА І ПОГАСИ АРХІВ. У ТЕМРЯВІ Є ЩЕ ОДИН СЕКРЕТ.';
else if(s.code<4)task='02 / НАТИСКАЙ E БІЛЯ ЛАМП У ПОСЛІДОВНОСТІ ГЛІФІВ III → I → IV → II.';
else if(!s.wallBroken)task='03 / ПІДІЙДИ ДО ОСВІТЛЮВАЛЬНОГО ВІЗКА, НАТИСНИ G І ШТОВХАЙ ЙОГО НА ПРАВУ ВАГОВУ ПЛИТУ.';
else if(s.x>1041&&s.y>535)task='04 / ПРИСІДАЙ S І ПРОЛІЗЬ У ПРОЛАМАНУ СТІНУ, ПОТІМ ДОЙДИ ДО ВИХОДУ.';
else task='У ТЕБЕ Є КЛЮЧ І ШИФР. СТІНА ЗРУЙНОВАНА. ПІДІЙДИ ДО ПРАВОГО ВИХОДУ.';
if(s.cartGrab)task='ТИ ШТОВХАЄШ СВІТЛО. ВЕДИ ВІЗОК ПРАВОРУЧ ДО ПЛИТИ. G — ВІДПУСТИТИ.';
if(s.x>705&&s.y>568&&!hidden())task='ПАВУКИ ПОМІТИЛИ СПАЛАХА! СХОВАЙСЯ В ОСВІТЛЕНУ ЗОНУ АБО ВЕДИ ВІЗОК-СВІТЛО.';
if(s.pistonState==='warn')task='НЕПРАВИЛЬНА КОМБІНАЦІЯ! ВЕЛИКИЙ ПРЕС ЗАРАЗ ВПАДЕ! ВІДІЙДИ ВІД ЦЕНТРУ.';
if(s.won)task='АРХІВ ТІНЕЙ ПРОЙДЕНО: СПАЛАХ ВИКОРИСТАВ САМУ ТЕМРЯВУ ЯК ПІДКАЗКУ.';
hud('HUDTask',task);
hud('HUDHint','A/D — РУХ   SPACE — СТРИБОК   E — ВЗАЄМОДІЯ   G — ВЕЗТИ / ВІДПУСТИТИ ЛАМПУ   S — ПРИСІСТИ   R — СПОЧАТКУ');
hud('HUDMessage',s.msgTime>0?s.msg:'');
for(let n=0;n<4;n++){
 const on=SEQUENCE.slice(0,s.code).includes(n);
 hud('W0'+(n+1),(on?'✓ ':'')+['I','II','III','IV'][n]);
}
hud('W05',s.blackout?'III  →  I  →  IV  →  II':'');
hud('WLamp',s.wallBroken?'СТІНА ЗРУЙНОВАНА · S — ПРОЛІЗТИ':'ВІЗОК ТИСНЕ НА ПЛИТУ → ГІДРАВЛІКА');
hud('HUDWin',s.won?'АРХІВ ТІНЕЙ ПРОЙДЕНО!':'');
const win=get('HUDWin');if(win&&win.setOpacity)win.setOpacity(s.won?255:0);
})();
