<template>
    <v-btn color="deep-orange-lighten-1" @click.prevent="onDifCity">
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