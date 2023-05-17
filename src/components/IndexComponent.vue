<template>
    <div v-if="showModal" class="delivery-point__fade">
        <v-dialog v-model="showModal">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="showModal=false">
                        <span>x</span>
                    </v-btn>
                </v-toolbar>

                <v-card-item>
                    <div class="text-h6 mb-1">
                        Выбор способа доставки:
                    </div>

                    <v-radio-group v-model="deliveryMethod" inline>
                        <v-radio color="primary" label="Доставка до ПВЗ СДЭК" value="cdek"></v-radio>
                        <v-radio color="primary" label="Доставка до адреса" value="address"></v-radio>
                    </v-radio-group>
                </v-card-item>

                <v-card-text>
                  <CombinedDeliveryComponent
                      v-if="deliveryMethod"
                      @onUpdateModalHandler="updateModalHandler"
                      :yandexApiKey="yandexApiKey"
                      :deliveryMethod="deliveryMethod"
                  />
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import {VDialog, VCard, VToolbar, VBtn, VRadioGroup, VRadio} from "vuetify/components";
import CombinedDeliveryComponent from "@/components/PrimaryComponents/CombinedDeliveryComponent.vue";

export default {
    name: "IndexComponent",
    components: {
        CombinedDeliveryComponent,
        VDialog, VCard, VToolbar, VBtn, VRadioGroup, VRadio
    },

    data() {
        return {
            openModalButtonAttribute: ".modal__button",
            receivedInputElementAttribute: "#deliveryPost",

            showModal: false,
            deliveryMethod: "",
            yandexApiKey: "",
        }
    },

    mounted() {
        const button = document.querySelector(this.openModalButtonAttribute);
        button.addEventListener("click", () => {
            this.showModal = true;
        });

        const inputElement = document.querySelector(this.receivedInputElementAttribute);
        this.yandexApiKey = inputElement.dataset.yandexKey;
    },

    methods: {
        updateModalHandler(data) {
            this.showModal = data;
        },
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
        gap: 25px;

        background-color: white;
        max-width: 80%;
        height: fit-content;
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