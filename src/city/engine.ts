import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { perSide, seeded, type Home, type Layout, type Lot, type Tower } from "./layout";

/** Lot spacing and storey height, in world units. */
const LOT = 4;
const FLOOR = 0.42;
const ROOM = 0.42;

const C = {
  sky: new THREE.Color("#070812"),
  skyLow: new THREE.Color("#1d2140"),
  ground: "#0e1019",
  street: "#191c2b",
  wall: "#272b45",
  roof: "#353a5c",
  house: "#352f4d",
  houseRoof: "#55394a",
  park: "#14261d",
  dark: new THREE.Color("#10131f"),
  lit: new THREE.Color("#ffcf73").multiplyScalar(1.25),
  warm: new THREE.Color("#ffb85a").multiplyScalar(0.5),
  late: new THREE.Color("#ff8f3a"),
  flash: new THREE.Color("#fff4d6").multiplyScalar(4),
};

export interface Picked {
  /** The building (project) under the pointer. */
  name: string | null;
  /** The home (task) under the pointer. */
  home: Home | null;
  floor: string | null;
  x: number;
  y: number;
}

export interface EngineOptions {
  interactive?: boolean;
  autoRotate?: boolean;
  /** Labels over buildings. */
  labels?: boolean;
  /** Now and then, someone moves in on their own (the hero's living city). */
  alive?: boolean;
  /** Starting camera distance multiplier. */
  zoom?: number;
  /** Let the mouse wheel zoom (off where the page should scroll instead). */
  wheelZoom?: boolean;
  onMoveIn?: (total: number) => void;
  onHover?: (p: Picked | null) => void;
  onReady?: () => void;
}

interface Slot {
  key: string;
  home: Home;
  lot: string;
  floor: string | null;
  index: number;
}

type Tween = { from: THREE.Vector3; to: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3; start: number; ms: number };

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * A night city in three.js: towers with floors of windows, houses with porch
 * lights, parks, streets with traffic, and bloom on everything lit. Feed it a
 * layout; feed it a new one and windows that just lit up flare on.
 */
export class CityEngine {
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer | null = null;
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(34, 1, 0.1, 600);
  private controls: OrbitControls | null = null;
  private city = new THREE.Group();
  private windows: THREE.InstancedMesh | null = null;
  private slots: Slot[] = [];
  private litKeys = new Set<string>();
  private flaring: { i: number; t: number }[] = [];
  private lateIdx: number[] = [];
  private bodies: THREE.Mesh[] = [];
  private labels: CSS2DObject[] = [];
  private cars: { obj: THREE.Object3D; a: THREE.Vector3; b: THREE.Vector3; t: number; speed: number }[] = [];
  private disposables: { dispose: () => void }[] = [];
  private cityDisposables: { dispose: () => void }[] = [];
  private raf = 0;
  private visible = true;
  private last = performance.now();
  private tween: Tween | null = null;
  private aliveTimer = 0;
  private center = new THREE.Vector3();
  private radius = 20;
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private hoverTarget: THREE.Mesh | null = null;
  private hoverMat: THREE.MeshStandardMaterial;
  private wallMat: THREE.MeshStandardMaterial;
  private destroyed = false;
  private fade = 0;
  /** Turn slowly on our own (when there are no controls to do it). */
  private spin = false;

