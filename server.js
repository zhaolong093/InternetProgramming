const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

//db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop'
});

db.connect(err => {
  if (err) { console.error('DB connection failed:', err.message); return; }
  console.log('Connected to MySQL');
});

//gett all productss
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/cart', (req, res) => {
  const sql = `
    SELECT
      cart_items.id,
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.price,
      products.image_url,
      products.stock,
      (cart_items.quantity * products.price) AS line_total
    FROM cart_items
    JOIN products ON cart_items.product_id = products.id
    ORDER BY cart_items.added_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const subtotal = results.reduce((sum, i) => sum + Number(i.line_total), 0);
    res.json({ items: results, subtotal: subtotal.toFixed(2) });
  });
});

//add item to cart
app.post('/api/cart', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });

  db.query('SELECT * FROM cart_items WHERE product_id = ?', [product_id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });

    if (existing.length > 0) {
      db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?',
        [quantity, product_id],
        err2 => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: 'Cart updated' });
        }
      );
    } else {
      db.query(
        'INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)',
        [product_id, quantity],
        err3 => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: 'Added to cart' });
        }
      );
    }
  });
});

//update qty
app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });

  db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Quantity updated' });
  });
});

//delete item
app.delete('/api/cart/:id', (req, res) => {
  db.query('DELETE FROM cart_items WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item removed' });
  });
});

//delete everything in cart
app.delete('/api/cart', (req, res) => {
  db.query('DELETE FROM cart_items', err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cart cleared' });
  });
});

app.delete('/api/cart/:id', (req, res) => {
  db.query('DELETE FROM cart_items WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item removed' });
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
