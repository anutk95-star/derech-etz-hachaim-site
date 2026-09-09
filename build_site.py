# -*- coding: utf-8 -*-
"""מחולל אתר מונע-תוכן — דרך עץ החיים. קורא content/*.json ומייצר עמודי HTML."""
import os, json, html

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, "content")

def load(name):
    with open(os.path.join(CONTENT, name + ".json"), encoding="utf-8") as f:
        return json.load(f)

S = load("site")
WA = "https://wa.me/" + S["whatsapp"]

NAV = [("index.html","בית"),("approach.html","הגישה"),("__services__","השירותים"),
       ("about.html","עליי"),("testimonials.html","המלצות"),("contact.html","צור קשר")]
SERVICES = [("doula.html","ליווי דולה"),("course.html","קורס הכנה ללידה"),("training.html","הכשרת מדריכות")]

def esc(t): return html.escape(str(t))
def lines(t): return [x for x in str(t).split("\n") if x.strip()]

JS = """(function(){var h=document.querySelector('.hamburger'),m=document.querySelector('.menu');
if(h&&m){h.addEventListener('click',function(){m.classList.toggle('open');});}})();"""

def header(active):
    items=[]
    for f,label in NAV:
        if f=="__services__":
            sub="".join(f'<a href="{sf}">{esc(sl)}</a>' for sf,sl in SERVICES)
            act=" active" if active in [s[0] for s in SERVICES] else ""
            items.append(f'<div class="svc"><button class="{act.strip()}">{esc(label)}</button>'
                         f'<div class="svc-list">{sub}</div></div>')
        else:
            cls=" active" if f==active else ""
            items.append(f'<a class="{cls.strip()}" href="{f}">{esc(label)}</a>')
    menu="".join(items)
    return f'''<header class="site"><div class="nav">
  <a class="brand" href="index.html"><img src="assets/logo.png" alt="{esc(S['brand_name'])}"/>
    <span class="bwrap"><b>{esc(S['brand_name'])}</b><span>{esc(S['brand_sub'])}</span></span></a>
  <button class="hamburger" aria-label="תפריט">☰</button>
  <nav class="menu">{menu}<a class="cta" href="{WA}" target="_blank" rel="noopener">{esc(S['cta_label'])}</a></nav>
</div></header>'''

FOOTER = f'''<footer><img src="assets/logo.png" alt=""/>
<div>{esc(S['brand_name'])} · {esc(S['brand_sub'])}</div></footer><script>{JS}</script>'''

def page(fname, title, active, body):
    return (f'<!DOCTYPE html><html lang="he" dir="rtl"><head>'
            f'<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>'
            f'<title>{esc(title)} · {esc(S["brand_name"])}</title>'
            f'<link rel="stylesheet" href="assets/style.css"/></head>'
            f'<body>{header(active)}<main>{body}</main>{FOOTER}</body></html>')

def contact_band(title, text=""):
    t = f'<p>{esc(text)}</p>' if text else ''
    return (f'<section class="alt"><div class="wrap"><div class="contact-band">'
            f'<h2>{esc(title)}</h2>{t}<div class="btnrow">'
            f'<a class="btn btn-primary" href="{WA}" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a>'
            f'<a class="btn btn-ghost" href="tel:+{S["whatsapp"]}">התקשרי</a></div>'
            f'<div class="cmeta">טלפון: {esc(S["phone"])} · אזור שירות: {esc(S["service_area"])}</div>'
            f'</div></div></section>')

def price_block(price):
    if not str(price).strip(): return ''
    return f'<section><div class="wrap block" style="text-align:center"><h2>עלות</h2><p>{esc(price)}</p></div></section>'

# ---------------- pages ----------------
def build_home():
    c=load("home")
    cards=[("doula.html",c["card1_title"],c["card1_text"]),
           ("course.html",c["card2_title"],c["card2_text"]),
           ("training.html",c["card3_title"],c["card3_text"])]
    cards_html="".join(f'<a class="card" href="{u}"><h3>{esc(t)}</h3><p>{esc(x)}</p>'
                       f'<span class="more">לפרטים ←</span></a>' for u,t,x in cards)
    body=f'''<section class="hero"><div class="wrap">
  <img class="logo" src="assets/logo.png" alt="{esc(S['brand_name'])}"/>
  <h1>{esc(c['hero_title'])}</h1><p class="lead">{esc(c['hero_text'])}</p>
  <div class="btnrow"><a class="btn btn-primary" href="{WA}" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a>
  <a class="btn btn-ghost" href="approach.html">על הגישה</a></div></div></section>
<section class="alt"><div class="wrap"><div class="phead"><span class="eyebrow">{esc(c['services_eyebrow'])}</span>
  <h2>{esc(c['services_title'])}</h2></div><div class="cards">{cards_html}</div></div></section>
<section><div class="wrap block" style="text-align:center"><h2 class="bigquote">{esc(c['quote'])}</h2></div></section>
{contact_band(c['closing_title'], c['closing_text'])}'''
    return page("index.html", c['hero_title'], "index.html", body)

