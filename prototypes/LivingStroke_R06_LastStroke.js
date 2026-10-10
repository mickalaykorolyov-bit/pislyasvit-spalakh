// 06 / ОСТАННІЙ ШТРИХ: bridge -> same bar becomes fence -> break it into ammunition.
// The stealth rule remains strict: monster detects Spalakh only OUTSIDE light.
spawn({x:115,y:635});checkpoint(116,635);
if(!S.lastInit){
 S.lastInit=true;S.shadow={x:112,y:587,baseY:587};
 announce('ОСТАННЄ ВИПРОБУВАННЯ: ОДИН ШТРИХ МАЄ СТАТИ МОСТОМ, ПОТІМ ПАРКАНОМ, А ПОТІМ СНАРЯДОМ.',7);
}
const floors=[{x:0,y:635,w:508,h:85},{x:719,y:635,w:561,h:85},{x:188,y:528,w:186,h:18}];
const gap={left:508,right:719},TARGET={x:1110,y:567},EXIT={x:1209,y:584};
const lamps=[{x:368,y:577,r:144},{x:801,y:576,r:140},{x:1179,y:572,r:137}];
const bridge=S.strokes.some(st=>st.state==='solid'&&st!==S.carryStroke
 &&st.len>=208&&Math.abs(Math.cos(st.angle))>.8&&st.cx>525&&st.cx<687
 &&st.cy>=610&&st.cy<662);
const fence=S.strokes.some(st=>st.state==='solid'&&st!==S.carryStroke
 &&st.len>=155&&Math.abs(Math.cos(st.angle))<.44&&st.cx>864&&st.cx<1057);
move(floors,{bottom:833});
let handled=false;
if(E&&!S.dead&&d2(S.x,S.y-39,EXIT.x,EXIT.y)<92){
 handled=true;
 if(D.finalBridge&&D.finalFence&&D.finalHit&&D.bridgeLesson&&D.fenceLesson&&
 D.towerTop&&D.shatterLesson&&D.hiveToken){
  D.won=true;S.shake=1;announce('МОСТОМ. ЩИТОМ. СНАРЯДОМ. ТИ НАВЧИВСЯ ВОЛОДІТИ ВЛАСНИМ СВІТЛОМ!',99);
 }else announce('БРАМА ВИМАГАЄ: ПЕРЕЙТИ СВІТЛОВИЙ МІСТ, ПОСТАВИТИ ПАРКАН, ВЛУЧИТИ УЛАМКОМ.',5);
}
inkUpdate(!handled);
if(!D.finalBridge&&bridge&&S.x>742&&S.y>587){
 D.finalBridge=true;S.shake=.7;checkpoint(766,635);
 announce('ТИ ПЕРЕЙШОВ МІСТ ЗІ СВОГО СВІТЛА. А ТЕПЕР ПОВЕРНИ ШТРИХ Q ТА ПОСТАВ ЙОГО ЯК ПАРКАН.',5);
}
if(D.finalBridge&&!D.finalFence&&fence&&S.x>906){
 D.finalFence=true;S.shake=.65;
 announce('СВІТЛОВИЙ ПАРКАН СТРІМУЄ ВОРОГА. ТЕПЕР РОЗБИЙ ЦЕЙ САМИЙ ШТРИХ G!',5);
}
if(D.finalFence&&!D.finalHit&&hitShot(TARGET.x,TARGET.y,70)){
 D.finalHit=true;S.shake=.95;
 announce('СВІТЛОВИЙ УЛАМОК ВЛУЧИВ У ФІНАЛЬНИЙ РЕЗОНАТОР. ДВЕРІ ГОТОВІ!',6);
}
const pools=allLight(lamps);
chaser(S.shadow,pools,{speed:66,name:'ПОЖИРАЧ ТІНІ',notice:205,radius:40});
if(R.ok){
 background();const w=R.world,b=R.back;lights(pools);
 for(const p of floors)platform(w,p);
 box(b,508,640,211,80,0x020814,.94);
 for(let x=518;x<715;x+=42)line(w,x,638,x+23,714,0x6984a0,.25,2);
 for(let x of [508,719])line(w,x,620,x,715,0x8babbc,.46,3);
 halo(b,TARGET.x,TARGET.y,83,D.finalHit?0xa2ffdb:0xf4a1ad,.17);
 w.lineStyle(4,D.finalHit?0xa9ffe9:0xdf8aa5,.94);
 w.drawCircle(TARGET.x,TARGET.y,28);
 circle(w,TARGET.x,TARGET.y,11,D.finalHit?0x8dfde2:0x8d5777);
 // Three symbolic sockets represent the same piece being transformed.
 for(let i=0;i<3;i++){
  const p={x:875+i*85,y:250},ok=[D.finalBridge,D.finalFence,D.finalHit][i];
  halo(b,p.x,p.y,53,ok?0xa3ffe7:0xc8889c,.13);
  circle(w,p.x,p.y,20,ok?0x9bffda:0x725875);
  w.lineStyle(2,ok?0xe0fff2:0xb899ba,.89);w.drawCircle(p.x,p.y,29);
 }
 gate(EXIT.x,635,D.finalBridge&&D.finalFence&&D.finalHit);
 enemyArt(S.shadow);strokeArt();
}
playerArt(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let goal='СТВОРИ ДОВГИЙ ШТРИХ X, ПОКЛАДИ ЯК МІСТ ПОПЕРЕК ПРОВАЛЛЯ І ПЕРЕЙДИ НА ПРАВИЙ БІК.';
if(D.finalBridge&&!D.finalFence)goal='ТЕПЕР ЗАБЕРИ ШТРИХ ІЗ ПРАВОГО КРАЮ МОСТА [E], ПЕРЕНЕСИ, ПОВЕРНИ Q, ПОСТАВ ПАРКАН.';
else if(D.finalFence&&!D.finalHit)goal='ПАРКАН Є! ПІДІЙДИ БЛИЖЧЕ, G — РОЗБИЙ. E — ПІДНІМИ УЛАМОК, F — КИНЬ У СЕНСОР ПРАВОРУЧ.';
else if(D.finalHit)goal='ШТРИХ ВИКОНАВ ТРИ РОЛІ. ПРАВІ ДВЕРІ ВІДКРИТО — НАТИСНИ E!';
hud('06','ОСТАННІЙ ШТРИХ',goal,pools);
txt('W01',D.finalBridge?'МІСТ ✓':'МІСТ ○');
txt('W02',D.finalFence?'ПАРКАН ✓':'ПАРКАН ○');
txt('W03',D.finalHit?'УЛАМОК ✓':'УЛАМОК ○');
txt('W04','X → E → Q → G → F');
txt('W05','ВИХІД → ФІНАЛ');
txt('WLamp','У СВІТЛІ НЕВИДИМИЙ. У ТЕМРЯВІ — ЗДОБИЧ');
})();
