const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/screenshot', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: '/usr/bin/google-chrome-stable', // Render uses pre-installed Chrome
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const screenshot = await page.screenshot({ type: 'png' });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"');
        res.send(screenshot);

    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).json({ error: 'Failed to capture screenshot' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