  constructor(
    private host: HTMLElement,
    private layout: Layout,
    private opts: EngineOptions = {},
  ) {
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = !small;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.domElement.className = "city-canvas";
    // Fades in as the first frames draw (done here, not in CSS, so it never waits on the compositor).
    this.renderer.domElement.style.opacity = "0";
    host.appendChild(this.renderer.domElement);
    if (opts.labels) {
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.domElement.className = "city-labels";
      host.appendChild(this.labelRenderer.domElement);
    }

    this.scene.fog = new THREE.Fog("#0b0d18", 60, 190);
    this.wallMat = this.keep(new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.75, metalness: 0.1 }));
    this.hoverMat = this.keep(new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.7, emissive: "#6a5cff", emissiveIntensity: 0.14 }));
    this.addSky();
    this.addLights(small);
    this.scene.add(this.city);
    this.build(layout, false);

    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.5, 0.86);
    composer.addPass(this.bloom);
    composer.addPass(new OutputPass());
    this.composer = composer;

    this.home(opts.zoom ?? 1);
    // On touch screens a full-width city would trap the page's scrolling, so
    // it turns on its own there instead of following a finger.
    const touch = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    if (opts.interactive && !touch) {
      const c = new OrbitControls(this.camera, this.renderer.domElement);
      c.enableDamping = true;
      c.dampingFactor = 0.07;
      c.minPolarAngle = 0.2;
      c.maxPolarAngle = 1.36;
      c.minDistance = this.radius * 0.35;
      c.maxDistance = this.radius * 3.2;
      c.enablePan = false;
      c.enableZoom = !!opts.wheelZoom;
      c.target.copy(this.center);
      c.autoRotate = !!opts.autoRotate && !reducedMotion();
      c.autoRotateSpeed = 0.45;
      c.addEventListener("start", () => {
        c.autoRotate = false;
        this.tween = null;
      });
      this.controls = c;
      this.bindPointer();
    }

    this.spin = !!opts.autoRotate && !this.controls;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.loop();
    });
    this.io.observe(host);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.resize();
    if (opts.alive && !reducedMotion()) this.aliveTimer = window.setInterval(() => this.moveSomeoneIn(), 1400);
    this.loop();
    opts.onReady?.();
  }

  /** Swap in a new layout; homes that just got lit flare on. */
  update(layout: Layout) {
    this.layout = layout;
    this.build(layout, true);
    if (this.controls) {
      this.controls.minDistance = this.radius * 0.35;
      this.controls.maxDistance = this.radius * 3.2;
    }
  }

  /** Glide the camera to look at a point from a distance and angle. */
  flyTo(target: [number, number, number], dist: number, polar = 0.95, azimuth = 0.8, ms = 1600) {
    const t = new THREE.Vector3(...target);
    const to = new THREE.Vector3(
      t.x + dist * Math.sin(polar) * Math.cos(azimuth),
      t.y + dist * Math.cos(polar),
      t.z + dist * Math.sin(polar) * Math.sin(azimuth),
    );
    const fromT = this.controls ? this.controls.target.clone() : this.center.clone();
    if (this.controls) this.controls.autoRotate = false;
    this.tween = { from: this.camera.position.clone(), to, fromT, toT: t, start: performance.now(), ms: reducedMotion() ? 1 : ms };
  }

  /** Where a lot's building stands, and how tall it is. */
  lotCenter(id: string): [number, number, number] | null {
    const lot = this.layout.lots.find((l) => l.id === id);
    if (!lot) return null;
    const h = lot.kind === "tower" ? lot.floors.length * FLOOR : 0.5;
    return [lot.gx * LOT, h * 0.5, lot.gy * LOT];
  }

  /** Back to the overview. */
  goHome(ms = 1400) {
    const d = this.radius * (this.opts.zoom ?? 1);
    this.flyTo([this.center.x, this.center.y, this.center.z], d, 0.98, 0.78, ms);
  }

  setAutoRotate(on: boolean) {
    if (this.controls) this.controls.autoRotate = on && !reducedMotion();
    this.spin = on;
  }

  /** Step closer (f < 1) or further away (f > 1). */
  zoomBy(f: number) {
    const target = this.controls ? this.controls.target : this.center;
    const off = this.camera.position.clone().sub(target);
    const min = this.radius * 0.3;
    const max = this.radius * 3.2;
    const len = Math.min(max, Math.max(min, off.length() * f));
    const to = target.clone().add(off.setLength(len));
    this.tween = { from: this.camera.position.clone(), to, fromT: target.clone(), toT: target.clone(), start: performance.now(), ms: reducedMotion() ? 1 : 500 };
  }

  /** Light every dark window at once, in a quick wave (the story's finale). */
  lightAll() {
    let delay = 0;
    this.slots.forEach((s, i) => {
      if (s.home.lit) return;
      s.home.lit = true;
      this.litKeys.add(s.key);
      this.flaring.push({ i, t: -(delay += 0.004) });
    });
    this.lateIdx = [];
  }

  /** Someone moves into `n` empty homes of a lot, one after another. */
  lightSome(lotId: string, n: number) {
    let delay = 0;
    for (const sl of this.slots.filter((x) => x.lot === lotId && !x.home.lit).slice(0, n)) {
      sl.home.lit = true;
      sl.home.late = false;
      this.litKeys.add(sl.key);
      this.lateIdx = this.lateIdx.filter((i) => i !== sl.index);
      this.flaring.push({ i: sl.index, t: -(delay += 0.18) });
    }
  }

  /** `n` empty homes of a lot start being readied: a faint glow. */
  glowSome(lotId: string, n: number) {
    if (!this.windows) return;
    for (const sl of this.slots.filter((x) => x.lot === lotId && !x.home.lit && !x.home.readying).slice(0, n)) {
      sl.home.readying = true;
      this.windows.setColorAt(sl.index, C.warm);
    }
    if (this.windows.instanceColor) this.windows.instanceColor.needsUpdate = true;
  }

  dispose() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.clearInterval(this.aliveTimer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.ro.disconnect();
    this.io.disconnect();
    this.controls?.dispose();
    this.clearCity();
    for (const d of this.disposables) d.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.labelRenderer?.domElement.remove();
  }

  // ——— internals ———

  private keep<T extends { dispose: () => void }>(x: T): T {
    this.disposables.push(x);
    return x;
  }
  private keepCity<T extends { dispose: () => void }>(x: T): T {
    this.cityDisposables.push(x);
    return x;
  }

  private onVisibility = () => {
    if (!document.hidden) this.loop();
  };

  private addSky() {
    const geo = this.keep(new THREE.SphereGeometry(300, 32, 16));
    const mat = this.keep(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: C.sky }, bottom: { value: C.skyLow } },
        vertexShader: "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y * 1.7 + 0.12, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, h), 1.0); }",
      }),
    );
    this.scene.add(new THREE.Mesh(geo, mat));
    const rnd = seeded(3);
    const pts: number[] = [];
    for (let i = 0; i < 1400; i++) {
      const u = rnd() * Math.PI * 2;
      const v = 0.06 + rnd() * 1.35;
      pts.push(260 * Math.cos(u) * Math.cos(v), 260 * Math.sin(v), 260 * Math.sin(u) * Math.cos(v));
    }
    const sg = this.keep(new THREE.BufferGeometry());
    sg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const sm = this.keep(new THREE.PointsMaterial({ color: "#cfd3ff", size: 1.1, fog: false, transparent: true, opacity: 0.75 }));
    this.scene.add(new THREE.Points(sg, sm));
    // A moon.
    const moon = new THREE.Mesh(this.keep(new THREE.SphereGeometry(6, 32, 16)), this.keep(new THREE.MeshBasicMaterial({ color: new THREE.Color("#e8ebff").multiplyScalar(1.6), fog: false, toneMapped: false })));
    moon.position.set(-120, 120, -150);
    this.scene.add(moon);
  }

  private addLights(small: boolean) {
    this.scene.add(new THREE.HemisphereLight("#5c64a0", "#090a10", 1.05));
    const moon = new THREE.DirectionalLight("#c8d0ff", 1.25);
    moon.position.set(-24, 40, 18);
    moon.castShadow = !small;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.bias = -0.0006;
    const r = 36;
    Object.assign(moon.shadow.camera, { left: -r, right: r, top: r, bottom: -r, far: 140 });
    this.scene.add(moon, moon.target);
  }

  private clearCity() {
    for (const l of this.labels) {
      l.element.remove();
      l.removeFromParent();
    }
    this.labels = [];
    this.city.clear();
    for (const d of this.cityDisposables) d.dispose();
    this.cityDisposables = [];
    this.bodies = [];
    this.cars = [];
    this.windows = null;
    this.hoverTarget = null;
  }

  private build(layout: Layout, animate: boolean) {
    const wasLit = new Set(this.litKeys);
    this.clearCity();
    let g0 = 0;
    let g1 = 0;
    let tallest = 1;
    for (const l of layout.lots) {
      g0 = Math.min(g0, l.gx, l.gy);
      g1 = Math.max(g1, l.gx, l.gy);
    }
    const lo = g0 * LOT - LOT / 2;
    const hi = g1 * LOT + LOT / 2;
    const span = hi - lo;
    const mid = (lo + hi) / 2;

    // Ground and streets.
    const ground = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(span + 2, 0.4, span + 2)), this.keepCity(new THREE.MeshStandardMaterial({ color: C.ground, roughness: 1 })));
    ground.position.set(mid, -0.2, mid);
    ground.receiveShadow = true;
    this.city.add(ground);
    const streetMat = this.keepCity(new THREE.MeshStandardMaterial({ color: C.street, roughness: 0.9 }));
    const lines: number[] = [];
    for (let g = g0; g <= g1 + 1; g++) lines.push((g - 0.5) * LOT);
    for (const s of lines) {
      for (const along of [true, false]) {
        const st = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(along ? 0.6 : span + 0.6, 0.02, along ? span + 0.6 : 0.6)), streetMat);
        st.position.set(along ? s : mid, 0.011, along ? mid : s);
        st.receiveShadow = true;
        this.city.add(st);
      }
    }
    // Street lamps at the crossings.
    const lampGeo = this.keepCity(new THREE.SphereGeometry(0.08, 8, 6));
    const lampMat = this.keepCity(new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd58a").multiplyScalar(2.2), toneMapped: false }));
    const postGeo = this.keepCity(new THREE.CylinderGeometry(0.022, 0.022, 0.6, 6));
    const postMat = this.keepCity(new THREE.MeshStandardMaterial({ color: "#5b6080" }));
    for (const x of lines) {
      for (const z of lines) {
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(x + 0.42, 0.3, z + 0.42);
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(x + 0.42, 0.62, z + 0.42);
        this.city.add(post, lamp);
      }
    }

    // Lots.
    const slots: Slot[] = [];
    const mats: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    const roofMat = this.keepCity(new THREE.MeshStandardMaterial({ color: C.roof, roughness: 0.8 }));
    const houseMat = this.keepCity(new THREE.MeshStandardMaterial({ color: C.house, roughness: 0.8 }));
    const houseRoofMat = this.keepCity(new THREE.MeshStandardMaterial({ color: C.houseRoof, roughness: 0.7, flatShading: true }));
    const houseGeo = this.keepCity(new THREE.BoxGeometry(0.7, 0.48, 0.64));
    const houseRoofGeo = this.keepCity(new THREE.ConeGeometry(0.56, 0.34, 4));
    const porchGeo = this.keepCity(new THREE.SphereGeometry(0.04, 8, 6));
    const porchMat = this.keepCity(new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd27a").multiplyScalar(2.4), toneMapped: false }));
    const treeTrunk = this.keepCity(new THREE.CylinderGeometry(0.03, 0.04, 0.26, 6));
    const treeTop = this.keepCity(new THREE.IcosahedronGeometry(0.22, 0));
    const trunkMat = this.keepCity(new THREE.MeshStandardMaterial({ color: "#5d4330" }));
    const leafMat = this.keepCity(new THREE.MeshStandardMaterial({ color: "#2f7a52", flatShading: true, roughness: 0.85 }));
    const addTree = (x: number, z: number, s = 1) => {
      const t = new THREE.Mesh(treeTrunk, trunkMat);
      t.position.set(x, 0.13 * s, z);
      t.scale.setScalar(s);
      const l = new THREE.Mesh(treeTop, leafMat);
      l.position.set(x, 0.38 * s, z);
      l.scale.set(s, s * 1.15, s);
      l.castShadow = true;
      this.city.add(t, l);
    };
    const put = (m: THREE.Matrix4, home: Home, lot: string, floor: string | null, key: string) => {
      slots.push({ key, home, lot, floor, index: slots.length });
      mats.push(m);
    };
    const rnd = seeded(11);

    for (const lot of layout.lots) {
      const cx = lot.gx * LOT;
      const cz = lot.gy * LOT;
      if (lot.kind === "park") {
        const grass = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(LOT - 1, 0.06, LOT - 1)), this.keepCity(new THREE.MeshStandardMaterial({ color: C.park, roughness: 1 })));
        grass.position.set(cx, 0.03, cz);
        grass.receiveShadow = true;
        this.city.add(grass);
        for (let i = 0; i < 7; i++) addTree(cx + (rnd() - 0.5) * 2.6, cz + (rnd() - 0.5) * 2.6, 0.9 + rnd() * 0.6);
        continue;
      }
      if (lot.kind === "houses") {
        lot.homes.forEach((home, i) => {
          const k = i % 9;
          const x = cx + ((k % 3) - 1) * 1.15;
          const z = cz + (Math.floor(k / 3) - 1) * 1.15;
          const body = new THREE.Mesh(houseGeo, houseMat);
          body.position.set(x, 0.24, z);
          body.castShadow = true;
          body.receiveShadow = true;
          // Each house is one task: hovering it shows that task.
          body.userData = { name: "Houses", floor: "A house · no project", slot: slots.length };
          this.city.add(body);
          this.bodies.push(body);
          const roof = new THREE.Mesh(houseRoofGeo, houseRoofMat);
          roof.position.set(x, 0.48 + 0.17, z);
          roof.rotation.y = Math.PI / 4;
          roof.castShadow = true;
          this.city.add(roof);
          // The front faces the street: edge houses look out at the road beside them.
          const col = k % 3;
          const row = Math.floor(k / 3);
          const out: [number, number][] = [];
          if (col === 0) out.push([-1, 0]);
          if (col === 2) out.push([1, 0]);
          if (row === 0) out.push([0, -1]);
          if (row === 2) out.push([0, 1]);
          const [nx, nz] = out.length ? out[i % out.length] : SIDES[(i * 7 + 3) % 4];
          const tx = nz;
          const tz = -nx;
          const half = nx ? 0.352 : 0.322;
          tmp.position.set(x + nx * half - tx * 0.14, 0.25, z + nz * half - tz * 0.14);
          tmp.rotation.set(0, Math.atan2(nx, nz), 0);
          tmp.scale.set(0.22, 0.18, 1);
          tmp.updateMatrix();
          put(tmp.matrix.clone(), home, lot.id, "A house", `${lot.id}:h:${i}`);
          if (home.lit) {
            const porch = new THREE.Mesh(porchGeo, porchMat);
            porch.position.set(x + nx * (half + 0.02) + tx * 0.18, 0.34, z + nz * (half + 0.02) + tz * 0.18);
            this.city.add(porch);
          }
        });
        continue;
      }
      // A tower: floors stacked, each as wide as its homes need.
      const t = lot as Tower;
      if (t.planned || !t.floors.length) {
        this.addCrane(cx, cz);
        if (this.opts.labels) this.addLabel(t.name, cx, 2.6, cz, "planned");
        continue;
      }
      let y = 0;
      let below = Infinity;
      t.floors.forEach((f, fi) => {
        const per = perSide(f.homes.length);
        const size = Math.min(below, 0.5 + per * ROOM);
        below = size;
        const body = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(size, FLOOR, size)), [this.wallMat, this.wallMat, fi === t.floors.length - 1 ? roofMat : this.wallMat, this.wallMat, this.wallMat, this.wallMat]);
        body.position.set(cx, y + FLOOR / 2, cz);
        body.castShadow = true;
        body.receiveShadow = true;
        body.userData = { name: t.name, floor: fi === 0 ? "Ground floor" : `${ordinal(fi)} Floor: ${f.name}`, lot: t.id };
        this.city.add(body);
        this.bodies.push(body);
        const cell = (size - 0.14) / per;
        f.homes.forEach((home, hi) => {
          const side = Math.floor(hi / per) % 4;
          const slot = hi % per;
          const [nx, nz] = SIDES[side];
          const u = -size / 2 + 0.07 + (slot + 0.5) * cell;
          tmp.position.set(cx + nx * (size / 2 + 0.005) + -nz * u, y + FLOOR * 0.52, cz + nz * (size / 2 + 0.005) + nx * u);
          tmp.rotation.set(0, Math.atan2(nx, nz), 0);
          tmp.scale.set(cell * 0.62, FLOOR * 0.5, 1);
          tmp.updateMatrix();
          put(tmp.matrix.clone(), home, t.id, body.userData.floor as string, `${t.id}:${fi}:${hi}`);
        });
        y += FLOOR;
      });
      tallest = Math.max(tallest, y);
      const top = (t.floors.length ? Math.min(below, Infinity) : 1) * 0.55;
      const cap = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(top, FLOOR * 0.4, top)), roofMat);
      cap.position.set(cx, y + FLOOR * 0.2, cz);
      cap.castShadow = true;
      this.city.add(cap);
      const allLit = t.floors.every((f) => f.homes.every((h) => h.lit));
      if (allLit) this.addBeacon(cx, y + FLOOR * 0.4, cz);
      if (t.billboard) this.addBillboard(t.billboard, cx, y + FLOOR * 0.4, cz, below);
      if (this.opts.labels) this.addLabel(t.name, cx, y + (t.billboard ? 1.9 : allLit ? 1.3 : 0.7), cz);
      // A tree or two on the pavement.
      const edge = LOT / 2 - 0.55;
      if (below / 2 + 0.3 < edge) {
        addTree(cx - edge, cz + (rnd() - 0.5) * 2, 0.8 + rnd() * 0.3);
        if (rnd() < 0.6) addTree(cx + (rnd() - 0.5) * 2, cz + edge, 0.8 + rnd() * 0.3);
      }
    }

    // Every window in one instanced mesh, each with its own color.
    if (mats.length) {
      const geo = this.keepCity(new THREE.PlaneGeometry(1, 1));
      const mat = this.keepCity(new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false, side: THREE.FrontSide }));
      const mesh = new THREE.InstancedMesh(geo, mat, mats.length);
      mats.forEach((m, i) => mesh.setMatrixAt(i, m));
      this.slots = slots;
      this.lateIdx = [];
      this.flaring = [];
      slots.forEach((s, i) => {
        const fresh = animate && s.home.lit && !wasLit.has(s.key);
        mesh.setColorAt(i, fresh ? C.dark : colorOf(s.home));
        if (fresh) this.flaring.push({ i, t: 0 });
        if (!s.home.lit && s.home.late) this.lateIdx.push(i);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.windows = mesh;
      this.city.add(mesh);
    } else this.slots = [];
    this.litKeys = new Set(slots.filter((s) => s.home.lit).map((s) => s.key));

    this.addTraffic(lines, lo, hi);
    this.center.set(mid, Math.min(tallest * 0.28, 2.4), mid);
    this.radius = Math.max(span * 0.95, tallest * 1.6, 10);
  }

  private addLabel(text: string, x: number, y: number, z: number, kind = "") {
    const el = document.createElement("div");
    el.className = kind ? `city-label ${kind}` : "city-label";
    el.textContent = text;
    const obj = new CSS2DObject(el);
    obj.position.set(x, y, z);
    obj.center.set(0.5, 1);
    this.city.add(obj);
    this.labels.push(obj);
  }

  private addBeacon(x: number, y: number, z: number) {
    const m = new THREE.Mesh(this.keepCity(new THREE.SphereGeometry(0.12, 16, 12)), this.keepCity(new THREE.MeshBasicMaterial({ color: new THREE.Color("#b9b2ff").multiplyScalar(2.6), toneMapped: false })));
    m.position.set(x, y + 0.5, z);
    const pole = new THREE.Mesh(this.keepCity(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6)), this.keepCity(new THREE.MeshStandardMaterial({ color: "#6b7090" })));
    pole.position.set(x, y + 0.25, z);
    this.city.add(m, pole);
  }

  private addCrane(x: number, z: number) {
    const mat = this.keepCity(new THREE.MeshStandardMaterial({ color: "#d8a23a", roughness: 0.6 }));
    const mast = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(0.1, 2.2, 0.1)), mat);
    mast.position.set(x, 1.1, z);
    const jib = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(1.9, 0.08, 0.08)), mat);
    jib.position.set(x + 0.55, 2.2, z);
    const lot = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(2.4, 0.04, 2.4)), this.keepCity(new THREE.MeshStandardMaterial({ color: "#2a2420" })));
    lot.position.set(x, 0.02, z);
    mast.castShadow = jib.castShadow = true;
    this.city.add(mast, jib, lot);
  }

  private addBillboard(lines: string[], x: number, y: number, z: number, size: number) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f1120";
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = "#a29bff";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 504, 248);
    ctx.fillStyle = "#a29bff";
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillText("MOVING IN TODAY", 26, 52);
    ctx.font = "600 27px Inter, system-ui, sans-serif";
    lines.slice(0, 3).forEach((l, i) => {
      ctx.fillStyle = i % 2 ? "#f2f1ee" : "#ffd27a";
      ctx.fillText(l, 26, 110 + i * 48);
    });
    const tex = this.keepCity(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    const w = Math.max(1.1, Math.min(1.8, size));
    const panel = new THREE.Mesh(this.keepCity(new THREE.PlaneGeometry(w, w / 2)), this.keepCity(new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false })));
    panel.position.set(x, y + 0.7 + w / 4, z);
    panel.rotation.y = 0.78;
    const legMat = this.keepCity(new THREE.MeshStandardMaterial({ color: "#6b7090" }));
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(this.keepCity(new THREE.BoxGeometry(0.05, 0.7, 0.05)), legMat);
      leg.position.set(x + s * w * 0.25 * Math.cos(0.78), y + 0.35, z - s * w * 0.25 * Math.sin(0.78));
      this.city.add(leg);
    }
    this.city.add(panel);
  }

  private addTraffic(lines: number[], lo: number, hi: number) {
    const rnd = seeded(5);
    const colors = ["#d94f4f", "#3f7fd9", "#e8e4dc", "#3a3d48", "#4caf7a", "#d9a441", "#7a5cd6"];
    const head = this.keepCity(new THREE.MeshBasicMaterial({ color: "#bfb59a" }));
    const tail = this.keepCity(new THREE.MeshBasicMaterial({ color: "#8f3a33" }));
    const glass = this.keepCity(new THREE.MeshStandardMaterial({ color: "#1b2233", metalness: 0.6, roughness: 0.2 }));
    const bodyGeo = this.keepCity(new THREE.BoxGeometry(0.42, 0.12, 0.2));
    const cabGeo = this.keepCity(new THREE.BoxGeometry(0.22, 0.09, 0.17));
    const lampGeo = this.keepCity(new THREE.BoxGeometry(0.02, 0.03, 0.05));
    const n = Math.min(26, lines.length * 3);
    for (let i = 0; i < n; i++) {
      const g = new THREE.Group();
      const paint = this.keepCity(new THREE.MeshStandardMaterial({ color: colors[i % colors.length], metalness: 0.5, roughness: 0.35 }));
      const body = new THREE.Mesh(bodyGeo, paint);
      body.position.y = 0.1;
      body.castShadow = true;
      const cab = new THREE.Mesh(cabGeo, glass);
      cab.position.set(-0.03, 0.2, 0);
      g.add(body, cab);
      for (const s of [-1, 1]) {
        const h = new THREE.Mesh(lampGeo, head);
        h.position.set(0.215, 0.11, s * 0.06);
        const t = new THREE.Mesh(lampGeo, tail);
        t.position.set(-0.215, 0.11, s * 0.06);
        g.add(h, t);
      }
      const s = lines[Math.floor(rnd() * lines.length)];
      const dir = rnd() < 0.5 ? 1 : -1;
      const alongX = rnd() < 0.5;
      const lane = 0.14 * dir;
      const a = alongX ? new THREE.Vector3(dir > 0 ? lo : hi, 0, s + lane) : new THREE.Vector3(s - lane, 0, dir > 0 ? lo : hi);
      const b = alongX ? new THREE.Vector3(dir > 0 ? hi : lo, 0, s + lane) : new THREE.Vector3(s - lane, 0, dir > 0 ? hi : lo);
      g.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
      this.city.add(g);
      this.cars.push({ obj: g, a, b, t: rnd(), speed: 0.05 + rnd() * 0.05 });
    }
  }

  private moveSomeoneIn() {
    if (!this.visible || !this.windows) return;
    const dark = this.slots.filter((s) => !s.home.lit);
    if (!dark.length) return;
    const s = dark[Math.floor(Math.random() * dark.length)];
    s.home.lit = true;
    s.home.late = false;
    this.litKeys.add(s.key);
    this.lateIdx = this.lateIdx.filter((i) => i !== s.index);
    this.flaring.push({ i: s.index, t: 0 });
    this.opts.onMoveIn?.(this.litKeys.size);
  }

  /** How many homes are lit (the population). */
  population() {
    return this.litKeys.size;
  }

  private bindPointer() {
    const el = this.renderer.domElement;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: { x: number; y: number } | null = null;
    el.addEventListener("pointerdown", (e) => (down = { x: e.clientX, y: e.clientY }));
    el.addEventListener("pointerup", (e) => {
      const d = down;
      down = null;
      if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5) return;
      // Click a building: glide over to it.
      const hit = this.pick(e.clientX, e.clientY, ray, ndc);
      const body = hit?.body;
      if (body?.userData.lot) {
        const c = this.lotCenter(body.userData.lot as string);
        if (c) this.flyTo(c, Math.max(6, c[1] * 4 + 5), 1.0, Math.atan2(this.camera.position.z - c[2], this.camera.position.x - c[0]));
      }
    });
    el.addEventListener("pointermove", (e) => {
      if (down && e.buttons & 1) return;
      const hit = this.pick(e.clientX, e.clientY, ray, ndc);
      const r = el.getBoundingClientRect();
      const target = hit?.body ?? null;
      if (target !== this.hoverTarget) {
        this.setHover(target);
      }
      el.style.cursor = hit ? "pointer" : "grab";
      this.opts.onHover?.(
        hit
          ? {
              name: (hit.body?.userData.name as string | undefined) ?? null,
              home: hit.slot?.home ?? null,
              floor: hit.slot?.floor ?? ((hit.body?.userData.floor as string) || null),
              x: e.clientX - r.left,
              y: e.clientY - r.top,
            }
          : null,
      );
    });
    el.addEventListener("pointerleave", () => {
      this.setHover(null);
      this.opts.onHover?.(null);
    });
  }

  private setHover(body: THREE.Mesh | null) {
    const swap = (b: THREE.Mesh, on: boolean) => {
      if (!Array.isArray(b.material)) return;
      b.material = b.material.map((m) => (m === this.wallMat || m === this.hoverMat ? (on ? this.hoverMat : this.wallMat) : m));
    };
    if (this.hoverTarget) {
      for (const b of this.bodies) if (b.userData.lot && b.userData.lot === this.hoverTarget.userData.lot) swap(b, false);
    }
    this.hoverTarget = body;
    if (body?.userData.lot) for (const b of this.bodies) if (b.userData.lot === body.userData.lot) swap(b, true);
  }

  private pick(cx: number, cy: number, ray: THREE.Raycaster, ndc: THREE.Vector2): { body: THREE.Mesh | null; slot: Slot | null } | null {
    const r = this.renderer.domElement.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, this.camera);
    const hb = ray.intersectObjects(this.bodies, false)[0];
    const hw = this.windows ? ray.intersectObject(this.windows, false)[0] : undefined;
    if (hw && hw.instanceId !== undefined && (!hb || hw.distance <= hb.distance + 0.05)) {
      const slot = this.slots[hw.instanceId];
      const body = this.bodies.find((b) => b.userData.lot === slot.lot) ?? (hb?.object as THREE.Mesh | undefined) ?? null;
      return { body, slot };
    }
    if (hb) {
      const i = hb.object.userData.slot as number | undefined;
      return { body: hb.object as THREE.Mesh, slot: i !== undefined ? (this.slots[i] ?? null) : null };
    }
    return null;
  }

  private resize() {
    const w = this.host.clientWidth || 1;
    const h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = `${w}px`;
    this.renderer.domElement.style.height = `${h}px`;
    this.composer.setSize(w, h);
    this.bloom.resolution.set(w, h);
    this.labelRenderer?.setSize(w, h);
    this.camera.aspect = w / h;
    // Narrow screens: step back so the city fits.
    this.camera.fov = w / h < 0.9 ? 46 : 34;
    this.camera.updateProjectionMatrix();
  }

  private home(zoom: number) {
    const d = this.radius * zoom;
    const polar = 0.98;
    const az = 0.78;
    this.camera.position.set(this.center.x + d * Math.sin(polar) * Math.cos(az), this.center.y + d * Math.cos(polar), this.center.z + d * Math.sin(polar) * Math.sin(az));
    this.camera.lookAt(this.center);
  }

  private loop = () => {
    if (this.destroyed) return;
    cancelAnimationFrame(this.raf);
    if (!this.visible || document.hidden) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const still = reducedMotion();

    // Camera glide.
    if (this.tween) {
      const k = Math.min(1, (now - this.tween.start) / this.tween.ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.camera.position.lerpVectors(this.tween.from, this.tween.to, e);
      const t = new THREE.Vector3().lerpVectors(this.tween.fromT, this.tween.toT, e);
      if (this.controls) this.controls.target.copy(t);
      else this.camera.lookAt(t);
      if (k >= 1) this.tween = null;
    }
    this.controls?.update();
    if (!this.controls && this.spin && !this.tween && !still) {
      // A slow turn around the city's middle.
      const off = this.camera.position.clone().sub(this.center);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), dt * 0.06);
      this.camera.position.copy(this.center).add(off);
      this.camera.lookAt(this.center);
    }

    // Traffic.
    if (!still) {
      for (const c of this.cars) {
        c.t = (c.t + c.speed * dt) % 1;
        c.obj.position.lerpVectors(c.a, c.b, c.t);
        c.obj.position.y = 0.02;
      }
    }

    // Windows flaring on, and overdue ones blinking.
    if (this.windows) {
      let dirty = false;
      const col = new THREE.Color();
      this.flaring = this.flaring.filter((f) => {
        f.t += dt;
        if (f.t < 0) return true;
        const k = Math.min(1, f.t / 0.9);
        // Dark → a bright flash → settled warm light.
        if (k < 0.25) col.copy(C.dark).lerp(C.flash, k / 0.25);
        else col.copy(C.flash).lerp(C.lit, (k - 0.25) / 0.75);
        this.windows!.setColorAt(f.i, col);
        dirty = true;
        return k < 1;
      });
      if (this.lateIdx.length && !still) {
        const b = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now / 260));
        col.copy(C.late).multiplyScalar(b);
        for (const i of this.lateIdx) this.windows.setColorAt(i, col);
        dirty = true;
      }
      if (dirty && this.windows.instanceColor) this.windows.instanceColor.needsUpdate = true;
    }

    this.composer.render();
    this.labelRenderer?.render(this.scene, this.camera);
    if (this.fade < 1) {
      this.fade = still ? 1 : Math.min(1, this.fade + dt / 1.4);
      const k = 1 - Math.pow(1 - this.fade, 3);
      this.renderer.domElement.style.opacity = String(k);
      if (this.labelRenderer) this.labelRenderer.domElement.style.opacity = String(k);
    }
  };
}

const SIDES: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function colorOf(h: Home): THREE.Color {
  if (h.lit) return C.lit;
  if (h.late) return C.late;
  if (h.readying) return C.warm;
  return C.dark;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

export type { Lot };
