FROM node:14.16-alpine
WORKDIR /home/node/app
COPY . .
RUN npm ci && npm run build && \
    rm -rf node_modules && \
    npm ci --production && \
    npm cache clean --force

USER node
EXPOSE 3000

CMD [ "node", "dist/main" ]
