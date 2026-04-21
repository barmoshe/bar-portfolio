const PORTFOLIO = {
  projects: [
    {name:"claude-creative-stack", description:"A reference pack for building creative work with Claude - knowledge docs, Agent Skills, single-file artifact starters, prompt scaffolds, and a working MCP server. Designed to be mounted straight into a Claude Project.", language:"Claude", url:"https://github.com/barmoshe/claude-creative-stack"},
    {name:"isralify", description:"Node.js backend for a Spotify-inspired music app - REST API, user auth, custom middleware, integrated logger, MongoDB. The React frontend lives in a sibling repo.", language:"JavaScript", url:"https://github.com/barmoshe/Israelify-backend"},
    {
      name:"temporal-data-processing",
      description:"A single Temporal workflow that orchestrates three language workers - Go, Python, and TypeScript, each on its own task queue - to process data end-to-end. Featured on Temporal's Code Exchange with a companion Medium write-up.",
      language:"Go · Python · TypeScript",
      url:"https://github.com/barmoshe/data-processing-service",
      extras: [
        {label:"Temporal Code Exchange", url:"https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal"},
        {label:"Read the Medium article", url:"https://medium.com/@barmoshe/building-a-cross-language-data-processing-service-with-temporal-a-practical-guide-bf0fb1155d46"},
      ],
    },
  ],
  contact: { email: "1barmoshe1@gmail.com", github: "https://github.com/barmoshe", linkedin: "https://www.linkedin.com/in/barmoshe/", phone: "+972546561465" },
};

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];