def build_approach():
    c=load("approach")
    grid="".join(f'<div class="lcard"><h3>{esc(c[f"layer{i}_title"])}</h3><p>{esc(c[f"layer{i}_text"])}</p></div>'
                 for i in range(1,5))
    body=f'''<section><div class="wrap phead"><span class="eyebrow">{esc(c['eyebrow'])}</span>
  <h2>{esc(c['title'])}</h2><p>{esc(c['intro'])}</p></div></section>
<section class="alt"><div class="wrap"><div class="phead"><h2>{esc(c['layers_title'])}</h2></div>
  <div class="grid2">{grid}</div></div></section>
<section><div class="wrap block"><h2>{esc(c['tools_title'])}</h2><p>{esc(c['tools_text'])}</p></div></section>
<section class="alt"><div class="wrap block" style="text-align:center">
  <h2 class="bigquote">{esc(c['quote'])}</h2><p>{esc(c['good_birth'])}</p></div></section>'''
    return page("approach.html", c['title'], "approach.html", body)

def build_service(fname, active):
    c=load(fname.replace(".html",""))
    parts=[f'''<section><div class="wrap phead"><span class="eyebrow">{esc(c['eyebrow'])}</span>
  <h2>{esc(c['title'])}</h2><p>{esc(c['intro'])}</p></div></section>''']
    # includes / modules / sessions depending on page
    if "includes" in c:
        li="".join(f'<li>{esc(x)}</li>' for x in lines(c["includes"]))
        parts.append(f'<section class="alt"><div class="wrap block"><h2>{esc(c["includes_title"])}</h2>'
                     f'<ul class="clist">{li}</ul></div></section>')
        parts.append(f'<section><div class="wrap block"><h2>{esc(c["forwhom_title"])}</h2><p>{esc(c["forwhom"])}</p></div></section>')
    if fname=="course.html":
        cards="".join(f'<div class="lcard"><h3>{esc(c[f"s{i}_title"])}</h3><p>{esc(c[f"s{i}_text"])}</p></div>' for i in range(1,5))
        parts.append(f'<section class="alt"><div class="wrap"><div class="phead"><h2>{esc(c["sessions_title"])}</h2></div>'
                     f'<div class="grid2">{cards}</div></div></section>')
    if fname=="training.html":
        li="".join(f'<li>{esc(x)}</li>' for x in lines(c["modules"]))
        parts.append(f'<section class="alt"><div class="wrap block"><h2>{esc(c["forwhom_title"])}</h2><p>{esc(c["forwhom"])}</p></div></section>')
        parts.append(f'<section><div class="wrap block"><h2>{esc(c["modules_title"])}</h2><ul class="clist cols">{li}</ul></div></section>')
        parts.append(f'<section class="alt"><div class="wrap block"><h2>{esc(c["options_title"])}</h2><p>{esc(c["options"])}</p></div></section>')
    parts.append(price_block(c.get("price","")))
    parts.append(contact_band("מתעניינת? בואי נדבר"))
    return page(fname, c['title'], active, "".join(parts))

def build_about():
    c=load("about")
    body=f'''<section><div class="wrap phead"><span class="eyebrow">{esc(c['eyebrow'])}</span><h2>{esc(c['title'])}</h2></div></section>
<section class="alt"><div class="wrap about"><img class="portrait" src="{esc(c['photo'])}" alt="{esc(c['title'])}"/>
  <div class="atext"><p>{esc(c['p1'])}</p><p>{esc(c['p2'])}</p></div></div></section>
{contact_band("רוצה להכיר עוד?")}'''
    return page("about.html", c['title'], "about.html", body)

def build_testimonials():
    c=load("testimonials")
    quotes=""
    for i in (1,2):
        tx=c.get(f"t{i}_text","").strip()
        if tx:
            nm=c.get(f"t{i}_name","").strip()
            quotes+=f'<div class="pull">"{esc(tx)}"{("<span>"+esc(nm)+"</span>") if nm else ""}</div>'
    inner = quotes if quotes else f'<p style="text-align:center;color:var(--ink-faint)">{esc(c["note"])}</p>'
    body=f'''<section><div class="wrap phead"><span class="eyebrow">{esc(c['eyebrow'])}</span>
  <h2>{esc(c['title'])}</h2><p>{esc(c['intro'])}</p></div></section>
<section class="alt"><div class="wrap block">{inner}</div></section>
{contact_band("רוצה לשמוע עוד?")}'''
    return page("testimonials.html", c['title'], "testimonials.html", body)

def build_contact():
    c=load("contact")
    body=f'''<section><div class="wrap phead"><span class="eyebrow">{esc(c['eyebrow'])}</span><h2>{esc(c['title'])}</h2></div></section>
{contact_band(c['title'], c['text'])}'''
    return page("contact.html", c['title'], "contact.html", body)

builders = {
  "index.html": build_home, "approach.html": build_approach,
  "doula.html": lambda: build_service("doula.html","doula.html"),
  "course.html": lambda: build_service("course.html","course.html"),
  "training.html": lambda: build_service("training.html","training.html"),
  "about.html": build_about, "testimonials.html": build_testimonials, "contact.html": build_contact,
}

for fname, fn in builders.items():
    with open(os.path.join(ROOT, fname), "w", encoding="utf-8") as fh:
        fh.write(fn())
    print("built", fname)
print("DONE")
