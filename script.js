/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => "₹" + n.toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
window.ph = txt => { const d = document.createElement("div"); d.className = "ph"; d.textContent = txt; return d; };

const WA = window.WA_NUMBER || "919372688596";
const sb = (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

/* ---------- price list ---------- */
const PRICES = [
  { n: "Basic Instagram Reel", d: "cuts + music + text", min: 500, max: 800 },
  { n: "Professional Reel", d: "cuts + captions + transitions + SFX", min: 1000, max: 1500 },
  { n: "Advanced Reel", d: "motion graphics + effects + advanced editing", min: 1500, max: 2500 },
  { n: "YouTube Shorts", d: "", min: 800, max: 1500 },
  { n: "Educational Video – Basic", d: "", min: 1500, max: 2500 },
  { n: "YouTube Video – 5–10 min", d: "", min: 2500, max: 4000 },
  { n: "YouTube Video – 10–20 min", d: "", min: 4000, max: 6000 },
  { n: "Educational Long Video", d: "", min: 3000, max: 6000 },
  { n: "Promotional / Brand Video", d: "", min: 3000, max: 7000 },
  { n: "Motion Graphics / After Effects", d: "", min: 1500, max: 4000 },
  { n: "Video Thumbnail – Canva", d: "", min: 300, max: 500 },
  { n: "Subtitle / Captioning", d: "", min: 300, max: 700 },
  { n: "Short Video + Thumbnail Combo", d: "", min: 1200, max: 1800 }
];

$("#priceGrid").innerHTML = PRICES.map(p => `
  <div class="card price">
    <div><h3>${esc(p.n)}</h3>${p.d ? `<p>${esc(p.d)}</p>` : ""}</div>
    <div class="amt">${fmt(p.min)} – ${fmt(p.max)}</div>
    <a class="btn ghost" target="_blank" rel="noopener"
       href="https://wa.me/${WA}?text=${encodeURIComponent("Hi Aniket, I want to order: " + p.n)}">Order on WhatsApp</a>
  </div>`).join("");

/* ---------- estimator ---------- */
$("#estList").innerHTML = PRICES.map((p, i) => `
  <div class="est-row"><div>${esc(p.n)}<small>${fmt(p.min)} – ${fmt(p.max)}</small></div>
  <input type="number" min="0" max="99" value="0" data-i="${i}" aria-label="Quantity for ${esc(p.n)}"></div>`).join("");

function estimate() {
  let lo = 0, hi = 0, lines = [];
  $$("#estList input").forEach(inp => {
    const q = Math.max(0, Math.min(99, parseInt(inp.value) || 0));
    if (q) { const p = PRICES[+inp.dataset.i]; lo += q * p.min; hi += q * p.max; lines.push(`• ${q} x ${p.n}`); }
  });
  $("#estOut").textContent = lo ? `${fmt(lo)} – ${fmt(hi)}` : "₹0";
  const msg = lines.length
    ? `Hi Aniket, I need a quote for:\n${lines.join("\n")}\nEstimated: ${fmt(lo)} – ${fmt(hi)}`
    : "Hi Aniket, I want to get a quote for my video project.";
  $("#estSend").href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}
$("#estList").addEventListener("input", estimate);
estimate();

/* ---------- videos ---------- */
const VIDEOS = window.VIDEOS || [];
let shown = 3;
function renderVideos() {
  $("#videoGrid").innerHTML = VIDEOS.slice(0, shown).map(v => `
    <a class="vid" href="${esc(v.link)}" target="_blank" rel="noopener">
      <img class="th" src="${esc(v.thumb)}" alt="${esc(v.title)}" loading="lazy"
           onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22640%22 height=%22360%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%2313131b%22/></svg>'">
      <span class="play">▶</span><h4>${esc(v.title)}</h4>
    </a>`).join("");
  $("#moreVideos").style.display = shown >= VIDEOS.length ? "none" : "";
}
$("#moreVideos").onclick = () => { shown += 3; renderVideos(); };
renderVideos();

/* ---------- before / after ---------- */
const ba = $("#ba1");
$("input", ba).addEventListener("input", e => ba.style.setProperty("--p", e.target.value + "%"));

/* ---------- reviews ---------- */
let rating = 5;
const stars = $$("#stars button");
function paintStars() { stars.forEach(b => b.classList.toggle("on", +b.dataset.v <= rating)); }
stars.forEach(b => b.onclick = () => { rating = +b.dataset.v; paintStars(); });
paintStars();

const SAMPLE_REVIEWS = [
  { name: "Client", rating: 5, text: "Add your first real review here after your first project." }
];
async function loadReviews() {
  let rows = SAMPLE_REVIEWS;
  if (sb) {
    const { data } = await sb.from("reviews").select("name,rating,text").eq("approved", true).order("created_at", { ascending: false }).limit(12);
    if (data && data.length) rows = data;
  }
  $("#reviewList").innerHTML = rows.map(r => `
    <div class="card rev"><div class="s">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
    <p>“${esc(r.text)}”</p><h4 style="margin-top:10px">${esc(r.name)}</h4></div>`).join("");
}
loadReviews();

$("#reviewForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, msg = $("#reviewMsg");
  if (f.website.value) return; // honeypot
  if (!sb) { msg.textContent = "Reviews are not connected yet (add Supabase keys in config.js)."; return; }
  const { error } = await sb.from("reviews").insert({ name: f.name.value.trim(), text: f.text.value.trim(), rating });
  msg.textContent = error ? "Something went wrong. Please try again." : "Thank you! Your review will appear after approval.";
  if (!error) f.reset();
});

