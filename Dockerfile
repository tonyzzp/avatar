FROM node:alpine
EXPOSE 80
COPY src /app/
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY tsconfig.json /app/
WORKDIR /app
RUN npm i && npm run build && mv /app/dist/main.js /app/dist/multiavatar.js
ENTRYPOINT [ "node", "/app/dist/multiavatar.js" ]
