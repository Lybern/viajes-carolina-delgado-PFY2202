import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './App.jsx';
import './index.css';

// ---------------------------------------------------------------------------
// Configuración de Apollo Client para interactuar con la API GraphQL.
// addTypename: false evita advertencias en consola ya que el mock de MSW
// devuelve únicamente los campos solicitados sin la metadata __typename.
// ---------------------------------------------------------------------------
const client = new ApolloClient({
  uri: `${import.meta.env.BASE_URL}graphql`,
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

// ---------------------------------------------------------------------------
// Inicialización del Service Worker en el navegador.
// onUnhandledRequest: 'bypass' permite que los recursos estáticos fluyan con normalidad.
// serviceWorker.url asegura la compatibilidad tanto en local como en GitHub Pages.
// ---------------------------------------------------------------------------
async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      options: { scope: import.meta.env.BASE_URL },
    },
  });
}

// Una vez iniciado el worker, se monta la jerarquía de componentes en el DOM
enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
});
