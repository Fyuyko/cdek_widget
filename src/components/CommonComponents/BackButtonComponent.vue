<template>
    <v-btn color="blue" @click.prevent="onDifCity">
        Назад
    </v-btn>
</template>

<script>
export default {
    name: "BackButtonComponent",

    props: ["difCity"],

    methods: {
        onDifCity() {
          this.$emit("difCity");
        },
    }
}
</script>

<style>

</style>