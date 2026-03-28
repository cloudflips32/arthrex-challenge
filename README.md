<div align="center">

<img src="assets/600x400_arthrex.png" alt="Arthrex" width="200" />

# Patient congratulations — responsive web experience

**A supportive, tablet-friendly page for patients after surgery — from Arthrex.**

<br/>

</div>

---

## At a glance

| | |
| :--- | :--- |
| **Purpose** | Welcome patients after successful surgery with a short message, branded video, and recovery encouragement. |
| **Audience** | Patients and families in a hospital or recovery setting (e.g. shared tablet). |
| **Stack** | Static HTML, CSS, and JavaScript — no build step required. |

---

## Why this page exists

🏥 **Clinical context**  
After surgery, patients often need rest — not paperwork. This page gives a **single calm screen**: congratulations, a **30-second** stitched video with medical stock footage, **timed on-screen text**, and a **recovery** section with a family-oriented image.

🤝 **Brand & trust**  
Header and footer carry the **Arthrex** identity, **aligned** with page gutters on desktop and **centered** footer branding on small screens.

---

## Features

| Icon | Feature |
| :---: | --- |
| 📱 | **Responsive layout** — readable on phone, tablet, and desktop; shared `--page-gutter` and content max-width. |
| 🍔 | **Hamburger menu** — navigation links (Your message / Video / Recovery) in a **right-aligned** dropdown. |
| 🎬 | **Video playlist** — three **10s** segments (hospital / care imagery) for a **30s** total; **Replay** button; overlay text **only while playing**. |
| 🎨 | **Brand palette** — `#46ACC2`, `#498C8A`, `#4D4730` used across UI and graphics. |
| 🔗 | **Footer social links** — LinkedIn, Facebook, Instagram, YouTube, X (opens in a new tab). |
| ♿ | **Accessibility** — semantic landmarks, `aria-*` on menu and video, `alt` text on images, focus styles. |

---

## How to run locally

1. **Open the site**  
   Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).

2. **Optional: local server** (recommended for video and network assets)  
   From the project folder:

   ```bash
   npx serve .
   ```

   Then visit the URL shown in the terminal (often `http://localhost:3000`).

---

## Project layout

```
arthrex/
├── index.html          # Page structure, header, main, footer
├── styles.css          # Layout, responsive rules, Arthrex colors
├── main.js             # Menu, video playlist, overlay timing, replay
├── README.md           # This file
└── assets/
    ├── arthrex-logo.svg    # Vector logo (footer / reference)
    ├── 600x400_arthrex.png # Header logo
    ├── video-poster.svg    # Video poster art
    └── family-hospital.jpg # Support section photo (see attribution)
```

---

## Media & attribution

- **Video clips** — [Mixkit](https://mixkit.co/) (see comments in `index.html` / `main.js`); replace with your own **MP4** when production-ready.  
- **Support photo** — Pexels (Kampus Production); comment in `index.html` points to the asset page.  
- **Arthrex logos** — Use official brand assets from Arthrex for production; filenames here are placeholders for layout.

---

## Customization tips

- **Swap the video** — Edit `<video>` / `clips` in `main.js` and adjust `TARGET_DURATION_SEC` if your master file is not 30 seconds.  
- **Social URLs** — Update `href` values in the footer in `index.html` to match current Arthrex channels.  
- **Copy** — Hero, overlay segments, and support copy are in `index.html` and `main.js` (`segments` array).

---

<div align="center">

<sub>Educational / demo layout. For clinical or commercial use, follow Arthrex brand guidelines and your compliance team.</sub>

</div>
