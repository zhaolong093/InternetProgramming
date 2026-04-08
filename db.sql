CREATE DATABASE IF NOT EXISTS shop;
USE shop;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  image_url   VARCHAR(500),
  stock       INT NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO products (name, description, price, image_url, stock) VALUES
('MacBook Air M2',    'Thin, light, and powerful with the M2 chip and all-day battery.',    1299.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 10),
('MacBook Pro M3',    'Pro performance with M3 chip, Liquid Retina XDR display.',            1999.00, 'https://images.unsplash.com/photo-1611186871525-b8c04ad68b3c?w=400', 8),
('iPhone 15 Pro',     'Titanium design, A17 Pro chip, and a 48MP main camera.',              1199.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 20),
('iPad Pro 12.9"',    'M2 chip, Ultra Retina XDR display with ProMotion.',                    1099.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 15),
('AirPods Pro',       'Active noise cancellation with Adaptive Transparency.',                 249.00, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 30),
('Apple Watch S9',    'Advanced health sensors, Always-On Retina display.',                    399.00, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', 25),
('Magic Keyboard',    'Wireless keyboard with Touch ID and scissor-switch keys.',              129.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 40),
('Apple Mouse',       'Multi-Touch surface, optimised foot design, silent clicks.',             79.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 35);
