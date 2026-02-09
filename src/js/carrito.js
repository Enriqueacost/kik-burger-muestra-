/**
 * Carrito de pedidos con localStorage
 */

const STORAGE_KEY = 'kikko-burger-carrito';

/**
 * Obtiene el carrito desde localStorage
 * @returns {Array<{id: string, nombre: string, precio: number, cantidad: number}>}
 */
export function getCarrito() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda el carrito en localStorage
 * @param {Array} items
 */
export function saveCarrito(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Agrega un producto al carrito (o aumenta cantidad si ya existe)
 * @param {Object} producto - { id, nombre, precio }
 * @returns {Array} carrito actualizado
 */
export function agregarAlCarrito(producto) {
  const carrito = getCarrito();
  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  saveCarrito(carrito);
  return carrito;
}

/**
 * Cambia la cantidad de un ítem. Si cantidad <= 0, lo elimina.
 * @param {string} id
 * @param {number} delta - +1 o -1
 * @returns {Array} carrito actualizado
 */
export function cambiarCantidad(id, delta) {
  const carrito = getCarrito();
  const item = carrito.find((i) => i.id === id);
  if (!item) return carrito;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    const index = carrito.indexOf(item);
    carrito.splice(index, 1);
  }

  saveCarrito(carrito);
  return carrito;
}

/**
 * Vacía el carrito
 * @returns {Array} []
 */
export function vaciarCarrito() {
  saveCarrito([]);
  return [];
}

/**
 * Calcula el total del carrito
 * @param {Array} carrito
 * @returns {number}
 */
export function calcularTotal(carrito) {
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}
