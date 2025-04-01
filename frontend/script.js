document.addEventListener('DOMContentLoaded', function () {
    const screenshotBtn = document.getElementById('screenshot-btn');
    const loadingIndicator = document.getElementById('loading');

    screenshotBtn.addEventListener('click', async function () {
        loadingIndicator.classList.remove('hidden');
        screenshotBtn.disabled = true;

        try {
            const response = await fetch('https://assignment-whba.onrender.com/api/screenshot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: window.location.href }) // Send the current page URL
            });

            if (!response.ok) {
                throw new Error('Failed to capture screenshot');
            }

            // Convert response to a Blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a download link
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'screenshot.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error:', error);
            alert('Screenshot failed: ' + error.message);
        } finally {
            loadingIndicator.classList.add('hidden');
            screenshotBtn.disabled = false;
        }
    });
});
