const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
    
    const page = await browser.newPage();
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 2 
    });
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    await page.waitForSelector('#infographic', { timeout: 5000 });
    
    const element = await page.$('#infographic');
    const screenshot = await element.screenshot({
      type: 'png',
      omitBackground: false
    });
    
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