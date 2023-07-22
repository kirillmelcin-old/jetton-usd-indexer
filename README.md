# Jetton indexer

```sh
git clone https://github.com/kirillmelcin/jetton-usd-indexer.git
```

```sh
npm install
```

Внести данные для доступа к бд в .env файл:

```sh
cp .env.example .env
```

В db-script.js отредактировать название таблицы [https://github.com/kirillmelcin/jetton-usd-indexer/blob/7764249a3c44cfa17288be1b30738c2dac293007/db-script.js#L15](db-script.js 15 строка). Если нужно - изменить названия столбцов. Не забыть в бд создать столбец usd_price.

Чтобы скрипт срабатывал каждые 15 минут:

1. Узнать путь до nodejs

```sh
which node
```

2. Запустить редактор сценария для cron:

```sh
crontab -e
```

3. Вставить строку:

```sh
*/15 * * * * <путь до nodejs> <путь до индексера>/index.js
```
