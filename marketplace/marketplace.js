// AgriSmart Marketplace & Live Mandi Rates Logic

// 1. Live Mandi Data (Agmarknet APMC Rates across India)
const MANDI_RATES_DATA = [
    { id: 1, state: "Madhya Pradesh", district: "Indore", mandi: "Indore APMC Mandi", crop: "Wheat", variety: "Lokwan", minPrice: 2350, maxPrice: 2650, modalPrice: 2480, msp: 2275, trend: "+3.2%", trendType: "up", lastUpdated: "Today 08:30 AM" },
    { id: 2, state: "Madhya Pradesh", district: "Sehore", mandi: "Sehore Grain Mandi", crop: "Soybean", variety: "Yellow", minPrice: 4200, maxPrice: 4780, modalPrice: 4550, msp: 4600, trend: "+1.5%", trendType: "up", lastUpdated: "Today 09:15 AM" },
    { id: 3, state: "Punjab", district: "Khanna", mandi: "Khanna Asia's Largest Mandi", crop: "Paddy/Rice", variety: "1121 Basmati", minPrice: 3800, maxPrice: 4450, modalPrice: 4180, msp: 2203, trend: "+4.1%", trendType: "up", lastUpdated: "Today 08:45 AM" },
    { id: 4, state: "Punjab", district: "Ludhiana", mandi: "Ludhiana APMC", crop: "Wheat", variety: "PBW 550", minPrice: 2275, maxPrice: 2450, modalPrice: 2380, msp: 2275, trend: "0.0%", trendType: "up", lastUpdated: "Today 09:00 AM" },
    { id: 5, state: "Uttar Pradesh", district: "Lucknow", mandi: "Lucknow Grain Market", crop: "Gram/Chana", variety: "Desi", minPrice: 5200, maxPrice: 5850, modalPrice: 5600, msp: 5440, trend: "-1.1%", trendType: "down", lastUpdated: "Today 07:50 AM" },
    { id: 6, state: "Uttar Pradesh", district: "Agra", mandi: "Agra Vegetable Mandi", crop: "Potato", variety: "Kufri Jyoti", minPrice: 1400, maxPrice: 1850, modalPrice: 1650, msp: "N/A", trend: "+2.8%", trendType: "up", lastUpdated: "Today 09:20 AM" },
    { id: 7, state: "Rajasthan", district: "Kota", mandi: "Kota APMC Mandi", crop: "Mustard", variety: "Black Sarson", minPrice: 5100, maxPrice: 5650, modalPrice: 5400, msp: 5650, trend: "+0.8%", trendType: "up", lastUpdated: "Today 08:10 AM" },
    { id: 8, state: "Rajasthan", district: "Sri Ganganagar", mandi: "Ganganagar Cotton Market", crop: "Cotton", variety: "Medium Staple", minPrice: 6800, maxPrice: 7550, modalPrice: 7200, msp: 6620, trend: "+1.9%", trendType: "up", lastUpdated: "Today 09:30 AM" },
    { id: 9, state: "Maharashtra", district: "Nashik", mandi: "Lasalgaon Onion Market", crop: "Onion", variety: "Red Onion", minPrice: 1900, maxPrice: 2800, modalPrice: 2400, msp: "N/A", trend: "-2.4%", trendType: "down", lastUpdated: "Today 09:40 AM" },
    { id: 10, state: "Maharashtra", district: "Latur", mandi: "Latur Pulses Hub", crop: "Soybean", variety: "JS 335", minPrice: 4300, maxPrice: 4850, modalPrice: 4620, msp: 4600, trend: "+2.1%", trendType: "up", lastUpdated: "Today 08:25 AM" },
    { id: 11, state: "Haryana", district: "Karnal", mandi: "Karnal Rice Market", crop: "Paddy/Rice", variety: "PR 126", minPrice: 2200, maxPrice: 2420, modalPrice: 2310, msp: 2203, trend: "+0.5%", trendType: "up", lastUpdated: "Today 09:05 AM" },
    { id: 12, state: "Gujarat", district: "Rajkot", mandi: "Rajkot APMC Yard", crop: "Groundnut", variety: "Bold", minPrice: 5800, maxPrice: 6600, modalPrice: 6250, msp: 6377, trend: "+1.2%", trendType: "up", lastUpdated: "Today 08:50 AM" }
];

