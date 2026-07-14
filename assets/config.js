/* Dani Castelli Coaching — site configuration.
 * One place for every real URL. Anything left as "" shows a
 * "connects at go-live" notice instead of a dead link. */
window.DC_CONFIG = {
  consultBookingUrl: "",   // Google Calendar appointment schedule — free consultation
  checkoutUrl: "",         // Kahunas package checkout (the paywall)
  kahunasLoginUrl: "https://kahunas.io", // client web login / app landing
  appStoreUrl: "https://apps.apple.com/gb/app/kahunas/id1638377758",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.cofox.kahunas.Kahunas",
  instagramUrl: "https://www.instagram.com/danicastelli_coaching/",
  /* Dani's backend — private, bookmark-style links (never shown to clients) */
  pipelineSheetUrl: "",    // the pipeline Google Sheet
  calendarUrl: "https://calendar.google.com",
  firefliesUrl: "https://app.fireflies.ai",
  gmailDraftsUrl: "https://mail.google.com/mail/u/0/#drafts",
  packageName: "1:1 Online Coaching",
  priceMonthly: 149,       // provisional — Dani confirms
  /* Feedback widget: Apps Script web app URL (apps-script/Feedback.gs).
   * While "" the widget falls back to a pre-filled email to James. */
  feedbackEndpoint: ""
};

/* Wire [data-url="key"] elements to config; placeholder if unset. */
document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.DC_CONFIG;
  document.querySelectorAll("[data-url]").forEach(function (a) {
    var key = a.getAttribute("data-url");
    var url = cfg[key];
    if (url) {
      a.setAttribute("href", url);
      a.setAttribute("rel", "noopener");
    } else {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        alert("This connects at go-live (" + key + " not set yet in assets/config.js).");
      });
    }
  });
  document.querySelectorAll(".bind-price").forEach(function (el) { el.textContent = cfg.priceMonthly; });
  document.querySelectorAll(".bind-package").forEach(function (el) { el.textContent = cfg.packageName; });
});
