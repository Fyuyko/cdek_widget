<script>
export default {
    methods: {
        submitDataToHTML(address) {
            const inputElement = document.querySelector("#deliveryPost");
            inputElement.value = address;
        },
    },
}
</script>