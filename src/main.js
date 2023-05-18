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

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
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
        const mapIcon = document.createElement("img");
        mapIcon.setAttribute("src", "./map.png");
        modalHandlerButton.appendChild(mapIcon);

        modalHandlerButton.classList.add("modal__button");
        input.after(modalHandlerButton);
        input.parentElement.setAttribute("style", "position: relative");

        return true;
    }
    return false;
}
