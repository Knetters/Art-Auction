// Back one page
document.getElementById("goBack").addEventListener("click", backWindow)

function backWindow() {
    window.location.href = '/';
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

if(keyDownInteraction) {
  keyDownInteraction.forEach(input => {
    input.addEventListener('keydown', wiggleHandler);
    input.addEventListener('animationend', wiggleHandler);
  });
  
  function wiggleHandler(event) {
    event.target.classList.toggle('wiggle');
  }
}

let copyInteraction = document.getElementById('game-code')

if(copyInteraction){
  copyInteraction.addEventListener('click', copyHandler)
  copyInteraction.addEventListener('animationend', copyHandler)

  function copyHandler() {
    copyInteraction.classList.toggle('copy')
  }
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