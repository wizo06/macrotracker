FROM oven/bun

COPY . .

CMD ["bun", "run", "index.js"]
