const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "agrismart.db");
const db = new sqlite3.Database(dbPath);

// Helper wrapper to run queries returning promises
const query = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize database schemas
async function initDatabase() {
  console.log("Initializing database tables...");

  // Users Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'farmer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_amount REAL NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_state TEXT NOT NULL,
      shipping_pincode TEXT NOT NULL,
      order_status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Order Items Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Payments Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      transaction_id TEXT,
      amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    )
  `);

  // Experts Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS experts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      profile_image TEXT,
      rating REAL DEFAULT 5.0,
      is_available INTEGER DEFAULT 1,
      bio TEXT
    )
  `);

  // Consultations Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      expert_id INTEGER,
      consultation_type TEXT NOT NULL,
      scheduled_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'requested',
      notes TEXT,
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(farmer_id) REFERENCES users(id),
      FOREIGN KEY(expert_id) REFERENCES experts(id)
    )
  `);

  // Chat Sessions Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      language TEXT DEFAULT 'English',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Chat Messages Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      sender TEXT NOT NULL, -- 'user' or 'bot'
      text_content TEXT,
      image_data TEXT, -- base64 image data
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES chat_sessions(id)
    )
  `);

  // Ecological Alerts Table
  await query.run(`
    CREATE TABLE IF NOT EXISTS ecological_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'critical'
      target_pincode TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedData();
}

// Seed Initial Data
async function seedData() {
  // Check if products exist, if not seed them
  const prodCount = await query.get("SELECT COUNT(*) as cnt FROM products");
  if (prodCount.cnt === 0) {
    console.log("Seeding products...");
    const defaultProducts = [
      // Fertilizers
      { name: "Urea Fertilizer", sku: "FERT-UREA-01", category: "fertilizers", price: 299, stock_quantity: 100, image_url: "/category/resource image/urea.jpg", description: "Urea is a widely used nitrogen fertilizer that promotes leafy growth in crops. It is highly soluble and efficient for fast nutrient uptake." },
      { name: "DAP Fertilizer", sku: "FERT-DAP-01", category: "fertilizers", price: 549, stock_quantity: 80, image_url: "/category/resource image/dap.jpg", description: "Di-Ammonium Phosphate (DAP) provides excellent phosphorus and nitrogen nutrition to young roots, ensuring strong vegetative establishment." },
      { name: "MOP Fertilizer", sku: "FERT-MOP-01", category: "fertilizers", price: 420, stock_quantity: 50, image_url: "/category/resource image/mop.jpg", description: "Muriate of Potash (MOP) is rich in potassium, enhancing drought tolerance, pest resistance, and sugar content in crops." },
      { name: "NPK Fertilizer", sku: "FERT-NPK-01", category: "fertilizers", price: 480, stock_quantity: 120, image_url: "/category/resource image/npk.jpg", description: "NPK provides a balanced ratio of Nitrogen, Phosphorus, and Potassium to nourish crops at all growth stages." },
      { name: "Organic Fertilizer", sku: "FERT-ORG-01", category: "fertilizers", price: 250, stock_quantity: 150, image_url: "/category/resource image/organic.jpg", description: "100% natural organic compost enriched with beneficial soil microbes to restore soil health and texture." },
      { name: "Bio Fertilizer", sku: "FERT-BIO-01", category: "fertilizers", price: 300, stock_quantity: 90, image_url: "/category/resource image/bio.jpg", description: "Formulated with nitrogen-fixing bacteria and phosphate-solubilizing micro-organisms for natural nourishment." },
      // Seeds
      { name: "Premium Basmati Rice Seeds", sku: "SEED-RICE-01", category: "seeds", price: 150, stock_quantity: 200, image_url: "/category/resource image/plant-under-sun.png", description: "High yielding, aromatic Basmati rice seeds. Perfect for rain-fed and irrigated fields." },
      { name: "Hybrid Cabbage Seeds", sku: "SEED-CABB-01", category: "seeds", price: 80, stock_quantity: 150, image_url: "/category/resource image/plant-under-sun.png", description: "Pest-resistant, fast-maturing hybrid cabbage seeds yielding firm, green heads." },
      { name: "Organic Chilli Seeds", sku: "SEED-CHIL-01", category: "seeds", price: 95, stock_quantity: 120, image_url: "/category/resource image/plant-under-sun.png", description: "Produces high-quality, hot green and red chillies with excellent shelf life." },
      { name: "Red Onion Seeds", sku: "SEED-ONIO-01", category: "seeds", price: 110, stock_quantity: 180, image_url: "/category/resource image/plant-under-sun.png", description: "Premium quality onion seeds, yielding large bulbs with crisp purple-red layers." },
      // Equipment
      { name: "Heavy Duty Axe", sku: "EQIP-AXE-01", category: "equipment", price: 650, stock_quantity: 30, image_url: "/category/resource image/tractor.png", description: "Forged carbon steel head with lightweight, ergonomic fiberglass handle for woodcutting." },
      { name: "Mechanical Grass Cutter", sku: "EQIP-GCUT-01", category: "equipment", price: 1800, stock_quantity: 15, image_url: "/category/resource image/tractor.png", description: "Fuel-efficient, easy-start grass trimmer and weed cutter for field borders." },
      { name: "Traditional Hand Plough", sku: "EQIP-PLOU-01", category: "equipment", price: 1200, stock_quantity: 10, image_url: "/category/resource image/tractor.png", description: "Sturdy cast iron and timber frame hand plough for small kitchen gardens and soil aeration." },
      { name: "Manual Seed Drill", sku: "EQIP-SDRI-01", category: "equipment", price: 2500, stock_quantity: 8, image_url: "/category/resource image/tractor.png", description: "Adjustable depth manual seed drill, ensuring precise seed spacing and germination." }
    ];

    for (const p of defaultProducts) {
      await query.run(`
        INSERT INTO products (name, sku, category, description, price, stock_quantity, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [p.name, p.sku, p.category, p.description, p.price, p.stock_quantity, p.image_url]);
    }
  }

  // Check if experts exist, if not seed them
  const expCount = await query.get("SELECT COUNT(*) as cnt FROM experts");
  if (expCount.cnt === 0) {
    console.log("Seeding experts...");
    const defaultExperts = [
      { name: "Dr. Vishal Singh", specialization: "Soil Chemistry & Nutrition", profile_image: "/SIH Website/images/user.png", rating: 4.8, is_available: 1, bio: "Ph.D. in Agronomy with 12+ years advising on organic soil remediation and nitrogen management." },
      { name: "Dr. Sarah Paul", specialization: "Crop Pest & Disease Control", profile_image: "/SIH Website/images/user.png", rating: 4.9, is_available: 1, bio: "Expert in biological pest control, entomology, and eco-friendly crop pathology diagnostics." },
      { name: "Er. Ramesh Patel", specialization: "Precision Irrigation & Farm Equipment", profile_image: "/SIH Website/images/user.png", rating: 4.6, is_available: 1, bio: "Agricultural Engineer specializing in drip system designs and automated farm implements." }
    ];

    for (const e of defaultExperts) {
      await query.run(`
        INSERT INTO experts (name, specialization, profile_image, rating, is_available, bio)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [e.name, e.specialization, e.profile_image, e.rating, e.is_available, e.bio]);
    }
  }

  // Check if alerts exist, if not seed them
  const alertCount = await query.get("SELECT COUNT(*) as cnt FROM ecological_alerts");
  if (alertCount.cnt === 0) {
    console.log("Seeding ecological alerts...");
    const defaultAlerts = [
      { title: "Pest Infestation Warning", description: "Fall Armyworm detected in maize fields in your district. Take preventive neem-oil sprays immediately.", severity: "warning", target_pincode: "" },
      { title: "Early Blight Risk", description: "High ambient humidity (above 85%) is increasing the risk of Early Blight in potato crops. Monitor leaf undersides carefully.", severity: "critical", target_pincode: "" },
      { title: "Monsoon Arrival Advisory", description: "Expected monsoon rainfall starting in 3 days. Postpone active fertilization to avoid washing away nutrients.", severity: "info", target_pincode: "" }
    ];

    for (const a of defaultAlerts) {
      await query.run(`
        INSERT INTO ecological_alerts (title, description, severity, target_pincode)
        VALUES (?, ?, ?, ?)
      `, [a.title, a.description, a.severity, a.target_pincode]);
    }
  }

  console.log("Database initialized and seeded successfully!");
}

module.exports = {
  db,
  query,
  initDatabase
};
