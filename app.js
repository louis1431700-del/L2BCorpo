// ========= CONFIG : remplacez par vos vrais liens =========
const CONFIG = {
  stripeKit: "https://buy.stripe.com/VOTRE_LIEN_KIT",
  stripeAgence: "https://buy.stripe.com/VOTRE_LIEN_AGENCE",
  tipsUrl: "https://ko-fi.com/VOTRE_NOM",
  domainAffiliate: "https://www.namecheap.com/domains/registration/results/?domain=",
  isPro: false
};

const $ = s => document.querySelector(s);
const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };

// ========= Données =========
const FONTS = ["Syne","Playfair Display","Space Grotesk","Fredoka","Cormorant Garamond","Montserrat","Bebas Neue","Pacifico","Archivo Black","DM Serif Display","Righteous","Inter"];
const ICONS = ["★","⚡","✦","❖","☾","✿","▲","●","♦","☀","✚","∞","♛","⬢"];
const PALETTES = [["#8b5cf6","#ec4899"],["#06b6d4","#3b82f6"],["#f59e0b","#ef4444"],["#10b981","#14b8a6"],["#111827","#6b7280"],["#d946ef","#6366f1"],["#f97316","#eab308"],["#0ea5e9","#22d3ee"]];
const PRE = { tech:["Neo","Flux","Byte","Nova","Zen","Volt","Pixel","Quant"], luxe:["Aurel","Maison","Opale","Velours","Lumi","Eclat","Noble","Orion"], fun:["Pop","Yumi","Zoo","Boing","Kiki","Wavy","Zesty","Fizz"], nature:["Eco","Terra","Sylva","Aqua","Flora","Gaia","Verd","Luma"], court:["Ko","Zy","Vo","Ax","Jo","Qi","Ru","Ty"] };
const SUF = { tech:["ify","ly","io","ix","ware","lab","hub","ex"], luxe:["ique","elle","ora","ance","ine","ia","on","is"], fun:["ito","zy","oo","ie","ster","ly","a","y"], nature:["ia","ora","leaf","wood","ly","is","a","en"], court:["x","o","a","i","z","on","ly","io"] };
const TAGS = ["Votre succès commence ici","Pensez grand, agissez simple","L'avenir vous appartient","Créé pour se démarquer","Simplement exceptionnel","Là où les idées prennent vie","Votre univers, vos règles","Faites la différence"];

const rnd = a => a[Math.floor(Math.random() * a.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// ========= Générateur de noms =========
function makeNames(kw, style) {
  const out = new Set();
  const keys = style === "mix" ? Object.keys(PRE) : [style];
  const base = kw.trim().replace(/[^a-zA-ZÀ-ÿ]/g, "");
  let guard = 0;
  while (out.size < 18 && guard++ < 400) {
    const k = rnd(keys);
    const r = Math.random();
    let n;
    if (base && r < .35) n = cap(base.slice(0, 4)) + rnd(SUF[k]);
    else if (base && r < .6) n = rnd(PRE[k]) + base.slice(0, 3).toLowerCase();
    else if (r < .85) n = rnd(PRE[k]) + rnd(SUF[k]);
    else n = rnd(PRE[k]);
    n = cap(n);
    if (n.length >= 3 && n.length <= 12) out.add(n);
  }
  return [...out];
}

function score(name) {
  let s = 50;
  const l = name.length;
  if (l >= 4 && l <= 7) s += 25; else if (l <= 9) s += 12; else s -= 5;
  const v = (name.match(/[aeiouy]/gi) || []).length;
  const ratio = v / l;
  if (ratio > .3 && ratio < .6) s += 15;
  if (!/(.)\1\1/.test(name)) s += 5;
  if (/[xzkqv]/i.test(name)) s += 5;
  return Math.max(10, Math.min(99, s));
}

// ========= État du studio =========
const st = { name: "Nomora", tag: "Votre marque, en un clic", font: "Syne", shape: "circle", icon: "★", layout: "h", c1: "#8b5cf6", c2: "#ec4899" };
let favs = JSON.parse(localStorage.getItem("nomora_favs") || "[]");

// ========= Dessin du logo =========
function shapePath(ctx, shape, cx, cy, r) {
  ctx.beginPath();
  if (shape === "circle") ctx.arc(cx, cy, r, 0, Math.PI * 2);
  else if (shape === "square") { const x = cx - r, y = cy - r, w = r * 2, k = r * .35; ctx.moveTo(x + k, y); ctx.arcTo(x + w, y, x + w, y + w, k); ctx.arcTo(x + w, y + w, x, y + w, k); ctx.arcTo(x, y + w, x, y, k); ctx.arcTo(x, y, x + w, y, k); }
  else if (shape === "hex") { for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i - Math.PI / 2; ctx[i ? "lineTo" : "moveTo"](cx + r * Math.cos(a), cy + r * Math.sin(a)); } ctx.closePath(); }
  else if (shape === "diamond") { ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy); ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy); ctx.closePath(); }
  else if (shape === "blob") { ctx.moveTo(cx, cy - r); ctx.bezierCurveTo(cx + r * 1.2, cy - r * .2, cx + r * .8, cy + r, cx, cy + r); ctx.bezierCurveTo(cx - r * .8, cy + r, cx - r * 1.2, cy - r * .2, cx, cy - r); }
}

