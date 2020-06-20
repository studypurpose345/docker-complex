# Base Image
FROM node:alpine as builder
# Setting Working Directory
WORKDIR '/app'
# Copying Package.json for not installing npm dependencies without a change in package.json
COPY ./package*.json ./
# Running npm install prior copying other files
RUN npm install
# Copying every other files
COPY . .
# Building React Files
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html