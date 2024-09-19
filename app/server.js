import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { handler } from './build/handler.js';

const app = express();

// Proxy API requests to the Python backend
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
}));

// Proxy SvelteKit frontend requests to the SvelteKit dev server during development
if (process.env.NODE_ENV === 'development') {
    app.use(
        '/',
        createProxyMiddleware({
            target: 'http://localhost:3000',
            changeOrigin: true,
        })
    );
} else {
    // Serve SvelteKit frontend in production
    app.use(handler);
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});