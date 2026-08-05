# Creative Studio — Agency PM

Project management for a marketing services agency: activations, events,
vendors, manpower, budgets, checklists, kanban tasks, and client billing.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `creative-studio`).
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Creative Studio initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The included workflow builds and deploys automatically on every push.
   Your site goes live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

## Run locally

```bash
npm install
npm run dev
```

## How saving works

- Inside a Claude artifact: data is stored in Claude's shared artifact storage
  (whole team shares one live board).
- On GitHub Pages: data is saved in each browser's localStorage
  ("Saved on this device"). Each person has their own copy of the board.
  For a true shared online board, connect a backend such as Supabase or Firebase.
