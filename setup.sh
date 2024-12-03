#!/bin/bash

# Update and install necessary packages
sudo apt update
sudo apt install -y curl gnupg nginx git unzip

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Verify Bun installation
bun --version

if [ $? -ne 0 ]; then
    echo "Bun installation failed"
    exit 1
fi

# Set up Nginx configuration
sudo tee /etc/nginx/sites-available/sahabat-gula <<EOF
server {
    listen 80;
    client_max_body_size 10M;
    server_name sahabat-gula-dev.us.to;
    server_name www.sahabat-gula-dev.us.to;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Enable the Nginx configuration
sudo ln -s /etc/nginx/sites-available/sahabat-gula /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install project dependencies
bun install

# Build the project
bun run build

# Start the project
bun run start:prod