/* ── Hero portrait slideshow ── */
(function initHeroSlides(){
  const root = document.getElementById("heroSlides");
  if (!root) return;
  const slides = [...root.querySelectorAll(".slide")];
  if (!slides.length) return;
  const caption = document.getElementById("heroCaption");
  const dotsWrap = document.getElementById("heroDots");
  const FX = ["fade","iris","wipe","skew","blinds"];
  let idx = 0, fxIdx = 0, timer = null, paused = false;

  const dots = [];

  function go(next, user){
    if (next === idx) return;
    const fx = FX[fxIdx % FX.length]; fxIdx++;
    const prev = slides[idx];
    const cur  = slides[next];
    cur.dataset.fx = fx;
    cur.classList.remove("is-active");
    cur.classList.add("is-enter");
    // force reflow so entrance styles commit before activating
    // eslint-disable-next-line no-unused-expressions
    cur.offsetHeight;
    requestAnimationFrame(() => {
      cur.classList.remove("is-enter");
      cur.classList.add("is-active");
      prev.classList.remove("is-active");
      prev.removeAttribute("data-fx");
    });
    dots.forEach((d,i)=>d.setAttribute("aria-current", i===next ? "true" : "false"));
    if (caption) caption.textContent = cur.dataset.caption || "";
    idx = next;
    if (user) restart();
  }
  function nextDelay(){ return 3000 + Math.random() * 7000; }
  function tick(){ go((idx+1) % slides.length, false); schedule(); }
  function schedule(){ if (paused) return; timer = setTimeout(tick, nextDelay()); }
  function start(){ if (timer || paused) return; schedule(); }
  function stop(){ clearTimeout(timer); timer = null; }
  function restart(){ stop(); start(); }

  // Initial state - always start with first slide (img0)
  idx = 0;
  slides[0].classList.add("is-active");
  slides[0].dataset.fx = "fade";

  root.addEventListener("mouseenter", () => { paused = true; stop(); });
  root.addEventListener("mouseleave", () => { paused = false; start(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  start();
})();

/* ── Cover dismiss ── */
function dismissBoot(){
  const b = $("#boot");
  if (!b || b.classList.contains("gone")) return;
  b.classList.add("gone");
  setTimeout(()=>b.remove(), 650);
}
addEventListener("keydown", e => { if ($("#boot") && !$("#boot").classList.contains("gone")) dismissBoot(); });
addEventListener("pointerdown", e => {
  if (!$("#boot") || $("#boot").classList.contains("gone")) return;
  if (e.target.closest(".strip") || e.target.closest(".toggle")) return;
  dismissBoot();
});

/* ── Art generator (code monospace theme) ── */
function codeArt(idx, lang){
  const colors = [
    ["oklch(0.55 0.16 200)","oklch(0.85 0.14 110)"],
    ["oklch(0.60 0.2 25)","oklch(0.88 0.14 60)"],
    ["oklch(0.45 0.12 250)","oklch(0.82 0.12 135)"],
    ["oklch(0.50 0.14 140)","oklch(0.88 0.12 180)"],
  ];
  const c = colors[idx % colors.length];
  const icons = ["</>", "{}", "fn", "λ", "∞", ">_"];
  const icon = icons[idx % icons.length];
  return `<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <defs>
      <linearGradient id="cg${idx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c[0]}"/>
        <stop offset="100%" stop-color="${c[1]}"/>
      </linearGradient>
    </defs>
    <rect width="200" height="100" fill="url(#cg${idx})"/>
    <text x="100" y="50" text-anchor="middle" dy=".3em" font-family="monospace" font-size="32" fill="oklch(0.98 0 0 / .9)" font-weight="700">${icon}</text>
  </svg>`;
}

/* ── Render projects ── */
function renderProjects(){
  const grid = $("#proj-grid");
  const shortDesc = (d) => {
    const s = (d || "").split(" - ")[0].split(". ")[0];
    return s.length > 110 ? s.slice(0, 107).trimEnd() + "…" : s;
  };
  const langIcon = { TypeScript:"</>", JavaScript:"{}", Go:"fn", Python:"λ", Rust:">_", Claude:"✦" };
  const iconFor = (lang) => langIcon[lang] || (lang.includes("·") ? "∞" : "{ }");
  grid.innerHTML = PORTFOLIO.projects.map((p,i)=>`
    <article data-idx="${i}" tabindex="0" role="button" aria-label="${p.name}">
      <span class="num" aria-hidden="true">${String(i+1).padStart(2,"0")}</span>
      <header class="head">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="path">~/${p.name}</span>
      </header>
      <div class="body">
        <div class="meta">
          <span class="glyph" aria-hidden="true">${iconFor(p.language)}</span>
          <span class="lang">${p.language}</span>
        </div>
        <h3 class="t">${p.name}</h3>
        <p class="d">${shortDesc(p.description)}</p>
        <div class="go">View repo →</div>
      </div>
    </article>
  `).join("");
}

/* ── Lightbox ── */
const lb = $("#lb");
function openLB(idx){
  const p = PORTFOLIO.projects[idx];
  $("#lbArt").innerHTML = codeArt(idx, p.language);
  $("#lbKicker").textContent = `GITHUB · ${p.language}`;
  $("#lb-title").textContent = p.name;
  $("#lbBlurb").textContent = p.description;
  $("#lbLang").textContent = p.language;
  $("#lbLink").href = p.url;
  const extrasBox = $("#lbExtras");
  const extrasList = $("#lbExtrasList");
  if (p.extras && p.extras.length){
    extrasList.innerHTML = p.extras.map(x =>
      `<li><a href="${x.url}" target="_blank" rel="noopener" style="color:var(--green)">${x.label}</a></li>`
    ).join("");
    extrasBox.style.display = "block";
  } else {
    extrasList.innerHTML = "";
    extrasBox.style.display = "none";
  }
  lb.classList.add("open");
  $("#lbClose").focus();
}
function closeLB(){ lb.classList.remove("open"); }
$("#lbClose").addEventListener("click", closeLB);
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
addEventListener("keydown", e => { if (e.key === "Escape" && lb.classList.contains("open")) closeLB(); });
document.addEventListener("click", e => {
  const t = e.target.closest(".clip article");
  if (t) openLB(+t.dataset.idx);
});
document.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = document.activeElement?.closest?.(".clip article");
  if (t){ e.preventDefault(); openLB(+t.dataset.idx); }
});

/* ── Letter form: removed - contact page is now a plain card ── */

/* ── Theme toggle: auto → light → dark → auto ── */
(function(){
  const btn = $("#themeBtn");
  if (!btn) return;
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const glyph = { auto:"🌓", light:"☀", dark:"☾" };
  const label = { auto:"Theme: auto (system)", light:"Theme: light", dark:"Theme: dark" };
  function read(){ try{ return localStorage.getItem("bm:theme") || "auto"; }catch{ return "auto"; } }
  function write(v){ try{ v==="auto" ? localStorage.removeItem("bm:theme") : localStorage.setItem("bm:theme", v); }catch{} }
  function apply(pref){
    const dark = pref === "dark" || (pref === "auto" && mq.matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.themePref = pref;
    btn.textContent = glyph[pref];
    btn.title = label[pref];
    btn.setAttribute("aria-label", label[pref]);
  }
  apply(read());
  btn.addEventListener("click", () => {
    const cur = read();
    const next = cur === "auto" ? "light" : cur === "light" ? "dark" : "auto";
    write(next);
    apply(next);
  });
  mq.addEventListener?.("change", () => { if (read() === "auto") apply("auto"); });
})();

/* ── Remember me ── */
$("#skipBtn").addEventListener("click", async () => {
  try{ await window.storage?.set?.("bm:skip", "1"); }catch{}
  $("#skipBtn").textContent = "remembered ✓";
  $("#skipBtn").disabled = true;
});

/* ── Mobile tab bar active-section sync ── */
(function initTabBar(){
  const tabs = $$(".tabbar a");
  if (!tabs.length) return;
  const map = new Map();
  tabs.forEach(a => {
    const id = a.dataset.target;
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;
  let current = null;
  const setActive = a => {
    if (current === a) return;
    tabs.forEach(t => t.removeAttribute("aria-current"));
    if (a) a.setAttribute("aria-current", "true");
    current = a;
  };
  const io = new IntersectionObserver(entries => {
    // Pick the most-visible intersecting section
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(map.get(visible.target));
  }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
  map.forEach((_, sec) => io.observe(sec));
})();

/* ── Boot ── */
(async function init(){
  renderProjects();
  try{
    const r = await window.storage?.get?.("bm:skip");
    if (r && r.value) dismissBoot();
  }catch{}
})();
