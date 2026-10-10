// 01 / ПАМ'ЯТЬ РОЗБИТОГО СВІТЛА — bridge > break > distribute 3 shards > restore under stone bowl.
spawn({x:109,y:635});checkpoint(108,635);
if(!S.memInit){
 S.memInit=true;S.crab={x:1154,y:587,baseY:587};S.socket=[false,false,false];S.lift=0;
 announce('СВІТЛО ПАМ’ЯТАЄ СВОЮ ФОРМУ. НАМАЛЮЙ МІСТ X, А ПОТІМ СПРОБУЙ РОЗБИТИ ЙОГО G.',6);
}
const P=[{x:0,y:635,w:486,h:85},{x:696,y:635,w:584,h:85},{x:215,y:527,w:172,h:18}];
const SOCK=[{x:778,y:578},{x:865,y:578},{x:952,y:578}],SENSOR={x:1067,y:575},EXIT={x:1220,y:579};
const litBase=[{x:133,y:568,r:182},{x:359,y:578,r:138},{x:737,y:573,r:159},{x:1068,y:568,r:145}];
if(D.room1Raised)litBase.push({x:1169,y:577,r:181});
move(P,{bottom:815});
inkUpdate(!E||(!S.carryPiece&&!SOCK.some(p=>d2(S.x,S.y-39,p.x,p.y)<74)));
const bridge=S.strokes.find(t=>t.state==='solid'&&t!==S.carryStroke&&t.len>214&&
 Math.abs(Math.cos(t.angle))>.84&&t.cx>530&&t.cx<651&&t.cy>615&&t.cy<658);