function drawLogo(cv, opts = {}) {
  const ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  const o = Object.assign({}, st, opts);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = o.bg || "#ffffff"; ctx.fillRect(0, 0, W, H);
  const sc = Math.min(W / 900, H / 420) * (o.scale || 1);
  const r = 80 * sc;
  const grad = (x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, o.c1); g.addColorStop(1, o.c2); return g; };
  ctx.textBaseline = "middle";
  const nameSize = 92 * sc, tagSize = 26 * sc;
  ctx.font = `${nameSize}px "${o.font}", sans-serif`;
  const tw = ctx.measureText(o.name).width;
  let ix, iy, tx, ty, ta;
  if (o.layout === "h") {
    const total = (o.shape === "none" ? 0 : r * 2 + 30 * sc) + tw;
    const start = (W - total) / 2;
    ix = start + r; iy = H / 2 - (o.tag ? 14 * sc : 0);
    tx = start + (o.shape === "none" ? 0 : r * 2 + 30 * sc); ty = iy; ta = "left";
  } else {
    ix = W / 2; iy = H / 2 - r - 10 * sc; tx = W / 2; ty = iy + r + 60 * sc; ta = "center";
  }
  if (o.shape !== "none") {
    shapePath(ctx, o.shape, ix, iy, r); ctx.fillStyle = grad(ix - r, iy - r, ix + r, iy + r); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = `${r * 1.0}px Arial, sans-serif`; ctx.fillText(o.icon, ix, iy + 4 * sc);
  }
  ctx.textAlign = ta; ctx.font = `${nameSize}px "${o.font}", sans-serif`;
  ctx.fillStyle = grad(tx, ty - nameSize / 2, tx + tw, ty + nameSize / 2); ctx.fillText(o.name, tx, ty);
  if (o.tag) { ctx.font = `${tagSize}px Inter, sans-serif`; ctx.fillStyle = "#6b7280"; ctx.fillText(o.tag, tx, ty + nameSize * .7); }
  if (!CONFIG.isPro && !opts.noMark) { ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = "#000"; ctx.font = `bold ${30 * sc}px Inter`; ctx.textAlign = "center"; ctx.translate(W / 2, H / 2); ctx.rotate(-.25); ctx.fillText("NOMORA · VERSION GRATUITE", 0, 0); ctx.restore(); }
}

