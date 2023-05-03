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

  form button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  form button:disabled:hover:after {
    opacity: 1;
  }

  form button:not(:disabled):hover {
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
