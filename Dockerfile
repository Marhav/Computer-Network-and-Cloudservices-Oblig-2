FROM node:14

RUN mkdir -p /usr/src/www
WORKDIR /usr/src/www

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 2828
CMD [ "node", "server.js" ]