// ========= Maquettes =========
function mockups() {
  const c1 = $("#m1"), c2 = $("#m2"), c3 = $("#m3"), c4 = $("#m4");
  // Carte de visite
  drawLogo(c1, { bg: "#fafafa", layout: "h", scale: .55, tag: "", noMark: true });
  let x = c1.getContext("2d"); x.fillStyle = "#374151"; x.font = "15px Inter"; x.textAlign = "left"; x.fillText("Jean Dupont · Fondateur", 30, 190); x.fillText("contact@" + st.name.toLowerCase() + ".com", 30, 214);
  // Instagram
  drawLogo(c2, { bg: st.c1, layout: "v", scale: .6, noMark: true, c1: "#ffffff", c2: "#ffffff", tag: "" });
  // Site web
  x = c3.getContext("2d"); x.fillStyle = "#0b0b14"; x.fillRect(0, 0, 420, 260);
  x.fillStyle = "#1f1f2e"; x.fillRect(0, 0, 420, 34); ["#ef4444","#f59e0b","#10b981"].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(16 + i * 18, 17, 5, 0, 7); x.fill(); });
  const g = x.createLinearGradient(0, 60, 420, 260); g.addColorStop(0, st.c1); g.addColorStop(1, st.c2); x.fillStyle = g; x.fillRect(30, 70, 360, 100);
  x.fillStyle = "#fff"; x.font = `32px "${st.font}"`; x.textAlign = "center"; x.fillText(st.name, 210, 120);
  x.font = "13px Inter"; x.fillText(st.tag, 210, 150);
  x.fillStyle = "#2a2a3d"; x.fillRect(30, 190, 110, 50); x.fillRect(155, 190, 110, 50); x.fillRect(280, 190, 110, 50);
  // T-shirt
  x = c4.getContext("2d"); x.fillStyle = "#f3f4f6"; x.fillRect(0, 0, 300, 300);
  x.fillStyle = "#1f2937"; x.beginPath(); x.moveTo(90, 40); x.lineTo(40, 90); x.lineTo(70, 130); x.lineTo(90, 112); x.lineTo(90, 270); x.lineTo(210, 270); x.lineTo(210, 112); x.lineTo(230, 130); x.lineTo(260, 90); x.lineTo(210, 40); x.quadraticCurveTo(150, 80, 90, 40); x.fill();
  const t = document.createElement("canvas"); t.width = 600; t.height = 280; drawLogo(t, { bg: "#1f2937", layout: "v", scale: .55, noMark: true, tag: "" });
  x.drawImage(t, 80, 110, 140, 65);
}

// ========= Rendu global =========
function render() {
  drawLogo($("#cv"));
  mockups();
  const s = score(st.name);
  $("#scoreBar").style.width = s + "%"; $("#scoreTxt").textContent = s + "/100";
  $("#domain").href = CONFIG.domainAffiliate + encodeURIComponent(st.name.toLowerCase() + ".com");
  history.replaceState(null, "", "#d=" + btoa(unescape(encodeURIComponent(JSON.stringify(st)))));
}
function renderSoon() { (document.fonts ? document.fonts.load(`40px "${st.font}"`) : Promise.resolve()).then(render).catch(render); }

function syncInputs() {
  $("#sName").value = st.name; $("#sTag").value = st.tag; $("#sFont").value = st.font; $("#sShape").value = st.shape; $("#sIcon").value = st.icon; $("#sLayout").value = st.layout; $("#c1").value = st.c1; $("#c2").value = st.c2;
}

// ========= Cartes de noms =========
function cardHTML(n) { return `<div class="card" data-n="${n}"><h4>${n}</h4><p>${n.toLowerCase()}.com</p><div class="tags"><span>Score ${score(n)}</span><span>Ouvrir dans le studio</span></div></div>`; }
function generate() {
  const names = makeNames($("#kw").value, $("#style").value);
  $("#grid").innerHTML = names.map(cardHTML).join("");
}
$("#grid").addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c) return;
  st.name = c.dataset.n; st.tag = rnd(TAGS); st.font = rnd(FONTS); st.shape = rnd(["circle","square","hex","diamond","blob"]); st.icon = rnd(ICONS);
  const p = rnd(PALETTES); st.c1 = p[0]; st.c2 = p[1];
  syncInputs(); renderSoon();
  $("#studio").scrollIntoView({ behavior: "smooth" });
});
$("#go").onclick = generate;
$("#kw").addEventListener("keydown", e => { if (e.key === "Enter") generate(); });

// ========= Contrôles du studio =========
$("#sFont").innerHTML = FONTS.map(f => `<option>${f}</option>`).join("");
$("#sIcon").innerHTML = ICONS.map(i => `<option>${i}</option>`).join("");
$("#palettes").innerHTML = PALETTES.map((p, i) => `<i data-i="${i}" style="background:linear-gradient(135deg,${p[0]},${p[1]})"></i>`).join("");
$("#palettes").addEventListener("click", e => { const i = e.target.dataset.i; if (i === undefined) return; st.c1 = PALETTES[i][0]; st.c2 = PALETTES[i][1]; syncInputs(); render(); });
[["#sName","name"],["#sTag","tag"],["#sFont","font"],["#sShape","shape"],["#sIcon","icon"],["#sLayout","layout"],["#c1","c1"],["#c2","c2"]].forEach(([sel, key]) => {
  $(sel).addEventListener("input", e => { st[key] = e.target.value; key === "font" ? renderSoon() : render(); });
});
$("#rand").onclick = () => { st.font = rnd(FONTS); st.shape = rnd(["circle","square","hex","diamond","blob"]); st.icon = rnd(ICONS); const p = rnd(PALETTES); st.c1 = p[0]; st.c2 = p[1]; syncInputs(); renderSoon(); };