/* ---------- contact ---------- */
$("#contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, msg = $("#contactMsg");
  if (f.website.value) return;
  const body = { name: f.name.value.trim(), email: f.email.value.trim(), message: f.message.value.trim() };
  if (sb) {
    const { error } = await sb.from("messages").insert(body);
    if (!error) { msg.textContent = "Message sent! I'll reply soon."; f.reset(); return; }
  }
  // fallback: open WhatsApp with the message
  const t = `Hi Aniket, I'm ${body.name} (${body.email}).\n${body.message}`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`, "_blank");
  msg.textContent = "Opening WhatsApp so you can send your message.";
});

/* ---------- language toggle ---------- */
const MR = {
  nav_videos: "व्हिडिओ", nav_services: "सेवा", nav_pricing: "किंमत", nav_about: "माझ्याबद्दल", nav_contact: "संपर्क",
  cta_work: "चला एकत्र काम करूया →", open: "नवीन प्रोजेक्ट्ससाठी उपलब्ध", view_work: "▶ माझं काम पहा",
  hero_p: "मी raw footage चे असे व्हिडिओ बनवतो जे लोक शेवटपर्यंत पाहतात. Reels, YouTube व्हिडिओ, thumbnails आणि motion graphics — स्वच्छ एडिटिंग आणि वेळेवर डिलिव्हरी.",
  e_portfolio: "माझा पोर्टफोलिओ", h_videos: "निवडक व्हिडिओ", s_videos: "पूर्ण व्हिडिओ पाहण्यासाठी thumbnail वर क्लिक करा.", more_videos: "आणखी व्हिडिओ ↓",
  e_diff: "फरक", s_ba: "एडिट पाहण्यासाठी slider ओढा.", e_what: "मी काय करतो", h_services: "माझ्या सेवा", s_services: "तुमच्या कल्पनांना जिवंत करण्यासाठी प्रोफेशनल एडिटिंग.",
  e_pricing: "किंमत", h_pricing: "सोपी किंमत", s_pricing: "हवी ती सेवा निवडा आणि थेट WhatsApp वर मेसेज करा.", price_note: "ही सुरुवातीची किंमत आहे. अंतिम किंमत लांबी, effects आणि deadline वर ठरते.",
  e_quote: "झटपट कोट", h_est: "किंमत अंदाज", s_est: "किती आयटम हवेत ते टाका. मेसेज करण्यापूर्वी अंदाजे रक्कम कळेल.", est_total: "अंदाजे एकूण", est_send: "हा कोट WhatsApp वर पाठवा →",
  e_how: "कसं चालतं", h_process: "सोपी प्रक्रिया", e_test: "अभिप्राय", h_reviews: "क्लायंट रिव्ह्यू", share: "तुमचा अनुभव सांगा", h_faq: "नेहमीचे प्रश्न",
  e_about: "माझ्याबद्दल", about_p: "मला कल्पनांना व्हिज्युअल स्टोरीत बदलायला आवडतं. Reel, YouTube व्हिडिओ किंवा brand promo — मी क्वालिटी, स्टोरीटेलिंग आणि वेळेवर डिलिव्हरीवर लक्ष देतो.",
  e_create: "चला काहीतरी भारी बनवूया", h_contact: "चला एकत्र काम करूया", s_contact: "मनात प्रोजेक्ट आहे का? चला तो प्रत्यक्षात आणूया."
};
const EN = {};
$$("[data-i18n]").forEach(el => EN[el.dataset.i18n] = el.textContent);
let lang = "en";
$("#langBtn").onclick = () => {
  lang = lang === "en" ? "mr" : "en";
  $$("[data-i18n]").forEach(el => el.textContent = (lang === "mr" ? MR : EN)[el.dataset.i18n] ?? el.textContent);
  $("#langBtn").textContent = lang === "en" ? "मराठी" : "English";
  document.documentElement.lang = lang;
};

/* ---------- misc ui ---------- */
$("#burger").onclick = () => $("#menu").classList.toggle("open");
$$("#menu a").forEach(a => a.onclick = () => $("#menu").classList.remove("open"));
const toTopBtn = $("#toTop");
addEventListener("scroll", () => toTopBtn.classList.toggle("show", scrollY > 600), { passive: true });
toTopBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
$("#yr").textContent = new Date().getFullYear();

const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .1 });
$$("section").forEach(s => { s.classList.add("reveal"); io.observe(s); });
