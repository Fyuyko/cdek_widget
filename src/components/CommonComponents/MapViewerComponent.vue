<template>
    <div v-if="isMapActive" class="delivery-point__map" :style="{ display: isSelect ? 'none' : 'flex' }">
        <div v-if="!isMapLoad" class="delivery-point__map-content" id="{{index}}"></div>
        <v-progress-linear v-if="isMapLoad" indeterminate></v-progress-linear>
    </div>
</template>

<script>
export default {
    name: "MapViewerComponent",

    props: ["index", "isMapActive", "isMapLoad", "isSelect"],
}
</script>

<style scoped>

</style>