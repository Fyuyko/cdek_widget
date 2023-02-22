export function searchOnMap(city = "Санкт-Петербург") {
    ymaps.ready(createMap);

    function createMap() {
        const myMap = new ymaps.Map("map", {
            center: [55.753994, 37.622093],
            zoom: 12,
            //controls: [],
        }, {
            searchControlProvider: 'yandex#search'
        });

        //Это работает!

        /*ymaps.geocode(city, {
            results: 1
        }).then(res => {
            const firstGeoObject = res.geoObjects.get(0),
                bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

            myMap.setBounds(bounds);
            myMap.setBounds(res.geoObjects.getBounds());
        });*/

        ymaps.geocode("СДЕК ПВЗ Санкт-Петербург", {
            results: 20
        }).then(res => {
            const firstGeoObject = res.geoObjects.get(0),
                bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

            myMap.setBounds(bounds);
            myMap.setBounds(res.geoObjects.getBounds());

            console.log(firstGeoObject)

        });


    }



    /*return {
        createMap() {
            ymaps.ready(myMap);
        },

        initMap() {

            const myMap = () => new ymaps.Map('map', {
                center: [55.753994, 37.622093],
                zoom: 9,
                controls: [],
            });
            const search = () => ymaps.geocode(city, {
                results: 1
            }).then(res => {
                const firstGeoObject = res.geoObjects.get(0),
                    coords = firstGeoObject.geometry.getCoordinates(),
                    bounds = firstGeoObject.properties.get('boundedBy');

                firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
                // Получаем строку с адресом и выводим в иконке геообъекта.
                firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

                // Добавляем первый найденный геообъект на карту.
                myMap.geoObjects.add(firstGeoObject);
                myMap.setBounds(bounds);
            });

            ymaps.ready(search)
        },

        deleteMap() {
            myMap.destroy();
        }
    }*/

    /*function initMap() {
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
    }*/
}

// Прямое геокодирование
// Обратное геокодирование