import fs from 'fs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the Mermaid file
const mermaidContent = fs.readFileSync(resolve(__dirname, '../docs/sitemap.mmd'), 'utf8');

// Create a temporary HTML file that will render the diagram
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: false,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    </script>
</head>
<body>
    <div class="mermaid">
        ${mermaidContent}
    </div>
</body>
</html>
`;

// Write the HTML file
const htmlPath = resolve(__dirname, '../docs/sitemap.html');
fs.writeFileSync(htmlPath, htmlContent);

try {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`);
    
    // Wait for Mermaid to render
    await page.waitForSelector('.mermaid svg');
    
    // Get the SVG content
    const svgContent = await page.evaluate(() => {
        const svg = document.querySelector('.mermaid svg');
        return svg.outerHTML;
    });
    
    // Save the SVG file
    fs.writeFileSync(resolve(__dirname, '../docs/sitemap.svg'), svgContent);
    
    await browser.close();
    
    // Clean up temporary HTML file
    fs.unlinkSync(htmlPath);
    
    console.log('Sitemap SVG generated successfully!');
} catch (error) {
    console.error('Error generating SVG:', error);
    process.exit(1);
} 