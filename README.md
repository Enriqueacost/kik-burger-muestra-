# Kiko Burger – Landing page

Landing de Kiko Burger con menú, carrito y envío del pedido por WhatsApp. Hecha con **Vite**, **HTML**, **CSS** y **JavaScript** puro (sin frameworks), lista para desplegar en **Vercel**.

## Estructura del proyecto

```
Kiko-burger/
├── index.html          # Página principal
├── vite.config.js      # Vite con base './'
├── vercel.json         # Configuración para Vercel
├── package.json
├── README.md
├── DEPLOY_VERCEL.md    # Paso a paso para subir a Vercel
├── public/
│   └── logo.png        # Logo
└── src/
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js
        ├── data.js
        ├── carrito.js
        └── whatsapp.js
```

## Desarrollo local

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173` (o el puerto que indique Vite).

## Build

```bash
npm run build
```

El resultado queda en la carpeta **`dist/`**.

## Desplegar en Vercel

**Instrucciones detalladas:** ver **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** (paso a paso desde cero, incluyendo subir el proyecto a GitHub).

Resumen: crear repo en GitHub → subir el código → en [vercel.com](https://vercel.com) importar el repo → Deploy. Vercel detecta Vite y usa `npm run build` y carpeta `dist`.

## Configuración

- **WhatsApp**: en `src/js/whatsapp.js` está el número (595972781303). Cambiarlo si hace falta.
- **Productos**: `src/js/data.js`.
- **Dirección y mapa**: en `index.html`, sección Ubicación.

## Funcionalidad

- Menú con productos y botón "Agregar".
- Carrito con cantidades, total y "Pedir por WhatsApp" (mensaje formateado).
- Carrito guardado en `localStorage` al recargar.
