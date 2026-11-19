import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// ---------------------------------------------------------------------------
// Configuración de Apollo Client para interactuar con la API GraphQL.
// Apunta al endpoint virtual '/graphql' interceptado por MSW.
// InMemoryCache almacena en memoria los resultados de las consultas realizadas,
// evitando peticiones repetidas a los mismos recursos ya consultados.
// ---------------------------------------------------------------------------
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

// ---------------------------------------------------------------------------
// Inicialización del Service Worker en el navegador.
// Asegura que MSW comience a interceptar las peticiones antes de que React
// intente montar los componentes y realizar solicitudes de red iniciales.
// onUnhandledRequest: 'bypass' permite que los recursos estáticos (CSS, SVG, fuentes)
// se carguen con normalidad sin ser bloqueados.
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
      {/* ApolloProvider proporciona la instancia de Apollo Client a todo el árbol de componentes */}
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
});

reportWebVitals();
