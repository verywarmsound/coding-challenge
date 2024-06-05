import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import './api/mock'; // Import the mock API setup

// Create a client
const queryClient = new QueryClient();

// Get the root element
const container = document.getElementById('root');
if (!container) {
    throw new Error('Root container missing in index.html');
}

// Create a root
const root = createRoot(container);

// Initial render
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);

reportWebVitals();
