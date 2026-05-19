// ========== DARK/LIGHT MODE ==========
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('vedic_theme') === 'dark') {
  document.documentElement.classList.add('dark-theme');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-theme');
  const isDark = document.documentElement.classList.contains('dark-theme');
  localStorage.setItem('vedic_theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// ========== CLOCK & GREETING ==========
function updateClock() {
  const clock = document.getElementById('liveClock');
  if (clock) clock.innerText = new Date().toLocaleTimeString('en-IN');
}
setInterval(updateClock, 1000);
updateClock();

function setGreeting() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "प्रभात" : hour < 17 ? "दोपहर" : "सायंकाल";
  document.getElementById('dynamicGreeting').innerText = greet;
}
setGreeting();

// ========== PANCHANG DATA ==========
const panchanga = {
  sunrise: "6:32 AM", sunset: "6:15 PM", moonrise: "7:45 PM", moonset: "8:10 AM",
  tithi: "Dashami", nakshatra: "Rohini", yoga: "Vishkumbha", karana: "Vanija"
};
function updatePanchangaUI(data) {
  const ids = ['sunrise','sunset','tithi','nakshatra','detailSunrise','detailSunset','moonrise','moonset','detailTithi','detailNakshatra','yoga','karana'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.innerText = data[id] || '--'; });
  // manual mapping for safety
  document.getElementById('sunrise').innerText = data.sunrise;
  document.getElementById('sunset').innerText = data.sunset;
  document.getElementById('tithi').innerText = data.tithi;
  document.getElementById('nakshatra').innerText = data.nakshatra;
  document.getElementById('detailSunrise').innerText = data.sunrise;
  document.getElementById('detailSunset').innerText = data.sunset;
  document.getElementById('moonrise').innerText = data.moonrise;
  document.getElementById('moonset').innerText = data.moonset;
  document.getElementById('detailTithi').innerText = data.tithi;
  document.getElementById('detailNakshatra').innerText = data.nakshatra;
  document.getElementById('yoga').innerText = data.yoga;
  document.getElementById('karana').innerText = data.karana;
}
updatePanchangaUI(panchanga);

// ========== TAB SWITCHING (for both tab buttons and navigation links) ==========
function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  // Update navigation links active state
  document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
    if (link.dataset.tab === tabId) link.classList.add('active');
    else link.classList.remove('active');
  });
  // Show correct tab content
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.classList.add('active');
  // Smooth scroll to top of main content
  document.querySelector('.main-tab-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});
// Desktop navigation links
document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (link.dataset.tab) switchTab(link.dataset.tab);
  });
});
// Mobile navigation links
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (link.dataset.tab) {
      switchTab(link.dataset.tab);
      document.getElementById('mobileNav').style.display = 'none';
    }
  });
});

// ========== ASTROLOGY / RASHIFAL ==========
const rashifal = [
  "♈ Aries: Good day for new beginnings", "♉ Taurus: Financial gains", "♊ Gemini: Communication improves",
  "♋ Cancer: Family harmony", "♌ Leo: Leadership shines", "♍ Virgo: Health focus",
  "♎ Libra: Relationships blossom", "♏ Scorpio: Hidden opportunities", "♐ Sagittarius: Travel likely",
  "♑ Capricorn: Career progress", "♒ Aquarius: Social circle expands", "♓ Pisces: Creative energy"
];
function renderRashifal() {
  const container = document.getElementById('rashifalGrid');
  if (container) container.innerHTML = rashifal.map(r => `<div class="rashifal-item">${r}</div>`).join('');
}
renderRashifal();

// ========== PLANETARY DATA ==========
const planets = [
  { name: "Sun", sign: "Aries" }, { name: "Moon", sign: "Taurus" }, { name: "Mars", sign: "Gemini" },
  { name: "Mercury", sign: "Cancer" }, { name: "Jupiter", sign: "Leo" }, { name: "Venus", sign: "Virgo" },
  { name: "Saturn", sign: "Libra" }, { name: "Rahu", sign: "Scorpio" }, { name: "Ketu", sign: "Sagittarius" }
];
function renderPlanets() {
  const container = document.getElementById('planetList');
  if (container) {
    container.innerHTML = planets.map(p => `
      <div class="planet-item">
        <img src="/demos/jyotish-demo/assets/planet-${p.name.toLowerCase()}.png" class="planet-icon" onerror="this.src='https://placehold.co/24x24?text=${p.name.charAt(0)}'">
        <span>${p.name}: ${p.sign}</span>
      </div>
    `).join('');
  }
}
renderPlanets();

