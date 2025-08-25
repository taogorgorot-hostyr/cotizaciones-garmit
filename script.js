// Variables globales
let currentFolio = 1;
let products = [];

// Configuracin de usuario
const VALID_CREDENTIALS = {
    username: 'garmitadmin',
    password: 'garmit2025$'
};

// Imagenes en Base64 (reemplaza con tus strings completos)
const LOGO_BASE64 = "";
const FONDO_BASE64 = "";

// Inicializacin
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;
    loadFolio();
    setupEventListeners();
    addProduct();
    
    // Verificar si hay una sesión activa
    checkExistingSession();
}

function setupEventListeners() {
    // Login form event listener con verificacin
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log(' Event listener del login (submit) agregado');
    } else {
        console.error(' No se encontr el formulario de login');
    }
    
    // Event listener alternativo en el botn de login
    const loginBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            // Si el botn es de tipo submit, el evento submit se encargar
            // Este es solo un respaldo por si el submit no funciona
            console.log(' Click en botn de login detectado');
        });
        console.log(' Event listener del botn login (click) agregado como respaldo');
    }
    
    // Otros event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) addProductBtn.addEventListener('click', addProduct);
    
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    if (generatePdfBtn) generatePdfBtn.addEventListener('click', generatePDF);
    
    const clearFormBtn = document.getElementById('clearFormBtn');
    if (clearFormBtn) clearFormBtn.addEventListener('click', clearForm);
}

function handleLogin(e) {
    console.log(' Funcin handleLogin ejecutada');
    e.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('loginError');
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    if (!usernameInput || !passwordInput) {
        console.error(' No se encontraron los campos de usuario o contrasea');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    console.log(' Usuario ingresado:', username);
    console.log(' Contrasea ingresada:', password ? '***' : 'vaca');
    console.log(' Comparando con:', VALID_CREDENTIALS.username, '/', VALID_CREDENTIALS.password ? '***' : 'vaca');
    
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        console.log(' LOGIN EXITOSO!');
        
        // Guardar sesión en localStorage
        localStorage.setItem('garmit_session', 'active');
        localStorage.setItem('garmit_user', username);
        
        showMainApp();
        
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    } else {
        console.log(' LOGIN FALLIDO');
        if (errorDiv) {
            errorDiv.textContent = 'Usuario o contrasea incorrectos';
        }
    }
}

