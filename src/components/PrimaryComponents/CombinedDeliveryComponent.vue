<template>
    <CitySelectorComponent v-if="!primaryStore.isMapActive" @mapHandler="mapHandler"/>

    <BackButtonComponent v-if="primaryStore.isMapActive" @difCity="difCity" />

    <div v-if="primaryStore.isMapActive && deliveryMethod === 'cdek'">
      <MapViewerComponent/>
    </div>

    <div v-else-if="primaryStore.isMapActive && deliveryMethod === 'address'" class="delivery-point__map-wrapper">
      <v-text-field class="input" id="suggest" v-model="primaryStore.address" :rules="primaryStore.addressRules" label="Введите адрес" @input="handleInput"></v-text-field>
      <MapViewerComponent/>
    </div>

    <AddressSelectorComponent v-if="primaryStore.address" :text="deliveryMethod === 'cdek' ? 'Выбрать этот пункт' : 'Выбрать этот адрес'" :disabled="!!primaryStore.addressError" @submitForm="submitForm" />
</template>

<script setup>
import {VTextField} from "vuetify/components";
import BackButtonComponent from "@/components/CommonComponents/BackButtonComponent.vue";
import CitySelectorComponent from "@/components/CommonComponents/CitySelectorComponent.vue";
import MapViewerComponent from "@/components/CommonComponents/MapViewerComponent.vue";
import AddressSelectorComponent from "@/components/CommonComponents/AddressSelectorComponent.vue";
import {defineComponent, ref} from "vue";
import {usePrimaryStore} from "@/store/promaryStore";
import {useIndexStore} from "@/store/indexStore";

defineComponent(["VTextField", "CitySelectorComponent", "BackButtonComponent", "MapViewerComponent", "AddressSelectorComponent"]);
const props = defineProps(["deliveryMethod", "yandexApiKey",]);

const indexStore = useIndexStore();
const primaryStore = usePrimaryStore();

function mapHandler() {
  primaryStore.changeRefProp("isMapActive", true);

  if (props.deliveryMethod === "cdek") {
    mapPointHandler();
  } else if (props.deliveryMethod === "address") {
    mapAddressHandler();
  }
}

function createMapInstance() {
  return new ymaps.Map("map", {
    center: primaryStore.cityCenter,
    zoom: 13
  }, {
    searchControlProvider: "yandex#search"
  });
}

async function geocodeData() {
  const geocodeJson = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${props.yandexApiKey}&format=json&geocode=${primaryStore.city}`)
    .then(response => {
      try {
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        primaryStore.changeRefProp("isMapLoad", false);
        return response.json();
      } catch (error) {
        console.log(error);
        return null;
      }
    });

  if (geocodeJson.response.GeoObjectCollection.featureMember[0]) {
    primaryStore.cityError = false;

    primaryStore.cityCenter = geocodeJson.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ").reverse();  //Центр города
    const cityLimits = geocodeJson.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;  // Границы полученного города

    if (cityLimits) {
      primaryStore.cityLimitsArray = [cityLimits.lowerCorner.split(" ").reverse(), cityLimits.upperCorner.split(" ").reverse()];
    }
  } else {
    difCity();
    primaryStore.cityError = true;
    primaryStore.isMapLoad = false;
  }
}

//СДЕК карта
async function mapPointHandler() {
  primaryStore.changeRefProp("isMapLoad", true);

  await geocodeData();

  //Создание карты и вывод найденных пунктов
  if (primaryStore.cityCenter && primaryStore.cityLimitsArray) {

    ymaps.ready(() => {
      let myMap = createMapInstance();

      // подключаем элемент управления "Поиск по карте"
      let searchControl = new ymaps.control.SearchControl({
        options: {
          provider: 'yandex#search',
          results: 100,
          noPopup: true,
          strictBounds: false,
          boundedBy: primaryStore.cityLimitsArray,
        }
      });

      // это мы запускаем поиск и отображаем точки на карте
      searchControl.search(`СДЕК ПВЗ ${city.value}`).then(res => {
        if (res) {
          myMap.geoObjects.add(res.geoObjects);
        }
      });

      // это мы получаем выбранный элемент (на который тыкнул пользователь)
      searchControl.events.add("resultselect", e => {
        searchControl.getResult(e.get('index')).then(res => {
          let selectedItem = res.properties.getAll();
          primaryStore.changeRefProp("address", selectedItem.address);
        });
      })

      myMap.controls.add(searchControl);
      myMap.container.fitToViewport();
    });
  }
}

 //Карта доставки и ее методы
async function mapAddressHandler() {
  primaryStore.changeRefProp("isMapLoad", true);
  await geocodeData();

  if (primaryStore.cityCenter) {
    let myMap = createMapInstance();

    let myPlacemark;

    primaryStore.changeRefProp("suggestView", new ymaps.SuggestView("suggest"));


    primaryStore.changeSuggestViewEvent();

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
        primaryStore.address = firstGeoObject.getAddressLine();
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
        primaryStore.addressError.value = addressError;
      } else {
        primaryStore.addressError.value = null;
      }
    }
  }
}

function handleInput() {
  primaryStore.changeRefProp("isMapLoad", false);

  if (primaryStore.suggestView) {
    primaryStore.changeSuggestViewState();
  }
}

// Общие методы
function difCity() {
  primaryStore.changeRefProp("isMapActive", false);
  primaryStore.changeRefProp("address", "");
  primaryStore.changeRefProp("addressError", null);
}

function submitForm() {
  indexStore.showModal = false;
  submitDataToHTML();
}

function submitDataToHTML() {
  const inputElement = document.querySelector("#billing_cdek");
  inputElement.value = primaryStore.address;
}

</script>

<style scoped lang="scss">
  @mixin media-tablet {
    @media (max-width: 768 + 1px) {
      @content;
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