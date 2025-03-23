import fs from 'fs';
import path from 'path';
import { generateSitemap, generateNoteRoutes, generateQnARoutes } from '../packages/shared/src/utils/sitemapGenerator.js';

async function main() {
    try {
        // Fetch dynamic routes from your API or database
        // This is a placeholder - replace with actual API calls
        const notes = await fetch('https://api.studyhive.solutions/notes').then(res => res.json());
        const questions = await fetch('https://api.studyhive.solutions/questions').then(res => res.json());

        // Generate dynamic routes
        const noteRoutes = await generateNoteRoutes(notes);
        const qnaRoutes = await generateQnARoutes(questions);

        // Generate sitemap with all routes
        const sitemap = await generateSitemap([...noteRoutes, ...qnaRoutes]);

        // Write sitemap to public directory
        fs.writeFileSync(
            path.join(process.cwd(), 'public', 'sitemap.xml'),
            sitemap
        );

        console.log('Sitemap generated successfully!');

        // Ping search engines to notify them of the update
        const searchEngines = [
            'http://www.google.com/webmasters/sitemaps/ping?sitemap=https://studyhive.solutions/sitemap.xml',
            'http://www.bing.com/ping?sitemap=https://studyhive.solutions/sitemap.xml'
        ];

        await Promise.all(
            searchEngines.map(url => 
                fetch(url).then(() => console.log(`Pinged ${url}`))
            )
        );

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

main(); 