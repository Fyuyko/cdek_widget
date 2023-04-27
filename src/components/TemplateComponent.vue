<template>
    <div class="template">
        <label>Введите название города:</label>
        <input @input="sendCity" @change="this.change = !this.change" v-model="city" type="text" placeholder="Название города">

        <div v-if="selectedItem">
            Вы выбрали пункт по улице {{this.selectedItem.address}}
        </div>
    </div>
</template>

<script>
export default {
    name: "TemplateComponent",

    props: ["selectedItem"],

    data() {
        return {
            city: "",
            change: false,
        }
    },

    methods: {
        sendCity() {
            this.$emit("onGetCity", this.city);
        },
    }
}
</script>

<style lang="scss">
    .template {
        text-align: center;
    }
</style>