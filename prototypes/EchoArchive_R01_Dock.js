// R01 — ШЕПІТ ПРИСТАНІ. Teaches light shelter and dangerous afterimage.
const ROOM=1;
spawn({x:104,y:635});checkpoint(105,635);
const P=[{x:0,y:635,w:1280,h:85},{x:238,y:529,w:191,h:18},{x:852,y:515,w:180,h:18}];
const SENSOR={x:685,y:589},PAPER={x:975,y:565},WATER={x:309,y:585},EXIT={x:1210,y:588};
let pools=[{x:127,y:584,r:182},{x:500,y:578,r:156},{x:1074,y:575,r:146}];
if(D.dockOK)pools.push({x:786,y:571,r:145});
if(!S.dead&&!D.won){
 walk(P,{bottom:790});
 const burning=D.dockBurn>0;
 if(burning&&D.dockWetUntil>D.time)D.dockBurn=0;
 if(K.ink&&D.dockWetUntil<D.time&&hotNear(PAPER.x,PAPER.y,81)){
  if(!burning){D.dockBurn=9;S.shake=.75;say('СТАРИЙ ЛИСТ СПАЛАХНУВ ВІД ТВОГО ШЛЕЙФА! ВОДА З КЛАПАНА ЛІВОРУЧ ВРЯТУЄ ЙОГО.',5.5);}
 }
 if(!D.dockOK&&K.ink&&hotNear(SENSOR.x,SENSOR.y,73)&&Math.abs(S.vx)>67){
  D.dockOK=true;S.shake=.50;say('ТВІЙ ВЛАСНИЙ ШЛЕЙФ ЗАРЯДИВ СЕНСОР. ТЕПЕР ВІДПУСТИ X ПЕРЕД КРИХКИМ ЛИСТОМ!',6);
 }
 if(E){
  if(distance(S.x,S.y-34,WATER.x,WATER.y)<88){
   D.dockWetUntil=D.time+20;D.dockBurn=0;S.shake=.3;
   say('КЛАПАН ОХОЛОДИВ АРХІВНИЙ ЛИСТ. ТЕПЕР ВІН ЗАХИЩЕНИЙ ВІД СПАЛАХА 20 С.',5);
  }else if(distance(S.x,S.y-35,EXIT.x,EXIT.y)<93){
   if(D.dockOK&&D.dockBurn===0)visit(2,{x:130,y:2570});
   else say('ДВЕРІ ЧЕКАЮТЬ НА СЯЙВО В СЕНСОРІ. ПАЛЕНИЙ ЛИСТ СПОЧАТКУ ТРЕБА ОХОЛОДИТИ.',4.2);
  }
 }
}
if(A.ok){
 worldBase();const w=A.world,b=A.back;lights(pools);for(const p of P)ground(w,p);
 // Ancient signal registry. The first lesson: more light is NOT always better.
 drawBox(w,918,533,117,77,D.dockBurn>0?0x6e3143:0xa8a48c,.95);
 for(let i=0;i<5;i++)line(w,931,547+i*11,1020,547+i*11,
  D.dockBurn>0?0xef7b7a:0x5e7784,.52,2);
 if(D.dockBurn>0){
  halo(b,PAPER.x,PAPER.y,70,0xff647b,.16);
  for(let i=0;i<9;i++)circle(w,946+i*6,522-7*Math.sin(i+S.elapsed*5),3.5,0xf99c7a,.70);
 }
 halo(b,SENSOR.x,SENSOR.y,90,D.dockOK?0x9affdd:0xffb9aa,.14);
 w.lineStyle(4,D.dockOK?0x91ffe0:0xe39e9a,.95);w.drawCircle(SENSOR.x,SENSOR.y,28);
 circle(w,SENSOR.x,SENSOR.y,12,D.dockOK?0x90ffe0:0x9a5c6f);
 drawBox(w,WATER.x-34,551,69,65,0x355e71);
 w.lineStyle(4,0x9de5e5,.93);w.drawCircle(WATER.x,WATER.y,19);
 line(w,WATER.x-24,WATER.y,WATER.x+25,WATER.y,0x9bddf0,.89,3);
 door(EXIT.x,635,80,D.dockOK&&D.dockBurn===0,0x9dffd7);
 drawBox(w,127,159,285,103,0x193044,.74);
 for(let i=0;i<6;i++)circle(w,166+i*37,212+13*Math.sin(i),10,i%2?0x458b91:0x6d8b9c,.38);
}
drawEnemies(1);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЗАТИСНИ X, РУХАЙСЯ Й ЗАЛИШ СВІТЛОВИЙ СЛІД У КРУГЛОМУ СЕНСОРІ. АЛЕ НЕ СПАЛИ ЛИСТ ПРАВОРУЧ!';
if(D.dockBurn>0)task='ПОМИЛКА: ШЛЕЙФ ПІДПАЛИВ ЛИСТ. ПОВЕРНИСЯ ДО СИНЬОГО ВОДЯНОГО КЛАПАНА ЛІВОРУЧ [E].';
else if(D.dockOK)task='СЕНСОР СПРАЦЮВАВ. ВІДПУСТИ X, ПРОЙДИ ПОВЗ ЛИСТ І ВІДЧИНИ ПРАВІ ДВЕРІ [E].';
hud('01','ШЕПІТ ПРИСТАНІ',task,pools);
label('W01','ВОДА · E');
label('W02',D.dockOK?'СЕНСОР ✓':'X + РУХ → СЕНСОР');
label('W03',D.dockBurn>0?'ЛИСТ ГОРИТЬ!':'ЛИСТ БОЇТЬСЯ X');
label('W04','ШЛЮЗ → 02');
label('W05','');
label('WLamp','ПРАВИЛО: У СВІТЛІ СПАЛАХА НЕ БАЧАТЬ');
})();
