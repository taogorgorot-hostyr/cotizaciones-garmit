# Sistema de Cotizaciones Garmit

## Descripción
Sistema web para generar cotizaciones en PDF para Garmit SPA - Desarrollo, Mantención y Obras Menores.

## Despliegue en Servidor

### Requisitos del Servidor
- Servidor web Apache con soporte para .htaccess
- PHP 7.4 o superior (opcional, solo para headers adicionales)
- Soporte para archivos estáticos (HTML, CSS, JS)

### Instrucciones de Instalación

1. **Subir archivos al servidor:**
   - Copiar todos los archivos a la carpeta `/cotizacionesweb/` en el servidor
   - URL final: `https://www.garmitspa.cl/cotizacionesweb/`

2. **Archivos necesarios:**
   ```
   cotizacionesweb/
   ├── index.html          # Página principal
   ├── script.js           # Lógica de la aplicación
   ├── styles.css          # Estilos CSS
   ├── .htaccess          # Configuración del servidor
   ├── config.php         # Headers de seguridad (opcional)
   ├── garmit_color1.png  # Logo de la empresa
   └── README.md          # Este archivo
   ```

3. **Configuración del servidor:**
   - El archivo `.htaccess` configura automáticamente:
     - Compresión GZIP
     - Cache de archivos estáticos
     - Headers de seguridad
     - Página de inicio por defecto

4. **Verificación:**
   - Acceder a `https://www.garmitspa.cl/cotizacionesweb/`
   - Verificar que la página carga correctamente
   - Probar el login y generación de PDF

### Credenciales de Acceso
- Usuario: `garmitadmin`
- Contraseña: `garmit2025$`

### Características Técnicas
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Generación PDF:** jsPDF library
- **Imágenes:** Embebidas en Base64 (sin dependencias externas)
- **Responsive:** Optimizado para móviles y desktop
- **SEO:** Meta tags optimizados
- **Seguridad:** Headers de seguridad configurados

### Optimizaciones Implementadas
- ✅ Rutas relativas para despliegue web
- ✅ Compresión GZIP habilitada
- ✅ Cache de archivos estáticos
- ✅ Lazy loading de imágenes
- ✅ Scripts con defer para mejor rendimiento
- ✅ Headers de seguridad
- ✅ Imágenes en Base64 (sin archivos externos)

### Soporte
Para soporte técnico contactar al desarrollador.

---
**Garmit SPA** - Desarrollo, Mantención y Obras Menores  
www.garmitspa.cl