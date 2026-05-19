// ========== DARK MODE ==========
let darkModeBtn = document.createElement('button');
darkModeBtn.innerHTML = '🌙';
darkModeBtn.className = 'theme-btn';
darkModeBtn.style.background = 'none';
darkModeBtn.style.border = 'none';
darkModeBtn.style.fontSize = '1.2rem';
darkModeBtn.style.cursor = 'pointer';
const navActions = document.querySelector('.nav-actions');
if (navActions) navActions.prepend(darkModeBtn);
if (localStorage.getItem('bharathomes_theme') === 'dark') {
  document.documentElement.classList.add('dark-theme');
  darkModeBtn.innerHTML = '☀️';
}
darkModeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-theme');
  const isDark = document.documentElement.classList.contains('dark-theme');
  localStorage.setItem('bharathomes_theme', isDark ? 'dark' : 'light');
  darkModeBtn.innerHTML = isDark ? '☀️' : '🌙';
});

// ========== CLOCK ==========
function updateClock() {
  const clock = document.getElementById('liveClock');
  if (clock) clock.innerText = new Date().toLocaleTimeString('en-IN');
}
setInterval(updateClock, 1000);
updateClock();

// ========== PROPERTY DATA ==========
const properties = [
  { id: 1, title: "Luxury 3BHK Apartment", price: 125, city: "Indore", bhk: "3 BHK", area: "1500 sqft", type: "Apartment", img: "property1.png", rera: true, verified: true, zeroBrokerage: true, phone: "9876543210" },
  { id: 2, title: "Independent Villa", price: 320, city: "Jaipur", bhk: "4+ BHK", area: "2800 sqft", type: "Villa", img: "property2.png", rera: true, verified: true, zeroBrokerage: true, phone: "9876543211" },
  { id: 3, title: "Studio Apartment", price: 45, city: "Lucknow", bhk: "1 BHK", area: "600 sqft", type: "Apartment", img: "property3.png", rera: false, verified: true, zeroBrokerage: false, phone: "9876543212" },
  { id: 4, title: "Commercial Office Space", price: 85, city: "Coimbatore", bhk: "Office", area: "1200 sqft", type: "Commercial", img: "property4.png", rera: true, verified: false, zeroBrokerage: true, phone: "9876543213" },
  { id: 5, title: "Luxury Penthouse", price: 450, city: "Nagpur", bhk: "4+ BHK", area: "3200 sqft", type: "Apartment", img: "property5.png", rera: true, verified: true, zeroBrokerage: true, phone: "9876543214" },
  { id: 6, title: "Affordable 2BHK Flat", price: 38, city: "Indore", bhk: "2 BHK", area: "950 sqft", type: "Apartment", img: "property6.png", rera: false, verified: true, zeroBrokerage: true, phone: "9876543215" },
  { id: 7, title: "Residential Plot", price: 25, city: "Jaipur", bhk: "Plot", area: "1200 sqft", type: "Plot", img: "plot1.png", rera: true, verified: true, zeroBrokerage: true, phone: "9876543216" },
  { id: 8, title: "Agricultural Land", price: 60, city: "Lucknow", bhk: "Land", area: "0.5 acre", type: "Plot", img: "plot2.png", rera: false, verified: true, zeroBrokerage: true, phone: "9876543217" },
  { id: 9, title: "Corner Plot", price: 35, city: "Coimbatore", bhk: "Plot", area: "1800 sqft", type: "Plot", img: "plot3.png", rera: true, verified: true, zeroBrokerage: false, phone: "9876543218" },
  { id: 10, title: "Modern Villa with Pool", price: 280, city: "Nagpur", bhk: "3 BHK", area: "2400 sqft", type: "Villa", img: "property2.png", rera: true, verified: true, zeroBrokerage: true, phone: "9876543219" }
];

let displayedCount = 6;
let wishlist = JSON.parse(localStorage.getItem('bharathomes_wishlist')) || [];
let leads = JSON.parse(localStorage.getItem('bharathomes_leads')) || [];
let currentTab = "buy";
let currentFilters = { type: "all", city: "all", bhk: "all", maxPrice: 300 };

