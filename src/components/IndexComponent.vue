<template>
    <div v-if="indexStore.showModal" class="delivery-point__fade">
        <v-dialog v-model="indexStore.showModal">
            <v-card>
                <v-toolbar color="grey">
                    <v-btn icon dark @click="indexStore.changeRefProp('showModal', false)">
                        <span>x</span>
                    </v-btn>
                </v-toolbar>
                <v-card-item>
                    <div class="text-h6 mb-1">
                        Выбор способа доставки:
                    </div>

                    <ul class="radio-list">
                        <li class="radio-list__item">
                            <input type="radio" id="cdek" value="cdek" v-model="indexStore.deliveryMethod"/>
                            <label for="cdek">Доставка до ПВЗ СДЭК</label>
                        </li>
                        <li class="radio-list__item">
                            <input type="radio" id="address" value="address" v-model="indexStore.deliveryMethod"/>
                            <label for="address">Доставка до адреса</label>
                        </li>
                    </ul>
                </v-card-item>

                <v-card-text>
                    <CombinedDeliveryComponent
                        v-if="indexStore.deliveryMethod"
                        ref="deliveryComponent"
                        :yandexApiKey="indexStore.yandexApiKey"
                        :deliveryMethod="indexStore.deliveryMethod"
                    />
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import {VDialog, VCard, VToolbar, VBtn} from "vuetify/components";
import CombinedDeliveryComponent from "@/components/PrimaryComponents/CombinedDeliveryComponent.vue";
import {defineComponent, onMounted, ref, watch} from "vue";
import {useIndexStore} from "@/store/indexStore";

defineComponent(["CombinedDeliveryComponent", "VDialog", "VCard", "VToolbar", "VBtn", "VRadioGroup", "VRadio"]);

const indexStore = useIndexStore();

onMounted(() => {
  const button = document.querySelector(indexStore.openModalButtonAttribute);
  button.addEventListener("click", () => {
    indexStore.changeRefProp("showModal", true);
  });

  console.log("app is created");
});

watch(indexStore.showModal, (newShowModal) => {
  if (!newShowModal) {
    indexStore.changeRefProp("deliveryMethod", "");
  }
});

</script>

<style scoped lang="scss">
    @mixin media-mobile {
        @media (max-width: 768 - 1px) {
            @content;
        }
    }

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

    .radio-list {
        display: flex;
        gap: 20px;

        @include media-mobile {
            flex-direction: column;
            gap: 10px;
        }

        &__item {
            display: flex;
            gap: 10px;
            list-style: none;
        }
    }
</style>