import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './App.jsx';
import './index.css';

// ---------------------------------------------------------------------------
// Configuración de Apollo Client para interactuar con la API GraphQL.
// En Apollo Client v4 es obligatorio definir la propiedad link con HttpLink.
// addTypename: false evita advertencias en consola con el mock de MSW.
// ---------------------------------------------------------------------------
const baseUrl = import.meta.env.BASE_URL || '/';

const client = new ApolloClient({
  link: new HttpLink({ uri: `${baseUrl}graphql` }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

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
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </React.StrictMode>
    );
  });
