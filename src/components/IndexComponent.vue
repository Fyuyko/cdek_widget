<template>
    <h1>Выбор ПВЗ СДЭК</h1>
    <form id="city">
      <TemplateComponent :selectedItem="selectedItem" @onGetCity="getCity"/>
      <MapComponent :city="city" @onGetSelectedItem="getSelectedItem"/>
    </form>
</template>

<script>

import axios from 'axios';
import MapComponent from "@/components/MapComponent.vue";
import TemplateComponent from "@/components/TemplateComponent.vue";

export default {
    name: "IndexComponent",
    components: {TemplateComponent, MapComponent},

    data() {
        return {
            city: "",
            selectedItem: null,
        }
    },

    methods: {

      getCity(data) {
          this.city = data;
      },

      getSelectedItem(data) {
          this.selectedItem = data;
      },
    }
}

</script>

<style scoped lang="scss">

</style>