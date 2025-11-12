// Header transparente -> glass
const nav=document.getElementById('topNav');
const onScroll=()=>{if(window.scrollY>6) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');};
document.addEventListener('scroll',onScroll,{passive:true}); onScroll();

// Modal
const modal=document.getElementById('modal');
document.getElementById('openModal').onclick=()=>modal.classList.add('show');
document.getElementById('closeModal').onclick=()=>modal.classList.remove('show');
modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('show');});

// Slider mejorado con transiciones suaves
const slider=document.getElementById('profileSlider');
const imgs=[...slider.querySelectorAll('img')];
let idx=0; 
setInterval(()=>{
  imgs[idx].classList.remove('active'); 
  idx=(idx+1)%imgs.length; 
  imgs[idx].classList.add('active');
}, 4000);

// THREE.JS — ANIMACIÓN "OCÉANO" (Optimizada)
window.addEventListener('DOMContentLoaded',()=>{
  const canvas=document.getElementById('bg3d');
  const renderer=new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0x041021, 120, 420);
  const camera=new THREE.PerspectiveCamera(55,1,0.1,2000); camera.position.set(0,10,120);

  const light=new THREE.PointLight(0x5ab0ff, 1.2, 600); light.position.set(40,80,60); scene.add(light);

  const W=160, H=90, SP=2.2;
  const waveGeo=new THREE.BufferGeometry();
  const wavePositions=new Float32Array(W*H*3);
  let k=0; for(let y=0;y<H;y++){for(let x=0;x<W;x++){wavePositions[k++]= (x-W/2)*SP; wavePositions[k++]= (y-H/2)*SP; wavePositions[k++]= 0;}}
  waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions,3));
  const waveMat=new THREE.PointsMaterial({ size: 0.9, color:0x6fbaff, transparent:true, opacity:0.55});
  const waves=new THREE.Points(waveGeo, waveMat); waves.rotation.x=-Math.PI*0.36; scene.add(waves);

  const rings=new THREE.Group();
  function ring(r,color,rot){
    const geo=new THREE.TorusKnotGeometry(r, r*0.12, 160, 32, 2, 3); // Optimizado de 220 a 160
    const mat=new THREE.LineBasicMaterial({ color, transparent:true, opacity:0.22 });
    const lines=new THREE.LineSegments(new THREE.WireframeGeometry(geo), mat);
    lines.rotation.set(rot.x, rot.y, rot.z);
    rings.add(lines);
  }
  ring(18, 0x7cc3ff, new THREE.Euler(0.2,0.0,0.0));
  ring(26, 0x3aa2ff, new THREE.Euler(-0.3,0.5,0.2));
  ring(34, 0x93d0ff, new THREE.Euler(0.15,-0.6,0.4));
  scene.add(rings);

  function resize(){ const w=window.innerWidth,h=window.innerHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', resize); resize();

  let s=0; const updateScroll=()=>{ s = window.scrollY / (document.body.scrollHeight - window.innerHeight); };
  document.addEventListener('scroll', updateScroll, { passive:true }); updateScroll();

  let t=0; const tmp=new THREE.Object3D();
  function tick(){
    t+=0.016;
    const pos=waveGeo.attributes.position.array; let i=0;
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        const px=(x-W/2)*0.18, py=(y-H/2)*0.22;
        const z = Math.sin(px*2.2 + t*1.4 + s*6.0) * 2.0 + Math.cos(py*1.8 - t*1.1 + s*8.0) * 1.6;
        pos[i+2]= z; i+=3;
      }
    }
    waveGeo.attributes.position.needsUpdate = true;
    waves.rotation.z = s * Math.PI * 0.2;

    rings.rotation.y += 0.002 + s*0.01; rings.rotation.x = 0.15 + Math.sin(t*0.6)*0.04;
    rings.scale.setScalar(1 + Math.sin(t*0.9 + s*6)*0.03);

    renderer.render(scene,camera);
    requestAnimationFrame(tick);
  }
  tick();
});