if(!D.room1Bridge&&bridge&&S.x>705&&S.y>578){
 D.room1Bridge=true;checkpoint(732,635);S.shake=.7;
 announce('МІСТ ВИТРИМАВ СПАЛАХА. ТЕПЕР РОЗБИЙ САМЕ ЙОГО КЛАВІШЕЮ G БІЛЯ ПРАВОГО КРАЮ!',6);
}
if(D.room1Bridge&&G&&D.room1Broken&&!S.memGreet){
 S.memGreet=true;
 announce('ТРИ УЛАМКИ ЗАПАМ’ЯТАЛИ ДОВЖИНУ ТВОГО МОСТУ. ПЕРЕНЕСИ ЇХ У ТРИ КОЛБИ ПРАВОРУЧ.',6);
}
if(E&&!S.dead){
 const idx=SOCK.findIndex((p,i)=>!S.socket[i]&&d2(S.x,S.y-36,p.x,p.y)<83);
 if(idx>=0&&S.carryPiece&&D.room1Broken){
  S.carryPiece.used=true;S.carryPiece.held=false;S.carryPiece=null;
  S.socket[idx]=true;D.stoneSlots=S.socket.filter(Boolean).length;
  S.shake=.24;
  announce('УЛАМОК '+D.stoneSlots+'/3 В КОЛБІ. ВІН ДОСІ ПАМ’ЯТАЄ СВІЙ ПОЧАТКОВИЙ ШТРИХ.',4);
 }
 if(!D.room1Raised&&D.stoneSlots===3&&d2(S.x,S.y-38,SENSOR.x,SENSOR.y)<90){
  if(K.x||S.inkStart){
   D.room1Restored=true;D.room1Raised=true;S.lift=0;S.shake=.9;
   const original=D.memoryShape||{angle:0,len:265};
   S.rebuilt={cx:1108,cy:587,angle:original.angle,len:original.len};
   announce('ТРИ УЛАМКИ З’ЄДНАЛИСЯ У ПЕРШОПОЧАТКОВУ ФОРМУ І ПІДНЯЛИ КАМ’ЯНУ ЧАШУ!',7);
  }else announce('СЕНСОР ПОТРЕБУЄ ТВОГО ШЛЕЙФА X — ПРОБІЖИ КРІЗЬ КОЛО.',4);
 }
 if(d2(S.x,S.y-33,EXIT.x,EXIT.y)<92){
  if(D.room1Raised)doorway(2,113,635);
  else announce('ДВЕРІ ЧЕКАЮТЬ НА ВІДНОВЛЕНУ ФОРМУ МОСТУ ПІД КАМ’ЯНОЮ ЧАШЕЮ.',4);
 }
}
// Light charges only while moving or leaving an active glowing trace (not E).
if(!D.room1Raised&&D.stoneSlots===3&&K.x&&d2(S.x,S.y-43,SENSOR.x,SENSOR.y)<87){
 D.room1Restored=true;D.room1Raised=true;S.lift=0;S.shake=.92;
 const orig=D.memoryShape||{angle:0,len:267};
 S.rebuilt={cx:1107,cy:592,angle:orig.angle,len:orig.len};
 announce('СВІТЛО ЗГАДАЛО ПОЧАТКОВУ ФОРМУ: МІСТ ТЕПЕР ПІДНІМАЄ КАМ’ЯНУ ЧАШУ!',7);
}
if(D.room1Raised){S.lift=Math.min(83,S.lift+dt*90);if(!S.caged&&d2(S.crab.x,S.crab.y,1085,584)<84){S.caged=true;announce('ШТРИХ ПРИСУНУВ КРАБА ДО НІШІ. ТЕПЕР ВІН НЕ ПЕРЕКРИВАЄ ДВЕРІ.',4)}}
const illumination=allLight(litBase);
if(!D.room1Raised)chaser(S.crab,illumination,{speed:38,notice:150,name:'КРАБ',radius:47});
if(R.ok){
 background();const w=R.world,b=R.back;
 lights(illumination);
 for(const p of P)platform(w,p);
 box(b,486,639,210,80,0x020713,.98);
 for(let x=500;x<692;x+=37)line(w,x,640,x+12,717,0x607b8e,.20,2);
 line(w,485,630,485,716,0xb9a6ad,.39,3);line(w,696,630,696,716,0xb9a6ad,.39,3);
 // Triple memory sockets glow only when the original stroke has been fractured.
 for(let i=0;i<3;i++){
  const p=SOCK[i];box(w,p.x-26,560,52,61,0x304358,.95);
  circle(w,p.x,p.y,16,S.socket[i]?0xffa0c1:0x735c7e,.94);
  halo(b,p.x,p.y,60,S.socket[i]?0xfa86af:0x778eab,.13);
 }
 box(w,SENSOR.x-29,553,57,58,0x2e495e,.93);
 w.lineStyle(4,D.room1Raised?0x99ffe2:0xe9abb4,.92);w.drawCircle(SENSOR.x,SENSOR.y,22);
 circle(w,SENSOR.x,SENSOR.y,10,D.room1Raised?0x96ffe1:0xc28eaa);
 // Original shape is faithfully restored (length and orientation) but shifted under the lift.
 if(S.rebuilt){
  const rr=S.rebuilt,ox=Math.cos(rr.angle)*rr.len*.5,oy=Math.sin(rr.angle)*rr.len*.5;
  line(R.glow,rr.cx-ox,rr.cy-oy-S.lift*.1,rr.cx+ox,rr.cy+oy-S.lift*.1,0xff85af,.28,25);
  line(w,rr.cx-ox,rr.cy-oy-S.lift*.1,rr.cx+ox,rr.cy+oy-S.lift*.1,0xffbdd8,.95,9);
 }
 box(w,1035,319-S.lift,171,84,0x506a79,.99);
 box(w,1057,338-S.lift,124,37,0x738798,.99);
 for(let i=0;i<4;i++)line(w,1047+i*44,325-S.lift,1075+i*31,354-S.lift,0xb8bdc7,.32,3);
 for(let i=0;i<4;i++)circle(w,1055+i*43,320-S.lift,7,0xc1a7b5,.57);
 if(!D.room1Raised)enemyArt(S.crab);
 else{halo(b,1157,570,55,0x9dffdc,.09);}
 gate(EXIT.x,635,D.room1Raised);
 strokeArt();
}
playerArt(illumination);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let goal='НАМАЛЮЙ ГОРИЗОНТАЛЬНИЙ ШТРИХ X + D, ВІЗЬМИ E Й ПОКЛАДИ E ПОПЕРЕК ПРОВАЛЛЯ.';
if(D.room1Bridge&&!D.room1Broken)goal='МІСТ ДОПОМОГЛО ПЕРЕЙТИ. ТЕПЕР ПОВЕРНИСЯ ДО ЙОГО КРАЮ Й РОЗБИЙ G.';
else if(D.room1Broken&&D.stoneSlots<3)goal='РОЗБИТИЙ МІСТ ДАВ ТРИ УЛАМКИ. E ПІДІБРАТИ, E ПОКЛАСТИ В ПУСТІ КОЛБИ: '+D.stoneSlots+'/3.';
else if(D.stoneSlots===3&&!D.room1Raised)goal='ВСІ ТРИ УЛАМКИ НА МІСЦІ. ЗАТИСНИ X ПОРУЧ ІЗ КРУГЛИМ СЕНСОРОМ ПРАВОРУЧ.';
else if(D.room1Raised)goal='МОСТУ ПОВЕРНУЛИ ОРИГІНАЛЬНУ ФОРМУ: КАМ’ЯНУ ЧАШУ ПІДНЯТО. ПРАВІ ДВЕРІ E → 02.';
hud('01','ПАМ’ЯТЬ РОЗБИТОГО СВІТЛА',goal,illumination);
txt('W01','X → МІСТ');txt('W02',D.room1Broken?'G → 3 УЛАМКИ ✓':'G → РОЗБИТИ');
txt('W03','КОЛБИ '+D.stoneSlots+'/3');txt('W04',D.room1Raised?'ПАМ’ЯТЬ ФОРМИ ✓':'СЕНСОР X');
txt('W05','ДВЕРІ → 02');txt('WLamp','У СВІТЛІ КРАБ НЕ БАЧИТЬ СПАЛАХА');
})();
