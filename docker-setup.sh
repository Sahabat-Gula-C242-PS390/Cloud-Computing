#!/bin/sh
set -e

# Check if service account key is provided via environment variable
if [ -n "$GCP_SA_KEY_BASE64" ]; then
    # Decode the base64 encoded service account key
    echo "$GCP_SA_KEY_BASE64" | base64 -d > /app/sa-key.json
    
    # Set the GCP_SA_KEY environment variable to point to the created file
    export GCP_SA_KEY=/app/sa-key.json
fi

# Execute the main container command
exec "$@"