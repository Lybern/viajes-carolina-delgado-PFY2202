import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { apolloClient } from "./graphql/client";
import "./index.css";

// ---------------------------------------------------------------------------
// Inicialización principal de la aplicación.
// Configura los proveedores globales (ApolloProvider y BrowserRouter con basename)
// e inicia Mock Service Worker tanto en desarrollo como en compilación estática.
// ---------------------------------------------------------------------------
async function iniciarAplicacion() {
  // Mantiene los mocks activos también en la compilación estática (GitHub Pages)
  const mocksHabilitados =
    import.meta.env.DEV || import.meta.env.VITE_MSW_ENABLED !== "false";

  if (mocksHabilitados) {
    const { worker } = await import("./mocks/browser");

    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        options: { scope: import.meta.env.BASE_URL },
      },
    });
  }

  // BrowserRouter necesita un basename sin la barra final para rutas relativas
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

  createRoot(document.getElementById("root")).render(
    <ApolloProvider client={apolloClient}>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  );
}

iniciarAplicacion().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);

  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.textContent =
      "No se pudo iniciar la aplicación. Revisen la consola del navegador.";
  }
});
