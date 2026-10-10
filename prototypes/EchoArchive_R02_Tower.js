// R02 — КОЛОНА ЗВОРОТНОЇ ТЕЧІЇ. 2670px vertical tower + parallax + switchable gravity.
const ROOM=2;
spawn({x:136,y:2570});
if(!S.towerInit){
 S.towerInit=true;S.cameraY=clamp(S.y-170,360,2300);
 S.lamps=[
  {x:570,from:2290,to:2475,phase:'idle',y:2290,wait:1.1},
  {x:982,from:1710,to:1880,phase:'idle',y:1710,wait:2.3},
  {x:452,from:1150,to:1330,phase:'idle',y:1150,wait:3.4},
  {x:998,from:358,to:614,phase:'idle',y:358,wait:4.2}];
 S.qHold=false;
 say('КОЛОНА МАЄ ВИСОТУ ПОНАД ТРИ ЕКРАНИ. ПАДАЮЧІ ЛАМПИ ПОПЕРЕДЖАЮТЬ ЧЕРВОНИМ СВІТЛОМ.',5.5);
}
const platforms=[{x:0,y:2570,w:1280,h:95},
 {x:204,y:2463,w:193,h:18},{x:404,y:2356,w:192,h:18},
 {x:606,y:2249,w:195,h:18},{x:803,y:2142,w:197,h:18},
 {x:991,y:2035,w:218,h:18},{x:786,y:1928,w:194,h:18},
 {x:583,y:1821,w:193,h:18},{x:380,y:1714,w:194,h:18},
 {x:173,y:1607,w:201,h:18},{x:374,y:1500,w:197,h:18},
 {x:580,y:1393,w:197,h:18},{x:780,y:1286,w:201,h:18},
 {x:981,y:1179,w:201,h:18},{x:777,y:1072,w:201,h:18},
 {x:571,y:965,w:195,h:18},{x:366,y:858,w:198,h:18},
 {x:165,y:751,w:198,h:18},{x:368,y:644,w:194,h:18},
 {x:572,y:537,w:194,h:18},{x:779,y:430,w:200,h:18},
 {x:975,y:323,w:207,h:18},
 {x:0,y:90,w:1280,h:30}];
