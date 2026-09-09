// מנוע רינדור בצד הלקוח — קורא content/*.json ובונה את העמוד. אין צורך בבנייה בענן.
(function () {
  var esc = function (t) {
    return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var lines = function (t) { return String(t || "").split("\n").filter(function (x) { return x.trim(); }); };

  var NAV = [["index.html", "בית"], ["approach.html", "הגישה"], ["__services__", "השירותים"],
    ["about.html", "עליי"], ["testimonials.html", "המלצות"], ["contact.html", "צור קשר"]];
  var SERVICES = [["doula.html", "ליווי דולה"], ["course.html", "קורס הכנה ללידה"], ["training.html", "הכשרת מדריכות"]];

  var S, WA;

  function header(active) {
    var items = NAV.map(function (n) {
      var f = n[0], label = n[1];
      if (f === "__services__") {
        var sub = SERVICES.map(function (s) { return '<a href="' + s[0] + '">' + esc(s[1]) + "</a>"; }).join("");
        var act = SERVICES.some(function (s) { return s[0] === active; }) ? " active" : "";
        return '<div class="svc"><button class="' + act.trim() + '">' + esc(label) +
          '</button><div class="svc-list">' + sub + "</div></div>";
      }
      var cls = f === active ? " active" : "";
      return '<a class="' + cls.trim() + '" href="' + f + '">' + esc(label) + "</a>";
    }).join("");
    return '<header class="site"><div class="nav">' +
      '<a class="brand" href="index.html"><img src="assets/logo.png" alt="' + esc(S.brand_name) + '"/>' +
      '<span class="bwrap"><b>' + esc(S.brand_name) + "</b><span>" + esc(S.brand_sub) + "</span></span></a>" +
      '<button class="hamburger" aria-label="תפריט">☰</button>' +
      '<nav class="menu">' + items + '<a class="cta" href="' + WA + '" target="_blank" rel="noopener">' +
      esc(S.cta_label) + "</a></nav></div></header>";
  }
  function footer() {
    return '<footer><img src="assets/logo.png" alt=""/><div>' + esc(S.brand_name) + " · " +
      esc(S.brand_sub) + "</div></footer>";
  }
  function contactBand(title, text) {
    var t = text ? "<p>" + esc(text) + "</p>" : "";
    return '<section class="alt"><div class="wrap"><div class="contact-band"><h2>' + esc(title) + "</h2>" + t +
      '<div class="btnrow"><a class="btn btn-primary" href="' + WA + '" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a>' +
      '<a class="btn btn-ghost" href="tel:+' + S.whatsapp + '">התקשרי</a></div>' +
      '<div class="cmeta">טלפון: ' + esc(S.phone) + " · אזור שירות: " + esc(S.service_area) + "</div></div></div></section>";
  }
  function priceBlock(p) {
    return (p && String(p).trim())
      ? '<section><div class="wrap block" style="text-align:center"><h2>עלות</h2><p>' + esc(p) + "</p></div></section>" : "";
  }

  var B = {
    home: function (c) {
      var cards = [["doula.html", c.card1_title, c.card1_text], ["course.html", c.card2_title, c.card2_text],
        ["training.html", c.card3_title, c.card3_text]].map(function (x) {
        return '<a class="card" href="' + x[0] + '"><h3>' + esc(x[1]) + "</h3><p>" + esc(x[2]) +
          '</p><span class="more">לפרטים ←</span></a>';
      }).join("");
      return '<section class="hero"><div class="wrap"><img class="logo" src="assets/logo.png" alt="' + esc(S.brand_name) + '"/>' +
        "<h1>" + esc(c.hero_title) + '</h1><p class="lead">' + esc(c.hero_text) + "</p>" +
        '<div class="btnrow"><a class="btn btn-primary" href="' + WA + '" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a>' +
        '<a class="btn btn-ghost" href="approach.html">על הגישה</a></div></div></section>' +
        '<section class="alt"><div class="wrap"><div class="phead"><span class="eyebrow">' + esc(c.services_eyebrow) +
        "</span><h2>" + esc(c.services_title) + '</h2></div><div class="cards">' + cards + "</div></div></section>" +
        '<section><div class="wrap block" style="text-align:center"><h2 class="bigquote">' + esc(c.quote) + "</h2></div></section>" +
        contactBand(c.closing_title, c.closing_text);
    },
    approach: function (c) {
      var grid = [1, 2, 3, 4].map(function (i) {
        return '<div class="lcard"><h3>' + esc(c["layer" + i + "_title"]) + "</h3><p>" + esc(c["layer" + i + "_text"]) + "</p></div>";
      }).join("");
      return '<section><div class="wrap phead"><span class="eyebrow">' + esc(c.eyebrow) + "</span><h2>" + esc(c.title) +
        "</h2><p>" + esc(c.intro) + "</p></div></section>" +
        '<section class="alt"><div class="wrap"><div class="phead"><h2>' + esc(c.layers_title) + '</h2></div><div class="grid2">' +
        grid + "</div></div></section>" +
        '<section><div class="wrap block"><h2>' + esc(c.tools_title) + "</h2><p>" + esc(c.tools_text) + "</p></div></section>" +
        '<section class="alt"><div class="wrap block" style="text-align:center"><h2 class="bigquote">' + esc(c.quote) +
        "</h2><p>" + esc(c.good_birth) + "</p></div></section>";
    },
    doula: function (c) { return service(c, "doula"); },
    course: function (c) { return service(c, "course"); },
    training: function (c) { return service(c, "training"); },
    about: function (c) {
      return '<section><div class="wrap phead"><span class="eyebrow">' + esc(c.eyebrow) + "</span><h2>" + esc(c.title) + "</h2></div></section>" +
        '<section class="alt"><div class="wrap about"><img class="portrait" src="' + esc(c.photo) + '" alt="' + esc(c.title) + '"/>' +
        '<div class="atext"><p>' + esc(c.p1) + "</p><p>" + esc(c.p2) + "</p></div></div></section>" +
        contactBand("רוצה להכיר עוד?", "");
    },
    testimonials: function (c) {
      var quotes = "";
      [1, 2].forEach(function (i) {
        var tx = (c["t" + i + "_text"] || "").trim();
        if (tx) {
          var nm = (c["t" + i + "_name"] || "").trim();
          quotes += '<div class="pull">"' + esc(tx) + '"' + (nm ? "<span>" + esc(nm) + "</span>" : "") + "</div>";
        }
      });
      var inner = quotes || '<p style="text-align:center;color:var(--ink-faint)">' + esc(c.note) + "</p>";
      return '<section><div class="wrap phead"><span class="eyebrow">' + esc(c.eyebrow) + "</span><h2>" + esc(c.title) +
        "</h2><p>" + esc(c.intro) + "</p></div></section>" +
        '<section class="alt"><div class="wrap block">' + inner + "</div></section>" +
        contactBand("רוצה לשמוע עוד?", "");
    },
    contact: function (c) {
      return '<section><div class="wrap phead"><span class="eyebrow">' + esc(c.eyebrow) + "</span><h2>" + esc(c.title) + "</h2></div></section>" +
        contactBand(c.title, c.text);
    }
  };

  function service(c, kind) {
    var parts = ['<section><div class="wrap phead"><span class="eyebrow">' + esc(c.eyebrow) + "</span><h2>" +
      esc(c.title) + "</h2><p>" + esc(c.intro) + "</p></div></section>"];
    if (c.includes !== undefined) {
      var li = lines(c.includes).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      parts.push('<section class="alt"><div class="wrap block"><h2>' + esc(c.includes_title) + '</h2><ul class="clist">' + li + "</ul></div></section>");
      parts.push('<section><div class="wrap block"><h2>' + esc(c.forwhom_title) + "</h2><p>" + esc(c.forwhom) + "</p></div></section>");
    }
    if (kind === "course") {
      var cards = [1, 2, 3, 4].map(function (i) {
        return '<div class="lcard"><h3>' + esc(c["s" + i + "_title"]) + "</h3><p>" + esc(c["s" + i + "_text"]) + "</p></div>";
      }).join("");
      parts.push('<section class="alt"><div class="wrap"><div class="phead"><h2>' + esc(c.sessions_title) + '</h2></div><div class="grid2">' + cards + "</div></div></section>");
    }
    if (kind === "training") {
      var li2 = lines(c.modules).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      parts.push('<section class="alt"><div class="wrap block"><h2>' + esc(c.forwhom_title) + "</h2><p>" + esc(c.forwhom) + "</p></div></section>");
      parts.push('<section><div class="wrap block"><h2>' + esc(c.modules_title) + '</h2><ul class="clist cols">' + li2 + "</ul></div></section>");
      parts.push('<section class="alt"><div class="wrap block"><h2>' + esc(c.options_title) + "</h2><p>" + esc(c.options) + "</p></div></section>");
    }
    parts.push(priceBlock(c.price || ""));
    parts.push(contactBand("מתעניינת? בואי נדבר", ""));
    return parts.join("");
  }

  var root = document.getElementById("root");
  var pageKey = root.getAttribute("data-page");
  var active = root.getAttribute("data-active");

  Promise.all([
    fetch("content/site.json").then(function (r) { return r.json(); }),
    fetch("content/" + pageKey + ".json").then(function (r) { return r.json(); })
  ]).then(function (res) {
    S = res[0]; WA = "https://wa.me/" + S.whatsapp;
    var c = res[1];
    document.title = (c.title || c.hero_title || S.brand_name) + " · " + S.brand_name;
    root.innerHTML = header(active) + "<main>" + B[pageKey](c) + "</main>" + footer();
    var h = document.querySelector(".hamburger"), m = document.querySelector(".menu");
    if (h && m) h.addEventListener("click", function () { m.classList.toggle("open"); });
  }).catch(function (e) {
    root.innerHTML = '<p style="text-align:center;padding:40px">שגיאה בטעינת התוכן.</p>';
    console.error(e);
  });
})();