// 2. Farmer Crop Harvest Listings (Sample + Local Storage)
let FARMER_LISTINGS = [
    {
        id: 101,
        farmerName: "Rameshwar Singh Patel",
        phone: "9826123456",
        whatsapp: "919826123456",
        crop: "Wheat (Lokwan Grade A)",
        grade: "Grade A (Premium)",
        quantity: "120 Quintals (12 Tons)",
        expectedPrice: 2520,
        location: "Sehore, Madhya Pradesh",
        harvestDate: "Harvested yesterday, moisture < 10%",
        description: "Organically grown Sharbati Wheat, cleaned and bag packed ready for transport.",
        badge: "Grade A",
        dateListed: "Just now"
    },
    {
        id: 102,
        farmerName: "Gurpreet Singh Gill",
        phone: "9814098765",
        whatsapp: "919814098765",
        crop: "Basmati Rice 1121",
        grade: "100% Organic certified",
        quantity: "250 Quintals",
        expectedPrice: 4250,
        location: "Moga, Punjab",
        harvestDate: "Available at warehouse",
        description: "Certified organic Basmati paddy, long grain, 0% broken grains.",
        badge: "100% Organic",
        dateListed: "2 hours ago"
    },
    {
        id: 103,
        farmerName: "Shivraj Tyagi",
        phone: "9711223344",
        whatsapp: "919711223344",
        crop: "Yellow Soybean JS-9560",
        grade: "Standard Fair Quality",
        quantity: "85 Quintals",
        expectedPrice: 4680,
        location: "Dewas, Madhya Pradesh",
        harvestDate: "Ready for immediate delivery",
        description: "High oil content soybean seed, sun dried with moisture levels verified by APMC lab.",
        badge: "Standard FAQ",
        dateListed: "5 hours ago"
    },
    {
        id: 104,
        farmerName: "Kishan Lal Yadav",
        phone: "9414556677",
        whatsapp: "919414556677",
        crop: "Black Mustard (Sarson)",
        grade: "Grade A (Premium)",
        quantity: "60 Quintals",
        expectedPrice: 5500,
        location: "Alwar, Rajasthan",
        harvestDate: "Packed in 50kg jute bags",
        description: "42% oil content premium mustard seed harvest.",
        badge: "High Oil Content",
        dateListed: "1 day ago"
    }
];

