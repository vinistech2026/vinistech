// ========== KNOWLEDGE BASE ==========
const responses = {
  en: {
    greeting: "👋 Hello! I'm AdmitAI. Before we start, are you a <button class='inline-btn' data-segment='student'>🎓 Student</button> or <button class='inline-btn' data-segment='parent'>👪 Parent</button>?",
    student: "Great! I'll help you find the right course. What are you interested in studying?",
    parent: "I understand. I'll help you understand admission options and financial aid for your child.",
    default: "I'm still learning. Please contact our admission office for accurate info.",
    courses: "We offer B.Tech (CSE, ECE, ME), MBA, M.Des, and PhD programs.",
    fee_bt: "B.Tech CSE fee is ₹8.5 Lakhs (full program). Scholarships available.",
    fee_mba: "MBA fee is ₹12 Lakhs for 2 years. EMI options available.",
    scholarship: "Yes! Merit scholarships up to 50% for 90%+ in 12th, and need-based aid.",
    eligibility_bt: "Minimum 60% in 12th (PCM) + valid JEE Main score. Direct: 75%+.",
    eligibility_mba: "Graduation 50% + valid CAT/MAT. Work experience preferred.",
    eligibility_design: "Bachelor's 55% + portfolio. Creative aptitude test required.",
    deadline: "Application deadline: May 31st. Early bird discount until April 15th.",
    financial_aid: "We offer need-based scholarships and education loans. Want me to check eligibility?",
    documents: "📄 Documents required: 10th & 12th marksheets, Transfer Certificate, Migration Certificate, Passport photos, Entrance exam scorecard, Aadhar card copy.",
    thankyou: "You're welcome! Anything else?",
    connect_human: "Sure! Please share your phone number and preferred time for a callback. (Demo simulation – our counsellor will contact you within 24 hours.)",
    ask_phone: "Please share your 10-digit phone number:",
    ask_callback_time: "What time would be convenient for a call? (e.g., '10 AM to 12 PM')",
    callback_confirmed: "Thank you! We've noted your callback request. You will receive a call shortly. (Demo mode)",
    whatsapp: "You can chat with us on WhatsApp: <a href='https://wa.me/919876543210' target='_blank'>Click here to start WhatsApp chat</a>",
    eligibility_flow_start: "Let's check your eligibility. First, what is your 12th percentage (or graduation percentage for MBA)?",
    eligibility_flow_course: "Which course are you interested in? (B.Tech, MBA, M.Des)",
    eligibility_flow_result: "Based on your percentage and course choice, you are eligible. (Demo result)"
  },
  hi: {
    greeting: "👋 नमस्ते! मैं AdmitAI हूँ। कृपया बताएं: <button class='inline-btn' data-segment='student'>🎓 छात्र</button> या <button class='inline-btn' data-segment='parent'>👪 अभिभावक</button>?",
    student: "बहुत अच्छा! मैं आपके लिए सही कोर्स ढूंढूंगा।",
    parent: "मैं आपके बच्चे के लिए प्रवेश विकल्प समझाऊंगा।",
    default: "मैं सीख रहा हूँ। कृपया प्रवेश कार्यालय से संपर्क करें।",
    courses: "हम B.Tech, MBA, M.Des, और PhD प्रदान करते हैं।",
    fee_bt: "B.Tech CSE शुल्क ₹8.5 लाख है।",
    fee_mba: "MBA शुल्क ₹12 लाख (2 वर्ष) है।",
    scholarship: "हाँ! 90%+ पर 50% तक मेरिट छात्रवृत्ति।",
    eligibility_bt: "12वीं (PCM) में 60% + JEE Main स्कोर।",
    eligibility_mba: "स्नातक में 50% + CAT/MAT स्कोर।",
    eligibility_design: "स्नातक 55% + पोर्टफोलियो।",
    deadline: "आवेदन अंतिम तिथि: 31 मई।",
    financial_aid: "हम छात्रवृत्ति और शिक्षा ऋण प्रदान करते हैं।",
    documents: "📄 दस्तावेज़: 10वीं, 12वीं अंकपत्र, स्थानांतरण प्रमाण पत्र, फोटो, प्रवेश परीक्षा स्कोर, आधार कार्ड।",
    thankyou: "आपका स्वागत है!",
    connect_human: "कृपया अपना फोन नंबर और समय बताएं – हमारा परामर्शदाता आपसे संपर्क करेगा।",
    ask_phone: "अपना 10-अंकीय मोबाइल नंबर बताएं:",
    ask_callback_time: "कॉल के लिए सुविधाजनक समय बताएं (जैसे 'सुबह 10-12 बजे'):",
    callback_confirmed: "धन्यवाद! आपका अनुरोध सहेज लिया गया है। (डेमो मोड)",
    whatsapp: "आप हमसे WhatsApp पर बात कर सकते हैं: <a href='https://wa.me/919876543210' target='_blank'>यहाँ क्लिक करें</a>",
    eligibility_flow_start: "आइए पात्रता जाँचें। पहले, आपका 12वीं का प्रतिशत बताएं?",
    eligibility_flow_course: "आप किस कोर्स में रुचि रखते हैं? (B.Tech, MBA, M.Des)",
    eligibility_flow_result: "आपके प्रतिशत और कोर्स के आधार पर, आप पात्र हैं।"
  }
};

