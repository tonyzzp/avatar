FROM node:alpine
COPY main.ts /app/
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY tsconfig.json /app/
