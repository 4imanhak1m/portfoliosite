# Aiman Hakim: portfolio website

A single-page personal portfolio for Aiman Hakim, Project/Product Analyst. It is plain HTML, CSS and JavaScript, with no framework, no libraries and **no build step**. The whole website is the `site` folder, and you can upload it as it is to any free static host.

```
site/                       <- the folder you deploy
  index.html                all the text on the page
  styles.css                colours, fonts, layout and animation
  script.js                 behaviour (menu, filters, animations, copy buttons)
  assets/
    hero-photo.jpg          hero photo (800 x 1200)
    profile.jpg             picture shown when the link is shared (og:image)
    favicon.svg             browser tab icon
    apple-touch-icon.png    iPhone/iPad home-screen icon
  vercel.json               Vercel settings (clean URLs, security headers)
tests/check-site.ps1        automatic checks (not deployed)
README.md                   this file (not deployed)
```

## Prerequisites

- To **view or edit** the site, you need a text editor (VS Code or Notepad) and a web browser.
- To **run the checks**, you need Windows PowerShell 5.1, which is built into Windows. Nothing needs to be installed.
- To **deploy** it, you need a free account with one of the hosts below.

## View it on your computer

- **Simplest:** double-click `site\index.html`. It opens in your browser and works from the file directly.
- **Through a local web server** (closer to how it runs online), if you have one: serve the project folder and open `http://localhost:<port>/site/index.html`.

## Run the checks

From the project folder, in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File tests\check-site.ps1
```

The script checks:
- **Privacy:** the only phone number is 012-470 2411 and the only email is aiman.hakim01@gmail.com.
- **Content:** 4 roles with 7/5/5/4 bullets, 9 projects, all 17 resume skills exactly once, 5 languages, and the education and certification entries.
- **Sharing tags:** the title and meta tags.
- **Links and images:** links and anchors, image sizes and alt text, and that every path is relative.

It ends with `N passed, 0 failed` and exit code 0 when everything is fine.

**Privacy check for reference details:** the resume lists references whose details must never appear on the site. To check for them without storing them in any file, pass the words on the command line, separated by commas:

```powershell
powershell -ExecutionPolicy Bypass -File tests\check-site.ps1 -Forbidden "word1,word2,word3"
```

Use the references' names, email domains and phone digits. The script reports only "term #1", "term #2" and so on, never the words themselves.

## How to edit the content

All visible text is in `site\index.html`. Each section starts with a banner comment such as `<!-- ===== 02 EXPERIENCE: edit roles below ===== -->`; search for `=====` to jump between them. Edit only the text between tags, and keep the tags themselves. After editing, save the file and refresh the browser.

| Section | What to change | Where |
|---|---|---|
| Hero | Title line, name, one-line statement | `00 HERO` block in `index.html` |
| Hero typed line | The rotating "> now: ..." phrases | `TYPED_PHRASES` at the top of `script.js`. The first phrase is also in `index.html`, for visitors without JavaScript. |
| About | Summary, quote, career goal, the 4 stats | `01 ABOUT`. For a stat, change both the visible number and `data-to="..."` (the number it counts up to). |
| Experience | Roles | `02 EXPERIENCE` (see the recipe below) |
| Projects | Project cards | `03 PROJECTS` (see the recipe below) |
| Skills | Skill cards | `04 SKILLS`: one `<li class="skill">Name</li>` per skill. Row 1 is the first `<ul>`, row 2 the second. The moving copies are made automatically. |
| Languages | Language tiles | `04 SKILLS`, under `Languages`. Add `class="el"` to the level to show it in grey (used for Elementary). |
| Education & certifications | Entries | `05 EDUCATION`: one `<div class="edu-item">...</div>` per entry |
| Contact | Email, phone, LinkedIn | `06 CONTACT`. If you change the email or phone, change it everywhere it appears: the `mailto:`/`tel:` link, the visible text, `COPY_VALUES` at the top of `script.js`, and the footer. |
| Footer | Name and links | `FOOTER` at the bottom of `index.html`. The year updates itself. |

### Add or change a role (Experience)

Copy a whole `<article class="job reveal"> ... </article>` block and paste it in date order, newest first. Then change:

- the job title in `<h3>`;
- the dates: the visible text (`Aug 2024`), and `datetime="2024-08"` on each `<time>`;
- the duration: `data-start="YYYY-MM"` and `data-end="YYYY-MM"` on `<span class="dur">`. Use `data-end="present"` for a current job: its duration is worked out from today's date. Keep a written duration inside the span (e.g. `4 mos`) for past roles;
- the company in `<span class="co">` and the location after it;
- one `<li>` per bullet. `<b>Lead-in:</b>` makes a bold lead-in.

The `NOW` pill (`<span class="now">NOW</span>`) belongs only on the current job.

### Add or change a project

Copy a whole `<article class="card reveal" data-cat="..."> ... </article>` block, then set:

- `data-cat`: which filter it belongs to. Use `ai` (AI products), `gov` (GovTech) or `data` (Data & ML). The numbers on the filter buttons update automatically.
- the badge: `<span class="tag ai">Text</span>`. The style is `tag ai` (orange), `tag gov` (outlined orange) or `tag data` (grey).
- the title in `<h3>`, the context line in `<p class="client">` and the description in `<p>`. Use a `<ul>` with `<li>` items for bullets instead.
- an optional highlight at the bottom: `<p class="hl">Top 11 finalist</p>`.

### Swap the photo

1. Prepare a **portrait** photo at **800 x 1200 pixels**, saved as JPEG at about quality 80. That keeps it under about 100 KB.
2. Save it as `site\assets\hero-photo.jpg`, replacing the old file and keeping the same name.
3. In `index.html`, update the photo's `alt="..."` text to describe the new photo.
4. If the face sits too high or low in the frame, adjust `object-position: 40% 45%` under `.portrait img` in `styles.css`. The first number moves the crop left/right, the second up/down.

The picture used when the link is shared is a separate file, `site\assets\profile.jpg`.

### Colours, fonts and animation

- **Colours** are defined once at the top of `styles.css` (the "Tokens" block).
- **Fonts** come from Google Fonts, linked in the `<head>` of `index.html`.
- **Animations** can be paused by visitors with the pause button in the navigation bar. They are switched off automatically for anyone whose device is set to "reduce motion".

## Deploy for free

The **`site` folder is the website**. Upload its contents only; `README.md` and `tests` stay on your computer.

### Vercel (recommended)

The site is ready for Vercel as it is. There is nothing to build, and `site/vercel.json` already sets clean addresses and basic security headers. Vercel deploys from a GitHub repository, so you first put the site on GitHub and then connect it.

**1. Put the site on GitHub** (one time)

1. Create a free account at https://github.com. Click **New repository**, name it (e.g. `portfolio`), choose **Public** or **Private** (both work with Vercel), and click **Create repository**.
2. On the new repository page, click **uploading an existing file**.
3. Open the `site` folder, select **everything inside it** (`index.html`, `styles.css`, `script.js`, `vercel.json` and the `assets` folder), and drag it onto the page. `index.html` must sit at the top level of the repository, not inside a `site` folder.
4. Click **Commit changes**.

**2. Deploy it on Vercel** (one time)

1. Go to https://vercel.com/signup and choose **Continue with GitHub** (free Hobby plan).
2. Go to https://vercel.com/new. Next to your `portfolio` repository, click **Import**. If it isn't listed, click **Adjust GitHub App Permissions** and give Vercel access to it.
3. On the configure screen:
   - **Framework Preset:** `Other`
   - **Root Directory:** leave it as `./`
   - **Build and Output Settings:** leave everything empty (no build command, no output directory)
4. Click **Deploy**. After about 30 seconds the site is live at an address like `https://portfolio-abc123.vercel.app`.
5. Optional: to get a nicer address, go to your project's **Settings > Domains**. Edit the `.vercel.app` name (e.g. `aiman-hakim.vercel.app`) or add your own domain.

