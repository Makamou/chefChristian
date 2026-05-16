# Deploying Chef Christian to Vercel

Three phases: protect your secret key → push to GitHub → connect Vercel.

---

## Phase 1 — Protect your secret (already done ✅)

I created these for you:
- `.gitignore` — keeps `.env` and `node_modules` OUT of GitHub
- `.env.example` — a template (safe to share publicly)
- `vercel.json` — SPA routing config for Vercel

> ⚠️ **Important:** Your real `.env` file (with `VITE_HF_ACCESS_TOKEN=...`) stays on your computer. Never commit it.

---

## Phase 2 — Push to GitHub

Open Terminal and run these from inside your project folder.

```bash
cd "/Users/amkristian/Documents/website cookie/Chef Christian"
```

**First, remove the stub `.git` folder I created while verifying** (it has wrong permissions):

```bash
sudo rm -rf .git
```

(It'll ask for your Mac password.)

### A. If you want to use your existing (old) GitHub repo

```bash
git init
git add .
git status                              # ← verify .env is NOT in the list!
git commit -m "Polish Chef Christian site for production"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main --force         # --force replaces the old version
```

Replace `YOUR-USERNAME/YOUR-REPO` with your actual repo path.

### B. If you'd rather start fresh

1. Go to https://github.com/new
2. Name it `chef-christian`, leave it Public or Private, **don't** add a README or .gitignore (you already have one)
3. Click Create repository
4. Then run:

```bash
git init
git add .
git status                              # ← verify .env is NOT in the list!
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/chef-christian.git
git push -u origin main
```

### Double-check before pushing
Before `git push`, run `git status` — if you see `.env` in the staged files, **STOP**. The `.gitignore` should prevent that, but verify.

---

## Phase 3 — Deploy on Vercel (3 minutes)

1. Go to https://vercel.com/signup and sign in with your **GitHub account** (this auto-connects everything).
2. On your dashboard, click **Add New → Project**.
3. Find your `chef-christian` repo in the list and click **Import**.
4. Vercel will auto-detect Vite. Leave the defaults:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Expand **Environment Variables** and add:
   - Name: `VITE_HF_ACCESS_TOKEN`
   - Value: *(paste your HuggingFace token from your local `.env` file)*
6. Click **Deploy**.

After ~1 minute you'll get a live URL like `chef-christian-xyz.vercel.app`. 🎉

---

## Future updates
Every time you push to GitHub, Vercel auto-deploys:

```bash
git add .
git commit -m "describe your change"
git push
```

---

## Troubleshooting

**"I accidentally committed .env"**
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```
Then **rotate your HuggingFace token** at https://huggingface.co/settings/tokens — assume the old one is compromised.

**Build fails on Vercel with "VITE_HF_ACCESS_TOKEN undefined"**
You forgot to add the env var in step 5. Settings → Environment Variables → add it → Redeploy.

**Site loads but AI doesn't respond**
Open browser DevTools → Console. If you see auth errors, the env var wasn't set or your token expired.
