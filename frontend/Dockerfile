FROM node:18.16.0

WORKDIR /user/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm i

COPY ./ ./

EXPOSE 3000

CMD ["npm", "run", "start"]
