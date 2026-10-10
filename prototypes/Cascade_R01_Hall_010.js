// R01 / ЗАМКОВА ЗАЛА — starts gameplay and completes it after return with key.
const ROOM=1;
spawn({x:420,y:635});
if(S.first===false&&!S.initialized){
 S.initialized=true;
 message('БРАМА ЗАМКНЕНА. ПОДИВИСЬ НА МЕХАНІЗМИ Й ДОСЛІДИ ШАХТУ ЛІВОРУЧ.',5.0);
 setCheckpoint(1,420,635);
}
const floors=[{x:0,y:635,w:1280,h:85},{x:247,y:524,w:181,h:18},{x:712,y:503,w:170,h:18}];
const plinths=[{x:262,y:585},{x:458,y:585},{x:720,y:585},{x:944,y:585}];
const correct=[2,0,3,1]; // III -> I -> IV -> II
const spidersHall=[{x:573,y:627},{x:836,y:627},{x:1034,y:627,scale:1.20}];
let pools=[{x:106,y:590,r:155},{x:415,y:590,r:190}];
const finalEnabled=D.keyInserted&&D.lightMode==='C';
if(D.lightMode==='C')pools.push({x:988,y:587,r:159});
if(finalEnabled){
 const next=plinths[correct[Math.min(3,D.finalStep)]];
 const previous= D.finalStep>0?plinths[correct[D.finalStep-1]]:{x:1069,y:584};
 const midx=(next.x+previous.x)/2;
 pools=[
 {x:105,y:585,r:163},{x:next.x,y:585,r:173},
 {x:previous.x,y:585,r:132},{x:midx,y:585,r:164}
 ];
 if(D.finalCompleted){pools=[];for(let x=120;x<=1235;x+=137)pools.push({x,y:588,r:120});}
}
S.worldLight=pools;
if(!S.dead&&!S.transition&&!D.gameWon){
 movePlayer(floors,{deathY:770});
 if(E){
  if(dist(S.x,S.y-38,90,594)<91)goTo(2,'FROM_HALL',{x:164,y:2460});
  else if(dist(S.x,S.y-34,1090,590)<91){
   if(!D.keyCollected){message('ПОТРІБЕН КЛЮЧ. ВІН ЗАХОВАНИЙ В ІНШІЙ ЧАСТИНІ КОМПЛЕКСУ.',3.5);}
   else if(D.lightMode!=='C'){message('ЗАМОК НЕ ОТРИМУЄ СВІТЛА. ПЕРЕМКНИ ШАХТУ В РЕЖИМ C.',3.6);}
   else if(!D.keyInserted){
    D.keyInserted=true;S.fx=.66;
    message('КЛЮЧ ПІДІЙШОВ! ЧОТИРИ СИМВОЛИ ОЖИЛИ. ПРИГАДАЙ ШИФР.',5);
    setCheckpoint(1,1060,635);
   }
  }else{
   const n=plinths.findIndex(p=>dist(S.x,S.y-34,p.x,p.y)<78);
   if(n>=0){
    if(!D.keyInserted)message('П’ЄДЕСТАЛ НЕАКТИВНИЙ. ПОТРІБНО ВСТАВИТИ КЛЮЧ.',3);
    else if(D.finalCompleted)message('УСІ СИМВОЛИ СИНХРОНІЗОВАНО — ПРОХІД ВІДКРИТО.',3);
    else if(n===correct[D.finalStep]){
     D.finalStep++;S.fx=.6;
     message('СИМВОЛ '+D.finalStep+'/4'+' ПРАВИЛЬНИЙ. ОСВІТЛЕННЯ ПЕРЕБУДОВУЄТЬСЯ!',3);
     if(D.finalStep===4){D.finalCompleted=true;message('III → I → IV → II. БРАМА ВІДКРИЛАСЯ!',5);}
    }else{
     D.finalStep=0;S.wrongFx=.95;
     message('НЕПРАВИЛЬНИЙ ПОРЯДОК! СИГНАЛИ СКИНУТО — БЕРЕЖИСЯ ПАВУКІВ!',4);
    }
   }
  }
 }
 if(D.keyInserted&&!D.finalCompleted)spiders(spidersHall,pools,129);
 if(S.x>1225&&S.y>586){
  if(D.finalCompleted&&D.keyInserted&&D.lightMode==='C'){
   D.gameWon=true;S.fx=1;
   message('КАСКАД ТІНЕЙ ПРОЙДЕНО! СПАЛАХ ЗНАЙШОВ ВИХІД.',99);
  }else{S.x=1208;S.vx=0;message('БРАМА ЗАКРИТА. ПОТРІБЕН КЛЮЧ І ЧОТИРИ СИГНАЛИ.',2);}
 }
}
deathTick();
if(FG.ok){
 drawBase();
 const back=FG.back,w=FG.world;
 w.clear();
 for(const p of floors)platform(w,p);
 drawLights(pools);
 // Industrial archive vault with inaccessible end gate.
 rect(w,1068,547,47,88,D.keyInserted?0x28604c:0x4a3448,.98);
 for(let n=0;n<5;n++)rect(w,1076,557+n*14,30,5,D.keyInserted?0x83f4b3:0xd08696,.86);
 glow(w,1089,580,40,D.keyInserted?0x80faca:0xec667a,.14);
 rect(w,1198,530,60,106,D.finalCompleted?0x1e634e:0x422b3b,.96);
 w.lineStyle(3,D.finalCompleted?0x94ffd0:0xf27690,.92);w.drawRoundedRect(1198,530,60,106,7);
 for(let y=543;y<627;y+=16)rect(w,1209,y,38,5,D.finalCompleted?0x9ef9c8:0xd66b86,.82);
 // Four pedestals, each with their own Roman numeral and charge ring.
 for(let n=0;n<4;n++){
  const p=plinths[n],used=correct.slice(0,D.finalStep).includes(n);
  const active=finalEnabled&&!D.finalCompleted;
  const col=used?0x83fdb8:active?0xffca85:0x708498;
  glow(w,p.x,p.y,46,col,used?.12:.07);
  rect(w,p.x-30,p.y-20,60,41,0x243c4e,.98);
  w.lineStyle(4,col,.96);w.drawCircle(p.x,p.y-4,17);
  disk(w,p.x,p.y-4,8,used?0x8dfabd:0x73546a);
 }
 // Shaft entrance emits a recognizable constant teal beacon.
 rect(w,59,546,66,88,0x294b57,.95);
 w.lineStyle(3,0xa1e5e0,.83);w.drawRoundedRect(59,546,66,88,7);
 glow(w,93,586,53,0xa3edee,.17);
 for(let n=0;n<3;n++)disk(w,93,562+n*22,5,0x85e5df);
 // Spiders in the final room appear only after the key is inserted.
 if(D.keyInserted)for(let n=0;n<spidersHall.length;n++)drawSpider(w,spidersHall[n],n,pools);
 if(D.finalCompleted)glow(w,1224,580,70,0x96ffd5,.14);
}
drawActor(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ОГЛЯНЬ ЗАКРИТУ БРАМУ. ЛІВОРУЧ ДВЕРІ ДО ВЕЛИКОЇ ВЕРТИКАЛЬНОЇ ШАХТИ.';
if(D.keyCollected&&D.lightMode!=='C')task='ТИ ПОВЕРНУВСЯ З КЛЮЧЕМ. ЗНАЙДИ НИЖНІЙ РЕГУЛЯТОР У ШАХТІ ТА УВІМКНИ СВІТЛО C.';
else if(D.keyCollected&&!D.keyInserted)task='ВСТАВ КЛЮЧ E В ЗАМОК ПРАВОРУЧ. ТОДІ АКТИВУЙ СИМВОЛИ У ВІДОМОМУ ПОРЯДКУ.';
else if(D.keyInserted&&!D.finalCompleted)task='ФІНАЛЬНИЙ ШИФР: '+(D.clueDiscovered?'III → I → IV → II':'ПІДКАЗКА ЗАХОВАНА В АРХІВІ')+
 ' · УЖЕ '+D.finalStep+'/4';
else if(D.finalCompleted)task='ОСТАННЯ БРАМА ВІДЧИНЕНА. ІДИ ПРАВОРУЧ ДО ВИХОДУ!';
hudBase('01','ЗАМКОВА ЗАЛА',task,pools);
setText('W01','I');setText('W02','II');setText('W03','III');setText('W04','IV');
setText('W05',D.keyInserted?'КЛЮЧ У ЗАМКУ':'ПОТРІБЕН КЛЮЧ');
setText('WLamp',D.finalCompleted?'БРАМА ВІДКРИТА':'ПОВЕРНИСЯ З АРХІВУ');
})();
