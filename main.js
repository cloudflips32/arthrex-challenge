(function () {
  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    var backdrop = document.getElementById("nav-backdrop");

    function setOpen(open) {
      if (!toggle || !nav) return;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      if (backdrop) backdrop.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    }

    function isOpen() {
      return toggle && toggle.getAttribute("aria-expanded") === "true";
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        setOpen(!isOpen());
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    document.querySelectorAll(".site-nav__list a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        if (toggle) toggle.focus();
      }
    });
  }

  function initMessageVideo() {
    var videoEl = document.getElementById("patient-video");
    var overlay = document.getElementById("video-overlay");
    var overlayText = document.getElementById("overlay-text");

    var segments = [
      {
        start: 0,
        text:
          "From all of us at Arthrex: Congratulations on the success of your surgery. You’ve taken a brave step toward healing.",
      },
      {
        start: 7.5,
        text:
          "We wish you a steady, comfortable recovery. Rest, follow your care team’s guidance, and celebrate each small milestone.",
      },
      {
        start: 15,
        text:
          "Arthrex develops innovative implants, fixation, and visualization solutions trusted in critical procedures—supporting surgeons when outcomes matter most.",
      },
      {
        start: 22.5,
        text:
          "Once again, congratulations—and our very best wishes for strength, health, and success in everything ahead.",
      },
    ];

    function currentTimeForOverlay() {
      if (!videoEl) return 0;
      if (videoEl.ended && isFinite(videoEl.duration)) return videoEl.duration;
      return Math.max(0, videoEl.currentTime);
    }

    function textForTime(t) {
      var i;
      for (i = segments.length - 1; i >= 0; i--) {
        if (t >= segments[i].start) return segments[i].text;
      }
      return segments[0].text;
    }

    function refreshOverlayText() {
      if (!overlayText || !videoEl) return;
      overlayText.textContent = textForTime(currentTimeForOverlay());
    }

    function syncOverlayVisibility() {
      if (!overlay || !videoEl) return;
      var visible = !videoEl.paused && !videoEl.ended;
      overlay.classList.toggle("is-hidden", !visible);
      overlay.setAttribute("aria-hidden", visible ? "false" : "true");
    }

    function syncOverlay() {
      syncOverlayVisibility();
      refreshOverlayText();
    }

    if (!videoEl || !overlay || !overlayText) return;

    videoEl.addEventListener("timeupdate", refreshOverlayText);
    videoEl.addEventListener("loadedmetadata", syncOverlay);
    videoEl.addEventListener("play", syncOverlay);
    videoEl.addEventListener("pause", syncOverlayVisibility);
    videoEl.addEventListener("ended", syncOverlay);
    syncOverlay();
  }

  initNav();
  initMessageVideo();
})();
