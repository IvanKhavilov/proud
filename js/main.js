$(document).ready(function () {
  $('.burger').on('click', function () {
    $('.menu-box').toggleClass('menu-box--active')
    $('.burger').toggleClass('burger--active')
    $('.header').toggleClass('header--active')
    $('.header__logo').toggleClass('header__logo--active')
  })

  $('.portfolio__slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    swipe: false,
    infinite: false,
    prevArrow: `<button type="button" class="slick-prev portfolio__slider-prev">Попередній проєкт</button>`,
    nextArrow: `<button type="button" class="slick-next portfolio__slider-next">Наступний проєкт</button>`,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          prevArrow: `<button type="button" class="slick-prev portfolio__slider-prev"></button>`,
          nextArrow: `<button type="button" class="slick-next portfolio__slider-next"></button>`,
        },
      },
    ],
  })

  $('.portfolio__carosel-big').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    dots: true,
    infinite: true,
    autoplay: 10000,
    asNavFor: '.portfolio__carosel-small',
    prevArrow: `<button type="button" class="slick-prev portfolio__slider-big-prev"></button>`,
    nextArrow: `<button type="button" class="slick-next portfolio__slider-big-next"></button>`,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  })
  $('.portfolio__carosel-small').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.portfolio__carosel-big',
    dots: false,
    infinite: true,
    focusOnSelect: true,
    vertical: true,
    arrows: false,
    autoplay: 10000,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          vertical: false,
        },
      },
    ],
  })
  wow = new WOW({
    boxClass: 'wow', // default
    animateClass: 'animated', // default
    offset: 0, // default
    mobile: true, // default
    live: true, // default
  })
  wow.init()
})

// Додавання тіні при скролі
window.addEventListener('scroll', function () {
  const blocks = document.querySelectorAll('.price__item')
  const screenHeight = window.innerHeight

  blocks.forEach(block => {
    const blockRect = block.getBoundingClientRect()
    if (blockRect.top <= screenHeight / 2) {
      block.classList.add('on-focus')
      block.classList.remove('default')
    } else {
      block.classList.add('default')
      block.classList.remove('on-focus')
    }
  })
})

// Перевірка валідності поля вводу
const input = document.getElementById('tel')
const button = document.querySelector('.section-form__btn')

input.addEventListener('input', function () {
  if (!isValidData(input.value)) {
    input.classList.add('invalid')
    button.classList.add('valid')
  } else {
    input.classList.remove('invalid')
    button.classList.add('disabled')
  }
})

function isValidData(value) {
  const phoneRegex = /^\0\d{9}$/

  return phoneRegex
}
