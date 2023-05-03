# Chat App

Простое чат-приложение, созданное с использованием React, Firebase и Ant Design. Пользователи могут отправлять и получать сообщения в режиме реального времени.

## Особенности

- Отправка и получение сообщений в режиме реального времени
- Звуковое сопровождение при отправке сообщений
- Адаптивный дизайн с использованием Ant Design

## Требования

- React
- Firebase аккаунт

## Установка и настройка

1. Клонируйте репозиторий:

```
git clone https://github.com/Janexxx1337/chat-app.git
```


2. Установите зависимости:


3. Создайте Firebase проект и настройте Realtime Database, следуя [официальной документации Firebase](https://firebase.google.com/docs/database/web/start).


4. Замените объект `firebaseConfig` в файле `src/Components/FirebaseConfig.js` на свою конфигурацию Firebase:


const FirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};


5. Запустите проект:

```
npm start
```

# Теперь ваше чат-приложение будет доступно по адресу http://localhost:3000.

