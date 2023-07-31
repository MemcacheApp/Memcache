FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install
RUN createdb 3900DBB
RUN npx prisma generate
RUN npx prisma migrate dev -- 3900DB
RUN prisma db seed

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
