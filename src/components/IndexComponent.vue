<template>
    <div v-if="showModal" class="delivery-point__fade" @click.self="showModal=false">
        <div class="delivery-point">
            <h1 class="delivery-point__title">Выбор ПВЗ СДЭК</h1>
            <form class="form delivery-point__form">
                <TemplateComponent @onUpdateModalHandler="updateModalHandler"/>
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

    mounted() {
        const button = document.querySelector(".modal__button");

        button.addEventListener("click", () => {
            this.showModal = true;
        });
    },

    methods: {
        updateModalHandler(data) {
            this.showModal = data;
        },

        unmountModal() {
            this.showModal = false;

        },
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
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: 50px;

        background-color: white;
        max-width: 80%;
        height: fit-content;
        max-height: 70%;
        padding: 30px 50px;

        transition: .2s all linear .2s;
    }

    .close {
        position: absolute;
        top: 15px;
        right: 20px;

        font-size: 25px;
        line-height: 1;

        cursor: pointer;

        &:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 45px;
            height: 45px;
        }
    }
</style>