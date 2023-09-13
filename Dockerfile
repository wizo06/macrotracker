FROM golang

COPY . .

CMD ["go", "run", "main.go"]
