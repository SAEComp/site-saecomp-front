# Script de Inicialização do Frontend
Write-Host "🎨 Iniciando Frontend da Lojinha SAEComp..." -ForegroundColor Green

# Navega para o diretório do frontend
Set-Location "c:\Users\RONALDO\Documents\Saecomp\site-saecomp-front"

# Verifica se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Inicia o servidor
Write-Host "▶️  Iniciando frontend em http://localhost:5173..." -ForegroundColor Cyan
Write-Host ""
npm run dev
