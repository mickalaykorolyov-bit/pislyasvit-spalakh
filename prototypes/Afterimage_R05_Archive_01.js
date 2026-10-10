// R05: СХОВИЩЕ ВІДБЛИСКІВ — finale requires all actual symbols,
// a personal long X afterimage to activate a receiver, and a thrown monster piece.
const ROOM=5;
spawn({x:105,y:635});checkpoint(112,635);
const floor=[{x:0,y:635,w:1280,h:85},{x:268,y:523,w:172,h:19},{x:630,y:505,w:190,h:19}];
const sensor={x:644,y:573},target={x:1052,y:566},gate={x:1216,y:586};
const lamps=[{x:427,upper:140,down:597},{x:856,upper:131,down:596}];
if(!S.finalInit){
 S.finalInit=true;S.lamps=lamps.map((t,n)=>({...t,y:t.upper,status:'ready',count:1.9+n*1.5,warn:0,cool:0}));
 say('ФІНАЛЬНЕ СХОВИЩЕ: ШЛЕЙФ X ЗАПУСКАЄ ОДИН СЕНСОР. ДРУГИЙ ЖИВИТЬСЯ УЛАМКОМ МОНСТРА.',6.5);
}
let pools=[{x:117,y:584,r:165},{x:550,y:557,r:137},{x:979,y:567,r:145}];
if(D.finalSensor)pools.push({x:739,y:561,r:180});
if(D.finalTarget)pools.push({x:1100,y:560,r:147});
if(!S.dead&&!D.won){
 for(const l of S.lamps){
  l.count-=dt;
  if(l.status==='ready'&&l.count<=0){l.status='warning';l.warn=.82;}
  if(l.status==='warning'){
   l.warn-=dt;if(l.warn<=0){l.status='fall';l.y=l.upper;}
  }
  if(l.status==='fall'){
   l.y=Math.min(l.down,l.y+895*dt);
   if(Math.abs(S.x-l.x)<48&&Math.abs(S.y-l.y)<86)hurt('ПАДІННЯ ЛАМПИ');
   if(l.y>=l.down){l.status='landed';l.cool=2.3;}
  }
  if(l.status==='landed'){
   l.cool-=dt;if(l.cool<=0){l.status='ready';l.y=l.upper;l.count=1.65;}
  }
 }
 walk(floor,{bottom:791});
 if(!D.finalSensor&&hotNear(sensor.x,sensor.y,91)){
  D.finalSensor=true;S.shake=.8;
  say('ШЛЕЙФ СПАЛАХА ЗАПУСТИВ ЛІВИЙ РЕЗОНАТОР! ПРАВИЙ ПРИЙМАЄ ТІЛЬКИ ЖИВИЙ УЛАМОК.',5.1);
 }
 if(E&&!S.trace){
  if(distance(S.x,S.y-38,72,585)<89)
   visit(4,{x:1118,y:635});
  else if(distance(S.x,S.y-40,gate.x,gate.y)<93){
   if(D.glyph.circle&&D.glyph.triangle&&D.glyph.zigzag&&D.finalSensor&&D.finalTarget){
    D.won=true;S.shake=1;
    say('ТИ НАВЧИВСЯ НЕ ТІЛЬКИ СЯЯТИ, А Й ЗАЛИШАТИ СВІТЛО ЯК СЛІД. СХОВИЩЕ ВІДКРИТО!',99);
   }else{
    say('ЗАМОК ВИМАГАЄ ◯ △ ϟ + X-СЕНСОР + ЖИВИЙ УЛАМОК МОНСТРА. ВИКОНАЙ УСІ УМОВИ.',5);
   }
  }
 }
}
shards(5,pools,{
 x:target.x,y:target.y,r:68,
 onHit:()=>{if(!D.finalTarget){
  D.finalTarget=true;S.shake=.9;
  say('УЛАМОК ПІДЖИВИВ ПРАВИЙ РЕЗОНАТОР. ПЕЧАТКА МАЙЖЕ ВІДКРИТА!',5.8);
 }}
});
if(A.ok){
 worldBase();const w=A.world,b=A.back;
 lights(pools);for(const p of floor)ground(w,p);
 for(let n=0;n<3;n++){
  const pos={x:372+n*104,y:261},ok=[D.glyph.circle,D.glyph.triangle,D.glyph.zigzag][n];
  halo(b,pos.x,pos.y,75,ok?0x9dffe5:0xb78bcf,ok?.20:.07);
  w.lineStyle(5,ok?0xa2ffd5:0x986da7,.93);w.drawCircle(pos.x,pos.y,30);
  circle(w,pos.x,pos.y,14,ok?0x94ffdc:0x705877);
 }
 // Sensor senses the actual traced light (not a generic area activation).
 for(const [pos,done] of [[sensor,D.finalSensor],[target,D.finalTarget]]){
  halo(b,pos.x,pos.y,86,done?0x89ffe4:0xffabac,.12);
  w.lineStyle(4,done?0x92ffe4:0xda8093,.97);w.drawCircle(pos.x,pos.y,30);
  circle(w,pos.x,pos.y,12,done?0x93ffe0:0x94516c);
 }
 for(const l of S.lamps){
  if(l.status==='warning'){
   halo(b,l.x,l.down,104,0xf55b7d,.23+.13*Math.abs(Math.sin(S.elapsed*18)));
   for(let y=l.upper;y<l.down;y+=49)drawBox(w,l.x-15,y,30,10,0xfa6784,.49);
  }else if(l.status==='fall'||l.status==='landed'){
   drawBox(w,l.x-35,l.y-23,71,29,0x607783,.96);circle(w,l.x,l.y+9,16,0xacffdf);
   if(l.status==='landed')halo(b,l.x,l.y,88,0x89ffe0,.17);
  }else{
   line(w,l.x,93,l.x,l.upper-23,0x98b8c0,.49,3);
   drawBox(w,l.x-31,l.upper-33,63,30,0x6f8592,.96);
  }
 }
 const canWin=D.glyph.circle&&D.glyph.triangle&&D.glyph.zigzag&&D.finalSensor&&D.finalTarget;
 door(gate.x,635,83,canWin,0x9bffe6);
 door(73,635,72,true,0xa4f2dd);
 if(canWin)halo(b,gate.x,576,119,0xa3fdda,.17);
 if(D.won){halo(b,gate.x,555,170,0xffd8a6,.21);}
}
drawEnemies(5);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ФІНАЛ: ТРИ РУНИ НА СТІНІ. ДВА СЕНСОРИ: ЛІВИЙ ЛОВИТЬ X-ШЛЕЙФ, ПРАВИЙ — КИНУТИЙ УЛАМОК.';
if(!D.finalSensor)task='УТРИМУЙ X І ПРОБІГИ ПОВЗ ЛІВИЙ КРУГЛИЙ СЕНСОР ПО ЦЕНТРУ. ОБЕРЕЖНО: ЛАМПИ ПАДАЮТЬ!';
else if(!D.finalTarget)task='ПЕРШИЙ СЕНСОР ПРАЦЮЄ. ПІДНІМИ ЧЕРВОНИЙ ШМАТОК МОНСТРА КЛАВІШЕЮ E ТА КИНЬ F У ПРАВИЙ КРУГ.';
else task='ОБИДВА СЕНСОРИ ЗАРЯДЖЕНО. ІДИ ДО ГОЛОВНОЇ БРАМИ ПРАВОРУЧ, НАТИСНИ E.';
hud('05','ОСТАННЄ СХОВИЩЕ',task,pools);
label('W01',D.glyph.circle?'◯ ✓':'◯ ?');label('W02',D.glyph.triangle?'△ ✓':'△ ?');
label('W03',D.glyph.zigzag?'ϟ ✓':'ϟ ?');
label('W04',D.finalSensor?'X-СЕНСОР ✓':'X-СЕНСОР ○');
label('W05',D.finalTarget?'КИНУТО УЛАМОК ✓':'ПОТРІБЕН УЛАМОК F');
label('WLamp',D.won?'СХОВИЩЕ ВІДКРИТО!':'ЛАМПИ ПАДАЮТЬ ЗІ СТЕЛІ');
})();
