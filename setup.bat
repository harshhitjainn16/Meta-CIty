@echo off
echo ========================================
echo  MetaCity DAO - Quick Setup
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
node --version
echo.

echo [2/5] Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/5] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created!
    echo IMPORTANT: Edit .env and add your WalletConnect Project ID
    echo Get one free at: https://cloud.walletconnect.com
) else (
    echo .env file already exists, skipping...
)
echo.

echo [4/5] Compiling smart contracts...
call npm run compile
if %errorlevel% neq 0 (
    echo WARNING: Contract compilation failed
    echo You can fix this later and run: npm run compile
) else (
    echo Contracts compiled successfully!
)
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo 1. Edit .env file and add your Project ID
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
echo For deployment to testnet:
echo 1. Get test MATIC from https://faucet.polygon.technology
echo 2. Add your private key to .env
echo 3. Run: npm run deploy
echo.
echo ========================================
echo  Need Help?
echo ========================================
echo - Read QUICKSTART.md
echo - Read README.md
echo - Read DEPLOYMENT.md
echo ========================================
echo.
pause
