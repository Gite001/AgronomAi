#!/bin/bash

# ==============================================================================
# SCRIPT DE REINITIALISATION DE LA CONNEXION GITHUB (Version 2 - Anti-Cache)
# ==============================================================================
#
# Quand l'utiliser ?
# - Lorsque `git push` échoue avec une erreur "Invalid username or token"
#   même après avoir utilisé un Personal Access Token (PAT) et que les
#   identifiants semblent être mis en cache.
#
# Que fait-il ?
# 1. Il supprime la configuration Git locale corrompue (.git).
# 2. Il réinitialise le projet comme un nouveau dépôt Git.
# 3. Il vous guide pour le reconnecter proprement à votre dépôt GitHub en utilisant
#    une URL qui force la demande d'authentification.
#
# Comment l'utiliser ?
# 1. Copiez l'URL HTTPS de votre nouveau dépôt GitHub (ex: https://github.com/votre-nom/votre-depot.git).
# 2. Exécutez ce script dans le terminal en tapant : ./reset-github.sh
# 3. Suivez les instructions et collez vos informations lorsque demandé.
#
# ==============================================================================

# Demander les informations à l'utilisateur
echo "--- PROTOCOLE DE REINITIALISATION GITHUB (FORCE) ---"
read -p "Collez l'URL HTTPS de votre nouveau dépôt GitHub : " GITHUB_URL
read -p "Entrez votre nom d'utilisateur GitHub exact : " GITHUB_USER

# Validation simple des entrées
if [[ -z "$GITHUB_URL" || -z "$GITHUB_USER" ]]; then
    echo "ERREUR : L'URL et le nom d'utilisateur ne peuvent pas être vides. Opération annulée."
    exit 1
fi

# Construction de l'URL d'authentification forcée
# On retire "https://" de l'URL d'origine pour l'injecter proprement
AUTH_URL="https://${GITHUB_USER}@${GITHUB_URL#https://}"

echo ""
echo "--- Etape 1/5 : Nettoyage de l'ancienne configuration Git... ---"
rm -rf .git
echo "Ancienne configuration (.git) supprimée."
sleep 1

echo ""
echo "--- Etape 2/5 : Initialisation d'un nouveau dépôt local... ---"
git init
echo "Nouveau dépôt initialisé."
sleep 1

echo ""
echo "--- Etape 3/5 : Préparation de tous les fichiers pour le premier commit... ---"
git add .
git commit -m "Commit initial : Réinitialisation du projet"
echo "Fichiers préparés."
sleep 1

echo ""
echo "--- Etape 4/5 : Connexion au nouveau dépôt GitHub (mode forcé)... ---"
git branch -M main
git remote add origin "$AUTH_URL"
echo "Connexion établie avec $GITHUB_URL pour l'utilisateur $GITHUB_USER"
sleep 1

echo ""
echo "--- Etape 5/5 : Envoi des fichiers vers GitHub... ---"
echo "Git va maintenant vous demander votre mot de passe."
echo "IMPORTANT : Pour le mot de passe, utilisez votre JETON D'ACCES PERSONNEL (PAT)."
git push -u origin main

echo ""
echo "--- OPERATION TERMINEE ---"
echo "Si aucune erreur n'est apparue, votre projet est maintenant sur GitHub."
echo "Vérifiez votre dépôt sur github.com pour confirmer."
