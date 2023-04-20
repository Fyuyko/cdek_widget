<script>
import { ymaps } from 'vue-yandex-maps';

const apiKey = '88398772-1a4b-4234-b8b9-b3dacf1b135e';

export default {
    name: "MapPointsService",

    async searchPoints(city) {
        const geocodeResponse = await ymaps.geocode(city)
        const [lng, lat] = geocodeResponse.geoObjects.get(0).geometry.getCoordinates()

        const deliveryResponse = await ymaps.delivery.searchPoints({
            apikey: apiKey,
            kind: 'pvz',
            latitude: lat,
            longitude: lng
        })

        return deliveryResponse.features.map(feature => {
            const point = feature.properties

            return {
                id: point.id,
                name: point.address_name,
                lat: point.coordinates[1],
                lon: point.coordinates[0]
            }
        })
    }
}
</script>

<style scoped>

</style>