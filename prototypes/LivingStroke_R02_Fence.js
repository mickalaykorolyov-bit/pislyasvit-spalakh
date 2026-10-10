// 02 / ТИХИЙ ПАРКАН: carry same drawn stroke, rotate it upright and fence the pursuer.
spawn({x:215,y:635});
if(!S.fenceInit){S.fenceInit=true;S.hunter={x:105,y:586,baseY:586};S.consoleA=false;S.consoleB=false;
 announce('СТОРОЖ ПОЛЮЄ В ТЕМРЯВІ. ВІН НЕ ПОБАЧИТЬ ТЕБЕ У СВІТЛІ. ПАРКАН ІЗ ШТРИХА ЗАТРИМАЄ ЙОГО.',6);}
const floors=[{x:0,y:635,w:1280,h:85},{x:350,y:519,w:180,h:19},{x:755,y:517,w:172,h:19}];
const light=[{x:196,y:580,r:170},{x:714,y:567,r:133},{x:1110,y:582,r:132}];
const placed=S.strokes.some(st=>st.state==='solid'&&S.carryStroke!==st&&st.len>=150
  &&Math.abs(Math.cos(st.angle))<.4&&st.cx>445&&st.cx<800);
move(floors,{bottom:810});
chaser(S.hunter,allLight(light),{speed:79,notice:234,name:'СТОРОЖ',radius:39});
let used=false;
if(E&&!S.dead){
 if(d2(S.x,S.y-37,878,589)<84){used=true;S.consoleA=true;announce('ПЕРШИЙ ВАЖІЛЬ УТРИМУЄТЬСЯ. ДРУГИЙ ДАЛІ ПРАВОРУЧ.',3);}
 else if(d2(S.x,S.y-37,1070,589)<85){used=true;S.consoleB=true;announce('ОБИДВА ВАЖЕЛІ АКТИВНІ. ЧИ Є ВЕРТИКАЛЬНИЙ ПАРКАН?',3);}
 else if(d2(S.x,S.y-36,1212,588)<91){
  used=true;
  if(D.fenceLesson)doorway(3,138,2490);
  else announce('ДВЕРІ ЧЕКАЮТЬ НА ДВА ВАЖЕЛІ І ВЕРТИКАЛЬНИЙ СВІТЛОВИЙ БАР’ЄР.',4);
 }
}
inkUpdate(!used);
if(!D.fenceLesson&&S.consoleA&&S.consoleB&&placed){
 D.fenceLesson=true;S.shake=.9;
 announce('ШТРИХ СТАВ ПАРКАНОМ. ВОРОГ НЕ МОЖЕ ПРОЙТИ КРІЗЬ НЬОГО, А СПАЛАХ МОЖЕ.',5);
 checkpoint(1005,635);
}
if(R.ok){
 background();const w=R.world,b=R.back;lights(allLight(light));
 for(const p of floors)platform(w,p);
 for(let i=0;i<4;i++)line(b,65+i*304,112,65+i*304,532,0x53718b,.20,5);
 for(const p of [{x:878,on:S.consoleA},{x:1070,on:S.consoleB}]){
  box(w,p.x-29,568,58,51,0x314e64,.96);
  circle(w,p.x,588,15,p.on?0xa5ffda:0xe3ae8f);
 }
 if(placed){halo(b,584,557,164,0x9efae2,.09);}
 gate(1212,635,D.fenceLesson);enemyArt(S.hunter);strokeArt();
}
playerArt(allLight(light));
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='НАМАЛЮЙ ДОВГИЙ ШТРИХ X, ПІДНІМИ E, ПОВЕРНИ Q ВЕРТИКАЛЬНО ТА ПОСТАВ ПАРКАН E.';
if(placed&&!D.fenceLesson)task='ПАРКАН ГОТОВИЙ. ЗНАЙДИ ДВА ВАЖЕЛІ ПРАВОРУЧ, НАТИСНИ E БІЛЯ КОЖНОГО.';
else if(D.fenceLesson)task='ПЕРЕСЛІДУВАЧ ЗАСТРЯГ ПЕРЕД ПАРКАНОМ. ПРОХІД ПРАВОРУЧ ВІДКРИТО.';
hud('02','ТИХИЙ ПАРКАН',task,allLight(light));
txt('W01','СТОРОЖ: 3 УДАРИ');txt('W02','E → ВАЖІЛЬ 1');
txt('W03','E → ВАЖІЛЬ 2');txt('W04','Q ПОВЕРНУТИ ШТРИХ');
txt('W05','ДВЕРІ → 03');txt('WLamp','СВІТЛОВИЙ ШТРИХ = БЕЗПЕЧНА ЗОНА');
})();
