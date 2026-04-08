const API = '/api';


function showMsg(msg, isError = false) {
  const el = document.getElementById('msg');
  el.textContent = msg;
  el.className = 'msg ' + (isError ? 'msg--error' : 'msg--ok');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 2500);
}

async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    const container = document.getElementById('products');
    container.innerHTML = '';

    if (!products.length) {
      container.innerHTML = '<p>No products found. Is the server running? lol</p>';
      return;
    }

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${p.image_url}" alt="${p.name}"
             onerror="this.src='https://placehold.co/300x180?text=No+Image'">
        <h3>${p.name}</h3>
        <p>${p.description || ''}</p>
        <p class="price"><strong>$${Number(p.price).toFixed(2)}</strong></p>
        <p class="stock">${p.stock > 0 ? p.stock + ' in stock' : '<span style="color:#dc2626">Out of stock</span>'}</p>
        <button onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
          Add to Cart
        </button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    document.getElementById('products').innerHTML =
      '<p style="color:red">Failed to load products. Is the server running?</p>';
  }
}


async function loadCart() {
  try {
    const res = await fetch(`${API}/cart`);
    const cart = await res.json();
    const container = document.getElementById('cart');
    container.innerHTML = '';

    if (!cart.items || cart.items.length === 0) {
      container.innerHTML = '<p style="color:#888">Your cart is empty.</p>';
      document.getElementById('total').textContent = 'Total: $0.00';
      return;
    }

    cart.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}"
             onerror="this.src='https://placehold.co/60x60?text=?'">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>$${Number(item.price).toFixed(2)} each</p>
          <p>Subtotal: <strong>$${Number(item.line_total).toFixed(2)}</strong></p>
        </div>
        <div class="cart-actions">
          <button onclick="changeQty(${item.id}, ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${item.id}, ${item.quantity + 1})">+</button>
          <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        </div>
      `;
      container.appendChild(div);
    });

    document.getElementById('total').textContent = `Total: $${cart.subtotal}`;
  } catch (err) {
    document.getElementById('cart').innerHTML = '<p style="color:red">Failed to load cart.</p>';
  }
}


async function addToCart(productId) {
  try {
    await fetch(`${API}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });
    showMsg('Added to cart!');
    loadCart();
  } catch {
    showMsg('Failed to add item.', true);
  }
}


async function changeQty(id, qty) {
  if (qty < 1) { removeItem(id); return; }
  try {
    await fetch(`${API}/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: qty })
    });
    loadCart();
  } catch {
    showMsg('Failed to update quantity.', true);
  }
}


async function removeItem(id) {
  try {
    await fetch(`${API}/cart/${id}`, { method: 'DELETE' });
    showMsg('Item removed.');
    loadCart();
  } catch {
    showMsg('Failed to remove item.', true);
  }
}


async function clearCart() {
  if (!confirm('Clear the entire cart?')) return;
  try {
    await fetch(`${API}/cart`, { method: 'DELETE' });
    showMsg('Cart cleared.');
    loadCart();
  } catch {
    showMsg('Failed to clear cart.', true);
  }
}

loadProducts();
loadCart();
