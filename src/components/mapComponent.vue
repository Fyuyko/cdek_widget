<template>
    <div v-if="isMapActive" class="map" id="map"></div>
</template>

<script>
export default {
    name: "mapComponent",
    props: ["isMapActive"],
}

</script>

<style lang="scss">
  #map {
    width: 600px;
    height: 400px;
    margin: 0 auto;

    padding-top: 40px;

    &.show {
      opacity: 1;
      pointer-events: all;
    }
  }
</style>