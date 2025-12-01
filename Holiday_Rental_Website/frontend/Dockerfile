FROM node
WORKDIR /frontend
COPY package*.json ./
RUN npm i
COPY . .
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]