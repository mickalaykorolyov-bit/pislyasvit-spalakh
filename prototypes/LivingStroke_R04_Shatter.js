// 04 / ЗАЛ УЛАМКІВ: solid stroke is destroyed, its pieces are real throwable weapons.
// Hit a chain with a glowing shard, drop heavy glass and remove the monster.
spawn({x:112,y:635});checkpoint(114,635);
if(!S.fractureInit){
 S.fractureInit=true;S.guard={x:1090,y:591,baseY:591};
 S.glassState='hanging';S.glassY=183;S.glassClock=0;
 announce('ТУТ ШТРИХ ПОТРІБНО НЕ ПЕРЕНОСИТИ, А РОЗБИТИ КЛАВІШЕЮ G. УЛАМКИ МОЖНА КИДАТИ F.',6);
}
const floors=[{x:0,y:635,w:1280,h:85},{x:209,y:517,w:180,h:18},{x:656,y:510,w:192,h:18}];
const base=[{x:131,y:582,r:185},{x:464,y:586,r:139},{x:831,y:570,r:125},{x:1188,y:583,r:150}];
const CHAIN={x:1009,y:563},CAGE={x:1110,y:597};
if(S.glassState==='warning'){S.glassClock-=dt;if(S.glassClock<=0)S.glassState='falling';}
if(S.glassState==='falling'){
 S.glassY=Math.min(597,S.glassY+990*dt);
 if(Math.abs(S.x-CAGE.x)<74&&Math.abs(S.y-S.glassY)<85)hurt('СКЛЯНА БРИЛА');
 if(S.glassY>=597){
  S.glassState='landed';D.anvilDropped=true;S.shake=.9;
  announce('БРИЛА РОЗБИЛА СТОРОЖА. ТЕПЕР КОРИДОР ДО НАСТУПНОЇ КІМНАТИ ВІДКРИТО.',5);
 }
}
move(floors,{bottom:820});
let handled=false;
if(E&&!S.dead&&d2(S.x,S.y-38,1205,585)<96){
 handled=true;
 if(D.shatterLesson&&D.anvilDropped)doorway(5,111,635);
 else announce('ДВЕРІ ЧЕКАЮТЬ НА ПОПАДАННЯ У ЛАНЦЮГ СВІТЛОВИМ УЛАМКОМ.',4);
}
inkUpdate(!handled);
if(!D.shatterLesson&&hitShot(CHAIN.x,CHAIN.y,70)){
 D.shatterLesson=true;S.glassState='warning';S.glassClock=.82;
 announce('УЛАМОК ПЕРЕРІЗАВ ЛАНЦЮГ! ЗАРАЗ ВПАДЕ ВАЖКА СКЛЯНА БРИЛА — НЕ СТІЙ ПІД НЕЮ!',5);
}
const pools=allLight(base);
if(!D.anvilDropped)chaser(S.guard,pools,{speed:37,name:'СКЛЯНИЙ ВАРТОВИЙ',notice:171,radius:43});
if(R.ok){
 background();const w=R.world,b=R.back;lights(pools);
 for(const p of floors)platform(w,p);
 // Chain acts as a shot-only target: player cannot activate it with E.
 line(w,CHAIN.x,201,CHAIN.x,548,0x9cbdca,.48,3);
 halo(b,CHAIN.x,CHAIN.y,55,D.shatterLesson?0x8cfed9:0xffa5bd,.14);
 w.lineStyle(4,D.shatterLesson?0xa1ffe8:0xfaacb0,.95);w.drawCircle(CHAIN.x,CHAIN.y,23);
 circle(w,CHAIN.x,CHAIN.y,9,D.shatterLesson?0x9affeb:0xa96780);
 if(S.glassState==='warning'){
  halo(b,CAGE.x,599,110,0xff6884,.28);
  for(let y=188;y<603;y+=55)box(w,CAGE.x-21,y,42,11,0xf46b85,.43);
 }
 const y=S.glassState==='hanging'||S.glassState==='warning'?183:S.glassY;
 box(w,CAGE.x-73,y-31,147,63,0x68889c,.93);
 for(let x=-58;x<=58;x+=29)line(w,CAGE.x+x,y-23,CAGE.x+x+17,y+25,0xb6d4dd,.54,3);
 if(!D.anvilDropped)enemyArt(S.guard);
 else for(let i=0;i<6;i++)box(w,1034+i*24,612+(i%2)*8,22,15,0x687587,.90);
 gate(1205,635,D.anvilDropped&&D.shatterLesson);
 strokeArt();
}
playerArt(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЗАТИСНИ X І СТВОРИ ДОВГИЙ ШТРИХ. ПОТІМ G БІЛЯ НЬОГО — РОЗБИТИ НА СВІТЛОВІ УЛАМКИ.';
if(S.pieces.length&&!D.shatterLesson)task='E БІЛЯ УЛАМКА — ПІДНЯТИ. ПІДІЙДИ БЛИЖЧЕ ДО ЛАНЦЮГА ПРАВОРУЧ, КИНЬ F.';
if(D.shatterLesson&&!D.anvilDropped)task='ЛАНЦЮГ ЗРУЙНОВАНО! СКЛЯНА БРИЛА ПАДАЄ — ВІДІЙДИ!';
if(D.anvilDropped)task='СКЛЯНА БРИЛА ЗНЕШКОДИЛА ВОРОГА. ПРОХІД У КІМНАТУ 05 ПРАВОРУЧ.';
hud('04','ЗАЛ СКЛЯНИХ УЛАМКІВ',task,pools);
txt('W01','X → ШТРИХ');
txt('W02','G → РОЗБИТИ');txt('W03','E / F → КИНУТИ');
txt('W04',D.anvilDropped?'БРИЛА ВПАЛА ✓':'ЛАНЦЮГ ДЛЯ СТРІЛЬБИ');
txt('W05','ДВЕРІ → 05');txt('WLamp','СВІТЛО ШТРИХА ХОВАЄ СПАЛАХА');
})();
