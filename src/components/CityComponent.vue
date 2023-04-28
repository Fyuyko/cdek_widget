<template>
    <div v-if="!this.isMapActive && !isSelect">
        <label>Введите название города:</label>
        <input v-model="city" type="text" placeholder="Название города">
        <button @click.prevent="mapHandler">Показать пункты выдачи на карте</button>
    </div>
    <div v-else-if="this.isMapActive">
        <button @click.prevent="difCity">Выбрать другой город</button>
    </div>
</template>

<script>
const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";

export default {
    name: "CityComponent",

    props: ["onGetSelectItem", "onUpdateIsSelect", "onUpdateIsMapActive", "isSelect", "isMapActive"],

    data() {
        return {
            city: "",
            selectedItem: null,
        }
    },

    methods: {
        async mapHandler() {
            this.updateIsMapActive(true);

            const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`).then(res => res.json()); // получаем данные о городе
            const cityLimits = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
            const cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города
            let cityLimitsArray = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];

            let selectedItem;
            let changeSelectedItem = newSelectedItem => {
                selectedItem = newSelectedItem;
                this.selectedItem = selectedItem;
                this.sendSelectedItem();
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
            this.updateIsMapActive(false);
            this.selectedItem = null;
            this.updateIsSelect(null);
        },

        sendSelectedItem() {
            this.updateIsSelect(false);
            this.$emit("onGetSelectItem", this.selectedItem);
        },

        updateIsMapActive(value) {
            this.$emit("onUpdateIsMapActive", value);
        },

        updateIsSelect(value) {
            this.$emit("onUpdateIsSelect", value);
        }
    }
}
</script>

<style scoped>

</style>