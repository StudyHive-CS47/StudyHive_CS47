import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export const generateSitemap = async (dynamicRoutes = []) => {
    // Base routes that are always present
    const baseRoutes = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/notes', changefreq: 'hourly', priority: 0.9 },
        { url: '/qna', changefreq: 'hourly', priority: 0.9 },
        { url: '/chat', changefreq: 'daily', priority: 0.8 },
        { url: '/chatbot', changefreq: 'weekly', priority: 0.8 },
        { url: '/summarizer', changefreq: 'weekly', priority: 0.8 },
        { url: '/quiz', changefreq: 'daily', priority: 0.8 },
        { url: '/help', changefreq: 'monthly', priority: 0.5 },
    ];

    // Combine base routes with dynamic routes
    const routes = [...baseRoutes, ...dynamicRoutes];

    try {
        const stream = new SitemapStream({ hostname: 'https://studyhive.solutions' });
        
        // Add each route to the sitemap
        return streamToPromise(
            Readable.from(routes).pipe(stream)
        ).then((data) => data.toString());
    } catch (error) {
        console.error('Error generating sitemap:', error);
        throw error;
    }
};

// Function to generate dynamic routes for notes
export const generateNoteRoutes = async (notes) => {
    return notes.map(note => ({
        url: `/notes/${note.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: note.updatedAt
    }));
};

// Function to generate dynamic routes for Q&A
export const generateQnARoutes = async (questions) => {
    return questions.map(question => ({
        url: `/qna/${question.id}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: question.updatedAt
    }));
}; 