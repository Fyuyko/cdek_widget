<template>
    <div v-if="isMapActive && !isSelect">
        <v-btn color="blue" @click.prevent="onDifCity">
            Назад
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "BackButtonComponent",

    props: ["difCity", "isMapActive", "isSelect"],

    methods: {
        onDifCity() {
          this.$emit("difCity");
        },
    }
}
</script>

<style>

</style>