FROM node:22.14.0-alpine3.21 as builder

ARG NODE_ENV

WORKDIR /

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install

COPY . .

RUN npm run build

RUN cp src/app/env/.env.${NODE_ENV} .env

FROM node:22.4.0-alpine3.20 as runner

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

RUN apk add --no-cache \
    python3 \
    make \
    g++

RUN npm install -g pm2 @google/gemini-cli@latest

WORKDIR /app

COPY --from=builder /dist ./dist
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json
COPY --from=builder /tsconfig.json ./tsconfig.json
COPY --from=builder /.env ./.env

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "npm run start:${NODE_ENV}"]