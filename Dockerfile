FROM node:20-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

RUN addgroup -g 1001 -S nodejs && adduser -S reactjs -u 1001
RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

USER reactjs
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]