let currentLang = 'en';
let conversationMemory = [];
let userSegment = null;
let slowMode = false;
let eligibilityStep = 0;
let eligibilityData = {};
let awaitingPhone = false;
let awaitingCallbackTime = false;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetChatBtn');
const suggestionsGrid = document.getElementById('suggestionsGrid');
const typingIndicator = document.getElementById('typingIndicator');
const slowModeToggle = document.getElementById('slowModeToggle');

// Helper functions
function addMessage(text, sender, options = {}) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  if (sender === 'bot') {
    messageDiv.innerHTML = `<div class="avatar"><img src="/demos/admission-chatbot/assets/bot-avatar.png" alt="Bot" onerror="this.src='https://placehold.co/30x30?text=AI'"></div><div class="bubble">${text}<div class="ai-badge"><i class="fas fa-robot"></i> AI‑generated response · Verified</div></div>`;
  } else {
    messageDiv.innerHTML = `<div class="bubble">${text}</div>`;
  }
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  conversationMemory.push({ role: sender, content: text });
}
function showTyping() { typingIndicator.style.display = 'block'; }
function hideTyping() { typingIndicator.style.display = 'none'; }
function getDelay() { return slowMode ? 1500 : 500; }

function botReplyWithDelay(text) {
  showTyping();
  setTimeout(() => {
    hideTyping();
    const intent = detectIntent(text);
    if (intent) {
      const reply = getResponse(intent, currentLang);
      addMessage(reply, 'bot');
    } else {
      addMessage(getResponse('default', currentLang), 'bot');
    }
    updateSuggestions();
  }, getDelay());
}

function getResponse(intent, lang) {
  const db = responses[lang];
  switch(intent) {
    case 'courses': return db.courses;
    case 'fee_bt': return db.fee_bt;
    case 'fee_mba': return db.fee_mba;
    case 'scholarship': return db.scholarship;
    case 'eligibility_bt': return db.eligibility_bt;
    case 'eligibility_mba': return db.eligibility_mba;
    case 'eligibility_design': return db.eligibility_design;
    case 'deadline': return db.deadline;
    case 'financial_aid': return db.financial_aid;
    case 'documents': return db.documents;
    case 'thanks': return db.thankyou;
    case 'connect_human': return db.connect_human;
    case 'whatsapp': return db.whatsapp;
    default: return db.default;
  }
}

function detectIntent(message) {
  const msg = message.toLowerCase();
  if (msg.includes('course') || msg.includes('program')) return 'courses';
  if (msg.includes('b.tech fee') || msg.includes('btech fee')) return 'fee_bt';
  if (msg.includes('mba fee')) return 'fee_mba';
  if (msg.includes('scholarship')) return 'scholarship';
  if (msg.includes('deadline')) return 'deadline';
  if (msg.includes('document')) return 'documents';
  if (msg.includes('eligibility')) {
    if (msg.includes('btech')) return 'eligibility_bt';
    if (msg.includes('mba')) return 'eligibility_mba';
    if (msg.includes('design')) return 'eligibility_design';
    return 'eligibility_bt';
  }
  if (msg.includes('financial') || msg.includes('loan')) return 'financial_aid';
  if (msg.includes('thank')) return 'thanks';
  if (msg.includes('human') || msg.includes('counselor') || msg.includes('person')) return 'connect_human';
  if (msg.includes('whatsapp')) return 'whatsapp';
  return null;
}

function updateSuggestions() {
  const suggestions = [
    { text: "What courses are offered?", intent: "courses" },
    { text: "Tell me about B.Tech fees", intent: "fee_bt" },
    { text: "Scholarship options?", intent: "scholarship" },
    { text: "Application deadlines", intent: "deadline" },
    { text: "What documents are needed?", intent: "documents" },
    { text: "Talk to a counsellor", intent: "connect_human" },
    { text: "Start eligibility check", intent: "eligibility_flow" }
  ];
  suggestionsGrid.innerHTML = suggestions.map(s => `<button class="suggestion-chip" data-intent="${s.intent}">${s.text}</button>`).join('');
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.innerText;
      addMessage(text, 'user');
      if (chip.dataset.intent === 'eligibility_flow') startEligibilityFlow();
      else botReplyWithDelay(text);
    });
  });
}

