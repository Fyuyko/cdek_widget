<template>
    <div v-else-if="isMapActive && !isSelect">
        <v-btn color="blue" @click.prevent="difCity">
            Назад
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "chooseAnotherCity",

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