// ========== RENDER PROPERTY GRID ==========
function renderProperties() {
  let filtered = properties.filter(p => {
    if (currentTab === "buy" && p.type === "Plot") return false;
    if (currentTab === "plots" && p.type !== "Plot") return false;
    if (currentTab === "rent") return false; // no rent data yet – keep all for buy
    if (currentFilters.type !== "all" && p.type !== currentFilters.type) return false;
    if (currentFilters.bhk !== "all" && p.bhk !== currentFilters.bhk) return false;
    if (p.price > currentFilters.maxPrice) return false;
    return true;
  });
  const toShow = filtered.slice(0, displayedCount);
  const container = document.getElementById('propertyGrid');
  if (!container) return;
  container.innerHTML = toShow.map(p => `
    <div class="property-card" data-id="${p.id}">
      <img src="/demos/real-estate-demo/assets/${p.img}" class="property-img" alt="${p.title}" onerror="this.src='https://placehold.co/300x200?text=Image+Not+Found'">
      <div class="property-info">
        <div class="property-title">${p.title}</div>
        <div class="property-price">₹${p.price} Lakhs</div>
        <div class="property-details"><span>${p.bhk}</span><span>${p.area}</span><span>${p.type}</span><span>${p.city}</span></div>
        <div class="badges">
          ${p.rera ? '<span class="badge">RERA Approved</span>' : ''}
          ${p.verified ? '<span class="badge">Verified by Local Expert</span>' : ''}
          ${p.zeroBrokerage ? '<span class="badge">Zero Brokerage</span>' : ''}
        </div>
        <div class="actions">
          <button class="wishlist-btn ${wishlist.includes(p.id) ? 'active' : ''}" data-id="${p.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ${wishlist.includes(p.id) ? 'Saved' : 'Save'}
          </button>
          <button class="whatsapp-btn" data-phone="${p.phone}" data-title="${p.title}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.86.5 3.61 1.37 5.13L2 22l4.87-1.37C8.39 21.5 10.14 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/><path d="M16.5 14.5c-.3.8-1.5 1.5-2.5 1.5s-2-.7-2.5-1.5c-.5-.8-1.5-2-2-2.5-.5-.5-1.5-1-2-1.5-.5-.5-1-1.5-.5-2.5s1-1.5 1.5-2c.5-.5 1-.5 1.5 0 .5.5 1 1.5 1.5 2 .5.5 0 1-.5 1.5-.5.5-1 1-.5 1.5.5.5 1.5 1 2 1.5.5.5 1.5 1 2 .5s1-1.5 1.5-2c.5-.5 1-.5 1.5 0 .5.5 1 1.5 1.5 2 .5.5.5 1 0 1.5z" fill="white"/></svg>
            WhatsApp
          </button>
          <button class="view-phone-btn" data-phone="${p.phone}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            View Phone
          </button>
        </div>
        <div class="phone-display" style="display:none; margin-top:0.5rem; font-size:0.8rem;"></div>
      </div>
    </div>
  `).join('');
  attachEvents();
}
function attachEvents() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      if (wishlist.includes(id)) wishlist = wishlist.filter(i => i !== id);
      else wishlist.push(id);
      localStorage.setItem('bharathomes_wishlist', JSON.stringify(wishlist));
      renderProperties();
      renderWishlist();
    };
  });
  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.onclick = () => {
      const phone = btn.dataset.phone;
      const title = btn.dataset.title;
      window.open(`https://wa.me/91${phone}?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(title)}`, '_blank');
      leads.push({ type: 'whatsapp', property: title, timestamp: new Date().toISOString() });
      localStorage.setItem('bharathomes_leads', JSON.stringify(leads));
    };
  });
  document.querySelectorAll('.view-phone-btn').forEach(btn => {
    btn.onclick = () => {
      const phone = btn.dataset.phone;
      const parent = btn.closest('.property-card');
      const display = parent.querySelector('.phone-display');
      if (display.style.display === 'none') {
        display.innerHTML = `📞 Owner: +91 ${phone}`;
        display.style.display = 'block';
        leads.push({ type: 'phone_view', phone, timestamp: new Date().toISOString() });
        localStorage.setItem('bharathomes_leads', JSON.stringify(leads));
      } else {
        display.style.display = 'none';
      }
    };
  });
}

