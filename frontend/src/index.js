import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TransactionContextProvider } from './context/TransactionContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TransactionContextProvider>
        <App />
      </TransactionContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
