FROM node:lts
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN ln -s /usr/bin/bash /usr/local/bin/sh
COPY .. .
CMD ["npm", "run", "dev"]