// ========== WISHLIST ==========
function renderWishlist() {
  const container = document.getElementById('wishlistGrid');
  if (!container) return;
  const wishlistProps = properties.filter(p => wishlist.includes(p.id));
  if (wishlistProps.length === 0) { container.innerHTML = '<p>No saved properties yet.</p>'; return; }
  container.innerHTML = wishlistProps.map(p => `
    <div class="property-card">
      <img src="/demos/real-estate-demo/assets/${p.img}" class="property-img" alt="${p.title}" onerror="this.src='https://placehold.co/300x200?text=Image+Not+Found'">
      <div class="property-info">
        <div class="property-title">${p.title}</div>
        <div class="property-price">₹${p.price}L</div>
        <button class="whatsapp-btn" data-phone="${p.phone}" data-title="${p.title}">WhatsApp</button>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    btn.onclick = () => window.open(`https://wa.me/91${btn.dataset.phone}?text=Hi%2C%20interested%20in%20${encodeURIComponent(btn.dataset.title)}`, '_blank');
  });
}

// ========== HERO CAROUSEL ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('carouselDots');
function updateCarousel() {
  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  const dots = document.querySelectorAll('.dot');
  if (dots.length) dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}
function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  updateCarousel();
}
if (slides.length && dotsContainer) {
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  setInterval(() => goToSlide(currentSlide + 1), 5000);
}

// ========== HERO TABS & SEARCH ==========
document.querySelectorAll('.hero-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.hero-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    const placeholder = currentTab === 'plots' ? 'Search for plots, agricultural land...' : `Search for ${currentTab} properties...`;
    const searchInput = document.getElementById('heroSearch');
    if (searchInput) searchInput.placeholder = placeholder;
    renderProperties();
  });
});
const heroSearchBtn = document.getElementById('heroSearchBtn');
if (heroSearchBtn) {
  heroSearchBtn.addEventListener('click', () => {
    const query = document.getElementById('heroSearch')?.value.toLowerCase();
    if (query && query.length > 2) {
      const matched = properties.filter(p => p.title.toLowerCase().includes(query) || p.city.toLowerCase().includes(query));
      alert(`Found ${matched.length} properties matching "${query}". Use filters for detailed search.`);
    }
  });
}
const budgetSlider = document.getElementById('budgetSlider');
if (budgetSlider) {
  budgetSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    const budgetSpan = document.getElementById('budgetValue');
    if (budgetSpan) budgetSpan.innerText = (val / 10).toFixed(0);
    currentFilters.maxPrice = val;
    renderProperties();
  });
}
const heroBHK = document.getElementById('heroBHK');
if (heroBHK) {
  heroBHK.addEventListener('change', (e) => {
    currentFilters.bhk = e.target.value === 'all' ? 'all' : e.target.value;
    renderProperties();
  });
}
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilters.type = chip.dataset.filterType === 'all' ? 'all' : chip.dataset.filterType;
    renderProperties();
  });
});
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    displayedCount += 3;
    renderProperties();
  });
}

