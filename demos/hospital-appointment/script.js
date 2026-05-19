// ========== DARK/LIGHT MODE ==========
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('careconnect_theme') === 'dark') {
  document.documentElement.classList.add('dark-theme');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-theme');
  const isDark = document.documentElement.classList.contains('dark-theme');
  localStorage.setItem('careconnect_theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// ========== CLOCK ==========
function updateClock() {
  const clock = document.getElementById('liveClock');
  if (clock) clock.innerText = new Date().toLocaleTimeString('en-IN');
}
setInterval(updateClock, 1000);
updateClock();

// ========== DOCTOR DATA (with locations, genders, languages) ==========
const doctors = [
  { id: 1, name: "Dr. Rajesh Sharma", specialty: "Cardiology", experience: "15 years", fee: 1200, rating: 4.8, img: "/demos/hospital-appointment/assets/doctor-cardio.png", location: "Delhi", gender: "Male", language: "English,Hindi", availability: "Today" },
  { id: 2, name: "Dr. Meera Gupta", specialty: "Gynecology", experience: "12 years", fee: 1100, rating: 4.7, img: "/demos/hospital-appointment/assets/doctor-gyno.png", location: "Mumbai", gender: "Female", language: "English,Hindi", availability: "Tomorrow" },
  { id: 3, name: "Dr. Anjali Verma", specialty: "Pediatrics", experience: "8 years", fee: 900, rating: 4.9, img: "/demos/hospital-appointment/assets/doctor-pedia.png", location: "Delhi", gender: "Female", language: "English", availability: "Today" },
  { id: 4, name: "Dr. Vikram Singh", specialty: "Dermatology", experience: "10 years", fee: 1000, rating: 4.6, img: "/demos/hospital-appointment/assets/doctor-derma.png", location: "Bengaluru", gender: "Male", language: "English,Hindi", availability: "Tomorrow" },
  { id: 5, name: "Dr. Sanjay Mehta", specialty: "Orthopedics", experience: "20 years", fee: 1300, rating: 4.8, img: "/demos/hospital-appointment/assets/doctor-ortho.png", location: "Delhi", gender: "Male", language: "English", availability: "Today" },
  { id: 6, name: "Dr. Priya Nair", specialty: "Neurology", experience: "14 years", fee: 1400, rating: 4.9, img: "/demos/hospital-appointment/assets/doctor-neuro.png", location: "Mumbai", gender: "Female", language: "English,Hindi", availability: "Today" }
];

// ========== ADVANCED FILTER STATE ==========
let currentFilters = { location: "all", gender: "all", language: "all", availability: "all", specialty: "all" };
let bookedSlots = JSON.parse(localStorage.getItem('careconnect_bookedSlots')) || {}; // { doctorId_date_time: true }

// ========== RENDER DOCTORS WITH ALL FILTERS ==========
function renderDoctors() {
  const grid = document.getElementById('doctorGrid');
  if (!grid) return;
  let filtered = doctors.filter(d => {
    if (currentFilters.specialty !== "all" && d.specialty !== currentFilters.specialty) return false;
    if (currentFilters.location !== "all" && d.location !== currentFilters.location) return false;
    if (currentFilters.gender !== "all" && d.gender !== currentFilters.gender) return false;
    if (currentFilters.language !== "all" && !d.language.includes(currentFilters.language)) return false;
    if (currentFilters.availability !== "all" && d.availability !== currentFilters.availability) return false;
    return true;
  });
  grid.innerHTML = filtered.map(doc => `
    <div class="doctor-card">
      <img src="${doc.img}" class="doctor-img" onerror="this.src='https://placehold.co/100x100?text=👨‍⚕️'">
      <h3>${doc.name}</h3>
      <div class="doctor-specialty">${doc.specialty}</div>
      <div class="doctor-experience"><i class="fas fa-briefcase"></i> ${doc.experience}</div>
      <div class="doctor-fee"><i class="fas fa-rupee-sign"></i> ${doc.fee}</div>
      <div class="doctor-rating"><i class="fas fa-star"></i> ${doc.rating}</div>
      <div class="doctor-location"><i class="fas fa-map-marker-alt"></i> ${doc.location}</div>
      <div>
        <button class="book-btn" data-id="${doc.id}" data-name="${doc.name}">Book</button>
        <button class="view-profile-btn" data-id="${doc.id}">Profile</button>
      </div>
    </div>
  `).join('');
  attachDoctorEvents();
}
function attachDoctorEvents() {
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => openBookingModal(btn.dataset.id, btn.dataset.name));
  });
  document.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', () => showDoctorProfile(parseInt(btn.dataset.id)));
  });
}

