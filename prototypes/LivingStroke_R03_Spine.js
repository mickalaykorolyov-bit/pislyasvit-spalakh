// 03 / ПІДВІШЕНИЙ ХРЕБЕТ — tall vertical room, 3-speed parallax, gravity inversion.
// A 194px physical breach halfway up is solved with a movable solid stroke.
spawn({x:137,y:2490});
if(!S.shaftInit){
 S.shaftInit=true;S.camY=2230;
 S.lamps=[{x:490,y:2020,top:1850,wait:1.2,phase:'ready'},
 {x:934,y:1053,top:830,wait:3.3,phase:'ready'},
 {x:1097,y:417,top:196,wait:4.7,phase:'ready'}];
 announce('ЦЕ ВЕРТИКАЛЬНА ШАХТА. ВНИЗУ ПАДАЮТЬ ЛАМПИ, ВИЩЕ Є РОЗРИВ МІЖ ПЛАТФОРМАМИ.',6);
}
const f=[
 {x:0,y:2490,w:1280,h:92},
 {x:205,y:2382,w:198,h:19},{x:395,y:2274,w:200,h:19},
 {x:585,y:2166,w:198,h:19},{x:782,y:2058,w:201,h:19},
 {x:968,y:1950,w:202,h:19},{x:776,y:1842,w:201,h:19},
 {x:577,y:1734,w:198,h:19},{x:380,y:1626,w:197,h:19},
 {x:203,y:1518,w:200,h:19},{x:410,y:1410,w:223,h:19},
 {x:828,y:1410,w:179,h:19},{x:851,y:1302,w:191,h:19},
 {x:654,y:1194,w:189,h:19},{x:455,y:1086,w:193,h:19},
 {x:256,y:978,w:190,h:19},{x:445,y:870,w:198,h:19},
 {x:637,y:762,w:200,h:19},{x:824,y:654,w:196,h:19},
 {x:639,y:546,w:192,h:19},{x:815,y:438,w:193,h:19},
 {x:985,y:330,w:197,h:19},{x:950,y:215,w:282,h:19},
 {x:0,y:87,w:1280,h:27}
];
const VALVE={x:918,y:1370},SENSOR={x:1100,y:167},GATE={x:1200,y:170};
const base=[{x:127,y:2420,r:175},{x:408,y:2293,r:158},{x:848,y:2035,r:156},
{x:682,y:1747,r:148},{x:276,y:1511,r:143},
{x:535,y:1368,r:144},{x:897,y:1264,r:142},
{x:353,y:922,r:143},{x:763,y:724,r:146},{x:1067,y:296,r:155}];
for(const L of S.lamps){
 if(L.phase==='ready'){L.wait-=dt;if(L.wait<=0&&Math.abs(S.y-L.y)<540){L.phase='warning';L.wait=.85;}}
 else if(L.phase==='warning'){L.wait-=dt;if(L.wait<=0){L.phase='fall';L.at=L.top;}}
 else if(L.phase==='fall'){
  L.at=Math.min(L.y,L.at+840*dt);
  if(!S.dead&&Math.abs(S.x-L.x)<50&&Math.abs(S.y-L.at)<78)hurt('ПАДІННЯ ЛАМПИ');
  if(L.at>=L.y){L.phase='cool';L.wait=1.8;}
 }else if(L.phase==='cool'){L.wait-=dt;if(L.wait<=0){L.phase='ready';L.wait=2;}}
}
if(Q&&D.towerGravity){S.grav*=-1;S.ground=false;S.vy=0;
 announce(S.grav===1?'ГРАВІТАЦІЯ ТЯГНЕ ВГОРУ. СТЕЛЯ СТАЄ ПІДЛОГОЮ.':'СПАЛАХ ЗНОВУ ПАДАЄ ВНИЗ.',3);
}
move(f,{bottom:2660,top:90,ice:(x,y)=>x>960&&y>1945&&y<2002});
if(S.grav===1&&S.y<116){S.y=116;S.vy=0;S.ground=true;}
if(S.y<1660&&S.y>1510&&S.grav===-1)checkpoint(308,1518);
if(S.y<1150&&S.y>1050&&S.grav===-1)checkpoint(547,1086);
if(S.y<355)checkpoint(1058,215);
const hasBridge=S.strokes.some(st=>st.state==='solid'&&!S.carryStroke&&
 st.len>193&&Math.abs(Math.cos(st.angle))>.8&&st.cx>635&&st.cx<810&&st.cy>1365&&st.cy<1452);
