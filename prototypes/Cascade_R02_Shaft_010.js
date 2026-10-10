// R02 / ВЕРТИКАЛЬНА ШАХТА: three-layer parallax, falling ballast, global light modes.
const ROOM=2;
spawn({x:164,y:2460});
if(!S.initialized){
 S.initialized=true;S.camY=clamp(S.y-180,360,2190);
 if(D.arrival==='FROM_ARCHIVE')message('ПОВЕРНИСЬ З КЛЮЧЕМ ДО НИЖНЬОГО РЕГУЛЯТОРА НА ДНІ ШАХТИ.',5);
 else message('ЦЕ ВИСОКА ШАХТА. ПІДНІМАЙСЯ ПЛАТФОРМАМИ ДО ВАНТАЖУ ТА ВЕРХНІХ МЕХАНІЗМІВ.',6);
 setCheckpoint(2,S.x,S.y);
}
const floors=[
 {x:0,y:2460,w:1280,h:90},
 {x:230,y:2346,w:197,h:18},{x:401,y:2238,w:205,h:18},
 {x:580,y:2128,w:198,h:18},{x:774,y:2021,w:194,h:18},
 {x:923,y:1912,w:201,h:18},{x:721,y:1801,w:190,h:18},
 {x:507,y:1691,w:184,h:18},{x:303,y:1581,w:194,h:18},
 {x:121,y:1473,w:198,h:18},{x:314,y:1363,w:197,h:18},
 {x:524,y:1256,w:205,h:18},{x:741,y:1146,w:200,h:18},
 {x:950,y:1036,w:237,h:18},{x:746,y:929,w:212,h:18},
 {x:540,y:820,w:199,h:18},{x:333,y:714,w:196,h:18},
 {x:125,y:606,w:210,h:18},{x:317,y:499,w:201,h:18},
 {x:514,y:389,w:215,h:18},{x:713,y:285,w:211,h:18},
 {x:841,y:209,w:365,h:18}
];
const ballastLever={x:1085,y:995},topDial={x:970,y:175};
const lowerDial={x:641,y:2415},upperService={x:1128,y:170};
const spiderPlaces=[{x:891,y:2346},{x:622,y:1691},{x:356,y:1363},{x:930,y:1036,scale:1.12}];
let pools=[{x:154,y:2404,r:161},{x:1140,y:2404,r:171}];
if(D.lightMode==='A'){
 pools.push(
 {x:420,y:2207,r:194},{x:813,y:1944,r:178},
 {x:589,y:1660,r:172},{x:290,y:1400,r:167},
 {x:680,y:1174,r:174},{x:1005,y:992,r:184},
 {x:510,y:670,r:170},{x:969,y:223,r:186});
}else if(D.lightMode==='B'){
 pools.push({x:1105,y:225,r:170},{x:907,y:2430,r:150});
}else{
 pools.push({x:632,y:2410,r:197},{x:290,y:2413,r:167},{x:970,y:228,r:120});
}
S.worldLight=pools;
// The ballast exists persistently even when shaft is not the current scene.
// Simulation occurs while here; after landing, the archive's roof is permanently gone.
if(D.ballastPhase==='falling'){
 D.ballastV=Math.min(1160,D.ballastV+1550*DT);
 D.ballastY+=D.ballastV*DT;
 if(!S.dead&&Math.abs(S.x-1050)<48&&S.y>D.ballastY-27&&S.y<D.ballastY+125)
  hurt('ВАЖКИЙ БАЛАСТ');
 if(D.ballastY>=2415){
  D.ballastY=2415;D.ballastV=0;D.ballastPhase='settled';
  D.ballastDropped=true;D.archiveRoofBroken=true;D.shortcutOpen=true;
  S.fx=.92;
  message('УДАР! В АРХІВІ ПРОБИТО ПЕРЕКРИТТЯ. СЛУЖБОВИЙ СПУСК ВІДКРИТО!',6);
 }
}
if(!S.dead&&!S.transition&&!D.gameWon){
 movePlayer(floors,{deathY:2628,slow:(x,y)=>(
  (y>1560&&y<1745&&x>560&&x<720)||
  (y>2000&&y<2155&&x>670&&x<788)
 )});
 if(E){
  if(dist(S.x,S.y-34,84,2415)<91){
   goTo(1,'FROM_SHAFT',{x:161,y:635});
  }else if(dist(S.x,S.y-33,1179,2415)<92){
   if(D.ballastDropped&&(D.lightMode==='B'||D.keyCollected))
    goTo(3,'FROM_SHAFT',{x:100,y:635});
   else message('АРХІВ ЗАБЛОКОВАНО. ПОТРІБНО СКИНУТИ БАЛАСТ І ОСВІТИТИ АРХІВ РЕЖИМОМ B.',4);
  }else if(dist(S.x,S.y-32,lowerDial.x,lowerDial.y)<94){
   if(!D.keyCollected)message('НИЖНІЙ ПЕРЕМИКАЧ ЧЕКАЄ НА КЛЮЧ ІЗ АРХІВУ.',3.3);
   else{
    D.lightMode=D.lightMode==='C'?'B':'C';S.fx=.6;
    message(D.lightMode==='C'?'СВІТЛО ПІШЛО В ЗАМКОВУ ЗАЛУ! ПОВЕРТАЙСЯ ЛІВОРУЧ.':'СВІТЛО ПОВЕРНУЛОСЯ ДО АРХІВУ.',4.4);
    setCheckpoint(2,641,2460);
   }
  }else if(dist(S.x,S.y-39,ballastLever.x,ballastLever.y)<93){
   if(D.ballastPhase==='hanging'){
    D.ballastPhase='falling';D.ballastV=0;S.fx=.5;
    message('КРІПЛЕННЯ ВІДКРИТО. БАЛАСТ ПАДАЄ ЧЕРЕЗ УСЮ ШАХТУ!',5);
   }else message('КРІПЛЕННЯ ПОРОЖНЄ. БАЛАСТ УЖЕ ЗВІЛЬНЕНО.',2.8);
  }else if(dist(S.x,S.y-38,topDial.x,topDial.y)<99){
   if(D.ballastPhase!=='settled')message('СПОЧАТКУ ДОЧЕКАЙСЯ УДАРУ БАЛАСТУ. РЕГУЛЯТОР ЗАБЛОКОВАНИЙ.',4);
   else{
    D.lightMode=D.lightMode==='A'?'B':D.lightMode==='B'?'C':'A';S.fx=.68;
    message('СВІТЛОВИЙ РОЗПОДІЛ → '+D.lightMode+
      (D.lightMode==='B'?' · ТЕПЕР АРХІВ ОСВІТЛЕНО.':' · ПРОМЕНІ ПЕРЕНАПРАВЛЕНО.'),4.1);
   }
  }else if(dist(S.x,S.y-36,upperService.x,upperService.y)<94){
   if(D.shortcutOpen){
    message('СЛУЖБОВИЙ СПУСК ДОДОЛУ.',3);
    goTo(2,'SERVICE_BOTTOM',{x:1111,y:2460});
   }else message('СЛУЖБОВИЙ СПУСК ЗАБЛОКОВАНО БАЛАСТОМ.',2);
  }
 }
 if(S.y<1560&&S.y>1400&&D.lightMode==='A')setCheckpoint(2,217,1473);
 if(S.y<1110&&S.y>970&&D.lightMode==='A')setCheckpoint(2,1047,1036);
 if(S.y<330&&D.ballastDropped&&D.lightMode==='A')setCheckpoint(2,906,209);
 if(S.y>2370&&D.ballastDropped)setCheckpoint(2,S.x,2460);
 spiders(spiderPlaces,pools,123);
}
deathTick();
// Camera dead-zone and parallax are active only in this 2550-pixel scene.
const wantedCamera=clamp(S.y-160,360,2190);
S.camY+=(wantedCamera-S.camY)*(1-Math.exp(-DT*4.7));
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,S.camY,'',0);
if(FG.ok){
 drawBase(2550);
 // Far water moves 0.18x, mid pipes 0.48x, foreground cables 0.84x.
 const cameraOffset=S.camY-360;
 FG.far.y=cameraOffset*.82;
 FG.middle.y=cameraOffset*.52;
 FG.front.y=cameraOffset*.16;
 const w=FG.world,b=FG.back,front=FG.front;
 w.clear();front.clear();
 drawLights(pools);
 for(const p of floors)platform(w,p);
 // Shaft safety rails, pulleys and real scale cues.
 ln(w,18,80,18,2497,0x5b859b,.24,5);
 ln(w,1262,80,1262,2498,0x54748b,.31,6);
 for(let y=150;y<2510;y+=220){
  rect(b,33,y,48,18,0x2b4757,.44);
  rect(b,1198,y-13,47,16,0x2b4657,.40);
  ln(front,87,y-104,87,y+66,0x95a9b0,.12,3);
  ln(front,1179,y-110,1179,y+55,0x90a3ac,.11,4);
 }
 // Large falling weight with a warning line down a dedicated chute.
 for(let y=450;y<2450;y+=32)rect(w,1048,y,3,14,0xc48a7c,.18);
 if(D.ballastPhase!=='settled'){
  const by=D.ballastY;
  if(D.ballastPhase==='hanging')ln(w,1050,812,1050,by-29,0xc9a0a2,.87,4);
  glow(w,1050,by,75,D.ballastPhase==='falling'?0xef7289:0xedb38e,.13);
  rect(w,1011,by-30,79,63,D.ballastPhase==='falling'?0x8e6574:0x5c6f79,.98);
  for(let n=0;n<3;n++)rect(w,1023,by-18+n*17,55,8,0xbea2a1,.42);
 }else{
  rect(w,1007,2380,87,58,0x536977,.91);
  glow(w,1050,2396,75,0xd78781,.10);
 }
 // Lower entrance doors and the returning dial.
 for(const [x,open] of [[55,true],[1146,D.ballastDropped&&(D.lightMode==='B'||D.keyCollected)]]){
  rect(w,x,2370,86,89,open?0x244f50:0x3d354b,.96);
  w.lineStyle(3,open?0x8df4c2:0xb56e83,.96);w.drawRoundedRect(x,2370,86,89,9);
  for(let y=2385;y<2443;y+=16)disk(w,x+44,y,6,open?0x9ffbd0:0xc07a8a);
 }
 const dialColor=D.keyCollected?0x9ef8c5:0x96808e;
 glow(w,lowerDial.x,lowerDial.y,45,dialColor,.13);
 w.lineStyle(4,dialColor,.95);w.drawCircle(lowerDial.x,lowerDial.y,30);
 disk(w,lowerDial.x,lowerDial.y,12,0x3a5260);
 // Ballast control and global upper mode dial.
 for(const [p,on,c] of [[ballastLever,D.ballastPhase!=='hanging',0xfac587],
  [topDial,D.ballastDropped,0x98fff0],[upperService,D.shortcutOpen,0xa1cedc]]){
  glow(w,p.x,p.y,48,on?0x8bf8ba:c,.11);
  rect(w,p.x-27,p.y-19,54,41,0x253e50,.96);
  disk(w,p.x,p.y,14,on?0x95f5bd:c);
  for(const dx of [-15,15])disk(w,p.x+dx,p.y+16,3,0x87a9b9,.66);
 }
 // Sticky webs emphasize vertically risky routes without a separate character ability.
 for(const area of [{x:542,y:1660},{x:676,y:2100}]){
  for(let a=0;a<5;a++)ln(w,area.x+a*25,area.y-25,area.x+110-a*9,area.y+22,0xc399bd,.22,2);
  glow(b,area.x+60,area.y,52,0x9a7dac,.09);
 }
 for(let n=0;n<spiderPlaces.length;n++)drawSpider(w,spiderPlaces[n],n,pools);
}
drawActor(pools,S.camY);
let objective='ПІДІЙМАЙСЯ ВГОРУ ПО ПЛАТФОРМАХ. БАЛАСТ МОЖНА ЗВІЛЬНИТИ НА СЕРЕДНІЙ ВИСОТІ.';
if(D.ballastPhase==='falling')objective='ВАНТАЖ ПАДАЄ. ДОЧЕКАЙСЯ УДАРУ, ТОГО ЧАСУ ПІДНІМАЙСЯ ВГОРУ.';
else if(D.ballastDropped&&D.lightMode==='A'&&S.y<370)
 objective='БАЛАСТ СКИНУТО. ТЕПЕР ВЕРХНІМ РЕГУЛЯТОРОМ E ЗМІНИ СВІТЛО A → B.';