function startEligibilityFlow() {
  eligibilityStep = 1;
  addMessage(responses[currentLang].eligibility_flow_start, 'bot');
}
function handleEligibilityResponse(msg) {
  if (eligibilityStep === 1) {
    eligibilityData.percentage = msg;
    addMessage(responses[currentLang].eligibility_flow_course, 'bot');
    eligibilityStep = 2;
  } else if (eligibilityStep === 2) {
    eligibilityData.course = msg;
    addMessage(responses[currentLang].eligibility_flow_result, 'bot');
    eligibilityStep = 0;
  }
}

// Lead storage (localStorage)
function saveLead(lead) {
  let leads = JSON.parse(localStorage.getItem('admitai_leads')) || [];
  leads.push({ ...lead, timestamp: new Date().toISOString() });
  localStorage.setItem('admitai_leads', leads);
}
function saveCallbackRequest(request) {
  let callbacks = JSON.parse(localStorage.getItem('admitai_callbacks')) || [];
  callbacks.push({ ...request, timestamp: new Date().toISOString() });
  localStorage.setItem('admitai_callbacks', callbacks);
}

// Human handoff simulation
function requestHumanHandoff() {
  addMessage(responses[currentLang].connect_human, 'bot');
  awaitingPhone = true;
}
function handleUserMessageForHandoff(msg) {
  if (awaitingPhone) {
    saveCallbackRequest({ phone: msg, time: 'pending', status: 'requested' });
    addMessage(responses[currentLang].ask_callback_time, 'bot');
    awaitingPhone = false;
    awaitingCallbackTime = true;
  } else if (awaitingCallbackTime) {
    saveCallbackRequest({ phone: 'last', time: msg, status: 'scheduled' });
    addMessage(responses[currentLang].callback_confirmed, 'bot');
    awaitingCallbackTime = false;
  }
}

// Send message logic
function sendUserMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  if (eligibilityStep > 0) {
    handleEligibilityResponse(text);
    return;
  }
  if (awaitingPhone || awaitingCallbackTime) {
    handleUserMessageForHandoff(text);
    return;
  }
  botReplyWithDelay(text);
}

sendBtn.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendUserMessage(); });

resetBtn.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  conversationMemory = [];
  userSegment = null;
  eligibilityStep = 0;
  awaitingPhone = false;
  awaitingCallbackTime = false;
  addMessage(responses[currentLang].greeting, 'bot');
  updateSuggestions();
});

// Language switcher
document.getElementById('langEn').addEventListener('click', () => {
  currentLang = 'en';
  document.getElementById('langEn').classList.add('active');
  document.getElementById('langHi').classList.remove('active');
  resetBtn.click();
});
document.getElementById('langHi').addEventListener('click', () => {
  currentLang = 'hi';
  document.getElementById('langHi').classList.add('active');
  document.getElementById('langEn').classList.remove('active');
  resetBtn.click();
});

// Slow mode toggle
slowModeToggle.addEventListener('click', () => {
  slowMode = !slowMode;
  if (slowMode) slowModeToggle.classList.add('slow-mode-active');
  else slowModeToggle.classList.remove('slow-mode-active');
  addMessage(slowMode ? "🐢 Slow internet mode enabled (responses delayed for demo)." : "⚡ Fast mode restored.", 'bot');
});

// Quick ask buttons
document.querySelectorAll('.quick-ask').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const question = btn.dataset.question;
    addMessage(question, 'user');
    botReplyWithDelay(question);
  });
});

// Eligibility checker card
const checkBtn = document.getElementById('checkEligibilityBtn');
const eligibilityResult = document.getElementById('eligibilityResult');
checkBtn.addEventListener('click', () => {
  const course = document.getElementById('eligibilityCourse').value;
  const score = parseFloat(document.getElementById('eligibilityScore').value);
  if (isNaN(score)) { eligibilityResult.innerHTML = '<span style="color:#ef4444;">⚠️ Enter percentage/CGPA</span>'; return; }
  let result = '';
  if (course === 'cs') result = score >= 60 ? '✅ Eligible (JEE required)' : '❌ Not eligible';
  else if (course === 'mba') result = score >= 50 ? '✅ Eligible (CAT/MAT required)' : '❌ Not eligible';
  else result = score >= 55 ? '✅ Eligible (Portfolio required)' : '❌ Not eligible';
  eligibilityResult.innerHTML = result;
});

