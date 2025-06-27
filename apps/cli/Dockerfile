FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Optional: install ts-node globally if needed
RUN npm install -g ts-node

# Default command to run your CLI
CMD ["ts-node", "src/main.ts"]
