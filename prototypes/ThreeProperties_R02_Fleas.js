// 02 / ЗАРАЗНЕ СВІТЛО — fleas migrate onto a MATERIALIZED line, then infect the slug.
spawn({x:118,y:635});checkpoint(112,635);
if(!S.greenhouseInit){
 S.greenhouseInit=true;S.flies=0;S.fleaTimer=0;S.slug={x:1005,y:591,baseY:591};
 S.slugDebuff=0;S.fleaBaitTime=0;S.cured=false;
 announce('БЛОХИ ЛЮБЛЯТЬ СВІТЛО. ЗАЛИШ ТВЕРДИЙ ШТРИХ ПОРУЧ ІЗ ГНІЗДОМ І ПОЧЕКАЙ.',7);
}
const P=[{x:0,y:635,w:1280,h:84},{x:305,y:518,w:183,h:18},{x:733,y:509,w:173,h:19}];
const SHOWER={x:158,y:586},NEST={x:507,y:583},SENSOR={x:888,y:577},
ROOTS={x:1137,y:571},WATER={x:1066,y:583},EXIT={x:1221,y:580};
const lamps=[{x:140,y:578,r:177},{x:353,y:571,r:135},{x:783,y:569,r:143},{x:1178,y:577,r:137}];
if(!S.dead&&S.x>310&&!D.slugInfected){
 S.fleaTimer+=dt*(K.x?1.7:1)*(lit(S.x,S.y-43,allLight(lamps))?.57:1);
 if(S.fleaTimer>.67){S.fleaTimer=0;S.flies+=1;if(S.flies===10)announce('БЛОХИ УЖЕ СПОВІЛЬНЮЮТЬ СПАЛАХА! ДУШ — ЗОВСІМ ЛІВОРУЧ.',4);}
}
if(S.flies>=25)hurt('БЛОХИ ЗАГАСИЛИ СПАЛАХА');
for(const st of S.strokes){
 if(st.state!=='solid')continue;
 if(st.infested===undefined)st.infested=0;
 if(!D.slugInfected&&d2(st.cx,st.cy,NEST.x,NEST.y)<197){
  st.infested=Math.min(22,st.infested+dt*3.2);
  if(st.infested>12&&!S.infectionGreet){
   S.infectionGreet=true;announce('ШТРИХ ЗІБРАВ БЛІХ. ЗАРАЗ ВІН СТАВ ПЕРЕНОСНОЮ ПРИМАНКОЮ!',5);
  }
 }
 if(!S.dead&&S.flies>0&&d2(S.x,S.y-42,st.cx,st.cy-21)<106){
  S.flies=Math.max(0,S.flies-dt*3.9);
 }
 if(!D.slugInfected&&st.infested>=12&&d2(st.cx,st.cy-18,S.slug.x,S.slug.y)<153){
  D.slugInfected=true;S.flies=0;S.shake=.92;S.slugDebuff=1;
  announce('БЛОХИ ПЕРЕЙШЛИ НА СЛИМАКА! ВІН ТЕПЕР МАЙЖЕ НЕ МОЖЕ РУХАТИСЯ.',6);
 }
}
move(P,{bottom:834,slow:(x,y)=>x>680&&x<805&&y>598});
const pools=allLight(lamps);
if(!D.slugInfected){
 chaser(S.slug,pools,{speed:65,notice:215,name:'ПАВУКОВИЙ СЛИМАК',radius:49});
 S.slug.x=minmax(S.slug.x,913,1076); // The creature guards its den, not the exit door.
}
else{
 // An infested slug is visibly crawling and physically blocks only a small stretch.
 S.slug.x+=Math.sin(S.elapsed*.9)*dt*9;
 S.slug.y=591+Math.sin(S.elapsed)*4;
}
if(!D.slugSensor&&K.x&&d2(S.x,S.y-42,SENSOR.x,SENSOR.y)<88){
 D.slugSensor=true;S.shake=.35;announce('НИЖНІЙ СЕНСОР ЗАРЯДЖЕНИЙ. АЛЕ НЕ ПАЛИ СУХІ КОРЕНІ В ПРАВОМУ КОРИДОРІ!',5);
}
if(K.x&&d2(S.x,S.y-43,ROOTS.x,ROOTS.y)<90&&D.rootsBurn<=0){
 D.rootsBurn=9;S.shake=.69;
 announce('ШЛЕЙФ ПІДПАЛИВ СУХІ КОРЕНІ! ВОДЯНИЙ КЛАПАН ПОРУЧ МОЖЕ ЗАГАСИТИ ПОЖЕЖУ.',5.2);
}
if(D.rootsBurn>0&&S.x>1114&&S.x<1184&&!S.dead)hurt('ПАЛАЮЧІ КОРЕНІ');
let action=false;
if(E&&!S.dead){
 if(d2(S.x,S.y-38,SHOWER.x,SHOWER.y)<84){
  S.flies=0;S.fleaTimer=0;action=true;S.shake=.3;
  announce('ДУШ ЗМИВ БЛІХ. ТЕПЕР МАЛЮЙ ПРИМАНКУ БЛИЖЧЕ ДО ГНІЗДА.',4);
 }else if(d2(S.x,S.y-35,WATER.x,WATER.y)<83){
  action=true;D.rootsBurn=0;S.shake=.25;
  announce('ЗРОШЕННЯ ПОГАСИЛО КОРЕНІ. ПРОХІД ОЧИЩЕНО.',4);
 }else if(d2(S.x,S.y-35,EXIT.x,EXIT.y)<90){
  action=true;
  if(D.slugInfected&&D.slugSensor&&D.rootsBurn<=0)doorway(3,113,635);
  else announce('БРАМА ЧЕКАЄ НА ЗАРАЖЕНОГО СЛИМАКА, ЗАРЯДЖЕНИЙ СЕНСОР І НЕПАЛАЮЧІ КОРЕНІ.',5);
 }
}
inkUpdate(!action);
if(R.ok){
 background();const w=R.world,b=R.back;
 lights(pools);for(const p of P)platform(w,p);
 for(let i=0;i<6;i++){
  const x=250+i*168;
  line(b,x,124,x-44,487,0x63868c,.23,5);
  for(let k=0;k<6;k++)circle(b,x+Math.sin(k*1.9)*18,174+k*48,9,0x557b79,.22);
 }
 // Slow drifting infestation field.
 halo(b,NEST.x,NEST.y,103,0xad74d0,.15);
 box(w,NEST.x-52,NEST.y-31,104,60,0x604964,.91);
 for(let i=0;i<22;i++){
  const a=i*2.39996+S.elapsed*.26,rr=10+i*2.2;
  circle(w,NEST.x+Math.cos(a)*rr,NEST.y+Math.sin(a)*rr*.65,2.8,0xdcb8f1,.85);
 }
 box(w,SHOWER.x-37,544,75,79,0x38637a,.96);
 for(let i=0;i<6;i++)line(w,SHOWER.x-25+i*10,548,SHOWER.x-25+i*10,605+Math.sin(S.elapsed*4+i)*8,0xaaf0f5,.52,3);
 for(const st of S.strokes)if(st.state==='solid'&&st.infested>0){
  for(let i=0;i<Math.floor(st.infested);i++){
   const xx=(i+1)/(st.infested+1)-.5;
   const sx=st.cx+Math.cos(st.angle)*st.len*xx,sy=st.cy+Math.sin(st.angle)*st.len*xx;
   circle(w,sx,sy-5,3,0xe2b0fa,.85);
  }
 }
 if(!D.slugInfected)enemyArt(S.slug);
 else{
  halo(b,S.slug.x,S.slug.y,97,0xc797e2,.16);
  circle(w,S.slug.x,S.slug.y-24,41,0x6c5276,.88);
  for(let i=0;i<8;i++)circle(w,S.slug.x+31*Math.cos(i*2.4),S.slug.y-24+23*Math.sin(i*2.4),4,0xeab6ef,.8);
 }
 w.lineStyle(4,D.slugSensor?0x9dffe5:0xf1abbb,.91);w.drawCircle(SENSOR.x,SENSOR.y,27);
 circle(w,SENSOR.x,SENSOR.y,10,D.slugSensor?0x97ffe0:0x916177);
 box(w,WATER.x-23,558,49,56,0x416881,.96);circle(w,WATER.x,WATER.y,13,0xb2f2f0);
 for(let k=0;k<7;k++){
  const x=ROOTS.x-41+k*14;
  line(w,x,615,x+17,566-10*Math.sin(k),D.rootsBurn>0?0xff8b83:0xa18d7b,.85,4);
  if(D.rootsBurn>0)halo(b,x,567,22,0xff6b7e,.15);
 }
 gate(EXIT.x,635,D.slugInfected&&D.slugSensor&&D.rootsBurn<=0);
 strokeArt();
}
playerArt(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЗАЛИШ МАТЕРІАЛІЗОВАНИЙ ШТРИХ БІЛЯ ФІОЛЕТОВОГО ГНІЗДА, ЩОБ НА НЬОГО ПЕРЕПОВЗЛИ БЛОХИ.';
if(S.strokes.some(st=>st.infested>=12)&&!D.slugInfected)task='ШТРИХ ЗАРАЖЕНИЙ! E ПІДНЯТИ, ВІДНЕСИ ДО ВЕЛИКОГО СЛИМАКА ПРАВОРУЧ І ПОСТАВ E.';
if(D.slugInfected&&!D.slugSensor)task='СЛИМАК СПОВІЛЬНИВСЯ. ТЕПЕР ЗАРЯДИ КРУГЛИЙ СЕНСОР ШЛЕЙФОМ X ПЕРЕД СУХИМИ КОРЕНЯМИ.';
if(D.slugSensor&&D.rootsBurn>0)task='КОРЕНІ ГОРЯТЬ! НАТИСНИ E БІЛЯ СИНЬОГО КЛАПАНА ПРАВОРУЧ.';
if(D.slugSensor&&D.slugInfected&&!D.rootsBurn)task='УМОВИ ВИКОНАНО: СЛИМАК ЗАРАЖЕНИЙ, СЕНСОР СЯЄ. ПРАВІ ДВЕРІ E → ОСТАННІЙ ПРОМІНЬ.';
hud('02','ЗАРАЗНЕ СВІТЛО',task,pools);
txt('W01','ДУШ E');txt('W02','ГНІЗДО → ШТРИХ');
txt('W03',D.slugInfected?'СЛИМАК ЗАРАЖЕНИЙ ✓':'ЗАРАЗИТИ СЛИМАКА');
txt('W04',D.slugSensor?'СЕНСОР ✓':'СЕНСОР X');
txt('W05','ДВЕРІ → 03');txt('WLamp','СПАЛАХ НЕВИДИМИЙ У СВІТЛІ, АЛЕ ШЛЕЙФ ГАРЯЧИЙ');
})();
