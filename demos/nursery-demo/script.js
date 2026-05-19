// ========== PRODUCT DATABASE (Trending and Best Sellers now different) ==========
const products = [
  // Trending Now (6 unique plants)
  { id: 1, name: "Monstera Deliciosa", price: 1299, category: "indoor", tags: ["indoor","vastu","airpurifying"], image: "/demos/nursery-demo/assets/plant1.png", rating: 4.8, isTrending: true, isBestSeller: false },
  { id: 2, name: "Snake Plant", price: 799, category: "indoor", tags: ["indoor","vastu","airpurifying"], image: "/demos/nursery-demo/assets/plant2.png", rating: 4.7, isTrending: true, isBestSeller: false },
  { id: 3, name: "Fiddle Leaf Fig", price: 2499, category: "indoor", tags: ["indoor","airpurifying"], image: "/demos/nursery-demo/assets/plant3.png", rating: 4.6, isTrending: true, isBestSeller: false },
  { id: 16, name: "Areca Palm", price: 1899, category: "indoor", tags: ["indoor","airpurifying"], image: "/demos/nursery-demo/assets/areca-palm.png", rating: 4.7, isTrending: true, isBestSeller: false },
  { id: 5, name: "Bamboo Palm", price: 1499, category: "indoor", tags: ["indoor","airpurifying","vastu"], image: "/demos/nursery-demo/assets/plant5.png", rating: 4.7, isTrending: true, isBestSeller: false },
  { id: 6, name: "Succulent Set", price: 899, category: "succulents", tags: ["succulents","indoor"], image: "/demos/nursery-demo/assets/plant6.png", rating: 4.9, isTrending: true, isBestSeller: false },
  // Best Sellers (different plants)
  { id: 17, name: "Money Plant", price: 499, category: "indoor", tags: ["indoor","vastu"], image: "/demos/nursery-demo/assets/money-plant.png", rating: 4.9, isTrending: false, isBestSeller: true },
  { id: 18, name: "Spider Plant", price: 599, category: "indoor", tags: ["indoor","airpurifying"], image: "/demos/nursery-demo/assets/spider-plant.png", rating: 4.8, isTrending: false, isBestSeller: true },
  { id: 19, name: "Peace Lily", price: 699, category: "indoor", tags: ["indoor","airpurifying"], image: "/demos/nursery-demo/assets/peace-lily.png", rating: 4.9, isTrending: false, isBestSeller: true },
  { id: 9, name: "Gardening Tool Set", price: 999, category: "tools", tags: ["essentials"], image: "/demos/nursery-demo/assets/tools.png", rating: 4.7, isTrending: false, isBestSeller: true },
  { id: 11, name: "Ceramic Planter Set", price: 1299, category: "pots", tags: ["essentials"], image: "/demos/nursery-demo/assets/ceramic-pot.png", rating: 4.8, isTrending: false, isBestSeller: true },
  { id: 12, name: "Diwali Green Hamper", price: 1999, category: "gifts", tags: ["gifts"], image: "/demos/nursery-demo/assets/diwali-hamper.png", rating: 4.9, isTrending: false, isBestSeller: true },
  // Garden Essentials (including seeds)
  { id: 7, name: "Organic Potting Mix", price: 399, category: "essentials", tags: ["essentials"], image: "/demos/nursery-demo/assets/potting-mix.png", rating: 4.6, isTrending: false, isBestSeller: false },
  { id: 8, name: "Fertilizer Sticks", price: 299, category: "essentials", tags: ["essentials"], image: "/demos/nursery-demo/assets/fertilizer.png", rating: 4.5, isTrending: false, isBestSeller: false },
  { id: 10, name: "Self-Watering Pot", price: 599, category: "pots", tags: ["essentials"], image: "/demos/nursery-demo/assets/self-watering-pot.png", rating: 4.6, isTrending: false, isBestSeller: false },
  { id: 15, name: "Organic Vegetable Seeds (Pack of 5)", price: 249, category: "seeds", tags: ["essentials","seeds"], image: "/demos/nursery-demo/assets/seeds.png", rating: 4.7, isTrending: false, isBestSeller: false },
  // Gift Hampers
  { id: 13, name: "Monstera Gift Set", price: 2499, category: "gifts", tags: ["gifts"], image: "/demos/nursery-demo/assets/monstera-gift.png", rating: 4.8, isTrending: false, isBestSeller: false },
  { id: 14, name: "Terrarium DIY Kit", price: 899, category: "gifts", tags: ["gifts"], image: "/demos/nursery-demo/assets/terrarium.png", rating: 4.7, isTrending: false, isBestSeller: false }
];

