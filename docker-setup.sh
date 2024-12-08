#!/bin/sh
set -e

# Decode the GCP service account key to base64
if [ -n "$GCP_SA_KEY_BASE64" ]; then
    echo "$GCP_SA_KEY_BASE64" | base64 -d > /app/sa-key.json
fi

exec "$@"