// ========== DOCTOR PROFILE MODAL ==========
function showDoctorProfile(doctorId) {
  const doc = doctors.find(d => d.id === doctorId);
  if (!doc) return;
  const modal = document.getElementById('doctorProfileModal');
  const content = document.getElementById('doctorProfileContent');
  content.innerHTML = `
    <div style="text-align:center"><img src="${doc.img}" style="width:120px;height:120px;border-radius:50%;border:3px solid var(--accent);margin-bottom:1rem"></div>
    <h3>${doc.name}</h3>
    <p><strong>Specialty:</strong> ${doc.specialty}</p>
    <p><strong>Experience:</strong> ${doc.experience}</p>
    <p><strong>Fee:</strong> ₹${doc.fee}</p>
    <p><strong>Location:</strong> ${doc.location}</p>
    <p><strong>Languages:</strong> ${doc.language}</p>
    <p><strong>Qualifications:</strong> MBBS, MD (Gold Medalist), Fellowship in ${doc.specialty}</p>
    <p><strong>Awards:</strong> Best Doctor Award 2024, Excellence in Healthcare 2025</p>
    <button class="btn-primary" style="margin-top:1rem" onclick="openBookingModal('${doc.id}','${doc.name}')">Book Appointment</button>
  `;
  modal.style.display = 'flex';
}

// ========== BOOKING MODAL WITH REAL-TIME SLOT AVAILABILITY ==========
const modal = document.getElementById('bookingModal');
const closeModal = document.querySelectorAll('.modal-close');
closeModal.forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}));
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) e.target.style.display = 'none';
});

function openBookingModal(docId, docName) {
  document.getElementById('bookDoctorId').value = docId;
  document.getElementById('bookDoctorName').value = docName;
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('appointmentDate');
  dateInput.min = today;
  dateInput.value = today;
  updateAvailableSlots(docId, today);
  dateInput.addEventListener('change', () => updateAvailableSlots(docId, dateInput.value));
  modal.style.display = 'flex';
}
function updateAvailableSlots(docId, date) {
  const timeSelect = document.getElementById('appointmentTime');
  const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  const booked = bookedSlots;
  const available = slots.filter(slot => !booked[`${docId}_${date}_${slot}`]);
  timeSelect.innerHTML = '<option value="">Select Time</option>' + available.map(s => `<option value="${s}">${s}</option>`).join('');
}

// ========== BOOKING FORM SUBMIT ==========
document.getElementById('bookingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const docId = document.getElementById('bookDoctorId').value;
  const docName = document.getElementById('bookDoctorName').value;
  const patientName = document.getElementById('patientName').value.trim();
  const patientAge = document.getElementById('patientAge').value;
  const patientPhone = document.getElementById('patientPhone').value.trim();
  const patientEmail = document.getElementById('patientEmail').value.trim();
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  const symptoms = document.getElementById('symptoms').value;
  if (!patientName || !patientAge || !patientPhone || !patientEmail || !appointmentDate || !appointmentTime) {
    alert('Please fill all required fields.');
    return;
  }
  // Mark slot as booked
  bookedSlots[`${docId}_${appointmentDate}_${appointmentTime}`] = true;
  localStorage.setItem('careconnect_bookedSlots', JSON.stringify(bookedSlots));
  // Save appointment
  let appointments = JSON.parse(localStorage.getItem('careconnect_appointments')) || [];
  const newAppointment = {
    id: Date.now(),
    doctorId: parseInt(docId),
    doctorName: docName,
    patientName,
    patientAge,
    patientPhone,
    patientEmail,
    date: appointmentDate,
    time: appointmentTime,
    symptoms,
    status: 'confirmed'
  };
  appointments.push(newAppointment);
  localStorage.setItem('careconnect_appointments', JSON.stringify(appointments));
  alert(`Appointment confirmed! ID: ${newAppointment.id}`);
  modal.style.display = 'none';
  document.getElementById('bookingForm').reset();
  renderMyAppointments();
});

