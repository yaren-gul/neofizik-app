import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { colors } from '../theme';

// 3D bebek başı + etrafında dönen yörünge halkaları (Three.js)
export default function BabyOrbit({ size = 160 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // --- Sahne, kamera, renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    // --- Işıklar ---
    scene.add(new THREE.HemisphereLight(colors.cream, colors.tealBorder, 1.6));
    const key = new THREE.DirectionalLight('#FFF4EA', 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(colors.teal, 1.4);
    rim.position.set(-4, 1, -3);
    scene.add(rim);

    const disposables = [];
    const track = (obj) => { disposables.push(obj); return obj; };
    const mat = (color, extra = {}) => track(new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...extra }));

    // --- Bebek başı ---
    const baby = new THREE.Group();
    scene.add(baby);

    const skin = mat('#F9D2BC', { roughness: 0.65 });
    const head = new THREE.Mesh(track(new THREE.SphereGeometry(1, 64, 64)), skin);
    head.scale.set(1, 1.04, 0.95);
    baby.add(head);

    // Kulaklar
    const earGeo = track(new THREE.SphereGeometry(0.22, 32, 32));
    [-1, 1].forEach((s) => {
      const ear = new THREE.Mesh(earGeo, skin);
      ear.position.set(s * 0.97, -0.05, -0.05);
      ear.scale.set(0.55, 1, 0.8);
      baby.add(ear);
    });

    // Yanaklar (allık)
    const blush = mat(colors.coralPale, { transparent: true, opacity: 0.75, roughness: 0.9 });
    const cheekGeo = track(new THREE.SphereGeometry(0.17, 32, 32));
    [-1, 1].forEach((s) => {
      const cheek = new THREE.Mesh(cheekGeo, blush);
      cheek.position.set(s * 0.52, -0.28, 0.73);
      cheek.scale.set(1, 0.7, 0.35);
      cheek.rotation.y = s * 0.6;
      baby.add(cheek);
    });

    // Kapalı (uyuyan) gözler
    const lineMat = mat(colors.tealDark, { roughness: 0.4 });
    const eyeGeo = track(new THREE.TorusGeometry(0.13, 0.028, 12, 32, Math.PI));
    [-1, 1].forEach((s) => {
      const eye = new THREE.Mesh(eyeGeo, lineMat);
      eye.position.set(s * 0.34, 0.06, 0.9);
      eye.rotation.set(0, s * 0.36, Math.PI);
      baby.add(eye);
    });

    // Burun
    const nose = new THREE.Mesh(track(new THREE.SphereGeometry(0.075, 24, 24)), skin);
    nose.position.set(0, -0.15, 0.95);
    baby.add(nose);

    // Ağız
    const mouth = new THREE.Mesh(track(new THREE.TorusGeometry(0.09, 0.022, 10, 24, Math.PI)), lineMat);
    mouth.position.set(0, -0.38, 0.87);
    mouth.rotation.set(-0.35, 0, Math.PI);
    baby.add(mouth);

    // Tepedeki saç kıvrımı
    const curl = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.13, 0.035, 12, 32, Math.PI * 1.5)),
      mat('#9A6A4E', { roughness: 0.7 }),
    );
    curl.position.set(0.05, 1.05, 0.25);
    curl.rotation.set(-0.5, 0, 0.6);
    baby.add(curl);

    // --- Yörüngeler ---
    const orbits = new THREE.Group();
    orbits.rotation.set(1.15, 0, -0.35);
    scene.add(orbits);

    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(1.75, 0.014, 8, 160)),
      mat(colors.teal, { transparent: true, opacity: 0.45 }),
    );
    orbits.add(ring);

    // Noktalı dış halka
    const outer = new THREE.Group();
    outer.rotation.set(-0.5, 0.35, 0);
    scene.add(outer);
    const dotGeo = track(new THREE.SphereGeometry(0.022, 8, 8));
    const dotMat = mat(colors.tealBorder);
    const DOTS = 64;
    for (let i = 0; i < DOTS; i += 1) {
      const a = (i / DOTS) * Math.PI * 2;
      const d = new THREE.Mesh(dotGeo, dotMat);
      d.position.set(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0);
      outer.add(d);
    }

    // Halka üzerinde dönen coral nokta
    const satellite = new THREE.Group();
    const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.12, 32, 32)), mat(colors.coral, { emissive: colors.coral, emissiveIntensity: 0.25 }));
    const halo = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 32, 32)), mat(colors.coralSoft, { transparent: true, opacity: 0.55 }));
    satellite.add(core, halo);
    orbits.add(satellite);

    // Uçuşan küçük teal parçacıklar
    const sparkGeo = track(new THREE.SphereGeometry(0.045, 12, 12));
    const sparkMat = mat(colors.teal, { transparent: true, opacity: 0.5 });
    const sparks = [
      [-1.9, -1.3, 0.3], [1.95, -1.05, -0.2], [-1.85, 0.85, 0.1], [1.4, 1.55, -0.4],
    ].map(([x, y, z], i) => {
      const m = new THREE.Mesh(sparkGeo, sparkMat);
      m.position.set(x, y, z);
      m.userData = { baseY: y, phase: i * 1.7 };
      scene.add(m);
      return m;
    });

    // --- Fare/dokunma ile hafif eğilme ---
    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => { pointer.x = 0; pointer.y = 0; };
    mount.addEventListener('pointermove', onMove);
    mount.addEventListener('pointerleave', onLeave);

    // --- Animasyon döngüsü ---
    const clock = new THREE.Clock();
    let raf = 0;
    const renderFrame = () => {
      const t = clock.getElapsedTime();

      const targetY = Math.sin(t * 0.6) * 0.3 + pointer.x * 0.5;
      const targetX = Math.sin(t * 0.45) * 0.06 + pointer.y * 0.3;
      baby.rotation.y += (targetY - baby.rotation.y) * 0.06;
      baby.rotation.x += (targetX - baby.rotation.x) * 0.06;
      baby.position.y = Math.sin(t * 1.2) * 0.05;

      const a = t * 0.7;
      satellite.position.set(Math.cos(a) * 1.75, Math.sin(a) * 1.75, 0);
      halo.scale.setScalar(1 + Math.sin(t * 3) * 0.12);
      outer.rotation.z = t * 0.08;

      sparks.forEach((s) => {
        s.position.y = s.userData.baseY + Math.sin(t * 1.1 + s.userData.phase) * 0.08;
      });

      renderer.render(scene, camera);
      if (!reduceMotion) raf = requestAnimationFrame(renderFrame);
    };
    renderFrame();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('pointerleave', onLeave);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="3D bebek illüstrasyonu"
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}
