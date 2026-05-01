// INIT
document.addEventListener('DOMContentLoaded', initApp)

function initApp() {
  initBurger()
  initSliders()
  initScrollEffects()
  initFormValidation()
  initAnimations()
  isPageLocked()
}

// Помощник для проверки, заблокирован ли скролл
const isPageLocked = () => document.documentElement.classList.contains('lock-scroll')

// BURGER MENU
function initBurger() {
  const burger = document.querySelector('.burger')
  const menu = document.querySelector('.menu-box')
  const header = document.querySelector('.header')
  const logo = document.querySelector('.header__logo')
  const links = menu.querySelectorAll('a')

  if (!burger || !menu || !header || !logo) return

  const isGutterSupported = CSS.supports('scrollbar-gutter', 'stable')

  function toggleMenu(forceClose = false) {
    const isOpening = forceClose === true ? false : !menu.classList.contains('menu-box--active')

    if (isOpening) {
      if (!isGutterSupported) {
        const scrollWidth = window.innerWidth - document.documentElement.clientWidth
        document.documentElement.style.setProperty('--scroll-padding', `${scrollWidth}px`)
      }
      document.documentElement.classList.add('lock-scroll')
    } else {
      document.documentElement.classList.remove('lock-scroll')
      if (!isGutterSupported) {
        setTimeout(() => document.documentElement.style.removeProperty('--scroll-padding'), 300)
      }
    }

    // Оптимизация: используем массив имен классов и перебираем их в цикле
    const components = [
      { el: burger, cls: 'burger' },
      { el: menu, cls: 'menu-box' },
      { el: header, cls: 'header' },
      { el: logo, cls: 'header__logo' },
    ]

    components.forEach(({ el, cls }) => {
      el.classList.toggle(`${cls}--active`, isOpening)
    })

    burger.setAttribute('aria-expanded', isOpening)
  }

  // Подводный камень №1: Если бургер - ссылка, нужен preventDefault
  burger.addEventListener('click', (e) => {
    e.preventDefault()
    toggleMenu()
  })

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('menu-box--active')) toggleMenu(true)
    })
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('menu-box--active')) {
      toggleMenu(true)
    }
  })
}

// SLIDERS
function initSliders() {
  if (typeof Swiper === 'undefined') return

  new Swiper('.main-slider', {
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    navigation: {
      nextEl: '.main-slider__next',
      prevEl: '.main-slider__prev',
    },
  })

  document.querySelectorAll('.main-slider__slide').forEach((slide) => {
    const thumbsEl = slide.querySelector('.thumbs-slider')
    const innerEl = slide.querySelector('.inner-slider')
    if (!thumbsEl || !innerEl) return

    const thumbs = new Swiper(thumbsEl, {
      direction: 'vertical',
      slidesPerView: 5,
      spaceBetween: 15,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      observer: true,
      observeParents: true,
      breakpoints: {
        0: { direction: 'horizontal' },
        1025: { direction: 'vertical' },
      },
    })

    new Swiper(innerEl, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      observer: true,
      observeParents: true,
      thumbs: { swiper: thumbs },
      navigation: {
        nextEl: slide.querySelector('.inner-slider__next'),
        prevEl: slide.querySelector('.inner-slider__prev'),
      },
      pagination: {
        el: slide.querySelector('.swiper-pagination'),
        clickable: true,
      },
    })
  })
}

//  SCROLL EFFECT
function initScrollEffects() {
  const items = document.querySelectorAll('.price__item')
  if (!items.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      // Подводный камень №2: Запрещаем менять классы, если страница залочена
      if (isPageLocked()) return

      entries.forEach((entry) => {
        entry.target.classList.toggle('on-focus', entry.isIntersecting)
        entry.target.classList.toggle('default', !entry.isIntersecting)
      })
    },
    { threshold: 0.5 },
  )

  items.forEach((item) => observer.observe(item))
}

// FORM
function initFormValidation() {
  const form = document.querySelector('.form')
  const input = document.getElementById('tel')
  const button = document.querySelector('.section-form__btn')
  const modal = document.getElementById('modal-success')

  if (!form || !input || !button || !modal) return

  const mask = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Только цифры
    let formattedValue = '+38 (0'

    // Если пользователь удалил всё до кода страны, очищаем поле
    if (value.length <= 3) {
      if (e.type === 'blur') e.target.value = ''
      return
    }

    // Ограничиваем длину (380 + 9 цифр)
    const number = value.substring(3, 12)

    if (number.length > 0) formattedValue += number.substring(0, 2) + (number.length > 2 ? ') ' : '')
    if (number.length > 2) formattedValue += number.substring(2, 5)
    if (number.length > 5) formattedValue += '-' + number.substring(5, 7)
    if (number.length > 7) formattedValue += '-' + number.substring(7, 9)

    e.target.value = formattedValue

    // Валидация: номер считается полным, если в нем 12 цифр (38 0XX XXX XX XX)
    const isValid = value.length === 12
    button.disabled = !isValid
    input.classList.toggle('invalid', !isValid && value.length > 3)
    function toggleModal(show = true) {
      if (show) {
        modal.classList.add('modal--active')
        document.documentElement.classList.add('lock-scroll') // Используем класс блокировки
      } else {
        modal.classList.remove('modal--active')
        document.documentElement.classList.remove('lock-scroll')
      }
    }

    // Закрытие модалки
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__overlay') || e.target.classList.contains('modal__close')) {
        toggleModal(false)
      }
    })

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      // Блокируем кнопку, чтобы не нажали дважды
      button.disabled = true
      button.textContent = 'Відправка...'

      // Имитация задержки сети (2 секунды)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Имитация успешного ответа
      console.log('Данные отправлены:', input.value)

      // Сбрасываем форму
      form.reset()
      button.textContent = 'Надіслати'

      // Показываем успех
      toggleModal(true)
    })
  }

  // События для маски
  input.addEventListener('input', mask)
  input.addEventListener('focus', (e) => {
    if (!e.target.value) e.target.value = '+38 (0'
  })
  input.addEventListener('blur', mask)

  form.addEventListener('submit', (e) => {
    const cleanValue = input.value.replace(/\D/g, '')
    if (cleanValue.length !== 12) {
      e.preventDefault()
      input.classList.add('invalid')
    }
  })
}

function validatePhone(value) {
  // Убираем пробелы, дефисы и скобки для проверки
  const cleanValue = value.replace(/\D/g, '')

  // Логика для Украины:
  // 1. Если начинают с 0 (067...), должно быть 10 цифр
  // 2. Если с 380 (38067...), должно быть 12 цифр
  // 3. Если просто 9 цифр (67...), тоже можно пропустить
  const isValidLength = cleanValue.length === 10 || cleanValue.length === 12 || cleanValue.length === 9

  // Проверяем, что номер начинается на допустимые коды и состоит только из цифр
  const ukraineRegex = /^(?:\+?38)?(?:0\d{9})$|^(?:0\d{9})$/

  return ukraineRegex.test(value.replace(/\s/g, ''))
}

// ANIMATIONS
function initAnimations() {
  const animatedItems = document.querySelectorAll('[data-animate]')
  if (!animatedItems.length) return

  const observer = new IntersectionObserver(
    (entries, observer) => {
      // Подводный камень №3: Запрещаем анимации при открытом меню
      if (isPageLocked()) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const animation = el.dataset.animate
          const delay = el.dataset.delay || 0

          el.style.transitionDelay = `${delay}ms`
          el.classList.add('animate', `animate--${animation}`)

          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
  )

  animatedItems.forEach((el) => observer.observe(el))
}
