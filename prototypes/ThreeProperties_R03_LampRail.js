// 03 / ОСТАННІЙ ПРОМІНЬ — draw an actual arbitrary polyline rail with X+WASD.
// The weighted lamp travels along the stroke, lighting a movable stealth bubble and triggering a timed sensor.
spawn({x:124,y:635});checkpoint(124,635);
if(!S.beamInit){
 S.beamInit=true;S.editor=false;S.nib={x:271,y:441};
 S.rail=null;S.draft=[];S.railDistance=0;S.editorWasX=false;
 S.lamp={x:272,y:419,state:'hanging',i:0,t:0,time:0};
 S.railWarn=0;S.burnNet=0;S.brake=0;S.topTimer=0;
 S.spiders=[{x:697,y:590,baseY:590},{x:908,y:588,baseY:588}];
 announce('ПОБУДУЙ РЕЙКУ ДЛЯ ЛАМПИ. БІЛЯ ЛІВОГО КРЕСЛЯРСЬКОГО ПУЛЬТА E → МАЛЮЙ X + WASD.',7);
}
const P=[{x:0,y:635,w:1280,h:86},{x:244,y:517,w:182,h:18},{x:845,y:511,w:166,h:18}];
const DESK={x:217,y:585},TRIGGER={x:363,y:585},
 UPPER={x:1080,y:403},LOWER={x:1113,y:576},EXIT={x:1220,y:581};
