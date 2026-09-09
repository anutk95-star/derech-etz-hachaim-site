// מחולל אתר מונע-תוכן — דרך עץ החיים (Node, ללא תלויות). קורא content/*.json ומייצר עמודי HTML.
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const CONTENT = path.join(ROOT, "content");
const load = (n) => JSON.parse(fs.readFileSync(path.join(CONTENT, n + ".json"), "utf8"));

const S = load("site");
const WA = "https://wa.me/" + S.whatsapp;
const NAV = [["index.html","בית"],["approach.html","הגישה"],["__services__","השירותים"],
  ["about.html","עליי"],["testimonials.html","המלצות"],["contact.html","צור קשר"]];
const SERVICES = [["doula.html","ליווי דולה"],["course.html","קורס הכנה ללידה"],["training.html","הכשרת מדריכות"]];

const esc = (t) => String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const lines = (t) => String(t).split("\n").filter(x => x.trim());

const JS = "(function(){var h=document.querySelector('.hamburger'),m=document.querySelector('.menu');if(h&&m){h.addEventListener('click',function(){m.classList.toggle('open');});}})();";

function header(active){
  const items = NAV.map(([f,label])=>{
    if(f==="__services__"){
      const sub = SERVICES.map(([sf,sl])=>`<a href="${sf}">${esc(sl)}</a>`).join("");
      const act = SERVICES.some(s=>s[0]===active) ? " active" : "";
      return `<div class="svc"><button class="${act.trim()}">${esc(label)}</button><div class="svc-list">${sub}</div></div>`;
    }
    const cls = f===active ? " active" : "";
    return `<a class="${cls.trim()}" href="${f}">${esc(label)}</a>`;
  }).join("");
  return `<header class="site"><div class="nav">
  <a class="brand" href="index.html"><img src="assets/logo.png" alt="${esc(S.brand_name)}"/>
    <span class="bwrap"><b>${esc(S.brand_name)}</b><span>${esc(S.brand_sub)}</span></span></a>
  <button class="hamburger" aria-label="תפריט">☰</button>
  <nav class="menu">${items}<a class="cta" href="${WA}" target="_blank" rel="noopener">${esc(S.cta_label)}</a></nav>
</div></header>`;
}
const FOOTER = `<footer><img src="assets/logo.png" alt=""/><div>${esc(S.brand_name)} · ${esc(S.brand_sub)}</div></footer><script>${JS}</script>`;

function pageDoc(title, active, body){
  return `<!DOCTYPE html><html lang="he" dir="rtl"><head>`+
    `<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>`+
    `<title>${esc(title)} · ${esc(S.brand_name)}</title>`+
    `<link rel="stylesheet" href="assets/style.css"/></head>`+
    `<body>${header(active)}<main>${body}</main>${FOOTER}</body></html>`;
}
function contactBand(title, text){
  const t = text ? `<p>${esc(text)}</p>` : "";
  return `<section class="alt"><div class="wrap"><div class="contact-band"><h2>${esc(title)}</h2>${t}`+
    `<div class="btnrow"><a class="btn btn-primary" href="${WA}" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a>`+
    `<a class="btn btn-ghost" href="tel:+${S.whatsapp}">התקשרי</a></div>`+
    `<div class="cmeta">טלפון: ${esc(S.phone)} · אזור שירות: ${esc(S.service_area)}</div></div></div></section>`;
}
const priceBlock = (p) => (p && String(p).trim())
  ? `<section><div class="wrap block" style="text-align:center"><h2>עלות</h2><p>${esc(p)}</p></div></section>` : "";

