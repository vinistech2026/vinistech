// ========== DARK/LIGHT MODE ==========
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('vinistech_theme') === 'dark') {
  document.documentElement.classList.add('dark-theme');
  themeToggle.innerHTML = '☀️';
}
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-theme');
  const isDark = document.documentElement.classList.contains('dark-theme');
  localStorage.setItem('vinistech_theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '☀️' : '🌙';
});

// ========== SCROLL ANIMATIONS ==========
const fadeElements = document.querySelectorAll('.scroll-fade');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

// ========== MOBILE MENU ==========
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.style.display = 'none');
  });
}

// ========== FLOATING CHATBOT ==========
function initChatbot() {
  const container = document.getElementById('chatbotContainer');
  if (!container) return;
  container.innerHTML = `
    <button class="chatbot-button" id="chatbotToggleBtn">💬</button>
    <div class="chatbot-window" id="chatbotWindow" style="display: none;">
      <div class="chatbot-header">
        <span>VinisTech AI</span>
        <button id="chatbotClose" style="background:none;border:none;color:white;cursor:pointer;">✕</button>
      </div>
      <div class="chatbot-messages" id="chatbotMessages">
        <div class="chatbot-message bot-message">👋 Hello! I'm VinisTech AI. How can I help you today?<br>Ask me about services, demos, or leave your details for a quote.</div>
      </div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type a message...">
        <button class="chatbot-send" id="chatbotSend">Send</button>
      </div>
    </div>
  `;
  const toggleBtn = document.getElementById('chatbotToggleBtn');
  const windowDiv = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const sendBtn = document.getElementById('chatbotSend');
  const input = document.getElementById('chatbotInput');
  const messagesDiv = document.getElementById('chatbotMessages');

  function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
    msgDiv.innerText = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function botReply(userMsg) {
    const msg = userMsg.toLowerCase();
    let reply = '';
    if (msg.includes('service') || msg.includes('web development') || msg.includes('ai')) {
      reply = 'We offer Web Development, AI Solutions, Cloud Consulting, SEO, and more. Check our Services page!';
    } else if (msg.includes('demo')) {
      reply = 'You can explore our demos like Nursery E‑commerce, Admission Chatbot, Hospital Scheduler, etc. Visit the Demos page!';
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('quote')) {
      reply = 'Please share your name and email, and our team will send you a custom quote.';
      setTimeout(() => askLeadInfo(), 1000);
    } else if (msg.includes('contact') || msg.includes('phone')) {
      reply = 'You can reach us at info@vinistech.in or call +91 9711806644. Would you like to leave your number for a callback?';
    } else {
      reply = "I'm still learning. Please email info@vinistech.in or call us directly.";
    }
    addMessage(reply, false);
  }

  let awaitingLead = false;
  function askLeadInfo() {
    addMessage('May I have your name?', false);
    awaitingLead = 'name';
  }

  function processLeadCapture(userMsg) {
    if (awaitingLead === 'name') {
      localStorage.setItem('vinistech_chat_name', userMsg);
      addMessage('Thanks! And your email?', false);
      awaitingLead = 'email';
    } else if (awaitingLead === 'email') {
      localStorage.setItem('vinistech_chat_email', userMsg);
      let leads = JSON.parse(localStorage.getItem('vinistech_chat_leads')) || [];
      leads.push({ name: localStorage.getItem('vinistech_chat_name'), email: userMsg, timestamp: new Date().toISOString() });
      localStorage.setItem('vinistech_chat_leads', JSON.stringify(leads));
      addMessage('Thank you! Our team will contact you within 24 hours.', false);
      awaitingLead = false;
    }
  }

  function handleUserMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    if (awaitingLead) {
      processLeadCapture(text);
    } else {
      botReply(text);
    }
  }

  sendBtn.addEventListener('click', handleUserMessage);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserMessage(); });
  toggleBtn.addEventListener('click', () => { windowDiv.style.display = windowDiv.style.display === 'flex' ? 'none' : 'flex'; });
  closeBtn.addEventListener('click', () => { windowDiv.style.display = 'none'; });
}
document.addEventListener('DOMContentLoaded', initChatbot);

// ========== TOP BANNER DISMISS ==========
const banner = document.getElementById('topBanner');
const closeBanner = document.getElementById('closeBanner');
if (closeBanner) {
  closeBanner.addEventListener('click', () => {
    banner.style.display = 'none';
    localStorage.setItem('vinistech_banner_closed', 'true');
  });
}
if (localStorage.getItem('vinistech_banner_closed') === 'true') {
  if (banner) banner.style.display = 'none';
}