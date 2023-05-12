<template>
    <div class="delivery-point__city">

        <div v-if="!isMapActive && !isSelect">
            <label>{{cityError ? "Не правильно введено название, попробуйте еще раз:" : "Введите название города:"}}</label>
            <div class="delivery-point__city-name">
                <v-text-field v-model="city" @input="city.length > 0 ? isButtonDisabled = false : isButtonDisabled = true" label="Название города"></v-text-field>
                <v-btn color="blue" @click="onMapHandler" :disabled="isButtonDisabled">
                    Подтвердить
                </v-btn>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "SelectCityComponent",

    props: ["mapHandler", "isMapActive", "isSelect", "cityError", "city"],

    data() {
        return {
            isButtonDisabled: true,
        }
    },

    methods: {
        onMapHandler() {
            this.$emit("mapHandler");
        }
    }
}
</script>

<style scoped>

</style>