// ========== CART & WISHLIST (same as before, no changes needed) ==========
let cart = JSON.parse(localStorage.getItem('nursery_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('nursery_wishlist')) || [];

function saveCart() { localStorage.setItem('nursery_cart', JSON.stringify(cart)); updateCartCounters(); }
function saveWishlist() { localStorage.setItem('nursery_wishlist', JSON.stringify(wishlist)); updateWishlistCount(); }

function updateCartCounters() {
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.innerText = totalItems);
  if (document.getElementById('cartItemCount')) document.getElementById('cartItemCount').innerText = `(${totalItems} items)`;
}
function updateWishlistCount() { document.querySelectorAll('#wishlistCount').forEach(el => el.innerText = wishlist.length); }

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ id: productId, quantity: 1 });
  saveCart();
  renderCartSidebar();
  showToast('Item added to cart! 🛒');
}
function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) cart[index].quantity--;
    else cart.splice(index, 1);
  }
  saveCart();
  renderCartSidebar();
}
function deleteCartItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCartSidebar();
}
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index === -1) wishlist.push(productId);
  else wishlist.splice(index, 1);
  saveWishlist();
  updateWishlistButtons();
  showToast(index === -1 ? 'Added to wishlist ❤️' : 'Removed from wishlist 💔');
}
function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (wishlist.includes(id)) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

// ========== RENDER PRODUCT CARDS with TAGS ==========
function renderProductCard(p) {
  const tagHtml = p.tags.map(tag => `<span class="product-tag">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('');
  return `
    <div class="product-card" data-category="${p.category}">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/300x300?text=${encodeURIComponent(p.name)}'">
      <h3>${p.name}</h3>
      <div class="product-tags">${tagHtml}</div>
      <div>${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '½' : ''}</div>
      <div class="product-price">₹${p.price.toLocaleString()}</div>
      <div class="product-actions">
        <button class="add-to-cart ripple-btn" data-id="${p.id}">Add to Cart</button>
        <button class="wishlist-btn" data-id="${p.id}" aria-label="Wishlist">❤️</button>
      </div>
    </div>
  `;
}

function renderProducts() {
  const trendingGrid = document.getElementById('trendingGrid');
  const bestsellerGrid = document.getElementById('bestsellerGrid');
  const essentialsGrid = document.getElementById('essentialsGrid');
  const giftsGrid = document.getElementById('giftsGrid');
  if (trendingGrid) trendingGrid.innerHTML = products.filter(p => p.isTrending).map(renderProductCard).join('');
  if (bestsellerGrid) bestsellerGrid.innerHTML = products.filter(p => p.isBestSeller).map(renderProductCard).join('');
  if (essentialsGrid) essentialsGrid.innerHTML = products.filter(p => p.category === 'essentials' || p.category === 'tools' || p.category === 'pots' || p.category === 'seeds').map(renderProductCard).join('');
  if (giftsGrid) giftsGrid.innerHTML = products.filter(p => p.category === 'gifts').map(renderProductCard).join('');
  attachProductEvents();
  updateWishlistButtons();
}
function attachProductEvents() {
  document.querySelectorAll('.add-to-cart').forEach(btn => { btn.onclick = () => addToCart(parseInt(btn.dataset.id)); });
  document.querySelectorAll('.wishlist-btn').forEach(btn => { btn.onclick = () => toggleWishlist(parseInt(btn.dataset.id)); });
}

// ========== FILTER FUNCTIONALITY ==========
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productSections = document.querySelectorAll('.product-grid');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        if (filter === 'all') card.style.display = '';
        else {
          const tags = Array.from(card.querySelectorAll('.product-tag')).map(t => t.innerText.toLowerCase());
          card.style.display = tags.includes(filter) ? '' : 'none';
        }
      });
    });
  });
}

// ========== CART SIDEBAR (unchanged, but ensure it works) ==========
function renderCartSidebar() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">Your cart is empty 🌱</div>';
    document.getElementById('cartSubtotal').innerText = '₹0';
    document.getElementById('cartShipping').innerText = '₹0';
    document.getElementById('cartGrandTotal').innerText = '₹0';
    document.getElementById('freeGiftNote').innerHTML = '';
    return;
  }
  let subtotal = 0;
  let html = '';
  cart.forEach(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return;
    subtotal += p.price * item.quantity;
    html += `
      <div class="cart-item">
        <div class="cart-item-info"><strong>${p.name}</strong><br>₹${p.price.toLocaleString()} x ${item.quantity}</div>
        <div class="cart-item-controls">
          <button class="cart-qty-minus" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-plus" data-id="${item.id}">+</button>
          <button class="cart-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  const shipping = subtotal >= 499 ? 0 : 99;
  const total = subtotal + shipping;
  document.getElementById('cartSubtotal').innerText = `₹${subtotal.toLocaleString()}`;
  document.getElementById('cartShipping').innerText = shipping === 0 ? 'FREE' : `₹${shipping}`;
  document.getElementById('cartGrandTotal').innerText = `₹${total.toLocaleString()}`;
  if (subtotal >= 999) document.getElementById('freeGiftNote').innerHTML = '<i class="fas fa-gift"></i> You qualify for a free plant!';
  else document.getElementById('freeGiftNote').innerHTML = '';
  document.querySelectorAll('.cart-qty-minus').forEach(btn => btn.onclick = () => removeFromCart(parseInt(btn.dataset.id)));
  document.querySelectorAll('.cart-qty-plus').forEach(btn => btn.onclick = () => addToCart(parseInt(btn.dataset.id)));
  document.querySelectorAll('.cart-remove').forEach(btn => btn.onclick = () => deleteCartItem(parseInt(btn.dataset.id)));
}
function openCartSidebar() { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('cartOverlay').classList.add('active'); }
function closeCartSidebar() { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('active'); }
function showToast(msg) { const toast = document.getElementById('toast'); toast.innerText = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }

// ========== HERO CAROUSEL (Fixed) ==========
function initCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('carouselDots');
  if (!slides.length) return;
  let current = 0;
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  function goToSlide(n) {
    slides[current].classList.remove('active');
    const dots = document.querySelectorAll('.dot');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1));
  setInterval(() => goToSlide(current + 1), 5000);
}

