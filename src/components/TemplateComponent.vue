<template>
    <div class="template">
        <div class="delivery-point__city">
            <div v-if="!isMapActive && !isSelect">
                <label>{{ !cityError ? "Введите название города:" : "Не правильно введено название, попробуйте еще раз:"}}</label>
                <div class="delivery-point__city-name">
                    <input v-model="city" @input="city.length > 0 ? isButtonDisabled = false : isButtonDisabled = true" type="text" placeholder="Название города">
                    <!--<button @click.prevent="mapHandler" :disabled="isButtonDisabled">Показать пункты</button>-->
                    <v-btn @click.native.prevent="(e) => mapHandler(e)" :disabled="isButtonDisabled">
                        Показать пункты
                    </v-btn>
                </div>
            </div>
            <div v-else-if="isMapActive && !isSelect">
                <!--<button @click.prevent="difCity">Выбрать другой город</button>-->
                <v-btn @click.prevent="difCity">
                    Выбрать другой город
                </v-btn>
            </div>
        </div>

        <div v-if="isMapActive" class="delivery-point__map" :style="{ display: isSelect ? 'none' : 'block' }">
            <div v-if="!isMapLoad" class="delivery-point__map-content" id="map"></div>
            <div v-if="isMapLoad" class="delivery-point__map-load">Загрузка...</div>
        </div>

        <div class="delivery-point__select">
            <button class="delivery-point__select-point" v-if="isSelect" @click="difItem">
                Выбрать другой пункт
            </button>
            <button class="delivery-point__select-okey" v-if="isSelect" @click.prevent="() => updateModal(false)">
                Ок
            </button>
            <div class="delivery-point__accept" v-if="selectedItem && !isSelect">
                <button @click.prevent="submitForm()" type="submit">Выбрать этот пункт</button>
            </div>
            <div v-else-if="selectedItem && isSelect" ref="address" class="delivery-point__select-address">
                Вы выбрали пункт по улице {{itemAddress}}
            </div>
        </div>
    </div>
</template>

<script>
import {VBtn} from "vuetify/components";

export default {
    name: "TemplateComponent",
    components: {
        VBtn,
    },

    props: ["onUpdateModalHandler"],

    data() {
        return {
            yandexApiKey: "",
            city: "",
            cityError: false,
            selectedItem: null,
            isMapLoad: false,
            isMapActive: false,
            isButtonDisabled: true,
            isSelect: false,
            itemAddress: "",
        }
    },

    mounted() {
        const inputElement = document.querySelector("#deliveryPost");
        this.yandexApiKey = inputElement.dataset.yandexKey;
    },

    methods: {
        async mapHandler(e) {
            e.preventDefault();

            this.isMapActive = true;
            this.isMapLoad = true;

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
                            map.geoObjects.add(res.geoObjects);
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

        difItem() {
            this.isMapActive = true;
            this.selectedItem = null;
            this.isSelect = false;
            this.itemAddress = null;
        },

        submitForm() {
            this.itemAddress = this.selectedItem.address;
            this.isSelect = true;

            this.submitDataToHTML()
        },

        submitDataToHTML() {
            const inputElement = document.querySelector("#deliveryPost");
            inputElement.value = this.itemAddress;
        },

        updateModal(data) {
            this.$emit("onUpdateModalHandler", data);
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

        &-name {
            display: flex;
            align-items: center;
            gap: 20px;
        }

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
        grid-template-areas: "address address address" "point point okey";
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
        &-content {
            width: 600px;
            height: 400px;
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