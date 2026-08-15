#!/usr/bin/env bash
# ============================================================
# CapiMind - Déploiement sur capimind.com
# ============================================================
# 
# Ce script déploie le site CapiMind mis à jour sur capimind.com
# via GitHub Pages en utilisant un Personal Access Token (PAT).
#
# PRÉREQUIS:
#   - Un GitHub Personal Access Token (PAT) avec les permissions:
#       * repo (full control of private repositories)
#       * workflow (update GitHub Actions workflows)
#   - Node.js/Bun installé
#
# UTILISATION:
#   GITHUB_TOKEN=ghp_xxxxxxxxxxxx  bash deploy-capimind.sh
#
#   Ou exportez le token d'abord:
#   export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
#   bash deploy-capimind.sh
#
# CRÉER UN TOKEN:
#   1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
#   2. "Generate new token (classic)"
#   3. Cochez: repo, workflow
#   4. Copiez le token et utilisez-le ci-dessus
#
# ============================================================
set -e

cd "$(dirname "$0")/.."

# ── Vérifier le token ──
TOKEN="${GITHUB_TOKEN:-}"

# Fallback: essayer de lire le token depuis git remote URL
if [ -z "$TOKEN" ]; then
  TOKEN=$(git config --get-regexp 'remote.origin' 2>/dev/null | grep -o 'https://[^@]*@' | sed 's|https://||;s|@||')
fi

# Fallback: essayer de lire depuis un fichier .deploy-token
if [ -z "$TOKEN" ] && [ -f ".deploy-token" ]; then
  TOKEN=$(cat .deploy-token | tr -d '[:space:]')
fi

if [ -z "$TOKEN" ]; then
  echo "❌ ERREUR: Aucun token GitHub trouvé !"
  echo ""
  echo "  Utilisation:"
  echo "    GITHUB_TOKEN=ghp_xxxx  bash deploy-capimind.sh"
  echo ""
  echo "  Ou créez un fichier .deploy-token contenant votre token."
  echo ""
  echo "  Créer un token:"
  echo "    GitHub → Settings → Developer settings → Personal access tokens"
  exit 1
fi

echo "========================================"
echo "  CapiMind → capimind.com Déploiement"
echo "========================================"
echo ""
echo "  Token: ${TOKEN:0:4}...${TOKEN: -4} (masqué)"
echo ""

# ── Vérifier le token est valide ──
echo "[0/5] Vérification du token GitHub..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token ${TOKEN}" "https://api.github.com/user")
if [ "$HTTP_CODE" != "200" ]; then
  echo "  ❌ Token invalide (HTTP $HTTP_CODE). Vérifiez votre GITHUB_TOKEN."
  exit 1
fi
GITHUB_USER=$(curl -s -H "Authorization: token ${TOKEN}" "https://api.github.com/user" | grep -o '"login":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "  ✓ Token valide — connecté comme: $GITHUB_USER"

# 1. Vérifier que le code est à jour
echo ""
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

# 3. Pousser le code source sur GitHub (avec token)
echo ""
echo "[3/5] Push du code sur GitHub..."
# Configurer le remote avec le token pour le push
SOURCE_REPO="mohamedbenkacem95-boop/CapiMind"
git push "https://${TOKEN}@github.com/${SOURCE_REPO}.git" main 2>&1 | sed "s/${TOKEN}/***TOKEN***/g"
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
PAGES_REPO="mohamedbenkacem95-boop/capimind-web"
cd out
rm -rf .git
git init -q
git config user.email "deploy@capimind.com"
git config user.name "CapiMind Deploy Bot"
git checkout -q -b main
git add -A
git commit -q -m "Deploy: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
git remote add origin "https://${TOKEN}@github.com/${PAGES_REPO}.git"
git push -f -q origin main 2>&1 | sed "s/${TOKEN}/***TOKEN***/g"
cd ..
echo "  ✓ Déployé sur GitHub Pages"

# Trigger Pages build
echo "  Déclenchement du build Pages..."
BUILD_RESULT=$(curl -s -X POST -H "Authorization: token ${TOKEN}" \
  "https://api.github.com/repos/${PAGES_REPO}/pages/builds" 2>&1)
BUILD_STATUS=$(echo "$BUILD_RESULT" | grep -o '"status":"[^"]*"' | head -1)
if [ -n "$BUILD_STATUS" ]; then
  echo "  ✓ Build Pages déclenché: $BUILD_STATUS"
else
  echo "  ⚠️  Build Pages: vérifiez manuellement sur GitHub"
fi

echo ""
echo "========================================"
echo "  ✅ DÉPLOIEMENT TERMINÉ !"
echo "========================================"
echo ""
echo "  Site live : https://capimind.com"
echo "  GitHub    : https://github.com/${SOURCE_REPO}"
echo "  Package   : capimind-deploy.zip"
echo "  Compte    : $GITHUB_USER"
echo ""
echo "  📋 Les données des formulaires arrivent dans les onglets:"
echo "     - 'Inscriptions' pour les inscriptions aux formations"
echo "     - 'Contacts' pour les messages de contact"
echo ""
echo "  💡 Astuce: pour déployer sans re-saisir le token,"
echo "     créez un fichier .deploy-token avec votre token dedans."
echo ""
