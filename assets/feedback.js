/* Feedback widget — floating button on every page.
 * Reports go to the Apps Script endpoint (DC_CONFIG.feedbackEndpoint), which
 * creates a GitHub issue in floatwell-hq/dani-pt-workflow for James.
 * Until the endpoint is set, falls back to a pre-filled email. */
(function () {
  var css = [
    '.fb-btn{position:fixed;bottom:14px;right:14px;z-index:70;background:#211F1C;color:#DCD9AC;border:1.5px solid #DCD9AC;',
    'border-radius:999px;font:600 13px Inter,sans-serif;padding:11px 16px;cursor:pointer;box-shadow:0 6px 20px rgba(33,31,28,.25)}',
    '.fb-btn:hover{background:#2C2A26}',
    '.fb-panel{position:fixed;bottom:66px;right:14px;z-index:71;width:min(330px,92vw);background:#fff;border:1px solid #E5E2D6;',
    'border-radius:14px;box-shadow:0 18px 50px rgba(33,31,28,.3);padding:18px;display:none;font-family:Inter,sans-serif}',
    '.fb-panel.open{display:block}',
    '.fb-panel h3{font:600 13px Oswald,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#16443C;margin:0 0 4px}',
    '.fb-panel p{font-size:12px;color:#6A675E;margin:0 0 10px}',
    '.fb-panel textarea{width:100%;height:90px;border:1px solid #E5E2D6;border-radius:8px;padding:9px;font:400 13.5px Inter,sans-serif;resize:vertical;box-sizing:border-box}',
    '.fb-panel input{width:100%;border:1px solid #E5E2D6;border-radius:8px;padding:8px 9px;font:400 13px Inter,sans-serif;margin-top:8px;box-sizing:border-box}',
    '.fb-panel textarea:focus,.fb-panel input:focus{outline:none;border-color:#16443C}',
    '.fb-send{margin-top:10px;width:100%;background:#16443C;color:#fff;border:0;border-radius:8px;font:600 14px Inter,sans-serif;padding:11px;cursor:pointer}',
    '.fb-send:hover{background:#0F332D}.fb-send:disabled{background:#6A675E;cursor:default}',
    '.fb-done{font:500 13.5px Inter,sans-serif;color:#16443C;text-align:center;padding:14px 0}'
  ].join('');
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'fb-btn'; btn.textContent = '✎ Spotted something?';
  btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'fbPanel');

  var panel = document.createElement('div');
  panel.className = 'fb-panel'; panel.id = 'fbPanel';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Report a change or problem');
  panel.innerHTML =
    '<h3>Spotted something?</h3>' +
    '<p>Wrong wording, wrong price, something broken — tell me and it lands straight on James’s task list.</p>' +
    '<textarea id="fbMsg" placeholder="What needs changing, and on which bit of the page?" aria-label="What needs changing"></textarea>' +
    '<input id="fbName" placeholder="Your name (optional)" aria-label="Your name (optional)">' +
    '<button class="fb-send" id="fbSend">Send it</button>';

  document.body.appendChild(btn); document.body.appendChild(panel);

  btn.addEventListener('click', function () {
    var open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('fbMsg').focus();
  });

  function done(viaEmail) {
    panel.innerHTML = '<div class="fb-done">' + (viaEmail
      ? 'Opening your email app — just press send. Thank you!'
      : 'Sent ✓ It’s on the list. Thank you!') + '</div>';
    setTimeout(function () { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 3200);
  }

  function mailFallback(payload) {
    var body = 'Page: ' + payload.page + '\nFrom: ' + (payload.name || 'not given') + '\n\n' + payload.message;
    window.location.href = 'mailto:jamescopebrown@gmail.com?subject=' +
      encodeURIComponent('[dani-site] Change request') + '&body=' + encodeURIComponent(body);
    done(true);
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'fbSend') {
      var msg = (document.getElementById('fbMsg').value || '').trim();
      if (msg.length < 4) { document.getElementById('fbMsg').focus(); return; }
      var payload = {
        type: 'dc-feedback',
        page: window.location.pathname + window.location.hash,
        message: msg,
        name: (document.getElementById('fbName').value || '').trim(),
        ua: navigator.userAgent.slice(0, 120)
      };
      e.target.disabled = true; e.target.textContent = 'Sending…';
      var endpoint = (window.DC_CONFIG || {}).feedbackEndpoint;
      if (endpoint) {
        fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
          .then(function () { done(false); })
          .catch(function () { mailFallback(payload); });
      } else {
        mailFallback(payload);
      }
    }
  });
})();
