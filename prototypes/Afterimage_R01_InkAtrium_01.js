// R01: ХОЛ ЖИВОГО ЧОРНИЛА — circle, sensor, flammable clue
const ROOM=1;
spawn({x:123,y:635});checkpoint(125,635);
const P=[{x:0,y:635,w:1280,h:85},{x:210,y:513,w:154,h:19},{x:719,y:486,w:169,h:19}];
const panel={x:574,y:577,cx:586,cy:378};
const sensor={x:1077,y:574},scroll={x:924,y:555},valve={x:328,y:586};
let pools=[{x:134,y:580,r:178},{x:552,y:577,r:170},{x:1095,y:579,r:141}];
if(D.originSensor)pools.push({x:970,y:571,r:165});
if(S.trace)pools.push({x:panel.cx,y:panel.cy,r:400});
if(!S.dead&&!D.won){
 walk(P,{bottom:794});
 if(!S.trace){
  if(!D.waterShield&&D.scrollScorched===0&&hotNear(scroll.x,scroll.y,85)){
   D.scrollScorched=8;S.shake=.9;
   say('ТВОЄ СВІТЛО ПІДПАЛИЛО КРИХКИЙ ПЕРГАМЕНТ! ШУКАЙ ВОДЯНИЙ ВЕНТИЛЬ ЛІВОРУЧ.',6);
  }
  if(D.scrollScorched>0&&D.dampUntil>D.time)D.scrollScorched=0;
  if(D.dampUntil<D.time)D.waterShield=false;
  if(K.ink&&hotNear(sensor.x,sensor.y,79)&&Math.abs(S.vx)>76&&!D.originSensor){
   D.originSensor=true;S.shake=.55;
   say('СЕНСОР ЗАПАМ’ЯТАВ СВІТЛОВИЙ ШЛЕЙФ СПАЛАХА. ТЕПЕР ВІДКРИЄТЬСЯ ПІДВОДНИЙ ШЛЮЗ.',5);
  }
  if(E){
   if(distance(S.x,S.y-40,valve.x,valve.y)<92){
    D.waterShield=true;D.dampUntil=D.time+12;D.scrollScorched=0;
    say('ВОЛОГИЙ ТУМАН ОХОЛОДИВ ПЕРГАМЕНТ. НА НАСТУПНІ 12 С СВІТЛО ЙОГО НЕ ПІДПАЛИТЬ.',5);
   }else if(distance(S.x,S.y-39,panel.x,panel.y)<94){
    startGlyph('circle',panel.cx,panel.cy);
   }else if(distance(S.x,S.y-34,1220,590)<96){
    if(D.glyph.circle&&D.originSensor&&D.scrollScorched<=0)visit(2,{x:123,y:2350});
    else say('ШЛЮЗ ЧЕКАЄ: КОЛО + ВЛАСНЕ СЯЙВО В СЕНСОРІ. ПЕРГАМЕНТ МАЄ ОХОЛОНУТИ.',5);
   }else if(distance(S.x,S.y-35,scroll.x,scroll.y)<72){
    say(D.scrollScorched>0?'ПЕРГАМЕНТ ОБВУГЛИВСЯ — ОХОЛОДИ ЙОГО ВОДОЮ.':'ВАЖЛИВИЙ СУХИЙ ПЕРГАМЕНТ. НЕ СПАЛИ ЙОГО ШЛЕЙФОМ.',4);
   }
  }
 }
}
shards(1,pools);
if(A.ok){
 worldBase();const w=A.world,b=A.back;
 lights(pools);for(const p of P)ground(w,p);
 // Huge monochrome calligraphy canvas, translucent seal.
 glyphArt('circle',panel.cx,panel.cy,D.glyph.circle);
 door(1220,635,74,D.glyph.circle&&D.originSensor&&D.scrollScorched<=0,0x9afbe1);
 halo(b,sensor.x,sensor.y,82,D.originSensor?0x9afce2:0xf3a9ab,.16);
 w.lineStyle(4,D.originSensor?0x92ffe5:0xf2a8a0,.93);w.drawCircle(sensor.x,sensor.y,28);
 circle(w,sensor.x,sensor.y,11,D.originSensor?0x8dfbce:0x9a5970);
 // Dry scroll is a burnable source of secret information.
 drawBox(w,scroll.x-33,scroll.y-26,67,53,D.scrollScorched>0?0x553343:0xb7a583,.92);
 for(let y=scroll.y-12;y<scroll.y+19;y+=12)line(w,scroll.x-19,y,scroll.x+21,y,D.scrollScorched>0?0xe17b7c:0x685b69,.62,2);
 if(D.scrollScorched>0){
  halo(b,scroll.x,scroll.y,63,0xff647b,.21);
  for(let i=0;i<5;i++)circle(w,scroll.x+Math.sin(D.time*3+i)*24,scroll.y-27-i*9,4,0xfa7d86,.5);
 }
 // Underwater cooling valve teaches reversibility, not a softlock.
 drawBox(w,valve.x-29,valve.y-30,60,60,0x285570,.95);
 w.lineStyle(4,0x96dff8,.88);w.drawCircle(valve.x,valve.y,20);
 line(w,valve.x-26,valve.y,valve.x+27,valve.y,0x94e8fb,.75,3);
 if(D.waterShield)halo(b,valve.x,valve.y,83,0x6fdbee,.16);
 drawBox(w,panel.x-32,592,64,30,0x445366,.96);circle(w,panel.x,604,12,D.glyph.circle?0x9bffd1:0xb69bdf);
}
drawEnemies(1);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='БІЛЯ ВЕЛИКОГО КОЛА НАТИСНИ E. У РЕЖИМІ РИСУВАННЯ ТРИМАЙ X І РУХАЙСЯ WASD ПО МАРКЕРАХ.';
if(S.trace)task='КОЛО: ПРОВЕДИ ШЛЕЙФОМ ЧЕРЕЗ МАРКЕРИ ПО КОЛУ, НЕ ВІДПУСКАЮЧИ X · '+S.trace.index+'/'+S.trace.points.length;
else if(D.scrollScorched>0)task='УВАГА: ТИ СПАЛИВ ПЕРГАМЕНТ! ВОДЯНИЙ ВЕНТИЛЬ ЛІВОРУЧ [E] ОХОЛОДИТЬ ЙОГО.';
else if(D.glyph.circle&&!D.originSensor)task='КОЛО ГОТОВЕ. РОЗЖЕНИСЯ Й ЗАТИСНИ X ПРАВОРУЧ БІЛЯ КРУГЛОГО СЕНСОРА.';
else if(D.glyph.circle&&D.originSensor)task='КОЛО ТА СЕНСОР ПРАЦЮЮТЬ. ШЛЮЗ ДО ВИСОКОЇ ШАХТИ ПРАВОРУЧ [E].';
hud('01','ХОЛ ЖИВОГО ЧОРНИЛА',task,pools);
label('W01','◯ · МАЛЮВАТИ E + X');
label('W02',D.waterShield?'ЗАХИСТ ВОДОЮ ✓':'ПЕРГАМЕНТ ВРАЗЛИВИЙ');
label('W03',D.originSensor?'СЕНСОР ✓':'СЕНСОР НА СЯЙВО X');
label('W04','ШЛЮЗ → 02');
label('W05',D.glyph.circle?'КОЛО ЗАПИСАНО':'КОЛО НЕ ЗАПИСАНО');
label('WLamp','X ПІДПАЛЮЄ СУХІ ПОВЕРХНІ!');
})();
