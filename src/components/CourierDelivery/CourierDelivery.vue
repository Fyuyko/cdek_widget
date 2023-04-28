<template>
    <div>
        <label>Введите адрес доставки:</label>
        <input type="text" placeholder="Адрес">
    </div>
    <map-component/>
</template>

<script>
import MapComponent from "@/components/MapComponent.vue";

export default {
    name: "CourierDelivery",
    components: {MapComponent},

    data() {
        return {

        }
    }


}
</script>

<style>

</style>