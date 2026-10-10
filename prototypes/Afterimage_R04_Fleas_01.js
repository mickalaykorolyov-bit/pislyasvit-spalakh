// R04: БЛОШИНИЙ ІНКУБАТОР — pixel parasites accumulate during zigzag inscription.
const ROOM=4;
spawn({x:114,y:635});checkpoint(116,635);
const floor=[{x:0,y:635,w:1280,h:85},{x:309,y:524,w:194,h:19},{x:855,y:527,w:200,h:19}];
const stencil={x:660,y:586,cx:660,cy:382},rinse={x:191,y:583},nest={x:1104,y:573};
if(!S.fleaInit){S.fleaInit=true;S.fleas=0;S.fleaTick=0;say('ПІКСЕЛЬНІ БЛОХИ ПРИЛИПАЮТЬ ДО СПАЛАХА. ЩО ЇХ БІЛЬШЕ, ТО ПОВІЛЬНІШЕ ВІН РУХАЄТЬСЯ.',6);}
let pools=[{x:126,y:583,r:193},{x:596,y:590,r:123},{x:999,y:577,r:119}];
if(S.trace)pools.push({x:stencil.cx,y:stencil.cy,r:345});
if(D.fleaNestBroken)pools.push({x:1130,y:560,r:155});
if(!S.dead&&!D.won){
 if(S.x>276||S.trace){
  const rate=D.fleaNestBroken?1.5:.68;
  S.fleaTick+=dt*(K.ink?1.35:1);
  if(S.fleaTick>=rate){
   S.fleaTick=0;S.fleas++;
   if(S.fleas===10)say('НА СПАЛАСІ ВЖЕ 10 ПІКСЕЛЬНИХ БЛІХ. РУХ ПОМІТНО СПОВІЛЬНЮЄТЬСЯ!',3.5);
   if(S.fleas===18)say('КРИТИЧНА КІЛЬКІСТЬ БЛІХ! ДОКРЕСЛИ ЗИГЗАГ АБО ПОВЕРНИСЯ ДО ДУШУ.',4);
  }
  if(S.fleas>=24)kill('БЛОХИ ВИСМОКТАЛИ ОСТАННЮ ІСКРУ');
 }
 walk(floor,{bottom:791,slow:(x,y)=>x>580&&x<810&&y>610});
 if(E&&!S.trace){
  if(distance(S.x,S.y-39,rinse.x,rinse.y)<91){
   S.fleas=0;S.fleaTick=0;S.shake=.25;
   say('ХОЛОДНИЙ ДУШ ЗМИВ ВСІХ ПІКСЕЛЬНИХ БЛІХ. СПАЛАХ ЗНОВУ ШВИДКИЙ.',4);
  }else if(distance(S.x,S.y-38,stencil.x,stencil.y)<94){
   startGlyph('zigzag',stencil.cx,stencil.cy);
  }else if(distance(S.x,S.y-38,73,585)<92){
   S.fleas=0;visit(3,{x:1130,y:635});
  }else if(distance(S.x,S.y-38,1211,585)<94){
   if(D.glyph.zigzag)visit(5,{x:107,y:635});
   else say('ПОТРІБНО ДОКРЕСЛИТИ ЗИГЗАГ ДОВГИМ ШЛЕЙФОМ X.',3);
  }
 }
}
shards(4,pools,{
 x:nest.x,y:nest.y,r:82,
 onHit:()=>{if(!D.fleaNestBroken){
  D.fleaNestBroken=true;S.fleas=Math.min(4,S.fleas);S.shake=.8;
  say('УЛАМОК МОНСТРА РОЗБИВ БЛОШИНЕ ГНІЗДО. ТЕПЕР БЛОХИ ЛІЗУТЬ ЗНАЧНО ПОВІЛЬНІШЕ!',5);
 }}
});
if(A.ok){
 worldBase();const w=A.world,b=A.back;
 lights(pools);for(const p of floor)ground(w,p);
 glyphArt('zigzag',stencil.cx,stencil.cy,D.glyph.zigzag);
 // Cold-water decontamination is reusable even after a mistake.
 drawBox(w,rinse.x-32,555,65,78,0x245d68,.98);
 for(let n=0;n<5;n++){
  circle(w,rinse.x-25+n*12,574+Math.sin(S.elapsed*5+n)*11,4,0x90dff6,.70);
  line(w,rinse.x-24+n*13,565,rinse.x-24+n*13,601,0x75bcd9,.43,2);
 }
 halo(b,rinse.x,575,83,0x9bf3f7,.14);
 // Flea nest can be destroyed by grabbing and throwing a chasing monster piece.
 if(!D.fleaNestBroken){
  halo(b,nest.x,nest.y,71,0xbc8be5,.18);
  drawBox(w,nest.x-48,nest.y-30,96,61,0x5d4573,.91);
  for(let i=0;i<17;i++){
   const theta=i*2.39996,rad=12+i*2.5;
   circle(w,nest.x+rad*Math.cos(theta),nest.y+rad*Math.sin(theta)*.5,3,0xd9a5ff,.79);
  }
 }else{
  for(let i=0;i<6;i++)drawBox(w,nest.x-56+i*19,nest.y+23+Math.sin(i)*7,16,9,0x846788,.82);
  halo(b,nest.x,nest.y,64,0xa2ffda,.12);
 }
 drawBox(w,stencil.x-29,591,57,30,0x4d4963,.96);
 circle(w,stencil.x,605,13,D.glyph.zigzag?0x9effdc:0xbd9bcf);
 door(73,635,72,true,0xa7f4dc);
 door(1211,635,72,D.glyph.zigzag,0x99ffe1);
 // Visual infestation meter.
 drawBox(w,393,126,481,15,0x25324b,.97);
 drawBox(w,396,129,475*clamp(S.fleas/24,0,1),9,S.fleas>17?0xff7789:0xcba4ea,.91);
}
drawEnemies(4);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='БЛОХИ ПОВІЛЬНО ЛІПНУТЬ ДО ТЕБЕ. МАЛЮЙ ЗИГЗАГ ШЛЕЙФОМ X, АБО ПОВЕРНИСЯ ПІД ДУШ ЛІВОРУЧ.';
if(S.trace)task='ЗИГЗАГ: УТРИМУЙ X, WASD ПО МАРКЕРАХ; БЛІХ: '+S.fleas+'/24 · '+S.trace.index+'/'+S.trace.points.length;
else if(D.glyph.zigzag)task='ЗИГЗАГ ЗАПИСАНО! ПРАВІ ДВЕРІ ВЕДУТЬ ДО ФІНАЛЬНОГО АРХІВУ. БЛІХ: '+S.fleas+'/24.';
else if(S.fleas>15)task='БЛОХ: '+S.fleas+'/24! ПОВЕРТАЙСЯ ДО ВОДЯНОГО ДУШУ [E] ЛІВОРУЧ АБО ЗАВЕРШИ МАЛЮНОК.';
hud('04','ІНКУБАТОР ПІКСЕЛЬНИХ БЛІХ',task,pools);
label('W01','∿ · ЗИГЗАГ E + X');
label('W02','БЛОХ '+S.fleas+'/24');
label('W03',D.fleaNestBroken?'ГНІЗДО ЗЛАМАНО':'КИНЬ УЛАМОК F → ГНІЗДО');
label('W04','ДУШ E — ОЧИСТИТИСЯ');
label('W05','ДВЕРІ → 05');
label('WLamp','ПРИЛИПЛІ ПІКСЕЛІ СПОВІЛЬНЮЮТЬ СПАЛАХА');
})();
