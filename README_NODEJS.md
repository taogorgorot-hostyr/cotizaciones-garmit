# Sistema de Cotizaciones GARMIT SPA - Versión Node.js

## 🚀 Instalación y Configuración

### 1. Instalar Node.js

**Opción A: Descarga oficial**
- Ve a https://nodejs.org/
- Descarga la versión LTS (recomendada)
- Ejecuta el instalador y sigue las instrucciones

**Opción B: Usando Chocolatey (si lo tienes instalado)**
```powershell
choco install nodejs
```

**Opción C: Usando winget**
```powershell
winget install OpenJS.NodeJS
```

### 2. Verificar instalación
```powershell
node --version
npm --version
```

### 3. Instalar dependencias del proyecto
```powershell
cd cotizaciones-garmit
npm install
```

### 4. Ejecutar el servidor
```powershell
npm start
```

El servidor se ejecutará en: http://localhost:3000

## 🎯 Ventajas de esta versión

✅ **Logo incluido automáticamente** - Sin problemas de Base64
✅ **PDFs más profesionales** - Mejor calidad y formato
✅ **Mejor rendimiento** - Generación en servidor
✅ **Escalabilidad** - Fácil agregar nuevas funciones
✅ **Mantenimiento** - Código más limpio y organizado

## 📁 Estructura del proyecto

```
cotizaciones-garmit/
├── server.js          # Servidor Node.js con Express
├── package.json       # Dependencias del proyecto
├── index.html         # Frontend (sin cambios)
├── script.js          # Frontend modificado para usar servidor
├── styles.css         # Estilos (sin cambios)
├── esevege.svg        # Logo de la empresa
└── README_NODEJS.md   # Este archivo
```

## 🔧 Comandos útiles

```powershell
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Instalar dependencias
npm install
```

## 🐛 Solución de problemas

**Error: "npm no se reconoce"**
- Node.js no está instalado o no está en el PATH
- Reinicia PowerShell después de instalar Node.js

**Error: "Cannot find module"**
- Ejecuta `npm install` en la carpeta del proyecto

**Error de CORS**
- El servidor ya incluye configuración CORS
- Asegúrate de usar http://localhost:3000

## 📞 Soporte

Si tienes problemas, verifica que:
1. Node.js esté instalado correctamente
2. Estés en la carpeta correcta del proyecto
3. Hayas ejecutado `npm install`
4. El puerto 3000 esté disponible