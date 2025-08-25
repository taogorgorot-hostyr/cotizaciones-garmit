const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
const corsOptions = {
    origin: NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://tu-dominio.com']
        : ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.', {
    maxAge: NODE_ENV === 'production' ? '1d' : 0
}));

// Endpoint para generar PDF
app.post('/generate-pdf', (req, res) => {
    try {
        const { productos, subtotal, iva, total, cliente, fecha } = req.body;
        
        // Crear nuevo documento PDF
        const doc = new PDFDocument({ margin: 50 });
        
        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="cotizacion.pdf"');
        
        // Pipe del documento a la respuesta
        doc.pipe(res);
        
        // Agregar logo si existe
        const logoPath = path.join(__dirname, 'esevege.svg');
        if (fs.existsSync(logoPath)) {
            try {
                doc.image(logoPath, 50, 50, { width: 80 });
            } catch (err) {
                console.log('Error cargando logo:', err.message);
            }
        }
        
        // Título de la empresa
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('GARMIT SPA', 150, 60)
           .fontSize(16)
           .text('Cotización', 150, 85);
        
        // Información del cliente
        doc.fontSize(12)
           .font('Helvetica')
           .text(`Cliente: ${cliente || 'N/A'}`, 50, 150)
           .text(`Fecha: ${fecha || new Date().toLocaleDateString()}`, 50, 170);
        
        // Línea separadora
        doc.moveTo(50, 200)
           .lineTo(550, 200)
           .stroke();
        
        // Encabezados de tabla
        let yPosition = 220;
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('Producto', 50, yPosition)
           .text('Cantidad', 200, yPosition)
           .text('Precio Unit.', 300, yPosition)
           .text('Total', 450, yPosition);
        
        yPosition += 20;
        
        // Productos
        doc.font('Helvetica');
        if (productos && productos.length > 0) {
            productos.forEach(producto => {
                doc.text(producto.nombre || '', 50, yPosition)
                   .text(producto.cantidad?.toString() || '0', 200, yPosition)
                   .text(`$${(producto.precio || 0).toLocaleString()}`, 300, yPosition)
                   .text(`$${(producto.total || 0).toLocaleString()}`, 450, yPosition);
                yPosition += 20;
            });
        }
        
        // Totales
        yPosition += 20;
        doc.moveTo(300, yPosition)
           .lineTo(550, yPosition)
           .stroke();
        
        yPosition += 15;
        doc.font('Helvetica-Bold')
           .text(`Subtotal: $${(subtotal || 0).toLocaleString()}`, 350, yPosition)
           .text(`IVA (19%): $${(iva || 0).toLocaleString()}`, 350, yPosition + 20)
           .text(`Total: $${(total || 0).toLocaleString()}`, 350, yPosition + 40);
        
        // Finalizar documento
        doc.end();
        
    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ error: 'Error generando PDF' });
    }
});

// Servir archivos estáticos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor GARMIT SPA corriendo en puerto ${PORT}`);
    console.log(`📝 Modo: ${NODE_ENV}`);
    console.log(`🌐 URL: ${NODE_ENV === 'production' ? 'https://tu-dominio.com' : `http://localhost:${PORT}`}`);
});

module.exports = app;