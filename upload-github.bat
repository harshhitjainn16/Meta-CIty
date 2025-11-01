@echo off
cls
echo ========================================
echo  MetaCity - GitHub Upload Assistant
echo ========================================
echo.
echo This script will help you upload your project to GitHub
echo.
pause
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✓ Git is installed
echo.

REM Check if already a git repository
if exist ".git" (
    echo ✓ Git repository already initialized
    echo.
) else (
    echo [Step 1/5] Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo ERROR: Failed to initialize git repository
        pause
        exit /b 1
    )
    echo ✓ Git repository initialized
    echo.
)

echo [Step 2/5] Checking files to upload...
echo.
echo Files that will be uploaded:
echo ✓ Smart contracts (contracts/)
echo ✓ Frontend code (pages/, components/)
echo ✓ Configuration files
echo ✓ Documentation (*.md files)
echo.
echo Files that will NOT be uploaded (protected):
echo ✗ .env (your private keys/RPC URLs)
echo ✗ node_modules/ (dependencies)
echo ✗ .next/ (build files)
echo.
pause
echo.

echo [Step 3/5] Adding files to git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

echo [Step 4/5] Creating commit...
git commit -m "Initial commit: MetaCity DAO - Blockchain City Builder on Monad"
if %errorlevel% neq 0 (
    echo.
    echo NOTE: If you see "nothing to commit", your files are already committed.
    echo This is OK! Continue to push to GitHub.
    echo.
)
echo ✓ Commit created
echo.

echo ========================================
echo  IMPORTANT: Create GitHub Repository
echo ========================================
echo.
echo Please follow these steps:
echo.
echo 1. Open your browser and go to:
echo    https://github.com/new
echo.
echo 2. Fill in the details:
echo    - Repository name: metacity-dao
echo    - Description: MetaCity - DAO-governed blockchain city builder on Monad testnet
echo    - Visibility: Public (recommended for hackathon)
echo    - DO NOT check "Add README" or ".gitignore"
echo.
echo 3. Click "Create repository"
echo.
echo 4. Copy the repository URL (should look like):
echo    https://github.com/YOUR_USERNAME/metacity-dao.git
echo.
pause
echo.

echo [Step 5/5] Enter your GitHub repository URL:
echo.
set /p REPO_URL="Paste your repository URL here: "
echo.

echo Connecting to GitHub repository...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
if %errorlevel% neq 0 (
    echo ERROR: Failed to add remote repository
    echo Please check the URL and try again
    pause
    exit /b 1
)
echo ✓ Repository connected
echo.

echo Setting default branch to 'main'...
git branch -M main
echo.

echo ========================================
echo  GitHub Authentication Required
echo ========================================
echo.
echo When prompted for credentials:
echo.
echo Username: Your GitHub username
echo Password: Use a Personal Access Token (NOT your password!)
echo.
echo How to create a token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Give it a name: "MetaCity Upload"
echo 4. Select scope: "repo" (check all boxes under repo)
echo 5. Click "Generate token"
echo 6. COPY the token and use it as your password
echo.
pause
echo.

echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  SUCCESS! 🎉
    echo ========================================
    echo.
    echo Your MetaCity project is now on GitHub!
    echo.
    echo Repository URL:
    echo %REPO_URL%
    echo.
    echo Next steps:
    echo 1. Visit your repository on GitHub
    echo 2. Add topics/tags: blockchain, dao, web3, monad
    echo 3. Share the link with hackathon organizers
    echo 4. Consider deploying to Vercel for live demo
    echo.
    echo Good luck with your hackathon! 🏆
    echo.
) else (
    echo.
    echo ========================================
    echo  Upload Failed
    echo ========================================
    echo.
    echo Common issues:
    echo - Wrong Personal Access Token
    echo - Incorrect repository URL
    echo - Network connection problems
    echo.
    echo Solutions:
    echo 1. Verify your token has 'repo' permissions
    echo 2. Double-check the repository URL
    echo 3. Try again with: git push -u origin main
    echo.
    echo For detailed help, see GITHUB_UPLOAD.md
    echo.
)

pause
