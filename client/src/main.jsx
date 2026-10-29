import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { RepoProvider } from './context/RepoContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RepoProvider>
          <App />
        </RepoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
