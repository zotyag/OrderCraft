-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(30) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    order_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(20) NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items table (junction table)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Indexes for better query performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- Sample data
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy6QJFO', 'admin@ordercraft.com', 'ADMIN'),
('user1', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy6QJFO', 'user1@ordercraft.com', 'USER');

INSERT INTO menu_items (name, description, price, category, available) VALUES 
('Caesar Saláta', 'Friss zöld saláta, csirke, bacon és Caesar dressing', 2500, 'APPETIZER', TRUE),
('Gombaleves', 'Krémes gombaleves friss tejföllel', 1800, 'APPETIZER', TRUE),
('Grillezett csirke', 'Juicy grillezett csirke, zöldségekkel', 4500, 'MAIN_COURSE', TRUE),
('Marharagu', 'Lassú tűzön készített marharagú burgonyával', 5500, 'MAIN_COURSE', TRUE),
('Tonhal steak', 'Közép-hőfokú tonhal steak, citrommal', 6000, 'MAIN_COURSE', TRUE),
('Csokoládé torta', 'Gazdag csokoládé torta vanília fagylalttal', 2200, 'DESSERT', TRUE),
('Panna Cotta', 'Olasz panna cotta fruktosz szósszal', 2000, 'DESSERT', TRUE),
('Espresso', 'Frissen főzött espresso', 800, 'BEVERAGE', TRUE),
('Cappuccino', 'Cappuccino tejhab topperrel', 1200, 'BEVERAGE', TRUE),
('Narancslé', 'Friss narancslé', 900, 'BEVERAGE', TRUE);
