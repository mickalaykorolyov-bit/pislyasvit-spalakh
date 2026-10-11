import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const REPO='https://raw.githubusercontent.com/mickalaykorolyov-bit/pislyasvit-spalakh/spalakh-animated-3d-v0911/';
const JSON_URL=REPO+'spalakh3d/Spalakh_NeonObservatory_ONLY_v0912.json';
const byId=id=>document.getElementById(id);
const loading=byId('loading'), info=byId('loadInfo');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(1.8,window.devicePixelRatio||1));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.48;
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color('#020711');
scene.fog=new THREE.FogExp2(0x071427,0.000125);
const camera=new THREE.PerspectiveCamera(56,innerWidth/innerHeight,1,12000);
camera.position.set(370,340,-790);
camera.lookAt(370,310,0);
scene.add(new THREE.HemisphereLight(0x82bfff,0x1c0924,1.5));
const direct=new THREE.DirectionalLight(0xe1e8ff,2.2);
direct.position.set(-550,1350,-800);scene.add(direct);
const rim=new THREE.DirectionalLight(0x20b5ef,0.7);
rim.position.set(1800,500,900);scene.add(rim);
const playerLamp=new THREE.PointLight(0xff617f,2.2,460);scene.add(playerLamp);
const loader=new GLTFLoader(),cache=new Map(),objects=new Map(), pressed=new Set();
const clock=new THREE.Clock(), tmpV=new THREE.Vector3(),tmpBox=new THREE.Box3();
let runtimeScene,gdjs,compiledTick,activePlayer=null,lightCones=[],frameCount=0;
const textureLoader=new THREE.TextureLoader(),textures=new Map();
const material=(color,opacity=1)=>new THREE.MeshStandardMaterial({color,roughness:0.78,metalness:0.01,transparent:opacity<1,opacity,side:THREE.DoubleSide});
const glowMat=(color,opacity=.7)=>new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
const tones={ObsGround:0x18284a,ObsStep:0x233b67,ObsBridge:0x33677c,UnderfloorRoundedBlock:0x17213f,
 ObsBridgeRim:0x44ffff,ObsIris:0xff24ba,ObsGateFrame:0xa629bb,ObsGateCore:0xf720a1,
 ObsLightCone:0x45d9fb,ObsSafeGlow:0x19aaba,ObsDial:0x8b8bd0,SpalakhAura:0xff3c7d,
 SpalakhGroundGlow:0xff6c50,Spark:0xffbb84,ObsDepthMist:0x1b4c6a,
 ObsSkyUpper:0x0e223a,ObsSkyMiddle:0x071829,ObsSkyDeep:0x031224};
const skipNames=new Set(['GradientBackdrop','ObsSkyUpper','ObsSkyMiddle','ObsSkyDeep','ObsDepthMist',...Array.from({length:4},(_,i)=>'SpalakhIdle'+i),...Array.from({length:4},(_,i)=>'SpalakhRun'+i),'SpalakhJump0','SpalakhJump1','SpalakhFall0','SpalakhFall1']);
const hiddenNames=['SpalakhIdle0','SpalakhIdle1','SpalakhIdle2','SpalakhIdle3','SpalakhRun0','SpalakhRun1','SpalakhRun2','SpalakhRun3','SpalakhJump0','SpalakhJump1','SpalakhFall0','SpalakhFall1'];

