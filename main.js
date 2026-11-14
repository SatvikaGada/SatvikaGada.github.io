/* =============================================================================
   main.js
   Renders content.js into the page, then wires up the interactions.
   No dependencies. You should not need to edit this file to change content.

   Contents
   1. Helpers and icons
   2. Renderers (one per section)
   3. Behaviour: theme, header/progress/back-to-top, active nav, mobile menu,
      reveal-on-scroll, case-study modal, certificates toggle, accordion,
      copy email, contact form, UTM links, print
   4. Init
   ============================================================================= */
(function () {
  "use strict";

  if (typeof CONTENT === "undefined") {
    console.error("content.js did not load, so there is nothing to render.");
    return;
  }

  /* 1. Helpers and icons ----------------------------------------------------- */
  const C = CONTENT;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isSet = (v) => v !== null && v !== undefined && String(v).trim() !== "";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ESC[ch]);

  // Escape, then wrap [placeholders] so unfinished copy is easy to spot on the page.
  const fmt = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');

  // One line-icon set (24px grid, 1.5 stroke). All decorative: labels live on the parent.
  const ICONS = {
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUpRight: '<path d="M7 17L17 7M8 7h9v9"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>',
    github:
      '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="1"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>',
  };

  const icon = (name, extra = "") =>
    `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

  // Image with intrinsic size set (no layout shift) and lazy loading by default.
  function img(image, { eager = false } = {}) {
    if (!image || !isSet(image.src)) return "";
    const w = Number(image.width) || 1200;
    const h = Number(image.height) || 800;
    return `<img src="${esc(image.src)}" alt="${esc(image.alt)}" width="${w}" height="${h}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
  }

  // Renders a string as <p>, an array as <ul>.
  function textBlock(value) {
    if (Array.isArray(value)) return `<ul>${value.map((v) => `<li>${fmt(v)}</li>`).join("")}</ul>`;
    return isSet(value) ? `<p>${fmt(value)}</p>` : "";
  }

  function stackList(items, label) {
    if (!items || !items.length) return "";
    return `<ul class="stack" aria-label="${esc(label)}">${items.map((s) => `<li>${fmt(s)}</li>`).join("")}</ul>`;
  }

  // Number the sections that appear in the nav (01, 02...) plus About.
  const NUMBERED = ["work", "experience", "skills", "recognition", "about", "contact"];
  const numFor = (id) => {
    const i = NUMBERED.indexOf(id);
    return i < 0 ? "" : String(i + 1).padStart(2, "0");
  };

  function sectionHead(id, data) {
    const num = numFor(id);
    return `
      <header class="section-head grid reveal">
        <p class="eyebrow">${num ? `<span class="num">${num}</span> / ` : ""}${fmt(data.label)}</p>
        <div class="section-head-main">
          <h2 class="section-title" id="${id}-title">${fmt(data.heading)}</h2>
          ${isSet(data.intro) ? `<p class="section-intro">${fmt(data.intro)}</p>` : ""}
        </div>
      </header>`;
  }

  const mailto = () => `mailto:${C.person.email}`;

  /* 2. Renderers ---------------------------------------------------------------- */
  function renderHeader() {
    $("#wordmark").textContent = C.person.name;
    const navHTML = C.nav
      .map((n) => `<li><a class="nav-link" href="${esc(n.href)}">${esc(n.label)}</a></li>`)
      .join("");
    $("#nav-list").innerHTML = navHTML;
    $("#mobile-nav-list").innerHTML = C.nav
      .map(
        (n, i) =>
          `<li><a href="${esc(n.href)}"><span class="num">${String(i + 1).padStart(2, "0")}</span>${esc(n.label)}</a></li>`
      )
      .join("");
    $$("[data-resume]").forEach((a) => a.setAttribute("href", C.person.resume));
    const fab = $("#fab-email");
    fab.setAttribute("href", mailto());
  }

  function renderHero() {
    const h = C.hero;
    const words = C.person.name.trim().split(/\s+/);
    const last = words.pop();
    const nameHTML = `${words.length ? `<span class="line">${esc(words.join(" "))}</span> ` : ""}<span class="line line--italic">${esc(last)}</span>`;

    $("#hero-root").innerHTML = `
      <div class="hero-grid grid">
        <div class="hero-text">
          ${
            h.status && h.status.show
              ? `<p class="status"><span class="status-dot" aria-hidden="true"></span>${fmt(h.status.text)}</p>`
              : ""
          }
          <h1 class="hero-name" id="hero-title">${nameHTML}</h1>
          <p class="hero-lede">${fmt(h.positioning)}</p>
          ${isSet(h.meta) ? `<p class="hero-meta">${fmt(h.meta)}</p>` : ""}
          <p class="print-only print-contact">${esc(C.person.email)} &middot; ${esc(C.person.github.replace(/^https?:\/\//, ""))} &middot; ${esc(C.person.linkedin.replace(/^https?:\/\//, ""))}</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="${esc(h.primaryCta.href)}">${esc(h.primaryCta.label)}</a>
            <a class="btn btn--secondary" href="${esc(mailto())}">${esc(h.secondaryCta.label)}</a>
            <span class="hero-divider" aria-hidden="true"></span>
            <ul class="social">
              <li><a class="icon-btn" href="${esc(C.person.github)}" aria-label="GitHub profile">${icon("github")}</a></li>
              <li><a class="icon-btn" href="${esc(C.person.linkedin)}" aria-label="LinkedIn profile">${icon("linkedin")}</a></li>
              <li><a class="icon-btn" href="${esc(mailto())}" aria-label="Email ${esc(C.person.email)}">${icon("mail")}</a></li>
            </ul>
          </div>
        </div>
        ${isSet(h.photo && h.photo.src) ? `<figure class="hero-photo media media--portrait">${img(h.photo, { eager: true })}</figure>` : ""}
      </div>`;
  }

  function renderProof() {
    $("#proof-root").innerHTML = `
      <ul class="proof-list">
        ${C.proof
          .map(
            (p) => `
          <li class="proof-item">
            <p class="proof-value">${fmt(p.value)}</p>
            <p class="proof-label">${fmt(p.label)}</p>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function projectCard(p, i, featured) {
    const n = String(i + 1).padStart(2, "0");
    const titleId = `project-${i + 1}-title`;
    const hasMedia = p.image && isSet(p.image.src);
    const sr = (t) => `<span class="visually-hidden"> for ${esc(p.title)}</span>${t || ""}`;
    const links = [
      isSet(p.github) ? `<a class="link-arrow" href="${esc(p.github)}">Code${sr()}${icon("arrowUpRight", "icon--sm icon--diag")}</a>` : "",
      isSet(p.demo) ? `<a class="link-arrow" href="${esc(p.demo)}">Live demo${sr()}${icon("arrowUpRight", "icon--sm icon--diag")}</a>` : "",
      p.caseStudy
        ? `<button class="link-arrow" type="button" data-case="${i}" aria-haspopup="dialog">Case study${sr()}${icon("arrowRight", "icon--sm icon--right")}</button>`
        : "",
    ].join("");

    return `
      <article class="project${featured ? " project--featured" : ""}${hasMedia ? "" : " project--no-media"} reveal" aria-labelledby="${titleId}">
        ${hasMedia ? `<figure class="project-media media media--wide">${img(p.image)}</figure>` : ""}
        <div class="project-body">
          <p class="project-index">${n}${featured ? '<span class="project-flag">Featured</span>' : ""}</p>
          <h3 class="project-title" id="${titleId}">${fmt(p.title)}</h3>
          <dl class="facts">
            <div class="fact"><dt>Problem</dt><dd>${fmt(p.problem)}</dd></div>
            <div class="fact"><dt>What I built</dt><dd>${fmt(p.role)}</dd></div>
            <div class="fact fact--result"><dt>Result</dt><dd>${fmt(p.result)}</dd></div>
          </dl>
          ${stackList(p.stack, "Tech stack")}
          ${links ? `<div class="project-links">${links}</div>` : ""}
        </div>
      </article>`;
  }

  function renderWork() {
    const w = C.work;
    const [first, ...rest] = w.projects;
    const more =
        w.more && isSet(w.more.text)
            ? `<p class="work-more reveal">${fmt(w.more.text)}${
                isSet(w.more.href)
                    ? ` <a class="link-arrow" href="${esc(w.more.href)}">${esc(w.more.label || "See all")}${icon("arrowUpRight", "icon--sm icon--diag")}</a>`
                    : ""
            }</p>`
            : "";
    $("#work-root").innerHTML = `
      ${sectionHead("work", w)}
      <div class="projects">
        ${first ? projectCard(first, 0, true) : ""}
        ${rest.length ? `<div class="project-grid">${rest.map((p, i) => projectCard(p, i + 1, false)).join("")}</div>` : ""}
      </div>
      ${more}`;
  }

  function renderExperience() {
    const x = C.experience;
    const items = x.items
      .map(
        (it) => `
        <li class="timeline-item${it.type === "education" ? " timeline-item--muted" : ""} reveal">
          <div class="timeline-meta">
            <p class="timeline-date">${fmt(it.dates)}</p>
            ${isSet(it.duration) ? `<p>${fmt(it.duration)}</p>` : ""}
          </div>
          <div class="timeline-body">
            <h3 class="timeline-role">${fmt(it.role)}</h3>
            <p class="timeline-org">${fmt(it.org)}</p>
            ${isSet(it.project) ? `<p class="timeline-project"><span class="label">Project</span>${fmt(it.project)}</p>` : ""}
            ${
              it.points && it.points.length
                ? `<ul class="timeline-points">${it.points.map((pt) => `<li>${fmt(pt)}</li>`).join("")}</ul>`
                : ""
            }
            ${isSet(it.outcome) ? `<p class="timeline-outcome"><span class="label">Outcome</span>${fmt(it.outcome)}</p>` : ""}
            ${stackList(it.stack, "Tools used")}
          </div>
        </li>`
      )
      .join("");

    const L = x.leadership;
    const rows = L.items
      .map(
        (r) => `
        <li class="row">
          <div>
            <p class="row-role">${fmt(r.role)}</p>
            <p class="row-club">${fmt(r.club)}</p>
          </div>
          <div class="row-impact">
            <p>${fmt(r.impact)}</p>
            ${r.photo && isSet(r.photo.src) ? `<figure class="row-photo media media--photo">${img(r.photo)}</figure>` : ""}
          </div>
        </li>`
      )
      .join("");

    $("#experience-root").innerHTML = `
      ${sectionHead("experience", x)}
      <ol class="timeline">${items}</ol>
      <div class="leadership grid reveal">
        <h3 class="leadership-title">${fmt(L.heading)}</h3>
        <ul class="rows">${rows}</ul>
      </div>`;
  }

  function renderSkills() {
    const s = C.skills;
    $("#skills-root").innerHTML = `
      ${sectionHead("skills", s)}
      <dl class="skills reveal">
        ${s.groups
          .map(
            (g) => `
          <div class="skill-group grid">
            <dt>${fmt(g.name)}</dt>
            <dd><ul class="skill-list">${g.items.map((it) => `<li>${fmt(it)}</li>`).join("")}</ul></dd>
          </div>`
          )
          .join("")}
      </dl>`;
  }

  function renderRecognition() {
    const r = C.recognition;
    const pub = r.publication;
    const hack = r.hackathons;
    const certs = r.certificates;
    const initial = Number(certs.initial) || 6;
    const extra = Math.max(0, certs.items.length - initial);

    const certItems = certs.items
        .map(
            (c, i) => `
        <li class="cert"${i >= initial ? " hidden data-extra" : ""}>
          <div class="cert-main">
            ${
                isSet(c.image)
                    ? `<button class="cert-thumb-btn" type="button" data-full="${esc(c.image)}" data-alt="${esc(c.title)} certificate" aria-label="Enlarge ${esc(c.title)} certificate">
                     <img src="${esc(c.image)}" alt="" width="120" height="85" loading="lazy" decoding="async">
                   </button>`
                    : ""
            }
            <div>
              <p class="cert-title">${fmt(c.title)}</p>
              <p class="cert-issuer">${fmt(c.issuer)}${isSet(c.note) ? `<span class="cert-note">${fmt(c.note)}</span>` : ""}</p>
            </div>
          </div>
          ${
                isSet(c.url)
                    ? `<a class="link-arrow cert-link" href="${esc(c.url)}">View<span class="visually-hidden"> ${esc(c.title)} certificate</span>${icon("arrowUpRight", "icon--sm icon--diag")}</a>`
                    : ""
            }
        </li>`
        )
        .join("");

    const photos = (hack.photos || []).filter((p) => p && isSet(p.src));

    $("#recognition-root").innerHTML = `
      ${sectionHead("recognition", r)}

      <div class="rec-block grid reveal">
        <h3 class="rec-label">Publication</h3>
        <div class="rec-content">
          <p class="pub-title"><a href="${esc(pub.url)}">${fmt(pub.title)}</a></p>
          <ul class="pub-meta">
            <li>${fmt(pub.publisher)}, ${fmt(pub.year)}</li>
            <li>${fmt(pub.venue)}</li>
            <li>${fmt(pub.authorship)}</li>
          </ul>
          <a class="link-arrow pub-link" href="${esc(pub.url)}">Read on IEEE Xplore${icon("arrowUpRight", "icon--sm icon--diag")}</a>
        </div>
      </div>

      <div class="rec-block grid reveal">
        <h3 class="rec-label">Hackathons</h3>
        <div class="rec-content">
          <p class="hack-summary">${fmt(hack.summary)}</p>
          ${
            photos.length
              ? `<div class="photo-strip">${photos.map((p) => `<figure class="media media--photo">${img(p)}</figure>`).join("")}</div>`
              : ""
          }
        </div>
      </div>

      <div class="rec-block grid reveal">
        <h3 class="rec-label">Certificates</h3>
        <div class="rec-content">
          <ul class="cert-list" id="cert-list">${certItems}</ul>
          ${
            extra
              ? `<button class="link-arrow cert-toggle" type="button" aria-expanded="false" aria-controls="cert-list" data-total="${certs.items.length}">
                   <span class="cert-toggle-label">Show all ${certs.items.length}</span>${icon("plus", "icon--sm")}
                 </button>`
              : ""
          }
        </div>
      </div>`;
  }

  function renderBeyond() {
    const b = C.beyond;
    $("#beyond-root").innerHTML = `
      <div class="beyond-grid grid reveal">
        <p class="eyebrow">${fmt(b.label)}</p>
        <div class="beyond-main">
          <h2 class="section-title section-title--sm" id="beyond-title">${fmt(b.heading)}</h2>
          <p class="beyond-body">${fmt(b.body)}</p>
        </div>
      </div>`;
  }

  function renderAbout() {
    const a = C.about;
    const items = (a.howIWork || []).slice(0, 3);
    $("#about-root").innerHTML = `
      ${sectionHead("about", a)}
      <div class="about-grid grid">
        ${a.photo && isSet(a.photo.src) ? `<figure class="about-photo media media--portrait reveal">${img(a.photo)}</figure>` : ""}
        <div class="about-text reveal">
          ${a.paragraphs.map((p) => `<p>${fmt(p)}</p>`).join("")}
          ${
            items.length
              ? `<h3 class="about-sub">${fmt(a.howIWorkHeading)}</h3>
                 <div class="accordion">
                   ${items
                     .map(
                       (it) => `
                     <details class="acc-item" name="how-i-work">
                       <summary><span>${fmt(it.title)}</span>${icon("plus")}</summary>
                       <div class="acc-panel"><p>${fmt(it.body)}</p></div>
                     </details>`
                     )
                     .join("")}
                 </div>`
              : ""
          }
          ${isSet(a.interests) ? `<p class="interests">${fmt(a.interests)}</p>` : ""}
        </div>
      </div>`;
  }

  function renderContact() {
    const c = C.contact;
    $("#contact-head").innerHTML = sectionHead("contact", c);
    $("#contact-info").innerHTML = `
      <p class="contact-line reveal">${fmt(c.line)}</p>
      <div class="email-row reveal">
        <a class="email-address" href="${esc(mailto())}">${esc(C.person.email)}</a>
        <button class="btn btn--secondary btn--sm copy-btn" type="button" id="copy-email" data-email="${esc(C.person.email)}">
          ${icon("copy", "icon--sm icon--copy")}${icon("check", "icon--sm icon--check")}
          <span class="copy-label">Copy</span>
        </button>
      </div>
      <ul class="contact-links reveal">
        <li><a href="${esc(C.person.github)}">GitHub${icon("arrowUpRight", "icon--sm")}</a></li>
        <li><a href="${esc(C.person.linkedin)}">LinkedIn${icon("arrowUpRight", "icon--sm")}</a></li>
        <li><a href="${esc(C.person.resume)}" data-resume>Resume (PDF)${icon("arrowUpRight", "icon--sm")}</a></li>
      </ul>`;
  }

  function renderFooter() {
    const [y, m, d] = String(C.meta.lastUpdated).split("-").map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    const pretty = isNaN(date)
      ? esc(C.meta.lastUpdated)
      : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    $("#footer-root").innerHTML = `
      <div class="footer-meta">
        <p class="footer-name">${esc(C.person.name)}</p>
        <p>Last updated: <time datetime="${esc(C.meta.lastUpdated)}">${pretty}</time></p>
        ${isSet(C.footer && C.footer.note) ? `<p>${fmt(C.footer.note)}</p>` : ""}
      </div>
      <ul class="footer-links">
        <li><a href="${esc(C.person.github)}">GitHub</a></li>
        <li><a href="${esc(C.person.linkedin)}">LinkedIn</a></li>
        <li><a href="${esc(mailto())}">Email</a></li>
        <li><a href="${esc(C.person.resume)}" data-resume>Resume</a></li>
        <li><a href="#top">Back to top</a></li>
      </ul>`;
  }

  /* 3. Behaviour ------------------------------------------------------------------ */

  // Theme: dark default, OS preference on first visit, saved choice after that.
  function initTheme() {
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const buttons = $$("[data-theme-toggle]");

    const apply = (theme) => {
      root.setAttribute("data-theme", theme);
      const next = theme === "dark" ? "light" : "dark";
      buttons.forEach((b) => b.setAttribute("aria-label", `Switch to ${next} theme`));
      if (meta) meta.setAttribute("content", theme === "dark" ? "#0B0B0C" : "#F6F5F2");
    };

    apply(root.getAttribute("data-theme") || "dark");

    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try {
          localStorage.setItem("theme", next);
        } catch (e) {
          /* storage blocked: the choice lasts for this page view only */
        }
      })
    );

    // Follow OS changes only until the visitor picks a theme themselves.
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem("theme");
      } catch (err) {
        /* ignore */
      }
      if (!saved) apply(e.matches ? "light" : "dark");
    });
  }

  // Header shrink, progress bar, back-to-top and active nav all share one rAF scroll loop.
  function initScroll() {
    const header = $("#site-header");
    const bar = $("#progress-bar");
    const toTop = $("#to-top");
    const sections = $$("main > section[id]");
    const navIds = C.nav.map((n) => n.href.replace("#", ""));
    const links = $$(".nav-link");
    let ticking = false;
    let current = null;

    const setActive = (id) => {
      if (id === current) return;
      current = id;
      links.forEach((a) => {
        if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      header.classList.toggle("is-scrolled", y > 8);
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      toTop.classList.toggle("is-visible", y > 600);

      // Active section = last section whose top has passed 40% of the viewport.
      let active = null;
      const line = window.innerHeight * 0.4;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) active = s.id;
      }
      if (max - y < 4) active = sections[sections.length - 1].id; // at the very bottom
      setActive(navIds.includes(active) ? active : null);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  // Full-screen mobile menu with focus trap and Esc to close.
  function initMobileMenu() {
    const menu = $("#mobile-menu");
    const openBtn = $("#menu-open");
    const closeBtn = $("#menu-close");
    const outside = [$("#site-header"), $("#main"), $(".site-footer"), $(".float-actions")];
    const focusables = () =>
      $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', menu).filter((el) => el.offsetParent !== null);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    function open() {
      menu.hidden = false;
      openBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      outside.forEach((el) => el && (el.inert = true));
      document.addEventListener("keydown", onKey);
      closeBtn.focus();
    }

    function close({ restoreFocus = true } = {}) {
      if (menu.hidden) return;
      menu.hidden = true;
      openBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      outside.forEach((el) => el && (el.inert = false));
      document.removeEventListener("keydown", onKey);
      if (restoreFocus) openBtn.focus();
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", () => close());
    // Following a link closes the menu; the browser then scrolls to the section.
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) close({ restoreFocus: false });
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => {
      if (e.matches) close({ restoreFocus: false });
    });
  }

  // Fade and lift elements into view, once.
  function initReveal() {
    const els = $$(".reveal");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
  }

  // Case-study modal (native <dialog>: focus is contained and Esc closes it).
  function initCaseStudy() {
    const dialog = $("#case-study");
    const root = $("#case-root");
    let trigger = null;

    if (typeof dialog.showModal !== "function") {
      $$("[data-case]").forEach((b) => b.remove()); // very old browsers: hide the feature
      return;
    }

    const render = (p) => {
      const cs = p.caseStudy;
      const arch = cs.architecture;
      root.innerHTML = `
        <header class="case-head">
          <div>
            <p class="eyebrow">Case study</p>
            <h2 class="case-title" id="case-title">${fmt(p.title)}</h2>
          </div>
          <button class="icon-btn" type="button" data-case-close aria-label="Close case study">${icon("close")}</button>
        </header>
        <div class="case-body">
          <section class="case-block"><h3>Problem</h3><div>${textBlock(cs.problem)}</div></section>
          <section class="case-block"><h3>Approach</h3><div>${textBlock(cs.approach)}</div></section>
          ${
            arch && isSet(arch.src)
              ? `<section class="case-block"><h3>Architecture</h3><figure class="media media--diagram">${img(arch)}</figure></section>`
              : ""
          }
          <section class="case-block"><h3>Results</h3><div>${textBlock(cs.results)}</div></section>
          <section class="case-block"><h3>Learnings</h3><div>${textBlock(cs.learnings)}</div></section>
          ${
            isSet(p.github)
              ? `<section class="case-block"><h3>Links</h3><div><a class="link-arrow" href="${esc(p.github)}">Code on GitHub${icon("arrowUpRight", "icon--sm icon--diag")}</a></div></section>`
              : ""
          }
        </div>`;
      decorateLinks(root);
    };

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-case]");
      if (!btn) return;
      const p = C.work.projects[Number(btn.dataset.case)];
      if (!p || !p.caseStudy) return;
      trigger = btn;
      render(p);
      dialog.showModal();
      document.body.classList.add("no-scroll");
      dialog.scrollTop = 0;
      $("[data-case-close]", dialog).focus();
    });

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target.closest("[data-case-close]")) dialog.close();
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
      if (trigger) trigger.focus();
    });
  }

  function initCertToggle() {
    const btn = $(".cert-toggle");
    if (!btn) return;
    const label = $(".cert-toggle-label", btn);
    btn.addEventListener("click", () => {
      const expand = btn.getAttribute("aria-expanded") !== "true";
      $$("#cert-list [data-extra]").forEach((li) => (li.hidden = !expand));
      btn.setAttribute("aria-expanded", String(expand));
      label.textContent = expand ? "Show fewer" : `Show all ${btn.dataset.total}`;
    });
  }

  // <details name="..."> already makes an exclusive accordion in modern browsers; this covers older ones.
  function initAccordion() {
    const items = $$(".acc-item");
    items.forEach((d) =>
      d.addEventListener("toggle", () => {
        if (d.open) items.forEach((o) => o !== d && (o.open = false));
      })
    );
  }

  function announce(msg) {
    const el = $("#announcer");
    el.textContent = "";
    window.setTimeout(() => (el.textContent = msg), 50);
  }

  function initCopyEmail() {
    const btn = $("#copy-email");
    if (!btn) return;
    const label = $(".copy-label", btn);
    let timer;

    const fallbackCopy = (text) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.className = "visually-hidden";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      ta.remove();
      return ok;
    };

    btn.addEventListener("click", async () => {
      const email = btn.dataset.email;
      let ok = false;
      try {
        await navigator.clipboard.writeText(email);
        ok = true;
      } catch (e) {
        ok = fallbackCopy(email);
      }
      label.textContent = ok ? "Copied" : "Press Ctrl+C";
      btn.classList.toggle("is-copied", ok);
      announce(ok ? "Email address copied" : "Copy failed. Select the address and copy it.");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        label.textContent = "Copy";
        btn.classList.remove("is-copied");
      }, 2000);
    });
  }

  // Contact form: validation, honeypot, loading/success/error, Formspree/Netlify/mailto.
  function initForm() {
    const form = $("#contact-form");
    const status = $("#form-status");
    const submit = $("#form-submit");
    const submitLabel = $(".form-submit-label", submit);
    const cfg = (C.contact && C.contact.form) || {};
    let attempted = false;

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Enter your name."),
      email: (v) =>
        !v.trim()
          ? "Enter your email address."
          : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? ""
          : "Enter a valid email address, like name@company.com.",
      message: (v) => (v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."),
    };

    const check = (input) => {
      const msg = rules[input.name](input.value);
      const err = $(`#${input.id}-error`);
      err.textContent = msg;
      if (msg) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
      return !msg;
    };

    const fields = Object.keys(rules).map((n) => form.elements[n]);
    fields.forEach((input) => {
      input.addEventListener("blur", () => attempted && check(input));
      input.addEventListener("input", () => {
        if (attempted || input.getAttribute("aria-invalid") === "true") check(input);
      });
    });

    const setLoading = (on) => {
      submit.disabled = on;
      submit.setAttribute("aria-busy", String(on));
      submitLabel.textContent = on ? "Sending" : "Send message";
    };

    const showStatus = (html) => {
      status.innerHTML = html;
      status.focus();
    };

    const fallbackLink = `<a href="${esc(mailto())}">${esc(C.person.email)}</a>`;

    const success = (name) => {
      form.hidden = true;
      showStatus(`
        <h3>Thanks${name ? `, ${esc(name.split(" ")[0])}` : ""}. Your message is on its way.</h3>
        <p>I will reply to the email address you gave.</p>
        <button class="btn btn--secondary btn--sm" type="button" data-form-reset>Send another message</button>`);
    };

    status.addEventListener("click", (e) => {
      if (!e.target.closest("[data-form-reset]")) return;
      form.reset();
      attempted = false;
      form.hidden = false;
      status.innerHTML = "";
      form.elements.name.focus();
    });

    const openMailto = (data) => {
      const subject = `Portfolio enquiry from ${data.name}`;
      const body = `${data.message}\n\n${data.name}\n${data.email}`;
      window.location.href = `${mailto()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showStatus(`
        <h3>Your email app should open with the message filled in.</h3>
        <p>If it did not, email me at ${fallbackLink}.</p>`);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      attempted = true;
      status.innerHTML = "";

      // Honeypot filled: almost certainly a bot. Pretend it worked, send nothing.
      if (form.elements._gotcha.value) {
        success("");
        return;
      }

      const invalid = fields.filter((f) => !check(f));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim(),
      };

      const provider = String(cfg.provider || "mailto").toLowerCase();
      const endpoint = isSet(cfg.endpoint) ? cfg.endpoint : provider === "netlify" ? "/" : "";

      if (provider === "mailto" || !endpoint) {
        openMailto(data);
        return;
      }

      setLoading(true);
      try {
        let res;
        if (provider === "netlify") {
          res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString(),
          });
        } else {
          res = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
          });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        success(data.name);
      } catch (err) {
        showStatus(`
          <h3>The message did not send.</h3>
          <p>Please try again, or email me directly at ${fallbackLink}.</p>`);
      } finally {
        setLoading(false);
      }
    });
  }

  // Hide the floating Email button while the hero or contact section is on screen.
  function initFab() {
    const fab = $("#fab-email");
    if (!("IntersectionObserver" in window)) return;
    const watched = [$("#top"), $("#contact")];
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      const hide = visible.size > 0;
      fab.classList.toggle("is-hidden", hide);
      if (hide) fab.setAttribute("tabindex", "-1");
      else fab.removeAttribute("tabindex");
    });
    watched.forEach((el) => el && io.observe(el));
  }

  // Add UTM parameters to outbound links and the resume; open them in a new tab.
  // utm_campaign is the section (or header/footer/menu) the link sits in.
  function decorateLinks(scope = document) {
    $$("a[href]", scope).forEach((a) => {
      if (a.dataset.utm === "done") return;
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;

      let url;
      try {
        url = new URL(raw, document.baseURI);
      } catch (e) {
        return;
      }
      const isResume = a.hasAttribute("data-resume");
      const isExternal = /^https?:$/.test(url.protocol) && url.origin !== window.location.origin;
      if (!isExternal && !isResume) return;

      const holder = a.closest("[data-utm], section[id], dialog[id]");
      const campaign = holder ? holder.dataset.utm || holder.id : "site";

      url.searchParams.set("utm_source", "portfolio");
      url.searchParams.set("utm_medium", "website");
      url.searchParams.set("utm_campaign", campaign === "top" ? "hero" : campaign);
      if (isResume) url.searchParams.set("utm_content", "resume");

      if (isExternal) {
        a.dataset.printHref = raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
        a.href = url.href;
      } else {
        // Keep the resume path relative so it works on any host.
        a.setAttribute("href", raw.split("?")[0] + url.search);
      }

      a.target = "_blank";
      a.rel = "noopener noreferrer";
      if (a.hasAttribute("aria-label")) {
        a.setAttribute("aria-label", `${a.getAttribute("aria-label")} (opens in a new tab)`);
      } else {
        a.insertAdjacentHTML("beforeend", '<span class="visually-hidden"> (opens in a new tab)</span>');
      }
      a.dataset.utm = "done";
    });
  }

  // Print: open accordions so their text prints; restore afterwards.
  function initPrint() {
    let opened = [];
    window.addEventListener("beforeprint", () => {
      opened = $$(".acc-item:not([open])");
      opened.forEach((d) => (d.open = true));
    });
    window.addEventListener("afterprint", () => {
      opened.forEach((d) => (d.open = false));
      opened = [];
    });
  }

  // Click a certificate thumbnail to see it full size. Esc, or a click anywhere, closes it.
  function initLightbox() {
    if (typeof HTMLDialogElement === "undefined") return;
    const dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Certificate preview. Click or press Escape to close.");
    dlg.innerHTML = '<img alt="">';
    document.body.appendChild(dlg);
    const big = $("img", dlg);
    let trigger = null;

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-full]");
      if (!btn) return;
      trigger = btn;
      big.src = btn.dataset.full;
      big.alt = btn.dataset.alt || "";
      dlg.showModal();
      document.body.classList.add("no-scroll");
    });

    dlg.addEventListener("click", () => dlg.close());
    dlg.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
      if (trigger) trigger.focus();
    });
  }

     // Email links: if no mail app opens, copy the address and say so.
  function initMailtoFallback() {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
    let hideTimer;
    const show = (msg) => {
      toast.textContent = msg;
      toast.classList.add("is-visible");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 5000);
    };
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="mailto:"]');
      if (!a) return;
      const email = a.getAttribute("href").replace(/^mailto:/, "").split("?")[0];
      let left = false;
      const mark = () => { left = true; };
      window.addEventListener("blur", mark, { once: true });
      document.addEventListener("visibilitychange", mark, { once: true });
      window.setTimeout(async () => {
        window.removeEventListener("blur", mark);
        document.removeEventListener("visibilitychange", mark);
        if (left) return; // a mail app took focus, so it worked
        let ok = false;
        try {
          await navigator.clipboard.writeText(email);
          ok = true;
        } catch (err) {
          ok = false;
        }
        show(ok ? "No email app opened. Address copied: " + email : "No email app opened. Write to " + email);
      }, 1200);
    });
  }

  /* 4. Init ------------------------------------------------------------------------ */
  renderHeader();
  renderHero();
  renderProof();
  renderWork();
  renderExperience();
  renderSkills();
  renderRecognition();
  renderBeyond();
  renderAbout();
  renderContact();
  initMailtoFallback();
  renderFooter();

  decorateLinks();
  initTheme();
  initScroll();
  initMobileMenu();
  initReveal();
  initCaseStudy();
  initCertToggle();
  initLightbox();
  initAccordion();
  initCopyEmail();
  initForm();
  initFab();
  initPrint();

  // If the page was opened with a #hash, jump there now that the content exists.
  if (window.location.hash.length > 1) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
