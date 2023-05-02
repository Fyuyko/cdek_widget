import {createApp} from 'vue';
import App from './App.vue';

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
        createAppButton.innerHTML = "Выбрать на карте";
        createAppButton.classList.add("create-app__button");
        createAppInput = document.createElement("div");
        input.parentElement.appendChild(createAppInput);
        createAppInput.classList.add("create-app");
        createAppInput.appendChild(input);
        createAppInput.appendChild(createAppButton);

        createAppInput.setAttribute("style", "position: relative;" );
        createAppButton.setAttribute("style", "position: absolute; top: 50%; right: 10px; transform: translateY(-50%)");


    }
}

function searchDeliveryPost() {
    const createAppButton = document.querySelector(".create-app__button");

    //сделать проверку: сли есть - показать, нет - создать
    createAppButton.addEventListener("click", () => {
        createApp(App).mount('#app');
    });
}
