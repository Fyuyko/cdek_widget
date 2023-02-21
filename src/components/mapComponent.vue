<template>
  <div :class="{show: this.show}" id="map"></div>
</template>

<script>

ymaps.ready(initMap);

function initMap(){
  var myMap = new ymaps.Map("map", {
        center: [59.939712, 30.311552],
        zoom: 15
      }, {
        searchControlProvider: 'yandex#search'
      }),
      myPlacemark = new ymaps.Placemark([59.939712, 30.311552], {
        balloonContentHeader: "Тут будет название пункта",
        balloonContentBody: "" +
            "Тут описание" +
            "<ul>" +
            "<li>время работы;</li>" +
            "<li>адрес.</li>" +
            "</ul>",
        balloonContentFooter: "<button>Выбрать этот пункт</button>",
        hintContent: "улица такая-то"
      });

  myMap.geoObjects.add(myPlacemark);
}

export default {
  name: "mapComponent",

  props: ["show"],


}
</script>

<style scoped lang="scss">
  #map {
    width: 600px;
    height: 400px;

    padding-top: 40px;

    opacity: 0;
    pointer-events: none;

    &.show {
      opacity: 1;
      pointer-events: all;
    }
  }
</style>