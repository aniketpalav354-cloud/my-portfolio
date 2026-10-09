# Aniket Palav — Portfolio

Static site (HTML/CSS/JS) + Supabase (messages & reviews) + Cloudflare (hosting) + GitHub (code).

## Files
- `index.html`, `style.css`, `script.js` — the website
- `config.js` — **your settings**: Supabase keys, WhatsApp number, video list
- `supabase.sql` — database tables and security rules
- `assets/` — put your images here (create this folder)

## 1. Add your images (folder `assets/`)
`hero.jpg`, `profile.jpg`, `before.jpg`, `after.jpg`, and video thumbnails `v1.jpg` … `v6.jpg`.
Use compressed JPG/WebP (under ~300 KB each). Until you add them, a placeholder is shown.
Add your videos in `config.js` (`window.VIDEOS`) with the thumbnail and the YouTube/Instagram link.

## 2. Supabase
1. supabase.com -> New project.
2. SQL Editor -> paste `supabase.sql` -> Run.
3. Project Settings -> API -> copy **Project URL** and **anon public key** into `config.js`.
   Never put the `service_role` key in the website.
4. Approve reviews: Table Editor -> `reviews` -> set `approved` = true.

## 3. GitHub
```
git init
git add .
git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/my-portfolio.git
git push -u origin main
```

## 4. Cloudflare
Workers & Pages -> Create -> Pages -> Connect to Git -> choose the repo.
Framework preset: None. Build command: leave empty. Output directory: `/` (root).
Every `git push` will redeploy the site automatically.
Optional: Custom domains -> add your domain.

## Test locally
Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000