// ========== MY APPOINTMENTS ==========
function renderMyAppointments() {
  const container = document.getElementById('appointmentsList');
  if (!container) return;
  const appointments = JSON.parse(localStorage.getItem('careconnect_appointments')) || [];
  if (appointments.length === 0) {
    container.innerHTML = '<p class="empty-message">No appointments yet. Book one now!</p>';
    return;
  }
  container.innerHTML = appointments.map(app => `
    <div class="appointment-card">
      <div class="details">
        <strong>${app.doctorName}</strong><br>
        ${app.date} at ${app.time}<br>
        Patient: ${app.patientName} (Age ${app.patientAge})<br>
        ID: ${app.id}
      </div>
      <div class="actions">
        <button class="cancel-btn" data-id="${app.id}"><i class="fas fa-trash-alt"></i> Cancel</button>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('Cancel this appointment?')) {
        let appointments = JSON.parse(localStorage.getItem('careconnect_appointments')) || [];
        appointments = appointments.filter(a => a.id !== id);
        localStorage.setItem('careconnect_appointments', JSON.stringify(appointments));
        renderMyAppointments();
        if (document.getElementById('adminData').style.display === 'block') renderAdminAppointments();
      }
    });
  });
}

// ========== ADMIN PANEL ==========
function renderAdminAppointments() {
  const container = document.getElementById('adminAppointmentsList');
  const appointments = JSON.parse(localStorage.getItem('careconnect_appointments')) || [];
  if (appointments.length === 0) {
    container.innerHTML = '<p class="empty-message">No appointments.</p>';
    return;
  }
  container.innerHTML = appointments.map(app => `
    <div class="appointment-card">
      <div class="details">
        <strong>${app.doctorName}</strong> — ${app.date} ${app.time}<br>
        Patient: ${app.patientName}, Age ${app.patientAge}<br>
        Phone: ${app.patientPhone}, Email: ${app.patientEmail}<br>
        Symptoms: ${app.symptoms || 'None'}<br>
        ID: ${app.id}
      </div>
    </div>
  `).join('');
}
document.getElementById('adminLoginBtn').addEventListener('click', () => {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === 'admin123') {
    document.getElementById('adminData').style.display = 'block';
    renderAdminAppointments();
  } else alert('Wrong password');
});
document.getElementById('clearAllData')?.addEventListener('click', () => {
  if (confirm('Delete ALL appointments?')) {
    localStorage.removeItem('careconnect_appointments');
    localStorage.removeItem('careconnect_bookedSlots');
    renderAdminAppointments();
    renderMyAppointments();
    alert('All data cleared.');
  }
});

// ========== SECTION NAVIGATION ==========
function showSection(sectionId) {
  document.querySelectorAll('.section-main').forEach(sec => sec.style.display = 'none');
  if (sectionId === 'doctors') document.getElementById('doctorsSection').style.display = 'block';
  else if (sectionId === 'patient-stories') document.getElementById('patientStoriesSection').style.display = 'block';
  else if (sectionId === 'blogs') document.getElementById('blogsSection').style.display = 'block';
  else if (sectionId === 'appointments') {
    document.getElementById('appointmentsSection').style.display = 'block';
    renderMyAppointments();
  } else if (sectionId === 'admin') document.getElementById('adminSection').style.display = 'block';
}
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    showSection(section);
    document.getElementById('mobileNav').style.display = 'none';
  });
});
// Initially show home (hero) but also doctors section is visible by default; adjust
document.getElementById('doctorsSection').style.display = 'block';
document.getElementById('patientStoriesSection').style.display = 'none';
document.getElementById('blogsSection').style.display = 'block';
document.getElementById('appointmentsSection').style.display = 'none';
document.getElementById('adminSection').style.display = 'none';

// ========== SPECIALTY LANDING PAGES ==========
document.querySelectorAll('.speciality-card').forEach(card => {
  card.addEventListener('click', () => {
    const specialty = card.dataset.specialty;
    const modal = document.getElementById('specialtyModal');
    const content = document.getElementById('specialtyContent');
    const titles = { cardio: "Cardiology", neuro: "Neurology", ortho: "Orthopedics", onco: "Oncology", gyno: "Gynecology", pedia: "Pediatrics" };
    content.innerHTML = `<h2>${titles[specialty]}</h2><p>Detailed information about ${titles[specialty]} treatments, expert doctors, advanced technology, and patient success stories.</p><button class="btn-primary" onclick="document.getElementById('specialtyModal').style.display='none'">Close</button>`;
    modal.style.display = 'flex';
  });
});

// ========== PATIENT STORIES (categorized dummy data) ==========
const stories = [
  { category: "cardio", title: "Heart Bypass Success", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", patient: "Rajesh K." },
  { category: "neuro", title: "Brain Tumor Recovery", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", patient: "Anita S." },
  { category: "ortho", title: "Knee Replacement Journey", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", patient: "Vikram M." }
];
function renderStories(category = "all") {
  const grid = document.getElementById('storiesGrid');
  if (!grid) return;
  const filtered = category === "all" ? stories : stories.filter(s => s.category === category);
  grid.innerHTML = filtered.map(s => `<div class="testimonial-card"><iframe width="100%" height="200" src="${s.video}" frameborder="0" allowfullscreen></iframe><p>${s.title} – ${s.patient}</p></div>`).join('');
}
document.querySelectorAll('.story-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.story-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderStories(btn.dataset.category);
  });
});
renderStories();

// ========== BLOGS (dummy) ==========
const blogs = [
  { img: "/demos/hospital-appointment/assets/blog1.png", title: "10 Tips for a Healthy Heart", desc: "Simple lifestyle changes for heart health." },
  { img: "/demos/hospital-appointment/assets/blog2.png", title: "Understanding COVID‑19 Variants", desc: "Stay informed about new variants." },
  { img: "/demos/hospital-appointment/assets/blog3.png", title: "Yoga for Mental Wellness", desc: "Reduce stress through yoga." }
];
function renderBlogs() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = blogs.map(b => `<div class="blog-card"><img src="${b.img}" onerror="this.src='https://placehold.co/300x200?text=Blog'"><h3>${b.title}</h3><p>${b.desc}</p><a href="#">Read more →</a></div>`).join('');
}
renderBlogs();

// ========== HOSPITAL LOCATOR ==========
const hospitals = [
  { name: "CareConnect Saket", address: "Delhi", phone: "011-40554055" },
  { name: "CareConnect Mumbai", address: "Andheri West", phone: "022-61347777" },
  { name: "CareConnect Bengaluru", address: "Whitefield", phone: "080-12345678" }
];
function renderHospitals() {
  const grid = document.getElementById('hospitalGrid');
  if (!grid) return;
  grid.innerHTML = hospitals.map(h => `<div class="hospital-card"><h3>${h.name}</h3><p>${h.address}</p><p><i class="fas fa-phone"></i> ${h.phone}</p></div>`).join('');
}
renderHospitals();

// ========== INTERNATIONAL PORTAL ==========
document.getElementById('visaBtn')?.addEventListener('click', () => {
  const country = document.getElementById('visaCountry').value;
  document.getElementById('visaResult').innerHTML = country ? `Visa invitation letter can be arranged for ${country}. Please contact our international helpdesk.` : 'Enter country.';
});
document.getElementById('estimateBtn')?.addEventListener('click', () => {
  const proc = document.getElementById('estimatorProcedure').value;
  const estimates = { "Heart Bypass": "₹4,50,000", "Knee Replacement": "₹2,80,000", "Cancer Therapy": "₹6,00,000" };
  document.getElementById('estimateResult').innerHTML = `Estimated cost: ${estimates[proc]} (includes hospital stay, surgeon fee, medication).`;
});
document.getElementById('transportBtn')?.addEventListener('click', () => {
  alert('Pickup request submitted. Our transport coordinator will contact you within 2 hours.');
});

// ========== HEALTH PACKAGES (cart simulation) ==========
let cart = JSON.parse(localStorage.getItem('careconnect_cart')) || [];
function renderPackages() {
  const packages = [
    { id: 1, name: "Heart Checkup", price: 2500 },
    { id: 2, name: "Full Body Checkup", price: 4999 },
    { id: 3, name: "Diabetes Profile", price: 1200 }
  ];
  const grid = document.getElementById('packagesGrid');
  if (!grid) return;
  grid.innerHTML = packages.map(p => `<div class="package-card"><h3>${p.name}</h3><p>₹${p.price}</p><button class="btn-outline add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add to Cart</button></div>`).join('');
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = { id: btn.dataset.id, name: btn.dataset.name, price: parseInt(btn.dataset.price) };
      cart.push(item);
      localStorage.setItem('careconnect_cart', JSON.stringify(cart));
      document.getElementById('cartCount').innerText = cart.length;
      alert('Added to cart');
    });
  });
}
renderPackages();
document.getElementById('viewCartBtn')?.addEventListener('click', () => {
  if (cart.length === 0) alert('Cart empty');
  else {
    let total = cart.reduce((s, i) => s + i.price, 0);
    alert(`Cart items: ${cart.map(i => i.name).join(', ')}\nTotal: ₹${total}\nProceed to payment?`);
    if (confirm('Proceed to payment?')) document.getElementById('paymentModal').style.display = 'flex';
  }
});
document.getElementById('paymentForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Payment successful (demo). Thank you!');
  cart = [];
  localStorage.setItem('careconnect_cart', JSON.stringify(cart));
  document.getElementById('cartCount').innerText = '0';
  document.getElementById('paymentModal').style.display = 'none';
});

