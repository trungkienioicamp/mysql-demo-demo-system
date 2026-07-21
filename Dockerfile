FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_HOST=host.docker.internal
ENV DB_PORT=3306
ENV DB_USER=root
ENV DB_PASSWORD=
ENV DB_NAME=codex_test
EXPOSE 3001

CMD ["npm", "start"]
