<template>
    <button v-if="!IsMapActive && isSelect" @click="updateIsSelect(true)">
        Выбрать другой пункт
    </button>
    <div v-if="selectedItem && !isSelect">
        <button @click.prevent="submitForm()" type="submit">Выбрать этот пункт</button>
    </div>
    <div v-else-if="selectedItem && isSelect">
        Вы выбрали пункт по улице {{this.itemAddress}}
    </div>

</template>

<script>
export default {
    name: "SelectItemComponent",

    props: ["selectedItem", "onUpdateIsSelect", "onUpdateIsMapActive", "isSelect", "IsMapActive"],

    data() {
        return {
            //pvzList: [],  Можно использовать для выведения селекта
            itemAddress: "",
        }
    },

    methods: {
        submitForm() {
            const selectedPoint = this.selectedItem;
            this.itemAddress = this.selectedItem.address;
            this.updateIsMapActive(false);

            console.log(selectedPoint)

            this.updateIsSelect(true);
        },
        updateIsSelect(value) {
            this.$emit("onUpdateIsSelect", value);
        },
        updateIsMapActive(value) {
            this.$emit("onUpdateIsMapActive", value);
        },
    }
}
</script>

<style scoped>

</style>