// R03 / АРХІВ ПАВУТИННЯ: push shelf, ballast breach, dark-only mural and key.
const ROOM=3;
spawn({x:102,y:635});
if(!S.initialized){
 S.initialized=true;S.clueTimer=0;
 message('УДАР БАЛАСТУ ЗМІНИВ АРХІВ. ПОСУНЬ СТЕЛАЖ, ЩОБ ДОСЯГТИ ВЕРХНІХ СХОВИЩ.',6);
 setCheckpoint(3,101,635);
}
const shelfY=534;
const slab={x:1000,y:282,w:52,h:352};
const ledges=[
 {x:0,y:635,w:1280,h:85},
 {x:692,y:430,w:181,h:18},
 {x:856,y:365,w:182,h:18},
 {x:1015,y:300,w:237,h:18}
];
const shelves=ledges.concat([{x:D.archiveShelfX-55,y:shelfY,w:110,h:20}]);
const shutter={x:1062,y:261},key={x:1160,y:260};
const mural={x:939,y:301};
const spiderPlaces=[{x:808,y:625},{x:954,y:356},{x:1172,y:295,scale:1.13}];
let pools=[{x:131,y:582,r:157},{x:D.archiveShelfX,y:571,r:128}];
if(D.lightMode==='B'){
 if(!D.archiveBlackout)pools.push(
 {x:792,y:392,r:157},{x:989,y:340,r:158},
 {x:1150,y:269,r:171},{x:1029,y:540,r:154});
 else pools.push(
 {x:1027,y:301,r:102},{x:1170,y:258,r:103},
 {x:885,y:381,r:107});
}
S.worldLight=pools;
if(!S.dead&&!S.transition&&!D.gameWon){
 movePlayer(shelves,{deathY:790,slow:(x,y)=>x>190&&x<308&&y>607});
 // The moveable shelf is the only way to scale the 205-pixel balcony.
 if((E||G)&&S.y>583&&Math.abs(S.x-D.archiveShelfX)<99){
  S.grabShelf=!S.grabShelf;
  if(S.grabShelf){
   S.shelfSide=S.x<D.archiveShelfX?-1:1;
   S.x=D.archiveShelfX+S.shelfSide*70;
   message('ТИ ШТОВХАЄШ СТЕЛАЖ. ПІДВЕДИ ЙОГО ПІД ВЕРХНІЙ МАЙДАНЧИК. E/G — ВІДПУСТИТИ.',4.5);
  }else message('СТЕЛАЖ ЗАЛИШИВСЯ НА МІСЦІ. ТЕПЕР МОЖНА ВИКОРИСТАТИ ЙОГО ЯК СХОДИНКУ.',4);
 }
 // The untouched ceiling is a genuine wall; ballast impact removes it.
 if(!D.archiveRoofBroken&&S.x+13>slab.x&&S.x-13<slab.x+slab.w&&S.y>slab.y&&S.y<slab.y+slab.h){
  if(S.vx>0){S.x=slab.x-13;S.vx=0;}
  else if(S.vx<0){S.x=slab.x+slab.w+13;S.vx=0;}
 }
 if(E){
  if(dist(S.x,S.y-38,85,588)<89)goTo(2,'FROM_ARCHIVE',{x:1100,y:2460});
  else if(dist(S.x,S.y-35,shutter.x,shutter.y)<91){
   D.archiveBlackout=!D.archiveBlackout;S.fx=.48;
   message(D.archiveBlackout?
     'АРХІВ ПОГАС! В ТЕМРЯВІ НА СТІНІ ПРОЯВИЛИСЯ ФОСФОРНІ СИМВОЛИ.':
     'АРХІВ ЗНОВУ ОСВІТЛЕНО. ЗНАЙДЕНИЙ ШИФР НЕ ЗНИКНЕ.',4.8);
  }else if(dist(S.x,S.y-39,key.x,key.y)<75){
   if(D.keyCollected)message('КЛЮЧ УЖЕ В ТЕБЕ. ПОВЕРНИСЯ ДО ЗАМКОВОЇ ЗАЛИ.',3.5);
   else if(!D.archiveBlackout)message('У ЦІЙ НІШІ НЕ ВИДНО НІЧОГО. МОЖЛИВО, ЯСКРАВЕ СВІТЛО ЗАВАЖАЄ.',4);
   else if(!D.clueDiscovered)message('СПОЧАТКУ ЗНАЙДИ ПОСЛІДОВНІСТЬ НА ФОСФОРНІЙ СТІНІ.',3.8);
   else{
    D.keyCollected=true;S.fx=.9;
    message('ТИ ЗНАЙШОВ КЛЮЧ! ТЕПЕР НЕСИ ЙОГО НАЗАД ЧЕРЕЗ ШАХТУ ДО КІМНАТИ 01.',6);
    setCheckpoint(3,1110,300);
   }
  }
 }
 if(D.archiveBlackout&&!D.clueDiscovered&&dist(S.x,S.y-37,mural.x,mural.y)<184){
  S.clueTimer+=DT;
  if(S.clueTimer>.63){
   D.clueDiscovered=true;S.fx=.5;
   message('ПІДКАЗКА ЗАПАМ’ЯТОВАНА: III → I → IV → II. ВОНА ТЕПЕР Є В ЖУРНАЛІ TAB.',6);
   setCheckpoint(3,930,365);
  }
 }
 spiders(spiderPlaces,pools,119);
}
deathTick();
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
if(FG.ok){
 drawBase();
 const w=FG.world,b=FG.back;
 for(const p of ledges)platform(w,p);
 drawLights(pools);
 // Shelves cast long silhouettes and get relocated by player forces.
 rect(w,D.archiveShelfX-55,shelfY,110,100,0x425a60,.97);
 rect(w,D.archiveShelfX-51,shelfY,102,5,0xb0b8b2,.79);
 for(let y=shelfY+19;y<shelfY+96;y+=20){
  ln(w,D.archiveShelfX-46,y,D.archiveShelfX+46,y,0x9ca4a7,.56,3);
  for(let x=-33;x<40;x+=21)rect(w,D.archiveShelfX+x,y-15,10,13,0x9c8e89,.50);
 }
 for(let dx of [-41,41])disk(w,D.archiveShelfX+dx,630,8,0x1e303c);
 // The ballast roof is a structural condition, not just a status label.
 if(!D.archiveRoofBroken){
  rect(w,slab.x,slab.y,slab.w,slab.h,0x465368,.98);
  for(let y=300;y<626;y+=24)ln(w,slab.x+5,y,slab.x+43,y+14,0xbeb5ac,.28,2);
 }else{
  for(const [x,y] of [[970,617],[1025,620],[1055,609],[1110,623],[987,602]]){
   rect(w,x,y,29,11,0x6d7780,.90);
  }
  ln(w,998,300,1046,342,0xc1a6a0,.42,3);
  ln(w,1035,342,1061,387,0xae888a,.41,2);
  glow(b,1021,476,91,0xb1aaa2,.08);
 }
 // Light shutter lever.
 rect(w,shutter.x-27,shutter.y-24,54,42,0x2c4054,.97);
 const color=D.archiveBlackout?0xf2b38d:0x97fae6;
 ln(w,shutter.x,shutter.y-5,shutter.x+(D.archiveBlackout?15:-13),shutter.y-26,color,.96,5);
 glow(w,shutter.x,shutter.y,34,color,.11);
 // Phosphor wall only readable with bright archive lamps OFF.
 rect(b,845,145,303,110,D.archiveBlackout?0x232d50:0x172638,D.archiveBlackout?.89:.36);
 b.lineStyle(2,D.archiveBlackout?0xb39cff:0x58768b,D.archiveBlackout?.90:.33);
 b.drawRoundedRect(845,145,303,110,11);
 if(D.archiveBlackout){
  glow(b,998,193,112,0xa47ee1,.16);
  for(let n=0;n<4;n++)disk(w,886+n*74,191,22,0x615684,.78);
 }
 // Key is visible only with archive blackout.
 if(D.archiveBlackout&&!D.keyCollected){
  glow(w,key.x,key.y-38,44,0xfac88e,.20);
  w.lineStyle(4,0xffdd91,.97);w.drawCircle(key.x-11,key.y-41,12);
  ln(w,key.x+1,key.y-41,key.x+27,key.y-41,0xffe5a6,.97,4);
  ln(w,key.x+15,key.y-41,key.x+15,key.y-31,0xffe5a6,.97,3);
 }
 rect(w,49,548,83,87,0x244b52,.94);
 w.lineStyle(3,0x8ef7d5,.9);w.drawRoundedRect(49,548,83,87,9);
 for(let t=0;t<3;t++)disk(w,91,560+t*23,5,0x93f8df);
 if(D.keyCollected)glow(w,1110,269,66,0x9affd3,.08);
 for(let n=0;n<spiderPlaces.length;n++)drawSpider(w,spiderPlaces[n],n,pools);
}
drawActor(pools);
let objective='АРХІВ ПРОБИТО БАЛАСТОМ. ПЕРЕСУНЬ СТЕЛАЖ E/G, ЩОБ ВИЛІЗТИ НА ВЕРХНІ ПЛАТФОРМИ.';
if(S.grabShelf)objective='ШТОВХАЙ СТЕЛАЖ ПРАВОРУЧ ДО ВИСОКОЇ ПЛАТФОРМИ. E/G — ВІДПУСТИТИ.';
else if(D.archiveShelfX>632&&S.y>526&&!D.archiveBlackout)
 objective='СТЕЛАЖ НА МІСЦІ. ЗАСТРИБНИ НА НЬОГО, ПОТІМ НА ПЛАТФОРМИ ВГОРІ ПРАВОРУЧ.';
