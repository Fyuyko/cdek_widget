import {createApp} from 'vue';
import App from './App.vue';
import IndexComponent from "@/components/IndexComponent.vue";

import './assets/main.scss';

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    createInputButton();
    //searchDeliveryPost();

    createApp(App).mount("#app");
}

function createInputButton() {
    const input = document.getElementById("deliveryPost");

    if (input) {
        const modalHandlerButton = document.createElement("button");
        modalHandlerButton.innerHTML = "on map";
        modalHandlerButton.classList.add("modal__button");
        input.after(modalHandlerButton);
        input.parentElement.setAttribute("style", "position: relative");

        /*let newAddress = "Москва, улица такая-то";

        input.value = newAddress;*/
    }
}

function searchDeliveryPost() {
    const createAppButton = document.querySelector(".create-app__button");
    const appContainer = document.querySelector("#app");
    const createMyApp = () => createApp(App);
    let appInstance = null;

    //сделать проверку: если есть - показать, нет - создать
    createAppButton.addEventListener("click", () => {
        if (!appInstance) {
            appInstance = null;
            appInstance = createMyApp().mount("#app");
        }
    });
}
