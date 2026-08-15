#!/usr/bin/env bash
# ============================================================
# CapiMind - Déploiement sur capimind.com
# ============================================================
# 
# Ce script déploie le site CapiMind mis à jour sur capimind.com
# via GitHub + votre hébergement.
#
# PRÉREQUIS:
#   - Git configuré avec accès au repo GitHub
#   - Node.js/Bun installé
#
# UTILISATION:
#   bash deploy-capimind.sh
#
# ============================================================
set -e

cd "$(dirname "$0")/.."
echo "========================================"
echo "  CapiMind → capimind.com Déploiement"
echo "========================================"
echo ""

# 1. Vérifier que le code est à jour
echo "[1/5] Vérification du code..."
if git diff --quiet && git diff --cached --quiet; then
  echo "  ✓ Pas de changements non-commités"
else
  echo "  ! Changements détectés, commit en cours..."
  git add -A
  git commit -m "Deploy: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "  ✓ Changements commités"
fi

# 2. Construire le site statique
echo ""
echo "[2/5] Construction du site statique..."
rm -rf out .next
DEPLOY_TARGET=custom-domain bun run build:static
echo "  ✓ Site construit dans out/"

# 3. Pousser le code source sur GitHub
echo ""
echo "[3/5] Push du code sur GitHub..."
git push origin main
echo "  ✓ Code poussé sur GitHub"

# 4. Préparer le package de déploiement
echo ""
echo "[4/5] Création du package de déploiement..."
cd out
touch .nojekyll
rm -f ../capimind-deploy.zip
zip -q -r ../capimind-deploy.zip . -x "*.txt"
cd ..
echo "  ✓ Package créé: capimind-deploy.zip ($(du -sh capimind-deploy.zip | cut -f1))"

# 5. Déployer sur GitHub Pages (capimind-web repo)
echo ""
echo "[5/5] Déploiement sur GitHub Pages..."
cd out
TOKEN=$(git config --get-regexp 'remote.origin' 2>/dev/null | grep -o 'https://[^@]*@' | sed 's|https://||;s|@||')
rm -rf .git
git init -q
git config user.email "deploy@capimind.com"
git config user.name "CapiMind Deploy Bot"
git checkout -q -b main
git add -A
git commit -q -m "Deploy: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
git remote add origin "https://${TOKEN}@github.com/mohamedbenkacem95-boop/capimind-web.git"
git push -f -q origin main
cd ..
echo "  ✓ Déployé sur GitHub Pages"

# Trigger Pages build
if [ -n "$TOKEN" ]; then
  curl -s -X POST -H "Authorization: token ${TOKEN}" \
    "https://api.github.com/repos/mohamedbenkacem95-boop/capimind-web/pages/builds" | grep -o '"status":"[^"]*"' | head -1
fi

echo ""
echo "========================================"
echo "  ✅ DÉPLOIEMENT TERMINÉ !"
echo "========================================"
echo ""
echo "  Site live : https://capimind.com"
echo "  GitHub    : https://github.com/mohamedbenkacem95-boop/CapiMind"
echo "  Package   : capimind-deploy.zip"
echo ""
echo "  ⚠️  Les données des formulaires arrivent dans les onglets:"
echo "     - 'Inscriptions' pour les inscriptions aux formations"
echo "     - 'Contacts' pour les messages de contact"
echo ""
echo "  ⚠️  Si vous utilisez Cloudflare/Netlify au lieu de GitHub Pages,"
echo "     uploadez le contenu du dossier out/ sur votre hébergement."
echo ""