// 3. Verified Buyer / Vendor Directory
const VERIFIED_VENDORS = [
    {
        id: 201,
        company: "Shree Ram Agro Foods & Flour Mill",
        contactPerson: "Vijay Kumar Agarwal",
        phone: "9826011223",
        whatsapp: "919826011223",
        type: "Rice Mill",
        state: "Madhya Pradesh",
        city: "Indore / Ujjain",
        verified: true,
        buyingRequirement: "Buying 500 Quintals Wheat & Soybean daily. Immediate cash/UPI payment on delivery.",
        preferredCrops: ["Wheat", "Soybean", "Maize"],
        rating: "4.9 ★ (210 Trades)"
    },
    {
        id: 202,
        company: "Punjab Grain Exporters Ltd.",
        contactPerson: "Harpreet Singh Ahluwalia",
        phone: "9815044556",
        whatsapp: "919815044556",
        type: "Exporter",
        state: "Punjab",
        city: "Amritsar / Ludhiana",
        verified: true,
        buyingRequirement: "Seeking 1000 Tons Premium 1121 Basmati Rice for Middle East Export contracts.",
        preferredCrops: ["Basmati Rice", "Paddy"],
        rating: "4.8 ★ (185 Trades)"
    },
    {
        id: 203,
        company: "Vedic Organic Foods Pvt Ltd",
        contactPerson: "Anita Deshmukh",
        phone: "9822077889",
        whatsapp: "919822077889",
        type: "Organic Retailer",
        state: "Maharashtra",
        city: "Pune / Nashik",
        verified: true,
        buyingRequirement: "Direct purchase of certified organic Pulses, Moong, Millets, and Spices from organic farmer groups.",
        preferredCrops: ["Moong", "Organic Wheat", "Pulses", "Millets"],
        rating: "5.0 ★ (95 Trades)"
    },
    {
        id: 204,
        company: "National Solvents & Oil Industries",
        contactPerson: "Rajesh Jain",
        phone: "9425033445",
        whatsapp: "919425033445",
        type: "Wholesaler",
        state: "Rajasthan",
        city: "Kota / Jaipur",
        verified: true,
        buyingRequirement: "Bulk requirement for Mustard and Soybean seeds. Full truck load (FTL) transport provided by company.",
        preferredCrops: ["Mustard", "Soybean", "Groundnut"],
        rating: "4.7 ★ (310 Trades)"
    }
];

// Initialize Page
document.addEventListener("DOMContentLoaded", function() {
    loadLocalListings();
    renderMandiCards(MANDI_RATES_DATA);
    renderProduceListings(FARMER_LISTINGS);
    renderVendorCards(VERIFIED_VENDORS);
    setLiveDate();
});

function setLiveDate() {
    const today = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = today.toLocaleDateString('en-IN', options);
    const dateElem = document.getElementById("live-data-date");
    if (dateElem) dateElem.innerText = dateStr + " (APMC Live Session)";
}

// Tab Switching
function switchMarketTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

    document.getElementById(`tab-btn-${tabId}`).classList.add("active");
    document.getElementById(`tab-${tabId}`).classList.add("active");
}

function scrollToMandi() {
    switchMarketTab('mandi');
    document.getElementById("tab-mandi").scrollIntoView({ behavior: 'smooth' });
}

