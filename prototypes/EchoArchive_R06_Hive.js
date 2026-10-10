// R06 — ВУЛИК ПІКСЕЛЬНОГО ПИЛУ. Fleas accumulate, reducing real movement speed.
// Push a luminous cart to physically crush the nest, or throw a living monster fragment into it.
const ROOM=6;
spawn({x:112,y:635});checkpoint(113,635);
const P=[{x:0,y:635,w:1280,h:85},{x:295,y:521,w:165,h:18},{x:834,y:524,w:187,h:18}];
const WASH={x:168,y:576},NEST={x:1025,y:582},TOKEN={x:1153,y:584};
if(!S.hiveInit){
 S.hiveInit=true;S.fleas=0;S.fleaTick=0;S.cartX=422;S.cartGrab=false;S.cartSide=-1;
 say('ТУТ БЛОХИ ПРИЛИПАЮТЬ ДО СПАЛАХА Й СПОВІЛЬНЮЮТЬ ЙОГО. ВІЗОК МОЖНА ПІДШТОВХНУТИ НА ГНІЗДО.',6);
}
let pools=[{x:135,y:580,r:171},{x:S.cartX,y:566,r:143},{x:1153,y:574,r:145}];
if(D.hiveNest)pools.push({x:922,y:560,r:181});
if(!S.dead&&!D.won){
 S.fleaTick+=dt*(K.ink?1.7:1)*(D.hiveNest?.32:1);
 if(S.fleaTick>(D.hiveNest?2.5:.55)&&S.x>235){
  S.fleaTick=0;S.fleas++;
  if(S.fleas===10)say('БЛОХИ ВЖЕ СПОВІЛЬНИЛИ СПАЛАХА! ШУКАЙ ДУШ ЛІВОРУЧ АБО ДІЙ ШВИДШЕ.',3.8);
  if(S.fleas===20)say('ЗАРАЗ КРИТИЧНА КІЛЬКІСТЬ ПІКСЕЛЬНИХ БЛІХ. ПОВЕРНИСЯ ДО ДУШУ!',3.8);
 }
 if(S.fleas>=28)kill('БЛОХИ ПОГАСИЛИ ОСТАННЮ ІСКРУ');
 const before=S.x;
 walk(P,{bottom:794,slow:(x,y)=>x>708&&x<935&&y>598});
 if(S.cartGrab){
  S.cartX=clamp(S.cartX+S.x-before,357,1033);
  S.x=S.cartX+S.cartSide*68;S.y=635;S.vy=0;S.ground=true;
  if(S.cartX>=990&&!D.hiveNest){
   D.hiveNest=true;S.fleas=0;S.shake=.9;
   say('ВІЗОК РОЗДАВИВ БЛОШИНЕ ГНІЗДО! ЗАЛИШИЛАСЯ МЕТАЛЕВА КАПСУЛА ПРАВОРУЧ.',5.2);
  }
 }
 if(E||G){
  if(Math.abs(S.x-S.cartX)<96&&S.y>571&&!D.hiveNest){
   S.cartGrab=!S.cartGrab;S.cartSide=S.x<S.cartX?-1:1;
   if(S.cartGrab)S.x=S.cartX+S.cartSide*68;
   say(S.cartGrab?'ТИ ШТОВХАЄШ СВІТЛОВИЙ ВІЗОК. ПІДВЕДИ ЙОГО ДО БЛОШИНОГО ГНІЗДА ПРАВОРУЧ.':
    'ВІЗОК ЗАЛИШЕНО НА МІСЦІ.',3.8);
  }else if(E&&!S.cartGrab&&distance(S.x,S.y-36,WASH.x,WASH.y)<94){
   S.fleas=0;S.fleaTick=0;S.shake=.35;
   say('ВОДЯНИЙ ДУШ ЗМИВ УСІХ БЛІХ. ШВИДКІСТЬ СПАЛАХА ВІДНОВЛЕНО.',4);
  }else if(E&&D.hiveNest&&distance(S.x,S.y-36,TOKEN.x,TOKEN.y)<96){
   D.hiveToken=true;S.shake=.85;
   say('ЗНАЙДЕНО КАПСУЛУ СВІТЛОВОГО ПИЛУ. ВОНА ПОТРІБНА ДЛЯ ЖИВЛЕННЯ ФІНАЛЬНОГО АРХІВУ.',5);
  }else if(E&&distance(S.x,S.y-35,1209,585)<90){
   if(D.hiveToken)visit(7,{x:109,y:635});
   else say('ФІНАЛ ЗАЧИНЕНО, ПОКИ НЕ ЗНИЩИШ ГНІЗДО ТА НЕ ВІЗЬМЕШ СВІТЛОВУ КАПСУЛУ.',4);
  }else if(E&&distance(S.x,S.y-35,76,585)<89){
   S.fleas=0;visit(5,{x:1141,y:635});
  }
 }
}
shards(6,pools,{x:NEST.x,y:NEST.y,r:85,onHit:()=>{
 if(!D.hiveNest){D.hiveNest=true;S.fleas=0;S.shake=.9;
  say('ЖИВИЙ УЛАМОК РОЗБИВ ГНІЗДО! ВОНО БІЛЬШЕ НЕ НАРОДЖУЄ ПІКСЕЛЬНИХ БЛІХ.',5);}
}});
if(A.ok){
 worldBase();const w=A.world,b=A.back;lights(pools);
 for(const p of P)ground(w,p);
 // Luminous pushing cart is both a ladder and temporary stealth shelter.
 halo(b,S.cartX,576,126,0xbaf9ea,.16);
 drawBox(w,S.cartX-59,537,118,96,0x455c6b,.97);
 drawBox(w,S.cartX-56,540,112,7,0xb0dcdb,.91);
 for(let n=0;n<3;n++)line(w,S.cartX-49,566+n*17,S.cartX+49,566+n*17,0x98bcbf,.42,2);
 circle(w,S.cartX-44,629,9,0x182d40);circle(w,S.cartX+44,629,9,0x182d40);
 circle(w,S.cartX,563,17,0xaeffeb);
 // Infestation threat meter mirrors the real movement slowdown.
 drawBox(w,417,142,462,17,0x272c49,.94);
 drawBox(w,420,145,456*clamp(S.fleas/28,0,1),11,S.fleas>20?0xf96183:0xbc9bea,.92);
 for(let n=0;n<Math.min(35,S.fleas);n++){
  const t=n*2.399+S.elapsed*.35,rr=26+Math.sqrt(n)*6;
  circle(A.fx,S.x+rr*Math.cos(t),S.y-44+rr*.63*Math.sin(t),3,0xd5a7fc,.75);
 }
 drawBox(w,WASH.x-34,546,69,87,0x32607a,.95);
 for(let n=0;n<5;n++)line(w,WASH.x-29+n*14,552,WASH.x-29+n*14,609+Math.sin(S.elapsed*3+n)*8,0x9cebf6,.48,3);
 if(!D.hiveNest){
  halo(b,NEST.x,NEST.y,91,0xbe85d9,.20);
  drawBox(w,NEST.x-43,NEST.y-37,89,74,0x604c70,.94);
  for(let n=0;n<17;n++){
   const theta=n*2.3999,rr=10+n*2.6;
   circle(w,NEST.x+Math.cos(theta)*rr,NEST.y+Math.sin(theta)*rr*.65,3.2,0xe0aef5,.84);
  }
 }else{
  for(let i=0;i<6;i++)drawBox(w,NEST.x-67+i*23,613+Math.sin(i)*8,21,12,0x856e91,.85);
  halo(b,TOKEN.x,TOKEN.y,71,0x8bffe7,.15);
  if(!D.hiveToken)circle(w,TOKEN.x,TOKEN.y,21,0xb1fff0);
 }
 door(74,635,74,true,0xa8f1e3);
 door(1209,635,76,D.hiveToken,0xa3ffd9);
}
drawEnemies(6);drawTrailAndHero(pools);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='БЛОХИ ПРИЛИПАЮТЬ І СПОВІЛЬНЮЮТЬ РУХ. СВІТЛОВИЙ ВІЗОК У ЦЕНТРІ [E/G] МОЖНА ШТОВХНУТИ НА ГНІЗДО.';
if(S.cartGrab)task='ТРИМАЙ A/D, ЩОБ ПІДВЕСТИ ВІЗОК ПІД ФІОЛЕТОВЕ ГНІЗДО ПРАВОРУЧ. E/G — ВІДПУСТИТИ. БЛОХ '+S.fleas+'/28.';
else if(D.hiveNest&&!D.hiveToken)task='ГНІЗДО ЗРУЙНОВАНЕ. ЗНАЙДИ СВІТЛУ КАПСУЛУ ПРАВОРУЧ ТА ЗАБЕРИ ЇЇ КЛАВІШЕЮ E.';
else if(D.hiveToken)task='КАПСУЛУ ОТРИМАНО. ПРАВІ ДВЕРІ ВЕДУТЬ ДО СЕРЦЯ АРХІВУ.';
else if(S.fleas>15)task='КРИТИЧНО БАГАТО БЛІХ: '+S.fleas+'/28. ПОВЕРНИСЯ ДО ВОДЯНОГО ДУШУ ЛІВОРУЧ.';
hud('06','БЛОШИНА КУПІЛЬ',task,pools);
label('W01','ДУШ · E');label('W02','ВІЗОК · E/G');
label('W03','БЛОХИ '+S.fleas+'/28');label('W04',D.hiveNest?'ГНІЗДО ЗНИЩЕНО':'ГНІЗДО МАЄ ЗНИКНУТИ');
label('W05',D.hiveToken?'КАПСУЛА ✓':'КАПСУЛА ЗА ГНІЗДОМ');
label('WLamp','ШЛЕЙФ X ПРИВАБЛЮЄ ЩЕ БІЛЬШЕ БЛІХ');
})();
