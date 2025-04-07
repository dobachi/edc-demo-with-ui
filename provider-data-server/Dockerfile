FROM node:18-alpine

WORKDIR /app

COPY server.js .
COPY data ./data

RUN npm init -y && \
    npm config set strict-ssl false && \
    npm install express

EXPOSE 8080

CMD ["node", "server.js"]