function getTexture(name){
 if(!textures.has(name)){const t=textureLoader.load(REPO+name,()=>{},undefined,()=>{});t.colorSpace=THREE.SRGBColorSpace;textures.set(name,t);}
 return textures.get(name);
}
function modelPromise(file){
 if(!cache.has(file))cache.set(file,new Promise((resolve,reject)=>loader.load(REPO+file,resolve,undefined,reject)));
 return cache.get(file);
}
function shapeBox(w,h,d,color,op=1){
 return new THREE.Mesh(new THREE.BoxGeometry(Math.max(1,w),Math.max(1,h),Math.max(1,d)),material(color,op));
}
function addFallback(o){
 if(o.name==='Player'){
  const b=new THREE.Mesh(new THREE.SphereGeometry(48,20,16),glowMat(0xff8855,.86));
  b.scale.set(.8,1.65,.6);o.node.add(b);return;
 }
 const w=o.width||10,h=o.depth||10,d=o.height||10;
 const v=shapeBox(w,h,d,tones[o.name]||0x224264,o.name==='ObsIris'?.7:1);
 o.node.add(v);
}
function makeSimple(o){
 if(o.type==='TextObject::Text')return;
 if(skipNames.has(o.name))return;
 if(o.name==='ObsLightCone'){
  const mat=glowMat(0x42d9fa,.4);mat.map=getTexture('spalakh3d/assets/observatory_beam_clear_v093.png');
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat);
  o.node.add(plane);o.simpleMesh=plane;
 }else if(o.name==='ObsIris'){
  const mat=glowMat(0xf50bd5,.8);mat.map=getTexture('spalakh3d/assets/observatory_pink_gate_v09.png');
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat);
  o.node.add(plane);o.simpleMesh=plane;
 }else if(o.name==='ObsSafeGlow'||o.name==='SpalakhGroundGlow'||o.name==='SpalakhAura'){
  const mat=glowMat(o.name==='ObsSafeGlow'?0x55c6ee:0xff6f6f,.23);
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat);
  o.node.add(plane);o.simpleMesh=plane;
 }else if(o.name==='Spark'||o.name==='ObsFarFish'){
  const dot=new THREE.Mesh(new THREE.IcosahedronGeometry(1,0),glowMat(o.name==='Spark'?0xff8b57:0x40bdc6,.75));
  o.node.add(dot);o.simpleMesh=dot;
 }else{
  addFallback(o);
 }
 o.updateGeometry();
}
class SceneObject{
 constructor(instance,definition){
  this.name=instance.name;this.type=definition?.type||'';
  this.content=definition?.content||{};
  this.x=instance.x||0;this.y=instance.y||0;this.z=instance.z||0;
  this.width=instance.width||this.content.width||1;
  this.height=instance.height||this.content.height||1;
  this.depth=instance.depth||this.content.depth||1;
  this.node=new THREE.Group();scene.add(this.node);
  this.animationName='Idle';this.speedScale=1;this.mixer=null;this.actions=new Map();this.currentAction=null;
  this.visible=true;this.modelReady=false;this.simpleMesh=null;this.sizeBeforeLoad=[this.width,this.height,this.depth];
  this.node.visible=!skipNames.has(this.name);
  if(this.type==='Scene3D::Model3DObject'){
   addFallback(this);
   const path=this.content.modelResourceName;
   if(path)this.load3D(path);
  }else makeSimple(this);
  this.sync();
 }
 sync(){
  if(this.name==='Player'){
   this.node.position.set(this.x,this.z,-this.y);
  }else{
   this.node.position.set(this.x+this.width/2,this.z+this.depth/2,-this.y-this.height/2);
  }
  if(this.name==='SpalakhGroundGlow')this.node.position.z=-this.y;
  this.node.visible=this.visible&&!skipNames.has(this.name);
  this.updateGeometry();
 }
 updateGeometry(){
  if(this.modelReady||!this.simpleMesh)return;
  if(this.name==='ObsLightCone'||this.name==='ObsIris'){
   this.simpleMesh.scale.set(Math.max(1,this.width),Math.max(1,this.depth),1);
  }else if(this.name==='ObsSafeGlow'||this.name==='SpalakhGroundGlow'||this.name==='SpalakhAura'){
   this.simpleMesh.scale.set(Math.max(1,this.width),Math.max(1,this.depth),1);
  }else if(this.name==='Spark'||this.name==='ObsFarFish'){
   this.simpleMesh.scale.set(Math.max(1,this.width/4),Math.max(1,this.depth/4),1);
  }
 }
 async load3D(file){
  try{
   const result=await modelPromise(file);
   if(!result?.scene)throw Error('no GLTF scene');
   const model=result.scene.clone(true);
   model.rotation.x=-Math.PI/2;
   model.updateMatrixWorld(true);
   const bounds=new THREE.Box3().setFromObject(model),size=new THREE.Vector3();
   bounds.getSize(size);
   if(!Number.isFinite(size.x+size.y+size.z)||size.y<0.000001)throw Error('invalid GLB geometry bounds');
   const centre=bounds.getCenter(new THREE.Vector3());
   const w=this.width,h=this.depth,d=this.height;
   let sx=Math.max(.001,w)/Math.max(.001,size.x),sy=Math.max(.001,h)/Math.max(.001,size.y),
       sz=Math.max(.001,d)/Math.max(.001,size.z);
   if(this.name==='Player'){
    const uniform=Math.min(sx,sy,sz);
    sx=sy=sz=uniform;
   }
   const parent=new THREE.Group();parent.add(model);
   model.scale.set(sx,sy,sz);
   if(this.name==='Player'){model.position.set(-centre.x*sx,-bounds.min.y*sy,-centre.z*sz);}
   else model.position.set(-centre.x*sx,-centre.y*sy,-centre.z*sz);
   this.node.clear();this.node.add(parent);
   this.modelReady=true;this.model=parent;
   parent.traverse(item=>{if(item.isMesh&&item.material){
    if(Array.isArray(item.material))item.material.forEach(m=>m.side=THREE.DoubleSide);
    else item.material.side=THREE.DoubleSide;
   }});
   if(this.name==='Player'){
    this.mixer=new THREE.AnimationMixer(model);
    for(const clip of result.animations||[]){
     this.actions.set(clip.name,this.mixer.clipAction(clip));
    }
    this.setAnimationName(this.animationName);
   }
   this.sync();
  }catch(error){
   console.warn('3D resource fallback',file,error);
   this.modelReady=false;
  }
 }
 setX(v){this.x=v;this.sync()}
 setY(v){this.y=v;this.sync()}
 setZ(v){this.z=v;this.sync()}
 setDepth(v){this.depth=v;this.sync()}
 hide(h){this.visible=!h;this.sync()}
 setString(v){const hudNames={ObsTask:'task',ObsStatus:'status',ObsMessage:'message',ObsWin:'win'};if(hudNames[this.name])byId(hudNames[this.name]).textContent=v;this.string=v}
 setColor(t){const [r,g,b]=t.split(';').map(Number);if(this.node.children[0]?.material?.color)this.node.children[0].material.color.setRGB(r/255,g/255,b/255)}
 flipX(v){this.flip=v}
 getAnimationName(){return this.animationName}
 setAnimationName(name){
  if(this.animationName===name&&this.currentAction)return;
  this.animationName=name;
  const next=this.actions.get(name);
  if(next){
   if(this.currentAction&&this.currentAction!==next)this.currentAction.fadeOut(.12);
   next.reset().setEffectiveTimeScale(this.speedScale).fadeIn(.12).play();
   next.setLoop(name==='Jump'||name==='Fall'?THREE.LoopOnce:THREE.LoopRepeat);
   next.clampWhenFinished=true;
   this.currentAction=next;
  }
 }
 setAnimationSpeedScale(v){this.speedScale=v;if(this.currentAction)this.currentAction.setEffectiveTimeScale(v)}
}
function initObjects(project){
 const layout=project.layouts.find(x=>x.name==='Observatory3D_FalseLight');
 const defs=new Map(layout.objects.map(o=>[o.name,o]));
 for(const item of layout.instances){
  const def=defs.get(item.name);const obj=new SceneObject(item,def);
  if(!objects.has(item.name))objects.set(item.name,[]);objects.get(item.name).push(obj);
 }
 runtimeScene={getObjects:name=>objects.get(name)||[],__observatory096:null};
 const key=(k)=>{const s=k.toLowerCase();return pressed.has(k)||pressed.has(s)||(s==='left'&&pressed.has('a'))||(s==='right'&&pressed.has('d'))};
 let elapsed=1/60,cam={x:355,y:790,z:250,pitch:88};
 gdjs={evtTools:{
   input:{isKeyPressed:(_scene,k)=>key(k)},
   runtimeScene:{getElapsedTimeInSeconds:()=>elapsed},
   camera:{setCameraX:(_scene,v)=>cam.x=v,setCameraY:(_scene,v)=>cam.y=v}
  },scene3d:{camera:{
   setCameraZ:(_scene,v)=>cam.z=v,
   setCameraRotationX:(_scene,v)=>cam.pitch=v,
   setCameraRotationY:()=>{}
  }}
 };
 const event=layout.events.find(e=>e.type==='BuiltinCommonInstructions::JsCode');
 if(!event||!event.inlineCode)throw Error('GDevelop puzzle script not found');
 compiledTick=new Function('runtimeScene','gdjs',event.inlineCode.join('\n'));
 activePlayer=objects.get('Player')?.[0];
 if(!activePlayer)throw Error('Player missing from GDevelop scene');
 const tick=(dt)=>{
  elapsed=clamp(dt,0,.033);
  compiledTick(runtimeScene,gdjs);
  if(activePlayer?.mixer)activePlayer.mixer.update(dt);
  const state=runtimeScene.__observatory096;
  const facing=state?.face||1;
  if(activePlayer?.model)activePlayer.model.rotation.y=(facing<0?Math.PI:0);
  playerLamp.position.set(activePlayer.x,activePlayer.z+90,-activePlayer.y-10);
  if(state){playerLamp.intensity=1.5+2.2*state.bright;playerLamp.visible=!state.dead;}
  camera.position.set(cam.x,Math.max(100,cam.z),-cam.y);
  camera.lookAt(cam.x,Math.min(380,cam.z*0.66),140);
  if(state?.camPhase==='intro')camera.fov=52;else if(state?.camPhase==='wide')camera.fov=56;else camera.fov=50;
  camera.updateProjectionMatrix();
 };
 let last=performance.now();
 function loop(now){
  requestAnimationFrame(loop);let dt=Math.min(.033,(now-last)/1000);last=now;
  try{tick(dt)}catch(e){console.error(e);info.textContent='Помилка ігрової логіки: '+e.message;loading.style.display='grid';return}
  renderer.render(scene,camera);frameCount++;
 }
 requestAnimationFrame(loop);
}
const keyNorm=k=>k===' '?'Space':k.length===1?k.toLowerCase():k;
window.addEventListener('keydown',e=>{const k=keyNorm(e.key);pressed.add(k);if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault()});
window.addEventListener('keyup',e=>pressed.delete(keyNorm(e.key)));
window.addEventListener('blur',()=>pressed.clear());
for(const btn of document.querySelectorAll('#mobile button')){
 const k=btn.dataset.key;
 btn.addEventListener('pointerdown',e=>{e.preventDefault();pressed.add(k);btn.setPointerCapture(e.pointerId)});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(ev,()=>pressed.delete(k));
}
window.addEventListener('resize',()=>{
 const w=innerWidth,h=innerHeight;
 renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
});
async function boot(){
 try{
  const res=await fetch(JSON_URL,{cache:'no-store'});
  if(!res.ok)throw Error('GitHub project '+res.status);
  const project=await res.json();
  initObjects(project);
  info.textContent='Завантаження моделі Спалаха…';
  // Wait for the player asset; other props stream in asynchronously.
  const playerFile=project.layouts[0].objects.find(x=>x.name==='Player').content.modelResourceName;
  await modelPromise(playerFile);
  await new Promise(resolve=>setTimeout(resolve,350));
  loading.style.display='none';
 }catch(e){console.error(e);info.textContent='Не вдалося запустити: '+e.message}
}
boot();