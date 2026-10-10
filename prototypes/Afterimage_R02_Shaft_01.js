// R02: ГРАВІТАЦІЙНИЙ КОЛОДЯЗЬ — vertical climb, falling lamps, flip, light receiver.
const ROOM=2;
spawn({x:127,y:2350});
const plat=[{x:0,y:2350,w:1280,h:85},
 {x:245,y:2247,w:190,h:19},{x:438,y:2144,w:191,h:19},{x:625,y:2041,w:193,h:19},
 {x:824,y:1938,w:193,h:19},{x:947,y:1835,w:206,h:19},{x:738,y:1732,w:195,h:19},
 {x:541,y:1629,w:195,h:19},{x:331,y:1526,w:194,h:19},{x:137,y:1423,w:201,h:19},
 {x:347,y:1320,w:199,h:19},{x:554,y:1217,w:194,h:19},{x:754,y:1114,w:195,h:19},
 {x:946,y:1011,w:217,h:19},{x:745,y:908,w:187,h:19},{x:530,y:805,w:192,h:19},
 {x:328,y:702,w:201,h:19},{x:120,y:599,w:199,h:19},{x:335,y:496,w:191,h:19},
 {x:543,y:393,w:198,h:19},{x:747,y:290,w:204,h:19},{x:919,y:189,w:280,h:19},
 {x:0,y:92,w:1280,h:25}];
const lever={x:842,y:1810},sensor={x:989,y:149},exit={x:1172,y:162};
const lamps=[
 {x:495,y:2019,upper:1880,down:2070},
 {x:908,y:1487,upper:1310,down:1510},
 {x:645,y:894,upper:680,down:895},
 {x:1090,y:342,upper:140,down:377}
];
if(!S.shaftInit){
 S.shaftInit=true;S.qHeld=false;S.lamps=lamps.map((p,n)=>({...p,status:'ready',delay:1.1+n*1.6,y:p.upper,warn:.8,cool:0}));
 S.cameraY=clamp(S.y-160,360,2040);
 say('СПАЛАХ ПІДІЙМАЄТЬСЯ ШАХТОЮ. СВІТЛО ХОВАЄ ЙОГО, ЛАМПИ ПАДАЮТЬ З ЧЕРВОНОЮ ПІДКАЗКОЮ.',6);
}
let pools=[{x:135,y:2303,r:155},{x:381,y:2185,r:139},
 {x:775,y:1862,r:134},{x:446,y:1568,r:139},
 {x:227,y:1365,r:122},{x:621,y:1147,r:140},
 {x:912,y:957,r:146},{x:395,y:655,r:137},
 {x:890,y:244,r:159}];
