export const metadata = {
    title: 'Gym Management System',
    description: 'Professional Gym Management System',
};

import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en" translate="no" className="notranslate" suppressHydrationWarning>
            <head>
                <meta name="google" content="notranslate" />
                <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div className="stars-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="shooting_star"></div>
                    ))}
                </div>
                {children}
            </body>
        </html>
    );
}
