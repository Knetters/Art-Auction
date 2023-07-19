// Back one page
document.getElementById("goBack").addEventListener("click", backWindow)

function backWindow() {
    window.location.href = '/';
}

// Get the slider element and the draw-time-value element
var slider = document.querySelector('.time-value.slider');
var drawTimeValue = document.getElementById('draw-time-value');

if(slider){
  // Add an event listener to the slider to detect changes
  slider.addEventListener('input', function() {
    // Update the text content of the draw-time-value element with the slider's value
    drawTimeValue.textContent = slider.value;
  });
}

collectionPopup = document.getElementById("collection")

if(collectionPopup) {
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
}

let keyDownInteraction = document.querySelectorAll('.input-field');

keyDownInteraction.forEach(input => {
  input.addEventListener('keydown', wiggleHandler);
  input.addEventListener('animationend', wiggleHandler);
});

function wiggleHandler(event) {
  event.target.classList.toggle('wiggle');
}

// Get all elements with the "game-code" class
var gameCodes = document.getElementsByClassName("game-code");

// Add a click event listener to each element
for (var i = 0; i < gameCodes.length; i++) {
  gameCodes[i].addEventListener("click", function () {
    // Copy the value inside the clicked span
    var valueToCopy = this.textContent || this.innerText;
    copyToClipboard(valueToCopy);
  });
}

// Function to copy the specified value to the clipboard
function copyToClipboard(value) {
  var textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed"; // Prevent scrolling to bottom of page
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}