<template>
    <div class="delivery-point__city">
        <label>{{primaryStore.cityError ? "Не правильно введено название, попробуйте еще раз:" : "Введите название города:"}}</label>
        <form class="delivery-point__city-name" @submit.prevent="onMapHandler">
            <v-text-field v-model="city" :rules="cityRules" @input="inputChangeHandler" label="Название города"></v-text-field>
            <v-btn color="blue" :disabled="isButtonDisabled">
                Подтвердить
            </v-btn>
        </form>
    </div>
</template>

<script setup>
  import {ref} from "vue";
  import {usePrimaryStore} from "@/store/promaryStore";

  const emit = defineEmits(["mapHandler"]);
  const primaryStore = usePrimaryStore();

  const isButtonDisabled = ref(true);
  const city = ref("");
  const cityRules = ref(primaryStore.cityError ? true : "Город не найден");

  function onMapHandler() {
    emit("mapHandler");
  }

  function inputChangeHandler() {
    buttonDisabledHandler();
    onGetCity();
  }

  function buttonDisabledHandler() {
    city.value.length > 0 ? isButtonDisabled.value = false : isButtonDisabled.value = true;
  }

  function onGetCity() {
    primaryStore.city = city.value;
  }
</script>

<style scoped lang="scss">
    .delivery-point__city {
        text-align: start;

        label {
            padding-bottom: 15px;
        }

        input {
            margin: 0;
            flex: 2;
        }

        button {
            margin: 0;
            flex: 1;
        }
    }
</style>