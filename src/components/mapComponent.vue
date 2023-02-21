<template>
  <div :class="{show: this.show}" id="map"></div>
</template>

<script>
import {createMap} from "../scripts/mapYandex.js";

export default {
  name: "mapComponent",

  props: ["show", "city"],

  methods: {
    directGeocoding() {
      createMap(this.city);
    }
  },
}
</script>

<style scoped lang="scss">
  #map {
    width: 600px;
    height: 400px;

    padding-top: 40px;

    opacity: 0;
    pointer-events: none;

    &.show {
      opacity: 1;
      pointer-events: all;
    }
  }
</style>