**3. Update the site later**

Change the files on your computer, then upload the changed files to the GitHub repository again ("Add file > Upload files", then **Commit changes**). Vercel notices the commit and redeploys automatically within a minute.

**Alternative: deploy from the command line** (needs Node.js, from https://nodejs.org)

Open a terminal in the `site` folder and run `npx vercel` for a preview address, then `npx vercel --prod` to publish. The first run asks you to log in and answer a few setup questions; accept the defaults.

### Netlify Drop (no GitHub needed, about 2 minutes)

1. Go to https://app.netlify.com/drop and sign up or log in (free).
2. Drag the **`site`** folder from File Explorer onto the page.
3. Netlify uploads it and gives you an address like `https://random-name-123.netlify.app`.
4. Optional: in **Site configuration > General > Site details > Change site name**, pick a nicer name.
5. **To update later:** open the site in Netlify, go to **Deploys**, and drag the `site` folder onto the "drag and drop" area again.

### GitHub Pages

1. Create a free account at https://github.com. Click **New repository**, name it (e.g. `portfolio`), make it **Public**, and click **Create repository**.
2. On the new repository page, click **uploading an existing file**.
3. Open the `site` folder, select **everything inside it** (`index.html`, `styles.css`, `script.js` and the `assets` folder), and drag it onto the page. `index.html` must sit at the top level of the repository, not inside a `site` folder.
4. Click **Commit changes**.
5. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to "Deploy from a branch", **Branch** to `main`, and the folder to `/ (root)`, then **Save**.
6. After a minute or two, the address appears at the top of that page: `https://<your-username>.github.io/portfolio/`.
7. **To update later:** upload the changed files again in the same way ("Add file > Upload files"), then commit.

### Cloudflare Pages (short version)

In the Cloudflare dashboard, go to **Workers & Pages > Create > Pages > Upload assets**. Name the project and drag in the `site` folder. The site will be live at `https://<name>.pages.dev`.

### After deploying: make the share picture work everywhere

Some sites (LinkedIn, WhatsApp, Slack) need a full address for the share picture. In `site\index.html`, change

```html
<meta property="og:image" content="assets/profile.jpg">
```

to your real address, for example

```html
<meta property="og:image" content="https://your-site.vercel.app/assets/profile.jpg">
```

then upload the site again.

## Check the speed (Lighthouse)

- **In Chrome:** open the site (local or deployed), press **F12**, open the **Lighthouse** tab, choose **Desktop** and **Performance**, and click **Analyze page load**. The target is 90 or more.
- **Online, after deploying:** paste the public address into https://pagespeed.web.dev. This sends the address to Google.

## Notes and limitations

- **Fonts:** the only outside request is Google Fonts. If it is blocked, the page falls back to system fonts (Segoe UI and Consolas on Windows).
- **Copy buttons:** if the browser blocks clipboard access, the button selects the text and shows "Press Ctrl+C" instead.
- **Durations:** the "Present" job's duration is calculated in the visitor's browser from today's date.
