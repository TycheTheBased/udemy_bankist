'use strict';

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//Navbar
const header = document.querySelector('.header');
const navbar = document.querySelector('.nav');
const navLinkContainer = document.querySelector('.nav__links');
const navItems = navLinkContainer.querySelectorAll('.nav__item');

//Sections
const sectionOne = document.querySelector('#section--1');
const sectionOneImages = document.querySelectorAll('.features__img');
const sections = document.querySelectorAll('.section');
const scrollToBtn = document.querySelector('.btn--scroll-to');

//Tabs
const tabContainer = document.querySelector('.operations__tab-container');
const btnTabs = tabContainer.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

//hiding all sections
sections.forEach(section => section.classList.add('section--hidden'));

//Navbar sticky
const navbarObserver = new IntersectionObserver(stickyHandler, {
  root: null,
  threshold: 0,
  rootMargin: `-${navbar.getBoundingClientRect().height}px`,
});

navbarObserver.observe(header);

function stickyHandler(entry) {
  const [entries] = entry;
  if (!entries.isIntersecting) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
}

//NAVBAR Smooth Scrolling
navLinkContainer.addEventListener('click', scrollHandler);
function scrollHandler(evt) {
  evt.preventDefault();
  if (!evt.target.classList.contains('nav__link')) return;
  const _href = evt.target.getAttribute('href');
  document.querySelector(_href).scrollIntoView({
    behavior: 'smooth',
  });
}

//Navbar Blur Effect
navbar.addEventListener('mouseover', evt => blurEffectHandler(evt, 0.5));
navbar.addEventListener('mouseout', evt => blurEffectHandler(evt, 1));

function blurEffectHandler(evt, ratio) {
  if (!evt.target.classList.contains('nav__link')) return;
  const hoveredEl = evt.target.closest('.nav__item');
  const brand = navbar.querySelector('img');
  navItems.forEach(item => {
    if (item !== hoveredEl) {
      item.style.opacity = ratio;
      brand.style.opacity = ratio;
    }
  });
}

//Scroll to btn
scrollToBtn.addEventListener('click', scrollToSection);
function scrollToSection(e) {
  e.preventDefault();
  const { top, left } = sectionOne.getBoundingClientRect();
  sectionOne.scrollIntoView({
    top: top + window.scrollY,
    left: left + window.scrollX,
    behavior: 'smooth',
  });
}

//Tab component
tabContainer.addEventListener('click', tabHanlder);
function tabHanlder(evt) {
  evt.preventDefault();
  if (!evt.target.classList.contains('operations__tab')) return;

  const targetTab = evt.target.getAttribute('data-tab');
  const targetContent = document.querySelector(
    `.operations__content--${targetTab}`
  );

  btnTabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  evt.target.classList.add('operations__tab--active');
  targetContent.classList.add('operations__content--active');
}

//Slider Component

function slider() {
  const slides = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');

  const prevBtn = document.querySelector('.slider__btn--left');
  const nextBtn = document.querySelector('.slider__btn--right');

  let currentSlide = 0;
  const slideAmount = slides.length;

  //init slider positions
  function initSlide() {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${i * 100}%)`;
    });
  }
  initSlide();

  //create dots
  function createDots() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot ${
          i === 0 ? 'dots__dot--active' : ''
        }" data-slide="${i}"></button>`
      );
    });
  }
  createDots();

  //active dot
  function dotActive(curr) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    dots[curr].classList.add('dots__dot--active');
  }

  function dotHandler(evt) {
    if (evt.target.classList.contains('dots__dot')) {
      const { slide } = evt.target.dataset;
      goToSlide(slide);
      dotActive(slide);
    }
  }

  //Slide to go to
  function goToSlide(currentSlide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
  }

  //Slide movement function
  function nextSlide() {
    if (currentSlide === slideAmount - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    dotActive(currentSlide);
  }

  function prevSlide() {
    if (currentSlide <= 0) {
      currentSlide = slideAmount - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    dotActive(currentSlide);
  }

  //Event Listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  dotContainer.addEventListener('click', dotHandler);
}
slider();

//Reveal Sections
const observer = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

sections.forEach(section => observer.observe(section));

function revealSection(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
}

//Reveal Images
const imageObserver = new IntersectionObserver(revealImg, {
  root: null,
  threshold: 0.2,
});
sectionOneImages.forEach(img => imageObserver.observe(img));
function revealImg(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  const targetEntry = entry.target;
  targetEntry.classList.remove('lazy-img');
  targetEntry.src = targetEntry.dataset.src;
  imageObserver.unobserve(targetEntry);
}
//MODAL
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
