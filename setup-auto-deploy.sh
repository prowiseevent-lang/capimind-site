#!/usr/bin/env bash
# ============================================================
# CapiMind - Setup Auto-Deploy (ONE-TIME)
# ============================================================
# 
# Ce script configure TOUT le déploiement automatique en une seule commande.
# À exécuter sur VOTRE machine (où vous avez accès GitHub).
#
# PRÉREQUIS:
#   - Git installé et configuré
#   - Un GitHub Personal Access Token avec permissions: repo, workflow
#     → https://github.com/settings/tokens/new
#     → Cochez: repo (full), workflow
#
# UTILISATION:
#   bash setup-auto-deploy.sh ghp_VOTRE_TOKEN_ICI
#
# ============================================================
set -e

TOKEN="${1:-}"
if [ -z "$TOKEN" ]; then
  echo ""
  echo "❌ Usage: bash setup-auto-deploy.sh <GITHUB_TOKEN>"
  echo ""
  echo "   Créez un token: https://github.com/settings/tokens/new"
  echo "   Permissions: repo (full), workflow"
  echo ""
  exit 1
fi

REPO="mohamedbenkacem95-boop/CapiMind"
PAGES_REPO="mohamedbenkacem95-boop/capimind-web"
API="https://api.github.com"

echo ""
echo "========================================"
echo "  CapiMind - Setup Auto-Deploy"
echo "========================================"
echo "  Token: ${TOKEN:0:4}...${TOKEN: -4}"
echo ""

# ── 0. Vérifier le token ──
echo "[0/6] Vérification du token GitHub..."
RESP=$(curl -s -w "\n%{http_code}" -H "Authorization: token ${TOKEN}" "${API}/user")
HTTP_CODE=$(echo "$RESP" | tail -1)
if [ "$HTTP_CODE" != "200" ]; then
  echo "  ❌ Token invalide (HTTP $HTTP_CODE)"
  exit 1
