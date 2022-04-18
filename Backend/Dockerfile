FROM node:17

LABEL maintainer "krunk <webmaster@krunk.cn>"
LABEL org.opencontainers.image.source=https://github.com/COSC-4P02/COSC4P02Project

# App Directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production
RUN npm install pm2 -g

# Bundle app source
COPY . .

# Save data folder
VOLUME ["data"]

# Set Production
ENV NODE_ENV production

# Server Ports
EXPOSE 8001 3000

# Run app.js
CMD ["pm2-runtime", "app.js"]