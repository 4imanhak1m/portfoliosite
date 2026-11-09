/* =====================================================================
   Aiman Hakim portfolio: behaviour. No libraries, no build step.
   All page content lives in index.html; only the two lists below are here.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Editable text ---------- */
  // Phrases cycled by the typed line in the hero ("> now: ...").
  var TYPED_PHRASES = [
    'coordinating 2 concurrent AI product projects',
    'managing client expectations',
    'identifying potential risks',
    'planning sprint capacity for a 12-member team',
    'turning PRDs into JIRA epics and stories',
    'reviewing an AI product against BNM RMiT'
  ];
  // What the Copy buttons in the Contact panel put on the clipboard.
  var COPY_VALUES = {
    email: { value: 'aiman.hakim01@gmail.com', label: 'Email address', target: 'emailAddr' },
    phone: { value: '012-470 2411', label: 'Phone number', target: 'phoneNum' }
  };

  /* ---------- Shared state ---------- */
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var paused = root.classList.contains('motion-paused');
  var pauseListeners = [];

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function onPauseChange(fn) { pauseListeners.push(fn); }

  /* ---------- Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Durations (inclusive month count) ---------- */
  function monthsInclusive(startYm, end) {
    var p = startYm.split('-');
    return (end.getFullYear() - Number(p[0])) * 12 + (end.getMonth() + 1 - Number(p[1])) + 1;
  }
  function formatDuration(months) {
    var m = Math.max(1, months);
    if (m < 12) return m + (m === 1 ? ' mo' : ' mos');
    var y = Math.floor(m / 12), r = m % 12;
    return y + (y === 1 ? ' yr' : ' yrs') + (r ? ' ' + r + (r === 1 ? ' mo' : ' mos') : '');
  }
  $$('.dur').forEach(function (el) {
    var start = el.getAttribute('data-start'), endAttr = el.getAttribute('data-end');
    if (!/^\d{4}-\d{2}$/.test(start || '')) return;
    var end;
    if (endAttr === 'present') end = new Date();
    else if (/^\d{4}-\d{2}$/.test(endAttr || '')) { var e = endAttr.split('-'); end = new Date(Number(e[0]), Number(e[1]) - 1, 1); }
    else return;
    el.textContent = formatDuration(monthsInclusive(start, end));
  });

  /* ---------- Pause control (saved in localStorage) ---------- */
  var motionBtn = $('#motionBtn');
  function setPaused(p, save) {
    paused = p;
    root.classList.toggle('motion-paused', p);
    if (motionBtn) {
      motionBtn.setAttribute('aria-pressed', String(p));
      motionBtn.title = p ? 'Play animations' : 'Pause animations';
    }
    if (save) { try { localStorage.setItem('motionPaused', p ? '1' : '0'); } catch (e) { /* storage blocked: setting lasts for this visit only */ } }
    pauseListeners.forEach(function (fn) { fn(p); });
  }
  if (motionBtn) motionBtn.addEventListener('click', function () { setPaused(!paused, true); });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuBtn'), navList = $('#navList'), navEl = $('#nav');
  function menuOpen() { return menuBtn.getAttribute('aria-expanded') === 'true'; }
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('open', open);
    // the links sit before the burger in the page order, so move focus into the open menu
    if (open) { var first = $('a', navList); if (first) first.focus(); }
  }
  if (menuBtn && navList && navEl) {
    menuBtn.addEventListener('click', function () { setMenu(!menuOpen()); });
    navList.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen()) { setMenu(false); menuBtn.focus(); }
    });
    // close when focus leaves the menu (Tab past the last link, Shift+Tab before the first)
    navEl.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (menuOpen() && to && !navList.contains(to) && to !== menuBtn) setMenu(false);
    });
    // close on a click or tap outside the menu
    document.addEventListener('click', function (e) {
      if (menuOpen() && !navList.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Scroll: progress bar, nav bar, timeline fill ---------- */
  var nav = $('#nav'), progress = $('#progress'), timeline = $('#timeline'), tlFill = $('#tlFill');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var doc = root, max = doc.scrollHeight - doc.clientHeight, y = window.pageYOffset || doc.scrollTop;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (nav) {
      var scrolled = y > 20;
      if (scrolled !== nav.classList.contains('scrolled')) {
        nav.classList.toggle('scrolled', scrolled);
        nav.classList.toggle('tone-charcoal', scrolled);
        nav.classList.toggle('tone-black', !scrolled);
      }
    }
    if (!reduce && timeline && tlFill) {
      var r = timeline.getBoundingClientRect();
      var k = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      tlFill.style.transform = 'scaleY(' + k + ')';
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  });
  onScroll();

  /* ---------- Current section in the nav ---------- */
  if (hasIO && navList) {
    var links = $$('a', navList);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          if (l.getAttribute('href') === '#' + en.target.id) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var sec = document.getElementById(l.getAttribute('href').slice(1));
      if (sec) spy.observe(sec);
    });
    // above the first section (hero), no link is current
    var heroEl = $('#home');
    if (heroEl) new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) links.forEach(function (l) { l.removeAttribute('aria-current'); });
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(heroEl);
  }

  /* ---------- Reveals and counters ---------- */
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-to')), dec = Number(el.getAttribute('data-dec') || 0);
    if (isNaN(to) || reduce) return;
    var t0 = performance.now(), dur = 1600;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur);
      el.textContent = (to * easeOutQuart(k)).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function reveal(el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    if (!reduce) el.style.transitionDelay = (sibs.indexOf(el) % 6) * 80 + 'ms';
    el.classList.add('in');
    $$('.count', el).forEach(runCounter);
    setTimeout(function () { el.style.transitionDelay = ''; el.classList.add('done'); }, 1300);
  }
  var revealEls = $$('.reveal');
  if (hasIO) {
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        rv.unobserve(en.target);
        reveal(en.target);
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { rv.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in', 'done'); });
  }

  /* ---------- Hero typed line ---------- */
  var typedEl = $('#typed');
  if (typedEl && !reduce) {
    var pi = 0, ci = TYPED_PHRASES[0].length, deleting = true, typeTimer = null;
    var tick = function () {
      typeTimer = null;
      if (paused) { typedEl.textContent = TYPED_PHRASES[pi]; return; }
      var s = TYPED_PHRASES[pi];
      typedEl.textContent = s.slice(0, ci);
      if (!deleting && ci === s.length) { deleting = true; typeTimer = setTimeout(tick, 1800); return; }
      if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % TYPED_PHRASES.length; }
      ci += deleting ? -1 : 1;
      typeTimer = setTimeout(tick, deleting ? 25 : 55);
    };
    onPauseChange(function (p) {
      if (p) { clearTimeout(typeTimer); typeTimer = null; typedEl.textContent = TYPED_PHRASES[pi]; ci = TYPED_PHRASES[pi].length; deleting = true; }
      else if (!typeTimer) typeTimer = setTimeout(tick, 1800);
    });
    // the first phrase is already in the HTML: hold it, then start cycling
    if (!paused) typeTimer = setTimeout(tick, 1800);
  }

  /* ---------- Hero network canvas ---------- */
  var canvas = $('#net'), hero = $('#home');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (ctx && hero) {
    var W = 0, H = 0, pts = [], raf = null, heroVisible = true, mouse = { x: -999, y: -999 };
    var LINK = 130, LINK2 = LINK * LINK, CURSOR = 170;
    var sizeCanvas = function () {
      var r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      var oldW = W, oldH = H, i;
      W = r.width; H = r.height;
      canvas.width = Math.round(W * d); canvas.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      if (pts.length && W === oldW) {
        // height-only change (e.g. a phone's address bar showing or hiding): keep the network, just rescale it
        for (i = 0; i < pts.length; i++) pts[i].y *= oldH ? H / oldH : 1;
        return;
      }
      var n = Math.round(Math.min(90, W * H / 15000));
      pts = [];
      for (i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 });
    };
    var draw = function (move) {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d2, md;
      if (move) for (i = 0; i < pts.length; i++) {
        a = pts[i]; a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        a = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          b = pts[j]; dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx.strokeStyle = 'rgba(207,69,0,' + ((1 - Math.sqrt(d2) / LINK) * 0.38).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        md = Math.sqrt((a.x - mouse.x) * (a.x - mouse.x) + (a.y - mouse.y) * (a.y - mouse.y));
        if (md < CURSOR) {
          ctx.strokeStyle = 'rgba(255,119,51,' + ((1 - md / CURSOR) * 0.6).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = md < CURSOR ? '#FF7733' : 'rgba(255,255,255,.6)';
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.7, 0, Math.PI * 2); ctx.fill();
      }
    };
    var loop = function () { draw(true); raf = requestAnimationFrame(loop); };
    var startNet = function () { if (!raf && !reduce && !paused && heroVisible && !document.hidden) raf = requestAnimationFrame(loop); };
    var stopNet = function () { if (raf) cancelAnimationFrame(raf); raf = null; };

    sizeCanvas(); draw(false);   // a static frame straight away (and the only frame under reduced motion)
    var rz;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(function () { sizeCanvas(); draw(false); }, 150);
    });
    if (hasIO) new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) startNet(); else stopNet();
    }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopNet(); else startNet(); });
    onPauseChange(function (p) { if (p) stopNet(); else startNet(); });
    if (finePointer && !reduce) {
      hero.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      });
      hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
    }
    startNet();
  }

  /* ---------- Skills marquee: loop copies ---------- */
  var mqGroup = $('.mq-group');
  if (reduce) {
    if (mqGroup) mqGroup.removeAttribute('tabindex');   // static grid: nothing to pause
  } else {
    var buildMarquees = function () {
      $$('.mq').forEach(function (m) {
        var inner = $('.mq-inner', m), list = inner && $('ul', inner);
        if (!list || m.classList.contains('ready')) return;
        // half the track (n copies) must be at least as wide as the viewport, and never less than 1920px
        var n = Math.max(1, Math.ceil(Math.max(m.clientWidth, 1920) / Math.max(1, list.offsetWidth)));
        for (var i = 1; i < n * 2; i++) {
          var c = list.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          c.removeAttribute('aria-label');
          inner.appendChild(c);
        }
        var base = parseFloat(m.getAttribute('data-base')) || 45;
        m.style.setProperty('--mq-dur', base * n + 's');   // same speed whatever the copy count
        m.classList.add('ready');
      });
    };
    // measure once the web fonts are in, so the copy count uses the final text widths
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildMarquees, buildMarquees);
    else buildMarquees();
  }

  /* ---------- Card tilt, spotlight and magnetic buttons (fine pointer only) ---------- */
  if (finePointer && !reduce) {
    $$('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%');
        c.style.setProperty('--my', y * 100 + '%');
        c.style.transform = 'perspective(800px) rotateX(' + (0.5 - y) * 8 + 'deg) rotateY(' + (x - 0.5) * 8 + 'deg) translateY(-4px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
    $$('.magnet').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.2 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.3 + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Project filters ---------- */
  var filterBtns = $$('.filters button'), cards = $$('#grid .card'), filterStatus = $('#filterStatus');
  filterBtns.forEach(function (btn) {   // counts come from the cards, so they stay right when cards are edited
    var f = btn.getAttribute('data-f'), n = $('.n', btn);
    if (n) n.textContent = String(f === 'all' ? cards.length : cards.filter(function (c) { return c.getAttribute('data-cat') === f; }).length);
  });
  var filterSeq = 0;   // each click gets a token; deferred steps from an older click are skipped
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-f'), shown = 0, seq = ++filterSeq;
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        clearTimeout(c._hideTimer);
        if (show) {
          shown++;
          c.hidden = false;
          c.style.transform = '';
          if (reduce) c.classList.remove('out');
          else requestAnimationFrame(function () { requestAnimationFrame(function () { if (seq === filterSeq) c.classList.remove('out'); }); });
        } else if (reduce) {
          c.classList.add('out'); c.hidden = true;
        } else {
          c.classList.add('out');
          c._hideTimer = setTimeout(function () { if (seq === filterSeq) c.hidden = true; }, 280);
        }
      });
      if (filterStatus) filterStatus.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's');
    });
  });

  /* ---------- Contact: copy buttons ---------- */
  var copyStatus = $('#copyStatus');
  function selectText(el) {
    var range = document.createRange(), sel = window.getSelection();
    range.selectNodeContents(el); sel.removeAllRanges(); sel.addRange(range);
  }
  $$('[data-copy]').forEach(function (btn) {
    var cfg = COPY_VALUES[btn.getAttribute('data-copy')];
    if (!cfg) return;
    var timer;
    function finish(ok) {
      clearTimeout(timer);
      btn.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      btn.classList.toggle('ok', ok);
      if (copyStatus) copyStatus.textContent = ok ? cfg.label + ' copied to clipboard' : cfg.label + ' selected. Press Control C to copy.';
      timer = setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 1800);
    }
    btn.addEventListener('click', function () {
      var fallback = function () { var t = document.getElementById(cfg.target); if (t) selectText(t); finish(false); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cfg.value).then(function () { finish(true); }, fallback);
      } else fallback();
    });
  });

  /* ---------- Contact: typed sample draft (once, when the composer is half visible) ---------- */
  var composer = $('.composer'), draftText = $('#draftText'), draftCur = $('#draftCur');
  if (composer && draftText && draftCur && hasIO && !reduce) {
    var draft = draftText.textContent;
    draftText.textContent = '';
    var di = 0, draftTimer = null, done = false;
    var finishDraft = function () {
      done = true; draftText.textContent = draft;
      setTimeout(function () { draftCur.classList.add('off'); }, 3000);
    };
    var typeDraft = function () {
      if (paused) { finishDraft(); return; }
      draftText.textContent = draft.slice(0, ++di);
      if (di < draft.length) draftTimer = setTimeout(typeDraft, 28); else finishDraft();
    };
    onPauseChange(function (p) { if (p && draftTimer && !done) { clearTimeout(draftTimer); finishDraft(); } });
    var dio = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      dio.disconnect();
      if (paused) { draftText.textContent = draft; return; }
      draftCur.classList.remove('off');
      typeDraft();
    }, { threshold: 0.5 });
    dio.observe(composer);
  }

  /* ---------- Deep links (#projects etc.) and smooth scrolling ---------- */
  // Smooth scrolling for in-page links is switched on only after the first alignment, so the browser's
  // jump to a #section on load stays instant and cannot collide with the correction below.
  var enableSmooth = function () { if (!reduce) root.classList.add('smooth-scroll'); };
  var hashId = location.hash.slice(1);
  try { hashId = decodeURIComponent(hashId); } catch (e) { /* malformed #hash: use it as-is */ }
  var target = hashId ? document.getElementById(hashId) : null;
  if (target && document.fonts && document.fonts.ready) {
    var userMoved = false;
    var markMoved = function () { userMoved = true; };
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { window.addEventListener(t, markMoved, { once: true, passive: true }); });
    // the web fonts reflow the page after the browser's first jump: re-align the section under the nav
    document.fonts.ready.then(function () {
      if (!userMoved) target.scrollIntoView({ block: 'start' });
      enableSmooth();
    }, enableSmooth);
  } else {
    enableSmooth();
  }

  setPaused(paused, false);
})();
