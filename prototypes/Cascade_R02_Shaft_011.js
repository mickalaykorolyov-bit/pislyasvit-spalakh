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
const spiderPlaces=[{x:891,y:2346},{x:622,y:1691},{x:442,y:1363},{x:940,y:1036,scale:1.12}];
const spiderLampLever={x:790,y:1110},spiderLift={x:1106,y:1036},UV={x:1113,y:194};
const shoveSpider={x:622,y:1691},ammo={x:341,y:1329},shotSpider={x:442,y:1363};
const zeroDoor={x:845,y:2421},chaseDoor={x:1017,y:2421};
if(!S.oxygenInit){
 S.oxygenInit=true;S.fHeld=false;S.rockCarry=false;S.shot=null;
 if(D.uvSpider==='carried'){D.uvSpider='stunned';D.spiderX=940;D.spiderY=1036;}
}
let pools=[{x:154,y:2404,r:161},{x:1140,y:2404,r:171}];
if(D.lightMode==='A'){
 pools.push(
 {x:420,y:2207,r:194},{x:813,y:1944,r:178},
 {x:398,y:1660,r:147},{x:158,y:1397,r:145},
 {x:680,y:1174,r:174},{x:755,y:976,r:152},
 {x:510,y:670,r:170},{x:969,y:223,r:186});
}else if(D.lightMode==='B'){
 pools.push({x:1105,y:225,r:170},{x:907,y:2430,r:150});
}else{
 pools.push({x:632,y:2410,r:197},{x:290,y:2413,r:167},{x:970,y:228,r:120});
}
if(D.shaftLightSensor)pools.push({x:900,y:1940,r:185});
if(D.shaftFallingLamp==='landed'||D.uvSpider!=='alive')
 pools.push({x:D.spiderX,y:D.spiderY-12,r:138});
