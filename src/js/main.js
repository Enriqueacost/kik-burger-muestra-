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
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const menuSections = document.getElementById('menu-sections');
const cartSection = document.getElementById('cart-section');
const cartItems = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartFooter = document.querySelector('.cart__footer');
const btnClearCart = document.getElementById('btn-clear-cart');
const btnWhatsapp = document.getElementById('btn-whatsapp');

const icons = {
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  minus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  background: '#18181b',
  color: '#f2f2f2',
  iconColor: '#f97373',
});

const CATEGORIAS = [
  { id: 'hamburguesas', titulo: 'Hamburguesas' },
  { id: 'lomitos', titulo: 'Lomitos' },
  { id: 'papas', titulo: 'Papas fritas' },
];

// Estado de apertura/cierre de cada sección del menú
const estadoSecciones = new Map();

function formatearPrecio(n) {
  return n.toLocaleString('es-PY') + ' ₲';
}

function renderMenu() {
  const seccionesHtml = CATEGORIAS.map((cat) => {
    const items = PRODUCTOS.filter((p) => p.categoria === cat.id);
    if (!items.length) return '';

    const abierta = estadoSecciones.get(cat.id) ?? false;

    const cards = items
      .map(
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
            <div class="menu-card__actions">
              <button type="button" class="btn-add" data-add="${p.id}">
                ${icons.plus} Agregar
              </button>
              <span class="menu-card__qty" data-id="${p.id}" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    return `
      <section class="menu__section${abierta ? '' : ' menu__section--collapsed'}" data-section="${cat.id}">
        <button type="button" class="menu__section-header" aria-expanded="${abierta ? 'true' : 'false'}">
          <span class="menu__section-title">${cat.titulo}</span>
          <span class="menu__section-chevron" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <div class="menu__section-body">
          <div class="menu__grid">
            ${cards}
          </div>
        </div>
      </section>
    `;
  })
    .filter(Boolean)
    .join('');

  menuSections.innerHTML = seccionesHtml;

  menuSections.querySelectorAll('.btn-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const producto = PRODUCTOS.find((p) => p.id === btn.dataset.add);
      if (producto) {
        agregarAlCarrito(producto);
        renderCart();
        actualizarCantidadesMenu();
        Toast.fire({
          icon: 'success',
          title: `${producto.nombre} agregado al pedido`,
        });
      }
    });
  });

  menuSections.querySelectorAll('.menu__section-header').forEach((header) => {
    header.addEventListener('click', () => {
      const section = header.closest('.menu__section');
      if (!section) return;
      const id = section.dataset.section;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const next = !isExpanded;

      header.setAttribute('aria-expanded', String(next));
      section.classList.toggle('menu__section--collapsed', !next);

      if (id) {
        estadoSecciones.set(id, next);
      }
    });
  });

  // Sincronizar cantidades con el carrito (por si hay items en localStorage)
  actualizarCantidadesMenu();
}

function actualizarCantidadesMenu() {
  const carrito = getCarrito();
  const labels = document.querySelectorAll('.menu-card__qty[data-id]');

  labels.forEach((label) => {
    const id = label.getAttribute('data-id');
    const item = carrito.find((i) => i.id === id);

    if (item && item.cantidad > 0) {
      label.textContent = `x${item.cantidad}`;
      label.classList.add('menu-card__qty--active');
      label.setAttribute('aria-hidden', 'false');
    } else {
      label.textContent = '';
      label.classList.remove('menu-card__qty--active');
      label.setAttribute('aria-hidden', 'true');
    }
  });
}

function renderCart() {
  const carrito = getCarrito();

  if (carrito.length === 0) {
    cartSection.style.display = 'block';
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    cartTotalEl.textContent = formatearPrecio(0);
    if (cartFooter) {
      cartFooter.style.display = 'none';
    }
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

  if (cartFooter) {
    cartFooter.style.display = 'block';
  }

  cartItems.querySelectorAll('.btn-qty').forEach((btn) => {
    btn.addEventListener('click', () => {
      cambiarCantidad(btn.dataset.qty, parseInt(btn.dataset.delta, 10));
      renderCart();
    });
  });

  // Actualizar cantidades visibles en el menú sin cerrar secciones
  actualizarCantidadesMenu();
}

function init() {
  renderMenu();
  renderCart();

  btnClearCart.addEventListener('click', async () => {
    const carrito = getCarrito();
    if (!carrito.length) return;

    const result = await Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos de tu pedido.',
      icon: 'warning',
      background: '#18181b',
      color: '#f2f2f2',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
    });

    if (result.isConfirmed) {
      vaciarCarrito();
      renderCart();
      Toast.fire({
        icon: 'success',
        title: 'Carrito vacío',
      });
    }
  });
}

init();