// ========== NEWSLETTER MODAL ==========
function setupNewsletterModal() {
  const modal = document.getElementById('newsletterModal');
  const openBtn = document.getElementById('openNewsletterModal');
  const closeSpan = document.querySelector('.modal-close');
  const form = document.getElementById('modalNewsletterForm');
  if (!modal || !openBtn) return;
  openBtn.onclick = () => modal.style.display = 'flex';
  if (closeSpan) closeSpan.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value;
      const email = document.getElementById('modalEmail').value;
      alert(`🎉 Thank you ${name}! Your 15% discount coupon: GREEN15 has been sent to ${email}`);
      modal.style.display = 'none';
      form.reset();
    };
  }
}

// ========== OTHER SETUP FUNCTIONS ==========
function setupSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('closeSearch');
  if (searchToggle) searchToggle.onclick = () => overlay.classList.add('active');
  if (closeBtn) closeBtn.onclick = () => overlay.classList.remove('active');
}
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger) return;
  hamburger.onclick = () => {
    mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px,-6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };
}
function renderWishlistPage() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  if (wishlist.length === 0) container.innerHTML = '<p>Your wishlist is empty.</p>';
  else {
    const items = products.filter(p => wishlist.includes(p.id));
    container.innerHTML = items.map(p => renderProductCard(p)).join('');
    attachProductEvents();
  }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCartSidebar();
  updateCartCounters();
  updateWishlistCount();
  initCarousel();
  setupSearch();
  setupMobileMenu();
  setupFilters();
  setupNewsletterModal();
  renderWishlistPage();
  const cartToggle = document.getElementById('cartToggle');
  if (cartToggle) cartToggle.addEventListener('click', openCartSidebar);
  const closeCart = document.getElementById('closeCartBtn');
  if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
  const overlay = document.getElementById('cartOverlay');
  if (overlay) overlay.addEventListener('click', closeCartSidebar);
});