// ========= Favoris =========
function saveFavs() { localStorage.setItem("nomora_favs", JSON.stringify(favs)); renderFavs(); }
function renderFavs() {
  $("#favCount").textContent = favs.length;
  $("#favList").innerHTML = favs.length ? favs.map((f, i) => `<div class="card" data-f="${i}"><h4 style="font-family:'${f.font}'">${f.name}</h4><p>${f.tag}</p><div class="tags"><span>Charger</span><span data-del="${i}">Supprimer</span></div></div>`).join("") : "<p style='color:var(--mut)'>Aucun favori pour le moment.</p>";
}
$("#fav").onclick = () => { favs.push({ ...st }); saveFavs(); toast("❤️ Ajouté aux favoris"); };
$("#favList").addEventListener("click", e => {
  const d = e.target.dataset.del;
  if (d !== undefined) { favs.splice(+d, 1); saveFavs(); e.stopPropagation(); return; }
  const c = e.target.closest("[data-f]"); if (!c) return;
  Object.assign(st, favs[+c.dataset.f]); syncInputs(); renderSoon(); $("#studio").scrollIntoView({ behavior: "smooth" });
});
$("#exportCsv").onclick = () => {
  if (!favs.length) return toast("Aucun favori à exporter");
  const csv = "nom;slogan;police;couleur1;couleur2\n" + favs.map(f => [f.name, f.tag, f.font, f.c1, f.c2].join(";")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "nomora-favoris.csv"; a.click();
};

// ========= Téléchargements & partage =========
$("#dlPng").onclick = () => {
  const big = document.createElement("canvas"); big.width = CONFIG.isPro ? 1800 : 900; big.height = CONFIG.isPro ? 840 : 420;
  drawLogo(big);
  const a = document.createElement("a"); a.href = big.toDataURL("image/png"); a.download = st.name.toLowerCase() + "-logo.png"; a.click();
  toast(CONFIG.isPro ? "PNG HD téléchargé" : "PNG téléchargé (filigrane) — passez Pro pour la HD");
};
$("#dlSvg").onclick = () => {
  if (!CONFIG.isPro) { toast("🔒 Le SVG est réservé au Kit Pro"); location.hash = location.hash; $("#tarifs").scrollIntoView({ behavior: "smooth" }); return; }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="420"><defs><linearGradient id="g"><stop offset="0" stop-color="${st.c1}"/><stop offset="1" stop-color="${st.c2}"/></linearGradient></defs><circle cx="200" cy="210" r="80" fill="url(#g)"/><text x="200" y="230" font-size="80" fill="#fff" text-anchor="middle">${st.icon}</text><text x="310" y="230" font-size="92" font-family="${st.font}" fill="url(#g)">${st.name}</text></svg>`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); a.download = st.name.toLowerCase() + "-logo.svg"; a.click();
};
$("#share").onclick = () => { navigator.clipboard.writeText(location.href).then(() => toast("🔗 Lien copié !")); };

// ========= Newsletter, paiements, divers =========
$("#nl").addEventListener("submit", e => { e.preventDefault(); const m = $("#nlMail").value; const l = JSON.parse(localStorage.getItem("nomora_mails") || "[]"); l.push(m); localStorage.setItem("nomora_mails", JSON.stringify(l)); $("#nlMail").value = ""; toast("📬 Merci, vous êtes inscrit !"); });
document.querySelectorAll("[data-pay]").forEach(a => { a.href = a.dataset.pay === "kit" ? CONFIG.stripeKit : CONFIG.stripeAgence; a.target = "_blank"; a.rel = "noopener"; });
$("#tip").href = CONFIG.tipsUrl; $("#tip").target = "_blank";
$("#year").textContent = new Date().getFullYear();

const words = ["décoller","briller","vendre","exploser","marquer"]; let w = 0;
setInterval(() => { const el = $("#rotate"); el.style.opacity = 0; el.style.transform = "translateY(-15px)"; setTimeout(() => { w = (w + 1) % words.length; el.textContent = words[w]; el.style.opacity = 1; el.style.transform = "none"; }, 400); }, 2500);

// ========= Démarrage (avec lien partagé) =========
try { const m = location.hash.match(/d=(.+)$/); if (m) Object.assign(st, JSON.parse(decodeURIComponent(escape(atob(m[1]))))); } catch (e) {}
syncInputs(); renderFavs();
$("#kw").value = "café"; generate(); renderSoon();
