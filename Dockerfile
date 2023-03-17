#Build Stage
FROM node:18.4.0-alpine3.16 as build_stage
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Deploy Stage
FROM nginx:1.23.3-alpine
# RUN addgroup app && adduser -S -G app app
# USER app
COPY --from=build_stage /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;"]