## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:20.11.1-alpine3.18 as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
ENV REACT_APP_GC_ENV=localhost

RUN apk add build-base python3 cairo-dev pango-dev jpeg-dev giflib-dev

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . ./
RUN npm run postinstall
