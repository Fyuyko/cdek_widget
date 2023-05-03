<template>
    <div class="template">
        <div class="delivery-point__city">
            <div v-if="!isMapActive && !isSelect">
                <label>{{ cityError ? "Введите название города:" : "Не правильно введено название, попробуйте еще раз:"}}</label>
                <div class="delivery-point__city-name">
                    <input v-model="city" @input="city.length > 0 ? isButtonDisabled = false : isButtonDisabled = true" type="text" placeholder="Название города">
                    <button @click.prevent="mapHandler" :disabled="isButtonDisabled">Показать пункты</button>
                </div>
            </div>
            <div v-else-if="isMapActive">
                <button @click.prevent="difCity">Выбрать другой город</button>
            </div>
        </div>

        <div class="delivery-point__map">
            <div v-if="isMapActive" class="map" id="map"></div>
            <div v-if="isMapActive">Загрузка...</div>
        </div>

        <div class="delivery-point__select">
            <button class="delivery-point__select-point" v-if="!isMapActive && isSelect" @click="difItem">
                Выбрать другой пункт
            </button>
            <button class="delivery-point__select-okey" v-if="!isMapActive && isSelect" @click.prevent="() => updateModal(false)">
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
const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";
import { ref, watch } from 'vue';

export default {
    name: "TemplateComponent",

    props: ["onUpdateModalHandler"],

    data() {
        return {
            city: "",
            cityError: true,
            selectedItem: null,
            isMapActive: false,
            isButtonDisabled: true,
            isSelect: false,
            //pvzList: [],  Можно использовать для выведения селекта
            itemAddress: "",
        }
    },

    methods: {
        async mapHandler() {
            this.isMapActive = true;

            const geocodeData = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${this.city}`) // получаем данные о городе
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error('Something went wrong');
                })
                .catch(error => {
                    console.log(error)
                })

            let cityLimits, cityCenter, cityLimitsArray;
            if (geocodeData.response.GeoObjectCollection.featureMember[0]) {
                this.cityError = true;
                cityLimits = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
                cityCenter = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города

                if (cityLimits) {
                    cityLimitsArray = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];
                }
            } else {
                this.difCity();
                this.cityError = false;
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
            this.isMapActive = false;
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

    /*setup() {
        const isMapActive = ref(false);
        const map = ref(null);
        const geocodeData = ref(null);

        async function fetchData() {
            const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=Москва`); // получаем данные о городе Todo: Заменить город!
            geocodeData.value = await response.json();

            if (geocodeData.response) {
                const cityLimits = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
                cityCenter.value = geocodeData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города
                cityLimitsArray.value = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];
            }
        }
        //fetchData();

        const searchOnMap = (control) => {
            // это мы запускаем поиск и отображаем точки на карте
            control.search(`СДЕК ПВЗ Москва`).then(res => {   //Todo: поменять город!
                console.log(res)

                //map.value.geoObjects.add(res.geoObjects);
            });
        }

        const createMap = async () => {
            if (!map.value) {
                const ymapsInstance = await ymaps.load();

                map.value = new ymapsInstance.Map("map",
                    {
                        center: [55.753994, 37.622093],  // Todo: добавлять каши координаты
                        zoom: 13
                    },
                    {
                        searchControlProvider: 'yandex#search',
                    }
                );

                const control = ymapsInstance.control.SearchControl({
                    options: {
                        provider: 'yandex#search',
                        results: 100,
                        noPopup: true,
                        strictBounds: false,
                        //boundedBy: cityLimitsArray,
                    }
                });

                map.value.controls.add(control);

                if (control) {
                    searchOnMap(control);
                }
            }
        };

        watch(isMapActive, async (newValue) => {
            if (newValue) {
                await createMap();
            } else {
                if (map.value) {
                    map.value.destroy();
                    map.value = null;
                }
            }
        });

        return {
            isMapActive,
            map,
            geocodeData,
        };
    }*/
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