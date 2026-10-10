// ПІСЛЯСВІТ • СЛІДИ СВІТЛА • v0.1 — completely independent game core.
// Each scene inserts this same core, then its own room, then closes the IIFE.
(function(){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const distance=(x,y,a,b)=>Math.hypot(x-a,y-b);
const pressed=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const K={left:pressed('a')||pressed('Left'),right:pressed('d')||pressed('Right'),
 up:pressed('w')||pressed('Up'),down:pressed('s')||pressed('Down'),
 jump:pressed('Space'),use:pressed('e')||pressed('E'),ink:pressed('x')||pressed('X'),
 grab:pressed('g')||pressed('G'),throw:pressed('f')||pressed('F'),
 run:pressed('Shift')||pressed('LShift'),reset:pressed('r')||pressed('R'),
 journal:pressed('Tab')};
const dt=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const game=runtimeScene.getGame();
function freshGame(){return{
 glyph:{circle:false,triangle:false,zigzag:false},
 originSensor:false,scrollScorched:0,waterShield:false,
 shaftSensor:false,shaftTop:false,gravityActivated:false,
 monsterBroken:false,shardTarget:false,
 fleaNestBroken:false,
 finalSensor:false,finalTarget:false,won:false,
 deaths:0,time:0,
 spawn:null,transitionLock:false,progress:'START'
};}
if(!game.__afterimage01)game.__afterimage01=freshGame();
const D=game.__afterimage01;D.time+=dt;D.scrollScorched=Math.max(0,D.scrollScorched-dt);
const cam={x:640,y:360};
if(!runtimeScene.__afterimageLocal)runtimeScene.__afterimageLocal={
 first:true,x:120,y:635,vx:0,vy:0,ground:true,face:1,
 gravity:-1,health:3,blink:0,invuln:1.4,
 elapsed:0,coyote:0,jumpHeld:false,jumpBuf:0,
 eHeld:false,fHeld:false,xHeld:false,rHeld:false,gHeld:false,
 trail:[],trailAccum:0,brightness:.13,
 trace:null,traceReached:0,traceError:0,
 shards:[],carryShard:false,projectile:null,
 fly:{x:1170,y:590,phase:0},fleas:0,fleaTick:0,
 lampTimers:[],check:{x:130,y:635},
 msg:'',msgTime:0,dead:false,deadClock:0,shake:0,artReady:false,
 audio:'',visitTime:0
};
const S=runtimeScene.__afterimageLocal;S.elapsed+=dt;S.visitTime+=dt;
S.invuln=Math.max(0,S.invuln-dt);S.blink=Math.max(0,S.blink-dt);S.shake=Math.max(0,S.shake-dt*1.9);
S.msgTime=Math.max(0,S.msgTime-dt);S.traceError=Math.max(0,S.traceError-dt*2);
const E=K.use&&!S.eHeld&&!D.transitionLock;
const F=K.throw&&!S.fHeld;
const G=K.grab&&!S.gHeld;
const XON=K.ink&&!S.xHeld;
const XOFF=!K.ink&&S.xHeld;
const R=K.reset&&!S.rHeld;
S.eHeld=K.use;S.fHeld=K.throw;S.gHeld=K.grab;S.xHeld=K.ink;S.rHeld=K.reset;
if(!K.use)D.transitionLock=false;
function say(message,duration=3.6){S.msg=message;S.msgTime=duration;}
const item=name=>runtimeScene.getObjects(name)[0];
function label(name,text){const o=item(name);if(o&&o.setString)o.setString(text);}
function spawn(point){
 if(!S.first)return;S.first=false;
 const p=D.spawn||point;D.spawn=null;
 S.x=p.x;S.y=p.y;S.ground=true;S.check={x:S.x,y:S.y};S.invuln=1.6;
}
function visit(room,pos){
 if(D.transitionLock)return;D.transitionLock=true;D.spawn=pos;
 gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,
 ['','R01_InkAtrium','R02_GravityShaft','R03_FlyAndGolem','R04_FleaNursery','R05_LastArchive'][room],false);
}
function checkpoint(x,y){S.check={x,y};}
function kill(why){
 if(S.dead||S.invuln>0||D.won)return;
 S.dead=true;S.deadClock=.78;D.deaths++;S.shake=.85;S.health=0;
 say('СПАЛАХ ЗГАС: '+why+' • РУНИ ЗБЕРЕЖЕНІ',3.2);
}
function hurt(why,amount=1){
 if(S.dead||S.invuln>0||D.won)return;
 S.health-=amount;S.invuln=1.05;S.shake=.65;
 if(S.health<=0){S.invuln=0;kill(why);}else say('УДАР: '+why+' • ЗАЛИШИЛОСЯ '+S.health+'/3',2.2);
}
function resurrect(){
 S.dead=false;S.health=3;S.invuln=1.55;S.x=S.check.x;S.y=S.check.y;
 S.vx=0;S.vy=0;S.ground=true;S.blink=0;S.fleas=0;S.fleaTick=0;
 S.trace=null;S.trail=[];S.carryShard=false;
 D.transitionLock=false;
}
if(S.dead){S.deadClock-=dt;if(S.deadClock<=0)resurrect();}
if(R){
 if(K.run){game.__afterimage01=freshGame();visit(1,{x:125,y:635});}
 else {S.dead=true;S.deadClock=0;resurrect();}
}
const litAt=(x,y,pools)=>pools.some(p=>distance(x,y,p.x,p.y)<=p.r);
const sneaking=pools=>litAt(S.x,S.y-44,pools);
function particles(){
 for(const p of S.trail)p.age+=dt;
 S.trail=S.trail.filter(p=>p.age<(p.long?4.2:.74)).slice(-240);
}
function putTrail(force=false){
 S.trailAccum+=dt;
 if((force||K.ink||Math.abs(S.vx)>75)&&S.trailAccum>.027){
  S.trail.push({x:S.x-S.face*16,y:S.y-43,age:0,long:!!K.ink,hot:!!K.ink});
  S.trailAccum=0;
 }
}
function hotNear(x,y,r=70){
 return S.trail.some(p=>p.hot&&p.age<2.1&&distance(p.x,p.y,x,y)<r);
}
function animate(){
 const hero=item('Player');if(!hero)return;
 const v=Math.abs(S.vx),anim=S.dead?'Fall':S.trace?'Slow':!S.ground?(S.vy<0?'Jump':'Fall'):
 (K.down?'Crouch':v>160?'Run':v>20?'Slow':'Idle');
 if(hero.getAnimationName&&hero.getAnimationName()!==anim&&hero.setAnimationName)hero.setAnimationName(anim);
 if(hero.setAnimationSpeedScale)hero.setAnimationSpeedScale(anim==='Run'?clamp(v/225,.8,1.35):1);
 const sc=.55;if(hero.setScale)hero.setScale(sc);
 hero.setPosition(S.x-192*sc,S.y-242*sc);
 if(hero.flipX)hero.flipX(S.face<0);
 if(hero.setOpacity)hero.setOpacity(S.dead?0:S.invuln>0&&Math.sin(S.elapsed*22)>0?147:clamp(162+S.brightness*91,162,255));
}
function walk(platforms,options={}){
 if(S.dead)return;
 if(S.trace){traceTick();return;}
 const d=Number(K.right)-Number(K.left);if(d)S.face=d;
 const slowed=options.slow&&options.slow(S.x,S.y);
 const fleaFactor=clamp(1-S.fleas*.029,.27,1);
 const max=(K.down?72:K.run?297:205)*fleaFactor*(slowed?.52:1);
 const target=d*max;
 let acc=(d?1380:2270);if(options.ice&&options.ice(S.x,S.y))acc=d?445:120;
 S.vx+=clamp(target-S.vx,-acc*dt,acc*dt);
 if(S.ground)S.coyote=.135;else S.coyote=Math.max(0,S.coyote-dt);
 if(K.jump&&!S.jumpHeld)S.jumpBuf=.13;
 else S.jumpBuf=Math.max(0,S.jumpBuf-dt);
 if(S.jumpBuf>0&&(S.ground||S.coyote>0)&&!K.down){
  S.vy=(S.gravity===1?1:-1)*-550;S.jumpBuf=0;S.coyote=0;S.ground=false;
 }
 if(S.jumpHeld&&!K.jump&&(S.gravity===-1?S.vy< -170:S.vy>170))S.vy*=.6;
 S.jumpHeld=K.jump;
 if(!S.ground)S.vy=clamp(S.vy+1380*dt*(-S.gravity),-790,790);
 const oldY=S.y;S.x=clamp(S.x+S.vx*dt,19,1260);S.y+=S.vy*dt;
 let landed=false;
 if(S.gravity===-1){
  for(const p of platforms)if(S.vy>=0&&oldY<=p.y+8&&S.y>=p.y&&S.x+13>p.x&&S.x-13<p.x+p.w){
   S.y=p.y;S.vy=0;landed=true;break;
  }
 }else{
  for(const p of platforms)if(S.vy<=0&&oldY>=p.y+p.h-8&&S.y<=p.y+p.h&&S.x+13>p.x&&S.x-13<p.x+p.w){
   S.y=p.y+p.h;S.vy=0;landed=true;break;
  }
 }
 S.ground=landed;
 S.brightness+=((K.ink?1:.14+Math.min(1,Math.abs(S.vx)/302)*.59)-S.brightness)*clamp(dt*9,0,1);
 putTrail();
 if(S.y>(options.bottom||2800)||S.y<(options.top||-100))kill('ПАДІННЯ ЗА МЕЖІ КІМНАТИ');
}
function makeGlyph(kind,cx,cy){
 if(kind==='circle')return Array.from({length:9},(_,i)=>({x:cx+95*Math.cos(-Math.PI/2+i*Math.PI/4),y:cy+95*Math.sin(-Math.PI/2+i*Math.PI/4)}));
 if(kind==='triangle')return [
  {x:cx,y:cy-107},{x:cx+117,y:cy+95},{x:cx-117,y:cy+95},{x:cx,y:cy-107}];
 return Array.from({length:6},(_,i)=>({x:cx-255+i*101,y:cy+(i%2===0?-93:93)}));
}
function startGlyph(kind,cx,cy){
 if(D.glyph[kind]){say('ЦЕЙ ЗНАК УЖЕ НАМАЛЬОВАНО!',2.6);return;}
 const points=makeGlyph(kind,cx,cy);
 S.trace={kind,cx,cy,points,index:1,active:false,length:0,releaseOK:false};
 S.x=points[0].x;S.y=points[0].y+43;S.vx=0;S.vy=0;S.ground=false;S.trail=[];
 say('ЗАТИСНИ X І ВЕДИ СПАЛАХА WASD ПО СВІТЛОВИХ МАРКЕРАХ ① → '+(points.length)+'!',5.1);
}
function traceTick(){
 const t=S.trace;if(!t)return;
 // Float precisely around the luminous stencil. Avatar feet follow glyph cursor (body center at y-43).
 const dx=Number(K.right)-Number(K.left),dy=Number(K.down)-Number(K.up);
 const magnitude=Math.hypot(dx,dy)||1;
 const speed=218*clamp(1-S.fleas*.022,.46,1);
 S.vx=dx/magnitude*speed;S.vy=dy/magnitude*speed;
 if(!dx)S.vx=0;if(!dy)S.vy=0;
 S.x=clamp(S.x+S.vx*dt,t.cx-310,t.cx+310);
 S.y=clamp(S.y+S.vy*dt,t.cy-180+43,t.cy+180+43);
 S.face=dx||S.face;
 S.brightness=K.ink?1:.3;
 if(K.ink){
  if(XON)t.active=true;
  if(!t.active)t.active=true;
  t.length+=Math.hypot(S.vx,S.vy)*dt;
  putTrail(true);
  if(t.index<t.points.length&&distance(S.x,S.y-43,t.points[t.index].x,t.points[t.index].y)<37){
   t.index++;S.shake=.12;
  }
  if(t.index===t.points.length&&t.length>170){
   D.glyph[t.kind]=true;
   S.trace=null;S.trail=S.trail.map(p=>({...p,long:true,hot:true}));
   S.x=t.cx;S.y=635;S.vx=0;S.vy=0;S.ground=true;
   S.shake=.65;say('РУНУ '+t.kind.toUpperCase()+' НАМАЛЬОВАНО СПРАВЖНІМ ШЛЕЙФОМ! ЗАМОК РЕАГУЄ.',5);
  }
 }else if(t.active){
  t.index=1;t.length=0;t.active=false;S.trail=[];S.traceError=.75;
  say('ЛІНІЮ ПЕРЕРВАНО. ТРИМАЙ X БЕЗПЕРЕРВНО ТА ПРОВЕДИ ПО ВСІХ МАРКЕРАХ.',3);
 }
 if(E&&S.trace){S.trace=null;S.x=t.cx;S.y=635;S.ground=true;say('РЕЖИМ МАЛЮВАННЯ ЗАКРИТО.',2);}
}
function shardSpawn(room){
 if(!D.monsterBroken||S.shardsInitialized)return;
 S.shardsInitialized=true;
 S.shards=Array.from({length:3},(_,i)=>({
  x:930+i*75,y:room===2?1900:room===1?583:room===4?535:room===5?580:560,
  rest:0,held:false,delay:1.7+i*.75
 }));
}
function shards(room,pools,target=null){
 if(!D.monsterBroken||S.dead)return;
 shardSpawn(room);
 for(let i=0;i<S.shards.length;i++){
  const part=S.shards[i];if(part.held)continue;
  part.delay=Math.max(0,part.delay-dt);
  if(part.delay>0)continue;
  const chase=litAt(S.x,S.y-43,pools)?.25:1;
  const sp=24+i*11;
  const dx=S.x-part.x,dy=(S.y-29)-part.y,dd=Math.hypot(dx,dy)||1;
  part.x+=clamp(dx/dd*sp*chase*dt,-3,3);
  part.y+=clamp(dy/dd*sp*chase*dt,-3,3);
  if(dd<31)hurt('УЛАМОК МОНСТРА',1);
 }
 if(E&&!S.carryShard){
  const part=S.shards.find(p=>!p.held&&distance(S.x,S.y-34,p.x,p.y)<90);
  if(part){part.held=true;S.carryShard=true;S.heldPart=part;
   say('УЛАМОК У РУКАХ. F — КИНУТИ. ПАМ’ЯТАЙ: ІНШІ УЛАМКИ ПЕРЕСЛІДУЮТЬ!',4);}
 }
 if(F&&S.carryShard){
  const part=S.heldPart;S.carryShard=false;S.heldPart=null;
  S.projectile={x:S.x+S.face*21,y:S.y-45,vx:S.face*450,vy:-120,time:1.7,part};
 }
 if(S.projectile){
  const a=S.projectile;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=520*dt;a.time-=dt;
  if(target&&distance(a.x,a.y,target.x,target.y)<target.r){
   target.onHit();a.part.held=false;a.part.x=a.x;a.part.y=a.y;a.part.delay=4.4;
   S.projectile=null;S.shake=.7;
  }else if(a.time<=0||a.y>700){
   a.part.held=false;a.part.x=clamp(a.x,40,1240);a.part.y=clamp(a.y,130,630);
   a.part.delay=2.1;S.projectile=null;
  }
 }
}
if(!runtimeScene.__afterimageGfx){
 const gfx={ok:false};
 try{
  const r=runtimeScene.getLayer('').getRenderer();
  if(typeof PIXI==='undefined'||!PIXI.Graphics||!r||!r.addRendererObject)throw Error('Graphics missing');
  for(const [id,z] of [['far',-40],['mid',-33],['back',-27],['world',7],['fx',15],['front',27]]){
   gfx[id]=new PIXI.Graphics();r.addRendererObject(gfx[id],z);
  }
  gfx.ok=true;
 }catch(err){gfx.error=String(err);}
 runtimeScene.__afterimageGfx=gfx;
}
const A=runtimeScene.__afterimageGfx;
const drawBox=(g,x,y,w,h,c,a=1)=>{g.lineStyle(0);g.beginFill(c,a);g.drawRoundedRect(x,y,w,h,Math.min(9,h/3));g.endFill();};
const circle=(g,x,y,r,c,a=1)=>{g.lineStyle(0);g.beginFill(c,a);g.drawCircle(x,y,r);g.endFill();};
const line=(g,x,y,u,v,c=0x9daab5,a=.7,w=2)=>{g.lineStyle(w,c,a);g.moveTo(x,y);g.lineTo(u,v);};
function halo(g,x,y,r,col,alpha){
 for(let q=6;q>=1;q--)circle(g,x,y,r*(.3+.13*q),col,alpha*(7-q)/28);
}
function worldBase(height=720){
 if(!A.ok)return;
 for(const name of ['far','mid','back','world','fx','front'])A[name].clear();
 drawBox(A.far,0,0,1280,height,0x07101f);
 for(let x=11;x<1280;x+=65)line(A.far,x,0,x,height,0x33546d,.16,1);
 for(let y=28;y<height;y+=63)line(A.far,0,y,1280,y,0x32516a,.12,1);
 for(let x=57;x<1280;x+=227){
  drawBox(A.mid,x,38,49,height-76,0x123145,.4);
  line(A.mid,x+11,48,x+11,height-47,0x7fb1bb,.16,2);
 }
 for(let y=171;y<height;y+=298)line(A.back,34,y,1241,y,0x5c8793,.23,4);
}
function ground(g,p){
 drawBox(g,p.x,p.y,p.w,p.h,0x253d4d);
 drawBox(g,p.x+2,p.y,p.w-4,5,0x89b8c5,.74);
 for(let x=p.x+14;x<p.x+p.w-10;x+=32)line(g,x,p.y+8,x-7,p.y+Math.min(19,p.h),0x9bb2be,.23,1);
}
function lights(pools){
 if(!A.ok)return;
 for(const p of pools)halo(A.back,p.x,p.y,p.r,p.c||0x94fae4,p.a||.20);
}
function glyphArt(kind,cx,cy,completed=false){
 if(!A.ok)return;
 const g=A.world,pts=makeGlyph(kind,cx,cy),trace=S.trace&&S.trace.kind===kind?S.trace:null;
 drawBox(g,cx-(kind==='zigzag'?322:162),cy-159,kind==='zigzag'?644:324,320,0x122639,.56);
 for(let i=0;i<pts.length-1;i++){
  line(g,pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y,
   completed?0x90f8d4:0x8ca8bc,completed?.80:.39,2.4);
 }
 for(let i=0;i<pts.length;i++){
  const p=pts[i],lit=completed||(trace&&i<trace.index);
  halo(g,p.x,p.y,25,lit?0x96ffcf:0x9979d6,lit?.16:.06);
  circle(g,p.x,p.y,lit?11:9,lit?0xa7ffda:0x926db2,lit?.93:.62);
  if(trace&&i===trace.index){
   g.lineStyle(3,0xffca8b,.88);g.drawCircle(p.x,p.y,27);
  }
 }
 if(completed)halo(g,cx,cy,125,0x8affe2,.13);
}
function door(x,y,w=72,open=true,col=0xa2f6d5){
 const g=A.world;if(!A.ok)return;
 drawBox(g,x-w/2,y-82,w,82,open?0x255b50:0x483748,.93);
 g.lineStyle(3,open?col:0xdf7d91,.89);g.drawRoundedRect(x-w/2,y-82,w,82,8);
 for(let k=0;k<3;k++)circle(g,x,y-63+k*21,5,open?col:0xe78390,.8);
}
function drawEnemies(room){
 if(!A.ok)return;
 const g=A.world;
 if(room===3){
  const f=S.fly;halo(A.back,f.x,f.y,34,0xce9af8,.17);
  circle(g,f.x,f.y,14,0x78447d);
  for(const sign of [-1,1]){
   g.beginFill(0xe4c6f9,.57);g.drawEllipse(f.x+sign*14,f.y-12+Math.sin(S.elapsed*20)*5,17,10);g.endFill();
  }
  circle(g,f.x+7,f.y-3,3.2,0xfaffdb);
 }
 if(D.monsterBroken){
  shardSpawn(room);
  for(const p of S.shards){
   if(p.held)continue;
   halo(A.back,p.x,p.y,24,0xff7893,.11);
   g.beginFill(0xaa657f,.95);g.drawPolygon([p.x-13,p.y-7,p.x+12,p.y-12,p.x+18,p.y+7,p.x-7,p.y+13]);g.endFill();
   circle(g,p.x+5,p.y,3,0xffcdde);
  }
  if(S.carryShard)circle(g,S.x+S.face*21,S.y-48,11,0xff93a9);
  if(S.projectile)circle(g,S.projectile.x,S.projectile.y,10,0xffb7be);
 }
 if(room===4){
  for(let i=0;i<Math.min(S.fleas,38);i++){
   const angle=i*2.399963+S.elapsed*.17,rad=21+Math.sqrt(i)*6;
   circle(A.fx,S.x+rad*Math.cos(angle),S.y-41+rad*.61*Math.sin(angle),2.6,0xdab7ff,.85);
  }
 }
}
function drawTrailAndHero(pools){
 if(A.ok){
  const v=A.fx;
  for(let i=0;i<S.trail.length;i++){
   const p=S.trail[i],max=p.long?4.2:.74,alpha=Math.max(0,1-p.age/max);
   if(i>0&&S.trail[i-1].age<=max&&distance(p.x,p.y,S.trail[i-1].x,S.trail[i-1].y)<60){
    line(v,S.trail[i-1].x,S.trail[i-1].y,p.x,p.y,p.hot?0xff6f96:0xef7896,alpha*(p.hot?.67:.26),p.hot?7:3);
   }
   circle(v,p.x,p.y,p.hot?6:3,0xff8eaa,alpha*.53);
  }
  if(!S.dead){
   halo(v,S.x,S.y-44,40+(K.ink?43:11),0xf85986,sneaking(pools)?.03:(K.ink?.22:.08));
   halo(v,S.x,S.y-16,28,0xff8ea0,.10);
  }
  if(S.traceError)halo(v,S.x,S.y-44,80,0xf27a89,.13*S.traceError);
  if(S.shake){
   A.front.lineStyle(4,0xff7b98,S.shake*.26);
   A.front.drawRoundedRect(7,7,1265,706,12);
  }
 }
 animate();
}
function updateFly(pools){
 if(S.dead)return;
 const f=S.fly;
 const visible=!sneaking(pools)||K.ink;
 const dx=S.x-f.x,dy=(S.y-40)-f.y,dist0=Math.hypot(dx,dy)||1;
 f.x=clamp(f.x+(visible?57:14)*dx/dist0*dt,28,1252);
 f.y=clamp(f.y+(visible?57:14)*dy/dist0*dt,145,611);
 if(dist0<47)hurt('МУХА-ДОЗОРЕЦЬ');
}
function hud(room,name,objective,pools){
 label('HUDTitle','ПІСЛЯСВІТ / СЛІДИ СВІТЛА    '+room+' · '+name);
 const g=D.glyph;
 label('HUDStatus','РУНИ '+(g.circle?'◉':'○')+(g.triangle?'▲':'△')+(g.zigzag?'ϟ':'∿')+
  '   ЗДОРОВ’Я '+S.health+'/3   '+(sneaking(pools)?'У СВІТЛІ НЕВИДИМИЙ':'В ТЕМРЯВІ ПОМІТНИЙ')+
  '   ФРАГМЕНТИ '+(D.monsterBroken?'АКТИВНІ':'НЕМАЄ')+
  '   ЗАГИБЕЛЕЙ '+D.deaths);
 label('HUDTask',objective);
 label('HUDHint','A/D — РУХ   SPACE — СТРИБОК   E — ДІЯ   X (УТРИМУВАТИ) — ДОВГИЙ ШЛЕЙФ   F — КИНУТИ   R — КОНТР.ТОЧКА');
 label('HUDMessage',S.msgTime>0?S.msg:'');
 if(K.journal)label('HUDMessage','КОЛО '+(g.circle?'✓':'○')+' · ТРИКУТНИК '+(g.triangle?'✓':'○')+
 ' · ЗИГЗАГ '+(g.zigzag?'✓':'○')+' · ТРАСА СВІТЛА ВМИКАЄ СЕНСОРИ, АЛЕ МОЖЕ ПІДПАЛИТИ ПЕРГАМЕНТ');
 label('HUDWin',D.won?'СЛІДИ СВІТЛА — ВІДКРИТО ФІНАЛ!':'');
 const o=item('HUDWin');if(o&&o.setOpacity)o.setOpacity(D.won?255:0);
}
particles();
