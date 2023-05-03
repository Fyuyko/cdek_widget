<template>
    <button class="open-modal" @click="showModal = true">Открыть модальное окно</button>

    <div v-if="showModal" class="delivery-point__fade" @click.self="showModal=false">
        <div class="delivery-point">
            <h1>Выбор ПВЗ СДЭК</h1>
            <form class="form">
                <TemplateComponent/>
                <span class="close" @click="showModal=false">&times;</span>
            </form>
        </div>
    </div>
</template>

<script>
import TemplateComponent from "@/components/TemplateComponent.vue";

import { ref } from "vue";

export default {
    name: "IndexComponent",
    components: {TemplateComponent},

    methods: {

    },

    setup() {
        const showModal = ref(false);

        return {
            showModal,
        };
    },


}

</script>

<style scoped lang="scss">
  .delivery-point__fade {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;

    transition: .2s all linear .2s;
  }

  .delivery-point {
    background-color: white;
    max-width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 50px;

    transition: .2s all linear .2s;
  }

  .close {
      cursor: pointer;
  }
</style>