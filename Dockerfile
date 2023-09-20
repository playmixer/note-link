FROM golang:1.20 AS back

WORKDIR /usr/local/go/src/app

COPY go.mod go.sum ./

RUN go mod download

COPY . ./

WORKDIR /usr/local/go/src/app

RUN CGO_ENABLED=0 GOOS=linux go build -o /build/app


FROM node:18-alpine as front

WORKDIR /app

COPY ./frontend ./
RUN yarn install
RUN yarn build


FROM ubuntu:latest

WORKDIR /app

# COPY ./.env ./
COPY --from=back /build/app ./
COPY --from=front /app/build ./www

EXPOSE 8000
ENTRYPOINT ["./app"]