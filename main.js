(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  var backdrop = document.getElementById("nav-backdrop");

  function setOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    if (backdrop) {
      backdrop.hidden = !open;
    }
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
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

  var video = document.getElementById("patient-video");
  var overlay = document.getElementById("video-overlay");
  var overlayText = document.getElementById("overlay-text");
  var timerEl = document.getElementById("video-timer");
  var replayBtn = document.getElementById("video-replay");

  /** Total length: three 10s segments (hospital → nurse → doctor). */
  var TARGET_DURATION_SEC = 30;

  /**
   * Mixkit stock footage (mixkit.co): hospital bed (physician & patient),
   * nurse with patient, physician at bedside — each segment is 10s (30s total).
   * Royalty-free per Mixkit license.
   */
  var clips = [
    {
      src: "https://assets.mixkit.co/videos/35956/35956-720.mp4",
      maxLen: 10,
    },
    {
      src: "https://assets.mixkit.co/videos/5568/5568-720.mp4",
      maxLen: 10,
    },
    {
      src: "https://assets.mixkit.co/videos/6562/6562-720.mp4",
      maxLen: 10,
    },
  ];

  var clipIndex = 0;
  var elapsedBeforeCurrentClip = 0;
  var advancing = false;
  var playlistFinished = false;

  /** Segment start times in seconds (0–30). */
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

  function formatClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function getVirtualTime() {
    if (playlistFinished || clipIndex >= clips.length) {
      return TARGET_DURATION_SEC;
    }
    var cap = clips[clipIndex].maxLen;
    var cur = Math.min(video.currentTime, cap);
    if (video.ended) {
      cur = Math.min(video.duration || cur, cap);
    }
    return Math.min(elapsedBeforeCurrentClip + cur, TARGET_DURATION_SEC);
  }

  function updateTimer() {
    if (!timerEl) return;
    timerEl.textContent =
      formatClock(getVirtualTime()) + " / " + formatClock(TARGET_DURATION_SEC);
  }

  function updateOverlay() {
    if (!overlay || !overlayText) return;
    var t = getVirtualTime();
    var msg = segments[0].text;
    for (var i = segments.length - 1; i >= 0; i--) {
      if (t >= segments[i].start) {
        msg = segments[i].text;
        break;
      }
    }
    overlayText.textContent = msg;
    updateTimer();
  }

  function finishPlaylist() {
    playlistFinished = true;
    video.pause();
    try {
      video.removeAttribute("src");
      video.load();
    } catch (e) {}
    if (replayBtn) {
      replayBtn.focus();
    }
    syncOverlayFromPlayback();
  }

  function restartPlaylist() {
    if (!video || clips.length === 0) return;
    advancing = false;
    clipIndex = 0;
    elapsedBeforeCurrentClip = 0;
    playlistFinished = false;
    video.src = clips[0].src;
    video.load();
    updateOverlay();
    var p = video.play();
    if (p && typeof p.then === "function") {
      p.catch(function () {});
    }
  }

  function advanceFromClip() {
    if (advancing || playlistFinished) return;
    if (clipIndex >= clips.length) return;

    advancing = true;

    var cap = clips[clipIndex].maxLen;
    var dur =
      typeof video.duration === "number" && isFinite(video.duration) ? video.duration : 0;
    var played = Math.min(video.currentTime, cap);
    if (video.ended) {
      played = Math.min(dur || played, cap);
    } else if (played >= cap - 0.12) {
      played = cap;
    }

    elapsedBeforeCurrentClip = Math.min(
      elapsedBeforeCurrentClip + played,
      TARGET_DURATION_SEC
    );
    clipIndex++;

    if (clipIndex >= clips.length || elapsedBeforeCurrentClip >= TARGET_DURATION_SEC) {
      finishPlaylist();
      advancing = false;
      updateOverlay();
      return;
    }

    video.src = clips[clipIndex].src;
    video.load();
    var p = video.play();
    if (p && typeof p.then === "function") {
      p.then(function () {
        advancing = false;
        updateOverlay();
      }).catch(function () {
        advancing = false;
        updateOverlay();
      });
    } else {
      advancing = false;
      updateOverlay();
    }
  }

  function onTimeUpdate() {
    if (playlistFinished || advancing) return;
    if (clipIndex >= clips.length) return;
    var cap = clips[clipIndex].maxLen;
    var dur =
      typeof video.duration === "number" && isFinite(video.duration) ? video.duration : 0;
    if (
      !video.paused &&
      !video.ended &&
      dur >= cap &&
      video.currentTime >= cap - 0.06
    ) {
      video.pause();
      video.currentTime = cap;
      advanceFromClip();
      return;
    }
    updateOverlay();
  }

  function onEnded() {
    if (playlistFinished || advancing) return;
    advanceFromClip();
  }

  function initPlaylist() {
    if (!video || clips.length === 0) return;
    clipIndex = 0;
    elapsedBeforeCurrentClip = 0;
    playlistFinished = false;
    video.src = clips[0].src;
    video.load();
    updateOverlay();
  }

  function syncOverlayFromPlayback() {
    if (!overlay || !video) return;
    var show = !video.paused && !video.ended;
    overlay.classList.toggle("is-hidden", !show);
    overlay.setAttribute("aria-hidden", show ? "false" : "true");
  }

  if (video && overlay) {
    initPlaylist();
    syncOverlayFromPlayback();

    if (replayBtn) {
      replayBtn.addEventListener("click", function () {
        restartPlaylist();
      });
    }

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", function () {
      onEnded();
      syncOverlayFromPlayback();
    });
    video.addEventListener("loadedmetadata", function () {
      updateOverlay();
      syncOverlayFromPlayback();
    });
    video.addEventListener("play", syncOverlayFromPlayback);
    video.addEventListener("pause", syncOverlayFromPlayback);
  }
})();
