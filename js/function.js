/** code by webdevtrick ( https://webdevtrick.com ) **/
const $ = document.querySelector.bind(document);
const sc = $(".sc");
const r = $(".r");
const o = $(".o");
const ll = $(".ll");

function transformLetters() {
  const scroll = window.scrollY;

  // console.log({AmountScrolled: scroll});

  sc.style.transform = `translate3d(0, ${scroll * 1.4}px, 0) rotateY(${
    -scroll * 0.03
  }deg)`;

  r.style.transform = `translate3d(${-scroll * 0.45}px, ${
    scroll * 0.95
  }px, 0) rotate(${-scroll * 0.1}deg)`;

  o.style.transform = `translate3d(${scroll * 0.65}px, ${
    scroll * 1.05
  }px, 0) rotate(${scroll * 0.2}deg)`;

  ll.style.transform = `translate3d(0, ${scroll * 0.5}px, 0) rotateY(${
    scroll * 0.04
  }deg)`;
}

window.addEventListener("scroll", transformLetters);
