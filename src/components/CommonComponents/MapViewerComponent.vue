<template>
    <div class="delivery-point__map">
        <div v-if="!isMapLoad" class="delivery-point__map-content" id="map"></div>
        <v-progress-linear v-if="isMapLoad" indeterminate></v-progress-linear>
    </div>
</template>

<script>
export default {
    name: "MapViewerComponent",

    props: ["identify", "isMapLoad"],
}
</script>

<style scoped>

</style>