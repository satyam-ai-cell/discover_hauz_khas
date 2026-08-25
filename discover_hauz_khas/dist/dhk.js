
// Discover Hauz Khas — resident-utility layer.
// Progressive enhancement only: every listing is already in the static HTML.
// Adds: location ask + geofence mode, open-now, near-me distance sort,
// favourites, and category/area/price filtering over server-rendered cards.
(function () {
  var DHK = window.__DHK__ || {};
  var geo = DHK.geofence || { lat: 28.5535, lng: 77.1945, radiusKm: 2.6 };
  function ls(k, v) { try { if (arguments.length > 1) { localStorage.setItem(k, v); return v; } return localStorage.getItem(k); } catch (e) { return null; } }

  function toRad(d) { return (d * Math.PI) / 180; }
  function distKm(la1, lo1, la2, lo2) {
    var R = 6371, dLa = toRad(la2 - la1), dLo = toRad(lo2 - lo1);
    var s = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
  }
  function nowMin() { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
  function openState(card) {
    var raw = card.getAttribute("data-open");
    if (!raw) return null;
    var ranges; try { ranges = JSON.parse(raw); } catch (e) { return null; }
    if (!ranges.length) return null;
    var m = nowMin();
    for (var i = 0; i < ranges.length; i++) {
      var o = ranges[i][0], c = ranges[i][1];
      if (m >= o && m < c) return true;
      if (m + 1440 >= o && m + 1440 < c) return true;
    }
    return false;
  }

  // ---------- favourites ----------
  function favs() { try { return JSON.parse(ls("dhk:favs") || "[]"); } catch (e) { return []; } }
  function toggleFav(slug) {
    var f = favs(), i = f.indexOf(slug);
    if (i >= 0) f.splice(i, 1); else f.push(slug);
    ls("dhk:favs", JSON.stringify(f));
    paintFavs(); updateSavedCount(); applyAll();
  }
  function paintFavs() {
    var f = favs();
    [].forEach.call(document.querySelectorAll(".fav"), function (b) {
      var on = f.indexOf(b.getAttribute("data-slug")) >= 0;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", (on ? "Remove " : "Save ") + (b.getAttribute("data-name") || "place"));
    });
  }
  function updateSavedCount() {
    var n = favs().length;
    [].forEach.call(document.querySelectorAll("[data-saved-count]"), function (el) { el.textContent = n; });
  }

  // ---------- state ----------
  var S = { mode: ls("dhk:mode") || "local", coords: null, openOnly: false, nearOnly: false, savedOnly: false, cat: "", area: "", price: "" };
  try { var c = JSON.parse(ls("dhk:coords") || "null"); if (c && c.lat) S.coords = c; } catch (e) {}

  // ---------- filtering / sorting over server-rendered grids ----------
  function grids() { return [].slice.call(document.querySelectorAll("[data-listing-grid]")); }
  function cards(g) { return [].slice.call(g.querySelectorAll("article.card")); }

  function decorate(card) {
    // open-now + distance chips
    var flags = card.querySelector(".card-flags");
    if (!flags) return;
    var os = openState(card), bits = "";
    if (os === true) bits += '<span class="flag flag-open">\u25CF Open now</span>';
    else if (os === false) bits += '<span class="flag flag-closed">Closed now</span>';
    if (S.coords) {
      var la = parseFloat(card.getAttribute("data-lat")), lo = parseFloat(card.getAttribute("data-lng"));
      if (!isNaN(la) && !isNaN(lo)) {
        var d = distKm(S.coords.lat, S.coords.lng, la, lo);
        var txt = d < 1 ? Math.round(d * 1000) + " m" : d.toFixed(1) + " km";
        bits += '<span class="flag flag-dist">\u2316 ' + txt + " away</span>";
        card.setAttribute("data-dist", d.toFixed(4));
      }
    }
    flags.innerHTML = bits;
  }

  function applyAll() {
    var f = favs();
    [].forEach.call(document.querySelectorAll("article.card"), decorate);
    grids().forEach(function (g) {
      var cs = cards(g), shown = 0;
      cs.forEach(function (card) {
        var ok = true;
        if (S.openOnly && openState(card) !== true) ok = false;
        if (S.savedOnly && f.indexOf(card.getAttribute("data-slug")) < 0) ok = false;
        if (S.cat && card.getAttribute("data-cat") !== S.cat) ok = false;
        if (S.area && card.getAttribute("data-area") !== S.area) ok = false;
        if (S.price && String(card.getAttribute("data-price")) !== S.price) ok = false;
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (S.nearOnly && S.coords) {
        var vis = cs.filter(function (c) { return c.style.display !== "none"; });
        vis.sort(function (a, b) { return (parseFloat(a.getAttribute("data-dist")) || 9999) - (parseFloat(b.getAttribute("data-dist")) || 9999); });
        vis.forEach(function (c) { g.appendChild(c); });
      }
      var cap = parseInt(g.getAttribute("data-cap") || "0", 10);
      if (cap > 0) {
        var vis2 = cs.filter(function (c) { return c.style.display !== "none"; });
        vis2.forEach(function (c, i) { if (i >= cap) c.style.display = "none"; });
        shown = Math.min(shown, cap);
      }
      var cnt = g.parentNode.querySelector("[data-grid-count]");
      if (cnt) cnt.textContent = shown;
      var empty = g.parentNode.querySelector(".near-empty");
      if (empty) empty.style.display = shown ? "none" : "block";
    });
    paintFavs();
  }

  // ---------- mode ----------
  function setMode(m, persist) {
    S.mode = m;
    document.body.setAttribute("data-mode", m);
    if (persist) ls("dhk:mode", m);
    [].forEach.call(document.querySelectorAll("[data-mode-btn]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode-btn") === m ? "true" : "false");
    });
    [].forEach.call(document.querySelectorAll("[data-local][data-explore]"), function (el) {
      var v = el.getAttribute("data-" + m); if (v) el.textContent = v;
    });
  }
  function setLocMsg(html) { var el = document.getElementById("loc-msg"); if (el) el.innerHTML = html; }
  var PIN = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg>';

  function askLocation() {
    if (!navigator.geolocation) { setLocMsg(PIN + " Location isn't available on this device \u2014 use the toggle to explore."); return; }
    setLocMsg(PIN + " Getting your location\u2026");
    navigator.geolocation.getCurrentPosition(function (pos) {
      var la = pos.coords.latitude, lo = pos.coords.longitude;
      S.coords = { lat: la, lng: lo };
      ls("dhk:coords", JSON.stringify(S.coords));
      var d = distKm(la, lo, geo.lat, geo.lng);
      var inside = d <= geo.radiusKm;
      setMode(inside ? "local" : "explore", true);
      if (inside) setLocMsg(PIN + " You're in Hauz Khas \u2014 showing what's <strong>open near you</strong> first.");
      else setLocMsg(PIN + " You're about " + d.toFixed(1) + " km away \u2014 <strong>exploring</strong> mode. Switch to \u201cI\u2019m here\u201d anytime.");
      S.nearOnly = true;
      var nb = document.querySelector('[data-tgl="near"]'); if (nb) nb.setAttribute("aria-pressed", "true");
      applyAll();
    }, function () {
      setLocMsg(PIN + " Couldn't get your location \u2014 you can still browse, or use the toggle.");
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
  }

  // ---------- wire up ----------
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) {
      var fav = e.target.closest ? e.target.closest(".fav") : null;
      if (fav) { e.preventDefault(); toggleFav(fav.getAttribute("data-slug")); }
      return;
    }
    var act = t.getAttribute("data-act");
    if (act === "locate") askLocation();
    else if (act === "mode") { setMode(t.getAttribute("data-mode-btn"), true); applyAll(); }
    else if (act === "tgl") {
      var key = t.getAttribute("data-tgl");
      var map = { open: "openOnly", near: "nearOnly", saved: "savedOnly" };
      if (key === "near" && !S.coords) { askLocation(); }
      S[map[key]] = !S[map[key]];
      t.setAttribute("aria-pressed", S[map[key]] ? "true" : "false");
      applyAll();
    } else if (act === "clear") {
      S.openOnly = S.nearOnly = S.savedOnly = false; S.cat = S.area = S.price = "";
      [].forEach.call(document.querySelectorAll("[data-tgl]"), function (b) { b.setAttribute("aria-pressed", "false"); });
      [].forEach.call(document.querySelectorAll("[data-filter]"), function (s) { s.value = ""; });
      applyAll();
    }
  });
  document.addEventListener("change", function (e) {
    var s = e.target.closest ? e.target.closest("[data-filter]") : null;
    if (!s) return;
    S[s.getAttribute("data-filter")] = s.value;
    applyAll();
  });

  // ---------- live board: open-now count + clock ----------
  function updateLive() {
    var open = 0;
    [].forEach.call(document.querySelectorAll("article.card"), function (c) { if (openState(c) === true) open++; });
    [].forEach.call(document.querySelectorAll("[data-open-count]"), function (e) { e.textContent = open; });
    var n = new Date();
    var hh = ("0" + n.getHours()).slice(-2), mm = ("0" + n.getMinutes()).slice(-2);
    [].forEach.call(document.querySelectorAll("[data-clock]"), function (e) { e.textContent = hh + ":" + mm; });
  }

  // init
  setMode(S.mode, false);
  updateSavedCount();
  applyAll();
  updateLive();
  setInterval(updateLive, 30000);
  // Gentle prompt: if we've never asked and geolocation exists, invite (don't force).
  if (!ls("dhk:coords") && document.getElementById("loc-msg")) {
    setLocMsg(PIN + " In Hauz Khas right now? <button class=\"loc-btn\" data-act=\"locate\" style=\"margin-left:6px\">Use my location</button> to see what\u2019s open near you.");
  } else if (S.coords) {
    // returning visitor with saved coords: recompute status quietly
    var d0 = distKm(S.coords.lat, S.coords.lng, geo.lat, geo.lng);
    if (document.getElementById("loc-msg")) setLocMsg(PIN + (d0 <= geo.radiusKm ? " You're in Hauz Khas \u2014 showing what's <strong>open near you</strong>." : " Exploring Hauz Khas from " + d0.toFixed(1) + " km away."));
    applyAll();
  }
})();
