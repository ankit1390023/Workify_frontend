import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Toaster } from './components/ui/sonner.jsx';
import App from './App';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
