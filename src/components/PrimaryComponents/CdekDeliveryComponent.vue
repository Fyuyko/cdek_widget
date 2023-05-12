<template>
    <div class="template" v-if="deliveryMethod==='cdek'" >
        <CitySelectorComponent @getCity="getCity" @mapHandler="mapHandler" :isMapActive="isMapActive" :isSelect="isSelect" :cityError="cityError" :city="city"/>

        <BackButtonComponent :isMapActive="isMapActive" :isSelect="isSelect" @difCity="difCity"/>

        <MapViewerComponent :index="mapIndex" :isMapActive="isMapActive" :isMapLoad="isMapLoad" :isSelect="isSelect"/>

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
    name: "CdekDeliveryComponent",
    components: {
        AddressSelectorComponent,
        MapViewerComponent,
        CitySelectorComponent,
        BackButtonComponent,
        VBtn, VTextField, VProgressLinear, VCard,
    },

    props: ["onUpdateModalHandler", "deliveryMethod",  "yandexApiKey",],

    data() {
        return {
            city: "",
            cityError: false,
            selectedItem: null,
            isMapLoad: false,
            isMapActive: false,
            isSelect: false,
            itemAddress: "",

            selectText: "Выбрать этот пункт",
            mapIndex: "mapAddress",
        }
    },

    methods: {
        async mapHandler() {
            this.isMapActive = true;
            this.isMapLoad = true;

            // Запрос к сервису геокодирования
            const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${this.yandexApiKey}&format=json&geocode=${this.city}`) // получаем данные о городе
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

            //Получение данных о городе из ответа сервиса геокодирования
            let cityLimits, cityCenter, cityLimitsArray;
            if (geocodeData.response.GeoObjectCollection.featureMember[0]) {
                this.cityError = false;
                cityLimits = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
                cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города

                if (cityLimits) {
                    cityLimitsArray = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];
                }
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

            //Создание карты и вывод найденных пунктов
            if (cityCenter && cityLimitsArray) {
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
                        if (res) {
                            myMap.geoObjects.add(res.geoObjects);
                        }
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
            }
        },

        difCity() {
            this.isMapActive = false;
            this.selectedItem = null;
            this.isSelect = false;
        },

        submitForm() {
            this.isSelect = true;

            this.updateModal(false);
            this.submitDataToHTML();
        },

        submitDataToHTML() {
            const inputElement = document.querySelector("#deliveryPost");
            inputElement.value = this.itemAddress;
        },

        updateModal(data) {
            this.$emit("onUpdateModalHandler", data);
        },

        getCity(data) {
            this.city = data;
        }
    },

}
</script>

<style lang="scss">
    .template {
        position: relative;
    }

    .delivery-point__city {
        text-align: start;

        label {
            padding-bottom: 15px;
        }

        input {
            margin: 0;
            flex: 2;
        }

        button {
            margin: 0;
            flex: 1;
        }
    }

    .delivery-point__select {
        display: grid;
        grid-template-areas: "address address address" "point okey .";
        gap: 15px 20px;

        button {
            margin: 0;
        }

        &-point {
            grid-area: point;
        }

        &-okey {
            grid-area: okey;
        }

        &-address {
            font-size: 20px;
            line-height: 1.5;
            grid-area: address;
        }
    }

    .delivery-point__map {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 400px;

        &-content {
            height: 100%;
            width: 100%;
            margin: 0 auto;

            padding-top: 20px;

            &.show {
                opacity: 1;
                pointer-events: all;
            }
        }

        &-load {
            width: 100%;
            margin: 30px auto;
        }

        .ymaps-2-1-79-controls__toolbar_left,
        .ymaps-2-1-79-controls__toolbar_right {
            display: none;
        }
    }

</style>