// ПІСЛЯСВІТ — СВІТЛОПАД / standalone GDevelop prototype 0.9.4
(function(){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const distance=(x,y,a,b)=>Math.hypot(x-a,y-b);
const key=k=>gdjs.evtTools.input.isKeyPressed(runtimeScene,k);
const i={left:key('a')||key('Left'),right:key('d')||key('Right'),
 jump:key('Space')||key('w')||key('Up'),
 dash:key('x')||key('k'),slide:key('s')||key('Down'),
 boost:key('Shift')||key('LShift'),use:key('e')||key('E'),
 throw:key('f')||key('F'),restart:key('r')||key('R')};
const dt=clamp(gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene),0,.033);
const platforms=[
 {x:0,y:635,w:1280,h:85},{x:90,y:524,w:150,h:19},
 {x:220,y:440,w:133,h:18},{x:388,y:393,w:193,h:18},
 {x:560,y:445,w:124,h:18},{x:775,y:373,w:174,h:18},
 {x:931,y:307,w:186,h:18},{x:1070,y:408,w:122,h:18}
];
const springs=[{x:334,y:631,w:68},{x:793,y:631,w:72}];
const hook={x:485,y:264},gate={x:588,y:560,w:197,h:75},
target={x:1081,y:213},ammo={x:855,y:347};
const lampPos=[486,786,1085],bulbX=[899,1022,1145];
const spiders=[920,1065,1179];
const lampStart=[115,96,108];
function fresh(){
 return {x:108,y:635,vx:0,vy:0,ground:true,face:1,time:0,
 light:.12,flash:0,trail:[],trailAcc:0,
 lamps:lampPos.map((x,n)=>({x,y:lampStart[n],state:'ready',countdown:0,vy:0})),
 litAt:-1,slideMeters:0,slideHeld:false,sliding:false,
 bounceCd:0,lastSpring:-1,stone:false,shot:null,
 dashTimer:0,dashCooldown:0,dashHeld:false,useHeld:false,throwHeld:false,
 jumpHeld:false,jumpBuffer:0,jumpHold:0,coyote:0,
 dead:false,deathTime:0,deaths:0,shield:1.3,alert:0,landTimer:0,
 message:'ТРИ ЛАМПИ ПІД СТЕЛЕЮ. ВОНИ ВАЖКІ — НЕ СТОЙ ПІД НИМИ!',messageTime:5,
 won:false};
}
if(!runtimeScene.__lightfall094)runtimeScene.__lightfall094=fresh();
const s=runtimeScene.__lightfall094;
const get=n=>runtimeScene.getObjects(n)[0];
const hud=(n,v)=>{const o=get(n);if(o&&o.setString)o.setString(v);};
const say=(msg,t=3.6)=>{s.message=msg;s.messageTime=t;};
const active=n=>s.lamps[n].state==='landed';
const complete=()=>s.lamps.every(l=>l.state==='landed');
const bulb=n=>complete()&&s.time-s.litAt>=n*.38;
function shelter(x,y){
 if(distance(x,y,823,584)<83)return true;
 for(let n=0;n<3;n++)if(bulb(n)&&distance(x,y,bulbX[n],584)<133)return true;
 for(const l of s.lamps)if(l.state==='landed'&&distance(x,y,l.x,584)<90)return true;
 return false;
}
function trigger(n,msg){
 if(s.lamps[n].state!=='ready')return;
 const l=s.lamps[n];l.state='warning';l.countdown=.72;s.flash=.3;
 say(msg+' · УВАГА: ВАЖКА ЛАМПА ПАДАТИМЕ ЗА МИТЬ!',4.2);
}
function extinguish(reason){
 if(s.dead||s.shield>0||s.won)return;
 s.dead=true;s.deathTime=.92;s.deaths++;s.vx=0;s.vy=0;s.flash=.9;
 say('СПАЛАХ ЗГАС · '+reason,2.5);
}
function recover(){
 s.dead=false;s.x=active(0)?470:108;s.y=635;
 s.vx=0;s.vy=0;s.ground=true;s.light=.12;s.alert=0;
 s.shield=1.65;s.trail=[];s.bounceCd=.3;s.dashTimer=0;
 s.stone=false;s.shot=null;
}
if(i.restart){Object.assign(s,fresh());s.shield=1.4;}
if(dt){
 s.time+=dt;s.messageTime=Math.max(0,s.messageTime-dt);
 s.shield=Math.max(0,s.shield-dt);s.flash=Math.max(0,s.flash-dt*2.2);
 s.bounceCd=Math.max(0,s.bounceCd-dt);
 s.dashTimer=Math.max(0,s.dashTimer-dt);
 s.dashCooldown=Math.max(0,s.dashCooldown-dt);
 if(s.dead){s.deathTime-=dt;if(s.deathTime<=0)recover();}
}
// Falling lamps are world simulations independent of Spalakh's death.
if(dt){
 for(let n=0;n<3;n++){
  const l=s.lamps[n];
  if(l.state==='warning'){
   l.countdown-=dt;
   if(l.countdown<=0){l.state='falling';l.vy=0;say('ЛАМПА '+(n+1)+' ПАДАЄ! ВІДІЙДИ ВБІК!',2.1);}
  }else if(l.state==='falling'){
   const fromY=l.y;
   l.vy=Math.min(930,l.vy+1530*dt);l.y+=l.vy*dt;
   if(!s.dead&&!s.won&&Math.abs(s.x-l.x)<58&&s.y>l.y-17&&s.y<l.y+132&&s.shield<=0)
    extinguish('ЛАМПА ВПАЛА НА СПАЛАХА');
   if(l.y>=563){
    l.y=563;l.state='landed';l.vy=0;s.flash=.65;
    say('ЛАМПА '+(n+1)+' ВПАЛА. ТЕПЕР ВОНА ДАЄ СВІТЛО!',3.5);
    if(complete()){s.litAt=s.time;say('УСІ ЛАМПИ ВПАЛИ! КОРИДОР ОСВІТЛЮЄТЬСЯ. ПАВУКИ ТЕБЕ НЕ ПОБАЧАТЬ!',5.8);}
   }
  }
 }
}

if(!s.dead&&!s.won&&dt){
 const dir=Number(i.right)-Number(i.left);
 if(dir!==0&&s.dashTimer<=0)s.face=dir;
 // X is a bright, directional impulse, also used on the trampoline hook.
 if(i.dash&&!s.dashHeld&&s.dashCooldown<=0){
  s.dashTimer=.17;s.dashCooldown=.82;s.vx=s.face*632;s.flash=.48;
 }
 s.dashHeld=i.dash;
 const onIce=s.x>135&&s.x<535&&s.y>601;
 s.sliding=i.slide&&s.ground&&(Math.abs(s.vx)>60||dir!==0);
 if(s.dashTimer>0)s.vx=s.face*632;
 else if(s.sliding){
  const slideSpeed=dir*(onIce?456:383);
  s.vx+=clamp(slideSpeed-s.vx,-(dir?1400:550)*dt,(dir?1400:550)*dt);
 }else{
  const wanted=dir*(i.slide?67:i.boost?320:196);
  const force=dir!==0?(s.ground?1580:970):(s.ground?(onIce?330:2350):970);
  s.vx+=clamp(wanted-s.vx,-force*dt,force*dt);
 }
 if(s.ground)s.coyote=.12;else s.coyote=Math.max(0,s.coyote-dt);
 if(i.jump&&!s.jumpHeld)s.jumpBuffer=.135;
 else s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);
 if(s.jumpBuffer>0&&(s.ground||s.coyote>0)){
  s.vy=-505;s.ground=false;s.coyote=0;s.jumpBuffer=0;s.jumpHold=0;s.flash=.19;
 }
 if(s.jumpHeld&&!i.jump&&s.vy< -140)s.vy*=.59;
 s.jumpHeld=i.jump;
 if(!s.ground){
  if(s.vy<0&&i.jump&&s.jumpHold<.20){s.vy+=810*dt;s.jumpHold+=dt;}
  else s.vy+=(s.vy<0?1150:1370)*dt;
  s.vy=clamp(s.vy,-890,870);
 }
 const lastY=s.y,oldX=s.x;
 s.x=clamp(s.x+s.vx*dt,19,1263);
 s.y+=s.vy*dt;
 let contact=false;
 for(const p of platforms){
  if(s.vy>=0&&lastY<=p.y+8&&s.y>=p.y&&s.x+13>p.x&&s.x-13<p.x+p.w){
   s.y=p.y;s.vy=0;contact=true;break;
  }
 }
 if(!s.ground&&contact)s.landTimer=.13;
 s.ground=contact;s.landTimer=Math.max(0,s.landTimer-dt);
 // The low shutter has a real collision volume. Slide, or go around it above.
 const throughGate=s.x>gate.x&&s.x<gate.x+gate.w&&s.y>605;
 if(throughGate&&!s.sliding){
  if(oldX<=gate.x){s.x=gate.x-13;s.vx=0;}
  else if(oldX>=gate.x+gate.w){s.x=gate.x+gate.w+13;s.vx=0;}
 }
 if(s.y>760)extinguish('ПРОВАЛЛЯ');
 // Springs fire on contact, and allow useful mid-air dashes.
 for(let n=0;n<springs.length;n++){
  const q=springs[n];
  if(s.bounceCd<=0&&Math.abs(s.x-(q.x+q.w/2))<q.w/2+8&&s.y>=625&&s.ground){
   s.vy=-865;s.ground=false;s.coyote=0;s.bounceCd=.53;s.lastSpring=n;
   s.flash=.45;say(n===0?'БАТУТ! РИВОК X У ПОВІТРІ ЗАПУСКАЄ ПЕРШУ ЛАМПУ.':
    'БАТУТ! ЗАСТРИБНИ НА ВЕРХНЮ ПЛАТФОРМУ З КАМЕНЕМ.',3.4);
  }
 }
 // Hook can only be struck by airborne dash.
 if(s.lamps[0].state==='ready'&&!s.ground&&s.dashTimer>0&&
   distance(s.x,s.y-48,hook.x,hook.y)<97)
  trigger(0,'СТЕЛЬОВИЙ ГАК ЗБИТО РИВКОМ X');
 // Sliding below the shutter reaches the orange mechanical latch.
 if(s.sliding&&s.y>600&&s.x>592&&s.x<790&&s.vx>125)
  s.slideMeters=clamp(s.slideMeters+(Math.max(s.vx,130)*dt),0,220);
 if(s.x<540&&s.slideMeters>0)s.slideMeters=Math.max(0,s.slideMeters-dt*130);
 if(s.lamps[1].state==='ready'&&s.sliding&&s.x>753&&s.y>603&&s.slideMeters>92)
  trigger(1,'КОВЗАННЯ ВІДКРИЛО НИЖНІЙ ЗАСУВ');
 // E: refillable throwing stone on the upper balcony.
 if(i.use&&!s.useHeld&&!s.stone&&!s.shot&&distance(s.x,s.y-25,ammo.x,ammo.y)<82){
  s.stone=true;say('КАМІНЬ У РУКАХ. ПОЦІЛЬ У ЧЕРВОНЕ СТЕЛЬОВЕ КРІПЛЕННЯ КЛАВІШЕЮ F.',4.3);
 }
 if(i.throw&&!s.throwHeld&&s.stone){
  s.stone=false;s.shot={x:s.x+s.face*24,y:s.y-53,vx:s.face*487,vy:-425,ttl:2.7};
 }
 if(s.shot){
  const p=s.shot;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=775*dt;p.ttl-=dt;
  if(s.lamps[2].state==='ready'&&distance(p.x,p.y,target.x,target.y)<46){
   trigger(2,'КАМІНЬ РОЗБИВ КРІПЛЕННЯ ТРЕТЬОЇ ЛАМПИ');s.shot=null;
  }else if(p.ttl<=0||p.y>650||p.x<0||p.x>1280)s.shot=null;
 }
 s.useHeld=i.use;s.throwHeld=i.throw;
 // Bright body and afterimage both belong to the actor; stronger on fast movement.
 const desired=clamp(.12+Math.pow(Math.min(1,Math.abs(s.vx)/350),1.25)*.80+
  (s.dashTimer>0?.13:0)+(s.flash>.23?.10:0),.12,1);
 s.light+=(desired-s.light)*(1-Math.exp(-(desired>s.light?8:3)*dt));
 s.trailAcc+=dt;
 if(s.trailAcc>.028&&Math.abs(s.vx)>54){
  s.trail.push({x:s.x-s.face*18,y:s.y-42,p:s.light,age:0});s.trailAcc=0;
 }
 for(const tail of s.trail)tail.age+=dt;
 s.trail=s.trail.filter(t=>t.age<.82).slice(-35);
 // Enemy corridor: darkness exposes Spalakh. Fallen lamps give cover.
 const dark=s.x>860&&s.y>571&&!shelter(s.x,s.y-39);
 s.alert=clamp(s.alert+(dark?dt*1.18:-dt*1.75),0,1.3);
 if(s.alert>=1)extinguish('ПАВУК ВИЯВИВ СПАЛАХА У ТЕМРЯВІ');
 if(s.x>1227&&s.y>549){
  if(complete()&&shelter(s.x,s.y-39)){
   s.won=true;s.flash=.9;say('СВІТЛОПАД ПРОЙДЕНО! ПАВУКИ ТЕБЕ НЕ ПОБАЧИЛИ.',99);
  }else{s.x=1214;s.vx=0;say('ЗАПАЛИ ВСІ ТРИ ЛАМПИ ПЕРЕД ВИХОДОМ.',1.5);}
 }
}
s.dashHeld=i.dash;s.useHeld=i.use;s.throwHeld=i.throw;