function handleLogout() {
    // Limpiar sesión de localStorage
    localStorage.removeItem('garmit_session');
    localStorage.removeItem('garmit_user');
    
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function checkExistingSession() {
    const session = localStorage.getItem('garmit_session');
    const user = localStorage.getItem('garmit_user');
    
    if (session === 'active' && user) {
        console.log('✓ Sesión activa encontrada para:', user);
        showMainApp();
    } else {
        console.log('✗ No hay sesión activa, mostrando login');
        showLoginForm();
    }
}

function showMainApp() {
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    if (loginContainer) {
        loginContainer.style.display = 'none';
        console.log('✓ Login container ocultado');
    }
    
    if (mainContainer) {
        mainContainer.style.display = 'block';
        console.log('✓ Main container mostrado');
    }
}

function showLoginForm() {
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    if (loginContainer) {
        loginContainer.style.display = 'flex';
    }
    
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
}

function loadFolio() {
    const savedFolio = localStorage.getItem('garmit_folio');
    if (savedFolio) currentFolio = parseInt(savedFolio);
    document.getElementById('folio').value = String(currentFolio).padStart(6, '0');
}

function saveFolio() {
    localStorage.setItem('garmit_folio', currentFolio.toString());
}

function addProduct() {
    const container = document.getElementById('productsContainer');
    const productId = 'product_' + Date.now();

    const productRow = document.createElement('div');
    productRow.className = 'product-row';
    productRow.id = productId;

    productRow.innerHTML = `
        <input type="text" class="product-description" placeholder="Descripcin del producto/servicio" required>
        <input type="number" class="product-price" placeholder="0" min="0" step="0.01" required>
        <input type="number" class="product-quantity" placeholder="1" min="1" step="1" value="1" required>
        <div class="product-total">$0</div>
        <button type="button" class="remove-btn" onclick="removeProduct('${productId}')">Eliminar</button>
    `;

    container.appendChild(productRow);

    const priceInput = productRow.querySelector('.product-price');
    const quantityInput = productRow.querySelector('.product-quantity');

    priceInput.addEventListener('input', calculateTotals);
    quantityInput.addEventListener('input', calculateTotals);

    calculateTotals();
}

function removeProduct(productId) {
    const productRow = document.getElementById(productId);
    if (productRow) {
        productRow.remove();
        calculateTotals();
    }
}

function calculateTotals() {
    const productRows = document.querySelectorAll('.product-row');
    let subtotal = 0;

    productRows.forEach(row => {
        const price = parseFloat(row.querySelector('.product-price').value) || 0;
        const quantity = parseInt(row.querySelector('.product-quantity').value) || 0;
        const total = price * quantity;
        row.querySelector('.product-total').textContent = formatCurrency(total);
        subtotal += total;
    });

    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('iva').textContent = formatCurrency(iva);
    document.getElementById('total').textContent = formatCurrency(total);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(amount);
}

function clearForm() {
    if (confirm('Est seguro de que desea limpiar el formulario?')) {
        document.getElementById('nombreCliente').value = '';
        document.getElementById('email').value = '';
        document.getElementById('fono').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('notas').value = '';
        document.getElementById('productsContainer').innerHTML = '';
        addProduct();
        currentFolio++;
        saveFolio();
        document.getElementById('folio').value = String(currentFolio).padStart(6, '0');
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fecha').value = today;
    }
}

function generatePDF() {
    if (!validateForm()) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }
    showLoadingScreen();
    const data = collectFormData();
    
    // Enviar datos al servidor Node.js
    fetch('http://localhost:3000/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productos: data.productos,
            subtotal: data.subtotal,
            iva: data.iva,
            total: data.total,
            cliente: data.cliente.nombre,
            fecha: data.fecha
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        return response.blob();
    })
    .then(blob => {
        // Crear URL para descargar el PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `cotizacion_${data.folio || 'sin_folio'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        hideLoadingScreen();
        alert('PDF generado exitosamente!');
    })
    .catch(error => {
        console.error('Error:', error);
        hideLoadingScreen();
        alert('Error al generar el PDF. Asegúrate de que el servidor esté ejecutándose.');
    });
}

function validateForm() {
    const requiredFields = ['nombreCliente', 'email', 'fono', 'direccion'];
    for (let field of requiredFields) {
        if (!document.getElementById(field).value.trim()) return false;
    }
    const productRows = document.querySelectorAll('.product-row');
    return Array.from(productRows).some(row => {
        const desc = row.querySelector('.product-description').value.trim();
        const price = parseFloat(row.querySelector('.product-price').value) || 0;
        return desc && price > 0;
    });
}

function collectFormData() {
    const data = {
        fecha: document.getElementById('fecha').value,
        folio: document.getElementById('folio').value,
        cliente: {
            nombre: document.getElementById('nombreCliente').value,
            email: document.getElementById('email').value,
            fono: document.getElementById('fono').value,
            direccion: document.getElementById('direccion').value
        },
        productos: [],
        notas: document.getElementById('notas').value,
        totales: {
            subtotal: 0,
            iva: 0,
            total: 0
        }
    };
    
    // Recalcular totales correctamente
    let subtotal = 0;
    document.querySelectorAll('.product-row').forEach(row => {
        const desc = row.querySelector('.product-description').value.trim();
        const price = parseFloat(row.querySelector('.product-price').value) || 0;
        const qty = parseInt(row.querySelector('.product-quantity').value) || 0;
        if (desc && price > 0) {
            const productTotal = price * qty;
            data.productos.push({ descripcion: desc, precio: price, cantidad: qty, total: productTotal });
            subtotal += productTotal;
        }
    });
    
    // Calcular IVA y total
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    data.totales.subtotal = subtotal;
    data.totales.iva = iva;
    data.totales.total = total;
    
    return data;
}

function createPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    simulateProgress(() => {
        generatePDFWithImages(doc, data);
    });
}

