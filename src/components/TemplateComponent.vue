<template>
    <div class="template">
        <div class="city-delivery-point">
            <div v-if="!isMapActive && !isSelect">
                <label>Введите название города:</label>
                <input v-model="city" type="text" placeholder="Название города">
                <button @click.prevent="mapHandler">Показать пункты выдачи на карте</button>
            </div>
            <div v-else-if="isMapActive">
                <button @click.prevent="difCity">Выбрать другой город</button>
            </div>
        </div>

        <div class="map-delivery-point">
            <div v-if="isMapActive" class="map" id="map"></div>
        </div>

        <div class="select-delivery-point">
            <button v-if="!IsMapActive && isSelect">
                Выбрать другой пункт
            </button>
            <div v-if="selectedItem && !isSelect">
                <button @click.prevent="submitForm()" type="submit">Выбрать этот пункт</button>
            </div>
            <div v-else-if="selectedItem && isSelect">
                Вы выбрали пункт по улице {{itemAddress}}
            </div>
        </div>
    </div>
</template>

<script>
const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";

export default {
    name: "TemplateComponent",

    data() {
        return {
            city: "",
            selectedItem: false,
            isMapActive: false,
            isSelect: false,

            //pvzList: [],  Можно использовать для выведения селекта
            itemAddress: "",
        }
    },

    methods: {
        async mapHandler() {
            this.isMapActive = true;

            const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`).then(res => res.json()); // получаем данные о городе
            const cityLimits = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
            const cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города
            let cityLimitsArray = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];

            let selectedItem;
            let changeSelectedItem = newSelectedItem => {
                selectedItem = newSelectedItem;
                this.selectedItem = selectedItem;
            }

            ymaps.ready(() => {
                let myMap;

                myMap = new ymaps.Map("map", {
                    center: cityCenter,
                    zoom: 13
                });

                // подключаем элемент управления "Поиск по карте"
                let searchControl = new ymaps.control.SearchControl({
                    options: {
                        provider: 'yandex#search',
                        results: 100,
                        noPopup: true,
                        strictBounds: false,
                        boundedBy: cityLimitsArray,
                    }
                });

                // это мы запускаем поиск и отображаем точки на карте
                searchControl.search(`СДЕК ПВЗ ${this.city}`).then(res => {
                    map.geoObjects.add(res.geoObjects);
                });

                // это мы получаем выбранный элемент (на который тыкнул пользователь)
                searchControl.events.add("resultselect", e => {
                    searchControl.getResult(e.get('index')).then(res => {
                        let selectedItem = res.properties.getAll();
                        changeSelectedItem(selectedItem);
                    });
                })

                myMap.controls.add(searchControl);
                myMap.container.fitToViewport();
            });
        },
        difCity() {
            this.isMapActive = false;
            this.selectedItem = null;
            this.isSelect = null;
        },

        submitForm() {
            const selectedPoint = this.selectedItem;
            this.itemAddress = this.selectedItem.address;
            this.isMapActive = false;
            this.isSelect = true;

            console.log(selectedPoint)
        },
    }
}
</script>

<style lang="scss">
    .template {
        text-align: center;
    }
    #map {
        width: 600px;
        height: 400px;
        margin: 0 auto;

        padding-top: 40px;

        &.show {
            opacity: 1;
            pointer-events: all;
        }
    }
</style>