else if(D.ballastDropped&&D.lightMode==='B'&&S.y<700)
 objective='АРХІВ ОСВІТЛЕНО! СЛУЖБОВИЙ СПУСК НА ВЕРХНІЙ ПЛАТФОРМІ ПРАВОРУЧ [E].';
else if(D.ballastDropped&&D.lightMode==='B'&&S.y>2150&&!D.keyCollected)
 objective='ПРОБИТИЙ АРХІВ ДОСТУПНИЙ У НИЖНІХ ПРАВИХ ДВЕРЯХ. УВІЙДИ КЛАВІШЕЮ E.';
else if(D.keyCollected&&D.lightMode!=='C'&&S.y>2150)
 objective='ТИ ПРИЙШОВ ІЗ КЛЮЧЕМ. НИЖНІЙ РЕГУЛЯТОР У ЦЕНТРІ: E → РЕЖИМ C.';
else if(D.keyCollected&&D.lightMode==='C'&&S.y>2150)
 objective='СВІТЛО НАДІСЛАНО В ЗАМКОВУ ЗАЛУ. ЛІВІ ДВЕРІ → КІМНАТА 01.';
hudBase('02','ВЕРТИКАЛЬНА ШАХТА',objective,pools);
setText('W01','01 ↔ ЗАЛА');setText('W02','03 ↔ АРХІВ');
setText('W03','РЕГУЛЯТОР '+D.lightMode);
setText('W04',D.ballastDropped?'БАЛАСТ СКИНУТО':'СКИНУТИ БАЛАСТ · E');
setText('W05',D.shortcutOpen?'СЛУЖБОВИЙ СПУСК · E':'СЛУЖБОВИЙ СПУСК ЗАКРИТО');
setText('WLamp',D.keyCollected?'НИЖНІЙ РЕЖИМ C · E':'ТІЛЬКИ З КЛЮЧЕМ');
})();
