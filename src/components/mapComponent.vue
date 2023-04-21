<template>
    <yandex-map
        :coords="coords"
        :zoom="10"
        @click="onClick"
    >
        <ymap-marker
            :coords="coords"
            marker-id="123"
            hint-content="some hint"
        />
    </yandex-map>
</template>

<script>
import { ymapPlugin } from 'vue-yandex-maps';

export default {
    name: "mapComponent",

    components: {
        ymapPlugin,
    },

    props: ["show", "city"],

    data() {
        return {
            postData: [],
            coords: [
                54.82896654088406,
                39.831893822753904,
            ],
        }
    },

    created() {

    },

    methods: {
        createMap() {

        },

    },

    watch: {
        city() {

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