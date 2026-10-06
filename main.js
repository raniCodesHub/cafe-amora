import './style.css'

/* ===== Navbar scroll state ===== */
const navbar = document.getElementById('navbar')

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40)
})

/* ===== Mobile menu ===== */
const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open')
  navToggle.classList.toggle('active', isOpen)
  navToggle.setAttribute('aria-expanded', isOpen)
})

navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open')
    navToggle.classList.remove('active')
    navToggle.setAttribute('aria-expanded', 'false')
  })
})

/* ===== Active nav link on scroll ===== */
const sections = document.querySelectorAll('section[id]')
const navLinkEls = document.querySelectorAll('.nav-link')

function updateActiveNav() {
  let current = ''
  sections.forEach((section) => {
    const top = section.offsetTop - 100
    if (window.scrollY >= top) current = section.id
  })
  navLinkEls.forEach((link) => {
    const href = link.getAttribute('href')
    link.classList.toggle('active-nav', href === '#' + current && !link.classList.contains('nav-cta'))
  })
}
window.addEventListener('scroll', updateActiveNav)

/* ===== Menu filtering ===== */
const filterButtons = document.querySelectorAll('.filter-btn')
const menuCards = document.querySelectorAll('.menu-card')

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    const filter = btn.dataset.filter

    menuCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter
      card.classList.toggle('hidden', !matches)
    })
  })
})

/* ===== Scroll animations (IntersectionObserver) ===== */
const animateEls = document.querySelectorAll('[data-animate]')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
)

animateEls.forEach((el) => observer.observe(el))

/* ===== Reservation form validation ===== */
const form = document.getElementById('reservationForm')
const formSuccess = document.getElementById('formSuccess')

function showError(fieldId, message) {
  const errorEl = document.querySelector(`.form-error[data-for="${fieldId}"]`)
  const inputEl = document.getElementById(fieldId)
  if (errorEl) errorEl.textContent = message
  if (inputEl) inputEl.classList.toggle('error', !!message)
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''))
  document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'))
}

function validateField(field) {
  const id = field.id
  const value = field.value.trim()

  if (field.hasAttribute('required') && !value) {
    showError(id, 'This field is required.')
    return false
  }

  if (id === 'resEmail' && value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(value)) {
      showError(id, 'Please enter a valid email address.')
      return false
    }
  }

  if (id === 'resPhone' && value) {
    const phoneRe = /^[\d\s\+\-\(\)]{8,16}$/
    if (!phoneRe.test(value)) {
      showError(id, 'Please enter a valid phone number.')
      return false
    }
  }

  if (id === 'resDate' && value) {
    const selected = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected < today) {
      showError(id, 'Please select a future date.')
      return false
    }
  }

  if (id === 'resTime' && value) {
    const [h, m] = value.split(':').map(Number)
    const totalMin = h * 60 + m
    if (totalMin < 8 * 60 || totalMin > 22 * 60) {
      showError(id, 'Please select a time between 8:00 AM and 10:00 PM.')
      return false
    }
  }

  showError(id, '')
  return true
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    clearErrors()

    const fields = form.querySelectorAll('input[required], select[required]')
    let allValid = true
    fields.forEach((field) => {
      if (!validateField(field)) allValid = false
    })

    if (allValid) {
      formSuccess.textContent = 'Reservation confirmed! We look forward to welcoming you at Café Amora.'
      form.reset()
      setTimeout(() => {
        formSuccess.textContent = ''
      }, 6000)
    }
  })

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field))
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field)
    })
  })
}

/* ===== Set min date to today on the date picker ===== */
const dateInput = document.getElementById('resDate')
if (dateInput) {
  const today = new Date().toISOString().split('T')[0]
  dateInput.setAttribute('min', today)
}
