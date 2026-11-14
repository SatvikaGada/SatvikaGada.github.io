# Satvika Gada: portfolio

Plain HTML, CSS and JavaScript. No framework and no build step.

```
index.html          page skeleton, meta tags, contact form
styles.css          all styling; colours, spacing and type are CSS variables at the top
main.js             renders content.js and runs the interactions
content.js          ALL text, links, projects and lists. This is the file you edit.
site.webmanifest    app icons
favicon.ico
assets/             photo, project, diagram placeholders, icons, OG image, resume PDF
```

## Edit content

Open `content.js`. Everything on the page comes from the `CONTENT` object.

- Text in `[square brackets]` is a placeholder. It shows on the page with a dashed red underline, so anything left unfinished is easy to spot. Replace the whole thing, brackets included.
- Search the project for `TODO:` to find every spot that needs your input (`grep -rn "TODO:" .`).
- Set a field to `""` or `null` to hide it. For example, `demo: ""` hides the Live demo link, `caseStudy: null` hides the Case study button, and `hero.status.show: false` hides the "Open to..." line.
- **Projects** (`work.projects`): the first project is the large featured row and the rest form a 2-column grid. Each project has `title`, `problem`, `role`, `stack`, `result`, `github`, `demo`, `image`, `caseStudy`.
- **Certificates**: array order is display order. `initial` sets how many show before "Show all".
- **Last updated**: change `meta.lastUpdated` (YYYY-MM-DD) whenever you edit.
- **Contact form**: set `contact.form.provider`:
  - `"formspree"`: create a form at formspree.io and paste its URL into `endpoint`.
  - `"netlify"`: deploy on Netlify; the form in `index.html` is already marked up for Netlify Forms.
  - `"mailto"`: no backend; the visitor's email app opens with the message filled in. This is also the fallback when `endpoint` is empty.

Also update the static tags in `index.html` (title, description, canonical URL, Open Graph, JSON-LD). Social sites read those without running JavaScript.

## Replace the photo and resume

- **Photo**: put a 4:5 image (e.g. 800 x 1000 JPG or WebP, under 200 KB) in `assets/`, then set `hero.photo.src` and `about.photo.src` in `content.js`. Keep `width` and `height` matching the file so the layout does not shift.
- **Project screenshots**: 16:10 (e.g. 1600 x 1000). Diagrams are 16:9. Hackathon and club photos are 4:3.
- **Resume**: replace `assets/Satvika_Gada_Resume.pdf` with your own file, using the same name.
- **Social preview**: `assets/og-image.png` is 1200 x 630. Replace it if you want a different preview.

## Preview locally

Run a small local server from this folder. (Opening `index.html` directly mostly works too, but a server matches how it runs once deployed.)

```
python3 -m http.server 8000
# then open http://localhost:8000
```

or `npx serve .`

## Deploy

- **GitHub Pages**: push to a repo, then go to Settings, Pages, and choose Deploy from branch (root). All paths are relative, so project sites work as well.
- **Netlify or Vercel**: import the repo. There is no build command, and the publish directory is the repo root.

## Notes

- Dark theme is the default. On a first visit the site follows the OS setting, and after that it remembers the toggle.
- Outbound links get `utm_source=portfolio&utm_medium=website&utm_campaign=<section>` added automatically. The resume link also gets `utm_content=resume`.
- Print (Ctrl+P) gives a white, resume-style layout and shows the URL after each link. With all four projects and ten certificates it runs to about two A4 pages.