function buildHome(){
  const c=load("home");
  const cards=[["doula.html",c.card1_title,c.card1_text],["course.html",c.card2_title,c.card2_text],
    ["training.html",c.card3_title,c.card3_text]]
    .map(([u,t,x])=>`<a class="card" href="${u}"><h3>${esc(t)}</h3><p>${esc(x)}</p><span class="more">לפרטים ←</span></a>`).join("");
  const body=`<section class="hero"><div class="wrap">
  <img class="logo" src="assets/logo.png" alt="${esc(S.brand_name)}"/>
  <h1>${esc(c.hero_title)}</h1><p class="lead">${esc(c.hero_text)}</p>
  <div class="btnrow"><a class="btn btn-primary" href="${WA}" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a>
  <a class="btn btn-ghost" href="approach.html">על הגישה</a></div></div></section>
<section class="alt"><div class="wrap"><div class="phead"><span class="eyebrow">${esc(c.services_eyebrow)}</span>
  <h2>${esc(c.services_title)}</h2></div><div class="cards">${cards}</div></div></section>
<section><div class="wrap block" style="text-align:center"><h2 class="bigquote">${esc(c.quote)}</h2></div></section>
${contactBand(c.closing_title, c.closing_text)}`;
  return pageDoc(c.hero_title, "index.html", body);
}
function buildApproach(){
  const c=load("approach");
  const grid=[1,2,3,4].map(i=>`<div class="lcard"><h3>${esc(c["layer"+i+"_title"])}</h3><p>${esc(c["layer"+i+"_text"])}</p></div>`).join("");
  const body=`<section><div class="wrap phead"><span class="eyebrow">${esc(c.eyebrow)}</span>
  <h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p></div></section>
<section class="alt"><div class="wrap"><div class="phead"><h2>${esc(c.layers_title)}</h2></div><div class="grid2">${grid}</div></div></section>
<section><div class="wrap block"><h2>${esc(c.tools_title)}</h2><p>${esc(c.tools_text)}</p></div></section>
<section class="alt"><div class="wrap block" style="text-align:center"><h2 class="bigquote">${esc(c.quote)}</h2><p>${esc(c.good_birth)}</p></div></section>`;
  return pageDoc(c.title, "approach.html", body);
}
function buildService(fname){
  const c=load(fname.replace(".html",""));
  const parts=[`<section><div class="wrap phead"><span class="eyebrow">${esc(c.eyebrow)}</span>
  <h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p></div></section>`];
  if(c.includes!==undefined){
    const li=lines(c.includes).map(x=>`<li>${esc(x)}</li>`).join("");
    parts.push(`<section class="alt"><div class="wrap block"><h2>${esc(c.includes_title)}</h2><ul class="clist">${li}</ul></div></section>`);
    parts.push(`<section><div class="wrap block"><h2>${esc(c.forwhom_title)}</h2><p>${esc(c.forwhom)}</p></div></section>`);
  }
  if(fname==="course.html"){
    const cards=[1,2,3,4].map(i=>`<div class="lcard"><h3>${esc(c["s"+i+"_title"])}</h3><p>${esc(c["s"+i+"_text"])}</p></div>`).join("");
    parts.push(`<section class="alt"><div class="wrap"><div class="phead"><h2>${esc(c.sessions_title)}</h2></div><div class="grid2">${cards}</div></div></section>`);
  }
  if(fname==="training.html"){
    const li=lines(c.modules).map(x=>`<li>${esc(x)}</li>`).join("");
    parts.push(`<section class="alt"><div class="wrap block"><h2>${esc(c.forwhom_title)}</h2><p>${esc(c.forwhom)}</p></div></section>`);
    parts.push(`<section><div class="wrap block"><h2>${esc(c.modules_title)}</h2><ul class="clist cols">${li}</ul></div></section>`);
    parts.push(`<section class="alt"><div class="wrap block"><h2>${esc(c.options_title)}</h2><p>${esc(c.options)}</p></div></section>`);
  }
  parts.push(priceBlock(c.price||""));
  parts.push(contactBand("מתעניינת? בואי נדבר",""));
  return pageDoc(c.title, fname, parts.join(""));
}
function buildAbout(){
  const c=load("about");
  const body=`<section><div class="wrap phead"><span class="eyebrow">${esc(c.eyebrow)}</span><h2>${esc(c.title)}</h2></div></section>
<section class="alt"><div class="wrap about"><img class="portrait" src="${esc(c.photo)}" alt="${esc(c.title)}"/>
  <div class="atext"><p>${esc(c.p1)}</p><p>${esc(c.p2)}</p></div></div></section>
${contactBand("רוצה להכיר עוד?","")}`;
  return pageDoc(c.title, "about.html", body);
}
function buildTestimonials(){
  const c=load("testimonials");
  let quotes="";
  for(const i of [1,2]){
    const tx=(c["t"+i+"_text"]||"").trim();
    if(tx){const nm=(c["t"+i+"_name"]||"").trim();
      quotes+=`<div class="pull">"${esc(tx)}"${nm?("<span>"+esc(nm)+"</span>"):""}</div>`;}
  }
  const inner = quotes || `<p style="text-align:center;color:var(--ink-faint)">${esc(c.note)}</p>`;
  const body=`<section><div class="wrap phead"><span class="eyebrow">${esc(c.eyebrow)}</span>
  <h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p></div></section>
<section class="alt"><div class="wrap block">${inner}</div></section>
${contactBand("רוצה לשמוע עוד?","")}`;
  return pageDoc(c.title, "testimonials.html", body);
}
function buildContact(){
  const c=load("contact");
  const body=`<section><div class="wrap phead"><span class="eyebrow">${esc(c.eyebrow)}</span><h2>${esc(c.title)}</h2></div></section>
${contactBand(c.title, c.text)}`;
  return pageDoc(c.title, "contact.html", body);
}
const builders = {
  "index.html":buildHome, "approach.html":buildApproach,
  "doula.html":()=>buildService("doula.html"), "course.html":()=>buildService("course.html"),
  "training.html":()=>buildService("training.html"),
  "about.html":buildAbout, "testimonials.html":buildTestimonials, "contact.html":buildContact,
};
for(const [f,fn] of Object.entries(builders)){
  fs.writeFileSync(path.join(ROOT,f), fn(), "utf8");
  console.log("built", f);
}
console.log("DONE");
