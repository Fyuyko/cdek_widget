<template>

    <h1>Выбор ПВЗ СДЭК</h1>

    <form id="city" @submit.prevent="submitForm">

        <div >
            <label>Введите название города:</label>
            <input v-model="city" type="text" placeholder="Название города">
            <button @click.prevent="fetchPvzList()">Найти пункты выдачи</button>
        </div>

        <div class="map" id="map"></div>


        <div class="select">
<!--            <input type="hidden" :value="this.post">-->
<!--            <div class="select__header">{{this.post}}</div>
            <ul class="select__list">
                <li class="select__list-item" v-for="postItem in postsList" @click="event => this.post = event.target.innerText">
                    {{postItem.address}}
                </li>
            </ul>-->
            <button class="select__map" @click.prevent="showMap()">
                Показать на карте
            </button>
        </div>

<!--        <div v-if="selectedPoint">
            <button class="button-map" @click.prevent="selectedPoint = !selectedPoint">Назад</button>
            <label>Выберите пункт выдачи</label>
            <select v-model="selectedPoint">
                <option v-for="point in points" :key="point.id" :value="point">{{ point.address }}</option>
            </select>
            <button @click.prevent="showMap">Показать на карте</button>
        </div>
        <div v-if="selectedPoint">
            <button type="submit">Выбрать этот пункт</button>
        </div>

        <div class="map-container" v-if="showMapModal">
            <div class="map" ref="map"></div>
            <button @click.prevent="hideMap">Закрыть карту</button>
        </div>-->

    </form>

</template>

<script>

import axios from 'axios';

const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";

export default {
    name: "IndexComponent",

    data() {
        return {
            city: '',
            pvzList: [],
            point: [],
        }
    },

    methods: {
        async fetchPvzList() {
            //получаем данные о введенном городе
            const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();

            let point = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;
            for (let pointItem in point) {
                let part = [];
                part.push(point[pointItem].split(" ").reverse());
                this.point.push(part);
            }
        },

        async showMap() {
            let cityCoords = [];

            cityCoords = Array.from(this.point).map(proxyArray => {

                console.log(proxyArray)

                Object.values(proxyArray)
            });

            console.log(cityCoords)

            ymaps.ready(function() {

                const myMap = new ymaps.Map("map", {
                    center: cityCoords,
                    zoom: 10
                });

                // это просто для примера
                /*const myGeocoder = ymaps.geocode(`СДЕК ПВЗ Москва`, {results: 20})
                    .then(res => {
                        const geoObjects = res.geoObjects.toArray();

                        geoObjects.forEach(geoObjectsItem => {
                            const coords = geoObjectsItem.geometry.getCoordinates();
                            const objectData = geoObjectsItem.properties.getAll()

                            console.log('Тип геообъекта: %s', geoObjectsItem.properties.get('metaDataProperty.GeocoderMetaData.kind'));

                            // создание балуна
                            const myPlacemark = new ymaps.Placemark(coords, {
                                balloonContentHeader: "Тут будет название пункта",
                                balloonContentBody: "" +
                                    "Тут описание" +
                                    "<ul>" +
                                    "<li>время работы;</li>" +
                                    `<li>${objectData.text}</li>` +
                                    "</ul>",
                                balloonContentFooter: "<button>Выбрать этот пункт</button>",
                                hintContent: "улица такая-то"
                            }, {
                                preset: 'islands#violetStretchyIcon'
                            });

                            myMap.geoObjects.add(myPlacemark);
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });*/

                // подключаем элемент управления "Поиск по карте"
                var searchControl = new ymaps.control.SearchControl({
                    options: {
                        provider: 'yandex#search',
                        noPopup: true,
                        strictBounds: false,
                    }
                });

                myMap.controls.add(searchControl);

                // это мы запускаем поиск и отображение точек на карте
                searchControl.search('СДЕК ПВЗ Москва');


                //это мы должны получать данные поиска, но что-то пошло не так
                searchControl.events.add('searchComplete', function (event) {

                    console.log("search Complete");

                    /*var results = searchControl.getResultsArray();

                    // Создаем массив для хранения найденных меток
                    var placemarks = [];

                    // Проходимся по всем результатам поиска
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        var geoObject = result.geoObject;

                        // Если объект - метка, то добавляем его в массив меток
                        if (geoObject.properties.get('iconCaption') === 'Метка') {
                            placemarks.push({
                                name: geoObject.properties.get('name'),
                                address: geoObject.properties.get('description'),
                                coords: geoObject.geometry.getCoordinates()
                            });
                        }
                    }

                    console.log(placemarks);*/
                });


                // это мы получаем выбранный элемент (на который тыкнул пользователь)
                searchControl.events.add("resultselect", e => {

                    searchControl.getResultsArray().forEach(item => {
                        const data = item.properties.getAll();
                    })

                })
            });

        },

        hideMap() {

        },

        submitForm() {
            /*this.$http.post(`/order/${this.selectedPoint.id}`).then(() => {
                alert(`ПВЗ "${this.selectedPoint.address}" выбран!`);
            });*/

            alert("Выбран пункт!");
        },

    }
}

</script>

<style scoped lang="scss">
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    margin-bottom: 10px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
  }

  form label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  form input[type="text"],
  form select {
    width: 300px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 5px 10px;
    font-size: 1.1rem;
    margin-top: 5px;
  }

  form button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #0066ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  form button:hover {
    background-color: #0052cc;
  }

  /* Стили для карты */
  #map {
    height: 400px;
    width: 100%;
    margin-top: 50px;
  }

  /* Стили для кнопки "Выбрать этот пункт" */
  #select-point-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #0066ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  #select-point-button:hover {
    background-color: #0052cc;
  }
</style>