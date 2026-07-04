const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const sections = Array.from(document.querySelectorAll('.section'));
const heroContent = document.querySelector('.hero-content');
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
    const isActive = mobileMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isActive));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const faqItems = Array.from(document.querySelectorAll('.faq-item'));
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

const SUPPORTED_LANGS = ['id', 'en', 'ja'];
const LANG_STORAGE_KEY = 'takari-lang';
const langButtons = Array.from(document.querySelectorAll('.lang-btn'));
const metaDescriptionTag = document.querySelector('meta[name="description"]');

function applyLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || typeof translations === 'undefined') {
    lang = 'id';
  }
  const dict = translations[lang] || translations.id;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (dict[key] !== undefined) el.setAttribute('alt', dict[key]);
  });

  if (dict.meta_title) document.title = dict.meta_title;
  if (dict.meta_description && metaDescriptionTag) {
    metaDescriptionTag.setAttribute('content', dict.meta_description);
  }

  document.documentElement.lang = lang;

  langButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (error) {
    /* localStorage unavailable, ignore */
  }
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

let savedLang = 'id';
try {
  savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'id';
} catch (error) {
  savedLang = 'id';
}
applyLanguage(savedLang);

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

  if (heroContent) {
    const heroShift = Math.max(0, scrollTop * 0.08);
    heroContent.style.transform = `translateY(${heroShift}px)`;
    heroContent.style.opacity = `${Math.max(0.3, 1 - scrollTop / 700)}`;
  }

  const heroOverlay = document.querySelector('.hero-overlay');
  if (heroOverlay) {
    heroOverlay.style.transform = `translate3d(${scrollTop * 0.01}%, ${scrollTop * 0.02}%, 0)`;
  }

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      section.classList.add('visible-section');
    }
    if (rect.top > window.innerHeight * 0.95 && section.classList.contains('visible-section')) {
      section.classList.remove('visible-section');
    }
  });
});
window.addEventListener('load', () => {
  toggleHeader();
  parallaxHero();
  window.dispatchEvent(new Event('scroll'));
});
