# Development image for the Express API.
# Source code is bind-mounted by docker-compose, so edits on the host
# restart the server automatically through nodemon.
FROM node:22-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5000

# --legacy-watch (polling) is needed because file-change events from a
# Windows/macOS host don't always reach the container.
CMD ["nodemon", "--legacy-watch", "src/server.js"]
