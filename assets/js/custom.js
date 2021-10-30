// Prevent default action on click on menus with childrens if touch screen
var hasChildren = document.querySelectorAll('.has-children > a');
for (i = 0; i < hasChildren.length; i++) {
    hasChildren[i].addEventListener('click', function(event) {
        if ('ontouchstart' in document.documentElement) {
            event.preventDefault();
        }
    });
}

// Scroll up button
document.addEventListener("scroll", handleScroll);

var scrollToTopBtn = document.querySelector(".scroll-up");
scrollToTopBtn.style.opacity = 0;

function handleScroll() { 
  var windowScrollTop = window.scrollY,
      windowHeight = window.outerHeight,
      bodyHeight = document.body.scrollHeight,
      trigger = windowHeight * 2,
      opacity = (windowScrollTop / (bodyHeight - windowHeight)) * 4
    
    if (bodyHeight > trigger) {
        scrollToTopBtn.style.opacity = opacity;
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

scrollToTopBtn.addEventListener("click", scrollToTop);

function scrollToTop(event) {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}