/* ============================================================
   Tour engine — first-person walkthrough shared by every venue.
   createTour(config, build): build(api) adds the venue's geometry.
   ============================================================ */
import * as THREE from "three";

export function createTour(cfg, build) {
  /* ---------- markup ---------- */
  if (cfg.accent) document.documentElement.style.setProperty("--accent", cfg.accent);
  document.body.insertAdjacentHTML("beforeend", `
<canvas id="c"></canvas>
<div class="hud" id="hud" hidden>
  <div class="room"><small id="roomTag">YOU ARE IN</small><b id="roomName">Outside</b></div>
  <a class="back" href="../">← All tours</a>
  <canvas id="map" width="400" height="340"></canvas>
  <div class="cross"></div>
  <div class="pill" id="pill" hidden></div>
  <div class="hint" id="hint"><b id="hintT"></b><span id="hintD"></span></div>
  <div class="nav" id="nav"><button class="toggle" id="navToggle" type="button">Rooms ▾</button><div class="list" id="navList"></div></div>
</div>
<div class="joy" id="joy" aria-hidden="true"><i id="knob"></i></div>`);
  const overlay = document.getElementById("overlay");

  /* ---------- renderer ---------- */
  const isTouch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  if (isTouch) document.body.classList.add("touch");
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isTouch, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isTouch ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = cfg.exposure ?? 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isTouch ? 75 : 70, 1, 0.05, 260);
  camera.rotation.order = "YXZ";

  const H = cfg.H ?? 5.5, EYE = cfg.eye ?? 1.65, T = 0.3, DOOR_H = cfg.doorH ?? 3.1;
  const colliders = [], segs = [], animated = [], exhibits = [];

  /* ---------- textures ---------- */
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }
  function tileTex(base, line, style = "tile", seed = 7) {
    return canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      const r = rng(seed);
      if (style === "wood") {
        for (let i = 0; i < 8; i++) {
          g.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.06})`; g.fillRect(0, i * 32, w, 32);
          g.fillStyle = line; g.fillRect(0, i * 32, w, 1.5); g.fillRect((r() * w) | 0, i * 32, 1.5, 32);
        }
      } else if (style === "carpet") {
        for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.05})`; g.fillRect(r() * w, r() * h, 2, 2); }
      } else if (style === "marble") {
        for (let i = 0; i < 14; i++) {
          g.strokeStyle = `rgba(120,110,100,${0.08 + r() * 0.12})`; g.lineWidth = 0.6 + r() * 1.6;
          g.beginPath(); g.moveTo(r() * w, 0); g.bezierCurveTo(r() * w, h * 0.3, r() * w, h * 0.7, r() * w, h); g.stroke();
        }
        g.strokeStyle = line; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
      } else if (style === "checker") {
        g.fillStyle = line; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if ((x + y) % 2) g.fillRect(x * 64, y * 64, 64, 64);
      } else if (style === "grass") {
        for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${r() < 0.5 ? "20,60,25" : "160,200,120"},${r() * 0.18})`; g.fillRect(r() * w, r() * h, 1.5, 4); }
      } else {
        for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(0,0,0,${r() * 0.035})`; g.fillRect(r() * w, r() * h, 3 + r() * 10, 1); }
        g.strokeStyle = line; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
      }
    });
  }
  function signTex(title, sub, bg = "#0f1a1b", fg = "#E6EEEB", accent = cfg.accent || "#7CC4B5", w = 1024, h = 256, serif = false) {
    return canvasTex(w, h, (g) => {
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.fillStyle = accent; g.fillRect(0, h - 10, w, 10);
      g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = `${serif ? "italic 600" : "700"} ${Math.round(h * 0.38)}px ${serif ? "Georgia, 'Times New Roman', serif" : "system-ui, 'Segoe UI', sans-serif"}`;
      g.fillText(title, w / 2, sub ? h * 0.4 : h / 2);
      if (sub) { g.fillStyle = accent; g.font = `500 ${Math.round(h * 0.14)}px ui-monospace, Consolas, monospace`; g.fillText(sub, w / 2, h * 0.76); }
    });
  }
  const PALETTES = [["#2E7769", "#E7C6A0", "#1D2A2B", "#BBA9F0", "#F1F4F2"], ["#4C6FA8", "#F2A93B", "#EDE6DA", "#1E2761", "#E63946"], ["#3E8A72", "#C9D6D2", "#8E7CC3", "#14211F", "#F4D35E"], ["#9A6B8F", "#F1E3D3", "#2B4650", "#7CC4B5", "#D98C5F"]];
  function artTex(seed) {
    const r = rng(seed); const pal = PALETTES[seed % PALETTES.length];
    return canvasTex(320, 400, (g, w, h) => {
      g.fillStyle = pal[2]; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 9; i++) {
        g.fillStyle = pal[(r() * pal.length) | 0]; g.globalAlpha = 0.65 + r() * 0.35;
        const k = r();
        if (k < 0.4) { g.beginPath(); g.arc(r() * w, r() * h, 20 + r() * 110, 0, Math.PI * 2); g.fill(); }
        else if (k < 0.75) g.fillRect(r() * w, r() * h, 30 + r() * 160, 20 + r() * 160);
        else { g.lineWidth = 6 + r() * 14; g.strokeStyle = pal[(r() * pal.length) | 0]; g.beginPath(); g.moveTo(r() * w, r() * h); g.bezierCurveTo(r() * w, r() * h, r() * w, r() * h, r() * w, r() * h); g.stroke(); }
      }
      g.globalAlpha = 1;
    });
  }
  function screenTex(title, lines, accent = cfg.accent || "#7CC4B5", bg = ["#102224", "#1d1a33"]) {
    return canvasTex(1024, 512, (g, w, h) => {
      const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, bg[0]); grd.addColorStop(1, bg[1]);
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(255,255,255,.06)"; g.lineWidth = 1;
      for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.fillStyle = accent; g.font = "500 30px ui-monospace, Consolas, monospace"; g.fillText(lines[0], 60, 110);
      g.fillStyle = "#F2F4F2"; g.font = "800 88px system-ui, 'Segoe UI', sans-serif"; g.fillText(title, 56, 240);
      g.fillStyle = "#B4C2BF"; g.font = "400 34px system-ui, 'Segoe UI', sans-serif"; g.fillText(lines[1] || "", 60, 320);
      g.fillStyle = accent; g.fillRect(60, 380, 180, 8);
    });
  }
  const sky = cfg.sky || ["#5f8fb0", "#bcd6e0", "#e9eee6"];
  const skyTex = canvasTex(16, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, sky[0]); grd.addColorStop(0.55, sky[1]); grd.addColorStop(1, sky[2]);
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  scene.background = skyTex;
  const fog = cfg.fog || { color: 0xcfdde2, near: 45, far: 140 };
  scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);

  /* ---------- base materials ---------- */
  const M = {
    wall: new THREE.MeshStandardMaterial({ color: cfg.wallColor ?? 0xe9ecea, roughness: 0.92 }),
    ceiling: new THREE.MeshStandardMaterial({ color: cfg.ceilingColor ?? 0xf4f6f5, roughness: 1, side: THREE.DoubleSide }),
    panel: new THREE.MeshBasicMaterial({ color: 0xfffcf2 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1d2a2b, roughness: 0.6 }),
    wood: new THREE.MeshStandardMaterial({ color: 0xa47c58, roughness: 0.65 }),
    woodLight: new THREE.MeshStandardMaterial({ color: 0xcfb08a, roughness: 0.7 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.5 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9aa7a6, metalness: 0.8, roughness: 0.3 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4a94e, metalness: 0.9, roughness: 0.28 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x9fd3e6, transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0.2, depthWrite: false }),
    facadeGlass: new THREE.MeshStandardMaterial({ color: 0x24404a, metalness: 0.7, roughness: 0.12 }),
    green: new THREE.MeshStandardMaterial({ color: 0x3f7a4c, roughness: 0.9 }),
    pot: new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 0.8 }),
    grass: new THREE.MeshStandardMaterial({ map: tileTex("#86a77d", "#86a77d", "grass", 3), roughness: 1 }),
    stone: new THREE.MeshStandardMaterial({ map: tileTex("#d6d3cc", "#bdb9b0"), roughness: 0.95 }),
    windowIn: new THREE.MeshBasicMaterial({ map: skyTex })
  };
  M.grass.map.wrapS = M.grass.map.wrapT = THREE.RepeatWrapping; M.grass.map.repeat.set(60, 60);
  M.stone.map.wrapS = M.stone.map.wrapT = THREE.RepeatWrapping;

  /* ---------- builders ---------- */
  function box(w, h, d, x, y, z, mat, collide = true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); scene.add(m);
    if (collide) colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 });
    return m;
  }
  function collide(x1, x2, z1, z2) { colliders.push({ minX: x1, maxX: x2, minZ: z1, maxZ: z2 }); }
  function plane(w, h, mat, x, y, z, rx = 0, ry = 0) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); scene.add(m); return m;
  }
  function wallX(z, x1, x2, doors = [], mat = M.wall, h = H) {
    let s = x1;
    for (const d of [...doors].sort((a, b) => a.c - b.c)) {
      const a = d.c - d.w / 2, b = d.c + d.w / 2;
      if (a > s) { box(a - s, h, T, (s + a) / 2, h / 2, z, mat); segs.push([s, z, a, z]); }
      if (h > DOOR_H) box(d.w, h - DOOR_H, T, d.c, (h + DOOR_H) / 2, z, mat, false);
      s = b;
    }
    if (x2 > s) { box(x2 - s, h, T, (s + x2) / 2, h / 2, z, mat); segs.push([s, z, x2, z]); }
  }
  function wallZ(x, z1, z2, doors = [], mat = M.wall, h = H) {
    let s = z1;
    for (const d of [...doors].sort((a, b) => a.c - b.c)) {
      const a = d.c - d.w / 2, b = d.c + d.w / 2;
      if (a > s) { box(T, h, a - s, x, h / 2, (s + a) / 2, mat); segs.push([x, s, x, a]); }
      if (h > DOOR_H) box(T, h - DOOR_H, d.w, x, (h + DOOR_H) / 2, d.c, mat, false);
      s = b;
    }
    if (z2 > s) { box(T, h, z2 - s, x, h / 2, (s + z2) / 2, mat); segs.push([x, s, x, z2]); }
  }
  function floor(x1, x2, z1, z2, tex, rough = 0.85, extra = {}) {
    const w = x2 - x1, d = z2 - z1;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(w / (extra.tile || 2.5), d / (extra.tile || 2.5)); tex.needsUpdate = true;
    return plane(w, d, new THREE.MeshStandardMaterial({ map: tex, roughness: rough, metalness: extra.metalness || 0 }), (x1 + x2) / 2, 0.002 + (extra.lift || 0), (z1 + z2) / 2, -Math.PI / 2);
  }
  function ceiling(x1, x2, z1, z2, { panels = true, roof = true, mat = M.ceiling, panelMat = M.panel, step = 4 } = {}) {
    plane(x2 - x1, z2 - z1, mat, (x1 + x2) / 2, H, (z1 + z2) / 2, Math.PI / 2);
    if (roof) box(x2 - x1 + 0.6, 0.3, z2 - z1 + 0.6, (x1 + x2) / 2, H + 0.15, (z1 + z2) / 2, M.wall, false);
    if (panels) for (let x = x1 + 2; x <= x2 - 1.5; x += step) for (let z = z1 + 2; z <= z2 - 1.5; z += step) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.5), panelMat); p.position.set(x, H - 0.03, z); scene.add(p);
    }
  }
  function plant(x, z, s = 1, foliage = M.green) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * s, 0.22 * s, 0.55 * s, 14), M.pot); p.position.set(x, 0.275 * s, z); scene.add(p);
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(new THREE.IcosahedronGeometry((0.38 - i * 0.07) * s, 1), foliage);
      f.position.set(x + (i - 1) * 0.12 * s, (0.85 + i * 0.32) * s, z + ((i % 2) - 0.5) * 0.14 * s); scene.add(f);
    }
    collide(x - 0.3 * s, x + 0.3 * s, z - 0.3 * s, z + 0.3 * s);
  }
  function tree(x, z, s = 1, mat = M.green) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 2.2 * s, 8), M.wood); t.position.set(x, 1.1 * s, z); scene.add(t);
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5 * s, 1), mat); c.position.set(x, 3.1 * s, z); c.scale.y = 1.2; scene.add(c);
    collide(x - 0.3, x + 0.3, z - 0.3, z + 0.3);
  }
  function sign(text, sub, w, h, x, y, z, ry = 0, colors = [], serif = false) {
    const tex = signTex(text, sub, colors[0], colors[1], colors[2], 1024, 256, serif);
    return plane(w, h, new THREE.MeshBasicMaterial({ map: tex }), x, y, z, 0, ry);
  }
  function frameArt(seed, x, y, z, ry, w = 1.6, h = 2, frameMat = M.dark, tex) {
    const g = new THREE.Group();
    const fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.06), frameMat);
    const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex || artTex(seed), roughness: 0.9 }));
    art.position.z = 0.035; g.add(fr, art);
    g.position.set(x, y, z); g.rotation.y = ry; scene.add(g); return g;
  }
  function light(type, color, intensity, x, y, z, opts = {}) {
    let l;
    if (type === "spot") {
      l = new THREE.SpotLight(color, intensity, 0, opts.angle ?? 0.5, opts.penumbra ?? 0.6, 2);
      l.target.position.set(opts.tx ?? x, opts.ty ?? 0, opts.tz ?? z); scene.add(l.target);
    } else l = new THREE.PointLight(color, intensity, 0, 2);
    l.position.set(x, y, z); scene.add(l); return l;
  }
  function exhibit(x, z, title, text) { exhibits.push({ x, z, title, text }); }
  function animate(fn) { animated.push(fn); }

  // ground + world bounds
  const ground = plane(300, 300, cfg.groundMat || M.grass, 0, 0, 0, -Math.PI / 2);
  for (const [w, d, x, z] of [[140, 1, 0, -70], [140, 1, 0, 70], [1, 140, -70, 0], [1, 140, 70, 0]]) collide(x - w / 2, x + w / 2, z - d / 2, z + d / 2);

  // sliding entrance doors (glass) on an x-wall
  let doorL = null, doorR = null, doorOpen = 0;
  const ent = cfg.entrance;
  if (ent) {
    doorL = box(ent.w / 2, DOOR_H, 0.06, ent.x - ent.w / 4, DOOR_H / 2, ent.z, M.glass, false);
    doorR = box(ent.w / 2, DOOR_H, 0.06, ent.x + ent.w / 4, DOOR_H / 2, ent.z, M.glass, false);
  }

  const api = { THREE, scene, M, H, T, DOOR_H, isTouch, box, collide, plane, wallX, wallZ, floor, ceiling, plant, tree, sign, frameArt, light, exhibit, animate, rng, canvasTex, tileTex, signTex, artTex, screenTex, skyTex };
  build(api);

  /* ---------- zones ---------- */
  const zones = cfg.zones;
  const OUTSIDE = cfg.outside;
  const all = [OUTSIDE, ...zones];
  const zoneAt = (x, z) => zones.find((q) => x > q.x1 && x < q.x2 && z > q.z1 && z < q.z2) || OUTSIDE;

  /* ---------- player ---------- */
  const pos = new THREE.Vector3(cfg.start.x, EYE, cfg.start.z);
  let yaw = cfg.start.yaw || 0, pitch = -0.02;
  const vel = new THREE.Vector2();
  const keys = {};
  let started = false, locked = false, dragLook = false, dragging = false, bob = 0;
  const R = 0.32;

  function blocked(x, z) {
    for (const c of colliders) if (x > c.minX - R && x < c.maxX + R && z > c.minZ - R && z < c.maxZ + R) return true;
    if (ent && doorOpen < 0.7 && x > ent.x - ent.w / 2 - R && x < ent.x + ent.w / 2 + R && z > ent.z - 0.15 - R && z < ent.z + 0.15 + R) return true;
    return false;
  }
  function teleport(z) { pos.set(z.spawn[0], EYE, z.spawn[1]); yaw = z.spawn[2] || 0; pitch = -0.02; vel.set(0, 0); }

  addEventListener("keydown", (e) => { keys[e.code] = true; if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault(); });
  addEventListener("keyup", (e) => { keys[e.code] = false; });
  addEventListener("blur", () => { for (const k in keys) keys[k] = false; });

  function look(dx, dy, s) { yaw -= dx * s; pitch = Math.max(-1.45, Math.min(1.45, pitch - dy * s)); }
  function enableDrag() { dragLook = true; showPill("Drag with the mouse to look around"); }
  function lockPointer() {
    try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(enableDrag); } catch (e) { enableDrag(); }
  }
  canvas.addEventListener("click", () => { if (started && !isTouch && !locked && !dragLook) lockPointer(); });
  document.addEventListener("pointerlockchange", () => {
    locked = document.pointerLockElement === canvas;
    if (started && !isTouch && !dragLook) showPill(locked ? "" : "Click to look around · WASD to move");
  });
  document.addEventListener("pointerlockerror", enableDrag);
  addEventListener("mousemove", (e) => {
    if (locked) look(e.movementX, e.movementY, 0.0022);
    else if (dragLook && dragging) look(e.movementX, e.movementY, 0.004);
  });
  canvas.addEventListener("mousedown", () => { dragging = true; });
  addEventListener("mouseup", () => { dragging = false; });

  const joy = document.getElementById("joy"), knob = document.getElementById("knob");
  const joyVec = { x: 0, y: 0 }; let joyId = null, lookId = null, lastLook = null;
  function joyMove(t) {
    const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, max = r.width / 2;
    let dx = t.clientX - cx, dy = t.clientY - cy; const d = Math.hypot(dx, dy);
    if (d > max) { dx *= max / d; dy *= max / d; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    joyVec.x = dx / max; joyVec.y = dy / max;
  }
  joy.addEventListener("touchstart", (e) => { e.preventDefault(); const t = e.changedTouches[0]; joyId = t.identifier; joyMove(t); }, { passive: false });
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); if (lookId === null) { const t = e.changedTouches[0]; lookId = t.identifier; lastLook = [t.clientX, t.clientY]; } }, { passive: false });
  addEventListener("touchmove", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) joyMove(t);
      else if (t.identifier === lookId) { look(t.clientX - lastLook[0], t.clientY - lastLook[1], 0.0055); lastLook = [t.clientX, t.clientY]; }
    }
  }, { passive: false });
  const endTouch = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) { joyId = null; joyVec.x = joyVec.y = 0; knob.style.transform = ""; }
      if (t.identifier === lookId) lookId = null;
    }
  };
  addEventListener("touchend", endTouch); addEventListener("touchcancel", endTouch);

  /* ---------- HUD ---------- */
  const roomName = document.getElementById("roomName"), roomTag = document.getElementById("roomTag");
  const hint = document.getElementById("hint"), hintT = document.getElementById("hintT"), hintD = document.getElementById("hintD");
  const pill = document.getElementById("pill");
  function showPill(text) { pill.textContent = text; pill.hidden = !text; }
  const navList = document.getElementById("navList");
  navList.innerHTML = all.map((z, i) => `<button type="button" data-i="${i}">${z.name}</button>`).join("");
  navList.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    teleport(all[+b.dataset.i]); document.getElementById("nav").classList.remove("open");
  });
  document.getElementById("navToggle").addEventListener("click", () => document.getElementById("nav").classList.toggle("open"));

  const map = document.getElementById("map"), mg = map.getContext("2d");
  const { x0: MX0, x1: MX1, z0: MZ0, z1: MZ1 } = cfg.map;
  const accent = cfg.accent || "#7CC4B5";
  function drawMap() {
    const W = map.width, Hh = map.height, sx = W / (MX1 - MX0), sz = Hh / (MZ1 - MZ0);
    const X = (x) => (x - MX0) * sx, Z = (z) => (z - MZ0) * sz;
    mg.clearRect(0, 0, W, Hh);
    const cur = zoneAt(pos.x, pos.z);
    for (const q of zones) {
      mg.globalAlpha = q === cur ? 0.32 : 1;
      mg.fillStyle = q === cur ? accent : "rgba(255,255,255,.05)";
      mg.fillRect(X(q.x1), Z(q.z1), (q.x2 - q.x1) * sx, (q.z2 - q.z1) * sz);
    }
    mg.globalAlpha = 1;
    mg.strokeStyle = "rgba(230,238,235,.85)"; mg.lineWidth = 3; mg.lineCap = "round";
    for (const [a, b, c, d] of segs) { mg.beginPath(); mg.moveTo(X(a), Z(b)); mg.lineTo(X(c), Z(d)); mg.stroke(); }
    mg.fillStyle = "rgba(170,186,182,.95)"; mg.font = "500 15px ui-monospace, Consolas, monospace"; mg.textAlign = "center";
    for (const q of zones) if (!q.hideLabel) mg.fillText(q.short || q.name, X((q.x1 + q.x2) / 2), Z((q.z1 + q.z2) / 2) + 5);
    mg.save(); mg.translate(X(pos.x), Z(pos.z)); mg.rotate(-yaw);
    mg.globalAlpha = 0.25; mg.fillStyle = accent; mg.beginPath(); mg.moveTo(0, 0); mg.arc(0, 0, 46, -Math.PI / 2 - 0.55, -Math.PI / 2 + 0.55); mg.closePath(); mg.fill();
    mg.globalAlpha = 1; mg.beginPath(); mg.moveTo(0, -12); mg.lineTo(8, 8); mg.lineTo(0, 4); mg.lineTo(-8, 8); mg.closePath(); mg.fill();
    mg.restore();
  }

  /* ---------- loop ---------- */
  function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  addEventListener("resize", resize); resize();

  const clock = new THREE.Clock();
  let lastZone = null, tick = 0;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    let ix = 0, iz = 0, run = false;
    if (started) {
      if (keys.KeyW || keys.ArrowUp) iz += 1;
      if (keys.KeyS || keys.ArrowDown) iz -= 1;
      if (keys.KeyA || keys.ArrowLeft) ix -= 1;
      if (keys.KeyD || keys.ArrowRight) ix += 1;
      run = keys.ShiftLeft || keys.ShiftRight;
      if (joyId !== null) { ix = joyVec.x; iz = -joyVec.y; run = Math.hypot(ix, iz) > 0.92; }
      if (keys.KeyQ) yaw += 1.8 * dt;
      if (keys.KeyE) yaw -= 1.8 * dt;
    }
    const mag = Math.min(1, Math.hypot(ix, iz)), speed = run ? 6 : 3.2;
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    let tx = 0, tz = 0;
    if (mag > 0.01) {
      const n = Math.hypot(ix, iz) || 1;
      tx = (fx * iz / n + rx * ix / n) * speed * mag;
      tz = (fz * iz / n + rz * ix / n) * speed * mag;
    }
    const k = 1 - Math.exp(-12 * dt);
    vel.x += (tx - vel.x) * k; vel.y += (tz - vel.y) * k;
    const nx = pos.x + vel.x * dt; if (!blocked(nx, pos.z)) pos.x = nx; else vel.x = 0;
    const nz = pos.z + vel.y * dt; if (!blocked(pos.x, nz)) pos.z = nz; else vel.y = 0;

    const sp = Math.hypot(vel.x, vel.y);
    bob += sp * dt * 2.2;
    camera.position.set(pos.x, EYE + Math.sin(bob * 2) * 0.035 * Math.min(1, sp / 3), pos.z);
    camera.rotation.set(pitch, yaw, 0);

    if (ent) {
      const dDoor = Math.hypot(pos.x - ent.x, pos.z - ent.z);
      doorOpen += ((dDoor < 6 ? 1 : 0) - doorOpen) * (1 - Math.exp(-5 * dt));
      doorL.position.x = ent.x - ent.w / 4 - doorOpen * (ent.w / 2 - 0.05);
      doorR.position.x = ent.x + ent.w / 4 + doorOpen * (ent.w / 2 - 0.05);
    }
    for (const f of animated) f(t, dt);

    if (started) {
      const z = zoneAt(pos.x, pos.z);
      if (z !== lastZone) {
        lastZone = z; roomName.textContent = z.name; roomTag.textContent = z.tag;
        navList.querySelectorAll("button").forEach((b, i) => b.classList.toggle("on", all[i] === z));
      }
      let best = null, bd = 2.4;
      for (const e of exhibits) { const d = Math.hypot(e.x - pos.x, e.z - pos.z); if (d < bd) { bd = d; best = e; } }
      if (best) { if (hintT.textContent !== best.title) { hintT.textContent = best.title; hintD.textContent = best.text; } hint.classList.add("on"); }
      else hint.classList.remove("on");
      if (++tick % 2 === 0) drawMap();
    } else {
      yaw = (cfg.start.yaw || 0) + Math.sin(t * 0.15) * 0.35; pitch = 0.04;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- start ---------- */
  document.getElementById("keys").innerHTML = isTouch
    ? `<kbd>Left stick</kbd><span>Walk — push to the edge to run</span><kbd>Drag screen</kbd><span>Look around</span><kbd>Rooms ▾</kbd><span>Jump to any room</span>`
    : `<kbd>W A S D</kbd><span>Walk (arrow keys work too)</span><kbd>Mouse</kbd><span>Look around · click to lock the cursor</span><kbd>Shift</kbd><span>Run</span><kbd>Esc</kbd><span>Release the mouse</span>`;
  const go = document.getElementById("go");
  go.disabled = false; go.textContent = isTouch ? "Tap to enter" : "Enter the venue";
  window.__tourReady = true;
  go.addEventListener("click", () => {
    started = true; yaw = cfg.start.yaw || 0; pitch = -0.02;
    overlay.classList.add("hide");
    document.getElementById("hud").hidden = false;
    if (!isTouch) lockPointer();
  });
}
