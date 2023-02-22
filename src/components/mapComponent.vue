<template>
  <div :class="{show: this.show}" id="map"></div>
</template>

<script>
import {searchOnMap} from "../scripts/mapYandex.js";

export default {
  name: "mapComponent",

  props: ["show", "city"],

  data() {
    return {
      map: '',
    }
  },

  created() {
    searchOnMap();
  },

  /*methods: {
    createMap() {
      const myMap = () => new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 9
      });

      ymaps.ready(myMap);
    },
  },*/

  watch: {

    city() {
      searchOnMap(this.city);
    }
  }
}
</script>

<style scoped lang="scss">
  #map {
    width: 600px;
    height: 400px;

    padding-top: 40px;

    //opacity: 0;
    //pointer-events: none;

    &.show {
      opacity: 1;
      pointer-events: all;
    }
  }
</style>