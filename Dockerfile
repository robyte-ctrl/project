FROM node:fermium AS build

WORKDIR /tmp/project-build

COPY package*.json ./
COPY .ssh/ /root/.ssh/
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build

RUN npm prune --production

FROM node:fermium-alpine

WORKDIR /project

COPY --from=build /tmp/project-build/node_modules ./node_modules
COPY --from=build /tmp/project-build/dist ./dist

# COPY ./config ./config
# COPY ./public ./public

ENV NODE_OPTIONS="--enable-source-maps" PORT="8080"

EXPOSE 8080

CMD ["node", "dist"]