fi
GITHUB_USER=$(echo "$RESP" | head -n -1 | grep -o '"login":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "  ✓ Connecté comme: $GITHUB_USER"

# ── 1. Cloner le repo (si pas déjà cloné) ──
echo ""
echo "[1/6] Récupération du code source..."
if [ -d "CapiMind" ]; then
  cd CapiMind
  git pull -q origin main 2>/dev/null || true
  echo "  ✓ Repo existant mis à jour"
else
  git clone -q "https://${TOKEN}@github.com/${REPO}.git" CapiMind 2>&1 | sed "s/${TOKEN}/***TOKEN***/g"
  cd CapiMind
  echo "  ✓ Repo cloné"
fi

# ── 2. Ajouter les fichiers workflow ──
echo ""
echo "[2/6] Ajout des workflows GitHub Actions..."
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'WORKFLOW_EOF'
name: Deploy CapiMind to capimind.com

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout source repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile 2>/dev/null || bun install

      - name: Build static site
        run: |
          rm -rf out .next
          DEPLOY_TARGET=custom-domain bun run build:static

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          personal_token: ${{ secrets.DEPLOY_TOKEN }}
          external_repository: mohamedbenkacem95-boop/capimind-web
          publish_branch: main
          publish_dir: ./out
          force_orphan: true
          commit_message: "Deploy: ${{ github.event.head_commit.message }}"
          user_name: "CapiMind Deploy Bot"
          user_email: "deploy@capimind.com"

      - name: Deployment info
        run: |
          echo "✅ Site déployé sur https://capimind.com"
WORKFLOW_EOF

echo "  ✓ deploy.yml créé"

# ── 3. Commit et push ──
echo ""
echo "[3/6] Push du code sur GitHub..."
git add -A
if git diff --cached --quiet; then
  echo "  ✓ Pas de nouveaux changements"
else
  git commit -m "feat: GitHub Actions auto-deploy workflow"
  git push "https://${TOKEN}@github.com/${REPO}.git" main 2>&1 | sed "s/${TOKEN}/***TOKEN***/g"
  echo "  ✓ Code poussé sur GitHub"
fi

# ── 4. Configurer le secret DEPLOY_TOKEN ──
echo ""
echo "[4/6] Configuration du secret DEPLOY_TOKEN..."

# Chiffrer le secret avec la clé publique du repo
# On utilise l'API GitHub pour obtenir la clé publique du repo
KEYS_RESP=$(curl -s -H "Authorization: token ${TOKEN}" "${API}/repos/${REPO}/actions/secrets/public-key")
KEY_ID=$(echo "$KEYS_RESP" | grep -o '"key_id":"[^"]*"' | head -1 | cut -d'"' -f4)
PUBLIC_KEY=$(echo "$KEYS_RESP" | grep -o '"key":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$KEY_ID" ] || [ -z "$PUBLIC_KEY" ]; then
  echo "  ⚠️  Impossible de configurer le secret automatiquement"
  echo "  → Configurez-le manuellement:"
  echo "    GitHub → ${REPO} → Settings → Secrets → New secret"
  echo "    Name: DEPLOY_TOKEN  Value: ${TOKEN}"
else
  # Encoder le secret avec libsodium (si disponible) ou base64 fallback
  if command -v python3 &>/dev/null; then
    # Utiliser Python pour chiffrer avec pynacl si disponible
    ENCRYPTED=$(python3 -c "
import base64, json, os, sys
try:
    from nacl import public
    pk = public.PublicKey(base64.b64decode('${PUBLIC_KEY}'))
    sealed = public.SealedBox(pk).encrypt('${TOKEN}'.encode())
    print(base64.b64encode(sealed).decode())
except ImportError:
    print('NEED_MANUAL')
" 2>/dev/null)
    
    if [ "$ENCRYPTED" = "NEED_MANUAL" ] || [ -z "$ENCRYPTED" ]; then
      echo "  ⚠️  libsodium non disponible, configuration via API alternative..."
      # Fallback: utiliser gh CLI si disponible
      if command -v gh &>/dev/null; then
        echo "${TOKEN}" | gh secret set DEPLOY_TOKEN --repo "${REPO}" 2>/dev/null
        echo "  ✓ Secret DEPLOY_TOKEN configuré (via gh CLI)"
      else
        echo "  ⚠️  Configuration manuelle requise:"
        echo "    Allez sur: https://github.com/${REPO}/settings/secrets/actions"
        echo "    Cliquez: New repository secret"
        echo "    Name: DEPLOY_TOKEN"
        echo "    Value: <votre token>"
      fi
    else
      # Push le secret chiffré
      SECRET_RESP=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Authorization: token ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"encrypted_value\":\"${ENCRYPTED}\",\"key_id\":\"${KEY_ID}\"}" \
        "${API}/repos/${REPO}/actions/secrets/DEPLOY_TOKEN")
      SECRET_HTTP=$(echo "$SECRET_RESP" | tail -1)
      if [ "$SECRET_HTTP" = "204" ] || [ "$SECRET_HTTP" = "201" ]; then
        echo "  ✓ Secret DEPLOY_TOKEN configuré"
      else
        echo "  ⚠️  Erreur ($SECRET_HTTP), configurez manuellement:"
        echo "    https://github.com/${REPO}/settings/secrets/actions"
      fi
    fi
  else
    echo "  ⚠️  Python3 non disponible, configurez manuellement:"
    echo "    https://github.com/${REPO}/settings/secrets/actions"
    echo "    Name: DEPLOY_TOKEN  Value: <votre token>"
  fi
fi

# ── 5. Vérifier que le workflow est visible ──
echo ""
echo "[5/6] Vérification du workflow..."
sleep 3
WF_RESP=$(curl -s -H "Authorization: token ${TOKEN}" "${API}/repos/${REPO}/actions/workflows" 2>&1)
WF_COUNT=$(echo "$WF_RESP" | grep -o '"id"' | wc -l)
echo "  ✓ $WF_COUNT workflow(s) détecté(s) sur GitHub"

# ── 6. Déclencher le premier déploiement ──
echo ""
echo "[6/6] Déclenchement du premier déploiement..."
DISPATCH_RESP=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"ref":"main"}' \
  "${API}/repos/${REPO}/actions/workflows/deploy.yml/dispatches" 2>&1)
DISPATCH_HTTP=$(echo "$DISPATCH_RESP" | tail -1)
if [ "$DISPATCH_HTTP" = "204" ]; then
  echo "  ✓ Déploiement déclenché !"
else
  echo "  ⚠️  Déclenchement: HTTP $DISPATCH_HTTP"
  echo "  → Le workflow se lancera au prochain push sur main"
fi

echo ""
echo "========================================"
echo "  ✅ SETUP TERMINÉ !"
echo "========================================"
echo ""
echo "  🌐 Site: https://capimind.com"
echo "  📦 Repo: https://github.com/${REPO}"
echo "  🔄 Workflow: https://github.com/${REPO}/actions"
echo "  👤 Compte: $GITHUB_USER"
echo ""
echo "  À partir de maintenant, chaque push sur main"
echo "  déclenchera automatiquement le déploiement !"
echo ""
