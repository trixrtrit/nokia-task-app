FROM node:18

WORKDIR /app

COPY package*.json ./

COPY nodemon.json ./

COPY jest.config.ts ./

COPY tsconfig.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]