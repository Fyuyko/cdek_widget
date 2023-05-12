<script>
export default {
    name: "InputField",
    methods: {
        submitDataToHTML(address) {
            const inputElement = document.querySelector("#deliveryPost");
            inputElement.value = address;
        },
    },
}
</script>