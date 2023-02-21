<template>

  <!-- step 1 -->

  <form id="city" v-if="step === 'one'">
    <input type="text" :value="this.city" @input="event => this.city = event.target.value">
    <button class="button-map" @click.prevent="step = 'two'">Далее</button>
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

  <MapComponent :city="this.city" :show="this.show"/>

</template>

<script>
import MapComponent from "./mapComponent.vue";
import {createSelect} from "../scripts/selection.js";
//import * as data from "../data/data.json";

//createSelect();

export default {
  name: "IndexComponent",
  components: {MapComponent},

  data() {
    return {
      step: "one",
      city: "",
      show: false,
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