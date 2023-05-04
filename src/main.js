import {createApp} from 'vue';
import App from './App.vue';
import IndexComponent from "@/components/IndexComponent.vue";

import './assets/main.scss';

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    createInputButton();
    createApp(App).mount("#app");
}

function createInputButton() {
    const input = document.getElementById("deliveryPost");

    if (input) {
        const modalHandlerButton = document.createElement("button");
        const mapIcon = document.createElement("img");
        mapIcon.setAttribute("src", "../map.png");
        modalHandlerButton.appendChild(mapIcon);

        modalHandlerButton.classList.add("modal__button");
        input.after(modalHandlerButton);
        input.parentElement.setAttribute("style", "position: relative");
    }
}

function searchDeliveryPost() {
    const createAppButton = document.querySelector(".create-app__button");
    const appContainer = document.querySelector("#app");
    const createMyApp = () => createApp(App);
    let appInstance = null;

    createAppButton.addEventListener("click", () => {
        if (!appInstance) {
            appInstance = null;
            appInstance = createMyApp().mount("#app");
        }
    });
}
