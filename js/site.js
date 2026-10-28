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
