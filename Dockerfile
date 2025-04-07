FROM node:18-alpine

WORKDIR /app

COPY app/server.js ./server.js
COPY app/provider-data ./provider-data

RUN mkdir received-data

# 💡 追加：SSL チェックを無効化
RUN npm config set strict-ssl false

RUN npm init -y && npm install express

EXPOSE 8080

CMD ["node", "server.js"]
