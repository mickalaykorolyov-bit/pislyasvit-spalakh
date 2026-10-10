// 01 / ГАВАНЬ: one physical stroke bridges a genuine collision gap.
spawn({x:110,y:635});
if(!S.harborInit){S.harborInit=true;S.watcher={x:1087,y:592,baseY:592};announce('НАД ПРІРВОЮ НЕМАЄ МОСТА. СТВОРИ ДОВГИЙ ШТРИХ X ТА ПОКЛАДИ ЙОГО ПОПЕРЕК.',6);}
const floors=[{x:0,y:635,w:520,h:84},{x:739,y:635,w:541,h:84},{x:204,y:521,w:160,h:17}];
const gap={left:520,right:739},exit={x:1207,y:584};
const base=[{x:125,y:578,r:183},{x:354,y:576,r:123},
 {x:863,y:584,r:149},{x:1166,y:584,r:131}];
move(floors,{bottom:850});
const areas=allLight(base);
chaser(S.watcher,areas,{speed:38,name:'ПІДВОДНИЙ СТОРОЖ',notice:135,radius:37});
let action=false;
if(!S.dead&&E){
 if(d2(S.x,S.y-37,exit.x,exit.y)<96){
  action=true;
  if(D.bridgeLesson){doorway(2,155,635);}
  else announce('СПОЧАТКУ ПОБУДУЙ МІСТ: X — НАМАЛЮЙ, E — ВЗЯТИ, E — ПОКЛАСТИ.',4);
 }
}
inkUpdate(!action);
if(!D.bridgeLesson&&S.x>754&&S.y>585&&S.strokes.some(st=>
 st.state==='solid'&&Math.abs(Math.cos(st.angle))>.84&&
 st.len>185&&st.cx>540&&st.cx<706&&st.cy>614&&st.cy<671)){
 D.bridgeLesson=true;S.shake=.75;
 announce('ТВІЙ ШТРИХ СТАВ СПРАВЖНІМ МОСТОМ! АЛЕ НИМ МОЖУТЬ КОРИСТУВАТИСЯ Й ІНШІ ІСТОТИ.',5.5);
 checkpoint(784,635);
}
if(R.ok){
 background();const w=R.world,b=R.back;lights(allLight(base));
 for(const p of floors)platform(w,p);
 // Abyss really has no collider between x 520 and 739.
 box(b,520,638,219,82,0x030815,.96);
 for(let i=0;i<5;i++)line(w,527+i*49,640,547+i*49,708,0x5f7790,.21,2);
 for(let x of [520,739])line(w,x,620,x,716,0x93b7bc,.58,3);
 box(w,59,500,180,62,0x15314b,.78);
 gate(exit.x,635,D.bridgeLesson);
 enemyArt(S.watcher);strokeArt();
}
playerArt(allLight(base));
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='НАМАЛЮЙ X ДОВГИЙ ГОРИЗОНТАЛЬНИЙ ШТРИХ (220–320 PX). E — ПІДНЯТИ І ПЕРЕНЕСТИ ДО ПРОВАЛЛЯ.';
if(S.carryStroke)task='НЕСИ ШТРИХ ДО ПРАВОГО КРАЮ ЛІВОЇ ПЛАТФОРМИ. E — ЗАКРІПИТИ ЯК МІСТ.';
else if(S.strokes.length&&!D.bridgeLesson)task='ПОКЛАДИ ШТРИХ ПОПЕРЕК ПРОВАЛЛЯ. ВІН ТЕПЕР МАЄ СПРАВЖНЮ КОЛІЗІЮ.';
else if(D.bridgeLesson)task='МІСТ ПРАЦЮЄ. ПРАВОРУЧ Є ДВЕРІ ДО КІМНАТИ З ПЕРЕСЛІДУВАЧЕМ.';
hud('01','ГАВАНЬ ЖИВОГО ШТРИХА',task,allLight(base));
txt('W01','ШТРИХ = МІСТ');
txt('W02','X → МАЛЮВАТИ');
txt('W03','E → ПЕРЕНЕСТИ');
txt('W04',D.bridgeLesson?'МІСТ ✓':'ПРОВАЛЛЯ');
txt('W05','ДВЕРІ → 02');
txt('WLamp','У СВІТЛІ ВОРОГ ТЕБЕ НЕ БАЧИТЬ');
})();
