# Cómo subir Kiko Burger a Vercel (paso a paso)

Este proyecto está preparado para desplegarse en **Vercel**. Sigue estos pasos si aún no subiste el código a GitHub.

---

## Paso 1: Crear un repositorio en GitHub

1. Entrá a [github.com](https://github.com) e iniciá sesión.
2. Clic en **"+"** (arriba a la derecha) → **"New repository"**.
3. Poné un nombre (ej: `kiko-burger`).
4. Dejalo **público** y **no** marques "Add a README" (ya tenés uno en el proyecto).
5. Clic en **"Create repository"**.

---

## Paso 2: Subir el proyecto desde tu PC

Abrí **PowerShell** o **Terminal** en la carpeta del proyecto (`Kiko-burger`) y ejecutá:

```powershell
cd c:\Users\Enrique\Desktop\Kiko-burger

git init
git add .
git commit -m "Landing Kiko Burger"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/kiko-burger.git
git push -u origin main
```

Reemplazá **TU-USUARIO** por tu usuario de GitHub y **kiko-burger** por el nombre del repo si lo cambiaste.

Si te pide usuario y contraseña, en GitHub ya no se usa contraseña para push: tenés que usar un **Personal Access Token** o **SSH**. En la mayoría de los casos, si tenés GitHub instalado o configurado, te va a guiar.

---

## Paso 3: Crear cuenta en Vercel (si no tenés)

1. Entrá a [vercel.com](https://vercel.com).
2. Clic en **"Sign Up"**.
3. Elegí **"Continue with GitHub"** y autorizá a Vercel para acceder a tu cuenta de GitHub.

---

## Paso 4: Importar el proyecto en Vercel

1. En el panel de Vercel, clic en **"Add New..."** → **"Project"**.
2. Vas a ver la lista de repositorios de GitHub. Buscá **kiko-burger** (o el nombre que hayas puesto).
3. Clic en **"Import"** al lado del repo.

---

## Paso 5: Configurar el proyecto (casi nada)

Vercel detecta que es un proyecto Vite y usa:

- **Build Command:** `npm run build` (o `vite build`)
- **Output Directory:** `dist`

Si ves esos valores, no cambies nada. Clic en **"Deploy"**.

Si no aparece nada, en **Build and Output Settings** poné:

- **Framework Preset:** Vite  
- **Build Command:** `npm run build`  
- **Output Directory:** `dist`  

y después **"Deploy"**.

---

## Paso 6: Listo

En 1–2 minutos Vercel termina el build. Te va a dar una URL tipo:

**https://kiko-burger-xxxx.vercel.app**

Cada vez que hagas **push** a la rama `main` en GitHub, Vercel va a volver a desplegar solo.

---

## Opcional: Dominio propio

En el proyecto en Vercel: **Settings** → **Domains** → podés agregar tu propio dominio (ej: `kikoburger.com`) y seguir las instrucciones que te da Vercel.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Crear repo en GitHub (nombre ej: `kiko-burger`) |
| 2 | `git init`, `git add .`, `git commit`, `git remote add origin ...`, `git push -u origin main` |
| 3 | Cuenta en Vercel con GitHub |
| 4 | En Vercel: Add New → Project → Import repo **kiko-burger** |
| 5 | Deploy (dejar Build = `npm run build`, Output = `dist`) |
| 6 | Usar la URL que te da Vercel |
