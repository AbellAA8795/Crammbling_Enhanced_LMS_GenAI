# Development image for the React (Vite) client.
# Source code is bind-mounted by docker-compose, so edits on the host
# hot-reload in the browser.
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# --host so the dev server is reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
