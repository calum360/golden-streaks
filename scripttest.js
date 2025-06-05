document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById('domainViewer');
  const openBtn = document.getElementById('openViewerBtn');
  const closeBtns = [
    document.getElementById('desktopCloseBtn'),
    document.getElementById('mobileCloseBtn')
  ].filter(Boolean);
  const slideCounter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevCardBtn');
  const nextBtn = document.getElementById('nextCardBtn');
  let currentIndex = parseInt(localStorage.getItem('currentCardIndex') || '0', 10);

  // Load dynamic cards from .card-include elements (on homepage or FAQ)
  document.querySelectorAll('.card-include').forEach(el => {
    const src = el.getAttribute('data-src');
    fetch(src)
      .then(res => res.text())
      .then(html => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const card = wrapper.querySelector('.domainCard');
        if (card) el.replaceWith(card);
      });
  });

  const getCards = () =>
    viewer ? Array.from(viewer.querySelectorAll('.domainCard')) : [];

  function scrollToCard(index) {
    const cards = getCards();
    if (!cards.length) return;
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, i) => {
      card.classList.toggle('activeCard', i === currentIndex);
    });
    if (slideCounter) {
      slideCounter.textContent = `${currentIndex + 1}/${cards.length}`;
    }
    localStorage.setItem('currentCardIndex', currentIndex);
  }

  function openViewer() {
    if (!viewer) return;
    viewer.classList.add('reveal');
    document.body.style.overflow = 'hidden';
    setTimeout(() => scrollToCard(currentIndex), 200);
  }

  function closeViewer() {
    if (!viewer) return;
    viewer.classList.remove('reveal');
    document.body.style.overflow = '';
  }

  // Event bindings
  if (openBtn && viewer) {
    openBtn.addEventListener('click', openViewer);
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeViewer);
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToCard(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToCard(currentIndex - 1);
    });
  }

  // On load, set initial card
  if (viewer && getCards().length) {
    scrollToCard(currentIndex);
  }
});
