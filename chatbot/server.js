require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const bcrypt = require("bcryptjs");
const { initDatabase, query } = require("./db");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Allow big base64 images

// Initialize database
initDatabase().catch(err => {
  console.error("Database initialization failed:", err);
});

// Serve frontend static files from the parent directory
app.use(express.static(path.join(__dirname, "..")));

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Authentication API: Signup
app.post("/api/auth/signup", async (req, res) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const userExists = await query.get("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const roleValue = role || "farmer";
    const result = await query.run(
      "INSERT INTO users (fullname, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [fullname, email, password_hash, roleValue]
    );
    res.status(201).json({ message: "Account created successfully", userId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication API: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const user = await query.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (role && user.role !== role) {
      return res.status(400).json({ error: "Incorrect role for this account" });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products API: Fetch all or by category
app.get("/api/products", async (req, res) => {
  const { category } = req.query;
  try {
    let rows;
    if (category) {
      rows = await query.all("SELECT * FROM products WHERE category = ?", [category]);
    } else {
      rows = await query.all("SELECT * FROM products");
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products API: Fetch single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await query.get("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders API: Place Order & Process payment
app.post("/api/orders", async (req, res) => {
  const { userId, items, totalAmount, shippingName, shippingPhone, shippingAddress, shippingCity, shippingState, shippingPincode, paymentMethod } = req.body;
  if (!items || !items.length || !totalAmount) {
    return res.status(400).json({ error: "Invalid order details" });
  }
  try {
    const orderResult = await query.run(`
      INSERT INTO orders (user_id, total_amount, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId || null, totalAmount, shippingName, shippingPhone, shippingAddress, shippingCity, shippingState, shippingPincode]);

    const orderId = orderResult.id;

    for (const item of items) {
      await query.run(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.productId, item.quantity, item.unitPrice]);

      await query.run(`
        UPDATE products SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?
      `, [item.quantity, item.productId]);
    }

    const paymentStatus = paymentMethod === "cod" ? "pending" : "completed";
    const transactionId = paymentMethod === "cod" ? "COD-" + Date.now() : "TXN-" + Math.floor(Math.random() * 1000000000);
    await query.run(`
      INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, amount)
      VALUES (?, ?, ?, ?, ?)
    `, [orderId, paymentMethod, paymentStatus, transactionId, totalAmount]);

    res.status(201).json({ message: "Order placed successfully", orderId, transactionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Experts API: Get all experts
app.get("/api/experts", async (req, res) => {
  try {
    const rows = await query.all("SELECT * FROM experts");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consultations API: Book visit or calls
app.post("/api/consultations", async (req, res) => {
  const { farmerId, expertId, consultationType, scheduledAt, notes, shippingAddress } = req.body;
  if (!consultationType || !scheduledAt) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await query.run(`
      INSERT INTO consultations (farmer_id, expert_id, consultation_type, scheduled_at, status, notes, shipping_address)
      VALUES (?, ?, ?, ?, 'requested', ?, ?)
    `, [farmerId || null, expertId || null, consultationType, scheduledAt, notes || "", shippingAddress || ""]);
    res.status(201).json({ message: "Consultation booked successfully", bookingId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Environment API: Get warning alerts
app.get("/api/alerts", async (req, res) => {
  try {
    const rows = await query.all("SELECT * FROM ecological_alerts ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Chat API (updates chatbot query with database logging)
app.post("/api/chat", async (req, res) => {
  const { message, language, image, sessionId, userId } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ reply: "Gemini API Key is missing. Kripya backend me API key set karein ya developer se sampark karein." });
  }

  try {
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const sessionResult = await query.run(
        "INSERT INTO chat_sessions (user_id, language) VALUES (?, ?)",
        [userId || null, language || "English"]
      );
      currentSessionId = sessionResult.id;
    }

    // Log User message
    await query.run(
      "INSERT INTO chat_messages (session_id, sender, text_content, image_data) VALUES (?, 'user', ?, ?)",
      [currentSessionId, message || "Attached an image", image ? image.data : null]
    );

    let languageInstructions = "Respond in clear English.";
    if (language === "Hindi") {
      languageInstructions = "CRITICAL: You MUST write your ENTIRE textual response completely in proper Hindi. Use the native Devanagari script. DO NOT USE Roman Hindi/Hinglish.";
    }

    const promptText = `You are the AgriSmart Krishi Sahayak, a highly knowledgeable Indian agricultural AI assistant dedicated to helping small and marginal Indian farmers maximize their livelihood.

CRITICAL INSTRUCTION 1 (VALID TOPICS): You MUST passionately and thoroughly answer questions about:
- Shifting from chemical fertilizers to organic/natural farming
- Low-budget farming and cost-saving techniques
- Maximizing profit and crop yield in small areas Phase-wise
- General agriculture, crops, livestock, weather, pests, schemes, soil dynamics, and farm equipment.
If the user asks about these topics, provide deeply actionable, step-by-step guidance! ONLY refuse if a topic is completely unrelated (like movies, programming, or non-agri politics).

CRITICAL INSTRUCTION 2 (FACTS & FIGURES): Your response MUST include relevant economic facts, cost comparisons, specific figures, statistics, or metrics (e.g., organic conversion timelines, fertilizer costs vs organic compost costs, crop yield/hectare).

CRITICAL INSTRUCTION 3 (IMAGE EXPORT): You MUST ALWAYS include a related image at the very end of your response using exactly this markdown format:
![Crop Image](https://image.pollinations.ai/prompt/{search_terms}?width=800&height=400&nologo=true)
Replace {search_terms} with 3 to 4 English keywords separated by a plus sign (+), describing the specific crop or farming situation (e.g., organic+farming+small+field).

${languageInstructions}

User Request: "${message}"`;

    let finalPromptText = promptText;
    const contentsArray = [];

    if (image && image.data && image.mimeType) {
      finalPromptText += `\n\n[USER HAS ATTACHED AN IMAGE] 
CRITICAL VISION TASK: Deeply analyze the attached visual image. Identify the crop disease, farming equipment, pest, or pesticide visible in it. Your response MUST explicitly address what is shown in the image and provide actionable, localized advice for it!`;
      
      contentsArray.push({
        inlineData: { mimeType: image.mimeType, data: image.data }
      });
    }

    contentsArray.push(finalPromptText);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contentsArray
    });

    // Log Bot response
    await query.run(
      "INSERT INTO chat_messages (session_id, sender, text_content) VALUES (?, 'bot', ?)",
      [currentSessionId, response.text]
    );

    res.json({ reply: response.text, sessionId: currentSessionId });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ reply: `An error occurred: ${error.message}` });
  }
});

// Fallback to route login/signup
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});