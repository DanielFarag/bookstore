FROM node:20-slim

WORKDIR /app

COPY package.*json ./

RUN npm install --production

COPY . .

RUN if [ -f .env ]; then rm -f .env; fi

EXPOSE 3000

CMD ["npm", "start"]