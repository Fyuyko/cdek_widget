import {createApp} from "vue";
import App from "./App.vue";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import "./assets/main.scss";
import "./assets/components/vuetify.scss"
import {tr} from "vuetify/locale";

document.addEventListener("DOMContentLoaded", () => {
    try {
        init();
    } catch (e) {
        console.log(e.message);
    }

});

function init() {
    const yandexApiKey = "a711900d-1c87-47be-af2f-49fbd6272f72";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${yandexApiKey}&lang=ru_RU`;
    document.head.appendChild(script);

    const appContainer = document.createElement("div");
    appContainer.id = "app";
    document.body.appendChild(appContainer);

    if (createInputButton()) {
        const vuetify = createVuetify({
            components,
            directives,
        })

        createApp(App).use(vuetify).mount("#app");
    }
}

function createInputButton() {
    const input = document.getElementById("billing_cdek");

    if (input) {
        const modalHandlerButton = document.createElement("button");
        const mapIcon = document.createElement("div");
        mapIcon.classList.add("modal__button-img");
        modalHandlerButton.appendChild(mapIcon);
        modalHandlerButton.type = "button";
        modalHandlerButton.classList.add("modal__button");
        input.after(modalHandlerButton);
        input.parentElement.style.position = "relative";

        return true;
    }
    throw new Error('input not found');
}
