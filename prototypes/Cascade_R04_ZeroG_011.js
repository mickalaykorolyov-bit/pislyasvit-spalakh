// R04 — НЕВАГОМІСТЬ. Inverting gravity is a room environment, not a Spalakh ability.
const ROOM=4;
spawn({x:112,y:635});
if(!S.initialized){S.initialized=true;setCheckpoint(4,112,635);message('ЦЕ ЛАБОРАТОРІЯ ПЛАВУЧОЇ ВОДИ. ПЕРЕМИКАЧ ГРАВІТАЦІЇ — ЛІВОРУЧ.',5.8);}
const SWITCH={x:188,y:592},SENSOR={x:989,y:158},LETTER={x:1125,y:156},DOOR={x:79,y:588};
const platforms=[{x:0,y:635,w:1280,h:85},{x:144,y:518,w:174,h:18},
{x:407,y:406,w:168,h:18},{x:645,y:314,w:182,h:18},{x:885,y:237,w:206,h:18}];
const hazards=[{x:566,y:342,scale:1.22},{x:886,y:392}];
let pools=[{x:118,y:584,r:162},{x:443,y:361,r:124},{x:793,y:260,r:128}];
if(D.gravityLamp)pools.push({x:1044,y:196,r:251},{x:1115,y:550,r:158});
S.worldLight=pools;
if(!S.dead&&!S.transition&&!D.gameWon){
 if(!D.gravityFlipped){
  movePlayer(platforms,{deathY:820});
 }else{
  const d=Number(I.right)-Number(I.left);if(d)S.face=d;
  const aim=d*(I.shift?303:218);
  S.vx+=clamp(aim-S.vx,-1010*DT,1010*DT);
  S.x=clamp(S.x+S.vx*DT,16,1260);
  // The water bubble pulls Spalakh UP. The ceiling becomes the support surface.
  S.vy=clamp(S.vy-535*DT,-280,210);
  S.y=clamp(S.y+S.vy*DT,156,635);
  S.ground=S.y<=157;
  if(S.ground)S.vy=0;
  S.brightness=clamp(.15+Math.abs(S.vx)/305,.15,1);
  S.trailClock+=DT;
  if(Math.abs(S.vx)>65&&S.trailClock>.031){S.trail.push({x:S.x-S.face*16,y:S.y-44,p:S.brightness,age:0});S.trailClock=0;}
  for(const t of S.trail)t.age+=DT;
  S.trail=S.trail.filter(t=>t.age<.85).slice(-35);
 }
 if(E){
  if(dist(S.x,S.y-39,DOOR.x,DOOR.y)<95&&!D.gravityFlipped){
   goTo(2,'FROM_GRAVITY',{x:844,y:2460});
  }else if(dist(S.x,S.y-36,SWITCH.x,SWITCH.y)<100&&!D.gravityFlipped){
   D.gravityFlipped=true;S.vy=-90;S.fx=.55;
   message('ГРАВІТАЦІЯ ВИМКНЕНА. ТЕПЕР СПАЛАХ ПЛИВЕ ВГОРУ ДО СТЕЛІ!',5);
  }else if(dist(S.x,S.y-30,LETTER.x,LETTER.y)<100&&D.gravityLamp){
   if(!D.oxygenParts.gravity){D.oxygenParts.gravity=true;S.fx=.84;message('ЛІТЕРА «Н» З ПРОМЕНЯ! ЇЇ ЗАПИСАНО ДО ФРАЗИ.',4.5);}
  }else if(D.gravityFlipped&&S.x<312&&S.y<240){
   D.gravityFlipped=false;S.vy=0;
   message('ГРАВІТАЦІЯ ПОВЕРНУЛАСЯ. ПОВЕРТАЙСЯ ДО ВИХОДУ ВНИЗУ ЛІВОРУЧ.',4.5);
  }
 }
 // Important: player must bring THEIR OWN light to a sensor at the ceiling.
 if(D.gravityFlipped&&!D.gravityLamp&&dist(S.x,S.y-39,SENSOR.x,SENSOR.y)<96
    &&Math.abs(S.vx)>112&&S.brightness>.48){
  D.gravityLamp=true;S.fx=.8;
  message('СЕНСОР ВІДЧУВ СЯЙВО СПАЛАХА — ЛАМПА ЗАПАЛЕНА! ШУКАЙ ЛІТЕРУ «Н».',5.5);
 }
 // The ceiling can be travelled back to the left after taking the letter.
 if(D.gravityFlipped&&I.crouch&&S.y<235&&S.x<320){
  D.gravityFlipped=false;S.vy=0;S.ground=false;S.fx=.48;
  message('ТИ ПОВЕРНУВ ГРАВІТАЦІЮ. ТЕПЕР МОЖНА ВПАСТИ ДО ВИХОДУ.',4);
 }
 spiders(hazards,pools,114);
}
deathTick();
if(FG.ok){
 drawBase();const w=FG.world,b=FG.back;w.clear();
 drawLights(pools);
 for(const p of platforms)platform(w,p);
 rect(w,0,114,1280,25,0x345d68,.92);
 for(let x=45;x<1270;x+=77){
  ln(w,x,129,x+28,143,0xa5b6b8,.24,2);
  disk(w,x+15,145,4,0x85cfc8,.51);
 }
 // Zero-g bubble is a huge violet machine rather than a jump pad.
 glow(b,610,378,340,D.gravityFlipped?0x8772dd:0x3e7192,D.gravityFlipped?.11:.045);
 for(let x=225;x<1170;x+=137){
  disk(w,x,215+22*Math.sin(S.elapsed*.85+x),6,0x95b8d8,.13);
  disk(w,x+34,445+14*Math.sin(S.elapsed*.46+x),4,0xa3bdda,.13);
 }
 rect(w,SWITCH.x-32,566,64,56,0x2d435b,.96);
 w.lineStyle(3,D.gravityFlipped?0xddd1ff:0xb1dfe6,.91);
 w.drawRoundedRect(SWITCH.x-32,566,64,56,8);
 disk(w,SWITCH.x,590,16,D.gravityFlipped?0xab91fb:0xb0e5ed);
 if(D.gravityFlipped){
  for(let x=93;x<1270;x+=110){
   ln(w,x,596,x,485,0xba91fd,.31,3);
   ln(w,x,484,x-8,500,0xba91fd,.40,2);
   ln(w,x,484,x+8,500,0xba91fd,.40,2);
  }
 }
 // Sensor at ceiling reacts to actor brightness and velocity.
 const sensorCol=D.gravityLamp?0x8cffe2:0xefbb86;
 glow(w,SENSOR.x,SENSOR.y,47,sensorCol,.14);
 w.lineStyle(4,sensorCol,.95);w.drawCircle(SENSOR.x,SENSOR.y,25);
 disk(w,SENSOR.x,SENSOR.y,13,D.gravityLamp?0x9dfff1:0x795165);
 if(D.gravityLamp)glow(b,SENSOR.x,222,138,0x8affdb,.15);
 if(D.gravityLamp&&!D.oxygenParts.gravity){
  glow(w,LETTER.x,LETTER.y,51,0x9efbd3,.19);
  w.lineStyle(3,0xadfbd3,.91);w.drawRoundedRect(LETTER.x-26,LETTER.y-27,52,54,7);
 }
 rect(w,49,545,86,90,0x244f5d,.96);
 w.lineStyle(3,0x96f8d4,.86);w.drawRoundedRect(49,545,86,90,8);
 for(let n=0;n<hazards.length;n++)drawSpider(w,hazards[n],n,pools);
}
drawActor(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ПЕРЕМИКАЧ ГРАВІТАЦІЇ ЛІВОРУЧ [E]. ЗАВИСНИ ПІД СТЕЛЕЮ І ЗАПАЛИ СЕНСОР ВЛАСНИМ СЯЙВОМ.';
if(D.gravityFlipped&&!D.gravityLamp)task='ТИ ЛЕТИШ ДО СТЕЛІ! РУХАЙСЯ ПРАВОРУЧ, ЩОБ ТВОЄ СЯЙВО АКТИВУВАЛО СЕНСОР.';
else if(D.gravityLamp&&!D.oxygenParts.gravity)task='ЛАМПА ГОРИТЬ. У ПРАВОМУ ВЕРХНЬОМУ КУТІ СВІТИТЬСЯ ЛІТЕРА «Н» — ВІЗЬМИ E.';
else if(D.oxygenParts.gravity&&D.gravityFlipped)task='ЛІТЕРА «Н» Є. ПОВЕРНИСЯ ПІД СТЕЛЕЮ ЛІВОРУЧ ТА НАТИСНИ S, ЩОБ ВІДНОВИТИ ГРАВІТАЦІЮ.';
else if(D.oxygenParts.gravity)task='ВИХІД З ЛАБОРАТОРІЇ ВНИЗУ ЛІВОРУЧ. ПОВЕРНИСЯ В ШАХТУ.';
hudBase('04','АНТИГРАВІТАЦІЙНА КАМЕРА',task,pools);
setText('W01','ГРАВІТАЦІЯ: '+(D.gravityFlipped?'ВИМКНЕНО':'УВІМКНЕНО'));
setText('W02','СЕНСОР СЯЙВА: '+(D.gravityLamp?'✓':'○'));
setText('W03',D.oxygenParts.gravity?'ЛІТЕРА «Н» ЗНАЙДЕНА':'ЛІТЕРА ?');
setText('W04','S ПІД СТЕЛЕЮ — ВІДНОВИТИ ГРАВІТАЦІЮ');
setText('W05','');
setText('WLamp','04 ↔ ШАХТА');
})();
