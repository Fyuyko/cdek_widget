<template>
    <CitySelectorComponent v-if="!isMapActive" @getCity="getCity" @mapHandler="mapHandler" :cityError="cityError" />

    <BackButtonComponent v-if="isMapActive" @difCity="difCity" />

    <div v-if="isMapActive && deliveryMethod === 'cdek'">
      <MapViewerComponent :isMapLoad="isMapLoad" />
    </div>

    <div v-else-if="isMapActive && deliveryMethod === 'address'" class="delivery-point__map-wrapper">
      <v-text-field class="input" id="suggest" v-model="address" :rules="addressRules" label="Введите адрес" @input="handleInput"></v-text-field>
      <MapViewerComponent :isMapLoad="isMapLoad" />
    </div>

    <AddressSelectorComponent v-if="address" :text="deliveryMethod === 'cdek' ? 'Выбрать этот пункт' : 'Выбрать этот адрес'" :disabled="!!addressError" @submitForm="submitForm" />
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

  emits: ['onUpdateModalHandler'],
  props: ["deliveryMethod", "deliveryMethod", "yandexApiKey",],

  data() {
    return {
      city: "",
      address: "",
      addressError: null,
      addressRules: [
            value => {
                if (!this.addressError) return true;

                return `${this.addressError}`;
            },
        ],


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

    async geocodeData(apiKey, city) {
      const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${city}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        this.isMapLoad = false;
        return await response.json();
      } catch (error) {
        console.log(error);
        return null;
      }
    },

    //СДЕК карта
    async mapPointHandler() {
      this.isMapActive = true;
      this.isMapLoad = true;

      const geocodeJson = await this.geocodeData(this.yandexApiKey, this.city);

      let cityLimits, cityCenter, cityLimitsArray;
      if (geocodeJson.response.GeoObjectCollection.featureMember[0]) {
        this.cityError = false;
        cityLimits = geocodeJson.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города
        cityCenter = geocodeJson.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города

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

      const geocodeJson = await this.geocodeData(this.yandexApiKey, this.city);

      let cityCenter;
      if (geocodeJson.response.GeoObjectCollection.featureMember[0]) {
        this.cityError = false;
        cityCenter = geocodeJson.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();
      } else {
        this.difCity();
        this.cityError = true;
        this.isMapLoad = false;
      }

      if (cityCenter) {
        const myMap = new ymaps.Map("map", {
          center: cityCenter,
          zoom: 13
        }, {
          searchControlProvider: 'yandex#search'
        });

        let myPlacemark;

        this.suggestView = new ymaps.SuggestView("suggest");

        /*this.suggestView.events.add("select", (event) => {
          const selectedItem = event.get("item");
          this.address = selectedItem.value;

          ymaps.geocode(this.address).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const coords = firstGeoObject.geometry.getCoordinates();
            updatePlacemark(coords);
            getAddress(coords);
            myMap.setCenter(coords);
          });
        });*/

        const handleSelect = (event) => {
            const selectedItem = event.get("item");
            this.address = selectedItem.value;

            ymaps.geocode(this.address).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const coords = firstGeoObject.geometry.getCoordinates();
                updatePlacemark(coords);
                getAddress(coords);
                myMap.setCenter(coords);
            });
        };

        this.suggestView.events.add("select", handleSelect);

        myMap.events.add("click", (e) => {
          const coords = e.get("coords");
          updatePlacemark(coords);
          getAddress(coords);
        });

        const createPlacemark = (coords) => {
          return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
          }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
          });
        }

        const updatePlacemark = (coords) => {
          if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
          } else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            myPlacemark.events.add("dragend", () => {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
          }
        }

        // адрес для выведения в подсказке
        const getAddress = (coords) => {
          myPlacemark.properties.set('iconCaption', 'поиск...');
          ymaps.geocode(coords).then(res => {
            const firstGeoObject = res.geoObjects.get(0);
            this.address = firstGeoObject.getAddressLine();
            addressValidation(firstGeoObject);

            myPlacemark.properties
              .set({
                iconCaption: [
                  firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                  firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                balloonContent: firstGeoObject.getAddressLine()
              });
          });
        }

        const addressValidation = (geoObject) => {
            let addressError;

            switch (geoObject.properties.get("metaDataProperty.GeocoderMetaData.precision")) {
                case "exact":
                    break;
                case "number":
                case "near":
                case "range":
                    addressError = "Уточните номер дома";
                    break;
                case "street":
                    addressError = "Уточните номер дома";
                    break;
                case "other":
                default:
                    addressError = "Уточните адрес";
            }

            if (addressError) {
                this.addressError = addressError;
            } else {
                this.addressError = null;
            }
        }
      }
    },

    handleInput() {
      this.isMapLoad = false;
      if (this.suggestView) {
        this.suggestView.state.set("requestString", this.address);
      }
    },

    clearSuggestions() {
      if (this.suggestView) {
        this.suggestView.clear();
      }
    },

    // Общие методы
    difCity() {
      this.isMapActive = false;
      this.address = "";

      //this.clearSuggestions();
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

  .v-input__details {
    z-index: -1;
  }

  .input_error, .input_error:focus {
    outline: none;
    border: 1px solid #f33;
    box-shadow: 0 0 1px 1px #f33;
  }
</style>