const NET={x1:571,x2:763,y:460},GLASS={x1:815,x2:950,y:520};
const area=[{x:135,y:579,r:168},{x:290,y:425,r:136},{x:1187,y:571,r:126}];
if(S.lamp.state!=='broken'&&S.lamp.state!=='hanging')area.push({x:S.lamp.x,y:S.lamp.y,r:151,c:0xcffff1,a:.21});
else if(S.lamp.state==='hanging')area.push({x:272,y:420,r:142,c:0xb9fff0,a:.15});
function resetRailEditor(){
 S.editor=true;S.nib={x:271,y:441};S.draft=[];
 S.rail=null;S.railDistance=0;
 S.lamp={x:272,y:420,state:'hanging',i:0,t:0,time:0};
 D.lampUpper=false;D.lampLower=false;D.railSuccess=false;
 S.topTimer=0;S.railWarn=0;S.burnNet=0;S.brake=0;
 announce('РЕЖИМ КРЕСЛЕННЯ: ТРИМАЙ X І РУХАЙ ПЕРО КЛАВІШАМИ WASD. ОМИНАЙ СІТІ Й СКЛО.',7);
}
function recordNib(){
 // The character remains at the terminal; the drawing cursor is freely steerable.
 const dx=Number(K.r)-Number(K.l),dy=Number(K.dn)-Number(K.u);
 const speed=255;
 S.nib.x=minmax(S.nib.x+dx*speed*dt,270,1121);
 S.nib.y=minmax(S.nib.y+dy*speed*dt,382,555);
 if(K.x){
  const pt={x:S.nib.x,y:S.nib.y};
  if(!S.draft.length||d2(pt.x,pt.y,S.draft.at(-1).x,S.draft.at(-1).y)>8)S.draft.push(pt);
  if(S.draft.length>360)S.draft.shift();
 }
 if(XEND&&S.draft.length){
  const end=S.draft.at(-1),length=S.draft.reduce((a,p,i)=>a+(i?d2(p.x,p.y,S.draft[i-1].x,S.draft[i-1].y):0),0);
  if(end.x<976||length<655||S.draft.length<40){
   S.draft=[];S.nib={x:271,y:441};
   announce('РЕЙКА НЕ ДОСТЯГАЄ ПРАВОГО КРАЮ! НАМАЛЮЙ ДОВГУ ЛІНІЮ ВІД ЛАМПИ ДО X≥980.',5.5);
  }else{
   S.rail=S.draft.map(p=>({x:p.x,y:p.y}));
   S.draft=[];S.editor=false;S.railDistance=length;
   D.railSuccess=true;S.shake=.65;
   announce('РЕЙКА СТАЛА ТВЕРДОЮ! ТЕПЕР E БІЛЯ РУБИЛЬНИКА ЛІВОРУЧ СКИНЕ ЛАМПУ НА НЕЇ.',6);
  }
 }
 if(E&&!K.x){
  if(S.draft.length===0){S.editor=false;announce('КРЕСЛЕННЯ ЗАКРИТО. ЗНОВУ E НА ПУЛЬТІ, ЩОБ ПОВЕРНУТИСЯ.',3);}
 }
}
function advanceLamp(){
 if(!S.rail||S.rail.length<2)return;
 let stride=104*dt;
 while(stride>0&&S.lamp.i<S.rail.length-1){
  const a=S.rail[S.lamp.i],b=S.rail[S.lamp.i+1];
  const seg=Math.max(.01,d2(a.x,a.y,b.x,b.y));
  const remain=(1-S.lamp.t)*seg;
  if(stride>=remain){stride-=remain;S.lamp.i++;S.lamp.t=0;S.lamp.x=b.x;S.lamp.y=b.y;}
  else{S.lamp.t+=stride/seg;stride=0;S.lamp.x=a.x+(b.x-a.x)*S.lamp.t;S.lamp.y=a.y+(b.y-a.y)*S.lamp.t;}
 }
 const lx=S.lamp.x,ly=S.lamp.y;
 if(lx>NET.x1&&lx<NET.x2&&ly<NET.y+2){
  S.lamp.state='broken';S.burnNet=6;S.shake=.92;S.railWarn=1;
  announce('ЛАМПА ЗАЧЕПИЛА СУХІ СІТІ! ВОНИ ЗАГОРІЛИСЯ. E НА ПУЛЬТІ ПЕРЕМАЛЮЄ РЕЙКУ.',7);
 }else if(lx>GLASS.x1&&lx<GLASS.x2&&ly>GLASS.y){
  S.lamp.state='broken';S.shake=.92;S.railWarn=2;
  announce('РЕЙКА ЗАНАДТО НИЗЬКО НАД ТРІСНУТИМ СКЛОМ. ЛАМПА ЗЛАМАЛА ОПОРУ!',7);
 }else if(lx>=977&&ly>374&&ly<520){
  S.lamp.state='docked';S.topTimer=11;D.lampUpper=true;
  S.shake=.66;
  announce('ВЕЛИКА ЛАМПА ЗАРЯДИЛА ВЕРХНІЙ СЕНСОР! МАЄШ 11 СЕКУНД НА НИЖНІЙ X.',6);
 }else if(S.lamp.i>=S.rail.length-1){
  S.lamp.state='broken';S.railWarn=3;
  announce('ЛАМПА ДОЇХАЛА ДО КІНЦЯ, АЛЕ НЕ ДОСЯГЛА ВЕРХНЬОГО СЕНСОРА. ПЕРЕМАЛЮЙ РЕЙКУ.',6);
 }
}
S.burnNet=Math.max(0,S.burnNet-dt);
if(!S.dead&&!D.won){
 if(S.editor)recordNib();
 else{
  move(P,{bottom:818});
  let action=false;
  if(E&&d2(S.x,S.y-37,DESK.x,DESK.y)<94){
   action=true;resetRailEditor();
  }else if(E&&d2(S.x,S.y-34,TRIGGER.x,TRIGGER.y)<95){
   action=true;
   if(S.rail&&S.lamp.state==='hanging'){
    S.lamp.state='moving';S.lamp.i=0;S.lamp.t=0;
    S.lamp.x=S.rail[0].x;S.lamp.y=S.rail[0].y;
    announce('ЛАМПУ ВІДПУЩЕНО! РУХАЙСЯ ЗА ЇЇ СВІТЛОМ, ЩОБ СХОВАТИСЯ ВІД ПАВУКІВ.',6);
   }else if(!S.rail)announce('СПОЧАТКУ СТВОРИ ДОВГУ РЕЙКУ В КРЕСЛЯРСЬКОМУ РЕЖИМІ.',4);
   else announce('ЛАМПА ВЖЕ РУХАЄТЬСЯ. ДЛЯ НОВОЇ СПРОБИ — ЛІВИЙ КРЕСЛЯРСЬКИЙ ПУЛЬТ.',4);
  }else if(E&&d2(S.x,S.y-35,EXIT.x,EXIT.y)<92){
   action=true;
   if(D.lampUpper&&D.lampLower){D.won=true;S.shake=1;
    announce('ЛАМПА ОСВІТИЛА КОРИДОР. ДВА ДЖЕРЕЛА СВІТЛА СПРАЦЮВАЛИ ОДНОЧАСНО!',99);
   }else announce('ФІНАЛЬНА БРАМА ПОТРЕБУЄ СВІТЛА ЛАМПИ ВГОРІ Й ЖИВОГО ШЛЕЙФА ВНИЗУ.',5);
  }
  inkUpdate(!action);
  if(S.lamp.state==='moving'){
   if(S.brake>0)S.brake-=dt;
   else advanceLamp();
  }
  if(S.lamp.state==='docked'&&!D.lampLower){
   S.topTimer=Math.max(0,S.topTimer-dt);
   if(S.topTimer<=0){D.lampUpper=false;S.lamp.state='broken';
    announce('ЗАПІЗНО. ЛАМПА ПОГАСЛА. E БІЛЯ КРЕСЛЯРСЬКОГО ПУЛЬТА ЗАПУСТИТЬ НОВУ СПРОБУ.',5);
   }
  }
  if(K.x&&d2(S.x,S.y-43,LOWER.x,LOWER.y)<84){
   if(D.lampUpper&&S.topTimer>0){
    D.lampLower=true;S.shake=.9;
    announce('ДВА СЕНСОРИ СПРАЦЮВАЛИ ОДНОЧАСНО! БРАМА ВІДКРИТА.',6);
   }else if(S.lamp.state==='moving'&&S.brake<=0){
    S.brake=2.4;
    announce('ЗАРАНО! ТВОЄ СВІТЛО ЗАБЛОКУВАЛО КОЛІЩАТКА ЛАМПИ НА 2 СЕКУНДИ.',5);
   }
  }
  if(K.x&&S.x>NET.x1&&S.x<NET.x2&&S.y<582&&!S.burnNet){
   S.burnNet=4.5;announce('ТВІЙ ГАРЯЧИЙ ШЛЕЙФ ПІДПАЛИВ РИБАЛЬСЬКІ СІТІ!',4);
  }
  if(S.burnNet>0&&S.x>590&&S.x<730&&S.y<601)hurt('ПАЛАЮЧІ СІТІ');
  for(const spider of S.spiders)chaser(spider,allLight(area),{speed:47,notice:175,radius:39,name:'ТЕМНИЙ ПАВУК'});
 }
}
const visibleLight=allLight(area);
if(R.ok){
 background();const w=R.world,b=R.back;
 lights(visibleLight);for(const p of P)platform(w,p);
 // Low-res watercolor-like structural texture with silt clouds and old glass.
 for(let k=0;k<12;k++){
  const x=62+k*99,y=218+(k%4)*43;
  halo(b,x,y,51,0x57899c,.016);
 }
 for(let x=83;x<1268;x+=136){
  line(b,x,164,x-20,570,0x517586,.24,5);
  box(b,x-18,179,36,34,0x2f4e66,.45);
 }
 // Fragile fishing nets — cannot intersect them with the hot rolling lamp.
 for(let x=NET.x1;x<NET.x2;x+=17){
  line(w,x,277,x+35,424,0x9d9589,S.burnNet>.1?.62:.32,1.7);
  line(w,x,422,x+35,281,0xb5ab9c,S.burnNet>.1?.57:.29,1.7);
 }
 if(S.burnNet>0)halo(b,670,389,132,0xff6c7c,.16);
 box(w,GLASS.x1,549,GLASS.x2-GLASS.x1,18,0x495872,.64);
 for(let x=GLASS.x1+4;x<GLASS.x2;x+=15)line(w,x,549,x+30,579,0xa2b5c2,.30,2);
 // The user-authored rail is the actual mechanical path.
 function pathDisplay(arr,alpha){
  if(arr&&arr.length>1)for(let i=1;i<arr.length;i++){
   const a=arr[i-1],b=arr[i];
   line(R.glow,a.x,a.y,b.x,b.y,0xff8fba,alpha*.28,18);
   line(w,a.x,a.y,b.x,b.y,0xffa4c4,alpha*.88,7);
   line(w,a.x,a.y,b.x,b.y,0xffe0ea,alpha*.85,2);
  }
 }
 pathDisplay(S.rail,1);pathDisplay(S.draft,.7);
 if(S.editor){
  halo(R.glow,S.nib.x,S.nib.y,35,0xffb6dd,.26);
  circle(w,S.nib.x,S.nib.y,9,0xff9bc9);circle(w,S.nib.x,S.nib.y,4,0xffffff);
  line(w,S.nib.x-19,S.nib.y,S.nib.x+19,S.nib.y,0xffd5e8,.74,1);
  line(w,S.nib.x,S.nib.y-19,S.nib.x,S.nib.y+19,0xffd5e8,.74,1);
 }
 // Rail collision gauges: red area should be avoided on the drawn trajectory.
 if(S.editor){
  box(w,NET.x1,417,NET.x2-NET.x1,37,0x8c4959,.25);
  box(w,GLASS.x1,520,GLASS.x2-GLASS.x1,39,0x944a5d,.27);
  box(w,990,382,105,70,0x3e7769,.19);
 }
 // A lamp with strong light pool follows the drawn waypoints.
 const lamp=S.lamp;
 halo(b,lamp.x,lamp.y,159,0x9fffed,lamp.state==='broken'?.035:.18);
 line(w,272,126,lamp.x,lamp.y-25,0x9eb9c5,.43,3);
 box(w,lamp.x-42,lamp.y-33,84,46,0x788d9c,.96);
 circle(w,lamp.x,lamp.y+17,29,lamp.state==='broken'?0x6b4c59:0xbffff0,.97);
 circle(w,lamp.x,lamp.y+17,13,lamp.state==='broken'?0x59414a:0xffffff,.98);
 for(const p of [{x:DESK.x,active:S.editor},{x:TRIGGER.x,active:!!S.rail}]){
  box(w,p.x-31,554,63,63,0x345068,.95);
  circle(w,p.x,p.active?585:580,18,p.active?0xa8ffe6:0xa48eab,.85);
 }
 w.lineStyle(4,D.lampUpper?0xa7ffe3:0xd59ca9,.97);
 w.drawCircle(UPPER.x,UPPER.y,31);circle(w,UPPER.x,UPPER.y,10,D.lampUpper?0x9dffe6:0x8b5c72);
 w.lineStyle(4,D.lampLower?0x9effe3:0xe299ac,.97);
 w.drawCircle(LOWER.x,LOWER.y,28);circle(w,LOWER.x,LOWER.y,10,D.lampLower?0x95ffe0:0x995870);
 if(S.lamp.state==='docked'&&!D.lampLower){
  box(w,777,136,356,11,0x2b304d,.96);
  box(w,779,138,352*minmax(S.topTimer/11,0,1),7,0x94ffe5,.86);
 }
 for(const spider of S.spiders)enemyArt(spider);
 gate(EXIT.x,635,D.lampUpper&&D.lampLower);
 strokeArt();
}
playerArt(visibleLight);
gdjs.evtTools.camera.setCameraX(runtimeScene,640,'',0);
gdjs.evtTools.camera.setCameraY(runtimeScene,360,'',0);
let task='ЛІВИЙ ПУЛЬТ E → МАЛЮВАННЯ. ЗАТИСНИ X Й ВЕДИ ПЕРО WASD ПІД СІТЯМИ, НАД СКЛОМ, ПРАВОРУЧ.';
if(S.editor)task='КРЕСЛЕННЯ: ТРИМАЙ X + WASD; ЗАВЕДИ РЕЙКУ ПРАВОРУЧ ДО X≈1000; ВІДПУСТИ X.';
else if(S.rail&&S.lamp.state==='hanging')task='РЕЙКА ГОТОВА. E БІЛЯ ДРУГОГО ПУЛЬТА ЗЛІВА — ЗАПУСТИТИ ВАЖКУ ЛАМПУ.';
else if(S.lamp.state==='moving')task='ЛАМПА РУХАЄТЬСЯ ПО ТВОЄМУ МАЛЮНКУ. РУХАЙСЯ В ЇЇ СВІТЛІ. НИЖНІЙ СЕНСОР ПОКИ НЕ ЧІПАЙ.';
else if(S.lamp.state==='broken')task='ЛАМПА ВТРАТИЛА ШЛЯХ. E БІЛЯ ЛІВОГО ПУЛЬТА, ЩОБ ПЕРЕМАЛЮВАТИ РЕЙКУ.';
else if(D.lampUpper&&!D.lampLower)task='ВЕРХНІЙ СЕНСОР ГОРИТЬ! '+Math.ceil(S.topTimer)+' СЕК. ЗАТИСНИ X БІЛЯ НИЖНЬОГО СЕНСОРА ПРАВОРУЧ.';
else if(D.lampLower)task='ОБИДВА СЕНСОРИ ЗАРЯДЖЕНІ. ПРАВІ ДВЕРІ E → ФІНАЛ!';
hud('03','ОСТАННІЙ ПРОМІНЬ',task,visibleLight);
txt('W01','РЕЙКА: X + WASD');
txt('W02','E → КРЕСЛЕННЯ / ПУСК');
txt('W03',S.lamp.state==='moving'?'ЛАМПА ЇДЕ':D.lampUpper?'ВЕРХНІЙ ✓':'РЕЙКА ПІД ЛАМПОЮ');
txt('W04',D.lampLower?'НИЖНІЙ ✓':'НИЖНІЙ X');
txt('W05','ДВЕРІ → ФІНАЛ');
txt('WLamp','РЕАЛЬНА КРИВА КЕРУЄ ЛАМПОЮ, А ЇЇ СВІТЛО ПРИХОВУЄ СПАЛАХА');
})();
