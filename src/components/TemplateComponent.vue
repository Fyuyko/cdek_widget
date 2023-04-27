<template>

    <h1>Выбор ПВЗ СДЭК</h1>

    <form id="city" @submit.prevent="submitForm">

        <div v-if="!selectedItem">
            <label>Введите название города:</label>
            <input v-model="city" type="text" placeholder="Название города">
            <button @click.prevent="showMap()">Найти пункты выдачи</button>
        </div>

        <div v-if="selectedItem">
            <button @click="submitForm()" type="submit">Выбрать этот пункт</button>
        </div>

    </form>

</template>

<script>
export default {
    name: "TemplateComponent"
}
</script>

<style scoped>

</style>