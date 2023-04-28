<template>
    <div>
        <form action="">
            <label>Введите адрес доставки:</label>
            <input v-model="city" type="text" placeholder="Город">
            <button v-if="city" @click.prevent="createMap">Выбрать адрес на карте</button>
            <input v-if="city" v-model="address" type="text" placeholder="Улица, дом, кв/офис">
        </form>

        <button>Доставить по адресу</button>
    </div>

    <DeliveryMapComponent :isCity="isCity"/>

    <div v-if="city && address">
        Адрес: {{address}}
    </div>
</template>

<script>
import DeliveryMapComponent from "@/components/CourierDelivery/DeliveryMapComponent.vue";

const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";

export default {
    name: "CourierDelivery",
    components: {DeliveryMapComponent},

    data() {
        return {
            city: "",
            isCity: false,
            address: "",
        }
    },

    methods: {
        //должно одновременно происходить и прямое и обратное геокодирование
        //человек может просто ввести адрес + человек может выбрать адрес на карте

        async createMap() {
            this.isCity = true;

            // здесь создаем карту и взаимодействуем с ней (показывать центр выбранного города)
            const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`).then(res => res.json()); // получаем данные о городе
            const cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города
            const cityAddressUpdate = (address) => {
                this.city = address;
                console.log(this.city, this.address)
            }


            let myPlacemark,
                myMap = new ymaps.Map('mapDelivery', {
                    center: cityCenter,
                    zoom: 12
                }, {
                    searchControlProvider: 'yandex#search'
                });

            // Слушаем клик на карте.
            myMap.events.add('click', function (e) {
                let coords = e.get('coords');

                // Если метка уже создана – просто передвигаем ее.
                if (myPlacemark) {
                    myPlacemark.geometry.setCoordinates(coords);
                }
                // Если нет – создаем.
                else {
                    myPlacemark = createPlacemark(coords);
                    myMap.geoObjects.add(myPlacemark);
                    // Слушаем событие окончания перетаскивания на метке.
                    myPlacemark.events.add('dragend', function () {
                        getAddress(myPlacemark.geometry.getCoordinates());
                    });
                }
                getAddress(coords);
            });
            myMap.container.fitToViewport();

            // Создание метки.
            function createPlacemark(coords) {
                return new ymaps.Placemark(coords, {
                    iconCaption: 'поиск...'
                }, {
                    preset: 'islands#violetDotIconWithCaption',
                    draggable: true
                });
            }

            // Определяем адрес по координатам (обратное геокодирование).
            function getAddress(coords) {
                myPlacemark.properties.set('iconCaption', 'поиск...');
                ymaps.geocode(coords).then(function (res) {
                    let firstGeoObject = res.geoObjects.get(0);
                    cityAddressUpdate(firstGeoObject.getAddressLine());

                    myPlacemark.properties
                        .set({
                            // Формируем строку с данными об объекте.
                            iconCaption: [
                                // Название населенного пункта или вышестоящее административно-территориальное образование.
                                firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                                // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                            ].filter(Boolean).join(', '),
                            // В качестве контента балуна задаем строку с адресом объекта.
                            balloonContent: firstGeoObject.getAddressLine()
                        });
                });
            }
        },

        searchIntoMap() {
            // здесь прямое


        },

        addDataIntoMAp() {
            // здесь обратное


        },

    }

}
</script>

<style>

</style>