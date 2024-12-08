# Use the official Bun image as the base
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY package.json ./

# Install dependencies
RUN bun install --production

# Copy the rest of the application code
# Explicitly include only necessary directories and files
COPY src ./src

# Copy the service account key (if it's required to be in the container)
COPY sa-key.json* ./

# Create a default .env file with placeholders
RUN echo "GCP_PROJECT_ID=" > .env
RUN echo "GCP_SA_KEY=" >> .env

# Expose the port the app runs on
EXPOSE 3000

# Set the host to 0.0.0.0 to make it accessible outside the container
ENV HOST=0.0.0.0
ENV PORT=3000

# Command to run the application
CMD ["bun", "src/index.js"]