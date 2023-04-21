<template>

    <h1>Выбор ПВЗ СДЭК</h1>

    <form id="city" @submit.prevent="submitForm">

        <div v-if="!selectedPoint">
            <label>Введите название города:</label>
            <input v-model="city" type="text" placeholder="Название города">
            <button @click.prevent="showMap()">Найти пункты выдачи</button>
        </div>

        <div class="map" id="map"></div>


<!--        <div class="select">
            <input type="hidden" :value="this.post">
            <div class="select__header">{{this.post}}</div>
            <ul class="select__list">
                <li class="select__list-item" v-for="postItem in postsList" @click="event => this.post = event.target.innerText">
                    {{postItem.address}}
                </li>
            </ul>
        </div>-->

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

        }
    },

    methods: {
        async fetchPvzList() {
            /*//получаем данные о введенном городе
            const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();

            const point = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
            const [longitude, latitude] = point;

            // Здесь должны получать список ПВЗ
            if (longitude && latitude) {
                const searchUrl = `https://search-maps.yandex.ru/v1/?apikey=${yandexApiKey}&text=cdek&lang=ru_RU&ll=${longitude},${latitude}&type=biz&results=10`;
                const searchData = await fetch(searchUrl)
                    .then((data) => data.json())
                    .catch(error => {
                        throw(error);
                    });

                if (searchData) {
                    this.pvzList = searchData.features.filter(feature => feature.properties.CompanyMetaData.name === "СДЭК Пункт выдачи заказов");
                }
            }*/
        },

        async showMap() {

            const apiKey = '88398772-1a4b-4234-b8b9-b3dacf1b135e'; // Вставьте свой API-ключ
            const city = 'Moscow'; // Название города, для которого необходимо получить список ПВЗ

            fetch(`https://search-maps.yandex.ru/v1/?text=Пункт выдачи заказов СДЭК ${city}&type=biz&apikey=${apiKey}`)
                .then(response => {
                    console.log(response)
                    response.json()
                })
                /*.then(data => {
                    const results = data.features.map(feature => {
                        return {
                            name: feature.properties.name,
                            address: feature.properties.description,
                            coords: feature.geometry.coordinates
                        };
                    });
                    console.log(results); // Список ПВЗ
                })*/
                .catch(error => {
                    console.error(error);
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