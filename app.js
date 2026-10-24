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
    pdfUrl: 'invitation-2026.pdf',
    pdfName: 'invitation_2026.pdf',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Venkateswara+Swamy+Temple+TTD+Kalyana+Mandapam+Pithapuram',
    place: 'శ్రీ వేంకటేశ్వరస్వామివారి దేవాలయం, టి.టి.డి. కళ్యాణ మండపం ప్రక్కన, పిఠాపురం - 533 450'
  };
  const SITE_URL = 'https://sriyagnavalkyajayanti.netlify.app/';
  // WhatsApp: *text* shows in bold
  // Wording taken from the printed 2026 invitation (page 1 + కార్యక్రమ వివరములు). WhatsApp: *text* = bold
  const SHARE_TEXT =
    '*శ్రీ మైత్రేయీ కాత్యాయనీ సమేత శ్రీ యాజ్ఞవల్క్య ఋషి సార్వభౌమ జయంత్యుత్సవము*\n\n' +
    'ఓం పూర్ణమద: పూర్ణమిద: ! పూర్ణాత్ పూర్ణ ముదచ్యతే\n' +
    'పూర్ణస్య పూర్ణమాదాయ ! పూర్ణ మే వావశిష్యతే\n\n' +
    '*ఆహ్వానం*\n\n' +
    'స్వస్తిశ్రీ చాంద్రమాన శ్రీ పరాభవ నామ సం॥ర కార్తీక శుద్ధ దశమీ *గురువారం అనగా ది. 19-11-2026* తేదీన ' +
    'శ్రీ మానిత్యాది బిరుదాంకితులు పరవాది భయంకరభట్ల వెంకట నరశింహాచార్యులు వారిచే శ్రీ వేంకటేశ్వరస్వామి వారి దేవాలయంలో ' +
    'ప్రతిష్టించబడిన *శ్రీ యాజ్ఞవల్క్య మహర్షి వారి 95వ జయంతి* పీఠికాపురమునందు శ్రీ యాజ్ఞవల్క్య జయంత్యుత్సవ సంఘము వారిచే జరుపబడును.\n\n' +
    '*జయంతి జరుగు ప్రదేశము:* శ్రీ వేంకటేశ్వరస్వామివారి దేవాలయం, టి.టి.డి. కళ్యాణం మండపం ప్రక్కన, పిఠాపురం\n\n' +
    '*కార్యక్రమ వివరములు*\n' +
    '*ది. 19-11-2026 తేది గురువారం ఉదయం 9 గంటల నుండి*\n' +
    'స్వర్గీయ శ్రీమాన్ పెరియాల హనుమంతా చార్యులువారి కుమారులు *శ్రీ రామకృష్ణమాచార్యులు గారిచే* స్వామివారికి సహస్రనామార్చన, తదుపరి ప్రసాద వినియోగం జరుగును.\n\n' +
    'కార్తీక శుద్ధ దశమి గురువారం యాజ్ఞవల్క్య జయంతి సందర్భముగా కాకినాడ వా॥లు *శ్రీ కూచి శ్రీహరిమన్నారు* గారు ' +
    '"మాయా స్వరూప నిరూపణము - మాయను దాటు మార్గము - బ్రహ్మ, కర్మ యోగ నిరూపణ" అను అంశంపై ప్రసంగించెదరు.\n\n' +
    '*దేవాలయానికి దారి (గూగుల్ మ్యాప్):*\n' + EVENT.mapUrl + '\n\n' +
    '*మరిన్ని వివరాలకు:*\n' + SITE_URL + '\n\n' +
    '*సంఘ కార్యవర్గం*\n' +
    'అధ్యక్షులు: *శ్రీ మానుగర్ర సుబ్రహ్మణ్యేశ్వరరావు గారు*\n\n' +
    '– శ్రీ యాజ్ఞవల్క్య జయంత్యుత్సవ సంఘము, పిఠాపురం';

  /* ---------------- Menu ---------------- */
  function addQuizToMenus() {
    const d = document.querySelector('.desk-nav a[href="#about"]');
    if (d && !document.querySelector('.desk-nav a[href="#Quiz"]')) {
      const li = document.createElement('li'); li.innerHTML = '<a href="#Quiz">క్విజ్</a>'; d.parentElement.after(li);
    }
    const m = document.querySelector('.menu-list a[href="#about"]');
    if (m && !document.querySelector('.menu-list a[href="#Quiz"]')) {
      const li = document.createElement('li'); li.innerHTML = '<a href="#Quiz"><span class="material-icons" aria-hidden="true">quiz</span>క్విజ్</a>'; m.parentElement.after(li);
    }
  }

  function setupMenu() {
    addQuizToMenus();
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
  /* ======================================================================
     Single-page navigation: each menu item shows only its own "page".
     No reload, no long scrolling. Browser back button works (uses #hash).
     If JavaScript is off, the whole page simply shows as one long page.
     ====================================================================== */
  const PAGES = [
    { id: 'home',            parts: ['home', 'main', 'Members'], title: 'ఆహ్వానం' },
    { id: 'program-details', parts: ['program-details'],         title: 'కార్యక్రమం' },
    { id: 'upadesam',        parts: ['upadesam'],                title: 'మహర్షి ఉపదేశం' },
    { id: 'about',           parts: ['about'],                   title: 'మహర్షి చరిత్ర' },
    { id: 'Quiz',            parts: ['Quiz'],                    title: 'క్విజ్' },
    { id: 'PravarGenerator', parts: ['PravarGenerator'],         title: 'మీ ప్రవర' },
    { id: 'deepam',          parts: ['deepam'],                  title: 'దీపం' },
    { id: 'invitations',     parts: ['invitations'],             title: 'పుస్తకాలు' },
    { id: 'paintings',       parts: ['paintings'],               title: 'బాపిరాజు గారి చిత్రాలు' },
    { id: 'gallery',         parts: ['gallery'],                 title: 'ఫోటోలు & వీడియో' },
    { id: 'related',         parts: ['related'],                 title: 'మరిన్ని సైట్లు' }
  ];
  const SITE_TITLE = document.title;
  function pageOf(id) { return PAGES.find(p => p.parts.includes(id)) || null; }

  function setupBottomBar() {
    const a = document.querySelector('.bottom-nav a[href="#deepam"]');
    if (a) { a.setAttribute('href', '#paintings'); a.innerHTML = '<span class="material-icons" aria-hidden="true">calendar_month</span>క్యాలెండర్'; }
  }

  /* 🔊 / 🎤 bar shown at the top of EVERY page */
  const VOICE_PAGES = [
    ['home', ['ఆహ్వానం', 'ముఖ్య', 'హోమ్', 'మొదటి']],
    ['program-details', ['కార్యక్రమ', 'ప్రోగ్రాం']],
    ['upadesam', ['ఉపదేశ', 'కోశ', 'సాక్షి']],
    ['about', ['చరిత్ర', 'కథ', 'శ్లోక', 'స్తోత్ర']],
    ['Quiz', ['క్విజ్', 'ప్రశ్నలు', 'పరీక్ష', 'సర్టిఫికెట్']],
    ['PravarGenerator', ['ప్రవర', 'గోత్ర', 'గొత్ర']],
    ['deepam', ['దీప', 'గంట']],
    ['invitations', ['పుస్తక', 'బుక్']],
    ['paintings', ['క్యాలెండర్', 'బాపిరాజు', 'చిత్రాలు', 'పెయింటింగ్', 'నెల']],
    ['gallery', ['ఫోటో', 'వీడియో', 'సుప్రభాత']],
    ['related', ['సైట్', 'సంధ్యావందన', 'వాజసనేయ']]
  ];
  let botAskExternal = null;
  function readablePageText() {
    const skip = 'button, .btn, nav, .material-icons, .sr-only, [aria-hidden="true"], audio, video, select, input, script, style, .month-grid, .slide-hint, .page-back, .share-status, [lang="en"], .voice-bar, .slide-count-badge, #quizApp .options-list, .bot-chips, [hidden]';
    const picked = [];
    $$('main > section:not([hidden])').forEach(sec => {
      sec.querySelectorAll('h2, h3, p, li, .bhava, .date-line, .hero-date').forEach(el => {
        if (el.closest(skip)) return;
        if (picked.some(p => p.contains(el))) return;
        const t = el.textContent.trim(); if (t) picked.push(el);
      });
    });
    return picked.map(el => el.textContent.trim().replace(/\s+/g, ' ')).join('. ');
  }
  function setupVoiceBar() {
    const main = $('#content'); if (!main) return;
    const bar = document.createElement('div');
    bar.className = 'voice-bar'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'వినండి, మాట్లాడండి');
    bar.innerHTML = `<button type="button" class="btn btn-soft vb-listen"><span class="material-icons" aria-hidden="true">volume_up</span> ఈ పేజీ వినండి</button>
      <button type="button" class="btn btn-accent vb-speak" hidden><span class="material-icons" aria-hidden="true">mic</span> మాట్లాడి అడగండి</button>
      <p class="vb-status" aria-live="polite"></p>`;
    main.prepend(bar);
    const listen = $('.vb-listen', bar), speakBtn = $('.vb-speak', bar), status = $('.vb-status', bar);
    listen.addEventListener('click', () => speech.say(readablePageText(), listen));

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;                                        // browser has no voice input → button stays hidden
    speakBtn.hidden = false;
    let rec = null;
    speakBtn.addEventListener('click', () => {
      if (rec) { rec.stop(); return; }
      speech.stop();
      rec = new SR(); rec.lang = 'te-IN'; rec.interimResults = false; rec.maxAlternatives = 3;
      speakBtn.classList.add('listening');
      speakBtn.innerHTML = '<span class="material-icons" aria-hidden="true">hearing</span> వింటున్నాను… మాట్లాడండి';
      status.textContent = 'ఉదా: "పుస్తకాలు", "క్యాలెండర్", "జయంతి ఎప్పుడు?"';
      rec.onresult = ev => {
        const alts = [...ev.results[0]].map(r => r.transcript.trim());
        const said = alts[0];
        status.textContent = `మీరు అన్నది: "${said}"`;
        const hit = VOICE_PAGES.find(([, keys]) => alts.some(a => keys.some(k => a.includes(k))));
        if (hit) { location.hash = '#' + hit[0]; return; }
        if (botAskExternal) botAskExternal(said);
      };
      rec.onerror = (e) => {
        status.textContent = e.error === 'not-allowed'
          ? 'మైక్ అనుమతి ఇవ్వలేదు. బ్రౌజర్ పైన 🔒 నొక్కి "మైక్రోఫోన్" అనుమతించండి.'
          : 'వినలేకపోయాను. మళ్ళీ 🎤 నొక్కి నెమ్మదిగా మాట్లాడండి.';
      };
      rec.onend = () => {
        speakBtn.classList.remove('listening'); rec = null;
        speakBtn.innerHTML = '<span class="material-icons" aria-hidden="true">mic</span> మాట్లాడి అడగండి';
      };
      try { rec.start(); } catch (e) { rec = null; speakBtn.classList.remove('listening'); }
    });
  }

  function setupRouter() {
    const all = PAGES.flatMap(p => p.parts).map(id => document.getElementById(id)).filter(Boolean);
    if (!all.length) return;
    document.documentElement.classList.add('spa');

    // "back to main page" button at the end of every page except the main one
    PAGES.filter(p => p.id !== 'home').forEach(p => {
      const last = document.getElementById(p.parts[p.parts.length - 1]);
      if (!last) return;
      const bar = document.createElement('div');
      bar.className = 'page-back';
      bar.innerHTML = '<a class="btn btn-soft" href="#home"><span class="material-icons" aria-hidden="true">home</span> ముఖ్య పేజీకి వెళ్ళండి</a>';
      last.after(bar);
      p.back = bar;
    });

    let current = null;
    function render(fromClick) {
      const raw = decodeURIComponent((location.hash || '').slice(1));
      const page = pageOf(raw) || PAGES[0];
      const target = document.getElementById(raw) || document.getElementById(page.parts[0]);
      const changed = current !== page.id;
      if (changed) {
        // stop sound/video on the page we are leaving
        $$('audio, video').forEach(m => { try { if (!m.paused) m.pause(); } catch (e) {} });
        speech.stop();
        const vs = $('.voice-bar .vb-status'); if (vs) vs.textContent = '';
        all.forEach(el => { el.hidden = !page.parts.includes(el.id); });
        PAGES.forEach(p => { if (p.back) p.back.hidden = p.id !== page.id; });
        const sw = $('.settings-wrap'); if (sw) sw.hidden = page.id !== 'home';   // settings stay in the menu on other pages
        current = page.id;
        document.title = page.id === 'home' ? SITE_TITLE : `${page.title} · ${SITE_TITLE}`;
        // highlight this page in every menu
        $$('.desk-nav a, .menu-list a, .bottom-nav a').forEach(a => {
          const on = (pageOf(a.getAttribute('href').slice(1)) || {}).id === page.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
        const main = $('#content');
        if (main) { main.classList.remove('page-in'); void main.offsetWidth; main.classList.add('page-in'); }
      }
      // first part of a page → top of screen; inner part (e.g. quiz) → scroll to it
      if (target.id === page.parts[0]) window.scrollTo({ top: 0, behavior: 'auto' });
      else target.scrollIntoView({ behavior: changed ? 'auto' : 'smooth', block: 'start' });
      if (fromClick || changed) setTimeout(() => target.focus({ preventScroll: true }), 30);
    }

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) { e.preventDefault(); return; }                 // ignore bare "#"
      if (!pageOf(id) && !document.getElementById(id)) return;
      e.preventDefault();
      if (location.hash === '#' + id) render(true);              // same page tapped again
      else history.pushState(null, '', '#' + id), render(true);
    });
    window.addEventListener('popstate', () => render(false));   // phone/browser back button
    window.addEventListener('hashchange', () => render(false));
    render(false);
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

  /* ---------------- Back to top ---------------- */
  function setupToTop() {
    const b = $('#toTop');
    const check = () => b.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', check, { passive: true });
    b.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); const first = $('main > section:not([hidden])'); if (first) first.focus({ preventScroll: true }); });
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
      const a = Object.assign(document.createElement('a'), { href: url, download: 'yagnavalkya_jayanti_2026.ics' });
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
    const bookNo = BOOK_FILES.indexOf(url) + 1;
    const name = isInvite ? EVENT.pdfName : `yagnavalkya_book_${bookNo > 0 ? bookNo : 1}.pdf`;   // English file names only
    const text = isInvite ? SHARE_TEXT
      : `*${title}*\n\nశ్రీ యాజ్ఞవల్క్య మహర్షి గురించి చక్కని పుస్తకం, మీకోసం పంపుతున్నాను.\n\n` +
        `మహర్షి *95వ జయంతి – 19-11-2026 గురువారం*, పిఠాపురం.\n\n*మరిన్ని పుస్తకాలు, జయంతి వివరాలకు:*\n${SITE_URL}`;
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
  // Books in page order → English download/share names (yagnavalkya_book_1.pdf …)
  const BOOK_FILES = [];
  function setupBookNames() {
    $$('#invitations .book-item a[download]').forEach(a => {
      const href = decodeURI(a.getAttribute('href') || '');
      if (href.includes('invitation')) { a.setAttribute('download', EVENT.pdfName); return; }
      BOOK_FILES.push(href);
      a.setAttribute('download', `yagnavalkya_book_${BOOK_FILES.length}.pdf`);
    });
    $$('#invitations [data-share-pdf]').forEach(b => {   // keep share keys in the same (decoded) form
      const v = b.getAttribute('data-share-pdf'); if (v) b.setAttribute('data-share-pdf', decodeURI(v));
    });
  }
  function setupShare() {
    setupBookNames();
    $$('[data-share-pdf]').forEach(b => b.addEventListener('click', () => {
      const scope = b.closest('section');
      sharePdf(scope ? $('[data-share-status]', scope) : null, b.getAttribute('data-share-pdf') || '', b.getAttribute('data-share-title') || '');
    }));
  }

  /* ---------------- Read aloud (Telugu) ---------------- */
  /* Read aloud – TELUGU VOICE ONLY. Never falls back to an English voice. */
  const speech = {
    ok: 'speechSynthesis' in window,
    speaking: null,
    queue: [],
    teVoice() {
      const vs = this.ok ? window.speechSynthesis.getVoices() : [];
      return { list: vs, te: vs.find(v => /^te([-_]|$)/i.test(v.lang)) || null };
    },
    clean(t) {
      return t
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\uFE0F]/gu, ' ')  // emoji / arrows
        .replace(/[A-Za-z][A-Za-z0-9.\-_/:]*/g, ' ')        // English words are skipped (Telugu only)
        .replace(/[•·|_*"“”]+/g, ' ')
        .replace(/\s+/g, ' ').trim();
    },
    chunks(text) {                                           // short pieces: phones stop long speech
      const parts = this.clean(text).split(/(?<=[।॥.!?:])\s+/);
      const out = [];
      parts.forEach(p => {
        while (p.length > 220) { let cut = p.lastIndexOf(',', 220); if (cut < 60) cut = p.lastIndexOf(' ', 220); if (cut < 60) cut = 220; out.push(p.slice(0, cut + 1)); p = p.slice(cut + 1).trim(); }
        if (p.replace(/[\s.,।॥!?:;\-–()0-9]/g, '').length) out.push(p);
      });
      return out;
    },
    stop() {
      this.queue = [];
      if (this.ok) window.speechSynthesis.cancel();
      if (this.speaking) { const b = this.speaking; this.speaking = null; b.dispatchEvent(new Event('speech-end')); }
    },
    say(text, btn) {
      if (!this.ok) { toast('క్షమించండి, మీ ఫోన్‌లో చదివి వినిపించే సౌకర్యం లేదు.'); return; }
      const wasSame = btn && this.speaking === btn;
      this.stop();
      if (wasSame) return;
      const { list, te } = this.teVoice();
      if (list.length && !te) { showNoTeluguVoice(); return; }   // phone has voices but no Telugu → do NOT read in English
      this.queue = this.chunks(text);
      if (!this.queue.length) return;
      if (btn) {
        this.speaking = btn;
        btn.dataset.label = btn.dataset.label || btn.innerHTML;
        btn.innerHTML = '<span class="material-icons" aria-hidden="true">stop_circle</span> ఆపు';
        btn.setAttribute('aria-pressed', 'true');
        btn.addEventListener('speech-end', () => { btn.innerHTML = btn.dataset.label; btn.setAttribute('aria-pressed', 'false'); }, { once: true });
      }
      const next = () => {
        if (!this.queue.length) { if (this.speaking === btn) this.stop(); return; }
        const u = new SpeechSynthesisUtterance(this.queue.shift());
        u.lang = 'te-IN'; u.rate = 0.85;
        if (te) { try { u.voice = te; } catch (e) {} }
        u.onend = () => { if (this.speaking === btn || !btn) next(); };
        u.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') { this.stop(); showNoTeluguVoice(); } };
        window.speechSynthesis.speak(u);
      };
      next();
    }
  };

  function toast(msg) {
    let t = document.getElementById('appToast');
    if (!t) { t = document.createElement('div'); t.id = 'appToast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 6000);
  }
  function showNoTeluguVoice() {
    let d = document.getElementById('teVoiceDialog');
    if (!d) {
      d = document.createElement('dialog'); d.id = 'teVoiceDialog'; d.setAttribute('aria-labelledby', 'teVoiceTitle');
      d.innerHTML = `<div class="dlg-head"><span class="material-icons" aria-hidden="true">record_voice_over</span><h2 id="teVoiceTitle">తెలుగు గొంతు కావాలి</h2>
        <button type="button" class="dlg-x" data-close aria-label="మూసివేయండి"><span class="material-icons" aria-hidden="true">close</span></button></div>
        <div class="dlg-body"><p>మీ ఫోన్‌లో తెలుగులో చదివే గొంతు లేదు. ఇంగ్లీష్ గొంతుతో తెలుగు సరిగా రాదు, అందుకే చదవలేదు.</p>
        <p><b>ఒక్కసారి ఇలా చేయండి (ఆండ్రాయిడ్):</b></p>
        <ol><li>ఫోన్ <b>సెట్టింగ్స్</b> తెరవండి.</li><li><b>భాష</b> లేదా <b>సిస్టమ్ → భాషలు & ఇన్‌పుట్</b> నొక్కండి.</li>
        <li><b>టెక్స్ట్-టు-స్పీచ్</b> నొక్కండి → <b>గూగుల్</b> పక్కన ⚙️ నొక్కండి.</li><li><b>వాయిస్ డేటా ఇన్‌స్టాల్ చేయి</b> → <b>తెలుగు</b> డౌన్‌లోడ్ చేయండి.</li></ol>
        <p>తర్వాత ఈ వెబ్‌సైట్ మళ్ళీ తెరవండి.</p>
        <button type="button" class="btn btn-green btn-block" data-close>సరే</button></div>`;
      document.body.appendChild(d);
      $$('[data-close]', d).forEach(b => b.addEventListener('click', () => d.close()));
    }
    if (typeof d.showModal === 'function' && !d.open) d.showModal();
  }

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
        <a href="${f}" download="yagnavalkya_photo_${String(i).padStart(2, '0')}.jpg" class="btn btn-accent"><span class="material-icons" aria-hidden="true">file_download</span> డౌన్‌లోడ్<span class="sr-only"> – చిత్రం ${i}</span></a>
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

    // Layout for easy use: month buttons FIRST, then caption + picture with arrows ON the picture.
    const slider = $('#slider'), frame = $('#slideFrame');
    const pickTitle = grid.previousElementSibling;           // "నెల ఎంచుకోండి" heading
    if (pickTitle) { pickTitle.textContent = '1️⃣ నెల ఎంచుకోండి'; slider.before(pickTitle); }
    slider.before(grid);
    const cap0 = $('#slideCaption'); frame.before(cap0);        // caption above the picture
    const prev = $('#slidePrev'), next = $('#slideNext');
    prev.className = 'slide-arrow prev'; next.className = 'slide-arrow next';
    prev.innerHTML = '<span class="material-icons" aria-hidden="true">chevron_left</span>';
    next.innerHTML = '<span class="material-icons" aria-hidden="true">chevron_right</span>';
    prev.setAttribute('aria-label', 'ముందు నెల'); next.setAttribute('aria-label', 'తరువాతి నెల');
    frame.append(prev, next);
    const cnt0 = $('#slideCount'); cnt0.className = 'slide-count-badge'; frame.append(cnt0);
    const navRow = slider.querySelector('.slide-nav'); if (navRow) navRow.remove();
    const hint = document.createElement('p'); hint.className = 'slide-hint';
    hint.textContent = '👆 చిత్రాన్ని ఎడమ / కుడికి జరపండి లేదా ◀ ▶ నొక్కండి. పెద్దగా చూడాలంటే చిత్రంపై నొక్కండి.';
    frame.after(hint);

    // ▶ Slideshow: shows the next painting every 5 seconds until paused
    const SLIDE_MS = 5000;
    const play = document.createElement('button');
    play.type = 'button'; play.className = 'btn btn-primary slide-play';
    play.setAttribute('aria-pressed', 'false');
    const bar = document.createElement('div'); bar.className = 'slide-progress'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>'; bar.style.setProperty('--slide-ms', SLIDE_MS + 'ms'); bar.hidden = true;
    hint.after(play, bar);
    let timer = null;
    const restartBar = () => { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); };
    const setPlayLabel = (on) => {
      play.innerHTML = on
        ? '<span class="material-icons" aria-hidden="true">pause_circle</span> స్లైడ్ షో ఆపు'
        : '<span class="material-icons" aria-hidden="true">play_circle</span> స్లైడ్ షో (తనంతట అదే చూపిస్తుంది)';
      play.setAttribute('aria-pressed', String(on));
    };
    function stopShow() { if (timer) clearInterval(timer); timer = null; bar.hidden = true; bar.classList.remove('run'); setPlayLabel(false); }
    function startShow() {
      if (!months.some(m => m.ok)) return;
      setPlayLabel(true); bar.hidden = false; restartBar();
      const top = $('#slideCaption').getBoundingClientRect().top + window.scrollY - (($('.site-header') || {}).offsetHeight || 0) - 8;
      window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      timer = setInterval(() => {
        if ($('#paintings').hidden) { stopShow(); return; }   // left the calendar page
        let k = idx;
        do { k = (k + 1) % months.length; } while (!months[k].ok && k !== idx);   // skip months without a picture
        show(k); restartBar();
      }, SLIDE_MS);
    }
    setPlayLabel(false);
    play.addEventListener('click', () => (timer ? stopShow() : startShow()));
    window.addEventListener('hashchange', () => { if (timer && !location.hash.startsWith('#paintings')) stopShow(); });
    window.addEventListener('popstate', () => { if (timer && !location.hash.startsWith('#paintings')) stopShow(); });
    let idx = 0;
    const label = m => `${m.n}వ నెల · ${m.name}` + (m.title ? ` – ${m.title}` : '');

    months.forEach((m, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'month-btn';
      b.innerHTML = `<b>${m.n}</b><span>${m.name}</span>` + (m.title ? `<span class="sr-only"> – ${m.title}</span>` : '');
      b.addEventListener('click', () => {
        show(i);
        const top = $('#slideCaption').getBoundingClientRect().top + window.scrollY - (($('.site-header') || {}).offsetHeight || 0) - 8;
        window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
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
        dl.setAttribute('download', `bapiraju_painting_${String(m.n).padStart(2, '0')}.jpg`);
        dl.classList.remove('is-disabled'); dl.removeAttribute('aria-disabled');
        $('#paintShare').disabled = false;
      } else {
        img.hidden = true; soon.hidden = false;
        dl.removeAttribute('href'); dl.classList.add('is-disabled'); dl.setAttribute('aria-disabled', 'true');
        $('#paintShare').disabled = true;
      }
      status.textContent = '';
    }
    $('#slidePrev').addEventListener('click', () => { show(idx - 1); if (timer) restartBar(); });
    $('#slideNext').addEventListener('click', () => { show(idx + 1); if (timer) restartBar(); });
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
      const text = `*${label(m)}*\nచిత్రకారులు: *${cfg.artist}*\n\nబాపిరాజు గారి 12 నెలల క్యాలెండర్ చిత్రాలన్నీ ఇక్కడ చూడవచ్చు, డౌన్‌లోడ్ చేసుకోవచ్చు:\n${SITE_URL}#paintings\n\nశ్రీ యాజ్ఞవల్క్య మహర్షి *95వ జయంతి – 19-11-2026 గురువారం*, పిఠాపురం`;
      try {
        if (navigator.canShare && navigator.share) {
          status.textContent = '⏳ చిత్రం సిద్ధం చేస్తున్నాం…';
          const blob = await (await fetch(encodeURI(m.file))).blob();
          const file = new File([blob], `bapiraju_painting_${String(m.n).padStart(2, '0')}.jpg`, { type: 'image/jpeg' });
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
            zip.file(`bapiraju_painting_${String(list[k].n).padStart(2, '0')}.jpg`, blob);
          }
          const out = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(out);
          const a = Object.assign(document.createElement('a'), { href: url, download: 'bapiraju_paintings_12_months.zip' });
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          status.textContent = `✅ ${list.length} చిత్రాలు ఒకే ఫైల్‌గా డౌన్‌లోడ్ అయ్యాయి. ఫోన్‌లో "డౌన్‌లోడ్స్"లో చూడండి.`;
        } else {
          for (const m of list) {
            const a = Object.assign(document.createElement('a'), { href: encodeURI(m.file), download: `bapiraju_painting_${String(m.n).padStart(2, '0')}.jpg` });
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
    if (location.hash === sel) window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash = sel;
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

    botAskExternal = (t) => { opener = null; openBot(); ask(t); };
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
    setupMenu(); setupComfort(); setupToTop(); setupBottomBar(); setupVoiceBar(); setupRouter();
    setupCountdown(); setupCalendar(); setupShare(); setupSpeak();
    setupGallery(); setupPaintings(); setupDeepam(); setupBot();
    const y = $('#currentYear'); if (y) y.textContent = String(new Date().getFullYear());
  });
})();