if(hasBridge&&S.x>834&&S.y<1500&&S.y>1350)D.shaftBridge=true;
let used=false;
if(E&&!S.dead){
 if(d2(S.x,S.y-39,VALVE.x,VALVE.y)<96){used=true;
  if(D.shaftBridge){D.towerGravity=true;announce('ТЕПЕР ПРАЦЮЄ ІНВЕРТОР ГРАВІТАЦІЇ. Q ЗМІНЮЄ НАПРЯМОК ТЯЖІННЯ.',5);}
  else announce('ІНВЕРТОР НЕ ОТРИМУЄ ЖИВЛЕННЯ. ПОКЛАДИ ТВЕРДИЙ ШТРИХ ЯК МІСТ ЧЕРЕЗ ПРОВАЛ.',4);
 }else if(d2(S.x,S.y-42,GATE.x,GATE.y)<105){used=true;
  if(D.towerTop)doorway(4,112,635);
  else announce('СТЕЛЬОВИЙ СЕНСОР ЧЕКАЄ НА ШЛЕЙФ X ПІСЛЯ ІНВЕРСІЇ ГРАВІТАЦІЇ.',4);
 }
}
inkUpdate(!used);
if(!D.towerTop&&D.towerGravity&&S.grav===1&&
 (S.shot?d2(S.shot.x,S.shot.y,SENSOR.x,SENSOR.y)<90:false||false)){} // only X trail powers it
if(!D.towerTop&&D.towerGravity&&K.x&&d2(S.x,S.y-42,SENSOR.x,SENSOR.y)<107){
 D.towerTop=true;S.shake=.8;announce('СТЕЛЬОВИЙ СЕНСОР ПІЙМАВ СПАЛАХІВ ШЛЕЙФ! ДВЕРІ ВІДЧИНЕНІ.',5);
}
const pools=allLight(base);
const camGoal=minmax(S.y-182,360,2250);S.camY+=(camGoal-S.camY)*(1-Math.exp(-dt*4.8));
if(R.ok){
 background(2600,S.camY);const w=R.world,b=R.back;
 lights(pools);for(const p of f)platform(w,p);
 for(let y=170;y<2510;y+=215){
  line(R.front,121,y-98,121,y+102,0x97b7c3,.15,3);
  line(R.front,1169,y-100,1169,y+91,0x8aa8b9,.17,3);
  box(b,20,y,72,16,0x54768c,.27);
 }
 box(b,634,1413,194,86,0x020711,.92);
 line(w,630,1407,630,1492,0xe6a4aa,.58,3);
 line(w,829,1407,829,1492,0xe6a4aa,.58,3);
 for(const L of S.lamps){
  if(L.phase==='warning'){
   halo(b,L.x,L.y,110,0xff6483,.23+.12*Math.abs(Math.sin(S.elapsed*17)));
   for(let y=L.top;y<L.y;y+=54)box(w,L.x-17,y,34,10,0xff6784,.48);
  }
  if(L.phase==='fall'||L.phase==='cool'){
   box(w,L.x-38,L.at-25,76,31,0x6b8392,.96);
   circle(w,L.x,L.at+11,17,0xacffea);
  }else box(w,L.x-36,L.top-27,73,28,0x667d8b,.94);
 }
 box(w,VALVE.x-33,1338,66,63,0x394b64,.97);
 circle(w,VALVE.x,1369,18,D.towerGravity?0xa9ffe4:0xd89fba);
 halo(b,SENSOR.x,SENSOR.y,78,D.towerTop?0x92ffe2:0xeb9ca3,.17);
 w.lineStyle(4,D.towerTop?0x8effd9:0xe9a0ad,.98);w.drawCircle(SENSOR.x,SENSOR.y,28);
 circle(w,SENSOR.x,SENSOR.y,12,D.towerTop?0x9effe0:0x9d637a);
 gate(GATE.x,215,D.towerTop);
 strokeArt();
}
playerArt(pools,S.camY);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,S.camY,'',0);
let task='ПІДІЙМАЙСЯ ВГОРУ. НА СЕРЕДНЬОМУ РІВНІ ВІДСУТНІЙ МІСТ — ВИКОРИСТАЙ ТВЕРДИЙ ШТРИХ.';
if(S.y>1320&&S.y<1610&&!D.shaftBridge)task='ПРОВАЛ МІЖ ПЛАТФОРМАМИ. ПОСТАВ ГОРИЗОНТАЛЬНИЙ ШТРИХ ЧЕРЕЗ НЬОГО (X → E → E).';
else if(D.shaftBridge&&!D.towerGravity)task='МІСТ ЗАРЯДИВ МЕХАНІЗМ. НА ПРАВІЙ ПЛАТФОРМІ Є ІНВЕРТОР E.';
else if(D.towerGravity&&!D.towerTop)task='Q МІНЯЄ ГРАВІТАЦІЮ. ПІДЛЕТИ ДО ВЕРХНЬОГО СЕНСОРА ЗІ ШЛЕЙФОМ X.';
else if(D.towerTop)task='НА СТЕЛІ СПРАЦЮВАВ СЕНСОР. ДВЕРІ ПРАВОРУЧ ВЕДУТЬ ДО ЗАЛИ УЛАМКІВ.';
hud('03','ПІДВІШЕНИЙ ХРЕБЕТ',task,pools,S.camY);
txt('W01','ШТРИХ → МІСТ');
txt('W02','ІНВЕРТОР Q');txt('W03','СТЕЛЬОВИЙ СЕНСОР X');
txt('W04','ПАДАЮЧІ ЛАМПИ');txt('W05','ВИХІД → 04');
txt('WLamp','ЗМІНИ ГРАВІТАЦІЮ, АЛЕ НЕ ВТРАТЬ МІСТ');
})();
