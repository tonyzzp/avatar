FROM node:alpine
EXPOSE 80
COPY src /app/
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY tsconfig.json /app/
WORKDIR /app
RUN npm i && npm run build
CMD [ "node", "/app/dist/main.js" ]