if(D.shaftSensor)pools.push({x:1055,y:194,r:178});
if(S.trace)pools.push({x:S.trace.cx,y:S.trace.cy,r:300});
if(!S.dead){
 for(const lamp of S.lamps){
  lamp.delay-=dt;
  if(lamp.status==='ready'&&lamp.delay<=0&&Math.abs(S.y-lamp.down)<380){
   lamp.status='warning';lamp.warn=.83;
  }
  if(lamp.status==='warning'){lamp.warn-=dt;if(lamp.warn<=0){lamp.status='fall';lamp.y=lamp.upper;}}
  if(lamp.status==='fall'){
   lamp.y=Math.min(lamp.down,lamp.y+780*dt);
   if(Math.abs(S.x-lamp.x)<50&&Math.abs(S.y-lamp.y)<90)hurt('ПАДІННЯ ШАХТНОЇ ЛАМПИ');
   if(lamp.y>=lamp.down){lamp.status='landed';lamp.cool=2.4;}
  }else if(lamp.status==='landed'){
   lamp.cool-=dt;
   if(lamp.cool<=0){lamp.status='ready';lamp.y=lamp.upper;lamp.delay=1.2;}
  }
 }
 const q=pressed('q')||pressed('Q');
 if(q&&!S.qHeld&&D.gravityActivated){
  S.gravity*=-1;S.ground=false;S.vy=0;S.shake=.37;
  say(S.gravity===1?'ГРАВІТАЦІЯ ПЕРЕВЕРНУЛАСЬ! ТЕПЕР СТЕЛЯ СТАЄ ПІДЛОГОЮ.':'ТЯЖІННЯ ЗНОВУ ТЯГНЕ ДОНИЗ.',3);
 }
 S.qHeld=q;
 walk(plat,{bottom:2450,top:72,ice:(x,y)=>x>744&&x<951&&y>1105&&y<1161});
 if(S.y<1840&&S.y>1690&&S.gravity===-1)checkpoint(865,1732);
 if(S.y<1220&&S.y>980&&S.gravity===-1)checkpoint(850,1114);
 if(S.y<520)checkpoint(885,189);
 if(E){
  if(distance(S.x,S.y-43,lever.x,lever.y)<91){
   D.gravityActivated=true;S.gravity=1;S.vy=0;S.ground=false;
   say('МАГНІТНИЙ ЛІФТ АКТИВОВАНО. Q ТЕПЕР ПЕРЕВЕРТАЄ ГРАВІТАЦІЮ!',5);
  }else if(distance(S.x,S.y-44,exit.x,exit.y)<105){
   if(D.shaftSensor){D.shaftTop=true;visit(3,{x:118,y:635});}
   else say('ВЕРХНІ ДВЕРІ ЗАКРИТО. СТЕЛЬОВИЙ СЕНСОР ЧЕКАЄ ДОВГИЙ ШЛЕЙФ X.',4.6);
  }else if(distance(S.x,S.y-35,83,2308)<92){
   visit(1,{x:1100,y:635});
  }
 }
 if(!D.shaftSensor&&hotNear(sensor.x,sensor.y,95)){
  D.shaftSensor=true;S.shake=.7;
  say('ТВОЯ СВІТЛОВА ТРАЄКТОРІЯ ЗАРЯДИЛА ВЕРХНІЙ СЕНСОР! ДВЕРІ ВІДКРИТІ.',5);
 }
}
shards(2,pools);
if(A.ok){
 worldBase(2440);
 const cameraGoal=clamp(S.y-185,360,2080);
 S.cameraY+=(cameraGoal-S.cameraY)*(1-Math.exp(-dt*4.3));
 const shift=S.cameraY-360;
 A.far.y=shift*.82;A.mid.y=shift*.51;A.front.y=shift*.12;
 const w=A.world,b=A.back;
 lights(pools);for(const p of plat)ground(w,p);
 line(w,65,125,65,2360,0x4d8190,.28,6);
 line(w,1215,125,1215,2360,0x527f91,.31,6);
 for(let y=170;y<2360;y+=224){
  drawBox(b,17,y,56,16,0x41566b,.43);drawBox(b,1202,y+63,59,16,0x374960,.36);
  line(A.front,1177,y-130,1177,y+52,0x8cbbc3,.18,3);
  line(A.front,124,y-140,124,y+71,0x7a96b3,.15,2);
 }
 // Magnetic field flips up and down.
 drawBox(w,lever.x-37,1777,75,59,0x4d456c,.96);
 circle(w,lever.x,1804,19,D.gravityActivated?0xb39aff:0x6d7092);
 if(D.gravityActivated){
  for(let x=63;x<1260;x+=157){
   line(b,x,1653,x,1569,0xbd98ff,.18,3);
   line(b,x,1565,x-8,1580,0xbd98ff,.22,2);
   line(b,x,1565,x+8,1580,0xbd98ff,.22,2);
  }
 }
 for(const lamp of S.lamps){
  if(lamp.status==='warning'){
   halo(b,lamp.x,lamp.down,112,0xfa6177,.16+.12*Math.abs(Math.sin(S.elapsed*17)));
   for(let yy=lamp.upper;yy<lamp.down;yy+=42)drawBox(w,lamp.x-15,yy,30,10,0xff6984,.43);
  }
  if(lamp.status==='fall'||lamp.status==='landed'){
   drawBox(w,lamp.x-36,lamp.y-26,72,28,0x667683,.97);
   circle(w,lamp.x,lamp.y+7,17,0xc0fdf1);
   if(lamp.status==='landed')halo(b,lamp.x,lamp.down,95,0x8cffe8,.19);
  }else{
   line(w,lamp.x,lamp.upper-85,lamp.x,lamp.upper-18,0x9db4bf,.48,3);
   drawBox(w,lamp.x-33,lamp.upper-28,66,24,0x71818a,.96);
  }
 }
 const col=D.shaftSensor?0x9effd3:0xffaab1;
 halo(b,sensor.x,sensor.y,90,col,.12);
 w.lineStyle(4,col,.95);w.drawCircle(sensor.x,sensor.y,32);
 circle(w,sensor.x,sensor.y,14,col);
 door(exit.x,208,79,D.shaftSensor,0x9affd8);
 door(85,2350,78,true,0xb0f0e4);
 for(const t of [875,1698,1155])line(w,120,t,1160,t,0x4a6377,.10,2);
}
drawEnemies(2);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,S.cameraY,'',0);
let task='ПІДІЙМАЙСЯ ВГОРУ ПО ШАХТІ. ЛАМПИ ПАДАЮТЬ ІЗ ЧЕРВОНИМ ПОПЕРЕДЖЕННЯМ. НЕ СТІЙ ПІД НИМИ.';
if(S.y>1710&&S.y<1940&&!D.gravityActivated)
 task='МАГНІТНИЙ ПУЛЬТ ПРАВОРУЧ НА ПЛАТФОРМІ. E АКТИВУЄ, А Q ПЕРЕВЕРТАЄ ГРАВІТАЦІЮ.';
else if(D.gravityActivated&&S.y>390)
 task='Q — ПЕРЕВЕРНУТИ ГРАВІТАЦІЮ. ВИБИРАЙ БЕЗПЕЧНІ МІСЦЯ ПІД ЧАС РУХУ ВГОРУ.';
else if(S.y<395&&!D.shaftSensor)
 task='НА СТЕЛІ КРУГЛИЙ СЕНСОР. ПРОВЕДИ ПО НЬОМУ ВЛАСНИМ ШЛЕЙФОМ X, ПОТІМ ДВЕРІ ПРАВОРУЧ.';
else if(D.shaftSensor&&S.y<395)
 task='СЕНСОР ЗАРЯДЖЕНО. ДВЕРІ ВГОРІ ПРАВОРУЧ ВЕДУТЬ У КІМНАТУ 03 [E].';
hud('02','ГРАВІТАЦІЙНИЙ КОЛОДЯЗЬ',task,pools);
label('W01','Q — ГРАВІТАЦІЯ '+(D.gravityActivated?'✓':'○'));
label('W02','ПАДАЮЧІ ЛАМПИ');
label('W03','X + РУХ → СЕНСОР');
label('W04',D.shaftSensor?'СТЕЛЬОВИЙ СЕНСОР ✓':'СЕНСОР ?');
label('W05','ДВЕРІ → 03');
label('WLamp','НЕ ПЛУТАЙ ШЛЕЙФ З УКРИТТЯМ!');
})();
