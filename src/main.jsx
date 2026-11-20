import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './graphql/client';
import App from './App.jsx';
import './index.css';

const baseUrl = import.meta.env.BASE_URL || '/';

// ---------------------------------------------------------------------------
// Inicialización del Service Worker en el navegador.
// onUnhandledRequest: 'bypass' permite que los recursos estáticos fluyan con normalidad.
// serviceWorker.url y options.scope aseguran la compatibilidad en local y GitHub Pages.
// ---------------------------------------------------------------------------
async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${baseUrl}mockServiceWorker.js`,
      options: { scope: baseUrl },
    },
  });
}

// Inicia el mock y monta la jerarquía de componentes en el DOM
enableMocking()
  .catch((err) => console.error('Error al iniciar MSW:', err))
  .finally(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </React.StrictMode>
    );
  });
