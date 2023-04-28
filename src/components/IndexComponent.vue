<template>
    <CourierDelivery />

    <h1>Выбор ПВЗ СДЭК</h1>
    <form class="form">
      <TemplateComponent/>
    </form>
</template>

<script>
import TemplateComponent from "@/components/TemplateComponent.vue";
import CourierDelivery from "@/components/CourierDelivery/CourierDelivery.vue";

export default {
    name: "IndexComponent",
    components: {CourierDelivery, TemplateComponent},
}

</script>

<style scoped lang="scss">

</style>