# finance-tracker

Finance Tracker
Вам предстоит разработать платформу для управления личными финансами, на которой пользователи могут отслеживать свои доходы, расходы, долги и цели сбережений.
Основные функции включают в себя учет и категоризацию доходов и расходов, создание и отслеживание бюджетов, постановку целей сбережений и анализ финансовых данных с помощью диаграмм и графиков.

</br>
🗒️</br>
Старперпак для начала работы:</br>
https://practicum-for-students.yonote.ru/share/c7e0b645-b25a-400c-9a7a-a01c55e9f7ef/doc/starterpak-komandnoj-raboty-nad-proektom-5r1zJxPsJ3

🎨</br>
Макет:</br>
https://www.figma.com/design/KP905masAHKwh8iM84kfVk/%D0%92%D0%9A%D0%A0.-Finance-Tracker?node-id=89-3454&node-type=canvas&t=zLAJioBWpSkN9CC5-0

📌</br>
Kaiten:</br>
https://okokanya.kaiten.ru/space/528408/boards

## Основные команды

#### Установка зависимостей

```
npm i
```

#### Генерация схемы БД

```
npm run db:generate
```

#### Запуск миграций

```
npm run db:migrate
```

#### Запуск базы данных

```
npm run db:seed
```

#### Запуск проекта в режиме разработки

```
npm run dev
```

## Порядок запуска проекта

```
npm i # если зависимости установлены, этот шаг можно пропустить
npm run db:migrate # если падает с ошибкой, то в таком случае нужно предварительно выполнить команду npm run db:generate
npm run db:seed
npm run dev
```
