# Alex Dashboard - Quick Start

## ⚡ 30-Second Setup

```bash
cd /data/.openclaw/workspace/alex-dashboard

# Install (already done - 270 packages)
npm install

# Run locally
npm run dev
# → Open http://localhost:3000
```

## 🚀 Deploy to Vercel (5 minutes)

```bash
# 1. Add GitHub remote
git remote add origin https://github.com/YOU/alex-dashboard.git
git push -u origin main

# 2. Go to https://vercel.com/new
# 3. Import GitHub repo
# 4. Click "Deploy" (auto-configured)
```

**Live at**: `https://alex-dashboard-psi.vercel.app/`

## 📁 Project Structure

```
src/
  app/           ← Pages & routes
  components/    ← React components  
  lib/          ← Utilities (ready)
  styles/       ← CSS (ready)
```

## 🎨 Features

- ✅ Dark mode (toggle button)
- ✅ 3 pages (Dashboard, Log, Docs)
- ✅ 4 API endpoints (stub)
- ✅ Design system (OKLCH colors)
- ✅ Responsive layout
- ✅ TypeScript strict mode

## 🔑 Environment Variables

Copy `.env.local.example` → `.env.local`:

```bash
NEXT_PUBLIC_OPENCLAW_API_URL=http://localhost:8000
OPENCLAW_API_TOKEN=your-token
ASANA_PAT=your-pat
```

## 📖 Routes

| Route | Status |
|-------|--------|
| `/` | Dashboard |
| `/log` | Activity Log |
| `/docs` | Documentation |
| `/api/alex/*` | API endpoints |

## 🛠 Common Commands

```bash
# Dev server (hot reload)
npm run dev

# Build production
npm run build

# Type check
npx tsc --noEmit

# Clean build
rm -rf .next && npm run build
```

## ✅ Verification Checklist

After deployment:
- [ ] Home page loads
- [ ] Navigation tabs work
- [ ] Dark mode toggles
- [ ] All routes accessible
- [ ] API endpoints respond

## 🔗 Links

- **GitHub**: [your-repo-url]
- **Vercel**: https://alex-dashboard-psi.vercel.app/
- **Docs**: See `DEPLOYMENT.md` and `README_PHASE1.md`

## 📝 Next Steps

1. Connect OpenClaw API (see Phase 2 plan)
2. Add real data to dashboard cards
3. Implement activity log polling
4. Build component library

---

**Need help?** Check `DEPLOYMENT.md` for detailed deployment instructions.

**Ready?** `npm run dev` + `http://localhost:3000` 🎉
