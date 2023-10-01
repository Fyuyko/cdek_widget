import { defineStore } from "pinia";
import {ref} from "vue";

export const useIndexStore = defineStore("index", () => {
    const yandexApiKey = "a711900d-1c87-47be-af2f-49fbd6272f72";
    const openModalButtonAttribute = ".modal__button";
    const receivedInputElementAttribute = "#billing_cdek";

    const showModal = ref(false);
    const deliveryMethod = ref("");
    const deliveryComponent = ref(null);

    function changeRefProp(prop, data) {
        this[prop] = data;
    }

    return {
        yandexApiKey,
        openModalButtonAttribute,
        receivedInputElementAttribute,
        showModal,
        deliveryMethod,
        deliveryComponent,
        changeRefProp
    }
});