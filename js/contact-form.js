document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ENVIANDO...
        `;

        try {
            const formData = new FormData(form);

            await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            // Show success message (Premium UI)
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 transform transition-all duration-500 translate-y-0 opacity-100 flex items-center gap-3';
            successMessage.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <div>
                    <h4 class="font-bold">¡Mensaje Recibido!</h4>
                    <p class="text-sm">Te contactaremos en breve.</p>
                </div>
            `;
            document.body.appendChild(successMessage);

            // Reset form
            form.reset();

            // Store original button text to reset it after delay
            setTimeout(() => {
                successMessage.classList.add('opacity-0', '-translate-y-full');
                setTimeout(() => successMessage.remove(), 500);
            }, 5000);

        } catch (error) {
            console.error('Error:', error);
            // Even if fetch fails (e.g. opaque response in some cors cases), we might want to assume success if using no-cors
            // For now, let's keep it simple. If it really errors, alert.
            alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});
