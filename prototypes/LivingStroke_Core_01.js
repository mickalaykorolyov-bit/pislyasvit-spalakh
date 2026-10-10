// PISLYASVIT / ЖИВИЙ ШТРИХ / 0.1 — standalone light-physics platform puzzler.
// Each scene: shared core + scene rules + closure.
(function(){
'use strict';
const minmax=(n,a,b)=>Math.max(a,Math.min(n,b));
const d2=(x,y,a,b)=>Math.hypot(x-a,y-b);
const kd=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const K={
 l:kd('a')||kd('Left'),r:kd('d')||kd('Right'),u:kd('w')||kd('Up'),dn:kd('s')||kd('Down'),
 j:kd('Space'),x:kd('x')||kd('X'),e:kd('e')||kd('E'),g:kd('g')||kd('G'),
 f:kd('f')||kd('F'),q:kd('q')||kd('Q'),run:kd('Shift')||kd('LShift'),
 reset:kd('r')||kd('R'),journal:kd('Tab')
};
const dt=minmax(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const GAME=runtimeScene.getGame();
function newWorld(){return {step:1,bridgeLesson:false,fenceLesson:false,
 towerTop:false,towerGravity:false,anvilDropped:false,shatterLesson:false,
 hiveClean:false,hiveToken:false,finalBridge:false,finalFence:false,finalHit:false,
 won:false,deaths:0,clock:0,spawn:null,enterLock:false,rememberStroke:false};}
if(!GAME.__livingInk01)GAME.__livingInk01=newWorld();
const D=GAME.__livingInk01;D.clock+=dt;
if(!runtimeScene.__livingInkLocal)runtimeScene.__livingInkLocal={
 first:true,x:118,y:635,vx:0,vy:0,ground:true,face:1,grav:-1,health:3,iframes:1.5,
 elapsed:0,coyote:0,jumpWait:0,jumpWas:false,
 eWas:false,gWas:false,fWas:false,qWas:false,rWas:false,xWas:false,
 inkStart:null,inkLength:0,inkTrail:[],drawAcc:0,strokes:[],carryStroke:null,
 pieces:[],carryPiece:null,shot:null,bright:.18,
 strokeCount:0,projectileCount:0,dead:false,deadTime:0,checkpoint:{x:120,y:635},
 msg:'',msgTime:0,shake:0,alert:0,enemies:[],flies:0,fleaTimer:0,
 camY:360,phase:0,lampTimers:[],fenceTime:0,serial:1
};
const S=runtimeScene.__livingInkLocal;S.elapsed+=dt;S.iframes=Math.max(0,S.iframes-dt);
S.msgTime=Math.max(0,S.msgTime-dt);S.shake=Math.max(0,S.shake-dt*2.4);
const E=K.e&&!S.eWas&&!D.enterLock,G=K.g&&!S.gWas,F=K.f&&!S.fWas,Q=K.q&&!S.qWas;
const XSTART=K.x&&!S.xWas,XEND=!K.x&&S.xWas,RESET=K.reset&&!S.rWas;
S.eWas=K.e;S.gWas=K.g;S.fWas=K.f;S.qWas=K.q;S.xWas=K.x;S.rWas=K.reset;
if(!K.e)D.enterLock=false;
function announce(str,seconds=3.8){S.msg=str;S.msgTime=seconds;}
function obj(n){return runtimeScene.getObjects(n)[0];}
function txt(n,s){const o=obj(n);if(o&&o.setString)o.setString(s);}
function spawn(fallback){
 if(!S.first)return;
 S.first=false;
 const p=D.spawn||fallback;D.spawn=null;S.x=p.x;S.y=p.y;
 S.checkpoint={x:S.x,y:S.y};S.iframes=1.8;
}
function doorway(room,x,y){
 if(D.enterLock)return;
 D.enterLock=true;D.spawn={x,y};
 gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,
 ['','R01_StrokeHarbor','R02_QuietFence','R03_HangingSpine',
  'R04_GlassBreak','R05_LuminousFleas','R06_OneLastStroke'][room],false);
}
function checkpoint(x,y){S.checkpoint={x,y};}
function hurt(label){
 if(S.dead||S.iframes>0||D.won)return;
 S.health--;S.iframes=1.12;S.shake=.8;
 if(S.health<=0){
  S.dead=true;S.deadTime=.75;D.deaths++;
  announce('СПАЛАХ ПОГАС: '+label+' • ПРОГРЕС ГОЛОВОЛОМОК ЗБЕРЕЖЕНИЙ',3);
 }else announce('УДАР: '+label+' • ЗАЛИШИЛОСЯ '+S.health+'/3',2.3);
}
function respawn(){
 S.dead=false;S.health=3;S.iframes=1.8;
 S.x=S.checkpoint.x;S.y=S.checkpoint.y;
 S.vx=0;S.vy=0;S.ground=true;
 S.carryStroke=null;S.carryPiece=null;S.shot=null;
 S.flies=0;S.fleaTimer=0;S.alert=0;
}
if(S.dead){S.deadTime-=dt;if(S.deadTime<=0)respawn();}
if(RESET){if(K.run){GAME.__livingInk01=newWorld();doorway(1,120,635);}else respawn();}
function lit(x,y,areas){return areas.some(p=>d2(x,y,p.x,p.y)<p.r);}
function strokeLights(){
 const arr=[];
 for(const s of S.strokes)if(s.state==='solid'&&!S.carryStroke||S.carryStroke===s){
  const rad=s.len*.5,cs=Math.cos(s.angle),sn=Math.sin(s.angle);
  for(let m=-rad;m<=rad;m+=58)arr.push({x:s.cx+m*cs,y:s.cy+m*sn-29,r:110,c:0xff83b9});
 }
 for(const p of S.pieces)if(!p.used)arr.push({x:p.x,y:p.y,r:43,c:0xff9dbb});
 if(S.shot)arr.push({x:S.shot.x,y:S.shot.y,r:54,c:0xffaa9b});
 if(K.x)arr.push({x:S.x,y:S.y-43,r:90,c:0xff849d});
 return arr;
}
function allLight(areas){return [...areas,...strokeLights()];}
function strokeBridge(x,oldY,newY){
 let landed=null;
 for(const t of S.strokes){
  if(t.state!=='solid'||S.carryStroke===t)continue;
  const dx=Math.cos(t.angle),dy=Math.sin(t.angle);
  if(Math.abs(dx)<.35)continue;
  const delta=(x-t.cx)/dx;
  if(Math.abs(delta)>t.len/2+5)continue;
  const y=t.cy+delta*dy;
  if(oldY<=y+8&&newY>=y&&S.vy>=0){if(!landed||y<landed)landed=y;}
 }
 return landed;
}
function move(platforms,options={}){
 if(S.dead)return;
 const dir=Number(K.r)-Number(K.l);if(dir)S.face=dir;
 const slow=options.slow&&options.slow(S.x,S.y);
 const ice=options.ice&&options.ice(S.x,S.y);
 const m=K.dn?72:K.run?312:211;
 const speed=m*minmax(1-S.flies*.029,.27,1)*(slow?.53:1)*(S.carryStroke?.75:1);
 const dest=dir*speed,acc=dir?(ice?350:1400):(ice?100:2150);
 S.vx+=minmax(dest-S.vx,-acc*dt,acc*dt);
 if(S.ground)S.coyote=.14;else S.coyote=Math.max(0,S.coyote-dt);
 if(K.j&&!S.jumpWas)S.jumpWait=.12;else S.jumpWait=Math.max(0,S.jumpWait-dt);
 if(S.jumpWait>0&&(S.ground||S.coyote>0)&&!K.dn&&!S.carryStroke){
  S.vy=S.grav*570;S.ground=false;S.coyote=0;S.jumpWait=0;S.shake=.12;
 }
 if(S.jumpWas&&!K.j&&(S.grav===-1?S.vy< -180:S.vy>180))S.vy*=.58;
 S.jumpWas=K.j;
 if(!S.ground)S.vy=minmax(S.vy-S.grav*1400*dt,-900,900);
 const oldY=S.y;S.x=minmax(S.x+S.vx*dt,16,1265);S.y+=S.vy*dt;
 let on=false;
 if(S.grav===-1){
  const hits=[];
  for(const p of platforms)if(S.vy>=0&&oldY<=p.y+9&&S.y>=p.y&&S.x+13>p.x&&S.x-13<p.x+p.w)hits.push(p.y);
  const y=strokeBridge(S.x,oldY,S.y);if(y!==null)hits.push(y);
  if(hits.length){S.y=Math.min(...hits);S.vy=0;on=true;}
 }else{
  for(const p of platforms)if(S.vy<=0&&oldY>=p.y+p.h-9&&S.y<=p.y+p.h&&S.x+13>p.x&&S.x-13<p.x+p.w){
   S.y=p.y+p.h;S.vy=0;on=true;break;
  }
 }
 S.ground=on;
 const target=K.x?1:.18+Math.min(1,Math.abs(S.vx)/330)*.65;
 S.bright+=(target-S.bright)*minmax(dt*9,0,1);
 if(S.y>(options.bottom||2900)||S.y<(options.top||-110))hurt('ПАДІННЯ');
}
function inkUpdate(allowE=true){
 if(XSTART&&!S.dead){S.inkStart={x:S.x,y:S.y};S.inkLength=0;S.inkTrail=[];}
 if(K.x&&S.inkStart&&!S.dead){
  S.drawAcc+=dt;
  const p={x:S.x,y:S.y-43,age:0};
  if(S.drawAcc>.025){S.inkTrail.push(p);S.drawAcc=0;}
  S.inkLength=d2(S.x,S.y,S.inkStart.x,S.inkStart.y);
 }
 if(XEND&&S.inkStart){
  const v=Math.hypot(S.x-S.inkStart.x,S.y-S.inkStart.y);
  if(v>=75){
   const st={id:S.serial++,cx:(S.x+S.inkStart.x)/2,cy:(S.y+S.inkStart.y)/2,
    angle:Math.atan2(S.y-S.inkStart.y,S.x-S.inkStart.x),
    len:minmax(v,94,370),state:'solid'};
   S.strokes.push(st);S.strokeCount++;
   if(S.strokes.length>5){
    const old=S.strokes.find(x=>x!==S.carryStroke);
    if(old)S.strokes.splice(S.strokes.indexOf(old),1);
   }
   D.rememberStroke=true;
   announce('ШТРИХ МАТЕРІАЛІЗУВАВСЯ! E — ВЗЯТИ / ПОКЛАСТИ, Q — ПОВЕРНУТИ, G — РОЗБИТИ.',4.2);
  }else if(v>12){announce('ШТРИХ ЗАНАДТО КОРОТКИЙ. ТЯГНИ X БІЛЬШЕ НІЖ НА 75 ПІКСЕЛІВ.',3);}
  S.inkStart=null;S.inkTrail=[];
 }
 if(S.carryStroke){
  const st=S.carryStroke;
  st.cx=S.x+S.face*92;st.cy=S.y-(Math.abs(Math.sin(st.angle))>.6?75:0);
  if(Q){st.angle=(Math.abs(Math.cos(st.angle))>.67)?Math.PI/2:0;
   announce('ШТРИХ ПОВЕРНУТО. ВІДПУСТИ E, ЩОБ ПОСТАВИТИ ЙОГО НА МІСЦЕ.',2.6);}
 }
 const nearest=S.strokes.filter(st=>st.state==='solid').map(st=>({st,d:d2(S.x,S.y-35,st.cx,st.cy-25)})).sort((a,b)=>a.d-b.d)[0];
 if(allowE&&E){
  if(S.carryStroke){S.carryStroke=null;announce('ШТРИХ ЗАКРІПЛЕНО У ПРОСТОРІ.',2.5);}
  else if(!S.carryPiece){
   const p=S.pieces.find(p=>!p.used&&d2(S.x,S.y-35,p.x,p.y)<83);
   if(p){S.carryPiece=p;p.held=true;announce('СВІТЛОВИЙ УЛАМОК У РУКАХ. F — КИНУТИ.',3);}
   else if(nearest&&nearest.d<122){
    S.carryStroke=nearest.st;
    announce('ТИ ПІДНЯВ ШТРИХ. НЕСИ ЙОГО, Q ПОВЕРТАЄ, E ВІДПУСКАЄ.',3.2);
   }
  }
 }
 if(G&&nearest&&nearest.d<136&&!S.carryStroke){
  const st=nearest.st;S.strokes.splice(S.strokes.indexOf(st),1);
  for(let i=0;i<3;i++)S.pieces.push({x:st.cx-26+i*25,y:st.cy-38-i*2,used:false,held:false});
  S.shake=.66;
  announce('ШТРИХ РОЗСИПАВСЯ НА ТРИ ЖИВІ УЛАМКИ. ЗБЕРИ E ТА КИНЬ F!',4.2);
 }
 if(S.carryPiece){S.carryPiece.x=S.x+S.face*20;S.carryPiece.y=S.y-43;}
 if(F&&S.carryPiece){
  const p=S.carryPiece;S.carryPiece=null;p.held=false;p.used=true;
  S.shot={x:S.x+S.face*28,y:S.y-43,vx:S.face*530,vy:-135,time:2.0};
  S.projectileCount++;
 }
 if(S.shot){
  const p=S.shot;
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=360*dt;p.time-=dt;
  if(p.time<=0||p.y>2750)S.shot=null;
 }
 for(const t of S.inkTrail)t.age+=dt;
 S.inkTrail=S.inkTrail.filter(t=>t.age<1.4).slice(-160);
}
function hitShot(x,y,r=65){
 if(S.shot&&d2(S.shot.x,S.shot.y,x,y)<r){
  S.shot=null;S.shake=.5;return true;
 }return false;
}
function chaser(enemy,pools,options={}){
 if(S.dead||D.won)return;
 if(!enemy.first){enemy.first=true;enemy.lastX=enemy.x;enemy.lastY=enemy.y;enemy.alert=0;}
 const hidden=lit(S.x,S.y-46,pools);
 const ox=enemy.x,oy=enemy.y;
 if(!hidden){enemy.lastX=S.x;enemy.lastY=S.y-40;enemy.alert=minmax(enemy.alert+dt*1.3,0,1);}
 else{enemy.alert=Math.max(0,enemy.alert-dt*.8);
  if(K.x||S.strokes.length)enemy.lastX=S.x+S.face*54;
 }
 const target=hidden&&enemy.alert<=0?enemy.x+(options.patrolDirection||1)*24:enemy.lastX;
 const speed=options.speed||56;
 let vx=minmax(target-enemy.x,-speed*dt,speed*dt);
 for(const st of S.strokes){
  if(st.state!=='solid'||S.carryStroke===st)continue;
  if(Math.abs(Math.cos(st.angle))<.41&&Math.abs(st.cx-enemy.x)<54){
   if((vx>0&&st.cx>enemy.x)||(vx<0&&st.cx<enemy.x))vx=0;
  }
 }
 enemy.x=minmax(enemy.x+vx,26,1255);
 enemy.y+=(Math.sin(S.elapsed*1.1+(options.phase||0))*8+enemy.baseY-enemy.y)*minmax(dt*1.8,0,1);
 const touching=d2(S.x,S.y-42,enemy.x,enemy.y)<(options.radius||42);
 // Being inside any light—including their own X emission—makes Spalakh untargetable.
 if(touching&&!hidden&&enemy.alert>.1)hurt(options.name||'МОНСТР');
 if(!hidden&&d2(S.x,S.y-42,enemy.x,enemy.y)<(options.notice||178)){
  enemy.alert=minmax(enemy.alert+dt*.84,0,1);
 }
}
function fleas(){
 if(S.dead)return;
 S.fleaTimer+=dt*(K.x?1.85:1);
 if(S.fleaTimer>(K.x?.4:.8)){S.fleaTimer=0;S.flies++;}
 if(S.flies===11)announce('БЛОХИ СПОВІЛЬНЮЮТЬ СПАЛАХА. ШУКАЙ СВІТЛОВУ ОЧИСТКУ!',3.6);
 if(S.flies>=27)hurt('ПІКСЕЛЬНІ БЛОХИ ЗАГАСИЛИ ІСКРУ');
}
let RENDER=runtimeScene.__livingInkFX;
if(!RENDER){
 RENDER=runtimeScene.__livingInkFX={ok:false};
 try{
 const renderer=runtimeScene.getLayer('').getRenderer();
 if(typeof PIXI==='undefined'||!PIXI.Graphics||!renderer||!renderer.addRendererObject)throw Error('No PIXI renderer');
 for(const [name,z] of [['far',-40],['mid',-33],['back',-25],['world',7],['glow',17],['front',27]]){
  RENDER[name]=new PIXI.Graphics();renderer.addRendererObject(RENDER[name],z);
 }
 RENDER.ok=true;
 }catch(e){RENDER.error=String(e);}
}
const R=RENDER;
function box(g,x,y,w,h,col,a=1){
 g.lineStyle(0);g.beginFill(col,a);g.drawRoundedRect(x,y,w,h,Math.min(9,h/3));g.endFill();
}
function circle(g,x,y,r,col,a=1){g.lineStyle(0);g.beginFill(col,a);g.drawCircle(x,y,r);g.endFill();}
function line(g,x,y,tx,ty,c=0xa3c5ca,a=.64,size=2){
 g.lineStyle(size,c,a);g.moveTo(x,y);g.lineTo(tx,ty);
}
function halo(g,x,y,r,col,a){
 for(let i=5;i>=1;i--)circle(g,x,y,r*(.36+i*.13),col,a*(6-i)/20);
}
function background(h=720,cam=360){
 if(!R.ok)return;
 for(const layer of ['far','mid','back','world','glow','front'])R[layer].clear();
 const shift=cam-360;R.far.y=shift*.82;R.mid.y=shift*.53;R.front.y=shift*.17;
 box(R.far,0,0,1280,h,0x081321);
 for(let x=30;x<1260;x+=75)line(R.far,x,0,x,h,0x355e70,.14,1);
 for(let y=27;y<h;y+=74)line(R.far,0,y,1280,y,0x34586b,.12,1);
 for(let x=65;x<1250;x+=220)box(R.mid,x,34,43,h-70,0x163447,.38);
 for(let y=174;y<h;y+=274)line(R.back,14,y,1260,y,0x709aad,.19,4);
}
function platform(g,p){
 box(g,p.x,p.y,p.w,p.h,0x2c4558);
 box(g,p.x+2,p.y,p.w-4,4,0x9ed1d5,.71);
 for(let x=p.x+12;x<p.x+p.w-9;x+=32)line(g,x,p.y+9,x-8,p.y+Math.min(18,p.h),0x85a6b2,.22,1);
}
function lights(areas){
 if(!R.ok)return;
 for(const a of areas)halo(R.back,a.x,a.y,a.r,a.c||0x92f8e1,a.a||.16);
}
function gate(x,y,open=false,color=0x9df9e0){
 if(!R.ok)return;const w=R.world;
 box(w,x-41,y-86,83,86,open?0x245e50:0x42364f,.95);
 w.lineStyle(3,open?color:0xe1859d,.98);w.drawRoundedRect(x-41,y-86,83,86,7);
 for(let i=0;i<3;i++)circle(w,x,y-65+i*25,6,open?color:0xe78aa1,.85);
}
function strokeArt(){
 if(!R.ok)return;const w=R.world,g=R.glow;
 for(const st of S.strokes){
  if(st.state!=='solid')continue;
  const dx=Math.cos(st.angle)*st.len/2,dy=Math.sin(st.angle)*st.len/2;
  const x1=st.cx-dx,y1=st.cy-dy,x2=st.cx+dx,y2=st.cy+dy;
  line(g,x1,y1,x2,y2,0xff6f9e,.3,20);
  line(w,x1,y1,x2,y2,0xff789d,.9,13);
  line(w,x1,y1,x2,y2,0xffd4e4,.92,3);
  for(const x of [-.38,0,.38])circle(w,st.cx+dx*2*x,st.cy+dy*2*x,4,0xffe3ec,.86);
 }
 for(const p of S.pieces)if(!p.used){
  halo(g,p.x,p.y,26,0xff789e,.18);circle(w,p.x,p.y,9,0xff819d,.93);
 }
 if(S.shot){circle(g,S.shot.x,S.shot.y,14,0xff85aa,.53);circle(w,S.shot.x,S.shot.y,7,0xffd1dd);}
 for(const p of S.inkTrail)circle(g,p.x,p.y,5,0xff819d,(1-p.age/1.4)*.7);
 if(K.x&&S.inkStart){
  line(g,S.inkStart.x,S.inkStart.y-42,S.x,S.y-42,0xff678e,.24,17);
  line(w,S.inkStart.x,S.inkStart.y-42,S.x,S.y-42,0xffa1c0,.72,4);
 }
 if(S.carryStroke)halo(g,S.carryStroke.cx,S.carryStroke.cy,90,0xffb5ca,.10);
}
function enemyArt(en){
 if(!R.ok||!en)return;
 const w=R.world,g=R.glow;
 halo(g,en.x,en.y,56,0xc96d9b,.12);circle(w,en.x,en.y,20,0x57425f);
 for(let side of [-1,1])for(let i=0;i<4;i++)
  line(w,en.x+side*11,en.y+i*5-11,en.x+side*(27+i*5),en.y-20+i*11,0xa67391,.87,3);
 circle(w,en.x-7,en.y-5,4,0xff6e94);circle(w,en.x+8,en.y-5,4,0xff708e);
}
function playerArt(areas,cy=360){
 if(R.ok){
 const g=R.glow;
 halo(g,S.x,S.y-45,K.x?85:43,0xff668f,K.x?.17:.08);
 halo(g,S.x,S.y-19,31,0xff95bd,.09);
 if(S.shake){R.front.lineStyle(4,0xff849a,S.shake*.25);R.front.drawRoundedRect(7,7,1266,707,10);}
 if(S.flies>0)for(let i=0;i<Math.min(S.flies,32);i++){
  const a=i*2.399963+S.elapsed*.17,rr=23+Math.sqrt(i)*7;
  circle(g,S.x+rr*Math.cos(a),S.y-44+.65*rr*Math.sin(a),2.7,0xe4beff,.81);
 }
 }
 const player=obj('Player');if(player){
  const vel=Math.abs(S.vx);
  const anim=S.dead?'Fall':!S.ground?(S.grav===-1?(S.vy<0?'Jump':'Fall'):(S.vy>0?'Jump':'Fall')):
  K.dn?'Crouch':vel>160?'Run':vel>18?'Slow':'Idle';
  if(player.getAnimationName&&player.getAnimationName()!==anim&&player.setAnimationName)player.setAnimationName(anim);
  if(player.setAnimationSpeedScale)player.setAnimationSpeedScale(anim==='Run'?minmax(vel/215,.7,1.6):1);
  const sc=.55;if(player.setScale)player.setScale(sc);
  player.setPosition(S.x-192*sc,S.y-242*sc);
  if(player.flipX)player.flipX(S.face<0);
  const hidden=lit(S.x,S.y-45,areas);
  if(player.setOpacity)player.setOpacity(S.dead?0:S.iframes>0&&Math.sin(S.elapsed*21)>0?135:hidden?70:minmax(150+S.bright*105,150,255));
 }
}
function hud(room,name,goal,areas,camY=360){
 const offset=camY-360;
 const placings={HUDTitle:[18,11],HUDStatus:[18,46],HUDTask:[18,84],HUDMessage:[295,121],
 HUDHint:[14,690],HUDWin:[312,316]};
 for(const [k,v] of Object.entries(placings)){
  const o=obj(k);if(o&&o.setPosition)o.setPosition(v[0],v[1]+offset);
 }
 txt('HUDTitle','ПІСЛЯСВІТ / ЖИВИЙ ШТРИХ    '+room+' · '+name);
 txt('HUDStatus','ЖИТТЯ '+S.health+'/3   '+(lit(S.x,S.y-45,areas)?'У СВІТЛІ НЕВИДИМИЙ':'У ТЕМРЯВІ ПОМІТНИЙ')+
 '   ШТРИХИ '+S.strokes.length+'   УЛАМКИ '+S.pieces.filter(p=>!p.used).length+'   СМЕРТІ '+D.deaths);
 txt('HUDTask',goal);
 txt('HUDHint','A/D РУХ · SPACE СТРИБОК · X МАЛЮВАТИ · E ПЕРЕНЕСТИ · Q ПОВЕРНУТИ · G РОЗБИТИ · F КИНУТИ · R ТОЧКА');
 txt('HUDMessage',S.msgTime>0?S.msg:'');
 if(K.journal)txt('HUDMessage',
 'ПРОГРЕС: МІСТ '+(D.bridgeLesson?'✓':'○')+' ПАРКАН '+(D.fenceLesson?'✓':'○')+
 ' ШАХТА '+(D.towerTop?'✓':'○')+' УЛАМКИ '+(D.shatterLesson?'✓':'○')+
 ' БЛОХИ '+(D.hiveToken?'✓':'○'));
 txt('HUDWin',D.won?'СВІТЛО СТАЛО ТВОЇМ ІНСТРУМЕНТОМ!':'');
 const o=obj('HUDWin');if(o&&o.setOpacity)o.setOpacity(D.won?255:0);
}
