document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('blogPostsContainer');
  if (!container) return;
  try {
    const res = await fetch('data/blogs.json');
    const blogs = await res.json();
    if (blogs.length === 0) {
      container.innerHTML = '<p class="empty-message">No blog posts yet.</p>';
      return;
    }
    container.innerHTML = blogs.map(post => `
      <div class="flip-card">
        <div class="flip-inner">
          <div class="flip-front">
            <img src="${post.image}" alt="${post.title}" style="width:60px;height:60px;object-fit:cover;border-radius:12px;margin-bottom:0.5rem;" loading="lazy" onerror="this.src='https://placehold.co/60x60?text=Blog'">
            <h3>${post.title}</h3>
            <p>${post.excerpt.substring(0,80)}${post.excerpt.length > 80 ? '...' : ''}</p>
            <span style="font-size:0.7rem;color:var(--accent);">${post.date} · ${post.category}</span>
          </div>
          <div class="flip-back">
            <p>Click to read full article.</p>
            <button class="btn-primary read-more-btn" data-id="${post.id}">Read More →</button>
          </div>
        </div>
      </div>
    `).join('');

    // Modal logic
    const modal = document.getElementById('blogModal');
    const modalContentDiv = document.getElementById('blogModalContent');
    const closeModalBtn = document.getElementById('modalCloseBtn');

    function openModal(htmlContent) {
      modalContentDiv.innerHTML = htmlContent;
      modal.style.display = 'flex';
    }
    function closeModal() {
      modal.style.display = 'none';
    }
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const post = blogs.find(p => p.id === id);
        if (post) {
          const html = `<h2>${post.title}</h2><p style="color:var(--accent);">${post.date} · ${post.category}</p>${post.fullContent}<div style="margin-top:1rem;"><button class="btn-primary" id="closeModalInnerBtn">Close</button></div>`;
          openModal(html);
          const innerClose = document.getElementById('closeModalInnerBtn');
          if (innerClose) innerClose.addEventListener('click', closeModal);
        }
      });
    });
  } catch (err) {
    console.error('Failed to load blogs:', err);
    container.innerHTML = '<p class="empty-message">Could not load blog posts.</p>';
  }
});