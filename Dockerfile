FROM node:latest

WORKDIR /app

COPY package* ./

RUN npm install

COPY build ./build

EXPOSE 3000

ENTRYPOINT ["node", "build"]