import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './store/userContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 0,
        }
    }
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <UserContextProvider>
                    <App />
                </UserContextProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
