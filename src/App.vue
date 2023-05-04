<script setup>
  import IndexComponent from "@/components/IndexComponent.vue";
</script>

<template>
  <IndexComponent/>
</template>

<style lang="scss">
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
    form.delivery-point__form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    form.delivery-point__form label {
        font-size: 1.2rem;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
    }

    form.delivery-point__form input[type="text"],
    form.delivery-point__form select {
        width: 300px;
        height: 40px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 5px 10px;
        font-size: 1.1rem;
        margin-top: 5px;
    }

    form.delivery-point__form button {
        position: relative;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #0066ff;
        color: #fff;
        border: none;
        border-radius: 5px;
        font-size: 1.1rem;
        cursor: pointer;

        &:after {
          content: "Введите город";
          position: absolute;
          top: -10px;
          left: 0;
          transform: translateY(-100%);
          background-color: white;
          color: black;

          opacity: 0;
          transition: all linear .1s;
        }
    }

    form.delivery-point__form button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    form.delivery-point__form button:disabled:hover:after {
      opacity: 1;
    }

    form.delivery-point__form button:not(:disabled):hover {
        background-color: #0052cc;
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
