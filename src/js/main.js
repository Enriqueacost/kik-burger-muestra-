/**
 * Kiko Burger - Punto de entrada
 * Renderiza menú y carrito con la nueva estética (dark, rojo + negro)
 */

import { PRODUCTOS } from './data.js';
import {
  getCarrito,
  agregarAlCarrito,
  cambiarCantidad,
  vaciarCarrito,
  calcularTotal,
} from './carrito.js';
import { generarMensajePedido, getWhatsAppUrl } from './whatsapp.js';

const menuGrid = document.getElementById('menu-grid');
const cartSection = document.getElementById('cart-section');
const cartItems = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const btnClearCart = document.getElementById('btn-clear-cart');
const btnWhatsapp = document.getElementById('btn-whatsapp');

const icons = {
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  minus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
};

function formatearPrecio(n) {
  return n.toLocaleString('es-PY') + ' ₲';
}

function renderMenu() {
  menuGrid.innerHTML = PRODUCTOS.map(
    (p) => `
    <div class="menu-card">
      <div class="menu-card__accent"></div>
      <div class="menu-card__body">
        <div>
          <h3 class="menu-card__name">${p.nombre}</h3>
          <p class="menu-card__desc">${p.descripcion || ''}</p>
        </div>
        <div class="menu-card__footer">
          <span class="menu-card__price">${p.precio.toLocaleString('es-PY')}<span>₲</span></span>
          <button type="button" class="btn-add" data-add="${p.id}">
            ${icons.plus} Agregar
          </button>
        </div>
      </div>
    </div>
  `
  ).join('');

  menuGrid.querySelectorAll('.btn-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const producto = PRODUCTOS.find((p) => p.id === btn.dataset.add);
      if (producto) {
        agregarAlCarrito(producto);
        renderCart();
      }
    });
  });
}

function renderCart() {
  const carrito = getCarrito();

  if (carrito.length === 0) {
    cartSection.style.display = 'none';
    btnWhatsapp.href = '#';
    return;
  }

  cartSection.style.display = 'block';
  const total = calcularTotal(carrito);

  cartItems.innerHTML = carrito
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item__info">
        <p class="cart-item__name">${item.nombre}</p>
        <p class="cart-item__unit">${formatearPrecio(item.precio)} c/u</p>
      </div>
      <div class="cart-item__controls">
        <button type="button" class="btn-qty" data-qty="${item.id}" data-delta="-1" aria-label="Disminuir">${icons.minus}</button>
        <span class="cart-item__qty">${item.cantidad}</span>
        <button type="button" class="btn-qty" data-qty="${item.id}" data-delta="1" aria-label="Aumentar">${icons.plus}</button>
      </div>
      <span class="cart-item__subtotal">${formatearPrecio(item.precio * item.cantidad)}</span>
    </div>
  `
    )
    .join('');

  cartTotalEl.textContent = formatearPrecio(total);
  btnWhatsapp.href = getWhatsAppUrl(generarMensajePedido(carrito, total));

  cartItems.querySelectorAll('.btn-qty').forEach((btn) => {
    btn.addEventListener('click', () => {
      cambiarCantidad(btn.dataset.qty, parseInt(btn.dataset.delta, 10));
      renderCart();
    });
  });
}

function init() {
  renderMenu();
  renderCart();

  btnClearCart.addEventListener('click', () => {
    vaciarCarrito();
    renderCart();
  });
}

init();
