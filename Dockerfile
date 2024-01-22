FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

CMD ["node", "dist/main"]