function generatePDFWithImages(doc, data) {
    if (FONDO_BASE64) doc.addImage(FONDO_BASE64, 'PNG', 0, 0, 210, 297);
    if (LOGO_BASE64) doc.addImage(LOGO_BASE64, 'PNG', 20, 15, 40, 20);
    generatePDFContent(doc, data);
    const fileName = `Cotizacion_${data.folio}_${data.cliente.nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    // Incrementar folio automáticamente después de generar PDF
    currentFolio++;
    saveFolio();
    document.getElementById('folio').value = String(currentFolio).padStart(6, '0');
    
    hideLoadingScreen();
    showSuccessMessage(`PDF generado exitosamente: ${fileName}`);
}

function generatePDFContent(doc, data) {
    const orangeColor = [255, 107, 53];
    const grayColor = [102, 102, 102];
    doc.setTextColor(...orangeColor);
    doc.setFontSize(20);
    doc.text('GARMIT SPA', 80, 25);
    doc.setFontSize(18);
    doc.text('Cotización', 80, 35);

    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.text('DESARROLLO, MANTENCIN Y OBRAS MENORES SPA.', 80, 40);
    doc.text('WWW.GARMITSPA.CL', 80, 47);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Fecha: ${formatDate(data.fecha)}`, 150, 20);
    doc.text(`Folio: ${data.folio}`, 150, 30);

    let yPos = 65;
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    doc.text(`Nombre: ${data.cliente.nombre}`, 20, yPos);
    doc.text(`Email: ${data.cliente.email}`, 120, yPos);
    yPos += 8;
    doc.text(`Telfono: ${data.cliente.fono}`, 20, yPos);
    yPos += 8;
    doc.text(`Direccin: ${data.cliente.direccion}`, 20, yPos);

    yPos += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, 170, 10, 'F');
    doc.text('Descripcin', 25, yPos);
    doc.text('Precio Unit.', 120, yPos);
    doc.text('Cant.', 150, yPos);
    doc.text('Total', 170, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    data.productos.forEach(producto => {
        if (yPos > 250) { doc.addPage(); yPos = 30; }
        doc.text(producto.descripcion.substring(0, 40), 25, yPos);
        doc.text(formatCurrency(producto.precio), 120, yPos);
        doc.text(producto.cantidad.toString(), 155, yPos);
        doc.text(formatCurrency(producto.total), 170, yPos);
        yPos += 8;
    });

    yPos += 10;
    doc.line(120, yPos, 190, yPos);
    yPos += 10;
    doc.text('Subtotal (Neto):', 120, yPos);
    doc.text(formatCurrency(data.totales.subtotal), 170, yPos);
    yPos += 8;
    doc.text('IVA (19%):', 120, yPos);
    doc.text(formatCurrency(data.totales.iva), 170, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 120, yPos);
    doc.text(formatCurrency(data.totales.total), 170, yPos);

    if (data.notas.trim()) {
        yPos += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('NOTAS:', 20, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        const notasLines = doc.splitTextToSize(data.notas, 170);
        doc.text(notasLines, 20, yPos);
    }

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8).setTextColor(...grayColor);
    doc.text('Vigencia: 30 das desde la fecha de emisin.', 20, pageHeight - 30);
    doc.text('Valores sujetos a cambios segn mercado o alcance del proyecto.', 20, pageHeight - 25);
    doc.text('Pagos con tarjeta tienen un recargo del 2,3%.', 20, pageHeight - 20);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-CL');
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    const form = document.querySelector('.cotization-form');
    form.insertBefore(successDiv, form.firstChild);
    setTimeout(() => successDiv.remove(), 3000);
}

// Pantalla de carga
function showLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'flex';
    updateProgress(0, 'Validando formulario...');
}
function hideLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
}
function updateProgress(percentage, status) {
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = Math.round(percentage) + '%';
    document.getElementById('loadingStatus').textContent = status;
}
function simulateProgress(callback) {
    const steps = [
        { p: 10, s: 'Validando datos...' },
        { p: 25, s: 'Cargando libreras...' },
        { p: 40, s: 'Insertando imgenes...' },
        { p: 60, s: 'Generando contenido PDF...' },
        { p: 80, s: 'Aplicando formato...' },
        { p: 95, s: 'Finalizando documento...' },
        { p: 100, s: 'PDF generado exitosamente!' }
    ];
    let i = 0;
    function next() {
        if (i < steps.length) {
            updateProgress(steps[i].p, steps[i].s);
            if (++i < steps.length) setTimeout(next, 300 + Math.random() * 200);
            else setTimeout(() => { callback(); setTimeout(hideLoadingScreen, 500); }, 500);
        }
    }
    next();
}
