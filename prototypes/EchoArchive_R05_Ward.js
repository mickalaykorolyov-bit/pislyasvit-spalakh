// R05 — КАМ'ЯНИЙ ВАРТОВИЙ. Break the monster with a suspended hydraulic anvil.
// Its pieces remain alive; carry one onward as a dangerous tool.
const ROOM=5;
spawn({x:110,y:635});checkpoint(111,635);
const P=[{x:0,y:635,w:1280,h:85},{x:192,y:529,w:180,h:18},{x:675,y:514,w:194,h:18}];
const CHARGER={x:739,y:580},LEVER={x:821,y:587},STONE={x:984,y:575};
if(!S.wardInit){
 S.wardInit=true;S.anvil='ready';S.anvilY=196;S.anvilClock=0;S.wardCharged=false;
 say('ТУТ Є КАМ’ЯНИЙ ВАРТОВИЙ. ЙОГО НЕ МОЖНА ВБИТИ — ЛИШЕ РОЗБИТИ Й ВИКОРИСТАТИ УЛАМКИ.',6);
}
let pools=[{x:129,y:581,r:188},{x:492,y:585,r:159},{x:1156,y:585,r:149}];
if(D.monsterBroken)pools.push({x:987,y:580,r:129});
if(!S.dead&&!D.won){
 if(!S.wardCharged&&K.ink&&hotNear(CHARGER.x,CHARGER.y,77)){
  S.wardCharged=true;S.shake=.57;
  say('ТВОЄ СЯЙВО ПОДАЛО СИГНАЛ ПРЕСУ. ТЕПЕР НАТИСНИ E НА МЕХАНІЗМІ ПРАВОРУЧ.',5);
 }
 if(S.anvil==='warning'){
  S.anvilClock-=dt;if(S.anvilClock<=0)S.anvil='fall';
 }
 if(S.anvil==='fall'){
  S.anvilY=Math.min(577,S.anvilY+840*dt);
  if(Math.abs(S.x-STONE.x)<63&&Math.abs(S.y-S.anvilY)<86)hurt('УДАР ГІДРАВЛІЧНОГО ПРЕСА');
  if(S.anvilY>=577){
   S.anvil='landed';D.monsterBroken=true;S.shake=.94;
   say('ВАРТОВОГО РОЗБИТО НА ТРИ ЖИВІ УЛАМКИ. ВОНИ ПЕРЕСЛІДУВАТИМУТЬ ТЕБЕ ДО КІНЦЯ ГРИ!',6.1);
  }
 }
 walk(P,{bottom:792});
 if(E&&!S.trace){
  if(distance(S.x,S.y-40,LEVER.x,LEVER.y)<92&&!D.monsterBroken){
   if(!S.wardCharged)say('ПРЕС БЕЗ ЖИВЛЕННЯ. ПРОБІЖИ ПОВЗ КРУГЛИЙ СЕНСОР ІЗ ЗАТИСНУТОЮ X.',4.5);
   else if(S.anvil==='ready'){
    S.anvil='warning';S.anvilClock=1;S.shake=.5;
    say('ПРЕС ПАДЕ ЗА 1 СЕКУНДУ. ВІДІЙДИ ВІД КАМ’ЯНОГО ВАРТОВОГО!',4.3);
   }
  }else if(distance(S.x,S.y-38,1207,583)<94){
   if(D.monsterBroken)visit(6,{x:111,y:635});
   else say('ТРИ ЖИВІ УЛАМКИ МОНСТРА ПОТРІБНІ ДЛЯ РОЗВ’ЯЗАННЯ НАСТУПНИХ ЗАГАДОК.',4);
  }else if(distance(S.x,S.y-38,76,583)<90)visit(4,{x:1100,y:635});
 }
}
shards(5,pools);
if(A.ok){
 worldBase();const w=A.world,b=A.back;lights(pools);
 for(const p of P)ground(w,p);
 halo(b,CHARGER.x,CHARGER.y,76,S.wardCharged?0x9fffe0:0xef8c9e,.13);
 w.lineStyle(4,S.wardCharged?0xa1ffdd:0xdc869c,.92);w.drawCircle(CHARGER.x,CHARGER.y,25);
 circle(w,CHARGER.x,CHARGER.y,10,S.wardCharged?0x95ffe0:0x96607a);
 drawBox(w,LEVER.x-35,557,71,61,0x35435d,.98);
 circle(w,LEVER.x,585,16,S.wardCharged?0x9bffe4:0x998098);
 line(w,STONE.x,107,STONE.x,197,0xa2b7bf,.62,4);
 if(S.anvil==='warning'){
  halo(b,STONE.x,583,121,0xf95b79,.20+.12*Math.abs(Math.sin(S.elapsed*19)));
  for(let y=193;y<572;y+=53)drawBox(w,STONE.x-19,y,38,11,0xfa6685,.47);
 }
 drawBox(w,STONE.x-83,(S.anvil==='ready'?199:S.anvilY)-28,166,47,0x657987,.97);
 for(let x=-54;x<=54;x+=36)line(w,STONE.x+x,(S.anvil==='ready'?199:S.anvilY)-22,
  STONE.x+x+17,(S.anvil==='ready'?199:S.anvilY)+13,0xb4b3be,.34,3);
 if(!D.monsterBroken){
  halo(b,STONE.x,STONE.y,116,0xbe829c,.16);
  circle(w,STONE.x,STONE.y-52,53,0x514057);
  for(let sign of [-1,1])for(let i=0;i<4;i++)
   line(w,STONE.x+sign*28,STONE.y-45+i*17,STONE.x+sign*(74+i*2),STONE.y-62+i*19,0x95768d,.59,5);
  circle(w,STONE.x-18,STONE.y-61,6,0xff7f9a);
  circle(w,STONE.x+19,STONE.y-61,6,0xff7f9a);
 }else{
  halo(b,STONE.x,STONE.y-34,91,0xaafbdd,.07);
  for(let x=925;x<1051;x+=33)drawBox(w,x,613,27,15,0x815f72,.85);
 }
 door(72,635,74,true,0x9feadb);
 door(1207,635,79,D.monsterBroken,0xa4ffda);
}
drawEnemies(5);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЗАРЯДИ КРУГЛИЙ СЕНСОР ШЛЕЙФОМ X, ПОТІМ НАТИСНИ E НА ПРЕСІ. НЕ СТІЙ ПІД ПРЕСОМ!';
if(S.wardCharged&&!D.monsterBroken)task='СЕНСОР ПРЕСА СПРАЦЮВАВ. ПОРУЧ Є КОНСОЛЬ E. ВІДІЙДИ ДО ПАДІННЯ.';
else if(D.monsterBroken)task='КАМІНЬ РОЗБИВСЯ, АЛЕ УЛАМКИ ЖИВІ! ПІДНІМИ ОДИН E, КИНЬ F АБО НЕСИ В НАСТУПНУ КІМНАТУ.';
hud('05','КАМ’ЯНИЙ ВАРТОВИЙ',task,pools);
label('W01','X → СЕНСОР ПРЕСА');
label('W02','ВАЖКИЙ ПРЕС E');
label('W03',D.monsterBroken?'ТРИ УЛАМКИ ПЕРЕСЛІДУЮТЬ':'КАМ’ЯНИЙ ВОРОГ');
label('W04','E ВЗЯТИ / F КИНУТИ');
label('W05','ДВЕРІ → 06');
label('WLamp','РОЗБИТИ НЕ ОЗНАЧАЄ ЗНЕШКОДИТИ');
})();
