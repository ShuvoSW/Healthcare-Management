FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["sh", "-lc", "CI=true pnpm install && pnpm exec nest dev -H 0.0.0.0 -p 3000" ]