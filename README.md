# Agencia de Viajes Global

Aplicación web frontend moderna desarrollada con **React 19**, **Vite** y **Tailwind CSS**, diseñada bajo una arquitectura desacoplada que integra servicios simulados **REST** y **GraphQL** mediante **Mock Service Worker (MSW)**, enrutamiento declarativo con **React Router** y gestión de estado con **Apollo Client**.

* **Despliegue en producción:** [https://lybern.github.io/viajes-carolina-delgado-PFY2202/](https://lybern.github.io/viajes-carolina-delgado-PFY2202/)
* **Repositorio:** [https://github.com/Lybern/viajes-carolina-delgado-PFY2202](https://github.com/Lybern/viajes-carolina-delgado-PFY2202)

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Entorno y Bundler** | [Vite](https://vitejs.dev/) | `^8.3.8` | Servidor ultrarrápido con ESM nativo y Rollup |
| **Librería UI** | [React](https://react.dev/) | `^19.3.1` | Renderizado declarativo basado en componentes |
| **Enrutamiento** | [React Router](https://reactrouter.com/) | `^7.18.6` | Navegación SPA sin dependencias obsoletas |
| **Cliente GraphQL** | [Apollo Client](https://www.apollographql.com/) | `^4.3.8` | Gestión de consultas GraphQL, enlaces HTTP y caché en memoria |
| **Mocking de APIs** | [Mock Service Worker (MSW)](https://mswjs.io/) | `^2.15.0` | Intercepción de peticiones REST y GraphQL vía Service Worker |
| **Estilos y Diseño** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.19` | Framework de utilidades con diseño responsivo en 3 cortes |
| **Despliegue** | [gh-pages](https://www.npmjs.com/package/gh-pages) | `^6.3.0` | Publicación automatizada en GitHub Pages con fallback 404 SPA |

---

## 🔄 Tabla Comparativa: Migración de Create React App (CRA) a Vite

| Aspecto | Create React App (CRA) - Anterior | Vite - Implementación Actual |
| :--- | :--- | :--- |
| **Estado de soporte** | Declarado obsoleto | Estándar moderno de la industria |
| **Punto de entrada** | `public/index.html` (procesado por Webpack) | `index.html` en la raíz con `<script type="module" src="/src/main.jsx">` |
| **Extensiones de archivo** | `.js` permitía sintaxis JSX | `.jsx` explícito obligatorio para módulos con componentes |
| **Compilación y Build** | `react-scripts` (Webpack + Babel, ~15-30s) | `vite build` (Rollup + esbuild, ~1-2s) |
| **Variables de entorno** | `process.env.REACT_APP_*` | `import.meta.env.*` (ej. `BASE_URL`, `MODE`) |
| **Enrutador** | `react-router-dom` | `react-router` (importaciones directas desde el paquete unificado) |
| **Cliente GraphQL** | Apollo Client v3 (`new ApolloClient({ uri })`) | Apollo Client v4 (`new ApolloClient({ link: new HttpLink({ uri }) })`) |

---

## 🏛️ Arquitectura del Proyecto (Atomic Design)

El código fuente se organiza bajo la metodología **Atomic Design**, separando la presentación visual de la lógica de datos y las vistas de página:

```text
viajes-carolina-delgado-pfy2202/
├── public/
│   └── mockServiceWorker.js       # Script del Service Worker para MSW
├── src/
│   ├── components/                # Componentes de presentación (Atomic Design)
│   │   ├── atoms/                 # Átomos: bloques elementales indivisibles
│   │   │   ├── Boton.jsx          # Botón reutilizable con variantes y estados
│   │   │   ├── CampoTexto.jsx     # Input de texto con estilos estándar
│   │   │   └── Spinner.jsx        # SVG circular animado para estados de carga
│   │   └── molecules/             # Moléculas: composiciones funcionales
│   │       ├── AlertaError.jsx    # Caja de alerta con role="alert" y reintento
│   │       ├── BarraBusqueda.jsx  # Input de búsqueda combinado con chips de filtro
│   │       ├── EstadoCarga.jsx    # Spinner + mensaje accesible (role="status")
│   │       ├── TarjetaDestino.jsx # Tarjeta individual del catálogo REST
│   │       ├── TarjetaHotel.jsx   # Tarjeta de alojamiento de GraphQL
│   │       └── TarjetaVuelo.jsx   # Tarjeta de vuelo de GraphQL
│   ├── graphql/                   # Módulo centralizado de GraphQL
│   │   ├── client.js              # Instancia de Apollo Client con HttpLink y cache
│   │   ├── endpoint.js            # Definición dinámica del endpoint GraphQL
│   │   └── operaciones.js         # Query ObtenerDetalleDestino con parámetros
│   ├── mocks/                     # Módulo de simulación de servicios (MSW)
│   │   ├── browser.js             # Inicialización de setupWorker para navegador
│   │   └── handlers.js            # Interceptores para API REST y GraphQL
│   ├── pages/                     # Páginas / Vistas completas de la aplicación
│   │   ├── Destinos.jsx           # Catálogo REST con búsqueda y filtros reactivos
│   │   ├── DetalleDestino.jsx     # Detalle GraphQL con vuelos, hoteles y errores
│   │   ├── Inicio.jsx             # Portada de bienvenida institucional
│   │   └── PaginaNoEncontrada.jsx # Vista 404 para rutas inexistentes
│   ├── App.jsx                    # Contenedor principal, layout y enrutador
│   ├── index.css                  # Directivas base de Tailwind CSS
│   └── main.jsx                   # Punto de entrada, ApolloProvider y BrowserRouter
├── index.html                     # Entrada HTML principal de Vite
├── package.json                   # Dependencias y scripts de compilación
├── postcss.config.js              # Configuración de PostCSS para Tailwind
├── tailwind.config.js             # Configuración de Tailwind CSS y breakpoints
└── vite.config.mjs                # Configuración de Vite con base dinámica
```

---

## 📡 Servicios y Contratos de Datos

### 1. API REST: Catálogo de Destinos
* **Ruta:** `GET /api/destinos`
* **Parámetros de consulta:**
  * `?error=404`: Simula respuesta HTTP 404 con mensaje estructurado.
  * `?error=500`: Simula fallo interno del servidor HTTP 500.
* **Modelo de datos:**
  ```json
  [
    {
      "id": "Tokio",
      "nombre": "Tokio",
      "pais": "Japón",
      "actividades": "Templo Senso-ji, Cruce de Shibuya, Excursión al Monte Fuji"
    }
  ]
  ```

### 2. GraphQL: Itinerarios y Opciones de Viaje
* **Operación:** `query ObtenerDetalleDestino($id: ID!, $simularError: Boolean = false)`
* **Manejo de variables:**
  * `$id`: Identificador del destino seleccionado (ej. `"Paris"`, `"Tokio"`).
  * `$simularError`: Al activarse (`true`), MSW devuelve un arreglo `errors` con código `ERROR_SIMULADO`.
* **Esquema devuelto:**
  * `vuelos`: Listado con aerolínea, fechas, precio y disponibilidad de asientos.
  * `hoteles`: Listado con nombre del alojamiento, fechas de estadía, tarifa por noche y habitaciones disponibles.

---

## 🛡️ Resiliencia y Control de Contingencias

1. **Prevención de fugas de memoria con `AbortController`:**
   La consulta REST en `App.jsx` vincula un `controlador.signal` al método `fetch`. Al desmontar el componente o navegar a otra sección, se ejecuta `controlador.abort()`, impidiendo que peticiones fuera de tiempo intenten actualizar el estado de React.
2. **Propagación dinámica de errores:**
   El frontend extrae y muestra el mensaje real provisto por la respuesta HTTP o por el arreglo `errors` de GraphQL, sin recurrir a textos estáticos ni códigos genéricos.
3. **Recuperación condicional:**
   Si una consulta falla por contingencias de red o servidor (500), se ofrece un botón interactivo de **Reintentar** que reactiva la solicitud sin recargar la página completa. Si el identificador solicitado no existe en la base de datos, el sistema informa la no existencia y ofrece retornar al catálogo.

---

## 📱 Responsividad (3 Cortes con Tailwind CSS)

El diseño visual está estructurado con tres puntos de quiebre definidos en Tailwind CSS:

* **Móvil (`< 640px`):** Menú de navegación en fila compacta, tarjetas a 1 columna (`grid-cols-1`) y fuentes ajustadas para interacción táctil.
* **Tablet (`640px - 1024px`):** Catálogo dispuesto en 2 columnas (`md:grid-cols-2`), cabecera expandida y navegación lateral adaptable.
* **Desktop (`> 1024px`):** Menú lateral estructurado de ancho fijo (`md:w-56`), catálogo en 3 columnas (`lg:grid-cols-3`) y contenedor centrado (`max-w-6xl`).

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
* Node.js v18 o superior.
* Gestor de paquetes `npm`.

### Comandos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Lybern/viajes-carolina-delgado-PFY2202.git

# 2. Entrar al directorio
cd viajes-carolina-delgado-PFY2202

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo (puerto 5173 por defecto)
npm run dev

# 5. Compilar para producción (genera bundle optimizado en /dist con fallback 404.html)
npm run build

# 6. Previsualizar la compilación de producción localmente
npm run preview

# 7. Publicar actualización en GitHub Pages
npm run deploy
```
