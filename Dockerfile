# Base image
FROM node:18

# Define APP arg
ARG APP

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build ${APP}

ENV APP=${APP}

RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]