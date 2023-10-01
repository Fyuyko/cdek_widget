<template>
    <v-btn color="green" @click="onSubmitForm" >
        {{text}}
    </v-btn>
</template>

<script setup>
  defineProps(["text"]);
  const emit = (["submitForm"]);

  function onSubmitForm() {
    emit("submitForm");
  }
</script>

<style scoped lang="scss">
    button {
        margin: 20px 0;
    }
</style>