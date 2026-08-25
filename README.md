# Discover Hauz Khas

A hyperlocal directory for **Hauz Khas, New Delhi** — cafés, restaurants, bars, art galleries, boutiques, salons, gyms, coworking spaces, clinics and stores. Built for the **MK621 Digital Marketing Live Project (Part 1)**.

Static, server-rendered HTML (ideal for SEO), **zero dependencies**, deploys to Vercel in ~3 minutes.

- **10** categories · **78** real listings · **4** blog guides · **99** indexable pages
- Full on-page + technical SEO: unique per-page meta titles/descriptions, canonical URLs, Open Graph + Twitter cards, JSON-LD structured data (Organization, WebSite + SearchAction, LocalBusiness, Breadcrumb, ItemList, Article, FAQPage), `sitemap.xml`, `robots.txt`, semantic headings, descriptive image `alt` text and fast Core Web Vitals.
- Live domain (set in `src/data.mjs`): **https://discover-hauz-khas.vercel.app**

---

## 1. What's in this folder

```
build.mjs        ← the site generator (run this to build)
src/data.mjs     ← ALL content: businesses, categories, blog posts (edit here)
assets/          ← styles.css, app.js, search.js
dist/            ← the pre-built website (101 HTML files) — ready to preview/deploy
package.json     ← npm scripts (build / preview)
vercel.json      ← tells Vercel how to build & serve the site
```

To **preview right now** without any tools: open `dist/index.html` in your browser.

---

## 2. Run locally (optional)

You need **Node 18+**. In this folder:

```bash
npm run build      # regenerates the static site into /dist
npm run preview    # builds, then serves at http://localhost:3000
```

There is nothing to `npm install` — the generator uses only Node's built-in modules.
To change content, edit **`src/data.mjs`** and run `npm run build` again.

---

## 3. Deploy to Vercel (recommended)

### Step A — Put the code on GitHub
1. Create a new **empty** repository on GitHub named `discover-hauz-khas` (no README/license).
2. In this folder run:
   ```bash
   git init
   git add .
   git commit -m "Discover Hauz Khas directory"
   git branch -M main
   git remote add origin https://github.com/satyam-ai-cell/discover_hauz_khas.git
   git push -u origin main
   ```

### Step B — Import into Vercel
1. Go to **vercel.com** → sign in with GitHub → **Add New… → Project**.
2. Import the `discover-hauz-khas` repo. Vercel reads `vercel.json` automatically
   (Build Command `node build.mjs`, Output Directory `dist`). Leave defaults.
3. Click **Deploy**. In ~1 minute you get a live URL.

### Step C — Match the domain (important for SEO)
Your Vercel project must be named so the URL is **discover-hauz-khas.vercel.app**
(that's the domain baked into every canonical tag and the sitemap). If Vercel gives a
different URL, either rename the project in **Settings → General**, or change the one
line `url:` in `src/data.mjs`, rebuild, and push again.

---

## 4. After deploying — connect Google Search Console (this is graded)
1. Go to **search.google.com/search-console** → add your Vercel URL as a **URL-prefix** property.
2. Verify (the HTML-tag method is easiest — paste the tag, or use the Vercel domain).
3. **Submit the sitemap**: in Search Console → *Sitemaps* → enter `sitemap.xml` → Submit.
4. Use **URL Inspection** → *Request indexing* on the homepage and a few category pages.

Then capture these screenshots for the report (Section 7 appendix):
homepage, a category page, a listing page, the mobile view, Search Console with the
sitemap submitted, a PageSpeed Insights score, and the Rich Results Test showing valid
structured data.

---

Built as a hand-coded static site to maximise search visibility — the primary objective of the project.
