<template>
    <v-btn color="green" @click="onSubmitForm" >
        {{text}}
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

<style scoped>
    button {
        margin: 20px 0;
    }
</style>