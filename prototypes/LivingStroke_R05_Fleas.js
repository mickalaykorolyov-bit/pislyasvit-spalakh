// 05 / ПИЛЯКОВИЙ ВУЛИК: fleas rapidly infest; nearby placed stroke is UV shelter.
// Move a long upright illuminated stroke like a brush to sterilize the hive.
spawn({x:116,y:635});checkpoint(113,635);
if(!S.fleaInit){S.fleaInit=true;S.flies=0;S.fleaTimer=0;S.hive={x:1030,y:585};
 announce('БЛОХИ ПРИЛИПАЮТЬ У ТЕМРЯВІ Й СПОВІЛЬНЮЮТЬ СПАЛАХА. ТВЕРДИЙ ШТРИХ МОЖНА ВИКОРИСТАТИ ЯК УФ-ПАРКАН.',6);}
const floors=[{x:0,y:635,w:1280,h:85},{x:225,y:522,w:168,h:19},{x:666,y:514,w:184,h:19}];
const SHOWER={x:147,y:588},HIVE={x:1028,y:586},TOKEN={x:1128,y:587};
const base=[{x:132,y:574,r:156},{x:475,y:579,r:128},{x:1194,y:585,r:140}];
const litAreas=allLight(base),inInfestedZone=S.x>270;
if(inInfestedZone&&!D.hiveClean&&!S.dead){
 S.fleaTimer+=dt*(K.x?1.55:1)*(lit(S.x,S.y-43,litAreas)?.55:1);
 if(S.fleaTimer>=.58){S.fleaTimer=0;S.flies++;
  if(S.flies===9)announce('9 БЛІХ! РУХ СПОВІЛЬНЮЄТЬСЯ. НЕ ГАЙ ЧАСУ.',3.3);
  if(S.flies===19)announce('19 БЛІХ! МАЙЖЕ КРИТИЧНИЙ РІВЕНЬ. ШУКАЙ ДУШ ЛІВОРУЧ!',4);
 }
}
if(!S.dead&&S.flies>0&&S.strokes.some(st=>st.state==='solid'&&
 d2(S.x,S.y-30,st.cx,st.cy-38)<90)){
 S.flies=Math.max(0,S.flies-dt*3);
}
if(S.flies>=26)hurt('ПІКСЕЛЬНІ БЛОХИ');
move(floors,{bottom:824,slow:(x,y)=>x>708&&x<935&&y>610});
let handled=false;
if(E&&!S.dead){
 if(d2(S.x,S.y-34,SHOWER.x,SHOWER.y)<94){
  handled=true;S.flies=0;S.fleaTimer=0;S.shake=.28;
  announce('ОЧИЩУВАЛЬНИЙ ДУШ ЗМИВ УСІХ БЛІХ. СПАЛАХ ЗНОВУ ШВИДКИЙ.',4);
 }else if(D.hiveClean&&d2(S.x,S.y-35,TOKEN.x,TOKEN.y)<98&&!D.hiveToken){
  handled=true;D.hiveToken=true;checkpoint(1118,635);
  announce('КАПСУЛА УФ-ПИЛКУ ТВОЯ! ЗНОВУ МОЖНА ПЕРЕХОДИТИ В ІНШУ КІМНАТУ.',4.3);
 }else if(d2(S.x,S.y-35,1207,585)<90){
  handled=true;
  if(D.hiveToken)doorway(6,111,635);
  else announce('ДВЕРІ ЧЕКАЮТЬ НА ЗНЕШКОДЖЕННЯ ГНІЗДА ТА УФ-КАПСУЛУ.',4.5);
 }
}
inkUpdate(!handled);
const uvBrush=S.strokes.some(st=>st.state==='solid'&&S.carryStroke!==st
  &&st.len>=151&&Math.abs(Math.cos(st.angle))<.43
  &&d2(st.cx,st.cy,HIVE.x,HIVE.y-42)<135);
if(!D.hiveClean&&uvBrush){
 D.hiveClean=true;S.flies=0;S.shake=.9;S.fleaTimer=0;
 announce('СВІТЛОВИЙ ПАРКАН ПРОЧЕСАВ ВУЛИК! БЛОХИ ВТРАТИЛИ СИЛУ. ЗАБЕРИ УФ-КАПСУЛУ.',5.4);
}
const lightsNow=allLight(base);
if(R.ok){
 background();const w=R.world,b=R.back;lights(lightsNow);
 for(const p of floors)platform(w,p);
 // Time pressure meter represents actual movement penalty.
 box(w,386,164,490,17,0x2a2945,.95);
 box(w,390,168,482*minmax(S.flies/26,0,1),9,S.flies>18?0xff6e88:0xc9a5ec,.92);
 box(w,SHOWER.x-35,548,70,78,0x305b75,.97);
 for(let i=0;i<6;i++)line(w,SHOWER.x-28+i*11,557,SHOWER.x-28+i*11,608+5*Math.sin(S.elapsed*4+i),0x9ce3f5,.54,3);
 if(!D.hiveClean){
  halo(R.back,HIVE.x,HIVE.y,92,0xb080df,.19);
  box(w,HIVE.x-43,HIVE.y-35,86,76,0x5f466f,.95);
  for(let i=0;i<19;i++){
   const th=i*2.3999,rr=9+i*2.5;
   circle(w,HIVE.x+rr*Math.cos(th),HIVE.y+rr*Math.sin(th)*.58,3,0xdab4f0,.82);
  }
 }else{
  for(let i=0;i<6;i++)box(w,964+i*23,614+8*Math.sin(i),21,14,0x6c5a7d,.91);
  if(!D.hiveToken){halo(R.back,TOKEN.x,TOKEN.y,60,0xa9ffe9,.21);circle(w,TOKEN.x,TOKEN.y,20,0xb5ffe9);}
 }
 gate(1207,635,D.hiveToken);
 strokeArt();
}
playerArt(lightsNow);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='НАМАЛЮЙ ДОВГИЙ ШТРИХ, ПІДНІМИ E, ПОВЕРНИ Q В ПАРКАН І ПОСТАВ БІЛЯ ГНІЗДА ПРАВОРУЧ.';
if(S.flies>15&&!D.hiveClean)task='НА ТОБІ '+Math.floor(S.flies)+'/26 БЛІХ! ПОВЕРНИСЯ ДО ВОДЯНОГО ДУШУ ЛІВОРУЧ АБО ШВИДКО ЗНЕШКОДЬ ВУЛИК.';
if(D.hiveClean&&!D.hiveToken)task='ГНІЗДО ЗНЕШКОДЖЕНО СВІТЛОМ ШТРИХА. ЗАБЕРИ ЯСКРАВУ УФ-КАПСУЛУ ПРАВОРУЧ [E].';
if(D.hiveToken)task='УФ-КАПСУЛА ЗІБРАНА. ФІНАЛЬНА КІМНАТА ДОСТУПНА ПРАВОРУЧ.';
hud('05','БЛОШИНИЙ ВУЛИК',task,lightsNow);
txt('W01','ДУШ → E');
txt('W02','БЛОХИ '+Math.floor(S.flies)+'/26');
txt('W03','СВІТЛОВИЙ ПАРКАН');
txt('W04',D.hiveClean?'ВУЛИК ОЧИЩЕНО ✓':'УФ-БАР’ЄР ПОТРІБЕН');
txt('W05','ВИХІД → 06');
txt('WLamp','У СВІТЛІ ШТРИХА БЛОХИ ВІДПУСКАЮТЬ');
})();