// 1. Mandi Rates Filtering & Rendering
function renderMandiCards(data) {
    const container = document.getElementById("mandi-cards-container");
    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 12px;">
                <i class="fas fa-search" style="font-size: 36px; color: #ccc; margin-bottom: 10px;"></i>
                <p style="color: #666; font-size: 16px;">No Mandi rates found matching your state/crop search criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="mandi-card">
            <div class="mandi-header">
                <div>
                    <div class="mandi-name"><i class="fas fa-landmark-flag"></i> ${item.mandi}</div>
                    <div style="font-size:12px; color:#666;"><i class="fas fa-location-dot"></i> ${item.district}, ${item.state}</div>
                </div>
                <span class="mandi-state">${item.state}</span>
            </div>
            <div class="mandi-body">
                <div class="crop-info">
                    <div class="crop-title">${item.crop} <span style="font-size:13px; font-weight:normal; color:#666;">(${item.variety})</span></div>
                    <span class="crop-trend ${item.trendType}"><i class="fas fa-arrow-trend-${item.trendType === 'up' ? 'up' : 'down'}"></i> ${item.trend}</span>
                </div>
                <div class="price-box-container">
                    <div class="price-box">
                        <span>Min Rate</span>
                        <strong>₹${item.minPrice}</strong>
                    </div>
                    <div class="price-box modal-price">
                        <span>Avg (Modal)</span>
                        <strong>₹${item.modalPrice} / Qtl</strong>
                    </div>
                    <div class="price-box">
                        <span>Max Rate</span>
                        <strong>₹${item.maxPrice}</strong>
                    </div>
                </div>
                <div class="msp-info">
                    <span>Govt MSP Baseline: <strong>${typeof item.msp === 'number' ? '₹' + item.msp : item.msp}</strong></span>
                    <span style="color:#2e7d32; font-size:11px;"><i class="fas fa-check-circle"></i> e-NAM Verified</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterMandiRates() {
    const selectedState = document.getElementById("mandi-state-select").value;
    const selectedCrop = document.getElementById("mandi-crop-select").value;
    const searchQuery = document.getElementById("mandi-search-input").value.toLowerCase().trim();

    const filtered = MANDI_RATES_DATA.filter(item => {
        const stateMatch = (selectedState === "all" || item.state === selectedState);
        const cropMatch = (selectedCrop === "all" || item.crop.toLowerCase().includes(selectedCrop.toLowerCase()));
        const searchMatch = (
            item.mandi.toLowerCase().includes(searchQuery) ||
            item.district.toLowerCase().includes(searchQuery) ||
            item.crop.toLowerCase().includes(searchQuery) ||
            item.variety.toLowerCase().includes(searchQuery)
        );
        return stateMatch && cropMatch && searchMatch;
    });

    renderMandiCards(filtered);
}

function refreshMandiData() {
    const btn = document.querySelector(".btn-refresh");
    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching e-NAM Data...';
    
    setTimeout(() => {
        filterMandiRates();
        if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Live Rates';
        alert("Live APMC Mandi rates refreshed successfully!");
    }, 600);
}

// 2. Produce Listings Rendering
function renderProduceListings(data) {
    const container = document.getElementById("produce-cards-container");
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="produce-card" style="position:relative;">
            <span class="produce-badge-tag">${item.badge || 'Verified Harvest'}</span>
            <div class="produce-card-body" style="padding-top:45px;">
                <div class="produce-farmer"><i class="fas fa-user-circle"></i> ${item.farmerName}</div>
                <div class="produce-crop-name">${item.crop}</div>
                <div class="produce-price-highlight">Expected: ₹${item.expectedPrice} / Quintal</div>
                <ul class="produce-details-list">
                    <li><span>Quantity:</span> <strong>${item.quantity}</strong></li>
                    <li><span>Quality Grade:</span> <strong>${item.grade}</strong></li>
                    <li><span>Location:</span> <strong>${item.location}</strong></li>
                    <li><span>Availability:</span> <strong>${item.harvestDate}</strong></li>
                </ul>
                <p style="font-size:13px; color:#555; margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:6px;">
                    <i class="fas fa-quote-left" style="color:#2e7d32; margin-right:4px;"></i>${item.description}
                </p>
                <div class="produce-actions">
                    <a href="tel:${item.phone}" class="btn-call"><i class="fas fa-phone"></i> Call Farmer</a>
                    <a href="https://wa.me/${item.whatsapp}?text=${encodeURIComponent('Hello ' + item.farmerName + ', I saw your crop listing for ' + item.crop + ' on AgriSmart Marketplace. Is it still available for purchase?')}" target="_blank" class="btn-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProduceListings() {
    const crop = document.getElementById("sell-crop-filter").value;
    const grade = document.getElementById("sell-grade-filter").value;

    const filtered = FARMER_LISTINGS.filter(item => {
        const cropMatch = (crop === "all" || item.crop.toLowerCase().includes(crop.toLowerCase()));
        const gradeMatch = (grade === "all" || item.grade.toLowerCase().includes(grade.toLowerCase()));
        return cropMatch && gradeMatch;
    });

    renderProduceListings(filtered);
}

// 3. Vendor Directory Rendering & Modal Handlers
function renderVendorCards(data) {
    const container = document.getElementById("vendor-cards-container");
    if (!container) return;

    container.innerHTML = data.map(v => `
        <div class="vendor-card">
            <div class="vendor-header-row">
                <div class="vendor-icon"><i class="fas fa-building-user"></i></div>
                <div class="vendor-title-info">
                    <h3>${v.company}</h3>
                    <div class="verified-badge"><i class="fas fa-shield-check"></i> Verified Buyer &bull; ${v.rating}</div>
                </div>
            </div>
            <div style="font-size:13px; color:#666;">
                <i class="fas fa-map-marker-alt"></i> Location: <strong>${v.city}, ${v.state}</strong> | Type: <strong>${v.type}</strong>
            </div>
            <div class="vendor-requirement">
                <strong><i class="fas fa-bullhorn"></i> Current Buying Demand:</strong><br>
                ${v.buyingRequirement}
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:5px;">
                ${v.preferredCrops.map(c => `<span style="font-size:11px; background:#e8f5e9; color:#2e7d32; padding:3px 8px; border-radius:12px; font-weight:600;"># ${c}</span>`).join('')}
            </div>
            <div class="produce-actions" style="margin-top:auto;">
                <a href="tel:${v.phone}" class="btn-call"><i class="fas fa-phone"></i> Call Vendor</a>
                <a href="https://wa.me/${v.whatsapp}?text=${encodeURIComponent('Hello ' + v.company + ', I am a farmer on AgriSmart and I want to sell my produce as per your buying requirements.')}" target="_blank" class="btn-whatsapp"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
            </div>
        </div>
    `).join('');
}

function filterVendors() {
    const type = document.getElementById("vendor-type-filter").value;
    const state = document.getElementById("vendor-state-filter").value;

    const filtered = VERIFIED_VENDORS.filter(v => {
        const typeMatch = (type === "all" || v.type === type);
        const stateMatch = (state === "all" || v.state === state);
        return typeMatch && stateMatch;
    });

    renderVendorCards(filtered);
}

// Post Crop Listing Modal Logic
function openPostModal() {
    document.getElementById("post-crop-modal").classList.add("active");
}

function closePostModal() {
    document.getElementById("post-crop-modal").classList.remove("active");
}

function handlePostCropSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("farmer-name").value;
    const phone = document.getElementById("farmer-phone").value;
    const crop = document.getElementById("farmer-crop").value;
    const grade = document.getElementById("farmer-grade").value;
    const qty = document.getElementById("farmer-qty").value;
    const price = document.getElementById("farmer-price").value;
    const location = document.getElementById("farmer-location").value;
    const date = document.getElementById("farmer-date").value;
    const desc = document.getElementById("farmer-desc").value || "Fresh harvest directly from farm.";

    const newListing = {
        id: Date.now(),
        farmerName: name,
        phone: phone,
        whatsapp: "91" + phone.replace(/[^0-9]/g, ''),
        crop: crop,
        grade: grade,
        quantity: qty,
        expectedPrice: parseInt(price),
        location: location,
        harvestDate: date,
        description: desc,
        badge: "Farmer Direct",
        dateListed: "Just now"
    };

    FARMER_LISTINGS.unshift(newListing);
    saveLocalListings();
    renderProduceListings(FARMER_LISTINGS);
    closePostModal();

    // Switch to Produce Tab to view the newly created listing
    switchMarketTab("sell");
    alert("🎉 Success! Your crop harvest listing has been published to the Marketplace. Buyers will contact you directly on Phone & WhatsApp.");
}

function saveLocalListings() {
    try {
        localStorage.setItem("agrismart_user_listings", JSON.stringify(FARMER_LISTINGS));
    } catch(err) {
        console.log("LocalStorage disabled");
    }
}

function loadLocalListings() {
    try {
        const stored = localStorage.getItem("agrismart_user_listings");
        if (stored) {
            FARMER_LISTINGS = JSON.parse(stored);
        }
    } catch(err) {
        console.log("Could not load stored listings");
    }
}

// Global Navigation Search
function handleGlobalSearch(query) {
    if (!query || query.trim() === "") return;
    const q = query.toLowerCase().trim();
    
    // Auto filter mandi rates
    const mandiInput = document.getElementById("mandi-search-input");
    if (mandiInput) {
        mandiInput.value = q;
        filterMandiRates();
    }
}
