# =========================
# Stage 1: Build React
# =========================

FROM node:22-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_ROOT

ENV REACT_APP_API_ROOT=$REACT_APP_API_ROOT

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# =========================
# Stage 2: Nginx
# =========================

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]