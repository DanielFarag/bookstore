FROM node:20-slim

WORKDIR /app

COPY package.*json ./

RUN npm install --production

COPY . .

RUN rm .env .env.example

EXPOSE 3000

CMD ["npm", "start"]