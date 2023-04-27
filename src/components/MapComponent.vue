<template>
    <button v-if="this.city" @click.prevent="showMap">Показать пункты выдачи на карте</button>

    <div v-if="!isSelect" class="map" id="map"></div>

    <div v-if="selectedItem && !isSelect">
        <button @click.prevent="sendSelectedItem()" type="submit">Выбрать этот пункт</button>
    </div>
</template>

<script>
const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";

export default {
    name: "mapComponent",

    props: ["city"],

    data() {
        return {
            //pvzList: [],  Можно использовать для выведения селекта
            selectedItem: null,
            isSelect: false,
        }
    },

    methods: {
        async showMap() {
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
                const myMap = new ymaps.Map("map", {
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
                searchControl.search(`СДЕК ПВЗ ${this.city}`);

                // это мы получаем выбранный элемент (на который тыкнул пользователь)
                searchControl.events.add("resultselect", e => {
                    searchControl.getResult(e.get('index')).then(res => {
                        let selectedItem = res.properties.getAll();
                        changeSelectedItem(selectedItem);
                    });
                })

                myMap.controls.add(searchControl);
            });
        },

        sendSelectedItem() {
            this.$emit("onGetSelectedItem", this.selectedItem);
            this.submitForm();
            this.isSelect = !this.isSelect;
        },

        submitForm() {
            const selectedPoint = this.selectedItem;
        },
    }
}
</script>

<style lang="scss">
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