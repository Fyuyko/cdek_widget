<template>
    <CitySelectorComponent v-if="!isMapActive" @getCity="getCity" @mapHandler="mapHandler" :cityError="cityError" />

    <BackButtonComponent v-if="isMapActive" @difCity="difCity" />

    <div v-if="isMapActive && deliveryMethod === 'cdek'">
      <MapViewerComponent :isMapLoad="isMapLoad" />
    </div>

    <div v-else-if="isMapActive && deliveryMethod === 'address'" class="delivery-point__map-wrapper">
      <div class="delivery-point__map-select">
        <v-text-field class="input" id="suggest" v-model="address" label="Введите адрес" @input="handleInput"></v-text-field>
        <p id="notice">Адрес не найден</p>
      </div>
      <MapViewerComponent :isMapLoad="isMapLoad" />
    </div>

    <AddressSelectorComponent v-if="address" :text="deliveryMethod === 'cdek' ? 'Выбрать этот пункт' : 'ыбрать этот адрес'" @submitForm="submitForm" />
</template>

<script>
import {VTextField} from "vuetify/components";
import BackButtonComponent from "@/components/CommonComponents/BackButtonComponent.vue";
import CitySelectorComponent from "@/components/CommonComponents/CitySelectorComponent.vue";
import MapViewerComponent from "@/components/CommonComponents/MapViewerComponent.vue";
import AddressSelectorComponent from "@/components/CommonComponents/AddressSelectorComponent.vue";

export default {
  name: "CombinedDeliveryComponent",

  components: {
    VTextField,
    CitySelectorComponent,
    BackButtonComponent,
    MapViewerComponent,
    AddressSelectorComponent
  },

  props: ["onUpdateModalHandler", "deliveryMethod", "deliveryMethod", "yandexApiKey",],

  data() {
    return {
      city: "",
      address: "",

      cityError: false,
      isMapLoad: false,
      isMapActive: false,

      mapInstance: null,
      suggestView: null,
      placemark: null,
    };
  },
  methods: {
    mapHandler() {
      if (this.deliveryMethod === "cdek") {
        this.mapPointHandler();
      } else if (this.deliveryMethod === "address") {
        this.mapAddressHandler();
      }
    },
    //СДЕК карта
    async mapPointHandler() {
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
        this.address = selectedItem.address;
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

    //Карта доставки и ее методы
    async mapAddressHandler() {
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

      if (cityCenter) {
        this.mapInstance = new ymaps.Map("map", {
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
        });

        this.mapInstance.container.fitToViewport();
      }
    },

    handleInput() {
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

    // Общие методы
    difCity() {
      this.isMapActive = false;
      this.address = "";
    },

    submitForm() {
      this.updateModal(false);
      this.submitDataToHTML();
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

<style lang="scss">
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