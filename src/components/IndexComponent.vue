<template>

  <!-- step 1 -->

  <form id="city" v-if="step === 'one'">
    <select data-choice>
      <option value="" placeholder>This is a placeholder</option>
      <option v-for="city in cities">
        {{city.cityName}}
      </option>
    </select>
    <button class="button-map" @click.prevent="step = 'two'">Вперед</button>
    <button class="button-map" @click.prevent="show = !show">Карта</button>
  </form>

  <!-- step 2 -->

  <form id="point" v-else-if="step === 'two'">
    <button class="button-map" @click.prevent="step = 'one'">Назад</button>
    <select id="city">
      <option v-for="city in cities">
        {{city.address}}
      </option>
    </select>
    <button class="button-map">Подтвердить</button>
    <button class="button-map" @click.prevent="show = !show">Карта</button>
  </form>

  <MapComponent :show="this.show"/>

</template>

<script>
import MapComponent from "./mapComponent.vue";
import * as data from "../data/data.json";
import * as Choices from "../../node_modules/choices.js/public/assets/scripts/choices.js";

console.log(data.default)

/*const element = document.querySelector('[data-choice]');

if (element) {
  const choices = new Choices(element, {
    searchEnabled: true,
    position: 'bottom',
    itemSelectText: ''
  });

  const defaultValue = document.querySelector("option");
  defaultValue.innerHTML = `<span class="dropdown__title-initial">Тема обращения</span>`;
}*/

export default {
  name: "IndexComponent",
  components: {MapComponent},

  data() {
    return {
      step: "one",
      show: false,
      cities: [
        {
          "cityCode": "272",
          "code": "KEM4",
          "cityName": "Кемерово",
          "uuid": "6ca34b15-c797-4a30-95d9-5fdd826e00ea",
          "geoLatitude": "55.3637810",
          "geoLongitude": "86.0726547",
          "address": "пр-т Кузнецкий, 10"
        },
        {
          "cityCode": "137",
          "code": "SPB308",
          "cityName": "Санкт-Петербург",
          "uuid": "1af760f3-4c34-4e35-ab46-2580dac03269",
          "geoLatitude": "59.9435390",
          "geoLongitude": "30.2867180",
          "address": "ул. Кривошлыкова, 3"
        },
        {
          "cityCode": "137",
          "code": "MSK308",
          "cityName": "Москва",
          "uuid": "1af760f3-4c34-4e35-ab46-2580dac03269",
          "geoLatitude": "59.9435390",
          "geoLongitude": "30.2867180",
          "address": "ул. Воронина, 10/1"
        }
      ],
    }
  },


}

</script>

<style scoped lang="scss">
  select {
    width: 300px;
    border-radius: 0;
    padding: 10px 20px;
    //appearance: none;
  }
  .button-map {
    background-color: transparent;
    border: 1px solid red;
    border-radius: 0;
    padding: 10px;
  }
</style>