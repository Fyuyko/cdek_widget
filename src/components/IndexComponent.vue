<template>
    <IndexComponent/>
    <MapComponent/>
</template>

<script>

import axios from 'axios';
import MapComponent from "@/components/MapComponent.vue";

const yandexApiKey = "88398772-1a4b-4234-b8b9-b3dacf1b135e";

export default {
    name: "IndexComponent",
    components: {IndexComponent, MapComponent},

    data() {
        return {
            city: '',
            pvzList: [],
            point: [],
            selectedItem: null,
        }
    },

    methods: {


        submitForm() {
            const selectedPoint = this.selectedItem

            console.log(selectedPoint.address);

            alert(`Выбран пункт!`);
        },

    }
}

</script>

<style scoped lang="scss">
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    margin-bottom: 10px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
  }

  form label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  form input[type="text"],
  form select {
    width: 300px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 5px 10px;
    font-size: 1.1rem;
    margin-top: 5px;
  }

  form button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #0066ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  form button:hover {
    background-color: #0052cc;
  }

  /* Стили для карты */
  #map {
    height: 400px;
    width: 100%;
    margin-top: 50px;
  }

  /* Стили для кнопки "Выбрать этот пункт" */
  #select-point-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #0066ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
  }

  #select-point-button:hover {
    background-color: #0052cc;
  }
</style>