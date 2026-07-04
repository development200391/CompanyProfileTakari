const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

const toggleHeader = () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

const parallaxHero = () => {
  if (!hero) return;
  const offset = window.scrollY * 0.12;
  hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
);

revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index * 0.08, 0.4)}s`);
  observer.observe(item);
});

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobileMenu.classList.remove('active'));
  });
}

if (backToTop) {
  backToTop.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('scroll', () => {
  toggleHeader();
  parallaxHero();

  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (backToTop) {
    backToTop.classList.toggle('visible', scrollTop > 600);
  }
});
window.addEventListener('load', () => {
  toggleHeader();
  parallaxHero();
});
