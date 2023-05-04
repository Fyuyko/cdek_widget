# Пункты выдачи сдек на карте Яндекс

Приложение используется для отображения пунктов выдачи СДЕК на карте Яндекса.

### Зависимости
* Vue.js
* Яндекс.Карты API

### Инструкция по установке
1. Загрузите папку dist из репозитория и поместите ее в ваш проект.
2. В index.html вашего проекта вставьте следующую строку кода для подключения JS-файла:
```
<script src="./путь до папки/dist/main.js"></script>
```
3. Получите ключ для API Яндекс.Карт по адресу https://developer.tech.yandex.ru/.
4. Вставьте следующую строку кода в index.html вашего проекта, заменив "ваш API-ключ" на полученный ключ:
```
<script src="https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&lang=ru_RU" type="text/javascript"></script>
```
5. Инпуту, на который хотелось бы повешать кнопку с приложением, добавьте id="deliveryPost" и data-атрибут "data-yandex-key" со значение, равным вашшему ключу.
  
### Использование
1. На сайте, где необходимо добавить возможность выбора пункта выдачи, убедитесь, что имеется элемент 
```
<input id="deliveryPost" data-yandex-key="ваш API-ключ">.
```
2. После нажатия на кнопку "Выбрать пункт выдачи СДЕК" откроется Vue-приложение, где необходимо ввести название города.
3. После ввода названия города на карте Яндекса будут отмечены пункты выдачи СДЕК в этом городе.
4. Выберите нужный пункт выдачи на карте и подтвердите выбор.
5. Адрес пункта выдачи будет автоматически вставлен в <input id="deliveryPost">.
