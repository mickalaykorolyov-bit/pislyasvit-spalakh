// R03 — ЗАЛ ДВІЙНИКІВ. X records trajectory; E plays the luminous echo.
// The ghost must reach a distant sensor WHILE the real Spalakh stands on the near pressure plate.
const ROOM=3;
spawn({x:117,y:635});checkpoint(115,635);
const P=[{x:0,y:635,w:1280,h:85},{x:273,y:522,w:195,h:18},{x:745,y:516,w:190,h:18}];
const RECORD={x:445,y:586},PAD={x:570,y:613},FAR={x:833,y:585},GATE={x:1208,y:585};
let pools=[{x:132,y:581,r:188},{x:510,y:582,r:169},{x:904,y:573,r:150}];
if(S.ghostPoint)pools.push({x:S.ghostPoint.x,y:S.ghostPoint.y,r:99,c:0xb3acff,a:.15});
if(!S.echoInit){
 S.echoInit=true;S.padWait=0;S.tape=[];S.ghost=null;S.ghostPoint=null;
 say('ТУТ Є ЗАПИСУВАЧ СВІТЛОВОГО СЛІДУ. ЗАТИСНИ X, ПРОБІЖИ ВІД ЦЕНТРУ ДО ПРАВОГО СЕНСОРА.',7);
}
if(!S.dead&&!D.won){
 walk(P,{bottom:790});
 if(E){
  if(distance(S.x,S.y-36,RECORD.x,RECORD.y)<89){
   beginEcho();
   checkpoint(463,635);
  }else if(distance(S.x,S.y-35,GATE.x,GATE.y)<91){
   if(D.echoPuzzle)visit(4,{x:112,y:635});
   else say('ДВЕРІ ВІДКРИЮТЬСЯ, КОЛИ ТИ І ТВОЄ ВІДЛУННЯ ОДНОЧАСНО АКТИВУЄТЕ ДВА ПУНКТИ.',4.5);
  }else if(distance(S.x,S.y-35,71,582)<87){
   visit(2,{x:1115,y:323});
  }
 }
 if(!D.echoPuzzle&&echoNear(FAR.x,FAR.y,105)&&distance(S.x,S.y-29,PAD.x,PAD.y)<91){
  S.padWait+=dt;
  if(S.padWait>=.18){
   D.echoPuzzle=true;S.shake=.9;
   say('ЗБІГ! ТВОЄ ВІДЛУННЯ ЗАПАЛИЛО ДАЛЕКИЙ СЕНСОР, А ТИ САМ УТРИМАВ БЛИЖНЮ ПЛИТУ.',7);
  }
 }else S.padWait=Math.max(0,S.padWait-dt*.2);
}
shards(3,pools);
if(A.ok){
 worldBase();const w=A.world,b=A.back;
 lights(pools);for(const p of P)ground(w,p);
 // Memory playback console resembles a tape spool and a mirrored receiver.
 drawBox(w,RECORD.x-39,554,77,64,0x2f4262,.96);
 for(const dx of [-20,20]){
  w.lineStyle(4,0xbdcaff,.84);w.drawCircle(RECORD.x+dx,RECORD.y,14);
  circle(w,RECORD.x+dx,RECORD.y,6,0xada7e1);
 }
 halo(b,RECORD.x,RECORD.y,84,0x9ca0ff,.15);
 // Pedestal one needs corporeal weight — a ghost alone cannot satisfy it.
 drawBox(w,PAD.x-69,626,138,11,0x334c5a,.92);
 const onPad=distance(S.x,S.y-29,PAD.x,PAD.y)<91;
 drawBox(w,PAD.x-52,616,104,10,onPad?0x98fae2:0xc1ad8d,.89);
 halo(b,PAD.x,598,70,onPad?0x93ffe4:0xf7c7a0,.10);
 // Pedestal two accepts ONLY playback, not the player.
 w.lineStyle(4,D.echoPuzzle?0x8effd8:0xa59dff,.97);
 w.drawCircle(FAR.x,FAR.y,30);
 circle(w,FAR.x,FAR.y,12,D.echoPuzzle?0x8afee3:0x7965af);
 halo(b,FAR.x,FAR.y,78,echoNear(FAR.x,FAR.y,105)?0xc4b0ff:0x7881ae,.13);
 for(let x=470;x<904;x+=74){
  line(w,x,496,x+32,496,0x8f88be,.39,2);
  circle(w,x+17,496,4,0xad93de,.56);
 }
 door(GATE.x,635,79,D.echoPuzzle,0x9fffe0);
 door(72,635,74,true,0xbad9f0);
 // Playback timeline shows where the echo is inside the captured recording.
 if(S.ghost){
  drawBox(w,381,161,550,13,0x393653,.92);
  drawBox(w,383,163,546*clamp(S.ghostFrame/Math.max(1,S.ghost.length),0,1),9,0xb0acff,.90);
 }
}
drawEnemies(3);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЗАПИШИ СВІЙ МАРШРУТ: БІЖИ ІЗ ЗАТИСНУТОЮ X ВІД СЕРЕДНЬОГО ПУЛЬТА ПРАВОРУЧ. ПОТІМ ПОВЕРНИСЯ ДО ПУЛЬТА.';
if(S.tape.length>=28&&!S.ghost&&!D.echoPuzzle)
 task='ЗАПИС Є ('+S.tape.length+' КАДРІВ). ПІДІЙДИ ДО ПУЛЬТА ПО ЦЕНТРУ ТА НАТИСНИ E ДЛЯ ВІДТВОРЕННЯ.';
if(S.ghost&&!D.echoPuzzle)task='ВІДЛУННЯ ВЖЕ РУХАЄТЬСЯ! СТАНЬ НА ЖОВТУ ПЛИТУ БІЛЯ ПУЛЬТА, ПОКИ ПРИМАРА ДОСЯГНЕ ДАЛЕКОГО КРУГА.';
if(D.echoPuzzle)task='ДВА МЕХАНІЗМИ СПРАЦЮВАЛИ В ОДИН МОМЕНТ. ПРАВІ ДВЕРІ ВІДКРИТІ → ГАЛЕРЕЯ ТЕМРЯВИ.';
hud('03','ЗАЛ ДВІЙНИКІВ',task,pools);
label('W01','E → ВІДТВОРИТИ ЗАПИС');
label('W02','ПЛИТА: СПАЛАХ');
label('W03','ДАЛЕКИЙ СЕНСОР: ЛИШЕ ВІДЛУННЯ');
label('W04',D.echoPuzzle?'ПОЄДНАННЯ ✓':'ЗБІГ У ЧАСІ ○');
label('W05','ДВЕРІ → 04');
label('WLamp','ПРИМАРА КОПІЮЄ ШЛЯХ X');
})();
