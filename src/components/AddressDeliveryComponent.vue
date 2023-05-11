<template>
<!--    <div v-if="deliveryMethod" class="delivery-point__city">
        <div v-if="!isMapActive && !isSelect">
            <label>{{ !cityError ? "Введите название города:" : "Не правильно введено название, попробуйте еще раз:"}}</label>
            <div class="delivery-point__city-name">
                <v-text-field v-model="city" @input="city.length > 0 ? isButtonDisabled = false : isButtonDisabled = true" label="Название города"></v-text-field>
                <v-btn color="blue" @click="initMap" :disabled="isButtonDisabled">
                    Подтвердить
                </v-btn>
            </div>
        </div>
        <div v-else-if="isMapActive && !isSelect">
            <v-btn color="blue" @click.prevent="difCity">
                Назад
            </v-btn>
        </div>
    </div>-->

    <div class="delivery-point__map" :style="{ display: isSelect ? 'none' : 'block' }">
        <v-text-field class="input" id="suggest" v-model="address" label="Введите адрес" @input="handleInput"></v-text-field>
        <p id="notice">Адрес не найден</p>
        <div class="delivery-point__map-content" id="mapAddress"></div>
        <div id="footer">
            <div id="messageHeader"></div>
            <div id="message"></div>
        </div>
<!--        <v-progress-linear v-if="isMapLoad" indeterminate></v-progress-linear>-->
    </div>


</template>

<script>
import {VBtn, VTextField, VProgressLinear, VCard, } from "vuetify/components";
export default {
    name: "AddressDeliveryComponent",

    components: {
        VBtn, VTextField, VProgressLinear, VCard,
    },

    data() {
        return {
            yandexApiKey: "",

            address: '',
            mapInstance: null,
            suggestView: null,
            placemark: null,

            isMapLoad: false,
            isMapActive: false,
            cityError: false,
            selectedItem: "",
            isSelect: false,
        }
    },

    mounted() {
        const inputElement = document.querySelector("#deliveryPost");
        this.yandexApiKey = inputElement.dataset.yandexKey;

        ymaps.ready(this.initMap);
    },

    methods: {
        async initMap() {
            this.isMapActive = true;
            this.isMapLoad = true;

            // const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${this.yandexApiKey}&format=json&geocode=${this.city}`) // получаем данные о городе
            //     .then(res => {
            //         if (res.ok) {
            //             this.isMapLoad = false;
            //             return res.json();
            //         }
            //         throw new Error('Something went wrong');
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })
            //
            // let cityLimits, cityCenter, cityLimitsArray;
            // if (geocodeData.response.GeoObjectCollection.featureMember[0]) {
            //     this.cityError = false;
            //     cityLimits = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
            //     cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города
            //
            //     if (cityLimits) {
            //         cityLimitsArray = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];
            //     }
            // } else {
            //     // this.difCity();
            //     this.cityError = true;
            //     this.isMapLoad = false;
            // }

            /*let selectedItem;
            let changeSelectedItem = newSelectedItem => {
                selectedItem = newSelectedItem;
                this.selectedItem = selectedItem;
            }*/

            if (this.isMapActive) {  //поменять условия обратно
                this.mapInstance = new ymaps.Map("mapAddress", {
                    center: [55.751574, 37.573856],   //поменять центр обратно
                    zoom: 13,
                });

                this.suggestView = new ymaps.SuggestView("suggest");

                this.suggestView.events.add('select', (event) => {
                    const selectedItem = event.get('item');
                    this.address = selectedItem.value;
                    this.getAddressByCoordinates(this.address);
                });

                this.mapInstance.events.add('click', (event) => {
                    const coords = event.get('coords');
                    this.getAddressByCoordinates(coords);
                });

                this.mapInstance.container.fitToViewport();
            }
        },

        handleInput() {
            if (this.suggestView) {
                this.suggestView.state.set('requestString', this.address);
            }
        },

        updatePlacemark(selectedItemData) {
            if (this.placemark && this.mapInstance) {
                this.mapInstance.geoObjects.remove(this.placemark);
            }

            const {displayName, coords} = selectedItemData;

            this.placemark = new ymaps.Placemark(coords[0], {
                balloonContentBody: displayName,
            });

            this.mapInstance.geoObjects.add(this.placemark);
        },
        getAddressByCoordinates(cityData) {
            // Получаем адрес по координатам
            ymaps.geocode(cityData).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const address = firstGeoObject.getAddressLine();
                const coords = firstGeoObject.geometry.getCoordinates();

                this.address = address;
                this.updatePlacemark({
                    displayName: address,
                    coords: [coords],
                });
            });
        }
    }
}
</script>

<style scoped>
  .v-field__field {
      width: 100%;
  }

  #notice {
      position: absolute;
      left: 22px;
      margin: 0;
      top: 44px;
      color: #f33;
      display: none;
  }

  .input_error, .input_error:focus {
      outline: none;
      border: 1px solid #f33;
      box-shadow: 0 0 1px 1px #f33;
  }
</style>