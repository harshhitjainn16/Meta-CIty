# MetaCity Wallet Setup Helper Script
# This script helps you set up your wallet connection

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MetaCity Wallet Setup Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path .env) {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "STEP 1: Get Your WalletConnect Project ID" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://cloud.walletconnect.com" -ForegroundColor White
Write-Host "2. Sign up or log in" -ForegroundColor White
Write-Host "3. Click 'Create New Project'" -ForegroundColor White
Write-Host "4. Fill in:" -ForegroundColor White
Write-Host "   - Project Name: MetaCity DAO" -ForegroundColor Gray
Write-Host "   - Homepage URL: http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Allowed Domains: localhost" -ForegroundColor Gray
Write-Host "5. Copy your Project ID" -ForegroundColor White
Write-Host ""
Write-Host "The Project ID looks like: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" -ForegroundColor Gray
Write-Host ""

$projectId = Read-Host "Paste your WalletConnect Project ID here"

# Validate Project ID format (basic check)
if ($projectId -match "^[a-zA-Z0-9]{20,}$") {
    Write-Host ""
    Write-Host "✓ Valid Project ID format detected" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠ Warning: Project ID format looks unusual" -ForegroundColor Yellow
    Write-Host "Make sure you copied the entire Project ID" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

# Create .env file
Write-Host ""
Write-Host "STEP 2: Creating .env file..." -ForegroundColor Yellow
Write-Host ""

$envContent = @"
# WalletConnect Configuration (Required for wallet connection in UI)
# Get your Project ID from: https://cloud.walletconnect.com
NEXT_PUBLIC_PROJECT_ID=$projectId

# Deployment Wallet (Optional - only if you want to deploy contracts)
# IMPORTANT: For security, it's better to use the interactive deployment
# The deployment script will ask for your private key when needed
# Only add this if you want to use automatic deployment
# PRIVATE_KEY=your_private_key_without_0x_prefix

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=10143
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz

# Contract Addresses (Will be populated after deployment)
# These will be filled in after you deploy your contracts
# NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=
# NEXT_PUBLIC_BUILDING_NFT_ADDRESS=
# NEXT_PUBLIC_CITY_DAO_ADDRESS=
# NEXT_PUBLIC_REWARDS_ADDRESS=
"@

try {
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "✓ .env file created successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Error creating .env file: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start the development server: npm run dev" -ForegroundColor White
Write-Host "2. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "3. Click 'Connect Wallet' button" -ForegroundColor White
Write-Host "4. Select your wallet (MetaMask, WalletConnect, etc.)" -ForegroundColor White
Write-Host ""
Write-Host "Your Project ID has been saved to .env file" -ForegroundColor Gray
Write-Host ""

