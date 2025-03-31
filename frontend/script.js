document.addEventListener('DOMContentLoaded', function() {
    const screenshotBtn = document.getElementById('screenshot-btn');
    const loadingIndicator = document.getElementById('loading');

    screenshotBtn.addEventListener('click', function() {
        loadingIndicator.classList.remove('hidden');
        screenshotBtn.disabled = true;

        const infographic = document.getElementById('infographic');

        html2canvas(infographic, { scale: 2 }).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'pinterest-infographic.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to capture screenshot');
        })
        .finally(() => {
            loadingIndicator.classList.add('hidden');
            screenshotBtn.disabled = false;
        });
    });
});
