#!/usr/bin/env bash
# ============================================================
# CapiMind - Setup Auto-Deploy (SIMPLE - via gh CLI)
# ============================================================
# 
# Version simplifiée utilisant le GitHub CLI (gh).
# Si vous avez 'gh' installé, c'est la méthode la plus simple !
#
# UTILISATION:
#   bash setup-deploy-gh.sh
#
# PRÉREQUIS:
#   - gh CLI installé: https://cli.github.com
#   - gh auth login (déjà fait)
#
# ============================================================
set -e

REPO="mohamedbenkacem95-boop/CapiMind"

echo ""
echo "========================================"
echo "  CapiMind - Setup Auto-Deploy (gh CLI)"
echo "========================================"

# Vérifier gh CLI
if ! command -v gh &>/dev/null; then
  echo "❌ gh CLI non installé."
  echo "   Installez: https://cli.github.com"
  echo "   Puis: gh auth login"
  exit 1
fi

# Vérifier auth
if ! gh auth status &>/dev/null; then
  echo "❌ gh non authentifié. Lancez: gh auth login"
  exit 1
fi

GITHUB_USER=$(gh api user --jq .login 2>/dev/null)
echo "  ✓ Connecté: $GITHUB_USER"
echo ""

# ── 1. Cloner le repo ──
echo "[1/4] Clonage du repo..."
if [ -d "CapiMind" ]; then
  cd CapiMind && git pull -q origin main 2>/dev/null || true
  echo "  ✓ Repo à jour"
else
  gh repo clone "$REPO" CapiMind
  cd CapiMind
  echo "  ✓ Repo cloné"
fi

# ── 2. Ajouter le workflow ──
echo ""
echo "[2/4] Ajout du workflow..."
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

echo "  ✓ Workflow créé"

# ── 3. Commit, push, et configurer le secret ──
echo ""
echo "[3/4] Push et configuration du secret..."
git add -A
if git diff --cached --quiet; then
  echo "  ✓ Pas de nouveaux changements"
else
  git commit -m "feat: GitHub Actions auto-deploy workflow"
  git push origin main
  echo "  ✓ Code poussé"
fi

# Configurer DEPLOY_TOKEN = le token courant
GH_TOKEN=$(gh auth token 2>/dev/null)
if [ -n "$GH_TOKEN" ]; then
  echo "$GH_TOKEN" | gh secret set DEPLOY_TOKEN --repo "$REPO"
  echo "  ✓ Secret DEPLOY_TOKEN configuré"
else
  echo "  ⚠️  Configurez le secret manuellement:"
  echo "    gh secret set DEPLOY_TOKEN --repo $REPO"
fi

# ── 4. Déclencher le premier déploiement ──
echo ""
echo "[4/4] Premier déploiement..."
gh workflow run deploy.yml --repo "$REPO" 2>/dev/null && echo "  ✓ Déclenché !" || echo "  ⚠️  Se lancera au prochain push"

echo ""
echo "========================================"
echo "  ✅ SETUP TERMINÉ !"
echo "========================================"
echo ""
echo "  🌐 https://capimind.com"
echo "  🔄 https://github.com/$REPO/actions"
echo ""
echo "  Chaque push sur main → déploiement auto !"
echo ""
