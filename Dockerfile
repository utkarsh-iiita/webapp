## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:20.3.0-alpine3.17 as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
ENV REACT_APP_GC_ENV=localhost

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i 

# EXPOSE 3000
# ENV PORT 3000

# add app
COPY . ./
