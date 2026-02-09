/**
 * Generación del mensaje y enlace para WhatsApp
 */

// Número: +595 0972781303 | Enlace corto: wa.link/ce8b0p
const NUMERO_WHATSAPP = '595972781303';

/**
 * Formatea un número con separador de miles (Guaraníes)
 * @param {number} n
 * @returns {string}
 */
function formatearPrecio(n) {
  return n.toLocaleString('es-PY');
}

/**
 * Genera el texto del mensaje para el pedido
 * @param {Array<{nombre: string, precio: number, cantidad: number}>} items
 * @param {number} total
 * @returns {string}
 */
export function generarMensajePedido(items, total) {
  const lineas = [
    '¡Hola! Quiero hacer un pedido:',
    '',
  ];

  items.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    lineas.push(`• ${item.cantidad}x ${item.nombre} - ${formatearPrecio(subtotal)} ₲`);
  });

  lineas.push('');
  lineas.push(`Total a pagar: ${formatearPrecio(total)} ₲`);

  return lineas.join('\n');
}

/**
 * Devuelve la URL de WhatsApp con el mensaje codificado
 * @param {string} mensaje
 * @returns {string}
 */
export function getWhatsAppUrl(mensaje) {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${texto}`;
}