else if(S.y<430&&!D.archiveBlackout)
 objective='ЗНАЙДИ ВЕРХНІЙ ПЕРЕМИКАЧ ПРАВОРУЧ. У ТЕМРЯВІ НА СТІНІ ПРОЯВЛЯЄТЬСЯ ШИФР.';
else if(D.archiveBlackout&&!D.clueDiscovered)
 objective='ПРОЧИТАЙ ФОСФОРНІ МІТКИ НА ВЕРХНІЙ СТІНІ. ВОНА ЗАПАМ’ЯТАЄ ПОСЛІДОВНІСТЬ.';
else if(D.clueDiscovered&&!D.keyCollected)
 objective='ШИФР У ЖУРНАЛІ. ЗНАЙДИ ЗОЛОТИЙ КЛЮЧ У ВЕРХНІЙ ПРАВІЙ НІШІ Й ВІЗЬМИ ЙОГО E.';
else if(D.keyCollected)
 objective='КЛЮЧ У СПАЛАХА! ПОВЕРНИСЯ ЧЕРЕЗ ЛІВІ ДВЕРІ, А В ШАХТІ УВІМКНИ РЕЖИМ C.';
hudBase('03','АРХІВ ПАВУТИННЯ',objective,pools);
setText('W01','ПЕРЕСУНУТИ E/G');
setText('W02','СТІНА '+(D.archiveRoofBroken?'ПРОБИТА':'ЦІЛА'));
setText('W03',D.archiveBlackout?'III → I → IV → II':'ЗАШИФРОВАНА ФРЕСКА');
setText('W04',D.keyCollected?'КЛЮЧ ОТРИМАНО':D.archiveBlackout?'КЛЮЧ У ТЕМРЯВІ':'?');
setText('W05','ЗАСЛІНКА E');
setText('WLamp',D.keyCollected?'НЕСИ КЛЮЧ У ЗАЛУ 01':'ШИФР ТІЛЬКИ В ТЕМРЯВІ');
})();
