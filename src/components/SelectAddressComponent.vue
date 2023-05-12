<template>
    <div class="delivery-point__select" v-if="selectedItem && !isSelect">
        <v-btn color="green" @click="onSubmitForm">
            Выбрать этот пункт {{text}}
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "SelectAddressComponent",

    props: ["submitForm", "selectedItem", "isSelect", "text"],

    methods: {
        onSubmitForm() {
            this.$emit("submitForm")
        },
    }
}
</script>

<style>

</style>