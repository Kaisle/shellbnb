FROM node:alpine

COPY package.json /package.json

COPY package-lock.json /package-lock.json

RUN apk update && apk add git

RUN npm install --only=prod

FROM gcr.io/distroless/nodejs

COPY --from=0 node_modules /node_modules

COPY src/app /src/app

COPY --from=0 /etc/passwd /etc/passwd

USER node

CMD ["src/app/index.js"]
