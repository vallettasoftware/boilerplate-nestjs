FROM node:20

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

RUN npm prune --production

CMD ["npm", "run", "start:prod"]
