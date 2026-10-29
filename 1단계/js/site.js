// Google Ads: report clicks on phone / LawTalk / email links.
// Fill in a label ('AW-18543989101/xxxx') once the matching conversion action exists in Google Ads.
(function () {
  var LABELS = { phone: '', lawtalk: '', email: '' };
  function kind(a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) return 'phone';
    if (href.indexOf('mailto:') === 0) return 'email';
    if (href.indexOf('lawtalk.co.kr/directory/profile') !== -1) return 'lawtalk';
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || typeof gtag !== 'function') return;
    var k = kind(a);
    if (!k) return;
    gtag('event', k + '_click', { link_url: a.href });
    if (LABELS[k]) gtag('event', 'conversion', { send_to: LABELS[k] });
  });
})();

// Case detail pages always open at the title, not at a remembered scroll position
(function () {
  if (!document.querySelector('.detail-hero') || location.hash) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // 'instant' so the page's smooth-scroll CSS doesn't animate (and get interrupted)
  function top() { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  top();
  window.addEventListener('load', top);
  window.addEventListener('pageshow', top);
})();

(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Featured cases: 2 military + 2 franchise + 1 each from two of the other groups, picked at random
(function () {
  var grid = document.getElementById('featured');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.case'));
  var btn = document.getElementById('featured-shuffle');

  function pick(group, n) {
    var pool = cards.filter(function (c) { return c.dataset.group === group; });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    return pool.slice(0, n);
  }

  function render() {
    var others = ['sex', 'criminal', 'civil'];
    others.splice(Math.floor(Math.random() * others.length), 1);
    var chosen = pick('military', 2).concat(pick('franchise', 2), pick(others[0], 1), pick(others[1], 1));
    cards.forEach(function (c) { c.hidden = chosen.indexOf(c) === -1; });
    chosen.forEach(function (c) { grid.appendChild(c); });
  }

  btn.hidden = false;
  btn.addEventListener('click', render);
  render();
})();

// FAQ: show a random handful of questions; all of them stay in the HTML for search engines
(function () {
  var list = document.getElementById('faq-list');
  if (!list) return;
  var SHOW = 6;
  var items = Array.prototype.slice.call(list.querySelectorAll('.faq-item'));
  var tabs = document.querySelectorAll('[data-faq-cat]');
  var shuffleBtn = document.getElementById('faq-shuffle');
  var allBtn = document.getElementById('faq-all');
  var allLabel = allBtn.textContent;
  var cat = 'all';
  var expanded = false;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function render(reshuffle) {
    var pool = items.filter(function (el) { return cat === 'all' || el.dataset.cat === cat; });
    if (reshuffle) shuffle(pool).forEach(function (el) { list.appendChild(el); });
    var shown = expanded ? pool.length : Math.min(SHOW, pool.length);
    items.forEach(function (el) { el.hidden = true; el.open = false; });
    pool.forEach(function (el, i) { el.hidden = i >= shown; });
    // keep DOM order matching the shuffled pool
    var visible = items.filter(function (el) { return !el.hidden; });
    shuffleBtn.hidden = expanded || pool.length <= SHOW;
    allBtn.hidden = pool.length <= SHOW;
    allBtn.textContent = expanded ? SHOW + '개만 보기' : allLabel.replace(/\(\d+\)/, '(' + pool.length + ')');
    return visible;
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      cat = t.dataset.faqCat;
      expanded = false;
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
      render(true);
    });
  });
  shuffleBtn.addEventListener('click', function () { render(true); });
  allBtn.addEventListener('click', function () { expanded = !expanded; render(false); });

  render(true);
})();
