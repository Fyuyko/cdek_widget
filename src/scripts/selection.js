import * as Choices from "../../node_modules/choices.js/public/assets/scripts/choices.js";

export function createSelect(city = "Москва") {
    //const element = document.querySelector('[data-choice]');


    const choices = new Choices("[data-choice]", {
        searchEnabled: true,
        position: 'bottom',
        itemSelectText: ''
    });

    return choices;

}
