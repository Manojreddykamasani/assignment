document.addEventListener('DOMContentLoaded', function() {
    const screenshotBtn = document.getElementById('screenshot-btn');
    const loadingIndicator = document.getElementById('loading');
    screenshotBtn.addEventListener('click', function() {
        loadingIndicator.classList.remove('hidden');
        screenshotBtn.disabled = true;
        const currentUrl = window.location.href;
        fetch('/api/screenshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: currentUrl })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Failed to take screenshot'); });
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'pinterest-infographic.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to take screenshot: ' + error.message);
        })
        .finally(() => {

            loadingIndicator.classList.add('hidden');
            screenshotBtn.disabled = false;
        });
    });
});