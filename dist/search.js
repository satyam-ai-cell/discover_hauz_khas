// Client-side search over the embedded listings index.
(function () {
  var params = new URLSearchParams(location.search);
  var q = (params.get("q") || "").trim().toLowerCase();
  var cat = (params.get("category") || "").trim();
  var data = window.__LISTINGS__ || [];
  var catNames = window.__CATNAMES__ || {};

  // reflect current query into the search box
  var qi = document.getElementById("q");
  if (qi && q) qi.value = params.get("q");
  var cs = document.getElementById("category");
  if (cs && cat) cs.value = cat;

  var res = data.filter(function (l) {
    var mc = !cat || l.category === cat;
    var hay = (l.name + " " + l.area + " " + (l.tags || []).join(" ") + " " + l.short + " " + l.categoryName).toLowerCase();
    var mq = !q || hay.indexOf(q) >= 0;
    return mc && mq;
  });

  var bits = [];
  if (q) bits.push("“" + params.get("q") + "”");
  if (cat) bits.push("in " + (catNames[cat] || cat));
  document.getElementById("search-term").textContent = bits.length ? bits.join(" ") : "all places";
  document.getElementById("search-count").textContent = res.length;

  var wrap = document.getElementById("search-results");
  var empty = document.getElementById("search-empty");
  if (!res.length) { empty.style.display = "block"; return; }
  empty.style.display = "none";
  wrap.innerHTML = res.map(cardHTML).join("");

  function k(n) { return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n; }
  function cardHTML(l) {
    var price = "₹".repeat(l.price);
    return (
      '<article class="card"><a href="/place/' + l.slug + '/"><div class="media ratio-43">' +
      '<img class="cover" loading="lazy" src="' + l.image + '" alt="' + l.name + '">' +
      '<span class="tag-cat">' + l.icon + " " + l.categorySingular + "</span></div></a>" +
      '<div class="card-body"><div class="row-between"><h3 class="card-title"><a href="/place/' + l.slug + '/">' + l.name + "</a></h3>" +
      '<span class="price">' + price + "</span></div>" +
      '<p class="place-area"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/></svg> ' + l.area + "</p>" +
      '<p class="card-desc">' + l.short + "</p>" +
      '<div class="row-between"><span class="rating"><span class="val">★ ' + l.rating.toFixed(1) + "</span> " +
      '<span class="cnt">(' + k(l.reviews) + ")</span></span>" +
      '<a class="view-link" href="/place/' + l.slug + '/">View →</a></div></div></article>'
    );
  }
})();
