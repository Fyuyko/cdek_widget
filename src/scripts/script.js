document.addEventListener('DOMContentLoaded', () => {
    init();
})

function init () {

    function getAddress () {
        console.log("тут будет инфа о пунктах")
    }

    getAddress();

    function yandexMap () {

        ymaps.ready(initMap);

        function initMap(){
            var myMap = new ymaps.Map("map", {
                    center: [59.939712, 30.311552],
                    zoom: 7
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
    }

    yandexMap();
}