// ========== HOMECARE TABS ==========
const homecareData = {
  nursing: "Professional nurses available for post‑operative care, elderly support, and chronic disease management.",
  pharmacy: "Order medicines online with free home delivery. 10% discount on first order.",
  lab: "Book lab tests at home. Reports delivered digitally within 24 hours."
};
function renderHomecare(tab) {
  const container = document.getElementById('homecareContent');
  if (!container) return;
  container.innerHTML = `<div class="glass-card" style="padding:1rem"><p>${homecareData[tab]}</p><button class="btn-primary">Enquire Now</button></div>`;
}
document.querySelectorAll('.homecare-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.homecare-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderHomecare(tab.dataset.tab);
  });
});
renderHomecare('nursing');

// ========== INSURANCE MATRIX ==========
const insurers = ["Star Health", "HDFC Ergo", "ICICI Lombard", "New India Assurance", "Bajaj Allianz"];
function renderInsurance() {
  const grid = document.getElementById('insuranceGrid');
  if (!grid) return;
  grid.innerHTML = insurers.map(i => `<div class="insurance-card"><img src="assets/insurance-${i.toLowerCase().replace(/ /g,'')}.png" onerror="this.src='https://placehold.co/40x40?text=🏥'" width="40"> <span>${i}</span></div>`).join('');
}
renderInsurance();
document.getElementById('checkClaimBtn')?.addEventListener('click', () => {
  const claimId = document.getElementById('claimNumber').value;
  if (!claimId) alert('Enter Claim ID');
  else document.getElementById('claimResult').innerHTML = `<p>Claim ${claimId} is under process. Expected settlement in 7 days.</p>`;
});