// ========== SIDEBAR FESTIVALS ==========
const festivalsSide = [
  { name: "Maha Shivaratri", date: "Feb 26" }, { name: "Holi", date: "Mar 14" },
  { name: "Ram Navami", date: "Mar 27" }, { name: "Janmashtami", date: "Aug 26" },
  { name: "Ganesh Chaturthi", date: "Sep 15" }, { name: "Diwali", date: "Nov 12" }
];
function renderSidebar() {
  const container = document.getElementById('eventSidebar');
  if (container) container.innerHTML = festivalsSide.map(f => `<div class="sidebar-event"><span>${f.name}</span><span>${f.date}</span></div>`).join('');
}
renderSidebar();

// ========== KUNDALI GENERATOR ==========
const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
function getZodiacIndex(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1, day = d.getDate();
  if ((month==3 && day>=21) || (month==4 && day<=19)) return 0;
  if ((month==4 && day>=20) || (month==5 && day<=20)) return 1;
  if ((month==5 && day>=21) || (month==6 && day<=20)) return 2;
  if ((month==6 && day>=21) || (month==7 && day<=22)) return 3;
  if ((month==7 && day>=23) || (month==8 && day<=22)) return 4;
  if ((month==8 && day>=23) || (month==9 && day<=22)) return 5;
  if ((month==9 && day>=23) || (month==10 && day<=22)) return 6;
  if ((month==10 && day>=23) || (month==11 && day<=21)) return 7;
  if ((month==11 && day>=22) || (month==12 && day<=21)) return 8;
  if ((month==12 && day>=22) || (month==1 && day<=19)) return 9;
  if ((month==1 && day>=20) || (month==2 && day<=18)) return 10;
  return 11;
}
function generateKundaliChart(name, dob) {
  const ascIndex = getZodiacIndex(dob);
  const lagna = zodiacSigns[ascIndex];
  const houses = [];
  for (let i = 1; i <= 12; i++) {
    const signIdx = (ascIndex + i - 1) % 12;
    houses.push({ number: i, sign: zodiacSigns[signIdx], planets: [] });
  }
  // Place planets in houses (simple mock)
  const planetList = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  planetList.forEach((planet, idx) => {
    const houseIdx = (ascIndex + idx) % 12;
    houses[houseIdx].planets.push(planet);
  });
  let chartHtml = '<div class="kundali-grid">';
  houses.forEach(house => {
    const planetAbbr = house.planets.map(p => p.substring(0,2)).join(', ');
    chartHtml += `
      <div class="kundali-cell">
        <div class="house-number">${house.number}</div>
        <div class="house-sign">${house.sign.substring(0,3)}</div>
        <div class="house-planets">${planetAbbr || '—'}</div>
      </div>
    `;
  });
  chartHtml += '</div>';
  return { lagna, chartHtml };
}

const kundaliForm = document.getElementById('kundaliForm');
if (kundaliForm) {
  kundaliForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('kundaliName').value.trim();
    const dob = document.getElementById('kundaliDob').value;
    if (!name || !dob) { alert("Please enter Name and Date of Birth."); return; }
    const chart = generateKundaliChart(name, dob);
    document.getElementById('kundaliResult').innerHTML = `<p><strong>${name}</strong>, Lagna (Ascendant): ${chart.lagna}</p>`;
    const chartDiv = document.getElementById('kundaliChart');
    chartDiv.innerHTML = chart.chartHtml;
    chartDiv.style.display = 'block';
  });
}

// ========== REGIONAL PANCHANG SIMULATION ==========
document.getElementById('updatePanchangaBtn')?.addEventListener('click', () => {
  alert("Demo: Panchang data would refresh based on selected region.");
});

// ========== SCROLL ANIMATIONS ==========
const fadeElements = document.querySelectorAll('.scroll-fade');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

// ========== MOBILE MENU TOGGLE ==========
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ========== INITIAL ACTIVE TAB ==========
switchTab('panchang');