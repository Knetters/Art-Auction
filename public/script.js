// Back one page
document.getElementById("goBack").addEventListener("click", backWindow)

function backWindow() {
    window.location.href = '/';
}

// Get the slider element and the draw-time-value element
var slider = document.querySelector('.time-value.slider');
var drawTimeValue = document.getElementById('draw-time-value');

// Add an event listener to the slider to detect changes
slider.addEventListener('input', function() {
  // Update the text content of the draw-time-value element with the slider's value
  drawTimeValue.textContent = slider.value;
});

collectionPopup = document.getElementById("collection")
document.getElementById("bagIcon").addEventListener("click", toggleCollection)
document.getElementById("closeIcon").addEventListener("click", toggleCollection)

document.addEventListener('keydown', function(event) {
    // Check if the escape key was pressed
    if (event.key === 'Escape') {
      // Do something when the escape key is pressed
      toggleCollection()
    }
});

function toggleCollection() {
    collectionPopup.classList.toggle("active")
}

let keyDownInteraction = document.querySelectorAll('input');

keyDownInteraction.forEach(input => {
  input.addEventListener('keydown', wiggleHandler);
  input.addEventListener('animationend', wiggleHandler);
});

function wiggleHandler(event) {
  event.target.classList.toggle('wiggle');
}