// Schedule counselling (lead capture)
const scheduleBtn = document.getElementById('scheduleBtn');
scheduleBtn.addEventListener('click', () => {
  const name = document.getElementById('apptName').value;
  const email = document.getElementById('apptEmail').value;
  const phone = document.getElementById('apptPhone').value;
  const city = document.getElementById('apptCity').value;
  const course = document.getElementById('apptCourse').value;
  const query = document.getElementById('apptQuery').value;
  if (!name || !email || !phone) { alert('Please fill name, email, and phone.'); return; }
  const lead = { name, email, phone, city, course, query, type: 'counselling_request' };
  saveLead(lead);
  alert(`Thank you ${name}! Our counsellor will call you within 24 hours. (Demo: lead saved locally)`);
  document.getElementById('apptName').value = '';
  document.getElementById('apptEmail').value = '';
  document.getElementById('apptPhone').value = '';
  document.getElementById('apptCity').value = '';
  document.getElementById('apptCourse').value = '';
  document.getElementById('apptQuery').value = '';
});

// Lead form (subscribe)
const leadForm = document.getElementById('leadForm');
leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('leadEmail').value;
  saveLead({ email, type: 'newsletter' });
  alert(`Subscribed! Updates sent to ${email} (Demo mode)`);
  leadForm.reset();
});

// WhatsApp handoff
document.getElementById('whatsappHandoffBtn').addEventListener('click', () => {
  window.open('https://wa.me/919876543210?text=Hello%20AdmitAI%2C%20I%20need%20help%20with%20admissions', '_blank');
  addMessage(responses[currentLang].whatsapp, 'bot');
});

// Human handoff button
document.getElementById('humanHandoffBtn').addEventListener('click', () => {
  requestHumanHandoff();
});

// Admin modal
const adminModal = document.getElementById('adminModal');
const adminLink = document.getElementById('adminLink');
const closeAdminModal = document.getElementById('closeAdminModal');
const clearAdminData = document.getElementById('clearAdminData');
const adminTabs = document.querySelectorAll('.admin-tab');

adminLink.addEventListener('click', (e) => {
  e.preventDefault();
  const pwd = prompt("Enter admin password (demo: admin123)");
  if (pwd === 'admin123') {
    renderAdminTables();
    adminModal.style.display = 'flex';
  } else alert('Wrong password');
});
closeAdminModal.addEventListener('click', () => adminModal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.style.display = 'none'; });
function renderAdminTables() {
  const leads = JSON.parse(localStorage.getItem('admitai_leads')) || [];
  const callbacks = JSON.parse(localStorage.getItem('admitai_callbacks')) || [];
  const leadsHtml = `<table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Course</th><th>Query</th><th>Time</th></tr></thead><tbody>${leads.map(l => `<tr><td>${l.name || '-'}</td><td>${l.email}</td><td>${l.phone || '-'}</td><td>${l.city || '-'}</td><td>${l.course || '-'}</td><td>${l.query || '-'}</td><td>${new Date(l.timestamp).toLocaleString()}</td></tr>`).join('')}</tbody></table>`;
  const callbacksHtml = `<table class="admin-table"><thead><tr><th>Phone</th><th>Preferred Time</th><th>Status</th><th>Time</th></tr></thead><tbody>${callbacks.map(c => `<tr><td>${c.phone}</td><td>${c.time}</td><td>${c.status}</td><td>${new Date(c.timestamp).toLocaleString()}</td></tr>`).join('')}</tbody></table>`;
  document.getElementById('adminLeads').innerHTML = leadsHtml || '<p>No leads yet.</p>';
  document.getElementById('adminCallbacks').innerHTML = callbacksHtml || '<p>No callbacks.</p>';
}
clearAdminData.addEventListener('click', () => {
  if (confirm('Delete all demo leads and callbacks?')) {
    localStorage.removeItem('admitai_leads');
    localStorage.removeItem('admitai_callbacks');
    renderAdminTables();
    alert('Data cleared.');
  }
});
adminTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    adminTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tabId = tab.dataset.tab;
    document.getElementById('adminLeads').style.display = tabId === 'leads' ? 'block' : 'none';
    document.getElementById('adminCallbacks').style.display = tabId === 'callbacks' ? 'block' : 'none';
  });
});

// New chat button
document.getElementById('newChatBtn').addEventListener('click', () => resetBtn.click());

// Floating chat button toggle (mobile)
const floatingBtn = document.getElementById('floatingChatBtn');
const chatDashboard = document.getElementById('chatDashboard');
if (floatingBtn) {
  floatingBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
      if (chatDashboard.style.display === 'none' || getComputedStyle(chatDashboard).display === 'none') {
        chatDashboard.style.display = 'grid';
        chatDashboard.scrollIntoView({ behavior: 'smooth' });
      } else {
        chatDashboard.style.display = 'none';
      }
    }
  });
  // Ensure dashboard is visible on desktop
  if (window.innerWidth > 1024) chatDashboard.style.display = 'grid';
}

// Initial load
addMessage(responses[currentLang].greeting, 'bot');
updateSuggestions();