// ========== ACADEMICS & RESEARCH (dummy) ==========
document.getElementById('dnbList').innerHTML = `<li>DNB General Medicine</li><li>DNB Cardiology</li><li>DNB Neurology</li>`;
document.getElementById('trialsList').innerHTML = `<li>Phase III Trial for Diabetes Drug</li><li>Immunotherapy for Lung Cancer</li>`;
document.getElementById('publicationsList').innerHTML = `<li>Journal of Cardiac Sciences (2025)</li><li>Neurology India (2026)</li>`;

// ========== INVESTOR WIDGET ==========
let stockPrice = 1245.60;
setInterval(() => {
  const change = (Math.random() - 0.5) * 10;
  stockPrice = Math.max(1000, stockPrice + change);
  const span = document.getElementById('stockPrice');
  if (span) span.innerText = `₹${stockPrice.toFixed(2)}`;
}, 10000);
document.getElementById('annualReportLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Annual report downloaded (demo PDF).');
});

// ========== TECH HIGHLIGHTS ==========
const techs = [
  { name: "Robotic Surgery", desc: "Da Vinci Xi for precision", icon: "fas fa-robot" },
  { name: "CAR T-Cell Therapy", desc: "Advanced cancer treatment", icon: "fas fa-dna" },
  { name: "Proton Therapy", desc: "Targeted radiation", icon: "fas fa-radiation" },
  { name: "e-ICU Command Center", desc: "24/7 remote monitoring", icon: "fas fa-chart-line" }
];
function renderTech() {
  const grid = document.getElementById('techGrid');
  if (!grid) return;
  grid.innerHTML = techs.map(t => `<div class="tech-card"><i class="${t.icon} fa-2x" style="color:var(--accent)"></i><h3>${t.name}</h3><p>${t.desc}</p><button class="btn-outline learn-more">Learn More</button></div>`).join('');
}
renderTech();

