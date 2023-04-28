<template>
    <div class="template">
        <CityComponent :isMapActive="isMapActive" :isSelect="isSelect" @onGetSelectItem="getSelectedItem" @onUpdateIsSelect="updateIsSelect" @onUpdateIsMapActive="updateIsMapActive"/>
        <MapComponent :isMapActive="isMapActive"/>
        <SelectItemComponent :isSelect="isSelect" :selectedItem="selectedItem" @onUpdateIsSelect="updateIsSelect" @onUpdateIsMapActive="updateIsMapActive"/>
    </div>
</template>

<script>
import CityComponent from "@/components/CityComponent.vue";
import MapComponent from "@/components/MapComponent.vue";
import SelectItemComponent from "@/components/SelectItemComponent.vue";

export default {
    name: "TemplateComponent",
    components: {SelectItemComponent, MapComponent, CityComponent},

    data() {
        return {
            change: false,
            selectedItem: null,
            isSelect: null,
            isMapActive: null,
        }
    },

    methods: {
        getSelectedItem(data) {
            this.selectedItem = data;
        },
        updateIsSelect(newValue) {
            this.isSelect = newValue;
        },
        updateIsMapActive(data) {
            this.isMapActive = data;
        },
    }
}
</script>

<style lang="scss">
    .template {
        text-align: center;
    }
</style>