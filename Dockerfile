FROM node:14.16 AS build
WORKDIR /home/node/app
COPY . .
RUN npm ci && npm run build

USER node
EXPOSE 3000

CMD [ "node", "dist/main" ]
