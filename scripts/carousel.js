let index = 0;

function moveSlide(direction) {
  const carousel = document.querySelector('#carousel');
  const items = document.querySelectorAll('.carousel-item');
  const spacer = document.querySelectorAll('.carousel-spacer');
  const totalItems = items.length;
  const itemsVisible = Math.floor(carousel.offsetWidth / (items[0].offsetWidth + spacer[0].offsetWidth));

  index += direction;

  // Ensure the index stays within bounds
  if (index < 0) index = totalItems - itemsVisible;
  if (index > totalItems - itemsVisible) index = 0;

  const offset = -(index * (items[0].offsetWidth + spacer[0].offsetWidth)); // 20 is the margin

  // Calculate the maximum possible offset that would show the last item correctly
  const maxOffset = -(totalItems - itemsVisible) * (items[0].offsetWidth + spacer[0].offsetWidth);
  
  // Prevent the carousel from moving beyond the last item
  carousel.style.transform = `translateX(${Math.max(offset, maxOffset)}px)`;
}
