// R07 — СЕРЦЕ АРХІВУ. Finale combines learned temporal trail echo + living monster piece.
// Three recurring falling lamps threaten the player during multitask.
const ROOM=7;
spawn({x:111,y:635});checkpoint(111,635);
const P=[{x:0,y:635,w:1280,h:85},{x:230,y:516,w:195,h:18},{x:773,y:503,w:200,h:18}];
const REC={x:442,y:585},PAD={x:566,y:613},SENSOR={x:853,y:584},
 TARGET={x:1063,y:570},GATE={x:1210,y:585};
if(!S.finalInit){
 S.finalInit=true;S.echoPadTime=0;S.tape=[];S.ghost=null;
 S.lamps=[
  {x:718,y:141,phase:'ready',timer:1.6},
  {x:1011,y:138,phase:'ready',timer:2.9}
 ];
 say('СЕРЦЕ АРХІВУ ВИМАГАЄ ДВОХ РІЗНИХ ДЖЕРЕЛ: ЗАПИСАНИЙ X-СЛІД І КИНУТИЙ ЖИВИЙ УЛАМОК.',7);
}
let pools=[{x:131,y:583,r:170},{x:454,y:580,r:154},{x:916,y:563,r:142}];
if(S.ghostPoint)pools.push({x:S.ghostPoint.x,y:S.ghostPoint.y,r:99,c:0xc9afff,a:.16});
if(D.finalEcho)pools.push({x:712,y:561,r:146});
if(D.finalShard)pools.push({x:1081,y:565,r:169});
const prerequisites=D.towerUp&&D.echoPuzzle&&D.galleryRead&&D.glyph.triangle&&D.monsterBroken&&D.hiveToken;
if(!S.dead&&!D.won){
 for(const lamp of S.lamps){
  if(lamp.phase==='ready'){lamp.timer-=dt;if(lamp.timer<=0){lamp.phase='warning';lamp.timer=.8;}}
  else if(lamp.phase==='warning'){lamp.timer-=dt;if(lamp.timer<=0){lamp.phase='fall';lamp.y=145;}}
  else if(lamp.phase==='fall'){
   lamp.y=Math.min(612,lamp.y+940*dt);
   if(Math.abs(S.x-lamp.x)<50&&Math.abs(S.y-lamp.y)<86)hurt('СТЕЛЬОВА ЛАМПА');
   if(lamp.y>=612){lamp.phase='cool';lamp.timer=1.7;}
  }else if(lamp.phase==='cool'){lamp.timer-=dt;if(lamp.timer<=0){lamp.phase='ready';lamp.timer=2;}}
 }
 walk(P,{bottom:797});
 if(E){
  if(distance(S.x,S.y-34,REC.x,REC.y)<88){
   beginEcho();
  }else if(distance(S.x,S.y-35,GATE.x,GATE.y)<94){
   if(prerequisites&&D.finalEcho&&D.finalShard){
    D.won=true;S.shake=1.2;say('СЕМЕРО КІМНАТ. ОДНЕ ВІДЛУННЯ. ТИ ВІДКРИВ АРХІВ СВІТЛА!',99);
   }else say('СЕРЦЕ ЧЕКАЄ: СЛІД-ВІДЛУННЯ, ЖИВИЙ УЛАМОК І ВСІ ВІДКРИТТЯ ІНШИХ КІМНАТ.',5.5);
  }else if(distance(S.x,S.y-37,70,585)<89)visit(6,{x:1139,y:635});
 }
 if(!D.finalEcho&&echoNear(SENSOR.x,SENSOR.y,84)&&distance(S.x,S.y-28,PAD.x,PAD.y)<93){
  S.echoPadTime+=dt;
  if(S.echoPadTime>=.15){
   D.finalEcho=true;S.shake=.7;say('ЗАПИСАНИЙ ШЛЕЙФ ПРИЙШОВ НА ДАЛЕКИЙ СЕНСОР, ПОКИ СПАЛАХ БУВ НА ПЛИТІ.',5.8);
  }
 }else S.echoPadTime=Math.max(0,S.echoPadTime-dt*.3);
}
shards(7,pools,{x:TARGET.x,y:TARGET.y,r:81,onHit:()=>{
 if(!D.finalShard){D.finalShard=true;S.shake=.85;
  say('ЖИВИЙ УЛАМОК ЗАРЯДИВ ІНШУ ПОЛОВИНУ СЕРЦЯ. ДВІ СИСТЕМИ З’ЄДНАНО!',6);}
}});
if(A.ok){
 worldBase();const w=A.world,b=A.back;lights(pools);
 for(const p of P)ground(w,p);
 // Three important items acquired throughout the journey remain visibly present.
 for(let i=0;i<5;i++){
  const x=287+i*88,ok=[D.towerUp,D.echoPuzzle,D.galleryRead,D.monsterBroken,D.hiveToken][i];
  halo(b,x,252,51,ok?0x96ffe7:0xac729d,ok?.14:.06);
  circle(w,x,252,18,ok?0x98ffe1:0x77576e);
  w.lineStyle(2,0xeddced,.56);w.drawCircle(x,252,29);
 }
 drawBox(w,REC.x-37,555,73,62,0x354665,.96);
 for(const dx of [-18,18]){
  w.lineStyle(4,0xbebdff,.94);w.drawCircle(REC.x+dx,REC.y,15);
  circle(w,REC.x+dx,REC.y,5,0xad9eea);
 }
 drawBox(w,PAD.x-55,613,111,18,
  distance(S.x,S.y-28,PAD.x,PAD.y)<93?0x9cffe5:0xd2ac89,.91);
 w.lineStyle(4,D.finalEcho?0x94ffe2:0xb9a0ff,.94);w.drawCircle(SENSOR.x,SENSOR.y,29);
 circle(w,SENSOR.x,SENSOR.y,11,D.finalEcho?0xa8ffe2:0x8b6eb1);
 w.lineStyle(4,D.finalShard?0x93ffdf:0xec91ad,.94);w.drawCircle(TARGET.x,TARGET.y,30);
 circle(w,TARGET.x,TARGET.y,11,D.finalShard?0x8bffdf:0xa45d7b);
 for(const lamp of S.lamps){
  if(lamp.phase==='warning'){
   halo(b,lamp.x,588,118,0xfd6481,.19+.15*Math.abs(Math.sin(S.elapsed*18)));
   for(let y=146;y<604;y+=56)drawBox(w,lamp.x-18,y,36,11,0xf77891,.48);
  }
  if(lamp.phase==='fall'||lamp.phase==='cool'){
   drawBox(w,lamp.x-41,lamp.y-30,82,32,0x73828b,.97);
   circle(w,lamp.x,lamp.y+11,18,0xaaffee);
   if(lamp.phase==='cool')halo(b,lamp.x,584,98,0xa3ffe7,.14);
  }else drawBox(w,lamp.x-36,116,72,28,0x637785,.97);
 }
 if(S.ghost){
  drawBox(w,393,177,524,12,0x292a54,.95);
  drawBox(w,395,179,520*clamp(S.ghostFrame/S.ghost.length,0,1),8,0xc6b3ff,.94);
 }
 const open=prerequisites&&D.finalEcho&&D.finalShard;
 door(GATE.x,635,93,open,0xa3ffdf);
 door(70,635,74,true,0xa8f6de);
 if(open)halo(b,GATE.x,567,166,0xb6fff0,.21);
}
drawEnemies(7);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЗАПИШИ X-ШЛЕЙФОМ МАРШРУТ ВІД ЦЕНТРУ ДО ДАЛЕКОГО СЕНСОРА. ВІДТВОРИ ЙОГО НА КОНСОЛІ E.';
if(S.ghost&&!D.finalEcho)task='ПРИМАРА ПОВТОРЮЄ МАРШРУТ! СТАНЬ НА ПЛИТУ ПРАВОРУЧ ВІД КОНСОЛІ, ПОКИ ВІДЛУННЯ ДОСЯГНЕ СЕНСОРА.';
else if(D.finalEcho&&!D.finalShard)task='ВІДЛУННЯ ЗАРЯДИЛО ПОЛОВИНУ. ПІДНІМИ УЛАМОК ВАРТОВОГО E ТА КИНЬ F В ПРАВИЙ КРУГ.';
else if(D.finalEcho&&D.finalShard)task='ОБИДВА РЕЗОНАТОРИ ЖИВІ. ПІДІЙДИ ДО ФІНАЛЬНОЇ БРАМИ ПРАВОРУЧ [E].';
hud('07','СЕРЦЕ АРХІВУ',task,pools);
label('W01','ЗАПИСАТИ X / ВІДТВОРИТИ E');
label('W02','СТАНЬ НА ПЛИТУ');
label('W03',D.finalEcho?'ВІДЛУННЯ ✓':'СЕНСОР ВІДЛУННЯ ○');
label('W04',D.finalShard?'УЛАМОК ✓':'УЛАМОК МОНСТРА F');
label('W05',prerequisites?'ЗНАХІДКИ ЗІБРАНО':'ПОТРІБНІ ПОПЕРЕДНІ КІМНАТИ');
label('WLamp','ЛАМПИ ПАДАЮТЬ ПІД ЧАС ФІНАЛУ');
})();
