FROM node:18-alpine

WORKDIR /app

COPY app/server.js ./server.js
COPY app/provider-data ./provider-data

RUN mkdir received-data

RUN npm init -y && npm install express

EXPOSE 8080

CMD ["node", "server.js"]
