document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('toolsGrid');
  if (!container) return;
  try {
    const res = await fetch('data/tools.json');
    const tools = await res.json();
    if (tools.length === 0) {
      container.innerHTML = '<p class="empty-message">No tools available yet.</p>';
      return;
    }
    container.innerHTML = tools.map(tool => `
      <div class="flip-card">
        <div class="flip-inner">
          <div class="flip-front">
            <i class="icon">${tool.icon}</i>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
          </div>
          <div class="flip-back">
            <a href="${tool.url}" class="btn-primary">Launch Tool →</a>
          </div>
        </div>
      </div>
    `).join('');
    document.getElementById('toolCount').innerText = tools.length;
  } catch (err) {
    console.error('Failed to load tools:', err);
    container.innerHTML = '<p class="empty-message">Could not load tools.</p>';
  }
});