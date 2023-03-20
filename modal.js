function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");

// closing modal
const closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", () => { 
  modalbg.style.display = "none"
  // TODO : set form visible / set confirmation window hidden
})

// closing modal when clicking on bg
modalbg.addEventListener("click", (event) => { 
  if(event.target === modalbg) modalbg.style.display = "none"
})

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}