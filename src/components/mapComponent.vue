

<template>
    <div class="yandex-map">
        <yandex-map :center="center" :zoom="zoom">
            <template id="default">
                <ymap-marker
                        v-for="point in points"
                        :key="point.id"
                        :geometry="[point.lon, point.lat]"
                        :properties="{ hintContent: point.name }"
                        @click="selectPoint(point)"
                />
            </template>
        </yandex-map>
    </div>
</template>

<script>
import axios from 'axios';

const baseURL = 'https://geocode-maps.yandex.ru/1.x/';
const apiKey = '88398772-1a4b-4234-b8b9-b3dacf1b135e';

import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  name: "mapComponent",

    components: {
        yandexMap,
        ymapMarker,
    },

    props: {
        points: Array,
        center: {
            type: Array,
            default: [55.753215, 37.622504] // Москва, если координаты не переданы
        },
        zoom: {
            type: Number,
            default: 10
        }
    },
    methods: {
        selectPoint(point) {
            this.$emit('point-selected', point)
        }
    },

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