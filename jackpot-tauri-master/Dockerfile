FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Correctly rename dealer.html to index.html so default Nginx routing catches it
RUN cp /usr/share/nginx/html/dealer.html /usr/share/nginx/html/index.html || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
