const bubble = document.querySelector('.bubble-menu');

const calculateContextMenuPosition = (event) => {
  const clickX = event.clientX;
  const clickY = event.clientY;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  const isNearHorizontalEdges = clickX < windowWidth / 2;
  const isNearVerticalEdges = clickY < windowHeight / 2;
  
  const bubbleWidth = bubble.offsetWidth;
  const bubbleHeight = bubble.offsetHeight;
  
  let left, top;
  
  if (isNearHorizontalEdges) {
    left = clickX + bubbleWidth > windowWidth ? windowWidth - bubbleWidth : clickX;
  } else {
    left = clickX < bubbleWidth ? 0 : clickX - bubbleWidth;
  }
  
  if (isNearVerticalEdges) {
    top = clickY + bubbleHeight > windowHeight ? windowHeight - bubbleHeight : clickY;
  } else {
    top = clickY < bubbleHeight ? 0 : clickY - bubbleHeight;
  }
    return { left, top };
}
  
textarea.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  bubble.style.opacity = '1';
  bubble.style.zIndex = '99';
  const { left, top } = calculateContextMenuPosition(event);
  bubble.style.left = left + 'px';
  bubble.style.top = top + 'px';
});
  

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.addEventListener('click', (event) => {
    const isOutsideContextMenu = !event.target.closest('.bubble');
    if (isOutsideContextMenu) {
      bubble.style.opacity = '0';
      bubble.style.zIndex = '-1';
    }
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'Tab') return
    const isOutsideContextMenu = !event.target.closest('.bubble');
    if (isOutsideContextMenu) {
      bubble.style.opacity = '0';
      bubble.style.zIndex = '-1';
    }
});
