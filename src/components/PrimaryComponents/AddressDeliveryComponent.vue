<template >
    <div class="template" v-if="deliveryMethod==='address'" >
        <CitySelectorComponent @getCity="getCity" @mapHandler="initMap" :isMapActive="isMapActive" :isSelect="isSelect" :cityError="cityError"/>

        <BackButtonComponent :isMapActive="isMapActive" :isSelect="isSelect" @difCity="difCity"/>

        <div class="delivery-point__map-wrapper">
            <div class="delivery-point__map-select">
                <v-text-field v-if="isMapActive" class="input" id="suggest" v-model="address" label="Введите адрес" @input="handleInput"></v-text-field>
                <p id="notice">Адрес не найден</p>
            </div>

            <MapViewerComponent :identify="mapIdentify" :isMapActive="isMapActive" :isMapLoad="isMapLoad" :isSelect="isSelect"/>
        </div>

        <AddressSelectorComponent :text="selectText" :selectedItem="selectedItem" :isSelect="isSelect" @submitForm="submitForm"/>
    </div>
</template>

<script>
import {VBtn, VTextField, VProgressLinear, VCard, } from "vuetify/components";
import BackButtonComponent from "@/components/CommonComponents/BackButtonComponent.vue";
import CitySelectorComponent from "@/components/CommonComponents/CitySelectorComponent.vue";
import MapViewerComponent from "@/components/CommonComponents/MapViewerComponent.vue";
import AddressSelectorComponent from "@/components/CommonComponents/AddressSelectorComponent.vue";
export default {
    name: "AddressDeliveryComponent",

    components: {
        AddressSelectorComponent,
        MapViewerComponent,
        CitySelectorComponent,
        BackButtonComponent,
        VBtn, VTextField, VProgressLinear, VCard,
    },

    props: ["onUpdateModalHandler", "deliveryMethod", "yandexApiKey",],

    data() {
        return {
            address: '',
            mapInstance: null,
            suggestView: null,
            placemark: null,

            city: "",
            isMapLoad: false,
            isMapActive: false,
            cityError: false,
            selectedItem: "",
            isSelect: false,
            isButtonDisabled: true,

            selectText: "Подтвердить адрес",
            mapIdentify: "mapAddress",
        }
    },

    methods: {
        async initMap() {
            this.isMapActive = true;
            this.isMapLoad = true;

            const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${this.yandexApiKey}&format=json&geocode=${this.city}`)
                .then(res => {
                    if (res.ok) {
                        this.isMapLoad = false;
                        return res.json();
                    }
                    throw new Error('Something went wrong');
                })
                .catch(error => {
                    console.log(error)
                })

            let cityCenter;
            if (geocodeData.response.GeoObjectCollection.featureMember[0]) {
                this.cityError = false;
                cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();

            } else {
                this.difCity();
                this.cityError = true;
                this.isMapLoad = false;
            }

            let selectedItem;
            let changeSelectedItem = newSelectedItem => {
                selectedItem = newSelectedItem;
                this.selectedItem = selectedItem;
            }

            if (cityCenter) {
                this.mapInstance = new ymaps.Map("mapAddress", {
                    center: cityCenter,
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

                    changeSelectedItem(true)
                });

                this.mapInstance.container.fitToViewport();
            }
        },

        handleInput() {
            this.selectedItem = true;
            this.isMapLoad = false;
            if (this.suggestView) {
                this.suggestView.state.set('requestString', this.address);
            }
        },

        clearSuggestions() {
            if (this.suggestView) {
                this.suggestView.clear();
            }
        },

        updatePlacemark(selectedItemData) {
            if (this.placemark && this.mapInstance) {
                this.mapInstance.geoObjects.remove(this.placemark);
            }
            const {displayName, coords} = selectedItemData;

            this.placemark = new ymaps.Placemark(coords, {
                balloonContent: displayName,
            });
            //this.mapInstance.geoObjects.add(this.placemark);
            //this.mapInstance.setCenter(coords);
        },

        getAddressByCoordinates(cityData) {
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
        },

        difCity() {
            this.isMapActive = false;
            this.selectedItem = null;
            this.isSelect = false;
            this.clearSuggestions;
        },

        submitForm() {
            this.isSelect = true;

            this.submitDataToHTML();
            this.updateModal(false);
        },

        submitDataToHTML() {
            const inputElement = document.querySelector("#deliveryPost");
            inputElement.value = this.address;
        },

        updateModal(data) {
            this.$emit("onUpdateModalHandler", data);
        },

        getCity(data) {
            this.city = data;
        }
    }
}
</script>

<style>
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