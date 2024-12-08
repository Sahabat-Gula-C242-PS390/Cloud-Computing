# Use the official Bun image as the base
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY docker-setup.sh /docker-setup.sh
RUN chmod +x /docker-setup.sh
COPY package.json ./

# Install dependencies
RUN bun install --production

# Copy the rest of the application code
# Explicitly include only necessary directories and files
COPY src ./src

# Expose the port the app runs on
EXPOSE 3000

# Set the host to 0.0.0.0 to make it accessible outside the container
ENV HOST=0.0.0.0
ENV PORT=3000

ENTRYPOINT [ "/docker-setup.sh" ]

# Command to run the application
CMD ["bun", "src/index.js"]