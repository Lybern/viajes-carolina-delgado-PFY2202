import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// ---------------------------------------------------------------------------
// Configuración de Apollo Client para interactuar con la API GraphQL.
// Apunta al endpoint virtual '/graphql' interceptado por MSW.
// addTypename: false evita advertencias en consola ya que el mock de MSW
// devuelve únicamente los campos solicitados sin la metadata __typename.
// ---------------------------------------------------------------------------
const client = new ApolloClient({
  uri: '/graphql',
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
      url: `${process.env.PUBLIC_URL || ''}/mockServiceWorker.js`,
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

reportWebVitals();
