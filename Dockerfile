FROM node:alpine
EXPOSE 80
COPY src /app/src
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY tsconfig.json /app/
WORKDIR /app
RUN npm i -g pnpm && pnpm i && npx tsc
CMD [ "node", "/app/dist/main.js" ]
