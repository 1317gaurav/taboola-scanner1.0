FROM node:lts

WORKDIR /usr/app

COPY package*.json ./
RUN npm ci -qy

COPY . .

EXPOSE 5120

CMD ["npm", "start"]
