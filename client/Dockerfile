FROM node:lts

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy

COPY . .

ENV DANGEROUSLY_DISABLE_HOST_CHECK=TRUE

EXPOSE 3300

CMD ["npm", "start"]
