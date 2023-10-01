<template>
    <v-btn color="deep-orange-lighten-1" @click.prevent="onDifCity">
        Назад
    </v-btn>
</template>

<script setup>
  const emit = defineEmits(["difCity"]);

  function onDifCity() {
    emit("difCity");
  }
</script>

<style scoped lang="scss">
    button {
        margin-bottom: 20px;
    }
</style>