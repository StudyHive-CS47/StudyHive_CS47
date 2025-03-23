import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = 'StudyHive - Your Collaborative Learning Platform',
    description = 'StudyHive is a comprehensive student collaboration platform featuring note sharing, Q&A, group chat, AI-powered learning assistance, and more. Join thousands of students to enhance your academic journey.',
    keywords = 'student collaboration, note sharing, academic resources, study materials, online learning, university notes, student community',
    canonicalUrl = 'https://studyhive.solutions',
    ogImage = 'https://studyhive.solutions/og-image.jpg',
    structuredData
}) => {
    // Default structured data for the website
    const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "StudyHive",
        "url": "https://studyhive.solutions",
        "description": description,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://studyhive.solutions/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Google Search Console Verification */}
            <meta name="google-site-verification" content="[Verification_Code_Will_Be_Provided_By_Google]" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="StudyHive" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Additional SEO Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="theme-color" content="#4051B5" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
            <meta name="apple-mobile-web-app-title" content="StudyHive" />
            <meta name="application-name" content="StudyHive" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />

            {/* Language and Region */}
            <meta property="og:locale" content="en_US" />
            <link rel="alternate" href="https://studyhive.solutions" hrefLang="x-default" />
            <link rel="alternate" href="https://studyhive.solutions" hrefLang="en" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData || defaultStructuredData)}
            </script>
        </Helmet>
    );
};

export default SEO; 