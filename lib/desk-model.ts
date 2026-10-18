import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { pushUpPose } from "./push-up-pose";

export type DeskAction = "lamp" | "work";
/** Original procedural geometry: no photograph, sprite, downloaded model, or EPS texture. */
export function createDeskModel(canvas: HTMLCanvasElement, onAction: (action: DeskAction) => void) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.VSMShadowMap;
  renderer.shadowMap.autoUpdate=false;
  renderer.shadowMap.needsUpdate=true;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(33,1,.1,50);
  camera.position.set(2.7,2.65,-4.35);
  const controls=new OrbitControls(camera,canvas);
  controls.target.set(0,1.05,.12);
  controls.enableDamping=!reduced.matches;
  controls.dampingFactor=.085;
  controls.enablePan=false; controls.enableZoom=false;
  controls.minPolarAngle=.65;controls.maxPolarAngle=1.48;
  controls.update(); controls.saveState();
  const workTarget=controls.target.clone(), workOffset=camera.position.clone().sub(controls.target);
  const exerciseTarget=new THREE.Vector3(0,.42,.12);
  const geometrySet=new Set<THREE.BufferGeometry>(), materialSet=new Set<THREE.Material>();
  const materials={
    blue:new THREE.MeshStandardMaterial({color:0x335792,roughness:.8}),
    navy:new THREE.MeshStandardMaterial({color:0x233b61,roughness:.9}),
    coffee:new THREE.MeshStandardMaterial({color:0x492819,roughness:.28}),
    pale:new THREE.MeshStandardMaterial({color:0xcdd8e9,roughness:.75}),
    white:new THREE.MeshStandardMaterial({color:0xf7f9fd,roughness:.72}),
    skin:new THREE.MeshStandardMaterial({color:0xae7655,roughness:.92}),
    hair:new THREE.MeshStandardMaterial({color:0x171b25,roughness:.87}),
    black:new THREE.MeshStandardMaterial({color:0x222b3a,roughness:.65}),
    eyes:new THREE.MeshStandardMaterial({color:0x141c28,roughness:.3}),
    lips:new THREE.MeshStandardMaterial({color:0x724638,roughness:.9}),
    frame:new THREE.MeshPhysicalMaterial({color:0xc9c8c2,roughness:.22,metalness:.12,transparent:true,opacity:.7}),
    glass:new THREE.MeshPhysicalMaterial({color:0xe6f1ff,roughness:.05,transparent:true,opacity:.08}),
    bulb:new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xc9e0ff,emissiveIntensity:1}),
  };
  Object.values(materials).forEach(m=>materialSet.add(m));
  const studio=new THREE.Group();scene.add(studio);
  function part(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=studio){
    geometrySet.add(geometry); materialSet.add(material);
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function box(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material,r=.025,parent:THREE.Object3D=studio){
    return part(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),mat,x,y,z,parent);
  }
  function ball(r:number,x:number,y:number,z:number,mat:THREE.Material,parent:THREE.Object3D=studio){
    return part(new THREE.SphereGeometry(r,20,14),mat,x,y,z,parent);
  }
  function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,mat:THREE.Material,parent:THREE.Object3D=studio){
    const direction=new THREE.Vector3().subVectors(b,a);
    const mesh=part(new THREE.CapsuleGeometry(r,Math.max(.001,direction.length()-r*2),5,10),mat,0,0,0,parent);
    mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());return mesh;
  }
  const V=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
  // Rounded tabletop, edge reveal, legs and feet.
  box(2.5,.115,1.25,0,1.05,0,materials.white,.045);
  box(2.35,.045,1.12,0,.99,0,materials.pale,.015);
  for(const x of [-1.08,1.08])for(const z of [-.48,.48]){
    box(.075,.95,.075,x,.49,z,materials.white,.018);
    box(.085,.04,.085,x,.025,z,materials.pale,.012);
  }
  // Chair: five real spokes, casters, gas lift, cushions and backrest.
  const chair=new THREE.Group();chair.position.z=.73;studio.add(chair);
  part(new THREE.CylinderGeometry(.045,.065,.48,20),materials.pale,0,.33,0,chair);
  for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5, x=Math.sin(a)*.34,z=Math.cos(a)*.34;
    rod(V(0,.14,0),V(x,.1,z),.027,materials.pale,chair);
    const wheel=part(new THREE.CylinderGeometry(.045,.045,.035,14),materials.black,x,.055,z,chair);wheel.rotation.z=Math.PI/2;
  }
  box(.62,.12,.58,0,.62,0,materials.blue,.06,chair);
  box(.59,.54,.11,0,.96,.24,materials.blue,.065,chair);
  for(const x of [-.34,.34]){
    rod(V(x,.66,.09),V(x,.91,.09),.018,materials.pale,chair);
    box(.09,.045,.35,x,.92,-.015,materials.pale,.025,chair);
  }
  // Person: seated anatomy, sleeves, hands, individual fingers and clear glasses.
  const seatedStart=studio.children.length;
  box(.45,.2,.32,0,.76,.65,materials.navy,.07);
  for(const sign of [-1,1]){
    const x=sign*.14;
    rod(V(x,.77,.65),V(x,.55,.18),.105,materials.navy);
    // Overlapping knee and cuff keep the trousers continuous in every view.
    ball(.103,x,.55,.18,materials.navy);
    rod(V(x,.55,.18),V(x,.135,.12),.09,materials.navy);
    part(new THREE.CylinderGeometry(.077,.075,.07,24),materials.navy,x,.152,.122);
    box(.17,.105,.29,x,.075,.015,materials.white,.045);
    box(.17,.025,.29,x,.025,.015,materials.pale,.01);
  }
  const torso=new THREE.Group();torso.position.set(0,1.13,.62);studio.add(torso);
  const shirtProfile=new THREE.CatmullRomCurve3([
    V(0,-.31,0),V(.22,-.31,0),V(.265,-.26,0),V(.29,-.04,0),V(.285,.15,0),V(.24,.26,0),V(.15,.3,0),V(0,.3,0),
  ]);
  const shirt=part(new THREE.LatheGeometry(shirtProfile.getPoints(30).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y)),48),materials.blue,0,0,0,torso);
  shirt.scale.z=.68;
  // Simple crew neck; no separate collar blocks or floating chest decorations.
  const neckline=part(new THREE.TorusGeometry(.095,.01,8,32),materials.blue,0,.30,-.01,torso);
  neckline.rotation.x=Math.PI/2;
  const neck=part(new THREE.CylinderGeometry(.075,.09,.13,20),materials.skin,0,1.49,.61);
  const head=new THREE.Group();head.position.set(0,1.79,.59);head.rotation.x=-.06;studio.add(head);
  const faceProfile=new THREE.CatmullRomCurve3([
    V(0,-.275,0),V(.10,-.26,0),V(.18,-.21,0),V(.225,-.10,0),V(.235,.045,0),V(.225,.18,0),V(.17,.26,0),V(0,.29,0),
  ]);
  const faceOutline=faceProfile.getPoints(36);
  const face=part(new THREE.LatheGeometry(faceOutline.map(p=>new THREE.Vector2(Math.max(0,p.x),p.y)),56),materials.skin,0,0,0,head);
  face.scale.z=.93;
  for(const sign of [-1,1]){
    const ear=ball(.065,sign*.244,-.015,0,materials.skin,head);ear.scale.set(.55,1,.65);
    const eye=ball(.029,sign*.108,.025,-.198,materials.white,head);eye.scale.set(1,.65,.4);
    ball(.015,sign*.108,.025,-.213,materials.eyes,head);
    ball(.0035,sign*.108-.005,.031,-.226,materials.white,head);
    const browPath=new THREE.CatmullRomCurve3([V(sign*.055,.098,-.222),V(sign*.108,.113,-.226),V(sign*.166,.096,-.208)]);
    part(new THREE.TubeGeometry(browPath,16,.011,7,false),materials.hair,0,0,0,head);
  }
  const nose=ball(.045,0,-.045,-.235,materials.skin,head);nose.scale.set(.55,.7,.8);
  const smile=new THREE.CatmullRomCurve3([V(-.058,-.143,-.216),V(0,-.139,-.226),V(.058,-.143,-.216)]);
  part(new THREE.TubeGeometry(smile,14,.005,6,false),materials.lips,0,0,0,head);
  // One continuous scalp surface: shallow swept waves instead of separate tube locks.
  const hairGeometry=new THREE.SphereGeometry(1,96,48,0,Math.PI*2,0,Math.PI/2);
  const hairPositions=hairGeometry.getAttribute('position');
  for(let i=0;i<hairPositions.count;i++){
    const x=hairPositions.getX(i), y=hairPositions.getY(i), z=hairPositions.getZ(i);
    const theta=Math.acos(THREE.MathUtils.clamp(y,0,1));
    const phi=Math.atan2(z,x), radial=Math.sin(theta), crown=Math.cos(theta);
    const front=Math.max(0,-Math.sin(phi));
    const fringe=(.013*Math.sin(phi*7+.8)+.008*Math.sin(phi*13-1))*Math.pow(front,3);
    const hairline=.065+.095*Math.pow(front,.8)+fringe;
    // Cartesian waves join across the seam and create curls in the surface itself.
    const curl=Math.sin(x*15+z*9)*Math.cos(z*17-y*5)+.45*Math.sin(x*29+y*13)*Math.cos(z*25-x*7);
    const wave=.013*curl*radial;
    const top=Math.pow(crown,.68);
    hairPositions.setXYZ(i,
      (.263+wave)*radial*Math.cos(phi)+.015*crown*crown,
      .355*top+hairline*(1-top)+.022*front*radial*crown+wave,
      (.247+wave)*radial*Math.sin(phi)+.012,
    );
  }
  // Keep the entire hair shell outside the actual jaw/crown profile, including
  // the asymmetrical swept side where the earlier shell cut through the skin.
  for(let i=0;i<hairPositions.count;i++){
    const y=hairPositions.getY(i);
    let skinRadius=0;
    for(let j=1;j<faceOutline.length;j++){
      const a=faceOutline[j-1],b=faceOutline[j];
      if(y<Math.min(a.y,b.y)||y>Math.max(a.y,b.y)||Math.abs(b.y-a.y)<1e-8)continue;
      const t=(y-a.y)/(b.y-a.y);
      skinRadius=Math.max(skinRadius,a.x+(b.x-a.x)*t);
    }
    if(skinRadius<=0)continue;
    const x=hairPositions.getX(i),z=hairPositions.getZ(i);
    const radius=Math.hypot(x,z/.93);
    const scale=Math.max(1,(skinRadius+.016)/Math.max(radius,1e-6));
    hairPositions.setXYZ(i,x*scale,y,z*scale);
  }
  hairPositions.needsUpdate=true;
  hairGeometry.computeVertexNormals();
  hairGeometry.computeBoundingSphere();
  part(hairGeometry,materials.hair,0,0,0,head);
  // Clear rectangular frames with small corner radii, matching the reference photo.
  for(const x of [-.112,.112]){
    const w=.205,h=.139,r=.021;
    const shape=new THREE.Shape();
    shape.moveTo(-w/2+r,h/2);shape.lineTo(w/2-r,h/2);
    shape.quadraticCurveTo(w/2,h/2,w/2,h/2-r);shape.lineTo(w/2,-h/2+r);
    shape.quadraticCurveTo(w/2,-h/2,w/2-r,-h/2);shape.lineTo(-w/2+r,-h/2);
    shape.quadraticCurveTo(-w/2,-h/2,-w/2,-h/2+r);shape.lineTo(-w/2,h/2-r);
    shape.quadraticCurveTo(-w/2,h/2,-w/2+r,h/2);
    class FrameCurve extends THREE.Curve<THREE.Vector3>{
      constructor(){super();}
      getPoint(t:number,target=new THREE.Vector3()){
        const p=shape.getPointAt(t);return target.set(p.x,p.y,0);
      }
    }
    const curve=new FrameCurve();
    part(new THREE.TubeGeometry(curve,80,.0055,6,true),materials.frame,x,.025,-.245,head);
    box(w-.015,h-.015,.006,x,.025,-.244,materials.glass,.015,head);
  }
  rod(V(-.025,.04,-.246),V(.025,.04,-.246),.005,materials.frame,head);
  for(const sign of [-1,1])rod(V(sign*.205,.055,-.23),V(sign*.24,.055,.02),.006,materials.frame,head);
  // Sparse facial hair follows the same surface as the face, rather than a painted beard block.
  const stubblePositions:number[]=[];
  let seed=704;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<950;i++){
    const y=-.253+random()*.17, angle=(random()-.5)*2.55;
    let radius=0;
    for(let j=1;j<faceOutline.length;j++){
      const a=faceOutline[j-1],b=faceOutline[j];
      if(y>=Math.min(a.y,b.y)&&y<=Math.max(a.y,b.y)&&Math.abs(b.y-a.y)>1e-8)
        radius=Math.max(radius,a.x+(b.x-a.x)*(y-a.y)/(b.y-a.y));
    }
    const x=Math.sin(angle)*radius;
    const moustache=y>-.122&&y<-.097&&Math.abs(x)<.076;
    const chin=y<-.199||Math.abs(x)>.14||(y<-.17&&Math.abs(x)<.024);
    if(!moustache&&!chin)continue;
    stubblePositions.push(Math.sin(angle)*(radius+.003),y,-Math.cos(angle)*(radius+.003)*.93);
  }
  const stubbleGeometry=new THREE.BufferGeometry();
  stubbleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(stubblePositions,3));geometrySet.add(stubbleGeometry);
  const stubbleMaterial=new THREE.PointsMaterial({color:0x372821,size:.0035,transparent:true,opacity:.48,depthWrite:false});materialSet.add(stubbleMaterial);
  head.add(new THREE.Points(stubbleGeometry,stubbleMaterial));
  const hands:THREE.Group[]=[];
  const handHeight=1.197;
  for(const sign of [-1,1]){
    rod(V(sign*.29,1.36,.56),V(sign*.43,1.22,.24),.095,materials.blue);
    rod(V(sign*.43,1.22,.24),V(sign*.22,1.205,.015),.043,materials.skin);
    const hand=new THREE.Group();hand.position.set(sign*.21,handHeight,-.04);studio.add(hand);hands.push(hand);
    const palm=ball(.069,0,0,0,materials.skin,hand);palm.scale.set(1,.42,1.05);
    // Curved, rounded fingers overlap the palm and sit above the keycaps.
    for(let f=0;f<4;f++){
      const x=(f-1.5)*.029, length=[.063,.082,.075,.055][f];
      const knuckle=V(x,.009,-.063);
      rod(V(x,0,-.035),knuckle,.014,materials.skin,hand);
      rod(knuckle,V(x,-.014,-.052-length),.013,materials.skin,hand);
      ball(.014,x,.009,-.063,materials.skin,hand);
    }
    rod(V(-sign*.05,0,.015),V(-sign*.081,-.005,-.035),.019,materials.skin,hand);
    rod(V(-sign*.081,-.005,-.035),V(-sign*.065,-.016,-.069),.016,materials.skin,hand);
  }
  const seatedPerson=new THREE.Group();
  for(const child of studio.children.slice(seatedStart))seatedPerson.add(child);
  studio.add(seatedPerson);
  // Laptop with an actual emissive canvas screen and individual keys.
  const laptop=new THREE.Group();laptop.userData.action="work";studio.add(laptop);
  box(.98,.045,.60,0,1.13,-.05,materials.pale,.025,laptop);
  // The person sits at +Z: hinge at the far (-Z) edge, trackpad closest to the hands.
  for(let row=0;row<4;row++)for(let col=0;col<10;col++)box(.062,.009,.053,(col-4.5)*.079,1.158,-.23+row*.065,materials.white,.008,laptop);
  box(.22,.003,.1,0,1.158,.15,materials.white,.008,laptop);
  const lid=new THREE.Group();lid.position.set(0,1.16,-.34);lid.rotation.x=-.22;laptop.add(lid);
  box(.98,.43,.035,0,.215,0,materials.blue,.025,lid);
  const codeCanvas=document.createElement('canvas');codeCanvas.width=768;codeCanvas.height=440;
  const codeContext=codeCanvas.getContext('2d')!;
  const texture=new THREE.CanvasTexture(codeCanvas);texture.colorSpace=THREE.SRGBColorSpace;
  const screenMaterial=new THREE.MeshBasicMaterial({map:texture});materialSet.add(screenMaterial);
  part(new THREE.PlaneGeometry(.88,.34),screenMaterial,0,.215,.02,lid);
  const backLogo=ball(.027,0,.24,-.026,materials.pale,lid);backLogo.scale.z=.15;
  // Articulated desk lamp with a lit bulb and a local light that reaches the desk.
  const lamp=new THREE.Group();lamp.userData.action="lamp";studio.add(lamp);
  part(new THREE.CylinderGeometry(.15,.16,.035,32),materials.blue,.9,1.126,-.14,lamp);
  rod(V(.9,1.15,-.14),V(1.02,1.5,.02),.022,materials.blue,lamp);
  ball(.038,1.02,1.5,.02,materials.pale,lamp);
  rod(V(1.02,1.5,.02),V(.83,1.65,-.05),.022,materials.blue,lamp);
  const shade=part(new THREE.CylinderGeometry(.055,.12,.16,32,1,true),materials.blue,.80,1.6,-.05,lamp);shade.rotation.z=-.5;
  const bulb=ball(.063,.765,1.53,-.05,materials.bulb,lamp);bulb.scale.y=.3;
  const lampLight=new THREE.PointLight(0xc3d8ff,1.4,2.2,2);lampLight.position.set(.74,1.48,-.05);scene.add(lampLight);
  // Small personal details: mug, notebook and a pen.
  const ceramic=materials.white.clone();ceramic.side=THREE.DoubleSide;
  const mug=part(new THREE.CylinderGeometry(.075,.065,.13,28,1,true),ceramic,-.86,1.16,-.2);
  const rim=part(new THREE.TorusGeometry(.068,.007,8,32),materials.white,-.86,1.225,-.2);rim.rotation.x=-Math.PI/2;
  const coffee=part(new THREE.CircleGeometry(.067,32),materials.coffee,-.86,1.213,-.2);coffee.rotation.x=-Math.PI/2;
  const handle=part(new THREE.TorusGeometry(.05,.013,8,20),materials.white,-.94,1.17,-.2);handle.rotation.y=Math.PI/2;
  box(.33,.035,.42,-.85,1.13,.28,materials.blue,.01);
  rod(V(-.98,1.154,.3),V(-.77,1.154,.18),.009,materials.pale);
  mug.userData.detail="coffee";
  // Reuse the likeness and clothing geometry for an articulated floor exercise rig.
  const exercise=new THREE.Group();exercise.visible=false;exercise.userData.action="work";scene.add(exercise);
  const plank=new THREE.Group();exercise.add(plank);
  const exerciseTorso=torso.clone(true);exerciseTorso.position.set(0,.37,-.03);exerciseTorso.rotation.set(0,0,0);plank.add(exerciseTorso);
  const exerciseHead=head.clone(true);exerciseHead.position.set(0,1.03,-.06);exerciseHead.rotation.set(.08,0,0);plank.add(exerciseHead);
  const exerciseNeck=neck.clone();exerciseNeck.position.set(0,.73,-.04);plank.add(exerciseNeck);
  box(.45,.2,.32,0,0,0,materials.navy,.07,plank);
  const axisY=new THREE.Vector3(0,1,0);
  function articulatedSegment(length:number,radius:number,material:THREE.Material){
    return part(new THREE.CapsuleGeometry(radius,length-radius*2,6,14),material,0,0,0,exercise);
  }
  function positionSegment(mesh:THREE.Mesh,a:THREE.Vector3,b:THREE.Vector3,length?:number){
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    const direction=b.clone().sub(a);
    if(length)mesh.scale.y=direction.length()/length;
    mesh.quaternion.setFromUnitVectors(axisY,direction.normalize());
  }
  const exerciseLimbs=[-1,1].map((side,index)=>{
    const upper=articulatedSegment(.32,.085,materials.blue);
    const lower=articulatedSegment(.33,.045,materials.skin);
    const elbow=ball(.048,0,0,0,materials.skin,exercise);
    const hand=hands[index].clone(true);hand.position.set(side*.36,.045,-.47);exercise.add(hand);
    // Palms and fingers remain planted instead of following the animated shoulders.
    const leg=articulatedSegment(.9,.09,materials.navy);
    const shoe=new THREE.Group();shoe.position.set(side*.14,.13,1.20);shoe.rotation.x=.65;exercise.add(shoe);
    box(.17,.105,.29,0,0,0,materials.white,.035,shoe);
    box(.17,.025,.29,0,-.052,0,materials.pale,.009,shoe);
    return {side,upper,lower,elbow,leg};
  });
  function poseExercise(time:number){
    const pose=pushUpPose(time);plank.position.copy(pose.hips);plank.quaternion.copy(pose.rotation);
    exerciseLimbs.forEach((limb,index)=>{
      const arm=pose.arms[index];
      positionSegment(limb.upper,arm.shoulder,arm.elbow);
      positionSegment(limb.lower,arm.elbow,arm.wrist);
      limb.elbow.position.copy(arm.elbow);
      positionSegment(limb.leg,new THREE.Vector3(limb.side*.14,0,0).applyQuaternion(pose.rotation).add(pose.hips),V(limb.side*.14,.20,1.10),.9);
    });
  }
  poseExercise(0);
  // Contact shadows live on a transparent floor; the surrounding page remains white.
  const floorMaterial=new THREE.ShadowMaterial({opacity:.055});materialSet.add(floorMaterial);
  const floor=part(new THREE.PlaneGeometry(200,200),floorMaterial,0,.001,0,scene);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
  // Broad contact shadow grounds the scene without a hard, oversized silhouette.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=256;
  const shadowContext=shadowCanvas.getContext('2d')!;
  const shadowGradient=shadowContext.createRadialGradient(128,128,8,128,128,126);
  shadowGradient.addColorStop(0,'rgba(47,65,92,.18)');shadowGradient.addColorStop(.45,'rgba(47,65,92,.09)');shadowGradient.addColorStop(1,'rgba(47,65,92,0)');
  shadowContext.fillStyle=shadowGradient;shadowContext.fillRect(0,0,256,256);
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
  const contactMaterial=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false});materialSet.add(contactMaterial);
  const contact=part(new THREE.PlaneGeometry(3.9,2.8),contactMaterial,0,.004,.13,scene);contact.rotation.x=-Math.PI/2;contact.castShadow=false;contact.receiveShadow=false;
  scene.add(new THREE.HemisphereLight(0xffffff,0xc0cde3,1.9));
  const key=new THREE.DirectionalLight(0xffffff,2.6);key.position.set(-2.5,7,-1.5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;
  key.shadow.normalBias=.035;key.shadow.bias=-.00015;key.shadow.radius=7;key.shadow.blurSamples=12;scene.add(key);
  const fill=new THREE.DirectionalLight(0xc5d8fa,1.1);fill.position.set(3,3,3);scene.add(fill);
  let lit=true,working=true,disposed=false,frame=0,dirty=true,lastScreen=-1,lastRender=0;
  let breakBlend=0,exerciseTime=0,lastTick=0;
  function screen(time:number){
    codeContext.fillStyle='#11223b';codeContext.fillRect(0,0,768,440);
    codeContext.fillStyle='#49678e';codeContext.fillRect(0,0,768,42);
    for(let i=0;i<3;i++){codeContext.fillStyle=['#b8cbe6','#88a9d6','#6485b3'][i];codeContext.beginPath();codeContext.arc(23+i*21,21,5,0,Math.PI*2);codeContext.fill();}
    codeContext.font='21px monospace';codeContext.fillStyle='#b9cde9';
    const lines=working?['// one small idea at a time','const build = async () => {','  await understand(problem);','  return makeItWork();','};','','> building'+'.'.repeat(Math.floor(time)%3+1)]:['// movement break','','> doing a few push-ups'];
    lines.forEach((line,i)=>{codeContext.fillStyle=i===1?'#96bbf3':'#bed1ee';codeContext.fillText(line,34,88+i*40);});
    texture.needsUpdate=true;
  }
  const resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();dirty=true;};
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();let downX=0,downY=0;
  const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};
  const up=(e:PointerEvent)=>{
    if(Math.hypot(e.clientX-downX,e.clientY-downY)>5)return;
    const r=canvas.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(mouse,camera);
    for(const hit of raycaster.intersectObjects(working?[lamp,laptop]:[exercise],true)){
      let object:THREE.Object3D|null=hit.object;
      while(object){if(object.userData.action){onAction(object.userData.action);return;}object=object.parent;}
    }
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);
  const loop=(now:number)=>{
    if(disposed)return;
    const time=now/1000;
    const dt=Math.min(.05,lastTick?(now-lastTick)/1000:0);lastTick=now;
    if(!document.hidden){
      const previousBlend=breakBlend;
      breakBlend=reduced.matches?(working?0:1):THREE.MathUtils.damp(breakBlend,working?0:1,7,dt);
      if(Math.abs(breakBlend-(working?0:1))<.001)breakBlend=working?0:1;
      const transitioning=breakBlend!==previousBlend;
      if(transitioning){
        const offset=camera.position.clone().sub(controls.target);
        offset.multiplyScalar((1-.18*breakBlend)/(1-.18*previousBlend));
        controls.target.copy(workTarget).lerp(exerciseTarget,breakBlend);
        camera.position.copy(controls.target).add(offset);
        studio.scale.setScalar(1-THREE.MathUtils.smoothstep(breakBlend,0,.45));
        studio.visible=breakBlend<.45;
        lampLight.intensity=lit?1.4*(1-breakBlend):0;
        exercise.visible=breakBlend>.35;
        exercise.scale.setScalar(THREE.MathUtils.smoothstep(breakBlend,.35,1));
        dirty=true;renderer.shadowMap.needsUpdate=true;
      }
      const moving=!reduced.matches;
      if(!working&&breakBlend>.95&&!reduced.matches){exerciseTime+=dt;poseExercise(exerciseTime);renderer.shadowMap.needsUpdate=true;}
      if(moving&&working){torso.rotation.x=Math.sin(time*1.5)*.006;head.rotation.y=Math.sin(time*.35)*.018;hands.forEach((hand,i)=>hand.position.y=handHeight+Math.sin(time*11+i*2)*.003);}
      const changed=controls.update();
      if(lastScreen<0||(moving&&Math.floor(time)!==lastScreen)){screen(reduced.matches?0:time);lastScreen=Math.floor(time);dirty=true;}
      if(changed)dirty=true;
      if((dirty||moving)&&now-lastRender>32){renderer.render(scene,camera);dirty=false;lastRender=now;}
    }
    frame=requestAnimationFrame(loop);
  };
  frame=requestAnimationFrame(loop);
  canvas.dataset.parts=String(studio.getObjectsByProperty('type','Mesh').length);
  return {
    setLamp(value:boolean){lit=value;lampLight.intensity=lit?1.4*(1-breakBlend):0;materials.bulb.emissiveIntensity=lit?1:0;dirty=true;},
    setWorking(value:boolean){if(working===value)return;working=value;if(!working){exerciseTime=0;poseExercise(0);}screen(performance.now()/1000);dirty=true;},
    turn(direction:number){const offset=camera.position.clone().sub(controls.target);offset.applyAxisAngle(new THREE.Vector3(0,1,0),direction*.23);camera.position.copy(controls.target).add(offset);controls.update();dirty=true;},
    reset(){controls.reset();controls.target.copy(workTarget).lerp(exerciseTarget,breakBlend);camera.position.copy(workOffset).multiplyScalar(1-.18*breakBlend).add(controls.target);controls.update();dirty=true;},
    dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);controls.dispose();texture.dispose();shadowTexture.dispose();geometrySet.forEach(g=>g.dispose());materialSet.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();},
  };
}
