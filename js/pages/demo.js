document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('demoPostsContainer');
  if (!container) return;
  try {
    const res = await fetch('data/demos.json');
    const demos = await res.json();
    if (demos.length === 0) {
      container.innerHTML = '<p class="empty-message">No demos available yet.</p>';
      return;
    }
    container.innerHTML = demos.map(demo => `
      <div class="flip-card">
        <div class="flip-inner">
          <div class="flip-front">
            <i class="icon">${demo.icon}</i>
            <h3>${demo.name}</h3>
            <p>${demo.description}</p>
          </div>
          <div class="flip-back">
            <a href="${demo.url}" class="btn-primary">Launch Demo →</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load demos:', err);
    container.innerHTML = '<p class="empty-message">Could not load demos.</p>';
  }
});