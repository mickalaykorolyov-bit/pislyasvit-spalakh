// R05 / ЗАБІГ У ТЕМРЯВІ: blackout, speed test, spiders, glow-catch sensors.
const ROOM=5;
spawn({x:112,y:635});
if(!S.initialized){S.initialized=true;S.cellTimers=[0,0,0];S.webObtained=false;setCheckpoint(5,112,635);message('НА ДАЛЕКОМУ КРАЇ ПАВУТИННЯ Є ЛІТЕРА. ВИМКНИ ОСВІТЛЕННЯ ТА БІЖИ!',5.7);}
const SW={x:216,y:588},WEB={x:1140,y:579},EXIT={x:73,y:588};
const SENSOR_X=[402,727,1000],LAMPS=[424,751,1020];
const SPIDERS=[{x:589,y:627,scale:1.1},{x:902,y:627,scale:1.12},{x:1102,y:627,scale:1.26}];
const PLATFORMS=[{x:0,y:635,w:1280,h:85},{x:421,y:570,w:190,h:18},{x:732,y:559,w:167,h:18}];
if(!D.chaseBlackout)S.cellTimers=[0,0,0];
let pools=D.chaseBlackout?[{x:124,y:581,r:158}]:[{x:242,y:574,r:290},{x:655,y:570,r:290},{x:1091,y:570,r:280}];
for(let n=0;n<3;n++)if(S.cellTimers[n]>0)pools.push({x:LAMPS[n],y:576,r:151});
if(D.oxygenParts.chase)pools=[{x:182,y:575,r:240},{x:501,y:575,r:245},{x:821,y:575,r:241},{x:1123,y:575,r:255}];
S.worldLight=pools;
if(D.chaseBlackout&&!D.oxygenParts.chase){
 D.chaseClock=Math.max(0,D.chaseClock-DT);
 if(D.chaseClock<=0){
  // Unlike an instant kill, blackout is a visible countdown.
  D.chaseBlackout=false;S.cellTimers=[0,0,0];S.fx=.8;hurt('ТЕМРЯВА НАЗДОГНАЛА СПАЛАХА');
  message('ТЕМРЯВА ПОГЛИНУЛА КОРИДОР. СПРОБУЙ ШВИДШИЙ ЗАБІГ!',4.5);
 }
}
for(let n=0;n<3;n++)S.cellTimers[n]=Math.max(0,S.cellTimers[n]-DT);
if(!S.dead&&!S.transition&&!D.gameWon){
 movePlayer(PLATFORMS,{deathY:800});
 if(E){
  if(dist(S.x,S.y-36,EXIT.x,EXIT.y)<98&&(!D.chaseBlackout||D.oxygenParts.chase)){
   goTo(2,'FROM_CHASE',{x:1012,y:2460});
  }else if(dist(S.x,S.y-35,SW.x,SW.y)<100&&!D.oxygenParts.chase){
   if(!D.chaseBlackout){
    D.chaseBlackout=true;D.chaseClock=15;S.fx=.8;S.alert={};S.cellTimers=[0,0,0];
    message('СВІТЛО ВИМКНУЛОСЯ! 15 СЕКУНД. БІЖИ ДО ПАВУТИНИ ПРАВОРУЧ!',4.1);
   }
  }else if(dist(S.x,S.y-38,WEB.x,WEB.y)<84){
   if(!D.chaseBlackout&&!D.oxygenParts.chase)message('У ПАВУТИНІ НІЧОГО НЕ ВИДНО. СПОЧАТКУ ВИМКНИ СВІТЛО.',3.7);
   else if(!D.oxygenParts.chase){
    D.oxygenParts.chase=true;D.chaseBlackout=false;S.fx=1;
    message('ЛІТЕРА «Ю» ЗДОБУТА! ЕКСТРЕНЕ СВІТЛО ВІДНОВИЛОСЯ. ПОВЕРНИСЬ ЛІВОРУЧ.',5.3);
    setCheckpoint(5,1125,635);
   }
  }
 }
 // Sensors react only to Spalakh's luminous fast-moving body, switching on brief shelters.
 if(D.chaseBlackout&&!D.oxygenParts.chase){
  for(let n=0;n<3;n++){
   if(Math.abs(S.x-SENSOR_X[n])<72&&S.y>560&&Math.abs(S.vx)>153&&S.brightness>.64){
    S.cellTimers[n]=Math.max(S.cellTimers[n],2.0);
   }
  }
  // Vision becomes active in darkness; a moving light source buys time, not immunity.
  spiders(SPIDERS,pools,143);
 }
 if(!D.chaseBlackout&&D.oxygenParts.chase)S.alert={};
}
deathTick();
if(FG.ok){
 drawBase();const w=FG.world,b=FG.back;w.clear();
 for(const p of PLATFORMS)platform(w,p);
 drawLights(pools);
 if(D.chaseBlackout&&!D.oxygenParts.chase){
  rect(b,278,516,1002,118,0x03050c,.78);
  for(const p of pools)glow(b,p.x,p.y,p.r,0x98f0ea,.12);
 }
 rect(w,SW.x-32,558,64,62,D.chaseBlackout?0x743952:0x315064,.98);
 disk(w,SW.x,587,18,D.chaseBlackout?0xff6883:0xb4f5dd);
 glow(w,SW.x,587,42,D.chaseBlackout?0xff6a82:0xa7f2e9,.14);
 for(let n=0;n<3;n++){
  const x=SENSOR_X[n],on=S.cellTimers[n]>0||D.oxygenParts.chase;
  w.lineStyle(3,on?0x92ffe0:0xa06c81,.92);w.drawCircle(x,594,27);
  disk(w,x,594,12,on?0x89ffe0:0x994e69);
  rect(w,LAMPS[n]-12,536,24,8,0x476e81,.90);
  disk(w,LAMPS[n],549,10,on?0x9dfdef:0x7f5a73);
  if(on)glow(w,LAMPS[n],580,120,0x8cf6db,.16);
 }
 // Sticky-web corridor and occasional falling fragments on ceiling.
 for(let x=500;x<1200;x+=140){
  for(let y=139;y<349;y+=37){
   ln(w,x-34,y,x+35,y+19,0xb5a2c4,.14,2);
   ln(w,x-30,y+24,x+35,y+3,0xb1a1be,.11,2);
  }
 }
 if(!D.oxygenParts.chase){
  glow(w,WEB.x,WEB.y,62,D.chaseBlackout?0xdb95f9:0x7f7285,.20);
  for(let q=0;q<6;q++)ln(w,WEB.x-46+q*15,540,WEB.x+38-q*8,618,0xdbb9f5,.35,2);
  disk(w,WEB.x,WEB.y,13,D.chaseBlackout?0xe7c5fc:0x5e6477);
 }
 for(let n=0;n<SPIDERS.length;n++)drawSpider(w,SPIDERS[n],n,pools);
 rect(w,47,547,70,88,0x23505b,.97);w.lineStyle(3,0xa0f8e1,.89);w.drawRoundedRect(47,547,70,88,7);
 if(D.chaseBlackout&&!D.oxygenParts.chase){
  const factor=clamp(D.chaseClock/15,0,1);
  rect(w,570,135,450,15,0x372738,.93);
  rect(w,573,137,444*factor,11,D.chaseClock<5?0xff596d:0xffae8d,.95);
  if(FG.front){
   FG.front.clear();FG.front.lineStyle(4,0xff5678,1-factor);FG.front.drawRoundedRect(6,7,1268,706,12);
  }
 }
}
drawActor(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let objective='У ПАВУТИНІ ПРАВОРУЧ ЗАХОВАНО ЛІТЕРУ. НАТИСНИ E НА ЧЕРВОНОМУ ПЕРЕМИКАЧІ.';
if(D.chaseBlackout&&!D.oxygenParts.chase)
 objective='ТЕМРЯВА: '+D.chaseClock.toFixed(1)+' С! ТРИМАЙ SHIFT+D, ПРОБІГАЙ СЕНСОРИ СВОГО СЯЙВА. БІЛЯ ПАВУТИНИ E.';
else if(D.oxygenParts.chase)objective='ЛІТЕРА «Ю» Є! СВІТЛО ПОВЕРНУЛОСЯ. ІДИ У ЛІВІ ДВЕРІ ДО ШАХТИ.';
hudBase('05','ТЕМНИЙ ЗАБІГ',objective,pools);
setText('W01',D.chaseBlackout?'ЗАЛИШИЛОСЯ '+D.chaseClock.toFixed(1)+' с':'УВІМКНУТИ ТЕМРЯВУ · E');
setText('W02','РУХАЙСЯ ШВИДКО: SHIFT + D');
setText('W03',D.oxygenParts.chase?'«Ю» ОТРИМАНО':'ПАВУТИНА → «Ю»');
setText('W04','У ТЕМРЯВІ ПАВУКИ БАЧАТЬ СПАЛАХА');
setText('W05','');
setText('WLamp','05 ↔ ШАХТА');
})();
