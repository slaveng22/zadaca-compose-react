FROM node:23 AS builder
WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
