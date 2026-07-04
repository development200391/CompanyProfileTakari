const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
const revealItems = document.querySelectorAll('.reveal');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

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
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobileMenu.classList.remove('active'));
  });
}

window.addEventListener('scroll', () => {
  toggleHeader();
  parallaxHero();
});
window.addEventListener('load', () => {
  toggleHeader();
  parallaxHero();
});
