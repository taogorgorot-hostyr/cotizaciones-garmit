<?php
// Configuración para www.garmitspa.cl/cotizacionesweb

// Configurar headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Configurar CORS si es necesario
header('Access-Control-Allow-Origin: https://www.garmitspa.cl');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configurar cache
header('Cache-Control: public, max-age=3600');

// Configurar tipo de contenido
header('Content-Type: text/html; charset=UTF-8');

// Prevenir acceso directo a este archivo
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    http_response_code(403);
    exit('Acceso denegado');
}
?>