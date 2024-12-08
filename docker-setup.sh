#!/bin/sh
set -e

# Print out the base64 variable length and first few characters for debugging
echo "GCP_SA_KEY_BASE64 length: ${#GCP_SA_KEY_BASE64}"
echo "GCP_SA_KEY_BASE64 first 10 chars: ${GCP_SA_KEY_BASE64:0:10}"

# Check if service account key is provided via environment variable
if [ -n "$GCP_SA_KEY_BASE64" ]; then
    # Try decoding, with error handling and verbose output
    echo "Attempting to decode service account key..."
    
    # Remove any potential newlines or whitespace
    CLEANED_BASE64=$(echo "$GCP_SA_KEY_BASE64" | tr -d '\n' | tr -d ' ')
    
    # Attempt to decode with verbose error output
    echo "$CLEANED_BASE64" | base64 -d > /app/sa-key.json 2>&1 || {
        echo "BASE64 DECODING FAILED"
        echo "Raw input:"
        echo "$CLEANED_BASE64"
        exit 1
    }
    
    # Verify the file was created
    if [ -f "/app/sa-key.json" ]; then
        echo "Service account key file created successfully"
        cat /app/sa-key.json
    else
        echo "Failed to create service account key file"
        exit 1
    fi
    
    # Set the GCP_SA_KEY environment variable to point to the created file
    export GCP_SA_KEY="/app/sa-key.json"
fi

# Execute the main container command
exec "$@"