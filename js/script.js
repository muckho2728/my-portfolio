// Toggle mobile nav
const toggleBtn = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggleBtn?.addEventListener('click', () => {
  const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  toggleBtn.setAttribute('aria-expanded', String(!expanded));
  nav.style.display = nav.style.display === 'block' ? '' : 'block';
});

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links (modern browsers support)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile nav after click
      if(window.innerWidth < 640 && nav) nav.style.display = '';
    }
  })
});

// Initialize ScrollReveal if available
if(window.ScrollReveal){
  ScrollReveal().reveal('.hero__text, .hero__avatar, .section__title, .project-card', {
    distance: '40px',
    duration: 700,
    easing: 'ease-in-out',
    interval: 120,
    origin: 'bottom'
  });
}

// Simple contact form handler
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  // Simple validation example
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if(!name || !email || !message){
    alert('Vui lòng điền đầy đủ thông tin.');
    return;
  }
  // Here you would send data to API / form service
  alert('Cảm ơn bạn! Tin nhắn đã được gửi.');
  form.reset();
});
