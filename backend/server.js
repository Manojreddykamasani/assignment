const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/screenshot', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Taking screenshot of: ${url}`);

    const browser = await puppeteer.launch({
      headless: true, // Ensures Puppeteer runs in headless mode
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Check if the #infographic element exists before attempting screenshot
    const element = await page.$('#infographic');
    if (!element) {
      throw new Error('Element #infographic not found on page.');
    }

    const screenshot = await element.screenshot({ type: 'png', omitBackground: false });

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'attachment; filename="pinterest-infographic.png"');
    res.send(screenshot);
    
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to take screenshot', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
