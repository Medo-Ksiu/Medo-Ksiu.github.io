/* ============================================================
   fx.js — الأنيميشن والتأثيرات (بيشتغل فوق main.js)
   boot screen · typing · dot field · cursor · tilt · reveal
   scramble · counters · marquee · timeline · terminal
   ============================================================ */
(() => {
  "use strict";
  const PF = window.PF;
  const D = window.PORTFOLIO;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  const L = (v) => PF.L(v);
  const esc = (s) => PF.esc(s);
  let started = false;

  /* ================= 1. BOOT SCREEN ================= */
  async function boot() {
    const el = $("#boot");
    if (reduce || ss.get("pf-booted") || !el) { root.classList.remove("booting"); return; }
    ss.set("pf-booted", "1");
    el.hidden = false;
    const term = $("#bootTerm");
    let skipped = false;
    const skip = () => { skipped = true; };
    addEventListener("keydown", skip, { once: true });
    el.addEventListener("pointerdown", skip, { once: true });

    const nProjects = D.projects.length;
    const script = [
      { cmd: "whoami" },
      { out: `<span class="ok">${esc(D.profile.name.en)}</span> <span class="dim">— ${esc(D.profile.role.en)}</span>` },
      { cmd: "npm run portfolio" },
      { out: `<span class="dim">› compiling projects…</span>` },
      { out: `<span class="ok">✓</span> ${nProjects} projects loaded` },
      { out: `<span class="ok">✓</span> 973 tests passing` },
      { out: `<span class="ok">✓</span> ready in <span class="cmd">0.96s</span>` }
    ];
    for (const step of script) {
      if (skipped) break;
      const line = document.createElement("div");
      term.appendChild(line);
      if (step.cmd) {
        line.innerHTML = `<span class="ok">$</span> <span class="cmd"></span><span class="boot-caret"></span>`;
        const c = line.querySelector(".cmd");
        for (const ch of step.cmd) { if (skipped) break; c.textContent += ch; await sleep(38); }
        c.textContent = step.cmd;
        await sleep(160);
        line.querySelector(".boot-caret").remove();
      } else {
        line.innerHTML = step.out;
        await sleep(130);
      }
    }
    await sleep(skipped ? 0 : 320);
    el.classList.add("out");
    root.classList.remove("booting");
    await sleep(700);
    el.hidden = true;
  }

  /* ================= 2. HERO: name, typewriter, code typing ================= */
  function splitName() {
    const h = $("#heroName");
    const text = h.textContent;
    h.setAttribute("aria-label", text);
    h.innerHTML = text.split(" ").map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(" ");
  }

  let twToken = 0;
  async function typewriter() {
    const my = ++twToken;
    const el = $("#heroRole");
    const roles = L(D.profile.typedRoles) || [L(D.profile.role)];
    if (reduce) { el.textContent = roles[0]; return; }
    let i = 0;
    el.textContent = "";
    await sleep(400);
    while (my === twToken) {
      const word = roles[i % roles.length];
      for (const ch of [...word]) { if (my !== twToken) return; el.textContent += ch; await sleep(55 + Math.random() * 40); }
      await sleep(1700);
      while (el.textContent.length) { if (my !== twToken) return; el.textContent = el.textContent.slice(0, -1); await sleep(28); }
      await sleep(250);
      i++;
    }
  }

  function typeCode() {
    if (reduce) return;
    let delay = 250;
    $$("#codeBody .code-line").forEach((line) => {
      const txt = line.lastElementChild.textContent;
      const n = Math.max(1, txt.length);
      const d = Math.min(n * 14, 480);
      line.classList.add("typing");
      line.style.setProperty("--n", n);
      line.style.setProperty("--d", d + "ms");
      line.style.setProperty("--delay", delay + "ms");
      delay += d + 40;
    });
  }

  /* ================= 3. STATS (count up) ================= */
  let statsDone = false;
  function renderStats() {
    const box = $("#stats");
    box.innerHTML = D.stats.map((s) => {
      const v = s.value === "projects" ? D.projects.length : s.value;
      const final = (s.prefix || "") + v.toFixed(s.decimals || 0);
      return `<div class="stat"><b data-v="${v}" data-dec="${s.decimals || 0}" data-pre="${esc(s.prefix || "")}">${statsDone || reduce ? esc(final) : esc((s.prefix || "") + (0).toFixed(s.decimals || 0))}</b><span>${esc(L(s.label))}</span></div>`;
    }).join("");
  }
  function countUp() {
    if (statsDone) return;
    statsDone = true;
    $$("#stats b").forEach((b, idx) => {
      const v = +b.dataset.v, dec = +b.dataset.dec, pre = b.dataset.pre;
      const dur = 1400 + idx * 150, t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 4);
        b.textContent = pre + (v * e).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ================= 4. MARQUEE ================= */
  function renderMarquee() {
    const set = new Set();
    D.skills.forEach((g) => g.items.forEach((s) => set.add(s)));
    D.projects.forEach((p) => p.stack.forEach((s) => set.add(s)));
    const all = [...set];
    const half = Math.ceil(all.length / 2);
    const row = (items) => { const h = items.map((s) => `<span>${esc(s)}</span>`).join(""); return h + h; };
    $("#marqueeA").innerHTML = row(all.slice(0, half));
    $("#marqueeB").innerHTML = row(all.slice(half));
  }

  /* ================= 5. INTERACTIVE DOT FIELD ================= */
  function field() {
    const cv = $("#field");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const host = cv.parentElement;
    let W = 0, H = 0, dpr = 1, dots = [], colors = {}, running = false, visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false };
    const GAP = 26, R = 170;

    function readColors() {
      const cs = getComputedStyle(root);
      colors = { accent: cs.getPropertyValue("--accent").trim(), muted: cs.getPropertyValue("--muted").trim(), lilac: cs.getPropertyValue("--lilac").trim() };
    }
    function resize() {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < H; y += GAP) for (let x = GAP / 2; x < W; x += GAP) dots.push({ x, y, s: Math.random() });
      if (!running) draw(performance.now());
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const lines = [];
      for (const d of dots) {
        const wave = Math.sin(t * 0.0009 + d.x * 0.012 + d.y * 0.017) * 0.5 + 0.5;
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - dist / R);
        const push = f * f * 16;
        const x = d.x + (dist ? (dx / dist) * push : 0);
        const y = d.y + (dist ? (dy / dist) * push : 0);
        const r = 0.8 + wave * 0.5 + f * 2.2;
        ctx.globalAlpha = 0.13 + wave * 0.12 + f * 0.75;
        ctx.fillStyle = f > 0.04 ? (d.s > 0.82 ? colors.lilac : colors.accent) : colors.muted;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        if (f > 0.55 && d.s > 0.6) lines.push([x, y, f]);
      }
      ctx.strokeStyle = colors.accent; ctx.lineWidth = 1;
      for (const [x, y, f] of lines) { ctx.globalAlpha = (f - 0.55) * 0.9; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      if (running) requestAnimationFrame(draw);
    }
    function setRunning(on) {
      const want = on && !reduce && visible && !document.hidden;
      if (want && !running) { running = true; requestAnimationFrame(draw); }
      else if (!want) running = false;
    }
    host.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
      if (!mouse.on) { mouse.x = mouse.tx; mouse.y = mouse.ty; mouse.on = true; }
    });
    host.addEventListener("pointerleave", () => { mouse.tx = mouse.ty = -9999; mouse.on = false; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; setRunning(true); }).observe(host);
    document.addEventListener("visibilitychange", () => setRunning(true));
    new MutationObserver(readColors).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", readColors);
    new ResizeObserver(resize).observe(host);
    readColors(); resize(); setRunning(true);
    // touch devices: a slow wandering light so the field still feels alive
    if (!fine && !reduce) {
      let a = 0;
      setInterval(() => { a += 0.02; mouse.tx = W * (0.5 + 0.35 * Math.cos(a)); mouse.ty = H * (0.45 + 0.25 * Math.sin(a * 1.3)); mouse.on = true; }, 50);
    }
  }

  /* ================= 6. CURSOR RING ================= */
  function cursor() {
    const ring = $("#cursorRing");
    if (!fine || reduce || !ring) return;
    let x = -100, y = -100, tx = -100, ty = -100;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; ring.classList.add("on"); });
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
    addEventListener("pointerdown", () => ring.classList.add("down"));
    addEventListener("pointerup", () => ring.classList.remove("down"));
    document.addEventListener("pointerover", (e) => {
      ring.classList.toggle("hover", !!e.target.closest("a, button, .card, input, [role=button], .term-hint button, .chip"));
    });
    (function loop() { x += (tx - x) * 0.2; y += (ty - y) * 0.2; ring.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop); })();
  }

  /* ================= 7. TILT + SPOTLIGHT ================= */
  function tiltOn(el, max = 6) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
      el.classList.add("tracking");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
      el.classList.remove("tracking");
    });
  }
  function tiltCards() {
    if (!fine || reduce) return;
    $$("#grid .card").forEach((c) => tiltOn(c, c.classList.contains("featured") ? 3 : 6));
  }

  /* ================= 8. MAGNETIC BUTTONS + CONTACT GLOW ================= */
  function magnetic() {
    if (!fine || reduce) return;
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
    const c = $(".contact");
    c?.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--gx", `${(e.clientX - r.right + 100) * 0.6}px`);
      c.style.setProperty("--gy", `${(e.clientY - r.top + 60) * 0.6}px`);
    });
  }

  /* ================= 9. SCROLL REVEAL ================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("revealed");
      e.target.classList.remove("pre");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  function reveal(els, step = 70) {
    if (reduce) return;
    els.forEach((el, i) => {
      if (el.classList.contains("revealed")) return;
      if (el.getBoundingClientRect().top < innerHeight) return; // already on screen: leave it visible
      el.classList.add("pre");
      el.style.setProperty("--stagger", `${(i % 4) * step}ms`);
      io.observe(el);
    });
  }

  /* ================= 10. SCRAMBLE HEADINGS ================= */
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFxyz";
  function scramble(el) {
    if (reduce || PF.lang === "ar") return;
    const final = el.textContent;
    const plan = [...final].map((ch) => ({ ch, at: ch === " " ? 0 : 4 + Math.floor(Math.random() * 22) }));
    let frame = 0;
    const tick = () => {
      let out = "", done = true;
      for (const p of plan) {
        if (frame >= p.at) out += esc(p.ch);
        else { done = false; out += `<span class="sc">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`; }
      }
      el.innerHTML = out;
      frame++;
      if (!done) setTimeout(() => requestAnimationFrame(tick), 28);
      else el.textContent = final;
    };
    tick();
  }
  const scrIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { scramble(e.target); scrIO.unobserve(e.target); } });
  }, { threshold: 0.6 });

  /* ================= 11. TIMELINE + NAV ON SCROLL ================= */
  let lastY = scrollY;
  function onScroll() {
    const tl = $("#timeline");
    if (tl) {
      const r = tl.getBoundingClientRect();
      const mark = innerHeight * 0.65;
      const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
      tl.style.setProperty("--tl", p);
      $$("li", tl).forEach((li) => li.classList.toggle("lit", li.getBoundingClientRect().top + 10 < mark));
    }
    const nav = $("#nav");
    const y = scrollY;
    if (!$("#paletteRoot").innerHTML) nav.classList.toggle("hide", y > 320 && y > lastY + 2);
    if (y < lastY - 2 || y < 320) nav.classList.remove("hide");
    lastY = y;
  }

  /* ================= 12. TERMINAL ================= */
  const term = { out: null, input: null, hist: [], hi: 0, busy: false };
  const CMDS = ["help", "whoami", "about", "projects", "open", "skills", "stats", "contact", "copy", "github", "theme", "lang", "date", "clear", "echo", "sudo"];

  async function print(lines, speed = 1) {
    for (const html of lines) {
      const div = document.createElement("div");
      div.setAttribute("dir", "auto");
      div.innerHTML = html || "&nbsp;";
      term.out.appendChild(div);
      term.out.scrollTop = term.out.scrollHeight;
      if (!reduce) await sleep(28 * speed);
    }
  }
  async function typeInto(text) {
    term.input.value = "";
    for (const ch of text) { term.input.value += ch; if (!reduce) await sleep(45); }
    await sleep(120);
  }
  function projectList() {
    return PF.projects().map((p, i) => `<span class="k">${String(i + 1).padStart(2, " ")}</span>  <span class="link" data-open="${p.id}">${esc(L(p.title))}</span>  <span class="d">${esc(p.year || "")} · ${esc(L(D.categories[p.category]) || "")}</span>`);
  }
  async function run(raw) {
    const line = raw.trim();
    if (!line) return;
    term.hist.push(line); term.hi = term.hist.length;
    await print([`<span class="in">${esc(line)}</span>`]);
    const [cmd, ...args] = line.split(/\s+/);
    const arg = args.join(" ");
    const P = D.profile;
    switch (cmd.toLowerCase()) {
      case "help":
        return print([
          `<span class="v">available commands</span>`,
          `  <span class="k">whoami</span>      who I am`,
          `  <span class="k">about</span>       a short story`,
          `  <span class="k">projects</span>    list everything I built`,
          `  <span class="k">open</span> <span class="s">&lt;n&gt;</span>    open project number n`,
          `  <span class="k">skills</span>      my stack`,
          `  <span class="k">stats</span>       numbers I'm proud of`,
          `  <span class="k">contact</span>     how to reach me`,
          `  <span class="k">copy</span>        copy my email`,
          `  <span class="k">theme</span> · <span class="k">lang</span> · <span class="k">date</span> · <span class="k">clear</span>`,
          `<span class="d">tip: Tab completes, ↑ ↓ walk through history</span>`
        ]);
      case "whoami":
        return print([`<span class="s">${esc(L(P.name))}</span>`, esc(L(P.role)), `<span class="d">${esc(L(P.headline))}</span>`]);
      case "about":
        return print(L(D.about).flatMap((p) => [esc(p), ""]));
      case "ls":
      case "projects":
        return print([...projectList(), "", `<span class="d">type</span> <span class="k">open 1</span> <span class="d">or click a name</span>`]);
      case "open": {
        const list = PF.projects();
        const p = list[+arg - 1] || list.find((x) => x.id === arg || L(x.title).toLowerCase().includes(arg.toLowerCase()));
        if (!arg || !p) return print([`<span class="d">usage: open &lt;number&gt;  (try</span> <span class="k">projects</span><span class="d">)</span>`]);
        await print([`<span class="d">opening</span> <span class="s">${esc(L(p.title))}</span><span class="d">…</span>`]);
        return PF.openProject(p.id);
      }
      case "skills":
        return print(D.skills.map((g) => `<span class="k">${esc(L(g.group)).padEnd(24, " ")}</span>${g.items.map(esc).join(", ")}`));
      case "stats":
        return print(D.stats.map((s) => {
          const v = s.value === "projects" ? D.projects.length : s.value;
          return `<span class="v">${esc((s.prefix || "") + v.toFixed(s.decimals || 0))}</span>  ${esc(L(s.label))}`;
        }));
      case "contact":
      case "email":
        return print([
          `email   <span class="s">${esc(P.email)}</span>`,
          ...P.socials.filter((s) => s.url).map((s) => `${esc(s.label.toLowerCase()).padEnd(8, " ")}<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a>`),
          `<span class="d">type</span> <span class="k">copy</span> <span class="d">to copy the email</span>`
        ]);
      case "copy":
        PF.copyEmail(); return print([`<span class="d">copying ${esc(P.email)}…</span>`]);
      case "github": {
        const g = P.socials.find((s) => s.label === "GitHub" && s.url);
        return print([g ? `<a href="${esc(g.url)}" target="_blank" rel="noopener">${esc(g.url)}</a>` : `<span class="d">no GitHub link yet</span>`]);
      }
      case "theme":
        PF.toggleTheme(); return print([`<span class="d">theme →</span> <span class="k">${PF.isDark() ? "dark" : "light"}</span>`]);
      case "lang":
        await print([`<span class="d">switching language…</span>`]); return PF.switchLang();
      case "date":
        return print([new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Cairo" }).format(new Date()) + ` <span class="d">(Cairo)</span>`]);
      case "clear":
        term.out.innerHTML = ""; return;
      case "echo":
        return print([esc(arg)]);
      case "sudo":
        if (/hire/i.test(arg)) {
          await print([`<span class="d">[sudo] checking permissions…</span>`, `<span class="k">✓ access granted.</span> great choice. taking you to contact…`]);
          await sleep(500);
          return document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
        }
        return print([`<span class="d">nice try. try</span> <span class="k">sudo hire-me</span>`]);
      case "rm":
        return print([`<span class="d">let's not do that 🙂</span>`]);
      default:
        return print([`command not found: <span class="s">${esc(cmd)}</span>. <span class="d">type</span> <span class="k">help</span>`]);
    }
  }
  function terminal() {
    term.out = $("#termOut"); term.input = $("#termIn");
    if (!term.out) return;
    $("#termChips").innerHTML = ["help", "projects", "skills", "sudo hire-me"].map((c) => `<button type="button" data-cmd="${c}">${c}</button>`).join("");
    $("#termChips").addEventListener("click", async (e) => {
      const b = e.target.closest("button"); if (!b || term.busy) return;
      term.busy = true; await typeInto(b.dataset.cmd); term.input.value = ""; await run(b.dataset.cmd); term.busy = false;
    });
    term.out.addEventListener("click", (e) => { const l = e.target.closest("[data-open]"); if (l) PF.openProject(l.dataset.open); });
    $("#term").addEventListener("click", (e) => { if (!e.target.closest("a, button, [data-open]") && !getSelection().toString()) term.input.focus({ preventScroll: true }); });
    term.input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") { const v = term.input.value; term.input.value = ""; await run(v); }
      else if (e.key === "ArrowUp") { e.preventDefault(); term.hi = Math.max(0, term.hi - 1); term.input.value = term.hist[term.hi] || ""; }
      else if (e.key === "ArrowDown") { e.preventDefault(); term.hi = Math.min(term.hist.length, term.hi + 1); term.input.value = term.hist[term.hi] || ""; }
      else if (e.key === "Tab") {
        const m = CMDS.filter((c) => c.startsWith(term.input.value.trim().toLowerCase()));
        if (m.length) { e.preventDefault(); term.input.value = m.length === 1 ? m[0] + " " : term.input.value; if (m.length > 1) print([`<span class="d">${m.join("  ")}</span>`]); }
      }
    });
    // greet once the terminal scrolls into view
    print([`<span class="d">Last login: ${new Date().toDateString()} from your browser</span>`, `<span class="d">welcome. type</span> <span class="k">help</span> <span class="d">to see what I can do.</span>`, ""], 0);
    const greet = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      greet.disconnect();
      if (term.busy) return;
      term.busy = true; await sleep(400); await typeInto("whoami"); term.input.value = ""; await run("whoami"); term.busy = false;
    }, { threshold: 0.5 });
    greet.observe($("#term"));
  }

  /* ================= wiring ================= */
  function onRender() {
    splitName();
    if (started) typewriter();
    renderStats();
    renderMarquee();
    $$(".scramble").forEach((h) => scrIO.observe(h));
    reveal($$("[data-reveal]"));
    reveal($$("#timeline li, .skill-group"), 90);
    if (statsDone) $$("#stats b").forEach((b) => (b.textContent = b.dataset.pre + (+b.dataset.v).toFixed(+b.dataset.dec)));
  }
  document.addEventListener("pf:render", onRender);
  document.addEventListener("pf:cards", () => { tiltCards(); reveal($$("#grid .card"), 90); });

  onRender();
  tiltCards();
  reveal($$("#grid .card"), 90);
  field();
  cursor();
  magnetic();
  terminal();
  if (fine && !reduce) tiltOn($(".code-card"), 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  boot().then(() => {
    started = true;
    root.classList.add("anim");
    splitName();
    typeCode();
    typewriter();
    new IntersectionObserver(([e]) => { if (e.isIntersecting) countUp(); }, { threshold: 0.4 }).observe($("#stats"));
  });
})();
