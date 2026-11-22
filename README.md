# Agencia de Viajes Global

Aplicación web desarrollada con **React 19**, **Vite** y **Tailwind CSS**, diseñada bajo una arquitectura desacoplada que integra servicios simulados **REST** y **GraphQL** mediante **Mock Service Worker (MSW)**, enrutamiento declarativo con **React Router** (`react-router`) y gestión de consultas GraphQL con **Apollo Client v4**.

* **Despliegue en producción (GitHub Pages):** [https://lybern.github.io/viajes-carolina-delgado-PFY2202/](https://lybern.github.io/viajes-carolina-delgado-PFY2202/)
* **Repositorio:** [https://github.com/Lybern/viajes-carolina-delgado-PFY2202](https://github.com/Lybern/viajes-carolina-delgado-PFY2202)

---

## Tecnologías Utilizadas

| Categoría | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Entorno y Bundler** | Vite | `^8.3.8` | Servidor de desarrollo con ESM nativo y compilación para producción |
| **Librería UI** | React | `^19.3.1` | Renderizado declarativo basado en componentes modulares |
| **Enrutamiento** | React Router (`react-router`) | `^7.18.6` | Navegación SPA unificada con soporte de `basename` dinámico |
| **Cliente GraphQL** | Apollo Client (`@apollo/client`) | `^4.3.8` | Gestión de consultas GraphQL, `HttpLink` y caché en memoria (`InMemoryCache`) |
| **Mocking de APIs** | Mock Service Worker (MSW) | `^2.15.0` | Intercepción de peticiones REST y GraphQL vía Service Worker en navegador |
| **Estilos y Diseño** | Tailwind CSS | `^3.4.19` | Sistema de utilidades CSS con diseño responsivo en 3 cortes |
| **Despliegue** | GitHub Pages (`gh-pages`) | `^6.3.0` | Publicación estática con respaldo `404.html` para rutas SPA |

---

## Registro de la Migración de Create React App (CRA) a Vite

Siguiendo el procedimiento de migración de la asignatura, el proyecto fue migrado desde Create React App (`react-scripts`) hacia Vite:

| Antecedente | Información registrada |
| :--- | :--- |
| **Fecha de migración** | 20 de noviembre de 2026 |
| **Entorno utilizado** | Node.js `v24.21.0` y npm `11.19.0` |
| **Herramientas instaladas** | `vite@^8.3.8` y `@vitejs/plugin-react@^6.3.0` |
| **Archivos modificados** | Creación de `vite.config.mjs`, traslado de `index.html` a la raíz, renombrado de `src/index.js` a `src/main.jsx` y componentes con JSX a `.jsx`, adaptación de variables de entorno a `import.meta.env.*` y actualización de scripts en `package.json` |
| **Ajustes adicionales** | Consolidación de rutas en `react-router`, migración a Apollo Client v4 (`HttpLink`, `InMemoryCache({ addTypename: false })`, `@apollo/client/react`), integración de Tailwind CSS y configuración de `base` para GitHub Pages |
| **Validaciones realizadas** | Verificación funcional con `npm run dev`, compilación limpia con `npm run build` y comprobación del resultado compilado con `npm run preview` |
| **Situaciones pendientes** | Sin situaciones pendientes; el proyecto dejó de depender por completo de `react-scripts` |

---

## Arquitectura del Proyecto (Atomic Design)

El código fuente está organizado aplicando principios de **Atomic Design**, separando los componentes de presentación visual (átomos y moléculas) de las páginas y de la capa de comunicación con servicios:

```text
viajes-carolina-delgado-pfy2202/
├── public/
│   ├── favicon.ico                # Ícono de la aplicación
│   └── mockServiceWorker.js       # Script del Service Worker para MSW
├── src/
│   ├── components/                # Componentes reutilizables (Atomic Design)
│   │   ├── atoms/                 # Átomos: elementos base de interfaz
│   │   │   ├── Boton.jsx          # Botón parametrizable con variantes visuales
│   │   │   ├── CampoTexto.jsx     # Campo de entrada de texto reutilizable
│   │   │   └── Spinner.jsx        # Indicador vectorial animado de carga
│   │   └── molecules/             # Moléculas: unidades funcionales compuestas
│   │       ├── AlertaError.jsx    # Alerta accesible (role="alert") diferenciada por código
│   │       ├── BarraBusqueda.jsx  # Buscador de texto con chips de filtro por país
│   │       ├── EstadoCarga.jsx    # Indicador accesible de espera (role="status")
│   │       ├── TarjetaDestino.jsx # Ficha de destino turístico obtenida vía REST
│   │       ├── TarjetaHotel.jsx   # Ficha de alojamiento obtenida vía GraphQL
│   │       └── TarjetaVuelo.jsx   # Ficha de itinerario aéreo obtenida vía GraphQL
│   ├── graphql/                   # Configuración y operaciones GraphQL
│   │   ├── client.js              # Instancia de Apollo Client con HttpLink e InMemoryCache
│   │   ├── endpoint.js            # Endpoints dinámicos con import.meta.env.BASE_URL
│   │   └── operaciones.js         # Query ObtenerDetalleDestino parametrizada
│   ├── mocks/                     # Simulación de backend con MSW
│   │   ├── browser.js             # Configuración de setupWorker para navegador
│   │   └── handlers.js            # Interceptores combinados para REST y GraphQL
│   ├── pages/                     # Vistas / Páginas asociadas a rutas
│   │   ├── Destinos.jsx           # Catálogo REST con AbortController y filtros con useMemo
│   │   ├── DetalleDestino.jsx     # Vista detallada GraphQL de vuelos y hoteles por destino
│   │   ├── Inicio.jsx             # Portada de bienvenida
│   │   └── PaginaNoEncontrada.jsx # Vista 404 para rutas no registradas
│   ├── App.jsx                    # Layout general y definición de rutas con react-router
│   ├── index.css                  # Hoja de estilos global e importación de utilidades
│   ├── main.jsx                   # Punto de entrada, arranque de MSW, ApolloProvider y BrowserRouter
│   └── tailwind.css               # Reglas y utilidades compiladas de Tailwind CSS
├── .env.example                   # Variables de entorno de ejemplo (VITE_MSW_ENABLED)
├── index.html                     # Documento HTML raíz de Vite
├── package.json                   # Dependencias y scripts de desarrollo, build y deploy
├── postcss.config.js              # Configuración de PostCSS
├── tailwind.config.js             # Configuración de Tailwind CSS y cortes responsivos
└── vite.config.mjs                # Configuración de Vite
```

---

## Servicios Simulados y Contratos de Datos

### 1. API REST Mock: Catálogo de Destinos
* **Endpoint:** `GET ${import.meta.env.BASE_URL}api/destinos`
* **Parámetros de prueba:**
  * `?error=404`: Simula respuesta HTTP 404 con cuerpo JSON `{ "mensaje": "..." }`.
  * `?error=500`: Simula fallo interno del servidor HTTP 500 con cuerpo JSON `{ "mensaje": "..." }`.
* **Estructura devuelta:**
  ```json
  [
    {
      "id": "Paris",
      "nombre": "París",
      "pais": "Francia",
      "descripcion": "La Ciudad de la Luz cautiva con su arquitectura histórica, museos de clase mundial y paseos junto al río Sena.",
      "temporada": "Abril a octubre (Primavera - Otoño)",
      "precioDesde": "$1.090 USD",
      "actividades": "Torre Eiffel, Museo del Louvre, Crucero por el Sena, Barrio de Montmartre"
    }
  ]
  ```

### 2. API GraphQL Mock: Vuelos y Hoteles por Destino
* **Endpoint:** `POST ${import.meta.env.BASE_URL}graphql`
* **Operación:** `query ObtenerDetalleDestino($id: ID!, $simularError: Boolean = false)`
* **Configuración de caché:** `new InMemoryCache({ addTypename: false })` para operar con respuestas simuladas de MSW sin requerir el campo `__typename`.
* **Manejo de errores en GraphQL:** Cuando `$simularError` es `true`, el interceptor de MSW responde con estado HTTP `200 OK` e incluye el arreglo `errors: [{ message: "...", extensions: { code: "ERROR_SIMULADO" } }]`.
* **Datos consultados:** Información del destino junto con sus listas de `vuelos` (id, aerolínea, origen, horario, fechas, precio, disponibilidad) y `hoteles` (id, nombre, categoría, ubicación, fechas, precio, disponibilidad, servicios).

---

## Buenas Prácticas y Manejo de Contingencias Implementadas

1. **Consulta bajo demanda (sin descargas anticipadas en `Inicio`):**
   La portada `/` (`Inicio.jsx`) no realiza peticiones al backend. La consulta REST (`GET /api/destinos`) se ejecuta exclusivamente cuando el usuario ingresa a la vista `/destinos` (`Destinos.jsx`), y la consulta GraphQL se ejecuta únicamente al acceder a `/destinos/:id` (`DetalleDestino.jsx`).
2. **Flujo único con `AbortController`:**
   En `Destinos.jsx`, tanto la carga inicial como las actualizaciones y simulaciones de error utilizan una única función memorizada (`cargarDestinos`) que gestiona un `AbortController` mediante `useRef`. Cualquier solicitud previa en vuelo se aborta antes de iniciar una nueva o al desmontar la vista, evitando condiciones de carrera.
3. **Propagación dinámica de mensajes del backend:**
   El frontend extrae y muestra el mensaje real devuelto en el cuerpo JSON del handler REST (`cuerpoError?.mensaje`) o en el arreglo `errors` de GraphQL (`error.message`), sin emplear mensajes fijos en duro.
4. **Recuperación diferenciada según el tipo de fallo (404 vs. 500):**
   Ante errores del servidor (`500`), fallos de red o errores simulados de GraphQL, se presenta la acción **Reintentar consulta** (conservando los datos previos en memoria si ya existían). En cambio, ante un recurso inexistente (`404` o identificador de destino no registrado), no se ofrece recargar un recurso que no existe, sino retornar al listado general.
5. **Optimización de filtros con `useMemo`:**
   Los países disponibles se obtienen dinámicamente de la respuesta del servicio simulado (sin arreglos fijos en el cliente), el término de búsqueda se normaliza una sola vez fuera del bucle de filtrado y se evita disparar actualizaciones al pulsar nuevamente el filtro ya activo.
6. **Controles de simulación de errores reservados para desarrollo (`import.meta.env.DEV`):**
   Para no exponer botones de prueba técnica a los usuarios finales en producción, los controles **Simular 404**, **Simular 500** (en `/destinos`) y **Simular error** (en `/destinos/:id`) están condicionados a `import.meta.env.DEV`:
   * **En entorno de desarrollo (`npm run dev` en `http://localhost:5173`):** Los botones de simulación se muestran automáticamente en la cabecera de las vistas de catálogo y detalle.
   * **En producción (GitHub Pages):** Permanecen ocultos por defecto para el usuario final, pero pueden habilitarse para revisión agregando el parámetro **`?debug=true`** a la URL (por ejemplo: `/destinos?debug=true` o `/destinos/Paris?debug=true`), o activando directamente `?error=graphql` en el detalle de un destino.

---

## Diseño Responsivo (3 Cortes con Tailwind CSS)

* **Móvil (`< 640px`):** Navegación superior en fila adaptable, cuadrícula de destinos y opciones a 1 columna (`grid-cols-1`) y controles ajustados para pantallas pequeñas.
* **Tablet (`640px - 1024px`):** Menú de navegación lateral (`md:flex-row`), catálogo y opciones de vuelos/hoteles en 2 columnas (`md:grid-cols-2`).
* **Escritorio (`> 1024px`):** Contenedor centrado (`max-w-6xl`), barra lateral de ancho fijo (`md:w-60`) y catálogo de destinos en 3 columnas (`lg:grid-cols-3`).

---

## Instalación y Ejecución

### Requisitos Previos
* Node.js (versión 20.19+ o 22.12+ LTS recomendada).
* npm.

### Comandos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Lybern/viajes-carolina-delgado-PFY2202.git

# 2. Ingresar al directorio del proyecto
cd viajes-carolina-delgado-PFY2202

# 3. Instalar dependencias
npm install

# 4. Iniciar el entorno de desarrollo
npm run dev

# 5. Generar compilación de producción en /dist (con copia a 404.html para rutas SPA)
npm run build

# 6. Revisar localmente la compilación de producción
npm run preview

# 7. Publicar en GitHub Pages
npm run deploy
```
