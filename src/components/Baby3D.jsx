import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { colors } from '../theme';

const MODEL_URL = '/models/baby.glb';

// Baştan Ayağa Fizik Muayene modülü için tam vücut 3D yenidoğan modeli.
// Parmakla/fareyle yatay sürüklenerek döndürülebilir. Muayene noktaları
// (points) 3D koordinatlara bağlıdır; her karede ekrana yansıtılıp
// renderPoint ile çizilen HTML butonlar o konuma taşınır.
//   points: [{ id, anchor: [x, y, z], normal?: [x, y, z] }]
//   renderPoint: (id) => ReactNode
//   focusHead: true ise kamera baş bölgesine yakınlaşır.
export default function Baby3D({ maxWidth = 300, height = 320, points = [], renderPoint, focusHead = false }) {
  const mountRef = useRef(null);
  const pointRefs = useRef({});
  const focusRef = useRef(focusHead);
  const pointsRef = useRef(points);

  useEffect(() => {
    focusRef.current = focusHead;
    pointsRef.current = points;
  }, [focusHead, points]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // --- Sahne, kamera, renderer ---
    const scene = new THREE.Scene();
    // Genişlik bulunduğu alana göre ayarlanır (en fazla maxWidth)
    let width = Math.min(maxWidth, mount.clientWidth || maxWidth);
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    const BODY_VIEW = { y: 0.1, dist: 8.2 };
    const HEAD_VIEW = { y: 1.05, dist: 4.6 };
    const view = { ...BODY_VIEW };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    mount.prepend(renderer.domElement);

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.min(maxWidth, mount.clientWidth);
      if (!w || w === width) return;
      width = w;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(mount);

    // --- Işıklar ---
    scene.add(new THREE.HemisphereLight(colors.cream, colors.tealBorder, 1.6));
    const key = new THREE.DirectionalLight('#FFF4EA', 2.2);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(colors.teal, 1.3);
    rim.position.set(-4, 1, -4);
    scene.add(rim);

    const disposables = [];
    const track = (obj) => { disposables.push(obj); return obj; };
    const mat = (color, extra = {}) => track(new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...extra }));

    const skin = mat('#F9D2BC', { roughness: 0.65 });
    const lineMat = mat(colors.tealDark, { roughness: 0.4 });

    const baby = new THREE.Group();
    scene.add(baby);

    const add = (geo, material, pos, scale, rot) => {
      const m = new THREE.Mesh(track(geo), material);
      m.position.set(...pos);
      if (scale) m.scale.set(...scale);
      if (rot) m.rotation.set(...rot);
      baby.add(m);
      return m;
    };

    // İki nokta arasına kapsül (kol/bacak parçası) yerleştirir
    const limb = (a, b, r) => {
      const va = new THREE.Vector3(...a);
      const vb = new THREE.Vector3(...b);
      const len = va.distanceTo(vb);
      const m = new THREE.Mesh(track(new THREE.CapsuleGeometry(r, len, 8, 24)), skin);
      m.position.copy(va).add(vb).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
      baby.add(m);
    };

    // --- Baş ---
    add(new THREE.SphereGeometry(0.8, 64, 64), skin, [0, 1.35, 0], [1, 1.03, 0.95]);
    [-1, 1].forEach((s) => {
      add(new THREE.SphereGeometry(0.17, 24, 24), skin, [s * 0.78, 1.3, -0.04], [0.55, 1, 0.8]);
      add(new THREE.SphereGeometry(0.13, 24, 24), mat(colors.coralPale, { transparent: true, opacity: 0.75, roughness: 0.9 }),
        [s * 0.42, 1.12, 0.6], [1, 0.7, 0.35], [0, s * 0.6, 0]);
      add(new THREE.TorusGeometry(0.1, 0.022, 12, 32, Math.PI), lineMat,
        [s * 0.27, 1.4, 0.72], null, [0, s * 0.36, Math.PI]);
    });
    add(new THREE.SphereGeometry(0.06, 24, 24), skin, [0, 1.25, 0.77]);
    add(new THREE.TorusGeometry(0.07, 0.018, 10, 24, Math.PI), lineMat, [0, 1.06, 0.7], null, [-0.35, 0, Math.PI]);
    add(new THREE.TorusGeometry(0.11, 0.03, 12, 32, Math.PI * 1.5), mat('#9A6A4E', { roughness: 0.7 }),
      [0.04, 2.17, 0.22], null, [-0.5, 0, 0.6]);

    // --- Gövde ---
    add(new THREE.CylinderGeometry(0.28, 0.32, 0.3, 24), skin, [0, 0.62, 0]);
    add(new THREE.CapsuleGeometry(0.62, 0.7, 12, 32), skin, [0, -0.05, 0], [1, 1, 0.8]);

    // Umbilikal kord + klemp
    add(new THREE.CylinderGeometry(0.05, 0.06, 0.16, 16), mat('#E9C9A0', { roughness: 0.8 }),
      [0.0, -0.3, 0.52], null, [Math.PI / 2.4, 0, 0]);
    add(new THREE.BoxGeometry(0.2, 0.05, 0.05), mat(colors.teal), [0.0, -0.31, 0.6]);

    // Bez
    add(new THREE.SphereGeometry(0.68, 48, 32), mat('#FFFFFF', { roughness: 0.85 }), [0, -0.78, 0], [1.02, 0.6, 0.86]);

    // --- Kollar (yenidoğan fleksiyon postürü) ---
    [-1, 1].forEach((s) => {
      const shoulder = [s * 0.55, 0.5, 0];
      const elbow = [s * 0.98, 0.0, 0.18];
      const hand = [s * 0.86, 0.5, 0.5];
      limb(shoulder, elbow, 0.17);
      limb(elbow, hand, 0.15);
      add(new THREE.SphereGeometry(0.16, 24, 24), skin, hand, [1, 1.1, 0.8]);
    });

    // --- Bacaklar (kurbağa postürü) ---
    [-1, 1].forEach((s) => {
      const hip = [s * 0.36, -0.82, 0.05];
      const knee = [s * 0.98, -1.25, 0.38];
      const ankle = [s * 0.62, -1.72, 0.45];
      limb(hip, knee, 0.22);
      limb(knee, ankle, 0.18);
      add(new THREE.SphereGeometry(0.18, 24, 24), skin, [s * 0.58, -1.8, 0.6], [0.85, 0.7, 1.4]);
    });

    // Gölge diski
    const shadow = new THREE.Mesh(
      track(new THREE.CircleGeometry(1.3, 48)),
      track(new THREE.MeshBasicMaterial({ color: colors.tealDark, transparent: true, opacity: 0.08 })),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.05;
    shadow.scale.set(1, 0.45, 1);
    scene.add(shadow);

    // --- Gerçekçi model (opsiyonel) ---
    // public/models/baby.glb varsa yüklenir ve yukarıdaki basit model gizlenir.
    // Model otomatik ölçeklenir (boy ~4 birim, ayak tabanı y=-1.95, ortalanmış).
    let disposed = false;
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(MODEL_URL, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const sizeV = box.getSize(new THREE.Vector3());
      model.scale.setScalar(4.1 / sizeV.y);
      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -1.95 - box.min.y, -center.z);
      model.traverse((o) => {
        if (o.isMesh) {
          track(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(track);
        }
      });
      baby.children.forEach((c) => { c.visible = false; });
      baby.add(model);
    }, undefined, () => { /* model dosyası yoksa basit model kalır */ });

    // --- Sürükleyerek döndürme ---
    let yaw = 0;
    let velocity = 0;
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastInteraction = -Infinity;
    const clock = new THREE.Clock();

    const onDown = (e) => { dragging = true; moved = false; lastX = e.clientX; };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      if (!moved && Math.abs(dx) < 4) return;
      moved = true;
      lastX = e.clientX;
      velocity = dx * 0.012;
      yaw += velocity;
      lastInteraction = clock.getElapsedTime();
    };
    const onUp = () => { dragging = false; };
    // Sürükleme sonrası oluşan "click"in muayene noktasını seçmesini engelle
    const onClickCapture = (e) => { if (moved) { e.stopPropagation(); moved = false; } };
    mount.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    mount.addEventListener('click', onClickCapture, true);

    // --- Animasyon ---
    const tmp = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    let raf = 0;

    const renderFrame = () => {
      const t = clock.getElapsedTime();

      if (!dragging) {
        yaw += velocity;
        velocity *= 0.92;
        // Bir süre dokunulmazsa öne dönüp hafifçe sallanır
        if (t - lastInteraction > 2.5) {
          const rest = Math.round(yaw / (Math.PI * 2)) * Math.PI * 2 + Math.sin(t * 0.5) * 0.25;
          yaw += (rest - yaw) * 0.03;
        }
      }
      baby.rotation.y = yaw;
      baby.position.y = Math.sin(t * 1.2) * 0.03;

      const target = focusRef.current ? HEAD_VIEW : BODY_VIEW;
      view.y += (target.y - view.y) * 0.08;
      view.dist += (target.dist - view.dist) * 0.08;
      camera.position.set(0, view.y + 0.3, view.dist);
      camera.lookAt(0, view.y, 0);
      camera.updateMatrixWorld();

      renderer.render(scene, camera);

      // Muayene noktalarını 3D konumdan ekrana yansıt
      camera.getWorldDirection(camDir);
      pointsRef.current.forEach(({ id, anchor, normal: n }) => {
        const el = pointRefs.current[id];
        if (!el) return;
        tmp.set(...anchor);
        if (n) normal.set(...n).normalize();
        else normal.set(anchor[0], 0, anchor[2]).normalize();
        baby.localToWorld(tmp);
        normal.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const facing = normal.dot(camDir) < 0.15;
        tmp.project(camera);
        const x = (tmp.x * 0.5 + 0.5) * width;
        const y = (-tmp.y * 0.5 + 0.5) * height;
        const inView = x > 6 && x < width - 6 && y > 6 && y < height - 6;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        el.style.opacity = facing && inView ? '1' : '0';
        el.style.pointerEvents = facing && inView ? 'auto' : 'none';
      });

      if (!reduceMotion || dragging || Math.abs(velocity) > 0.001) raf = requestAnimationFrame(renderFrame);
      else raf = requestAnimationFrame(() => setTimeout(renderFrame, 100));
    };
    renderFrame();

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(raf);
      mount.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      mount.removeEventListener('click', onClickCapture, true);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [maxWidth, height]);

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="3D yenidoğan modeli — döndürmek için sürükleyin"
      style={{ position: 'relative', width: '100%', maxWidth, height, margin: '0 auto', overflow: 'hidden', touchAction: 'pan-y', cursor: 'grab', userSelect: 'none' }}
    >
      {points.map(({ id }) => (
        <div
          key={id}
          ref={(el) => { pointRefs.current[id] = el; }}
          style={{ position: 'absolute', left: 0, top: 0, opacity: 0, transition: 'opacity 0.2s' }}
        >
          {renderPoint?.(id)}
        </div>
      ))}
    </div>
  );
}
