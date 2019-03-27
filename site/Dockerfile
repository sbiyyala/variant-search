FROM node

WORKDIR /app/site
COPY package.json /app/site

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
