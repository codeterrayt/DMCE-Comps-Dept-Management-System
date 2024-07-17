import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
const queryClient = new QueryClient(); // Create a new instance of QueryClient

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
     <QueryClientProvider client={queryClient}>
    <Toaster
      // position="top-right"
      reverseOrder={true}
    />
    <App />
    
    </QueryClientProvider>
  </>,
)
