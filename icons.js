/*!
 * yuktai icons for Sri Yagnavalkya Jayanti
 * 49 icons from @yuktishaalaa/yuktai 5.3.2 (src/icons/paths.ts), no icon fonts.
 * Usage: <span class="yi" data-icon="home" aria-hidden="true"></span>
 * Icons draw in the text colour (currentColor) and size with font-size (1em).
 * Changing data-icon later (el.setAttribute('data-icon','sun')) redraws the icon.
 * © Sandeep Miriyala, Yuktishaalaa AI Lab · GPL-3.0 · https://github.com/sandeepmiriyala03/yuktai
 */
(function () {
  'use strict';
  var P = {
    "moon":"<path d=\"M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z\"/>",
    "speaker":"<path d=\"M4 9v6h4l5 4V5L8 9H4z\"/><path d=\"M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11\"/>",
    "palette":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"8\" cy=\"10\" r=\"1.3\"/><circle cx=\"12\" cy=\"7.5\" r=\"1.3\"/><circle cx=\"16\" cy=\"10\" r=\"1.3\"/><path d=\"M12 21a3 3 0 0 1 0-6h2\"/>",
    "close":"<path d=\"m18 6-12 12M6 6l12 12\"/>",
    "plus":"<path d=\"M12 5v14M5 12h14\"/>",
    "minus":"<path d=\"M5 12h14\"/>",
    "chat":"<path d=\"M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8z\"/>",
    "mic":"<rect x=\"9\" y=\"2\" width=\"6\" height=\"12\" rx=\"3\"/><path d=\"M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8\"/>",
    "stop":"<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/>",
    "download":"<path d=\"M12 3v12m-5-5 5 5 5-5M4 21h16\"/>",
    "check":"<path d=\"m5 12 4 4L19 6\"/>",
    "left":"<path d=\"m15 18-6-6 6-6\"/>",
    "right":"<path d=\"m9 18 6-6-6-6\"/>",
    "spark":"<path d=\"m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2zM19 14l1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2z\"/>",
    "info":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6m0-9h.01\"/>",
    "undo":"<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10a6 6 0 0 1 0 12h-3\"/>",
    "home":"<path d=\"M3 11 12 4l9 7\"/><path d=\"M5 10v10h5v-6h4v6h5V10\"/>",
    "menu":"<path d=\"M4 6h16M4 12h16M4 18h16\"/>",
    "book":"<path d=\"M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14\"/>",
    "calendar":"<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4M7.5 14h2M14.5 14h2M7.5 17.5h2\"/>",
    "clock":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
    "person":"<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21a8 8 0 0 1 16 0\"/>",
    "users":"<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2 20a7 7 0 0 1 14 0\"/><path d=\"M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5\"/>",
    "globe":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18\"/>",
    "lamp":"<path d=\"M12 3c2 2.6 3 4.3 3 6a3 3 0 0 1-6 0c0-1.7 1-3.4 3-6z\"/><path d=\"M3 14h18c0 3.5-4 6-9 6s-9-2.5-9-6z\"/><path d=\"M12 12v2\"/>",
    "play":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 8.5v7l6-3.5z\"/>",
    "pause":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 9v6M14 9v6\"/>",
    "send":"<path d=\"M21 3 3 10.5l7 3 3 7.5z\"/><path d=\"m10 13.5 4.5-4.5\"/>",
    "share":"<circle cx=\"18\" cy=\"5\" r=\"2.5\"/><circle cx=\"6\" cy=\"12\" r=\"2.5\"/><circle cx=\"18\" cy=\"19\" r=\"2.5\"/><path d=\"m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6\"/>",
    "gift":"<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\"/><path d=\"M5 12v9h14v-9M12 8v13M12 8C10.5 5 7 4 7 6.5S10 8 12 8zm0 0c1.5-3 5-4 5-1.5S14 8 12 8z\"/>",
    "image":"<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><circle cx=\"8.5\" cy=\"9.5\" r=\"1.5\"/><path d=\"m21 15-5-5-10 10\"/>",
    "file":"<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5M9 13h6M9 17h6\"/>",
    "external":"<path d=\"M14 4h6v6M20 4l-9 9\"/><path d=\"M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5\"/>",
    "arrowUp":"<path d=\"M12 19V5m-6 6 6-6 6 6\"/>",
    "arrowLeft":"<path d=\"M19 12H5m6-6-6 6 6 6\"/>",
    "arrowRight":"<path d=\"M5 12h14m-6-6 6 6-6 6\"/>",
    "headphones":"<path d=\"M4 15v-3a8 8 0 0 1 16 0v3\"/><rect x=\"3\" y=\"14\" width=\"4\" height=\"7\" rx=\"1.5\"/><rect x=\"17\" y=\"14\" width=\"4\" height=\"7\" rx=\"1.5\"/>",
    "music":"<path d=\"M9 18V5l11-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"17\" cy=\"16\" r=\"3\"/>",
    "pin":"<path d=\"M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/>",
    "map":"<path d=\"M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z\"/><path d=\"M9 3v15M15 6v15\"/>",
    "pen":"<path d=\"M12 3 6 9l1.5 8h9L18 9z\"/><path d=\"M12 3v7.5\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/><path d=\"M8 21h8\"/>",
    "wallet":"<rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M16 13.5h2M6 7l9-4 2 4\"/>",
    "install":"<rect x=\"6\" y=\"2\" width=\"12\" height=\"20\" rx=\"2\"/><path d=\"M12 6v8m-3-3 3 3 3-3M10 18h4\"/>",
    "help":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01\"/>",
    "temple":"<path d=\"M12 2v2M10 4h4l1 3H9zM8 7h8l1.5 4h-11zM6.5 11h11L19 15H5zM4 15h16v6H4z\"/><path d=\"M10 21v-3a2 2 0 0 1 4 0v3\"/>",
    "meditate":"<circle cx=\"12\" cy=\"4.5\" r=\"2.2\"/><path d=\"M12 8c-2.2 0-3.3 1.3-3.7 3.2L7.5 16M12 8c2.2 0 3.3 1.3 3.7 3.2l.8 4.8\"/><path d=\"M4 18c3 2 5.5 2.4 8 1.2 2.5 1.2 5 .8 8-1.2\"/><path d=\"M7.5 16c1.4 1.4 3 2 4.5 2s3.1-.6 4.5-2\"/>",
    "trophy":"<path d=\"M8 4h8v5a4 4 0 0 1-8 0z\"/><path d=\"M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6\"/>",
    "bulb":"<path d=\"M9 18h6M10 21h4\"/><path d=\"M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z\"/>",
    "sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8\"/>"
  };

  function svg(name, label) {
    var paths = P[name] || P.spark;
    var a11y = label ? 'role="img" aria-label="' + String(label).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }) + '"' : 'aria-hidden="true"';
    return '<svg xmlns="http://www.w3.org/2000/svg" ' + a11y + ' focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  function draw(el) {
    var name = el.getAttribute('data-icon');
    if (el.getAttribute('data-icon-drawn') === name) return;
    el.innerHTML = svg(name, el.getAttribute('data-icon-label'));
    el.setAttribute('data-icon-drawn', name);
  }

  function render(root) {
    root = root || document;
    if (root.nodeType === 1 && root.hasAttribute('data-icon')) draw(root);
    if (root.querySelectorAll) root.querySelectorAll('[data-icon]').forEach(draw);
  }

  window.yuktaiIcons = { svg: svg, render: render, names: Object.keys(P) };

  function start() {
    render(document);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'attributes') draw(m.target);
        else m.addedNodes.forEach(function (n) { if (n.nodeType === 1) render(n); });
      });
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-icon'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
