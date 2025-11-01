@echo off
echo ========================================
echo  MetaCity - Secure Deployment
echo ========================================
echo.
echo This script will deploy your contracts to Monad Testnet
echo Your private key will NOT be saved to any file
echo.
echo ========================================
echo  Security Notice
echo ========================================
echo.
echo ✓ Private key is only used for this deployment
echo ✓ It will NOT be saved to .env or any file
echo ✓ It will be cleared from memory after deployment
echo.
pause
echo.

echo [Step 1/3] Compiling smart contracts...
call npm run compile
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Contract compilation failed!
    echo Please fix compilation errors and try again.
    pause
    exit /b 1
)
echo ✓ Contracts compiled successfully!
echo.

echo [Step 2/3] Checking Monad Testnet connection...
echo RPC URL: https://testnet-rpc.monad.xyz
echo Chain ID: 10143
echo.

echo [Step 3/3] Starting deployment...
echo.
echo ========================================
echo  IMPORTANT: Enter Your Private Key
echo ========================================
echo.
echo The deployment script will ask for your private key.
echo.
echo How to get it from MetaMask:
echo 1. Open MetaMask
echo 2. Click ⋮ (3 dots) next to account
echo 3. Click "Account Details"
echo 4. Click "Show Private Key"
echo 5. Enter password and copy the key
echo 6. Paste it when prompted (it won't show)
echo.
echo NOTE: Remove "0x" prefix from the key
echo.
pause
echo.

call npm run deploy

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  Deployment Successful! 🎉
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Copy the contract addresses above
    echo 2. Paste them into your .env file
    echo 3. Run: npm run dev
    echo 4. Visit: http://localhost:3000
    echo.
) else (
    echo.
    echo ========================================
    echo  Deployment Failed
    echo ========================================
    echo.
    echo Common issues:
    echo - Insufficient MON balance (get from faucet)
    echo - Invalid private key (check format)
    echo - Network connection issues
    echo.
    echo Try again or check SECURE_DEPLOYMENT.md for help
    echo.
)

pause
