import {createApp} from 'vue';
import App from './App.vue';
import IndexComponent from "@/components/IndexComponent.vue";

import './assets/main.scss';

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    createInputButton();
    searchDeliveryPost();
}

function createInputButton() {
    const input = document.getElementById("deliveryPost");

    if (input) {
        let createAppButton, createAppInput;
        createAppButton = document.createElement("button");
        createAppButton.innerHTML = "map";
        createAppButton.classList.add("create-app__button");
        createAppInput = document.createElement("div");
        input.parentElement.appendChild(createAppInput);
        createAppInput.classList.add("create-app");
        createAppInput.appendChild(input);
        createAppInput.appendChild(createAppButton);

        createAppInput.setAttribute("style", "position: relative;" );
        createAppButton.setAttribute("style", "position: absolute; top: 50%; right: 10px; transform: translateY(-50%)");

        /*let newAddress = "Москва, улица такая-то";

        input.value = newAddress;*/
    }
}

function searchDeliveryPost() {
    const createAppButton = document.querySelector(".create-app__button");
    const appContainer = document.querySelector("#app");

    //сделать проверку: если есть - показать, нет - создать
    createAppButton.addEventListener("click", () => {
        if (appContainer.childNodes.length === 0) {
            createApp(App).mount('#app');
        } else {

        }
    });
}
