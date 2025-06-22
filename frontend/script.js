document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const data = {
            vegBiryani: form.vegBiryani.value,
            paneerWrap: form.paneerWrap.value,
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            address: form.address.value.trim()
        };

        // Basic preparation for validation can be placed here
        console.log('Order Submitted:', data);

        // TODO: Add validation and submission logic
    });
});
