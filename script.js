// Variables globales
let products = [];

// Configuración de usuario
const VALID_CREDENTIALS = {
    username: 'garmitadmin',
    password: 'garmit2025$'
};

// Imágenes en Base64 (reemplaza con tus strings completos si las necesitas)
const LOGO_BASE64 = "";
const FONDO_BASE64 = "";

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;
    await loadInitialFolio();
    setupEventListeners();
    addProduct();

    // Verificar si hay una sesión activa
    checkExistingSession();
}

function setupEventListeners() {
    // Login form event listener con verificación
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Event listener del login (submit) agregado');
    } else {
        console.error('❌ No se encontró el formulario de login');
    }

    // Event listener alternativo en el botón de login
    const loginBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            // Si el botón es de tipo submit, el evento submit se encargará
            // Este es solo un respaldo por si el submit no funciona
            console.log('🔄 Click en botón de login detectado');
        });
        console.log('✅ Event listener del botón login (click) agregado como respaldo');
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
    console.log('🔄 Función handleLogin ejecutada');
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('loginError');
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');

    if (!usernameInput || !passwordInput) {
        console.error('❌ No se encontraron los campos de usuario o contraseña');
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    console.log('📝 Usuario ingresado:', username);
    console.log('📝 Contraseña ingresada:', password ? '***' : 'vacía');
    console.log('🔍 Comparando con:', VALID_CREDENTIALS.username, '/', VALID_CREDENTIALS.password ? '***' : 'vacía');

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        console.log('🎉 LOGIN EXITOSO!');

        // Guardar sesión en localStorage
        localStorage.setItem('garmit_session', 'active');
        localStorage.setItem('garmit_user', username);

        showMainApp();

        if (errorDiv) {
            errorDiv.textContent = '';
        }
    } else {
        console.log('❌ LOGIN FALLIDO');
        if (errorDiv) {
            errorDiv.textContent = 'Usuario o contraseña incorrectos';
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

// --- Folio Management (Server-Side) ---

async function getFolioFromServer() {
    try {
        // ----------- CORRECCIÓN: URL FIJA EN PRODUCCIÓN -----------
        let serverUrl;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            serverUrl = 'http://localhost:3000';
        } else {
            serverUrl = 'https://garmit-cotizaciones.onrender.com';
        }
        // ----------------------------------------------------------
        const response = await fetch(`${serverUrl}/api/folio`);
        if (!response.ok) {
            throw new Error('Could not fetch folio from server.');
        }
        const data = await response.json();
        return data.currentFolio;
    } catch (error) {
        console.error("Error fetching folio:", error);
        // Fallback to a default value if server is unreachable
        return 1;
    }
}

async function incrementFolioOnServer() {
    try {
        // ----------- CORRECCIÓN: URL FIJA EN PRODUCCIÓN -----------
        let serverUrl;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            serverUrl = 'http://localhost:3000';
        } else {
            serverUrl = 'https://garmit-cotizaciones.onrender.com';
        }
        // ----------------------------------------------------------
        const response = await fetch(`${serverUrl}/api/folio/increment`, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Could not increment folio on server.');
        }
        const data = await response.json();
        return data.currentFolio;
    } catch (error) {
        console.error("Error incrementing folio:", error);
        // If server fails, just increment locally as a fallback for the current session
        const currentFolioInput = document.getElementById('folio');
        let currentFolioNumber = parseInt(currentFolioInput.value) || 0;
        return currentFolioNumber + 1;
    }
}

async function loadInitialFolio() {
    const folio = await getFolioFromServer();
    document.getElementById('folio').value = String(folio).padStart(6, '0');
}

function addProduct() {
    const container = document.getElementById('productsContainer');
    const productId = 'product_' + Date.now();

    const productRow = document.createElement('div');
    productRow.className = 'product-row';
    productRow.id = productId;

    productRow.innerHTML = `
        <input type="text" class="product-description" placeholder="Descripción del producto/servicio" required>
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

async function clearForm() {
    if (confirm('¿Está seguro de que desea limpiar el formulario?')) {
        document.getElementById('nombreCliente').value = '';
        document.getElementById('email').value = '';
        document.getElementById('fono').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('notas').value = '';
        document.getElementById('productsContainer').innerHTML = '';
        addProduct();
        const newFolio = await incrementFolioOnServer();
        document.getElementById('folio').value = String(newFolio).padStart(6, '0');
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fecha').value = today;
    }
}

async function generatePDF() {
    if (!validateForm()) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }
    showLoadingScreen();
    const data = collectFormData();

    // ----------- CORRECCIÓN: URL FIJA EN PRODUCCIÓN -----------
    // Siempre enviar a Render en producción
    let serverUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        serverUrl = 'http://localhost:3000';
    } else {
        // SIEMPRE usar la URL de Render
        serverUrl = 'https://garmit-cotizaciones.onrender.com';
    }
    // ----------------------------------------------------------

    try {
        const response = await fetch(`${serverUrl}/generate-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productos: data.productos,
                subtotal: data.totales.subtotal,
                iva: data.totales.iva,
                total: data.totales.total,
                cliente: data.cliente.nombre,
                fecha: data.fecha
            })
        });

        if (!response.ok) {
            throw new Error('Error en el servidor al generar el PDF');
        }

        const blob = await response.blob();

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

        // Incrementar folio en el servidor
        const newFolio = await incrementFolioOnServer();
        document.getElementById('folio').value = String(newFolio).padStart(6, '0');

        hideLoadingScreen();
        alert('PDF generado exitosamente!');

    } catch (error) {
        console.error('Error:', error);
        hideLoadingScreen();
        alert('Error al generar el PDF. Asegúrate de que el servidor esté ejecutándose.');
    }
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
        { p: 25, s: 'Cargando librerías...' },
        { p: 40, s: 'Insertando imágenes...' },
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
