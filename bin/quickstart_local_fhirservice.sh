#!/bin/bash

# Setup a FHIR server identical to the default FHIR servers configured 
# for the app. This allows developers of the app to test against a local
# Smile CDR FHIR server with OIDC implemented

# --- Details ---

# Clone the kids-first/kf-api-fhir-service repo if it doesn't exist
# Run the quickstart to setup all services:
# - Smile CDR FHIR API
# - Keycloak 
# - Postgres (for both Keycloak and FHIR)

# --- CLI Options ---

# --delete-volumes will delete any volumes in the docker-compose stack

set -e

START_TIME=$SECONDS
DELETE_VOLUMES=""
ROOT_DIR="fhir_server"
GIT_ORG_NAME=kids-first
GIT_REPO_NAME=kf-api-fhir-service
GITHUB_USERNAME=${GITHUB_USERNAME}
GITHUB_PAT_SMILECDR=${GITHUB_PAT_SMILECDR}

while [ -n "$1" ]; do 
	case "$1" in
	--delete-volumes) DELETE_VOLUMES=--delete-volumes ;; 
	*) echo "Option $1 not recognized" ;; 
	esac
	shift
done

echo "➡️  Begin development environment setup for Smile CDR 🤓 ..."

if [ ! -d "$ROOT_DIR/$GIT_REPO_NAME" ];
then
    echo "✨ Creating new fhir server in $ROOT_DIR/$GIT_REPO_NAME ..."
    mkdir $ROOT_DIR
    cd $ROOT_DIR
    git clone "git@github.com:$GIT_ORG_NAME/$GIT_REPO_NAME.git"
    cd $GIT_REPO_NAME
else
    echo "✨ Updating $ROOT_DIR/$GIT_REPO_NAME ..."
    cd "$ROOT_DIR/$GIT_REPO_NAME" 
    git checkout master
    git pull
fi

./src/bin/quickstart.sh $DELETE_VOLUMES

ELAPSED=$((( SECONDS - START_TIME ) / 60 ))
FORMATTED_ELAPSED=$(printf "%.2f" $ELAPSED)
echo ""
echo "Elapsed time $FORMATTED_ELAPSED minutes"

echo "✅ --- Development environment setup complete! ---"

