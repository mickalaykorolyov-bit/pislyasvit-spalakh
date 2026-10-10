// R03: ХИЖИЙ ДЕНДРАРІЙ. A slow fly deals precisely three contact hits.
// A mechanical crusher breaks an immortal golem into 3 STILL-ALIVE chasing pieces.
const ROOM=3;
spawn({x:115,y:635});
const P=[{x:0,y:635,w:1280,h:85},{x:171,y:535,w:184,h:18},
{x:738,y:521,w:186,h:18},{x:930,y:440,w:204,h:18}];
const stencil={x:511,y:589,cx:542,cy:375},crusher={x:1018,y:580},monster={x:966,y:589};
let pools=[{x:129,y:587,r:175},{x:480,y:566,r:136},{x:860,y:486,r:118}];
if(S.trace)pools.push({x:stencil.cx,y:stencil.cy,r:197});
if(!S.golemInit){S.golemInit=true;S.crusher='ready';S.crusherTimer=0;S.crusherY=213;S.fly={x:1200,y:576,phase:0};}
if(!S.dead&&!D.won){
 if(S.crusher==='warning'){
  S.crusherTimer-=dt;if(S.crusherTimer<=0)S.crusher='fall';
 }
 if(S.crusher==='fall'){
  S.crusherY=Math.min(590,S.crusherY+810*dt);
  if(Math.abs(S.x-monster.x)<60&&Math.abs(S.y-S.crusherY)<76)hurt('КАМ’ЯНИЙ ПРЕС');
  if(S.crusherY>=590){
   S.crusher='landed';D.monsterBroken=true;S.shake=.9;
   say('МОНСТРА РОЗБИТО! АЛЕ ЙОГО ТРИ ЧЕРВОНІ УЛАМКИ ЖИВІ Й ПЕРЕСЛІДУВАТИМУТЬ ТЕБЕ ДАЛІ!',6.5);
  }
 }
 walk(P,{bottom:795});
 if(E&&!S.trace){
  if(distance(S.x,S.y-40,stencil.x,stencil.y)<95)
   startGlyph('triangle',stencil.cx,stencil.cy);
  else if(distance(S.x,S.y-39,crusher.x,crusher.y)<97&&S.crusher==='ready'){
   S.crusher='warning';S.crusherTimer=.9;S.shake=.5;
   say('ПРЕС ЗА 0.9 С РОЗІБ’Є МОНСТРА. ВІДІЙДИ, АЛЕ ПАМ’ЯТАЙ: УЛАМКИ БУДУТЬ РУХАТИСЯ!',5);
  }else if(distance(S.x,S.y-40,1207,581)<93){
   if(D.glyph.triangle&&D.monsterBroken)visit(4,{x:117,y:635});
   else say('ДАЛІ ЛИШЕ ПІСЛЯ ТРИКУТНИКА ТА ПАДІННЯ ПРЕСА НА МОНСТРА.',4);
  }else if(distance(S.x,S.y-40,70,581)<84)
   visit(2,{x:1115,y:208});
 }
 updateFly(pools);
}
shards(3,pools);
if(A.ok){
 worldBase();const w=A.world,b=A.back;
 lights(pools);for(const p of P)ground(w,p);
 glyphArt('triangle',stencil.cx,stencil.cy,D.glyph.triangle);
 // Giant suspended mechanical press and porcelain golem.
 line(w,monster.x,102,monster.x,226,0x9caaae,.48,5);
 if(S.crusher!=='ready'){
  const y=S.crusher==='warning'?213:S.crusherY;
  if(S.crusher==='warning')halo(b,monster.x,590,109,0xf95d7d,.22+.10*Math.abs(Math.sin(S.elapsed*16)));
  drawBox(w,monster.x-69,y-27,138,49,0x75828f,.93);
  for(let x=-45;x<=45;x+=30)line(w,monster.x+x,y-19,monster.x+x+16,y+12,0xc6b6b9,.36,3);
 }else{
  drawBox(w,monster.x-69,176,138,47,0x778895,.97);
 }
 if(!D.monsterBroken){
  halo(b,monster.x,monster.y,103,0xb893a3,.16);
  circle(w,monster.x,monster.y-49,52,0x544357,.99);
  for(const side of [-1,1])for(let z=0;z<4;z++)
   line(w,monster.x+side*19,monster.y-45+z*17,
   monster.x+side*(62+z*3),monster.y-56+z*19,0x95738f,.65,5);
  circle(w,monster.x-17,monster.y-58,7,0xf992ab);
  circle(w,monster.x+18,monster.y-58,7,0xf992ab);
 }else{
  halo(b,monster.x,monster.y-38,91,0xff8fa8,.09);
  drawBox(w,monster.x-77,606,140,25,0x75566b,.63);
 }
 drawBox(w,crusher.x-32,560,64,47,0x516075,.97);
 circle(w,crusher.x,585,15,S.crusher==='ready'?0xffbb89:0x7bffd8);
 door(74,635,72,true,0xa3e7eb);
 door(1207,635,75,D.glyph.triangle&&D.monsterBroken,0xa4f6d7);
 drawBox(w,stencil.x-25,592,54,31,0x4d4b6b,.92);
 circle(w,stencil.x,603,11,D.glyph.triangle?0x9fffdb:0xb198e3);
}
drawEnemies(3);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЛІТУЧА МУХА ПОВІЛЬНО ПЕРЕСЛІДУЄ ТЕБЕ. 3 ДОТИКИ = СМЕРТЬ. У СВІТЛІ МОЖНА СХОВАТИСЯ.';
if(S.trace)task='ТРИКУТНИК: ТРИМАЙ X І ВЕДИ WASD ПО ВЕРШИНАХ, ПОКИ МУХА ПІДЛІТАЄ! '+S.trace.index+'/'+S.trace.points.length;
else if(!D.glyph.triangle)task='ЗНАЙДИ ПУЛЬТ МАЛЮВАННЯ ТРИКУТНИКА ПО ЦЕНТРУ. E → ТРИМАЙ X → WASD.';
else if(!D.monsterBroken)task='ТРИКУТНИК ГОТОВИЙ. ПРАВОРУЧ ВЕЛИКИЙ МОНСТР І ВАЖКИЙ ПРЕС — АКТИВУЙ E.';
else task='МОНСТР РОЗСИПАВСЯ, ЙОГО УЛАМКИ ТЕБЕ ПЕРЕСЛІДУЮТЬ. ПІДБЕРИ E, КИДАЙ F. ДВЕРІ ПРАВОРУЧ → 04.';
hud('03','МУХА Й ЖИВИЙ МОНСТР',task,pools);
label('W01','△ · E + X + WASD');
label('W02','МУХА: '+S.health+'/3');
label('W03','ВАЖКИЙ ПРЕС E');
label('W04',D.monsterBroken?'УЛАМКИ ЖИВІ!':'РОЗБИТИ МОНСТРА');
label('W05','ДВЕРІ → 04');
label('WLamp','ШМАТОК МОНСТРА: E ПІДНЯТИ, F КИНУТИ');
})();
