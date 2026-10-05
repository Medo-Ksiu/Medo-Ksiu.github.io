(() => {
  "use strict";
  const D = window.PORTFOLIO;
  const P = D.profile;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);

  const UI = {
    en: {
      navWork: "Work", navAbout: "About", navJourney: "Journey", navTerminal: "Terminal", navContact: "Contact",
      termTitle: "Ask my terminal", termSub: "Type a command and press Enter. Start with help.",
      ctaWork: "See my work", ctaContact: "Get in touch", ctaCv: "Download CV",
      workTitle: "Selected work", workSub: "Things I've designed, built and shipped. Open any project for the full story.",
      all: "All", searchPh: "Search projects or tech…", empty: "No project matches that search.", clear: "Clear filters",
      aboutTitle: "About me", skillsTitle: "What I work with", journeyTitle: "Journey",
      contactTitle: "Have a project in mind? Let's build it.", contactSub: "Send me a short note about what you need. I usually reply within a day.",
      copy: "Copy email", copied: "Email copied", copyFail: "Email selected — press Ctrl C to copy",
      viewProject: "View project", live: "Visit live site", code: "View code", close: "Close",
      sample: "Sample", busy: "Not taking new work right now", local: "local time",
      footHint: "Press Ctrl K to jump anywhere", rights: "Built by hand",
      palPh: "Type a section, project or command…", palTheme: "Switch theme", palLang: "التبديل إلى العربية", palCopy: "Copy email",
      palSection: "Section", palProject: "Project", palAction: "Action", themeTo: "Theme"
    },
    ar: {
      navWork: "أعمالي", navAbout: "عنّي", navJourney: "رحلتي", navTerminal: "التيرمنال", navContact: "تواصل",
      termTitle: "اسأل التيرمنال بتاعي", termSub: "اكتب أمر ودوس Enter. ابدأ بـ help.",
      ctaWork: "شوف أعمالي", ctaContact: "تواصل معايا", ctaCv: "حمّل السي ڤي",
      workTitle: "أعمال مختارة", workSub: "حاجات صممتها وبنيتها وأطلقتها. افتح أي مشروع عشان تشوف القصة كاملة.",
      all: "الكل", searchPh: "دوّر على مشروع أو تقنية…", empty: "مفيش مشروع مطابق للبحث ده.", clear: "امسح الفلاتر",
      aboutTitle: "عنّي", skillsTitle: "بشتغل بإيه", journeyTitle: "رحلتي",
      contactTitle: "عندك فكرة مشروع؟ يلا نبنيها.", contactSub: "ابعتلي رسالة قصيرة باللي محتاجه. غالباً برد خلال يوم.",
      copy: "انسخ الإيميل", copied: "اتنسخ الإيميل", copyFail: "الإيميل متحدد — دوس Ctrl C للنسخ",
      viewProject: "افتح المشروع", live: "زور الموقع", code: "شوف الكود", close: "إغلاق",
      sample: "مثال", busy: "مش متاح لشغل جديد حالياً", local: "بتوقيت القاهرة",
      footHint: "دوس Ctrl K للتنقل السريع", rights: "مبني بإيدي",
      palPh: "اكتب اسم قسم أو مشروع أو أمر…", palTheme: "غيّر الثيم", palLang: "Switch to English", palCopy: "انسخ الإيميل",
      palSection: "قسم", palProject: "مشروع", palAction: "أمر", themeTo: "الثيم"
    }
  };

  /* ---------- state ---------- */
  const store = {
    get(k) { try { return localStorage.getItem("pf-" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("pf-" + k, v); } catch (e) {} }
  };
  let lang = store.get("lang") || D.defaultLang || "en";
  let filter = "all";
  let query = "";

  const t = (k) => UI[lang][k] ?? UI.en[k] ?? k;
  const L = (v) => (v == null ? "" : typeof v === "string" || Array.isArray(v) ? v : (v[lang] ?? v.en ?? ""));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- theme ---------- */
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : mq.matches);
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  function paintThemeBtn() { $("#themeBtn").innerHTML = isDark() ? sun : moon; }
  function toggleTheme() {
    root.dataset.theme = isDark() ? "light" : "dark";
    store.set("theme", root.dataset.theme);
    paintThemeBtn();
  }
  const savedTheme = store.get("theme");
  if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;
  mq.addEventListener?.("change", paintThemeBtn);

  /* ---------- hero code card ---------- */
  function codeLines() {
    const s = (v) => `<span class="tok-s">"${esc(v)}"</span>`;
    const p = (k) => `  <span class="tok-p">${k}</span>: `;
    return [
      `<span class="tok-c">// hello.ts — nice to meet you</span>`,
      `<span class="tok-k">const</span> developer = {`,
      p("name") + s(P.name.en) + ",",
      p("basedIn") + s(P.location.en) + ",",
      p("stack") + "[" + P.heroStack.map(s).join(", ") + "],",
      p("building") + s(P.currentlyBuilding) + ",",
      p("openToWork") + `<span class="tok-b">${P.available}</span>,`,
      `};`,
      ``,
      `<span class="tok-k">export default</span> developer;<span class="caret"></span>`
    ];
  }
  function renderCode() {
    const lines = codeLines();
    $("#codeBody").innerHTML = lines
      .map((l, i) => `<div class="code-line" style="animation-delay:${i * 60}ms"><span class="ln">${i + 1}</span><span>${l}</span></div>`)
      .join("");
  }

  /* ---------- covers ---------- */
  function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function cover(pr) {
    const tag = pr.sample ? `<span class="cover-tag">${t("sample")}</span>` : "";
    if (pr.image) return `<div class="cover" style="--pc:${pr.color}"><img src="${esc(pr.image)}" alt="" loading="lazy">${tag}</div>`;
    let h = hash(pr.id);
    const palette = ["var(--pc)", "#BBA9F0", "#9FD3C7", "#E7C6A0", "rgba(255,255,255,.28)"];
    const bars = Array.from({ length: 7 }, (_, i) => {
      h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
      const w = 30 + (h % 60);
      const indent = [0, 6, 6, 12, 12, 6, 0][i];
      const col = palette[(h >>> 5) % palette.length];
      return `<span style="width:${w}%;margin-left:${indent}%;background:${col};opacity:${i % 3 ? .9 : .65}"></span>`;
    }).join("");
    return `<div class="cover" style="--pc:${pr.color}"><div class="mini-editor"><div class="fname"><i></i>${esc(pr.file || pr.id)}</div><div class="bars">${bars}</div></div>${tag}</div>`;
  }

  /* ---------- projects ---------- */
  function matches(pr) {
    if (filter !== "all" && pr.category !== filter) return false;
    if (!query) return true;
    const hay = [pr.title.en, pr.title.ar, pr.summary.en, pr.summary.ar, ...pr.stack, D.categories[pr.category]?.en, D.categories[pr.category]?.ar].join(" ").toLowerCase();
    return query.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }
  function renderChips() {
    const counts = {};
    D.projects.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1));
    const cats = [["all", t("all"), D.projects.length], ...Object.keys(D.categories).filter((k) => counts[k]).map((k) => [k, L(D.categories[k]), counts[k]])];
    $("#chips").innerHTML = cats
      .map(([k, label, n]) => `<button class="chip" type="button" data-cat="${k}" aria-pressed="${filter === k}">${esc(label)}<span class="n">${n}</span></button>`)
      .join("");
  }
  function renderProjects() {
    queueMicrotask(() => document.dispatchEvent(new CustomEvent("pf:cards")));
    const list = D.projects.filter(matches);
    const plain = filter === "all" && !query;
    if (!list.length) {
      $("#grid").innerHTML = `<div class="empty" style="grid-column:1/-1"><p>${t("empty")}</p><button class="btn btn-ghost" type="button" id="clearF">${t("clear")}</button></div>`;
      return;
    }
    // a card left alone on the last row gets the wide layout so the grid never has a gap
    const wide = new Set(list.filter((p) => plain && p.featured).map((p) => p.id));
    const rest = list.filter((p) => !wide.has(p.id));
    if (rest.length % 2 === 1) wide.add(rest[rest.length - 1].id);
    $("#grid").innerHTML = list
      .map((pr) => {
        const feat = wide.has(pr.id) ? " featured" : "";
        const status = pr.status ? `<span class="pill">${esc(L(pr.status))}</span>` : "";
        const sample = pr.sample ? `<span class="pill sample">${t("sample")}</span>` : "";
        return `<article class="card${feat}" style="--pc:${pr.color}" tabindex="0" role="button" data-id="${pr.id}" aria-label="${esc(L(pr.title))}">
          ${cover(pr)}
          <div class="card-body">
            <div class="card-top"><span class="yr">${esc(pr.year || "")}</span><span>${esc(L(D.categories[pr.category]) || "")}</span>${status}${sample}</div>
            <h3>${esc(L(pr.title))}</h3>
            <p>${esc(L(pr.summary))}</p>
            <div class="stack">${pr.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
            <span class="open-hint">${t("viewProject")}<svg class="flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </div>
        </article>`;
      })
      .join("");
  }

  /* ---------- modal ---------- */
  let lastFocus = null;
  function openProject(id) {
    const pr = D.projects.find((p) => p.id === id);
    if (!pr) return;
    lastFocus = document.activeElement;
    const links = [
      pr.links?.live ? `<a class="btn btn-primary" href="${esc(pr.links.live)}" target="_blank" rel="noopener">${t("live")}</a>` : "",
      pr.links?.code ? `<a class="btn btn-ghost" href="${esc(pr.links.code)}" target="_blank" rel="noopener">${t("code")}</a>` : ""
    ].join("");
    const details = L(pr.details) || [];
    $("#modalRoot").innerHTML = `<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle" style="--pc:${pr.color}">
      <div class="modal-wrap">${cover(pr)}<button class="icon-btn close-x" type="button" id="mClose" aria-label="${t("close")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <div class="modal-body">
        <div class="card-top"><span class="yr">${esc(pr.year || "")}</span><span>${esc(L(D.categories[pr.category]) || "")}</span>${pr.status ? `<span class="pill">${esc(L(pr.status))}</span>` : ""}</div>
        <h3 id="mTitle">${esc(L(pr.title))}</h3>
        <p style="color:var(--muted)">${esc(L(pr.summary))}</p>
        ${details.length ? `<ul>${details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
        <div class="stack">${pr.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        ${links ? `<div class="modal-actions">${links}</div>` : ""}
      </div></div></div>`;
    document.body.style.overflow = "hidden";
    $("#mClose").focus();
    $("#ov").addEventListener("click", (e) => { if (e.target.id === "ov" || e.target.closest("#mClose")) closeModal(); });
  }
  function closeModal() {
    if (!$("#modalRoot").innerHTML) return;
    $("#modalRoot").innerHTML = "";
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  }

  /* ---------- other sections ---------- */
  function renderStatic() {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $("#search").placeholder = t("searchPh");
    $("#langBtn").textContent = lang === "ar" ? "EN" : "ع";
    $("#logo").textContent = P.initials;

    $("#statusText").textContent = P.available ? L(P.status) : t("busy");
    $(".dot").style.background = P.available ? "" : "var(--muted)";
    $("#heroName").textContent = L(P.name);
    $("#heroRole").textContent = L(P.role);
    $("#heroLede").textContent = L(P.headline);
    $("#heroLoc").textContent = L(P.location);
    const cv = $("#cvBtn");
    if (P.cvUrl) { cv.href = P.cvUrl; cv.hidden = false; } else cv.hidden = true;

    $("#aboutText").innerHTML = L(D.about).map((p) => `<p>${esc(p)}</p>`).join("");
    $("#skills").innerHTML = D.skills
      .map((g) => `<div class="skill-group"><h3>${esc(L(g.group))}</h3><div class="skill-list">${g.items.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div>`)
      .join("");
    $("#timeline").innerHTML = D.experience
      .map((x) => `<li><span class="when">${esc(L(x.period))}</span><div><h3>${esc(L(x.title))}</h3><div class="where">${esc(L(x.place))}</div><p class="what">${esc(L(x.text))}</p></div></li>`)
      .join("");

    const mail = $("#mail");
    mail.textContent = P.email;
    mail.href = "mailto:" + P.email;
    $("#socials").innerHTML = P.socials.filter((s) => s.url).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");
    $("#foot").textContent = `© ${new Date().getFullYear()} ${L(P.fullName)} · ${t("rights")}`;
    document.title = `${L(P.name)} — ${L(P.role)}`;
    tick();
  }
  function renderAll() { renderStatic(); renderChips(); renderProjects(); paintThemeBtn(); document.dispatchEvent(new CustomEvent("pf:render", { detail: { lang } })); }

  /* ---------- clock (Cairo) ---------- */
  function tick() {
    try {
      const time = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }).format(new Date());
      $("#clock").textContent = `${time} ${t("local")}`;
    } catch (e) { $("#clock").parentElement.hidden = true; }
  }
  setInterval(tick, 30000);

  /* ---------- toast & copy ---------- */
  let toastTimer;
  function toast(msg) {
    $("#toastRoot").innerHTML = `<div class="toast" role="status">${esc(msg)}</div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("#toastRoot").innerHTML = ""), 2200);
  }
  function selectMail() {
    const r = document.createRange(); r.selectNodeContents($("#mail"));
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function copyEmail() {
    const fail = () => { selectMail(); toast(t("copyFail")); };
    try {
      if (!navigator.clipboard) return fail();
      navigator.clipboard.writeText(P.email).then(() => toast(t("copied")), fail);
    } catch (e) { fail(); }
  }

  /* ---------- command palette ---------- */
  let palItems = [], palIndex = 0;
  function buildPalItems() {
    const go = (hash) => () => { closePalette(); document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }); };
    return [
      { label: t("navWork"), kind: t("palSection"), run: go("#work") },
      { label: t("navAbout"), kind: t("palSection"), run: go("#about") },
      { label: t("navJourney"), kind: t("palSection"), run: go("#journey") },
      { label: t("navTerminal"), kind: t("palSection"), run: go("#terminal") },
      { label: t("navContact"), kind: t("palSection"), run: go("#contact") },
      ...D.projects.map((p) => ({ label: L(p.title), kind: t("palProject"), run: () => { closePalette(); openProject(p.id); } })),
      { label: t("palTheme"), kind: t("palAction"), run: () => { closePalette(); toggleTheme(); } },
      { label: t("palLang"), kind: t("palAction"), run: () => { closePalette(); switchLang(); } },
      { label: t("palCopy"), kind: t("palAction"), run: () => { closePalette(); copyEmail(); } }
    ];
  }
  function openPalette() {
    if ($("#paletteRoot").innerHTML) return;
    lastFocus = document.activeElement;
    $("#paletteRoot").innerHTML = `<div class="overlay" id="pov"><div class="palette" role="dialog" aria-modal="true" aria-label="Quick search">
      <input id="palInput" type="text" placeholder="${esc(t("palPh"))}" autocomplete="off" aria-controls="palList">
      <ul id="palList" role="listbox"></ul></div></div>`;
    $("#pov").addEventListener("click", (e) => { if (e.target.id === "pov") closePalette(); });
    const input = $("#palInput");
    input.addEventListener("input", () => { palIndex = 0; drawPalette(input.value); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palItems.length - 1); drawPalette(input.value, true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); drawPalette(input.value, true); }
      else if (e.key === "Enter") { e.preventDefault(); palItems[palIndex]?.run(); }
    });
    drawPalette("");
    input.focus();
  }
  function drawPalette(q, keep) {
    const all = buildPalItems();
    const qq = q.trim().toLowerCase();
    palItems = qq ? all.filter((i) => i.label.toLowerCase().includes(qq) || i.kind.toLowerCase().includes(qq)) : all;
    if (!keep) palIndex = 0;
    const ul = $("#palList");
    ul.innerHTML = palItems.map((i, n) => `<li role="option" data-n="${n}" aria-selected="${n === palIndex}"><span>${esc(i.label)}</span><small>${esc(i.kind)}</small></li>`).join("");
    ul.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    ul.onclick = (e) => { const li = e.target.closest("li"); if (li) palItems[+li.dataset.n]?.run(); };
  }
  function closePalette() {
    if (!$("#paletteRoot").innerHTML) return;
    $("#paletteRoot").innerHTML = "";
    lastFocus?.focus?.();
  }

  /* ---------- language ---------- */
  function switchLang() {
    lang = lang === "ar" ? "en" : "ar";
    store.set("lang", lang);
    renderAll();
  }

  /* ---------- events ---------- */
  $("#themeBtn").addEventListener("click", toggleTheme);
  $("#langBtn").addEventListener("click", switchLang);
  $("#openPalette").addEventListener("click", openPalette);
  $("#copyMail").addEventListener("click", copyEmail);
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    filter = b.dataset.cat; renderChips(); renderProjects();
  });
  $("#search").addEventListener("input", (e) => { query = e.target.value.trim(); renderProjects(); });
  $("#grid").addEventListener("click", (e) => {
    if (e.target.closest("#clearF")) { filter = "all"; query = ""; $("#search").value = ""; renderChips(); renderProjects(); return; }
    const c = e.target.closest(".card"); if (c) openProject(c.dataset.id);
  });
  $("#grid").addEventListener("keydown", (e) => {
    const c = e.target.closest(".card");
    if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(c.dataset.id); }
  });
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "");
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#paletteRoot").innerHTML ? closePalette() : openPalette(); }
    else if (e.key === "/" && !typing) { e.preventDefault(); openPalette(); }
    else if (e.key === "Escape") { closePalette(); closeModal(); }
  });

  /* scroll: progress bar, nav border, active link */
  const bar = $("#progress"), nav = $("#nav");
  const links = [...document.querySelectorAll(".nav-links a")];
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle("scrolled", scrollY > 8);
    let current = "";
    links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s && s.getBoundingClientRect().top < 140) current = a.getAttribute("href"); });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === current));
  }
  addEventListener("scroll", onScroll, { passive: true });

  if (/Mac|iPhone|iPad/.test(navigator.platform || "")) document.querySelectorAll("kbd").forEach((k) => (k.textContent = "⌘ K"));

  window.PF = {
    get lang() { return lang; }, t, L, esc,
    openProject, toggleTheme, switchLang, copyEmail, isDark,
    projects: () => D.projects
  };

  renderCode();
  renderAll();
  onScroll();
})();