// ========== OTP SIMULATION ==========
let pendingOtpCallback = null;
function requestOtp(phone, callback) {
  pendingOtpCallback = callback;
  document.getElementById('otpModal').style.display = 'flex';
}
document.getElementById('verifyOtpBtn')?.addEventListener('click', () => {
  const otp = document.getElementById('otpInput').value;
  if (otp === '123456') {
    alert('OTP verified successfully');
    document.getElementById('otpModal').style.display = 'none';
    if (pendingOtpCallback) pendingOtpCallback();
  } else alert('Invalid OTP');
});
// Example: use OTP for login (optional) – can be extended.

// ========== FILTER SIDEBAR TOGGLE & EVENT HANDLERS ==========
document.getElementById('filterToggleBtn')?.addEventListener('click', () => {
  document.getElementById('filterContent').classList.toggle('open');
});
document.getElementById('filterLocation')?.addEventListener('change', (e) => { currentFilters.location = e.target.value; renderDoctors(); });
document.getElementById('filterGender')?.addEventListener('change', (e) => { currentFilters.gender = e.target.value; renderDoctors(); });
document.getElementById('filterLanguage')?.addEventListener('change', (e) => { currentFilters.language = e.target.value; renderDoctors(); });
document.getElementById('filterAvailability')?.addEventListener('change', (e) => { currentFilters.availability = e.target.value; renderDoctors(); });
document.getElementById('resetFilters')?.addEventListener('click', () => {
  currentFilters = { location: "all", gender: "all", language: "all", availability: "all", specialty: "all" };
  document.getElementById('filterLocation').value = "all";
  document.getElementById('filterGender').value = "all";
  document.getElementById('filterLanguage').value = "all";
  document.getElementById('filterAvailability').value = "all";
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filter-btn[data-specialty="all"]').classList.add('active');
  renderDoctors();
});
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilters.specialty = btn.dataset.specialty;
    renderDoctors();
  });
});

// ========== FLOATING TRAY TELE-CONSULT ==========
document.getElementById('teleconsultBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Teleconsultation feature will be available soon. Please book an appointment for now.');
});

// ========== MOBILE MENU TOGGLE ==========
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ========== CAMPAIGN BANNER DISMISS ==========
const banner = document.getElementById('campaignBanner');
const closeBanner = document.getElementById('closeBanner');
if (closeBanner) {
  closeBanner.addEventListener('click', () => {
    banner.style.display = 'none';
    localStorage.setItem('careconnect_banner_closed', 'true');
  });
}
if (localStorage.getItem('careconnect_banner_closed') === 'true') {
  if (banner) banner.style.display = 'none';
}

// ========== INITIAL RENDER ==========
renderDoctors();
renderStories();
renderBlogs();
renderHospitals();
renderPackages();
renderHomecare('nursing');
renderInsurance();
renderTech();