FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY . .
RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]
