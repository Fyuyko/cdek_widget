<template>
    <div class="map" id="map"></div>
</template>

<script>


export default {
    name: "mapComponent",

    data() {
        return {
            city: '',
            pvzList: [],
            point: [],
            selectedItem: null,
        }
    },

    methods: {
        async showMap() {

            const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();

            let point = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;
            let center = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();

            // 0 и 1 элменты
            for (let pointItem in point) {
                let part = [];
                part.push(point[pointItem].split(" ").reverse());
                this.point.push(part);
            }

            // 2 элемент
            this.point.push(center);


            const cityCoords = Array.from(this.point).map(proxyArray => {
                return [...proxyArray]
            });
            const cityBounds = [cityCoords[0][0], cityCoords[1][0]];
            const city = this.city;
            let selectedItem;

            let changeSelectedItem = newSelectedItem => {
                selectedItem = newSelectedItem;
                this.selectedItem = selectedItem;
            }

            ymaps.ready(function() {
                const myMap = new ymaps.Map("map", {
                    center: cityCoords[2],
                    zoom: 12
                });

                // подключаем элемент управления "Поиск по карте"
                let searchControl = new ymaps.control.SearchControl({
                    options: {
                        provider: 'yandex#search',
                        results: 100,
                        noPopup: true,
                        strictBounds: false,
                        boundedBy: cityBounds,
                        noPlacemark: true
                    }
                });

                // это мы запускаем поиск и отображение точек на карте
                searchControl.search(`СДЕК ПВЗ ${city}`)

                // это мы получаем выбранный элемент (на который тыкнул пользователь)
                searchControl.events.add("resultselect", e => {
                    let index = e.get('index');

                    searchControl.getResult(index).then(res => {
                        let selectedItem = res.properties.getAll();
                        changeSelectedItem(selectedItem);
                    });
                })

                myMap.controls.add(searchControl);
            });
        },
    }
}
</script>

<style scoped lang="scss">
  #map {
    width: 600px;
    height: 400px;

    padding-top: 40px;

    //opacity: 0;
    //pointer-events: none;

    &.show {
      opacity: 1;
      pointer-events: all;
    }
  }
</style>