S.worldLight=pools;
// The ballast exists persistently even when shaft is not the current scene.
// Simulation occurs while here; after landing, the archive's roof is permanently gone.
// An overhead lamp can be released onto the upper patrol spider.
if(D.shaftFallingLamp==='warning'){
 D.shaftLampClock-=DT;
 if(D.shaftLampClock<=0)D.shaftFallingLamp='falling';
}else if(D.shaftFallingLamp==='falling'){
 D.shaftLampY=Math.min(1002,D.shaftLampY+790*DT);
 if(!S.dead&&S.shield<=0&&Math.abs(S.x-940)<45&&Math.abs(S.y-D.shaftLampY)<100)hurt('ВАЖКА ЛАМПА');
 if(D.shaftLampY>=1002){
  D.shaftFallingLamp='landed';D.uvSpider='stunned';D.spiderX=940;D.spiderY=1036;
  S.fx=.9;message('ПАВУК НЕ РУХАЄТЬСЯ, АЛЕ СВІТИТЬСЯ! НЕСИ ТІЛО ДО ЛІФТА ПРАВОРУЧ.',6);
 }
}
if(S.carrySpider){D.spiderX=S.x+S.face*26;D.spiderY=S.y-30;}
if(D.uvSpider==='lift'){
 D.spiderLiftY=Math.max(239,D.spiderLiftY-235*DT);
 D.spiderX=1106;D.spiderY=D.spiderLiftY;
 if(D.spiderLiftY<=239){
  D.uvHold+=DT;
  if(D.uvHold>=1.3){
   D.uvSpider='uvReady';
   message('УЛЬТРАФІОЛЕТ ПРОЯВИВ «КИ» НА ПАВУКОВІ! НАВЕРХУ НАТИСНИ E.',5.5);
  }
 }
}
if(D.uvSpider==='dropping'){
 D.spiderY=Math.min(2416,D.spiderY+875*DT);
 if(D.spiderY>=2416){
  D.uvSpider='dumped';D.spiderX=1106;
  message('ПІСЛЯ ПАДІННЯ З ПАВУКА ВИЙШЛА ЩЕ ОДНА ЛІТЕРА «С». ЗАБЕРИ ЇЇ ВНИЗУ E.',6);
 }
}
// Foreground ceiling chunks telegraph then fall on the middle climbing ledge.
if(D.shaftRock==='ready'&&S.y<1670&&S.y>1545&&S.x>320&&S.x<490){
 D.shaftRock='warning';D.shaftRockClock=.86;
 message('УВАЖНО: ЗІ СТЕЛІ ПАДАТИМЕ ВАЖКИЙ УЛАМОК!',3);
}
if(D.shaftRock==='warning'){
 D.shaftRockClock-=DT;
 if(D.shaftRockClock<=0)D.shaftRock='falling';
}else if(D.shaftRock==='falling'){
 D.shaftRockY=Math.min(1568,D.shaftRockY+930*DT);
 if(!S.dead&&Math.abs(S.x-433)<51&&Math.abs(S.y-D.shaftRockY)<73)hurt('УЛАМОК СТЕЛІ');
 if(D.shaftRockY>=1568)D.shaftRock='settled';
}
if(D.ballastPhase==='warning'){
 D.ballastTimer-=DT;
 if(D.ballastTimer<=0){D.ballastPhase='falling';message('БАЛАСТ ЗІРВАВСЯ! НЕ СТОЙ ПІД НИМ!',3.2);}
}
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
 movePlayer(floors,{deathY:2628,
 ice:(x,y)=>(y>1855&&y<1940&&x>927&&x<1131)||(y>1090&&y<1170&&x>741&&x<954),
 slow:(x,y)=>(
  (y>1560&&y<1745&&x>560&&x<720)||
  (y>2000&&y<2155&&x>670&&x<788)
 )});
 // A high-speed sensor catches the PLAYER'S OWN LIGHT and powers a refuge.
 if(!D.shaftLightSensor&&Math.abs(S.x-839)<63&&Math.abs(S.y-2021)<53&&Math.abs(S.vx)>160&&S.brightness>.64){
  D.shaftLightSensor=true;S.fx=.56;message('СЕНСОР ПОБАЧИВ СЯЙВО СПАЛАХА — ПРОХІД ОСВІТЛЕНО.',4);
 }
 if(I.throw&&!S.fHeld&&S.rockCarry){
  S.shot={x:S.x+S.face*25,y:S.y-43,vx:S.face*395,vy:-145,t:1.2};S.rockCarry=false;
 }
 S.fHeld=I.throw;
 if(S.shot){
  const a=S.shot;a.x+=a.vx*DT;a.y+=a.vy*DT;a.vy+=690*DT;a.t-=DT;
  if(dist(a.x,a.y,shotSpider.x,shotSpider.y-35)<62&&!D.shaftProjectileUsed){
   D.shaftProjectileUsed=true;S.shot=null;S.fx=.7;
   message('УЛАМОК ЗІШТОВХНУВ ПАВУКА З ПЛАТФОРМИ! ПРОХІД ЗВІЛЬНЕНО.',4.4);
  }else if(a.t<=0||a.y>2500)S.shot=null;
 }
 if(E){
  if(S.carrySpider&&dist(S.x,S.y-38,spiderLift.x,spiderLift.y-38)<130){
   S.carrySpider=false;D.uvSpider='lift';D.spiderLiftY=1036;D.uvHold=0;
   message('ПАВУК НА ПІДЙОМНИКУ! СТЕЖ, ЯК ЙОГО ПІДНІМУТЬ ДО УЛЬТРАФІОЛЕТУ.',5.5);
  }else if(D.uvSpider==='stunned'&&dist(S.x,S.y-36,D.spiderX,D.spiderY-38)<100){
   D.uvSpider='carried';S.carrySpider=true;S.fx=.55;
   message('ТИ ПІДНЯВ СВІТНОГО ПАВУКА. ВІДНЕСИ ЙОГО ДО ЛІФТА ПРАВОРУЧ.',5);
  }else if(D.uvSpider==='uvReady'&&dist(S.x,S.y-40,UV.x,UV.y)<110){
   D.uvSpider='uvRead';D.oxygenParts.uv=true;S.fx=.85;
   message('ПЕРША ЛІТЕРА З ТІЛА ПАВУКА — «КИ»! НАТИСНИ E ЗНОВУ, ЩОБ СКИНУТИ ТІЛО.',5.5);
  }else if(D.uvSpider==='uvRead'&&dist(S.x,S.y-40,UV.x,UV.y)<110){
   D.uvSpider='dropping';D.spiderX=1106;D.spiderY=239;S.fx=.8;
   message('ТІЛО ПАДАЄ НА ДНО ШАХТИ. ТАМ З’ЯВИТЬСЯ НОВА ЛІТЕРА!',4.7);
  }else if(D.uvSpider==='dumped'&&dist(S.x,S.y-35,1106,2380)<125){
   D.oxygenParts.spiderDrop=true;D.uvSpider='finished';S.fx=.9;
   message('ДРУГА ЛІТЕРА З ПАВУКА — «С»! ЗАРАЗ МАЄМО «КИС».',5);
  }else if(!D.shaftShoved&&dist(S.x,S.y-39,shoveSpider.x,shoveSpider.y-36)<93){
   D.shaftShoved=true;S.fx=.65;message('ТИ ЗІШТОВХНУВ ПАВУКА З ВИСТУПУ!',3.5);
  }else if(!D.shaftProjectileUsed&&!S.rockCarry&&dist(S.x,S.y-37,ammo.x,ammo.y)<91){
   S.rockCarry=true;message('ПІДНЯТО ЗАЛІЗНИЙ УЛАМОК. КИНЬ F У ПАВУКА ПРАВОРУЧ.',4);
  }else if(D.shaftFallingLamp==='ready'&&dist(S.x,S.y-37,spiderLampLever.x,spiderLampLever.y)<93){
   D.shaftFallingLamp='warning';D.shaftLampClock=.85;S.fx=.6;
   message('ЛАМПА ВПАДЕ НА ПАВУКА ЧЕРЕЗ 0.85 С! СХОВАЙСЯ!',4.5);
  }else if(dist(S.x,S.y-34,zeroDoor.x,zeroDoor.y)<92){
   goTo(4,'FROM_SHAFT',{x:111,y:635});
  }else if(dist(S.x,S.y-34,chaseDoor.x,chaseDoor.y)<87){
   goTo(5,'FROM_SHAFT',{x:110,y:635});
  }else if(dist(S.x,S.y-34,84,2415)<91){
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
    D.ballastPhase='warning';D.ballastTimer=.85;D.ballastV=0;S.fx=.5;
    message('ТРОС ВІД’ЄДНАНО! ЧЕРВОНИЙ ВІДЛІК — 0.85 С. ВІДІЙДИ ВІД ШАХТИ ПАДІННЯ!',5);
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
 spiders(spiderPlaces.filter((sp,n)=>(n!==1||!D.shaftShoved)&&(n!==2||!D.shaftProjectileUsed)&&(n!==3||D.uvSpider==='alive')),pools,123);
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
  glow(w,1050,by,75,D.ballastPhase==='falling'||D.ballastPhase==='warning'?0xef7289:0xedb38e,.13);
  if(D.ballastPhase==='warning'){
   glow(b,1050,1167,140,0xfd5975,.13+.10*Math.abs(Math.sin(D.time*19)));
   for(let y=997;y<2408;y+=85)rect(w,1021,y,57,11,0xfd6780,.25+.15*Math.abs(Math.sin(D.time*19)));
  }
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
 for(let n=0;n<spiderPlaces.length;n++)if((n!==1||!D.shaftShoved)&&(n!==2||!D.shaftProjectileUsed)&&(n!==3||D.uvSpider==='alive'))drawSpider(w,spiderPlaces[n],n,pools);

 // Vertical lift holds the struck spider, exposes it under UV and drops it 2200px down.
 ln(w,1106,192,1106,1041,0x5e9da3,.44,3);
 const liftY=D.uvSpider==='lift'?D.spiderLiftY:1036;
 rect(w,1063,liftY,85,15,0x3a8c91,.9);
 rect(w,1071,liftY,68,5,0xa4f8e6,.86);
 glow(w,UV.x,UV.y,68,0xb69bff,.19);
 rect(w,UV.x-42,UV.y-45,84,28,0x6b5b9a,.98);
 disk(w,UV.x,UV.y-19,15,0xd4bbff);
 if(D.uvSpider!=='alive'&&D.uvSpider!=='finished'){
  const x=D.spiderX,y=D.spiderY;
  glow(b,x,y,95,0x8ffff0,.17);
  disk(w,x,y-26,23,0x28505a);
  for(const side of [-1,1])for(let z=0;z<4;z++)
   ln(w,x+side*13,y-26+z*7,x+side*(30+z*4),y-40+z*10,0x8ee3cf,.79,2.8);
  disk(w,x-8,y-31,4,0xb8fff6);disk(w,x+8,y-31,4,0xb8fff6);
 }
 if(D.uvSpider==='uvReady'||D.uvSpider==='uvRead'){
  glow(w,1106,209,73,0xd9b8ff,.18);
 }
 // Two extra rooms are accessed at the bottom of the vertical chamber.
 for(const door of [{x:zeroDoor.x,c:0xc4a1ff},{x:chaseDoor.x,c:0xfda2a6}]){
  rect(w,door.x-30,2375,61,83,0x284756,.95);
  w.lineStyle(3,door.c,.92);w.drawRoundedRect(door.x-30,2375,61,83,7);
  disk(w,door.x,2405,10,door.c);
 }
 // A glowing spider after lamp impact, a physical falling industrial lamp and red warning area.
 if(D.shaftFallingLamp==='warning'){
  glow(b,940,1036,84,0xfa4f77,.20+.12*Math.abs(Math.sin(D.time*19)));
  for(let y=750;y<1020;y+=49)rect(w,929,y,23,13,0xfd6c86,.60);
 }
 if(D.shaftFallingLamp==='falling'||D.shaftFallingLamp==='landed'){
  rect(w,902,D.shaftLampY-27,76,29,0x556f7c,.96);
  disk(w,940,D.shaftLampY+6,16,0xc8fff1);
 }
 rect(w,spiderLampLever.x-28,spiderLampLever.y-19,56,39,0x415567,.96);
 disk(w,spiderLampLever.x,spiderLampLever.y,13,D.shaftFallingLamp==='ready'?0xffbe85:0x98f8d8);
 // Ice = reduced friction. Crossing too fast risks losing 2 or 3 platforms.
 for(const icy of [{x:923,y:1912,w:201},{x:741,y:1146,w:200}]){
  for(let xx=icy.x+12;xx<icy.x+icy.w-6;xx+=27)ln(w,xx,icy.y+2,xx+17,icy.y+2,0xaeecff,.77,2);
 }
 // A light sensor only responds to Spalakh's movement glow (not a thrown object).
 w.lineStyle(3,D.shaftLightSensor?0x9effdd:0xff9bac,1);w.drawCircle(839,1997,24);
 disk(w,839,1997,10,D.shaftLightSensor?0x9bffdf:0x9c6174);
 // Ceiling debris is visible through the whole fall.
 if(D.shaftRock==='warning')glow(b,433,1570,78,0xff6186,.30);
 if(D.shaftRock==='falling'||D.shaftRock==='settled')rect(w,400,D.shaftRockY-23,66,45,0x8a7480,.94);
 // Optional physical solutions for two other spiders.
 rect(w,ammo.x-22,ammo.y-22,44,28,0x73646a,.93);
 disk(w,ammo.x,ammo.y-9,9,0xffd4ab);
 if(S.rockCarry)disk(w,S.x+S.face*19,S.y-48,7,0xffdcac);
 if(S.shot){disk(w,S.shot.x,S.shot.y,8,0xffd8a4);glow(w,S.shot.x,S.shot.y,22,0xf7ad8a,.13);}

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

if(S.y>920&&S.y<1220){
 if(D.uvSpider==='alive'&&D.shaftFallingLamp==='ready')
 objective='ПРАВОРУЧ Є ВАЖІЛЬ E. ВІДПУСТИ ЛАМПУ, ЩОБ ЗНЕШКОДИТИ ПАВУКА.';
 else if(D.uvSpider==='stunned')objective='ПАВУК СВІТИТЬСЯ! ПІДНІМИ ЙОГО E ТА ВІДНЕСИ ДО ЛІФТА ПРАВОРУЧ.';
 else if(S.carrySpider)objective='НЕСИ ПАВУКА ДО ЛІФТА ПРАВОРУЧ. E — ПОКЛАСТИ НА ПІДЙОМНИК.';
 else if(D.uvSpider==='lift')objective='ЛІФТ ПІДНІМАЄ ПАВУКА ДО UV. ПРОДОВЖУЙ ПІДЙОМ.';
}
if(S.y<400&&(D.uvSpider==='uvReady'||D.uvSpider==='uvRead'))
 objective=D.uvSpider==='uvReady'?'НА ПАВУКОВІ ПІД UV ВИДНО «КИ». ПІДІЙДИ Й НАТИСНИ E.':
 'ЛІТЕРУ «КИ» ЗНАЙДЕНО. НАТИСНИ E ПІД UV ЗНОВУ, ЩОБ СКИНУТИ ТІЛО.';
if(S.y>2210&&D.uvSpider==='dumped')
 objective='ПІД ЛІФТОМ НА ДНІ З ПАВУКА З’ЯВИЛАСЯ «С». ЗАБЕРИ E.';
if(S.y>2250&&!D.oxygenParts.gravity&&Math.abs(S.x-845)<130)
 objective='ФІОЛЕТОВІ ДВЕРІ: АНТИГРАВІТАЦІЯ, КІМНАТА 04 [E].';
if(S.y>2250&&!D.oxygenParts.chase&&Math.abs(S.x-1017)<103)
 objective='РОЖЕВІ ДВЕРІ: ТЕМНИЙ ЗАБІГ, КІМНАТА 05 [E].';
if(S.y>1810&&S.y<2100&&!D.shaftLightSensor)
 objective='РОЗЖЕНИСЬ SHIFT+D КРІЗЬ СЕНСОР — ВІН ЛОВИТЬ ВЛАСНЕ СЯЙВО СПАЛАХА.';
hudBase('02','ВЕРТИКАЛЬНА ШАХТА',objective,pools);
setText('W01','01 ↔ ЗАЛА');setText('W02',D.uvSpider==='dumped'?'«С» ПІД ЛІФТОМ · E':'03 ↔ АРХІВ');
setText('W03','РЕГУЛЯТОР '+D.lightMode);
setText('W04',D.ballastDropped?'БАЛАСТ СКИНУТО':'СКИНУТИ БАЛАСТ · E');
setText('W05',D.uvSpider==='uvReady'||D.uvSpider==='uvRead'?'UV · «КИ» · E':D.shortcutOpen?'СЛУЖБОВИЙ СПУСК · E':'СЛУЖБОВИЙ СПУСК ЗАКРИТО');
setText('WLamp','О2: '+fragmentsText()+' | UV: '+D.uvSpider);
})();
