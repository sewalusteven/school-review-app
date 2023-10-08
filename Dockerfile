FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g ts-node prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]
