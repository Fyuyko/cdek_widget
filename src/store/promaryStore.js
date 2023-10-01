import { defineStore } from "pinia";
import {ref} from "vue";

export const usePrimaryStore = defineStore("primary", () => {
    const city = ref("");
    const cityCenter = ref("");
    const cityLimitsArray = ref("");
    const address = ref("");
    const addressError = ref(null);

    const addressRules = addressError ? true : addressError.value;

    const cityError = ref(false);
    const isMapLoad = ref(false);
    const isMapActive = ref(false);

    const mapInstance = ref(null);
    const suggestView = ref(null);
    const placemark = ref(null);

    function changeRefProp(prop, data) {
        this[prop] = data;
    }

    function changeSuggestViewState() {
        suggestView.value.state.set("requestString", address.value);
    }

    function changeSuggestViewEvent() {
        suggestView.events.add("select", (event) => {
            const selectedItem = event.get("item");
            address.value = selectedItem.value;

            ymaps.geocode(primaryStore.address).then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const coords = firstGeoObject.geometry.getCoordinates();
                updatePlacemark(coords);
                getAddress(coords);
                myMap.setCenter(coords);
            });
        });
    }

    return {
        city,
        cityCenter,
        cityLimitsArray,
        address,
        addressError,
        addressRules,
        cityError,
        isMapLoad,
        isMapActive,
        mapInstance,
        suggestView,
        placemark,
        changeRefProp,
        changeSuggestViewState,
        changeSuggestViewEvent,
    }
});