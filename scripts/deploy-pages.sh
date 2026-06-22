#!/usr/bin/env bash
# Deploy CapiMind static site to GitHub Pages (public repo: capimind-web)
# Usage: bash scripts/deploy-pages.sh
set -e

cd "$(dirname "$0")/.."
echo "=== CapiMind → GitHub Pages deploy ==="

# 1. Build static site
echo "[1/4] Building static site..."
rm -rf out .next
mv src/app/api .api-backup
DEPLOY_TARGET=github-pages bun run build:static
mv .api-backup src/app/api
echo "  ✓ Build complete"

# 2. Prepare git repo in out/
echo "[2/4] Preparing deployment..."
cd out
touch .nojekyll
TOKEN=$(cd /home/z/my-project && git config --get-regexp 'remote.origin' 2>/dev/null | grep -o 'https://[^@]*@' | sed 's|https://||;s|@||')
rm -rf .git
git init -q
git config user.email "deploy@capimind.com"
git config user.name "CapiMind Deploy Bot"
git checkout -q -b main
git add -A
git commit -q -m "Deploy: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
git remote add origin "https://${TOKEN}@github.com/mohamedbenkacem95-boop/capimind-web.git"
echo "  ✓ Prepared"

# 3. Push to public repo
echo "[3/4] Pushing to capimind-web repo..."
git push -f -q origin main
echo "  ✓ Pushed"

# 4. Trigger GitHub Pages build
echo "[4/4] Triggering Pages build..."
curl -s -X POST -H "Authorization: token ${TOKEN}" "https://api.github.com/repos/mohamedbenkacem95-boop/capimind-web/pages/builds" | grep -o '"status":"[^"]*"' | head -1
echo ""
echo "=== Deploy complete! ==="
echo "Live URL: https://mohamedbenkacem95-boop.github.io/capimind-web/"
echo "(Pages build takes ~2 min to complete)"
