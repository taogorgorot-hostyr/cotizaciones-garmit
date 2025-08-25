# 🚀 Guía de Despliegue Web - GARMIT SPA Cotizaciones (Node.js)

## ✅ Estado Actual
El proyecto está **95% listo** para despliegue web con Node.js + Express.

## 🌐 Opciones de Hosting para Node.js

### Opción 1: Railway (Recomendado - Fácil)
1. Ve a https://railway.app
2. Conecta tu repositorio GitHub
3. Railway detecta automáticamente Node.js
4. Deploy automático ✨

### Opción 2: Render (Gratis)
1. Ve a https://render.com
2. Conecta repositorio
3. Selecciona "Web Service"
4. Build: `npm install`
5. Start: `npm start`

### Opción 3: Heroku
```bash
# 1. Instalar Heroku CLI
# 2. Login
heroku login

# 3. Crear app
heroku create garmit-cotizaciones

# 4. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Opción 4: VPS/Servidor propio
```bash
# En el servidor
git clone [tu-repo]
cd cotizaciones-garmit
npm install
npm start

# Con PM2 para mantenerlo corriendo
npm install -g pm2
pm2 start server.js --name "garmit-cotizaciones"
```

## 🔧 Configuraciones Pre-Deploy

### 1. Crear archivo .env
```
PORT=3000
NODE_ENV=production
```

### 2. Actualizar server.js para producción
- Puerto dinámico: `process.env.PORT || 3000`
- CORS para dominio específico

### 3. Actualizar script.js
- Cambiar `localhost:3000` por tu dominio real

## 📋 Checklist Pre-Deploy

- ✅ Servidor Node.js funcionando
- ✅ Frontend conectado al backend
- ✅ Logo SVG incluido en PDFs
- ✅ CORS configurado
- ⚠️ Variables de entorno (.env)
- ⚠️ Puerto dinámico en server.js
- ⚠️ URL de producción en script.js

## 🐛 Posibles problemas

**Error de CORS en producción:**
- Actualizar URL del servidor en script.js
- De `localhost:3000` a tu dominio real

**PDFs no se generan:**
- Verificar que esevege.svg esté en el servidor
- Permisos de archivos

**Puerto ocupado:**
- Usar variable de entorno PORT

## 🎯 Pasos para Deploy

1. **Configurar variables de entorno**
2. **Actualizar URLs para producción**
3. **Elegir plataforma de hosting**
4. **Hacer deploy**
5. **Probar en producción**

## 💡 Recomendación

**Para empezar rápido:** Usa **Railway** o **Render**
- Solo conectas tu GitHub
- Deploy automático
- SSL gratis
- Dominio incluido

## Verificación Post-Despliegue

- [ ] Servidor Node.js corriendo
- [ ] Frontend carga correctamente
- [ ] PDFs se generan con logo
- [ ] HTTPS activo
- [ ] Performance optimizada

---
**Fecha de actualización:** $(date)
**Versión:** 2.0 (Node.js)
**Desarrollado para:** Garmit SPA