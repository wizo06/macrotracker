FROM golang

COPY . .

EXPOSE 8080

CMD ["go", "run", "main.go"]
