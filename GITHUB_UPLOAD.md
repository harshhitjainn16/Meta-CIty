# 📤 Upload MetaCity to GitHub

## Quick Start (Easiest Method)

1. **Double-click `upload-github.bat`** and follow the prompts
2. Or follow the manual steps below

---

## 📋 Prerequisites

- ✅ GitHub account (create at https://github.com/signup)
- ✅ Git installed (check with `git --version`)
- ✅ All your code saved locally

---

## 🚀 Method 1: Automated Upload (Recommended)

### Step 1: Run the Upload Script

```powershell
.\upload-github.bat
```

The script will:

1. Initialize git repository
2. Add all files (excluding .env and sensitive data)
3. Create initial commit
4. Guide you to create GitHub repository
5. Push your code

---

## 🔧 Method 2: Manual Upload

### Step 1: Initialize Git Repository

```powershell
git init
git add .
git commit -m "Initial commit: MetaCity DAO - Blockchain City Builder"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `metacity-dao` (or your choice)
3. Description: `🏙️ MetaCity - A DAO-governed blockchain city builder game on Monad testnet`
4. Select **Public** (for hackathon visibility)
5. **DO NOT** initialize with README (you already have one)
6. Click **Create repository**

### Step 3: Connect and Push

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/metacity-dao.git
git branch -M main
git push -u origin main
```

### Step 4: Enter Credentials

When prompted:

- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password!)

#### How to Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Tokens (classic)"** → **"Generate new token"** → **"Generate new token (classic)"**
3. Note: `MetaCity Upload`
4. Expiration: `30 days` (or your preference)
5. Scopes: Check ✅ **repo** (all sub-options)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this as your password when pushing

---

## 🔐 Security Checklist

Before uploading, verify these files are **NOT** uploaded:

- ❌ `.env` (contains your RPC URL and keys)
- ❌ `node_modules/` (dependencies)
- ❌ `cache/` and `artifacts/` (Hardhat build files)
- ❌ `.next/` (Next.js build files)

Your `.gitignore` file already protects these!

### Verify What Will Be Uploaded:

```powershell
git status
```

---

## 📝 Recommended Commit Messages

For future updates:

```powershell
# After fixing bugs
git add .
git commit -m "fix: resolve staking reward calculation bug"
git push

# After adding features
git add .
git commit -m "feat: add new building types"
git push

# After updating docs
git add .
git commit -m "docs: update deployment guide"
git push
```

---

## 🎨 Make Your Repo Stand Out (For Hackathon)

### 1. Add Topics/Tags

On your GitHub repo page:

- Click ⚙️ next to "About"
- Add topics: `blockchain`, `dao`, `web3`, `monad`, `nft`, `defi`, `hackathon`, `solidity`, `nextjs`, `threejs`

### 2. Enable GitHub Pages (Optional)

If you want to show screenshots:

- Settings → Pages → Source: `main` branch → `/docs` folder
- Add screenshots to `docs/` folder

### 3. Add a Demo Video

- Record a quick demo (use OBS Studio or Loom)
- Upload to YouTube
- Add link to README.md

### 4. Pin Repository

- Go to your GitHub profile
- Click "Customize your pins"
- Select this repository

---

## 🏆 Hackathon Submission Tips

### What Judges Look For:

1. ✅ **Clean README** - You have this!
2. ✅ **Live Demo** - Deploy to Vercel (see below)
3. ✅ **Code Quality** - Well-commented, organized
4. ✅ **Innovation** - Unique DAO mechanics
5. ✅ **Documentation** - Multiple MD files explaining everything

### Quick Vercel Deployment:

```powershell
npm install -g vercel
vercel login
vercel
```

Follow prompts and your site goes live!

---

## ❓ Troubleshooting

### Problem: "Permission denied"

**Solution**: Use Personal Access Token instead of password

### Problem: "Large files detected"

**Solution**:

```powershell
# Remove large files from git history
git rm --cached node_modules -r
git commit -m "Remove node_modules"
```

### Problem: "Repository not found"

**Solution**: Double-check the repository URL and your username

### Problem: "Already exists"

**Solution**:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/metacity-dao.git
```

---

## 🔄 Updating Your Repo After Changes

```powershell
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Update: description of changes"

# Push to GitHub
git push
```

---

## 📞 Need Help?

- GitHub Docs: https://docs.github.com/en/get-started
- Create Token: https://github.com/settings/tokens
- Git Basics: https://git-scm.com/doc

---

## ✨ Next Steps After Upload

1. ✅ Share your GitHub link with hackathon organizers
2. ✅ Add collaborators if working in a team
3. ✅ Enable Issues for feedback
4. ✅ Create a Release tag (v1.0.0) for submission
5. ✅ Tweet about your project with #Web3 #Monad

**Good luck with your hackathon! 🚀**
