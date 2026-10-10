// R04 — НЕГАТИВНА ГАЛЕРЕЯ: the secret exists only during blackout;
// pursuing moth-fly deals three cumulative hit points.
const ROOM=4;
spawn({x:112,y:635});checkpoint(108,635);
const P=[{x:0,y:635,w:1280,h:85},{x:243,y:526,w:177,h:18},{x:860,y:523,w:184,h:18}];
const SWITCH={x:249,y:580},MURAL={x:927,y:358},STENCIL={x:579,y:585,cx:591,cy:372};
const FLY_START={x:1138,y:590};
if(!S.galleryInit){
 S.galleryInit=true;S.fly={x:FLY_START.x,y:FLY_START.y,phase:0};
 say('НА СТІНІ НІЧОГО НЕ ВИДНО, ДОКИ НЕ ПОГАСИШ СВІТЛО. АЛЕ В ТЕМРЯВІ МУХА ТЕБЕ ЗНАЙДЕ.',6);
}
let pools=D.galleryBlackout?[{x:123,y:583,r:170},{x:592,y:388,r:265}]:
 [{x:130,y:586,r:173},{x:432,y:578,r:182},{x:819,y:562,r:193},{x:1124,y:585,r:174}];
if(S.trace)pools.push({x:STENCIL.cx,y:STENCIL.cy,r:328});
if(!S.dead&&!D.won){
 walk(P,{bottom:796});
 if(D.galleryBlackout&&!D.galleryRead&&distance(S.x,S.y-44,MURAL.x,MURAL.y)<263){
  D.galleryRead=true;S.shake=.38;say('ПРИ ТЕМРЯВІ ПРОЯВИВСЯ ЗНАК ТРИКУТНИКА. ЗАПИСАНО ПОСЛІДОВНІСТЬ ВЕРШИН.',5);
 }
 if(E&&!S.trace){
  if(distance(S.x,S.y-33,SWITCH.x,SWITCH.y)<85){
   D.galleryBlackout=!D.galleryBlackout;
   say(D.galleryBlackout?'ШТОРИ ЗАКРИТІ. МУХА МОЖЕ ПОБАЧИТИ СПАЛАХА. ШУКАЙ ФОСФОРНИЙ МАЛЮНОК.':
    'ГАЛЕРЕЯ ОСВІТЛЕНА. СПАЛАХ ЗНОВУ В БЕЗПЕЦІ В СВІТЛИХ ЗОНАХ.',4.7);
  }else if(distance(S.x,S.y-35,STENCIL.x,STENCIL.y)<95){
   if(D.galleryRead)startGlyph('triangle',STENCIL.cx,STENCIL.cy);
   else say('ЦЕЙ ПУЛЬТ ЧЕКАЄ НА ФОСФОРНИЙ РИСУНОК, ЯКИЙ ВИДНО ЛИШЕ В ТЕМРЯВІ.',4);
  }else if(distance(S.x,S.y-37,1208,580)<91){
   if(D.glyph.triangle&&D.galleryRead)visit(5,{x:108,y:635});
   else say('ЗАМОК ВИМАГАЄ ТРИКУТНИК, НАМАЛЬОВАНИЙ СПАЛАХОМ, І ПРОЧИТАНУ ФРЕСКУ.',4);
  }else if(distance(S.x,S.y-37,72,580)<90)visit(3,{x:1120,y:635});
 }
 updateFly(pools);
}
shards(4,pools);
if(A.ok){
 worldBase();const w=A.world,b=A.back;lights(pools);
 for(const p of P)ground(w,p);
 if(D.galleryBlackout)drawBox(b,0,110,1280,505,0x030512,.50);
 glyphArt('triangle',STENCIL.cx,STENCIL.cy,D.glyph.triangle);
 drawBox(w,SWITCH.x-34,552,68,68,D.galleryBlackout?0x75475d:0x31556b,.94);
 circle(w,SWITCH.x,582,18,D.galleryBlackout?0xff9dac:0x97fae5);
 halo(b,SWITCH.x,583,58,D.galleryBlackout?0xf17d9a:0xaaf6e1,.14);
 drawBox(b,784,196,305,167,D.galleryBlackout?0x2c3458:0x163143,D.galleryBlackout?.92:.48);
 b.lineStyle(3,D.galleryBlackout?0xba9bf9:0x6a8597,D.galleryBlackout?.94:.25);
 b.drawRoundedRect(784,196,305,167,12);
 if(D.galleryBlackout){
  halo(b,930,282,137,0xb38aff,.15);
  for(const [xx,yy] of [[928,213],[1032,331],[819,331]]){
   circle(w,xx,yy,12,0xcbaaff,.92);
   halo(w,xx,yy,26,0xbda0ff,.15);
  }
  line(w,928,213,1032,331,0xdab9ff,.70,3);
  line(w,1032,331,819,331,0xdab9ff,.70,3);
  line(w,819,331,928,213,0xdab9ff,.70,3);
 }
 drawBox(w,STENCIL.x-32,591,64,32,0x514a73,.95);
 circle(w,STENCIL.x,605,12,D.glyph.triangle?0xa4ffe1:0xb6a0ea);
 door(71,635,70,true,0xa9edee);
 door(1208,635,79,D.glyph.triangle&&D.galleryRead,0xa8ffd5);
}
drawEnemies(4);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ВИМКНИ СВІТЛО ШТОРАМИ E ЛІВОРУЧ. ПРОЧИТАЙ ФОСФОРНИЙ ТРИКУТНИК. У ТЕМРЯВІ МУХА ПОЛЮЄ.';
if(D.galleryBlackout&&!D.galleryRead)task='ТЕМРЯВА ВІДКРИЛА ПІДКАЗКУ НА ПРАВІЙ СТІНІ. ПІДІЙДИ ДО НЕЇ. ОСТЕРІГАЙСЯ МУХИ.';
else if(D.galleryRead&&!D.glyph.triangle)task='ПІДКАЗКА ЗНАЙДЕНА. БІЛЯ СЕРЕДНЬОГО ПУЛЬТА E → ТРИМАЙ X ТА ОБВЕДИ ТРИКУТНИК WASD.';
else if(D.glyph.triangle)task='ТРИКУТНИК ЗБЕРЕЖЕНО. ПРОХІД У КІМНАТУ 05 ПРАВОРУЧ [E].';
hud('04','НЕГАТИВНА ГАЛЕРЕЯ',task,pools);
label('W01',D.galleryBlackout?'СВІТЛО ВИМКНУТО':'ЗАКРИТИ ШТОРИ E');
label('W02','ТРИКУТНИК: '+(D.glyph.triangle?'✓':'○'));
label('W03',D.galleryRead?'НАПИС ПРОЧИТАНО':'МАЛЮНОК У ТЕМРЯВІ');
label('W04','МУХА: '+S.health+'/3');
label('W05','ДВЕРІ → 05');
label('WLamp','У СВІТЛІ МУХА ТЕБЕ НЕ БАЧИТЬ');
})();
