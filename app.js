/* ======================================================================
   శ్రీ యాజ్ఞవల్క్య – page behaviour
   Open-source pieces used: Fuse.js (Apache-2.0, fuzzy search for the bot),
   browser Web Speech API (voice input + Telugu read-aloud), Web Share API
   (send the invitation PDF straight to WhatsApp).
   ====================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const EVENT = {
    startISO: '2026-11-19T09:00:00+05:30',
    endISO: '2026-11-19T13:00:00+05:30',
    next: 'ది.08-11-2027 సోమవారం',
    pdfUrl: 'శ్రీ యాజ్ఞవల్క్య జయంతుత్సవ సంఘం, పిఠాపురం.pdf',
    pdfName: 'శ్రీ_యాజ్ఞవల్క్య_95వ_జయంతి_ఆహ్వానం_2026.pdf',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Venkateswara+Swamy+Temple+TTD+Kalyana+Mandapam+Pithapuram',
    place: 'శ్రీ వేంకటేశ్వరస్వామివారి దేవాలయం, టి.టి.డి. కళ్యాణ మండపం ప్రక్కన, పిఠాపురం - 533 450'
  };
  const SHARE_TEXT =
    '🙏 శ్రీ యాజ్ఞవల్క్య మహర్షి 95వ జయంతి ఆహ్వానం 🙏\n' +
    '📅 19-11-2026 గురువారం, ఉదయం 9 గంటల నుండి\n' +
    '📍 ' + EVENT.place + '\n' +
    'శ్రీ యాజ్ఞవల్క్య జయంత్యుత్సవ సంఘము, పిఠాపురం';

  /* ---------------- Menu ---------------- */
  function setupMenu() {
    const btn = $('#menuBtn'), panel = $('#menuPanel'), icon = $('#menuIcon');
    const open = (yes) => {
      panel.hidden = !yes;
      btn.setAttribute('aria-expanded', String(yes));
      icon.textContent = yes ? 'close' : 'menu';
      if (yes) { const first = $('a', panel); if (first) first.focus(); }
    };
    btn.addEventListener('click', () => open(panel.hidden));
    $('#menuClose').addEventListener('click', () => { open(false); btn.focus(); });
    $$('a', panel).forEach(a => a.addEventListener('click', () => open(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); } });
    document.addEventListener('click', e => {
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) open(false);
    });
  }

  /* Move keyboard focus to the section after any in-page link (helps screen readers) */
  function setupSectionFocus() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const t = document.querySelector(a.getAttribute('href'));
      if (t) setTimeout(() => t.focus({ preventScroll: true }), 400);
    });
  }

  /* ---------------- Text size · font · theme (two control sets kept in sync) ---------------- */
  function setupComfort() {
    const root = document.documentElement;
    const MAX = 4;
    let level = parseInt(root.getAttribute('data-text') || '1', 10);
    if (isNaN(level)) level = 1;
    const applySize = () => {
      root.setAttribute('data-text', String(level));
      store.set('textSize', String(level));
      $$('.js-font-up').forEach(b => { b.disabled = level >= MAX; });
      $$('.js-font-down').forEach(b => { b.disabled = level <= 0; });
      $$('.js-size-dots').forEach(d => $$('i', d).forEach((i, n) => i.classList.toggle('on', n <= level)));
    };
    $$('.js-font-up').forEach(b => b.addEventListener('click', () => { if (level < MAX) { level++; applySize(); } }));
    $$('.js-font-down').forEach(b => b.addEventListener('click', () => { if (level > 0) { level--; applySize(); } }));
    applySize();

    const applyFont = (fam) => {
      if (fam) {
        root.style.setProperty('--font-body', `'${fam}', 'Noto Sans Telugu', sans-serif`);
        root.style.setProperty('--font-head', `'${fam}', 'Noto Serif Telugu', serif`);
      } else {
        root.style.removeProperty('--font-body');
        root.style.removeProperty('--font-head');
      }
      $$('.js-font-select').forEach(sel => { sel.value = fam || ''; });
    };
    const savedFont = store.get('font') || '';
    applyFont(savedFont);
    $$('.js-font-select').forEach(sel => sel.addEventListener('change', () => {
      store.set('font', sel.value);
      applyFont(sel.value);
    }));

    const meta = document.querySelector('meta[name="theme-color"]');
    const applyTheme = (t) => {
      root.setAttribute('data-theme', t);
      const dark = t === 'dark';
      $$('.js-theme-icon').forEach(i => { i.textContent = dark ? 'light_mode' : 'dark_mode'; });
      $$('.js-theme-text').forEach(i => { i.textContent = dark ? 'పగలు' : 'రాత్రి'; });
      if (meta) meta.setAttribute('content', dark ? '#15111b' : '#4a148c');
    };
    applyTheme(root.getAttribute('data-theme') || 'light');
    $$('.js-theme').forEach(b => b.addEventListener('click', () => {
      const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store.set('theme', t);
      applyTheme(t);
    }));
  }

  /* Highlight the current section in the desktop menu */
  function setupActiveNav() {
    const links = $$('.desk-nav a');
    if (!('IntersectionObserver' in window) || !links.length) return;
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && map.has(e.target.id)) {
          links.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
          const a = map.get(e.target.id); a.classList.add('active'); a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((a, id) => { const t = document.getElementById(id); if (t) io.observe(t); });
  }

  /* ---------------- Back to top ---------------- */
  function setupToTop() {
    const b = $('#toTop');
    const check = () => b.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', check, { passive: true });
    b.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); $('#home').focus({ preventScroll: true }); });
    check();
  }

  /* ---------------- Countdown ---------------- */
  function daysLeft() {
    const now = new Date(), ev = new Date(EVENT.startISO);
    const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const b = Date.UTC(ev.getFullYear(), ev.getMonth(), ev.getDate());
    return Math.round((b - a) / 86400000);
  }
  function countdownText() {
    const d = daysLeft();
    if (d > 1) return `⏳ జయంతికి ఇంకా ${d} రోజులు`;
    if (d === 1) return '⏳ జయంతి రేపే!';
    if (d === 0) return '🎉 జయంతి ఈ రోజే!';
    return `🙏 వచ్చే సంవత్సరం జయంతి: ${EVENT.next}`;
  }
  function setupCountdown() { $('#countdown').textContent = countdownText(); }

  /* ---------------- Calendar reminder (.ics) ---------------- */
  function setupCalendar() {
    $('#calendarBtn').addEventListener('click', () => {
      const fmt = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Yagnavalkya Jayanti//TE', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:yagnavalkya-jayanti-2026@sriyagnavalkyajayanti',
        'DTSTAMP:' + fmt(new Date().toISOString()),
        'DTSTART:' + fmt(EVENT.startISO), 'DTEND:' + fmt(EVENT.endISO),
        'SUMMARY:శ్రీ యాజ్ఞవల్క్య మహర్షి 95వ జయంతి',
        'LOCATION:' + EVENT.place.replace(/,/g, '\\,'),
        'DESCRIPTION:ఉదయం 9 గంటల నుండి సహస్రనామార్చన\\, ప్రసంగం\\, ప్రసాద వినియోగం',
        'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:రేపు శ్రీ యాజ్ఞవల్క్య జయంతి', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: 'యాజ్ఞవల్క్య_జయంతి_2026.ics' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    });
  }

  /* ---------------- Share any PDF (invitation or book) to WhatsApp ---------------- */
  const pdfCache = new Map();
  async function getPdfFile(url, name) {
    if (pdfCache.has(url)) return pdfCache.get(url);
    const res = await fetch(encodeURI(url));
    if (!res.ok) throw new Error('pdf');
    const file = new File([await res.blob()], name, { type: 'application/pdf' });
    pdfCache.set(url, file);
    return file;
  }
  async function sharePdf(statusEl, url, title) {
    url = url || EVENT.pdfUrl;
    const isInvite = url === EVENT.pdfUrl;
    const name = isInvite ? EVENT.pdfName : (title || 'పుస్తకం').replace(/\s+/g, '_') + '.pdf';
    const text = isInvite ? SHARE_TEXT : `📖 ${title}\nశ్రీ యాజ్ఞవల్క్య జయంత్యుత్సవ సంఘము, పిఠాపురం`;
    const say = (t) => { $$('[data-share-status]').forEach(el => { el.textContent = ''; }); if (statusEl) statusEl.textContent = t; };
    const link = new URL(encodeURI(url), location.href).href;
    try {
      if (navigator.canShare && navigator.share) {
        say(`⏳ "${title || 'ఆహ్వాన పత్రిక'}" సిద్ధం చేస్తున్నాం…`);
        const file = await getPdfFile(url, name);
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: title || 'శ్రీ యాజ్ఞవల్క్య జయంతి ఆహ్వానం', text });
          say('✅ పంపే జాబితాలో "వాట్సాప్" ఎంచుకోండి.');
          setTimeout(() => say(''), 6000);
          return;
        }
      }
    } catch (err) {
      if (err && err.name === 'AbortError') { say(''); return; }
    }
    say('');
    window.open('https://wa.me/?text=' + encodeURIComponent(text + '\n\n📄 ' + link), '_blank', 'noopener');
  }
  function setupShare() {
    $$('[data-share-pdf]').forEach(b => b.addEventListener('click', () => {
      const scope = b.closest('section');
      sharePdf(scope ? $('[data-share-status]', scope) : null, b.getAttribute('data-share-pdf') || '', b.getAttribute('data-share-title') || '');
    }));
  }

  /* ---------------- Read aloud (Telugu) ---------------- */
  const speech = {
    ok: 'speechSynthesis' in window,
    speaking: null,
    clean(t) { return t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/\s+/g, ' ').trim(); },
    stop() { if (this.ok) window.speechSynthesis.cancel(); if (this.speaking) { this.speaking.dispatchEvent(new Event('speech-end')); this.speaking = null; } },
    say(text, btn) {
      if (!this.ok) { alert('క్షమించండి, మీ ఫోన్‌లో చదివి వినిపించే సౌకర్యం లేదు.'); return; }
      const wasSame = this.speaking === btn;
      this.stop();
      if (wasSame) return;
      const u = new SpeechSynthesisUtterance(this.clean(text));
      u.lang = 'te-IN'; u.rate = 0.85;
      const te = window.speechSynthesis.getVoices().find(v => /^te/i.test(v.lang));
      if (te) u.voice = te;
      if (btn) {
        this.speaking = btn;
        btn.dataset.label = btn.dataset.label || btn.innerHTML;
        btn.innerHTML = '<span class="material-icons" aria-hidden="true">stop_circle</span> ఆపు';
        const reset = () => { btn.innerHTML = btn.dataset.label; };
        btn.addEventListener('speech-end', reset, { once: true });
        u.onend = u.onerror = () => { if (this.speaking === btn) { this.speaking = null; reset(); } };
      }
      window.speechSynthesis.speak(u);
    }
  };
  function setupSpeak() {
    if (speech.ok) window.speechSynthesis.getVoices();
    $$('[data-speak]').forEach(b => b.addEventListener('click', () => {
      const t = $(b.dataset.speak);
      if (t) speech.say(t.textContent, b);
    }));
  }

  /* ---------------- Gallery ---------------- */
  function setupGallery() {
    const g = $('#dynamic-gallery');
    let html = '';
    for (let i = 1; i <= 14; i++) {
      const f = `Image ${i}.jpg`;
      html += `<figure>
        <img src="${f}" alt="ఉత్సవ చిత్రం ${i}" loading="lazy" />
        <a href="${f}" download="యాజ్ఞవల్క్య_${i}.jpg" class="btn btn-accent"><span class="material-icons" aria-hidden="true">file_download</span> డౌన్‌లోడ్<span class="sr-only"> – చిత్రం ${i}</span></a>
      </figure>`;
    }
    g.innerHTML = html;
  }

  /* ---------------- Deepam ---------------- */
  function setupDeepam() {
    const API_URL = 'https://api.npoint.io/bf85e164f3b5719309ae';
    const countEl = $('#deepamCount'), btn = $('#lightBtn'), bell = $('#templeBell'), stage = $('#deepamStage');
    const bellSound = new Audio('Sounds/Bell.mp3');
    let count = null;
    const show = () => { countEl.textContent = count === null ? 'మొత్తం వెలిగించిన దీపాలు: …' : `మొత్తం వెలిగించిన దీపాలు: ${count}`; };
    const ring = () => {
      bell.classList.remove('bell-ring'); void bell.offsetWidth; bell.classList.add('bell-ring');
      try { bellSound.currentTime = 0; bellSound.play().catch(() => {}); } catch (e) {}
    };
    bell.addEventListener('click', ring);
    fetch(API_URL).then(r => r.json()).then(d => { count = Number(d.deepamCount) || 0; show(); })
      .catch(() => { countEl.textContent = 'దీపాల లెక్క ఇప్పుడు అందుబాటులో లేదు 🙏'; });
    btn.addEventListener('click', () => {
      ring();
      $$('.diya', stage).forEach(d => d.classList.add('real-flame'));
      const pop = document.createElement('span');
      pop.className = 'blessing-pop'; pop.textContent = '🕉️ శుభమస్తు 🕉️';
      stage.appendChild(pop);
      setTimeout(() => { $$('.diya', stage).forEach(d => d.classList.remove('real-flame')); pop.remove(); }, 2200);
      if (count !== null) {
        count++; show();
        fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deepamCount: count }) }).catch(() => {});
      }
      btn.textContent = '🪔 వెలిగించబడింది!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = '🪔 దీపం వెలిగించు'; btn.disabled = false; }, 2200);
    });
  }

  /* ---------------- Bapiraju paintings slideshow (12 months) ---------------- */
  function setupPaintings() {
    const cfg = window.PAINTINGS;
    if (!cfg || !$('#slider')) return;
    const months = cfg.months.map(m => ({ ...m, file: `paintings/month-${String(m.n).padStart(2, '0')}.jpg`, ok: null }));
    const img = $('#slideImg'), soon = $('#slideSoon'), cap = $('#slideCaption'), count = $('#slideCount');
    const grid = $('#monthGrid'), dl = $('#paintDownload'), status = $('#paintStatus');
    $('#paintArtist').textContent = cfg.artist;
    let idx = 0;
    const label = m => `${m.n}వ నెల · ${m.name}` + (m.title ? ` – ${m.title}` : '');

    months.forEach((m, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'month-btn';
      b.innerHTML = `<b>${m.n}</b><span>${m.name}</span>` + (m.title ? `<span class="sr-only"> – ${m.title}</span>` : '');
      b.addEventListener('click', () => show(i));
      grid.appendChild(b);
    });

    // check which months have a picture (first available month is shown first)
    const checks = months.map(m => new Promise(res => {
      const t = new Image();
      t.onload = () => { m.ok = true; res(); };
      t.onerror = () => { m.ok = false; res(); };
      t.src = encodeURI(m.file);
    }));
    Promise.all(checks).then(() => {
      $$('.month-btn', grid).forEach((b, i) => b.classList.toggle('empty', !months[i].ok));
      const first = months.findIndex(m => m.ok);
      show(first >= 0 ? first : 0);
      const n = months.filter(m => m.ok).length;
      $('#paintAll').disabled = n === 0;
      $('#paintAll').lastChild.textContent = ` అన్ని చిత్రాలు ఒకేసారి డౌన్‌లోడ్ (${n})`;
    });

    function show(i) {
      idx = (i + months.length) % months.length;
      const m = months[idx];
      cap.textContent = label(m);
      count.textContent = `${idx + 1} / ${months.length}`;
      $$('.month-btn', grid).forEach((b, k) => b.setAttribute('aria-pressed', String(k === idx)));
      if (m.ok) {
        img.hidden = false; soon.hidden = true;
        img.src = encodeURI(m.file);
        img.alt = `${label(m)} – ${cfg.artist} చిత్రం`;
        dl.href = encodeURI(m.file);
        dl.setAttribute('download', `బాపిరాజు_చిత్రం_${String(m.n).padStart(2, '0')}_${m.name}.jpg`);
        dl.classList.remove('is-disabled'); dl.removeAttribute('aria-disabled');
        $('#paintShare').disabled = false;
      } else {
        img.hidden = true; soon.hidden = false;
        dl.removeAttribute('href'); dl.classList.add('is-disabled'); dl.setAttribute('aria-disabled', 'true');
        $('#paintShare').disabled = true;
      }
      status.textContent = '';
    }
    $('#slidePrev').addEventListener('click', () => show(idx - 1));
    $('#slideNext').addEventListener('click', () => show(idx + 1));
    $('#slider').addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); }
    });
    // swipe on phones
    let x0 = null;
    $('#slideFrame').addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    $('#slideFrame').addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
    img.addEventListener('click', () => { if (months[idx].ok) window.open(encodeURI(months[idx].file), '_blank', 'noopener'); });

    $('#paintShare').addEventListener('click', async () => {
      const m = months[idx]; if (!m.ok) return;
      const text = `🎨 ${label(m)}\nచిత్రకారులు: ${cfg.artist}\nశ్రీ యాజ్ఞవల్క్య జయంత్యుత్సవ సంఘము, పిఠాపురం`;
      try {
        if (navigator.canShare && navigator.share) {
          status.textContent = '⏳ చిత్రం సిద్ధం చేస్తున్నాం…';
          const blob = await (await fetch(encodeURI(m.file))).blob();
          const file = new File([blob], `బాపిరాజు_చిత్రం_${m.n}.jpg`, { type: 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text });
            status.textContent = '✅ పంపే జాబితాలో "వాట్సాప్" ఎంచుకోండి.';
            return;
          }
        }
      } catch (err) { if (err && err.name === 'AbortError') { status.textContent = ''; return; } }
      status.textContent = '';
      window.open('https://wa.me/?text=' + encodeURIComponent(text + '\n\n' + new URL(encodeURI(m.file), location.href).href), '_blank', 'noopener');
    });

    $('#paintAll').addEventListener('click', async () => {
      const list = months.filter(m => m.ok);
      if (!list.length) return;
      const btn = $('#paintAll'); btn.disabled = true;
      try {
        if (typeof window.JSZip === 'function') {
          const zip = new window.JSZip();
          for (let k = 0; k < list.length; k++) {
            status.textContent = `⏳ చిత్రాలు సిద్ధం చేస్తున్నాం… ${k + 1} / ${list.length}`;
            const blob = await (await fetch(encodeURI(list[k].file))).blob();
            zip.file(`${String(list[k].n).padStart(2, '0')}_${list[k].name}.jpg`, blob);
          }
          const out = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(out);
          const a = Object.assign(document.createElement('a'), { href: url, download: 'బాపిరాజు_గారి_చిత్రాలు_12_నెలలు.zip' });
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          status.textContent = `✅ ${list.length} చిత్రాలు ఒకే ఫైల్‌గా డౌన్‌లోడ్ అయ్యాయి. ఫోన్‌లో "డౌన్‌లోడ్స్"లో చూడండి.`;
        } else {
          for (const m of list) {
            const a = Object.assign(document.createElement('a'), { href: encodeURI(m.file), download: `బాపిరాజు_చిత్రం_${m.n}.jpg` });
            document.body.appendChild(a); a.click(); a.remove();
            await new Promise(r => setTimeout(r, 600));
          }
          status.textContent = '✅ చిత్రాలు డౌన్‌లోడ్ అయ్యాయి.';
        }
      } catch (e) {
        status.textContent = 'క్షమించండి, డౌన్‌లోడ్ కాలేదు. ఇంటర్నెట్ చూసి మళ్ళీ ప్రయత్నించండి.';
      }
      btn.disabled = false;
    });
  }

  /* ======================================================================
     24×7 సహాయ మిత్ర — answers from the 2026 invitation only.
     Newest question+answer is shown at the TOP (last in, first out).
     ====================================================================== */
  function goTo(sel) {
    const d = $('#botDialog'); if (d.open) d.close();
    const t = $(sel);
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(() => t.focus({ preventScroll: true }), 500); }
  }

  const INTENTS = [
    { chip: '📅 జయంతి ఎప్పుడు?', keys: ['తేదీ', 'తేది', 'ఎప్పుడు', 'రోజు', 'జయంతి', 'డేట్', 'date', 'when', 'day'],
      reply: () => `శ్రీ యాజ్ఞవల్క్య మహర్షి 95వ జయంతి:\n📅 19-11-2026 గురువారం\n🌙 శ్రీ పరాభవ నామ సంవత్సర కార్తీక శుద్ధ దశమి\n${countdownText()}` },
    { chip: '🕘 సమయం, కార్యక్రమం', keys: ['సమయం', 'టైమ్', 'గంట', 'కార్యక్రమ', 'అర్చన', 'ప్రసాదం', 'భోజనం', 'time', 'program'],
      reply: () => '🕘 ఉదయం 9 గంటల నుండి:\n1. స్వామివారికి సహస్రనామార్చన\n2. తదుపరి ప్రసాద వినియోగం\n3. శ్రీ కూచి శ్రీహరిమన్నారు గారి ప్రసంగం',
      action: ['కార్యక్రమం చూడండి', '#program-details'] },
    { chip: '📍 ఎక్కడ? దారి', keys: ['ఎక్కడ', 'ప్రదేశ', 'స్థలం', 'దేవాలయ', 'గుడి', 'దారి', 'మ్యాప్', 'అడ్రస్', 'where', 'map', 'address', 'location'],
      reply: () => `📍 ${EVENT.place}`, link: ['🗺️ దారి చూపించు (మ్యాప్)', EVENT.mapUrl] },
    { chip: '📲 వాట్సాప్‌లో ఆహ్వానం పంపు', keys: ['వాట్సాప్', 'పంపు', 'పంపండి', 'షేర్', 'పత్రిక', 'whatsapp', 'share', 'send'],
      reply: () => 'సరే, ఆహ్వాన పత్రిక పంపడానికి సిద్ధం చేస్తున్నాను. తెరుచుకునే జాబితాలో "వాట్సాప్" ఎంచుకోండి.', run: () => sharePdf(null) },
    { chip: '🎤 ప్రసంగం ఎవరు?', keys: ['ప్రసంగ', 'ఉపన్యాస', 'అంశం', 'శ్రీహరి', 'మన్నారు', 'speech'],
      reply: () => '🎤 కాకినాడ వా॥లు శ్రీ కూచి శ్రీహరిమన్నారు గారు\n"మాయా స్వరూప నిరూపణము - మాయను దాటు మార్గము - బ్రహ్మ, కర్మ యోగ నిరూపణ" అను అంశంపై ప్రసంగించెదరు.' },
    { chip: '🎁 కానుకలు', keys: ['కానుక', 'బహుమతి', 'డాలరు', 'కవచం', 'gift'],
      reply: () => '🎁 జయంతికి వచ్చిన ప్రతి కుటుంబానికి శ్రీ సూర్యకవచం మరియు శ్రీ యాజ్ఞవల్క్య మహర్షి వారి తామ్ర డాలరు ఇవ్వబడును.' },
    { chip: '🔜 వచ్చే సంవత్సరం', keys: ['వచ్చే', 'తదుపరి', 'వచ్చేసారి', '2027', 'next'],
      reply: () => `🔜 వచ్చే సంవత్సరం జయంతి: ${EVENT.next} నాడు నిర్వహించబడును.` },
    { chip: '🙏 నా ప్రవర', keys: ['ప్రవర', 'గోత్ర', 'గొత్ర', 'గణ', 'pravara', 'gotra'],
      reply: () => 'మీ పేరు రాసి, గోత్రం ఎంచుకుంటే ప్రవర వెంటనే వస్తుంది.', action: ['ప్రవర విభాగానికి వెళ్ళు', '#PravarGenerator'] },
    { chip: '🧘 మహర్షి ఉపదేశం', keys: ['ఉపదేశ', 'కోశ', 'సాక్షి', 'చైతన్య', 'ముగింపు', 'శ్లోక', 'పద్యం'],
      reply: () => 'మహర్షి మనిషిని ఐదు పొరలుగా (కోశాలుగా) వివరించారు. అన్నింటినీ దాటితే మిగిలేది "సాక్షి చైతన్యం".', action: ['ఉపదేశం చదవండి / వినండి', '#upadesam'] },
    { chip: '📖 మహర్షి చరిత్ర', keys: ['చరిత్ర', 'కథ', 'జననం', 'మహర్షి', 'యాజ్ఞవల్క్య', 'history'],
      reply: () => 'శ్రీ యాజ్ఞవల్క్య మహర్షి శుక్ల యజుర్వేదానికి ప్రవర్తకుడు. సూర్యభగవానుని ఆరాధించి శుక్ల యజుర్వేదం పొందారు.', action: ['పూర్తి చరిత్ర చూడండి', '#about'] },
    { chip: '📚 పుస్తకాలు', keys: ['పుస్తక', 'డౌన్‌లోడ్', 'డౌన్లోడ్', 'శతకము', 'సంధ్యా', 'book', 'download', 'pdf'],
      reply: () => 'ఆహ్వాన పత్రిక, శతకము, సంధ్యావందనం వంటి పుస్తకాలు డౌన్‌లోడ్ చేసుకోవచ్చు.', action: ['పుస్తకాలు చూడండి', '#invitations'] },
    { chip: '🪔 దీపం వెలిగించు', keys: ['దీప', 'దీపం', 'గంట', 'deepam'],
      reply: () => 'మహర్షికి వర్చువల్ దీపం వెలిగించవచ్చు.', action: ['దీపం విభాగానికి వెళ్ళు', '#deepam'] },
    { chip: '📱 యాప్ ఇన్‌స్టాల్', keys: ['యాప్', 'ఇన్‌స్టాల్', 'ఇన్స్టాల్', 'హోమ్', 'app', 'install'],
      reply: () => 'పైన కుడివైపు ఉన్న ఆకుపచ్చ "యాప్" బటన్ నొక్కండి. ఫోన్‌లో యాప్‌లా వస్తుంది.', run: () => { const d = $('#botDialog'); if (d.open) d.close(); $('#installBtn').click(); } },
    { chip: '🔠 అక్షరాలు పెద్దవి', keys: ['అక్షరాలు', 'పెద్ద', 'చిన్న', 'కనిపించ', 'చదవలేక', 'సైజు', 'size', 'font'],
      reply: () => 'సరే, అక్షరాలు పెద్దవి చేశాను. ఇంకా కావాలంటే పైన "అక్షరాల పరిమాణం" దగ్గర + నొక్కండి. అక్షర శైలి కూడా అక్కడే మార్చవచ్చు.',
      run: () => { const b = document.querySelector('.settings-wrap .js-font-up'); if (b && !b.disabled) b.click(); } },
    { chip: '❓ క్విజ్', keys: ['క్విజ్', 'ప్రశ్నలు', 'పరీక్ష', 'సర్టిఫికెట్', 'quiz'],
      reply: () => 'మహర్షి గురించి 5 సులభమైన ప్రశ్నలు. పూర్తి చేస్తే సర్టిఫికెట్ వస్తుంది.', action: ['క్విజ్‌కు వెళ్ళు', '#Quiz'] },
    { chip: '🎨 బాపిరాజు చిత్రాలు', keys: ['చిత్రాలు', 'చిత్రం', 'బాపిరాజు', 'క్యాలెండర్', 'పోస్టర్', 'నెల', 'painting', 'calendar'],
      reply: () => 'శ్రీ చంద్రుపట్ల బాపిరాజు గారి 12 నెలల చిత్రాలు. ఒక్కొక్కటి చూడవచ్చు, డౌన్‌లోడ్ చేయవచ్చు, అన్నీ ఒకేసారి కూడా డౌన్‌లోడ్ చేయవచ్చు.', action: ['చిత్రాలు చూడండి', '#paintings'] },
    { chip: '🕉️ సంధ్యావందనం నేర్చుకోండి', keys: ['సంధ్యావందనం', 'సంధ్య', 'వాజసనేయ', 'నేర్చుకో', 'sandhya'],
      reply: () => 'వాజసనేయీ సంధ్యావందనం తెలుగులో దశల వారీగా, ఆడియోతో నేర్చుకోవచ్చు.', link: ['🕉️ వాజసనేయీ సంధ్యావందనం వెబ్‌సైట్', 'https://vajasaneyasandhya.vercel.app/'] },
    { chip: '🏠 సంఘం చిరునామా', keys: ['చిరునామా', 'సంప్రదించ', 'అధ్యక్ష', 'సంఘం', 'కార్యవర్గ', 'contact'],
      reply: () => '🏠 మానుగర్ర సుబ్రహ్మణ్యేశ్వరరావు గారు (అధ్యక్షులు)\n5-1-66, సీతయ్యగారి తోట, సూర్యచంద్రా రైస్ మిల్లు వెనుక, పిఠాపురం పోస్ట్ (మండలం), కాకినాడ జిల్లా.', action: ['కార్యవర్గం చూడండి', '#Members'] }
  ];

  let fuse = null;
  function buildFuse() {
    if (fuse || typeof window.Fuse !== 'function') return;
    const rows = [];
    INTENTS.forEach((it, i) => it.keys.forEach(k => rows.push({ i, k: k.toLowerCase() })));
    fuse = new window.Fuse(rows, { keys: ['k'], threshold: 0.38, ignoreLocation: true, includeScore: true });
  }
  function findIntent(text) {
    const q = text.toLowerCase().trim();
    let best = -1, bestScore = 0;
    INTENTS.forEach((it, i) => {
      const s = it.keys.reduce((n, k) => n + (q.includes(k.toLowerCase()) ? k.length : 0), 0);
      if (s > bestScore) { bestScore = s; best = i; }
    });
    if (best >= 0) return INTENTS[best];
    buildFuse();
    if (!fuse) return null;
    const tally = {};
    q.split(/[\s,.?!।]+/).filter(w => w.length > 1).forEach(w => {
      fuse.search(w).slice(0, 3).forEach(r => { tally[r.item.i] = (tally[r.item.i] || 0) + (1 - r.score); });
    });
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    return top && top[1] > 0.45 ? INTENTS[Number(top[0])] : null;
  }

  function setupBot() {
    const dlg = $('#botDialog'), log = $('#botLog'), chips = $('#botChips'), form = $('#botForm'), input = $('#botText'), body = $('#botBody');
    let started = false;

    const timeNow = () => new Date().toLocaleTimeString('te-IN', { hour: 'numeric', minute: '2-digit' });

    function addCard(question, intent, fallbackText) {
      // newest answer stays at the top; earlier answers move below the buttons (newest first)
      $$('.qa', log).forEach(c => { c.classList.remove('newest'); $('#botOld').prepend(c); $('#botOldTitle').hidden = false; });
      const card = document.createElement('article');
      card.className = 'qa newest';
      if (question) {
        const q = document.createElement('div'); q.className = 'msg user'; q.textContent = question; card.appendChild(q);
      }
      const a = document.createElement('div'); a.className = 'msg bot';
      const text = intent ? intent.reply() : fallbackText;
      a.textContent = text;
      const acts = document.createElement('div'); acts.className = 'msg-actions';
      const sp = document.createElement('button'); sp.type = 'button';
      sp.innerHTML = '<span class="material-icons" aria-hidden="true">volume_up</span> వినండి';
      sp.addEventListener('click', () => speech.say(text, sp));
      acts.appendChild(sp);
      if (intent && intent.action) {
        const go = document.createElement('button'); go.type = 'button';
        go.innerHTML = '<span class="material-icons" aria-hidden="true">arrow_forward</span> ' + intent.action[0];
        go.addEventListener('click', () => goTo(intent.action[1]));
        acts.appendChild(go);
      }
      if (intent && intent.link) {
        const l = document.createElement('a'); l.href = intent.link[1]; l.target = '_blank'; l.rel = 'noopener';
        l.textContent = intent.link[0]; l.style.display = 'block'; l.style.marginTop = '6px';
        a.appendChild(l);
      }
      a.appendChild(acts);
      card.appendChild(a);
      const t = document.createElement('span'); t.className = 'msg-time'; t.textContent = timeNow(); card.appendChild(t);
      log.prepend(card);                 // LIFO: newest on top
      body.scrollTop = 0;
      if (question) $('#botAskTitle').textContent = 'ఇంకా ఏమి తెలుసుకోవాలి? ఒకటి నొక్కండి 👇';
      if (intent && intent.run) setTimeout(intent.run, 400);
    }

    function ask(text, intentFromChip) {
      const t = (text || '').trim();
      if (!t) return;
      const it = intentFromChip || findIntent(t);
      if (it) { addCard(t, it); return; }
      if (/నమస్|నమస్కారం|హలో|హాయ్|hi|hello|namaste/i.test(t)) {
        addCard(t, null, 'నమస్కారం 🙏 క్రింద ఉన్న బటన్లలో మీకు కావలసినది నొక్కండి.');
        return;
      }
      addCard(t, null, 'క్షమించండి, ఆ ప్రశ్నకు సమాధానం నా దగ్గర లేదు.\nక్రింద ఉన్న బటన్లలో ఒకటి నొక్కండి. ఉదా: "జయంతి ఎప్పుడు?", "ఎక్కడ? దారి".');
    }

    INTENTS.forEach(it => {
      const b = document.createElement('button'); b.type = 'button';
      const m = it.chip.match(/^(\S+)\s+(.*)$/);
      b.innerHTML = '<span class="chip-ico" aria-hidden="true"></span><span class="chip-txt"></span>';
      b.querySelector('.chip-ico').textContent = m ? m[1] : '•';
      b.querySelector('.chip-txt').textContent = m ? m[2] : it.chip;
      b.addEventListener('click', () => ask(it.chip, it));
      chips.appendChild(b);
    });

    form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; });

    // Voice input (Web Speech API) – Telugu
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = $('#botMic');
    if (SR) {
      mic.hidden = false;
      const hint = { set textContent(v) { input.placeholder = v.startsWith('🎤') ? v : 'లేదా ప్రశ్న టైప్ చేయండి…'; }, get textContent() { return input.placeholder; } };
      let rec = null;
      mic.addEventListener('click', () => {
        if (rec) { rec.stop(); return; }
        rec = new SR(); rec.lang = 'te-IN'; rec.interimResults = false; rec.maxAlternatives = 1;
        mic.classList.add('listening'); hint.textContent = '🎤 వింటున్నాను… మాట్లాడండి';
        rec.onresult = ev => { const said = ev.results[0][0].transcript; input.value = said; ask(said); input.value = ''; };
        rec.onerror = () => { hint.textContent = 'వినలేకపోయాను. మళ్ళీ 🎤 నొక్కండి లేదా టైప్ చేయండి.'; };
        rec.onend = () => { mic.classList.remove('listening'); rec = null; if (hint.textContent.startsWith('🎤')) hint.textContent = 'బటన్ నొక్కండి, టైప్ చేయండి, లేదా 🎤 నొక్కి మాట్లాడండి.'; };
        try { rec.start(); } catch (e) { mic.classList.remove('listening'); rec = null; }
      });
    }

    const openBot = () => {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      if (!started) {
        started = true;
        addCard(null, null, `నమస్కారం 🙏 నేను మీ సహాయ మిత్రను.\n95వ జయంతి: 19-11-2026 గురువారం, ఉదయం 9 గంటలకు.\n${countdownText()}`);
      }
      body.scrollTop = 0;
      setTimeout(() => { $('#botClose').focus(); }, 60);
    };
    const closeBot = () => { speech.stop(); if (dlg.open) dlg.close(); };
    let opener = null;
    $$('.js-bot-open').forEach(b => b.addEventListener('click', () => { opener = b; openBot(); }));
    $('#botClose').addEventListener('click', closeBot);
    dlg.addEventListener('close', () => { speech.stop(); if (opener) opener.focus(); });

  }

  /* ---------------- Start ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    setupMenu(); setupSectionFocus(); setupComfort(); setupActiveNav(); setupToTop();
    setupCountdown(); setupCalendar(); setupShare(); setupSpeak();
    setupGallery(); setupPaintings(); setupDeepam(); setupBot();
    const y = $('#currentYear'); if (y) y.textContent = String(new Date().getFullYear());
  });
})();