const VALVE={x:674,y:1354},REVERSE={x:474,y:821},SENSOR={x:1024,y:143},EXIT={x:1196,y:184};
let pools=[{x:152,y:2512,r:166},{x:635,y:2305,r:146},{x:968,y:2041,r:138},
{x:498,y:1782,r:125},{x:253,y:1567,r:143},{x:663,y:1331,r:139},
{x:975,y:1069,r:132},{x:419,y:777,r:139},{x:790,y:393,r:149}];
if(D.towerUp)pools.push({x:1054,y:187,r:190});
if(!S.dead){
 for(const a of S.lamps){
  if(a.phase==='idle'){a.wait-=dt;if(a.wait<=0&&Math.abs(S.y-a.to)<470){a.phase='warning';a.wait=.82;}}
  else if(a.phase==='warning'){a.wait-=dt;if(a.wait<=0){a.phase='fall';a.y=a.from;}}
  else if(a.phase==='fall'){
   a.y=Math.min(a.to,a.y+830*dt);
   if(Math.abs(S.x-a.x)<48&&Math.abs(S.y-a.y)<85)hurt('ВАЖКА ЛАМПА ЗІРВАЛАСЯ ЗІ СТЕЛІ');
   if(a.y>=a.to){a.phase='cool';a.wait=1.9;}
  }else if(a.phase==='cool'){a.wait-=dt;if(a.wait<=0){a.phase='idle';a.wait=2;a.y=a.from;}}
 }
 const q=pressed('q')||pressed('Q');
 if(q&&!S.qHold&&D.gravityActivated){
  S.gravity*=-1;S.ground=false;S.vy=0;S.shake=.37;
  say(S.gravity===1?'ТЕПЕР СТЕЛЯ ТЯГНЕ СПАЛАХА ВГОРУ.':'ГРАВІТАЦІЯ ЗНОВУ СПРЯМОВАНА ВНИЗ.',3.3);
 }
 S.qHold=q;
 walk(platforms,{bottom:2720,top:90,ice:(x,y)=>x>988&&x<1214&&y>2010&&y<2078});
 if(S.gravity===1&&S.y<114){S.y=120;S.vy=0;S.ground=true;}
 if(S.y<1610&&S.y>1450&&S.gravity===-1)checkpoint(244,1607);
 if(S.y<1170&&S.y>1000&&S.gravity===-1)checkpoint(875,1072);
 if(S.y<440)checkpoint(1086,323);
 if(E){
  if(distance(S.x,S.y-34,VALVE.x,VALVE.y)<90&&!D.towerValve){
   D.towerValve=true;S.shake=.55;
   say('НАПІР У КОЛОНІ ВІДКРИТО. ТЕПЕР ЗНАЙДИ МАГНІТНИЙ ІНВЕРТОР ВИЩЕ.',5);
  }else if(distance(S.x,S.y-36,REVERSE.x,REVERSE.y)<90){
   if(D.towerValve){
    D.gravityActivated=true;S.gravity*=-1;S.ground=false;S.vy=0;
    say('ІНВЕРТОР АКТИВНИЙ. КЛАВІША Q ТЕПЕР ЗМІНЮЄ ТЯЖІННЯ. ЛЕТИ ДО СТЕЛІ!',5);
   }else say('МАГНІТНИЙ ІНВЕРТОР ЧЕКАЄ НА КЛАПАН НАПОРУ НИЖЧЕ.',4);
  }else if(distance(S.x,S.y-35,EXIT.x,EXIT.y)<96){
   if(D.towerUp){S.gravity=-1;visit(3,{x:112,y:635});}
   else say('ВИХІД ВІДКРИЄТЬСЯ ПІСЛЯ СЕНСОРА СВІТЛОВОГО ШЛЕЙФА БІЛЯ СТЕЛІ.',4);
  }else if(distance(S.x,S.y-32,92,2524)<90)visit(1,{x:1094,y:635});
 }
 if(!D.towerUp&&hotNear(SENSOR.x,SENSOR.y,99)){
  D.towerUp=true;S.shake=.8;
  say('ШЛЕЙФ ЗАПАЛИВ ВЕРХНІЙ МАЯК! КОЛОНА ПІДГОТОВЛЕНА ДО ПОШУКУ ВІДЛУННЯ.',5.2);
 }
}
shards(2,pools);
if(A.ok){
 worldBase(2665);
 const goal=clamp(S.y-160,360,2305);
 S.cameraY+=(goal-S.cameraY)*(1-Math.exp(-dt*4.6));
 const shift=S.cameraY-360;
 A.far.y=.83*shift;A.mid.y=.51*shift;A.front.y=.16*shift;
 const w=A.world,b=A.back;
 lights(pools);for(const p of platforms)ground(w,p);
 line(w,40,111,40,2581,0x61869b,.24,6);
 line(w,1237,119,1237,2586,0x6593a2,.25,6);
 for(let y=240;y<2520;y+=228){
  line(A.front,112,y-173,112,y+82,0x9cbacc,.15,3);
  line(A.front,1175,y-112,1175,y+72,0x99baca,.15,2);
  drawBox(b,1152,y,89,16,0x5b7889,.24);
 }
 for(const a of S.lamps){
  if(a.phase==='warning'){
   halo(b,a.x,a.to,108,0xff647d,.17+.14*Math.abs(Math.sin(S.elapsed*17)));
   for(let y=a.from;y<a.to;y+=49)drawBox(w,a.x-17,y,34,11,0xfb7186,.45);
  }
  if(a.phase==='fall'||a.phase==='cool'){
   drawBox(w,a.x-38,a.y-29,76,30,0x73828e,.95);
   circle(w,a.x,a.y+9,17,0xadfff0);
   if(a.phase==='cool')halo(b,a.x,a.to,88,0x90ffe6,.18);
  }else drawBox(w,a.x-36,a.from-30,73,25,0x667c88,.96);
 }
 for(const [p,on,col] of [[VALVE,D.towerValve,0xb4ffed],[REVERSE,D.gravityActivated,0xc4a4ff]]){
  drawBox(w,p.x-35,p.y-25,70,50,0x30485a,.96);
  circle(w,p.x,p.y,17,on?col:0xb17f91);
  halo(b,p.x,p.y,61,on?col:0xeb8199,.10);
 }
 w.lineStyle(4,D.towerUp?0xa2ffe2:0xe6a9ac,.94);w.drawCircle(SENSOR.x,SENSOR.y,29);
 circle(w,SENSOR.x,SENSOR.y,11,D.towerUp?0xa0ffe4:0x9f627c);
 halo(b,SENSOR.x,SENSOR.y,75,D.towerUp?0x91ffdc:0xf5a1a4,.15);
 door(EXIT.x,221,74,D.towerUp,0x9fffe3);
 door(92,2570,73,true,0xb2e8ef);
}
drawEnemies(2);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,S.cameraY,'',0);
let task='ДОСЛІДИ ВИСОКУ КОЛОНУ. ПЕРІОДИЧНІ ПАДІННЯ ЛАМП ПОКАЗАНІ ЧЕРВОНИМИ СМУГАМИ.';
if(!D.towerValve&&S.y<1450&&S.y>1160)task='ЗНАЙДИ КЛАПАН ВИСОКО НА ПЛАТФОРМІ ПРАВОРУЧ І НАТИСНИ E.';
else if(D.towerValve&&!D.gravityActivated&&S.y<950)task='НАСТУПНИЙ МЕХАНІЗМ — МАГНІТНИЙ ІНВЕРТОР. ПІСЛЯ АКТИВАЦІЇ Q КЕРУЄ ГРАВІТАЦІЄЮ.';
else if(D.gravityActivated&&!D.towerUp)task='Q — ЗМІНИ ГРАВІТАЦІЮ. ЗАТИСНИ X ПОРУЧ ІЗ ВЕРХНІМ СЕНСОРОМ, ЩОБ ЗАЛИШИТИ СЛІД.';
else if(D.towerUp)task='ВЕРХНІЙ СЕНСОР ЗАРЯДЖЕНИЙ! ДВЕРІ НАГОРІ ПРАВОРУЧ [E] → ЗАЛ ВІДЛУННЯ.';
hud('02','КОЛОНА ТЕЧІЙ',task,pools);
label('W01','КЛАПАН НАПОРУ E');label('W02','Q → ІНВЕРСІЯ');
label('W03','ПАДАЮЧІ ЛАМПИ');label('W04',D.towerUp?'СЕНСОР ✓':'X → СЕНСОР НА СТЕЛІ');
label('W05','ВИХІД → 03');label('WLamp','ЗАПАЛЕНИЙ ПРОМІНЬ = БЕЗПЕКА');
})();
