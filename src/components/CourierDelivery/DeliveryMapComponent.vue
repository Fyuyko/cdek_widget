<template>
    <div v-if="this.isCity" class="mapDelivery" id="mapDelivery"></div>
</template>

<script>
export default {
    name: "deliveryMapComponent",

    props: ["isCity"],

    data() {
        return {

        }
    }
}
</script>

<style lang="scss">
    #mapDelivery {
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