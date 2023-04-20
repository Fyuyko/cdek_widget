<template>

<!--
  <form id="city" v-if="step === 'one'">
    <input type="text" :value="this.city" @input="event => this.city = event.target.value">
    <button class="button-map" @click.prevent="stepOne()">Далее</button>
  </form>

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

  <MapComponent :city="this.city" :show="this.show"/>-->

    <div>
        <h1>Выберите город и ПВЗ СДЭК</h1>

        <div>
            <label for="city">Город:</label>
            <input type="text" id="city" v-model="cityName" />
            <button @click="searchPVZ">Поиск</button>
        </div>

        <div v-if="showPVZSelect">
            <label for="pvz">ПВЗ СДЭК:</label>
            <select id="pvz" v-model="selectedPVZ">
                <option v-for="pvz in pvzList" :value="pvz">{{ pvz.address }}</option>
            </select>
            <button @click="showMap">Показать на карте</button>
        </div>

        <div v-if="showMapSection">
            <div id="map"></div>
            <button @click="selectPVZ">Выбрать этот пункт</button>
        </div>
    </div>

</template>

<script>
import MapComponent from "./mapComponent.vue";
//import * as data from "../data/data.json";

//createSelect();

export default {

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