<template>
    <v-btn color="green" @click="onSubmitForm">
        Выбрать этот пункт {{text}}
    </v-btn>
</template>

<script>
export default {
    name: "AddressSelectorComponent",

    props: ["submitForm", "text"],

    methods: {
        onSubmitForm() {
            this.$emit("submitForm")
        },
    }
}
</script>

<style>

</style>