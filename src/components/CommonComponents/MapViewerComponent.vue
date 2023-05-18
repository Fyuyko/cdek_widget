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

<style scoped lang="scss">
    @mixin media-tablet {
        @media (max-width: 768 + 1px) {
            @content;
        }
    }

    .delivery-point__map {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 400px;

        @include media-tablet {
            height: 250px;
        }

        &-content {
            height: 100%;
            width: 100%;
            margin: 0 auto;

            &.show {
                opacity: 1;
                pointer-events: all;
            }
        }

        &-load {
            width: 100%;
            margin: 30px auto;
        }

        .ymaps-2-1-79-controls__toolbar_left,
        .ymaps-2-1-79-controls__toolbar_right {
            display: none;
        }
    }
</style>