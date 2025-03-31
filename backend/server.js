const express = require('express');
const { chromium } = require('playwright');
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

    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 800, height: 600 });

    await page.goto(url, { waitUntil: 'networkidle' });
    const element = await page.locator('#infographic');
    if (!(await element.count())) {
      throw new Error('Element #infographic not found on page.');
    }

    const screenshot = await element.screenshot({ type: 'png' });

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
