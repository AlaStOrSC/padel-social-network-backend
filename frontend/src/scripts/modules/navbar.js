export function Navbar() {
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const navbarMenu = document.querySelector('.navbar__menu');
  const navLinks = document.querySelectorAll('.navbar__link');

  function toggleMenu() {
    hamburgerIcon.classList.toggle('active');
    navbarMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  hamburgerIcon.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && navbarMenu.classList.contains('active')) {
      hamburgerIcon.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}