// ========== EMI CALCULATOR ==========
const loanAmount = document.getElementById('loanAmount');
const downPayment = document.getElementById('downPayment');
const interestRate = document.getElementById('interestRate');
function calculateEMI() {
  const principal = (loanAmount.value - downPayment.value) * 100000;
  const rate = interestRate.value / 12 / 100;
  const months = 240;
  if (principal <= 0) {
    const emiResultSpan = document.getElementById('emiResult');
    if (emiResultSpan) emiResultSpan.innerText = '0';
    return;
  }
  const emi = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  const emiResultSpan = document.getElementById('emiResult');
  if (emiResultSpan) emiResultSpan.innerText = Math.round(emi);
}
if (loanAmount) {
  loanAmount.addEventListener('input', () => {
    const amountValSpan = document.getElementById('amountVal');
    if (amountValSpan) amountValSpan.innerText = loanAmount.value;
    calculateEMI();
  });
}
if (downPayment) {
  downPayment.addEventListener('input', () => {
    const downValSpan = document.getElementById('downVal');
    if (downValSpan) downValSpan.innerText = downPayment.value;
    calculateEMI();
  });
}
if (interestRate) {
  interestRate.addEventListener('input', () => {
    const rateValSpan = document.getElementById('rateVal');
    if (rateValSpan) rateValSpan.innerText = interestRate.value;
    calculateEMI();
  });
}
calculateEMI();

// ========== ADMIN PANEL ==========
function renderAdminLeads() {
  const container = document.getElementById('adminLeadsList');
  if (!container) return;
  if (leads.length === 0) { container.innerHTML = '<p>No leads yet.</p>'; return; }
  container.innerHTML = leads.map(l => `<div><strong>${l.type}</strong> - ${l.property || l.phone || ''} - ${new Date(l.timestamp).toLocaleString()}</div>`).join('');
}
const adminLoginBtn = document.getElementById('adminLoginBtn');
if (adminLoginBtn) {
  adminLoginBtn.addEventListener('click', () => {
    const pwd = document.getElementById('adminPassword').value;
    if (pwd === 'admin123') {
      const adminDataDiv = document.getElementById('adminData');
      if (adminDataDiv) adminDataDiv.style.display = 'block';
      renderAdminLeads();
    } else alert('Wrong password');
  });
}
const clearAllDataBtn = document.getElementById('clearAllData');
if (clearAllDataBtn) {
  clearAllDataBtn.addEventListener('click', () => {
    if (confirm('Delete all leads?')) {
      leads = [];
      localStorage.setItem('bharathomes_leads', JSON.stringify(leads));
      renderAdminLeads();
      alert('All data cleared.');
    }
  });
}

// ========== POST PROPERTY MODAL ==========
function openPostModal() {
  alert('Post Property feature will be available soon. Meanwhile, call us at +91 9876543210.');
}
const postBtn = document.getElementById('postPropertyBtn');
if (postBtn) postBtn.addEventListener('click', openPostModal);
const mobilePostBtn = document.getElementById('mobilePostBtn');
if (mobilePostBtn) mobilePostBtn.addEventListener('click', openPostModal);

// ========== NAVIGATION & MOBILE MENU ==========
function showSection(sectionId) {
  const homeSection = document.getElementById('homeSection');
  if (homeSection) homeSection.style.display = sectionId === 'home' ? 'block' : 'none';
  const propertyFeed = document.querySelector('.property-feed');
  if (propertyFeed) propertyFeed.style.display = sectionId === 'home' ? 'block' : 'none';
  const wishlistSection = document.getElementById('wishlistSection');
  if (wishlistSection) wishlistSection.style.display = sectionId === 'wishlist' ? 'block' : 'none';
  const adminSection = document.getElementById('adminSection');
  if (adminSection) adminSection.style.display = sectionId === 'admin' ? 'block' : 'none';
  if (sectionId === 'wishlist') renderWishlist();
}
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    showSection(section);
    const mobileNavDiv = document.getElementById('mobileNav');
    if (mobileNavDiv) mobileNavDiv.style.display = 'none';
  });
});
document.querySelectorAll('[data-tab]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = link.dataset.tab;
    const heroTab = document.querySelector(`.hero-tab[data-tab="${tab}"]`);
    if (heroTab) {
      document.querySelectorAll('.hero-tab').forEach(t => t.classList.remove('active'));
      heroTab.classList.add('active');
      currentTab = tab;
      renderProperties();
    }
  });
});
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ========== INIT ==========
renderProperties();