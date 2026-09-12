# 🌾 AgriSmart - Smart Agriculture & AI Farming Platform

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![SQLite3](https://img.shields.io/badge/Database-SQLite3-lightgrey.svg)](https://www.sqlite.org/)
[![Google Gemini API](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)](https://ai.google.dev/)
[![SIH Project](https://img.shields.io/badge/Hackathon-SIH-red.svg)](#)

**AgriSmart** is a comprehensive, AI-driven smart agriculture platform developed by team **HACK HARVESTERS** for the Smart India Hackathon (SIH). AgriSmart bridges the gap between technology and traditional farming, empowering farmers with real-time AI assistance, agricultural marketplace solutions, crop guides, government scheme information, and expert advisory.

---

## 🚀 Key Features

- 🤖 **AI-Powered Agricultural Chatbot (Gemini AI)**: Integrated with `@google/genai` to provide instant, intelligent answers on crop health, soil quality, pest control, weather impact, and farming techniques. Supports image analysis for disease diagnosis.
- 🛒 **Agricultural Marketplace**: Comprehensive e-commerce catalog for purchasing:
  - **Seeds**: Wheat, Rice, Maize, Barley, Moong, Urad, Sesame, etc.
  - **Fertilizers**: Urea, DAP, NPK, MOP, Organic Fertilizers, Bio-fertilizers.
  - **Equipment & Tools**: Sprayers, Seed Drills, Grass Cutters, Ploughs, Axes.
  - **Plants & Saplings**: Crop and flower saplings.
  - **Soil Testing Kits**: Instant ordering for soil diagnosis tools.
- 📚 **Comprehensive Crop Knowledge Base**: Detailed guides covering:
  - Seasonal Crops: **Rabi**, **Kharif**, and **Zaid** crop cycles.
  - Soil management and cultivation techniques for specific crops (Rice, Wheat, Barley, Millet, Cucumber, Watermelon, etc.).
- 📜 **Government Schemes & Advisory**: Guidance on agricultural subsidies, government policies, and support programs.
- 👨‍🌾 **Expert Consultation**: Connect directly with agricultural specialists and domain experts.
- 🔒 **User Authentication & Storage**: Secure user signup and login with `bcryptjs` password hashing and `SQLite3` persistence.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Responsive layout and dynamic DOM manipulation)
- **Backend**: Node.js, Express.js (v5.x)
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Database**: SQLite3 (`sqlite3` DB engine)
- **Authentication**: `bcryptjs`
- **Deployment Compatibility**: Production-ready for Render (Node.js 20 LTS environment)

---

## 📁 Repository Structure

```text
SIH website/
├── admin/                    # Admin dashboard assets and interface
├── category/                 # E-commerce marketplace (seeds, fertilizers, equipment, plants)
├── chatbot/                  # Backend server, Gemini AI integration, & SQLite database
│   ├── db.js                 # SQLite schema initialization and query helpers
│   ├── server.js             # Express API endpoints (Auth, Gemini AI Chatbot)
│   ├── chat.html             # Interactive chatbot UI
│   └── agrismart.db          # SQLite database storage
├── Description/              # Guides on crops, soil management, & government schemes
├── environment/              # Environment configurations & static assets
├── mai/                      # Main agricultural portal features
├── SIH Website/              # Core portal pages & expert consultation interface
├── index.html                # User registration / Signup entrypoint
├── login.html                # User login page
├── package.json              # Main Node.js project manifest & scripts
├── server.js                 # Root entrypoint for production deployment
└── README.md                 # Project documentation
```

---

## 🧰 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x recommended)
- [npm](https://www.npmjs.com/)
- A Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/priyanshuagrahari19/AgriSmart.git
   cd AgriSmart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file inside the `chatbot/` folder:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

5. **Access the Website**:
   Open your browser and navigate to `http://localhost:3000`.

---

## ☁️ Deployment

The project is pre-configured for instant deployment on **Render**:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Ensure you set `GEMINI_API_KEY` in environment variables on your deployment platform.

---

## 👥 Team HACK HARVESTERS

Developed for **Smart India Hackathon (SIH)**.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
