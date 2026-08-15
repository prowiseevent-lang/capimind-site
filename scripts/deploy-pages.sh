#!/usr/bin/env bash
# ============================================================
# CapiMind - Déploiement sur GitHub Pages
# ============================================================
#
# UTILISATION:
#   GITHUB_TOKEN=ghp_xxxxxxxxxxxx  bash scripts/deploy-pages.sh
#
#   Ou avec un fichier .deploy-token:
#   bash scripts/deploy-pages.sh
#
# ============================================================
set -e

cd "$(dirname "$0")/.."

# ── Récupérer le token ──
TOKEN="${GITHUB_TOKEN:-}"

if [ -z "$TOKEN" ]; then
  TOKEN=$(git config --get-regexp 'remote.origin' 2>/dev/null | grep -o 'https://[^@]*@' | sed 's|https://||;s|@||')
fi

if [ -z "$TOKEN" ] && [ -f ".deploy-token" ]; then
  TOKEN=$(cat .deploy-token | tr -d '[:space:]')
fi

if [ -z "$TOKEN" ]; then
  echo "❌ ERREUR: Aucun token GitHub trouvé !"
  echo "  Utilisation: GITHUB_TOKEN=ghp_xxxx  bash scripts/deploy-pages.sh"
  exit 1
fi

PAGES_REPO="mohamedbenkacem95-boop/capimind-web"

echo "=== CapiMind → GitHub Pages deploy ==="
echo "  Token: ${TOKEN:0:4}...${TOKEN: -4} (masqué)"
echo ""

# 1. Build static site
echo "[1/4] Building static site..."
rm -rf out .next
mv src/app/api .api-backup 2>/dev/null || true
DEPLOY_TARGET=github-pages bun run build:static
mv .api-backup src/app/api 2>/dev/null || true
echo "  ✓ Build complete"

# 2. Prepare git repo in out/
echo "[2/4] Preparing deployment..."
cd out
touch .nojekyll
rm -rf .git
git init -q
git config user.email "deploy@capimind.com"
git config user.name "CapiMind Deploy Bot"
git checkout -q -b main
git add -A
git commit -q -m "Deploy: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
git remote add origin "https://${TOKEN}@github.com/${PAGES_REPO}.git"
echo "  ✓ Prepared"

# 3. Push to public repo
echo "[3/4] Pushing to capimind-web repo..."
git push -f -q origin main 2>&1 | sed "s/${TOKEN}/***TOKEN***/g"
cd ..
echo "  ✓ Pushed"

# 4. Trigger GitHub Pages build
echo "[4/4] Triggering Pages build..."
BUILD_RESULT=$(curl -s -X POST -H "Authorization: token ${TOKEN}" \
  "https://api.github.com/repos/${PAGES_REPO}/pages/builds" 2>&1)
BUILD_STATUS=$(echo "$BUILD_RESULT" | grep -o '"status":"[^"]*"' | head -1)
if [ -n "$BUILD_STATUS" ]; then
  echo "  ✓ Build Pages déclenché: $BUILD_STATUS"
else
  echo "  ⚠️  Vérifiez manuellement le build sur GitHub"
fi

echo ""
echo "=== Deploy complete! ==="
echo "Live URL: https://capimind.com"
echo "(Pages build takes ~2 min to complete)"
