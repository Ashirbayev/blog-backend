FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm cache clean --force
RUN npm install

# Копируем весь проект
COPY . .

# Запускаем приложение
CMD ["npm", "start"]
