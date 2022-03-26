FROM node:14-alpine
WORKDIR /usr/src/app
RUN npm install pm2@latest -g
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]