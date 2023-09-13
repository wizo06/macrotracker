FROM golang

COPY . .

EXPOSE 8080

RUN go build main.go

ENTRYPOINT ./main
