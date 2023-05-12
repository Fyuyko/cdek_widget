<template>
    <div class="delivery-point__city">

        <div v-if="!isMapActive && !isSelect">
            <label>{{cityError ? "Не правильно введено название, попробуйте еще раз:" : "Введите название города:"}}</label>
            <div class="delivery-point__city-name">
                <v-text-field v-model="this.city" @input="inputChangeHandler" label="Название города"></v-text-field>
                <v-btn color="blue" @click="onMapHandler" :disabled="isButtonDisabled">
                    Подтвердить
                </v-btn>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "CitySelectorComponent",

    props: ["getCity", "mapHandler", "isMapActive", "isSelect", "cityError"],

    data() {
        return {
            isButtonDisabled: true,
            city: "",
        }
    },

    methods: {
        onMapHandler() {
            this.$emit("mapHandler");
        },

        inputChangeHandler() {
            this.buttonDisabledHandler();
            this.onGetCity();
        },

        buttonDisabledHandler() {
            this.city.length > 0 ? this.isButtonDisabled = false : this.isButtonDisabled = true;
        },

        onGetCity() {
            this.$emit("getCity", this.city);
        }
    }
}
</script>

<style scoped>

</style>