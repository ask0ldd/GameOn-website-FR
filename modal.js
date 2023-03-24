function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

//
// Following code : Needs full refactoring
//

// DOM Elements
const modaleNode = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn")
const formData = document.querySelector(".formData")
const successBody = document.querySelector("#success-modalbody")
const formBody = document.querySelector("#form-modalbody")

// modal closing
const closeBtn = document.querySelectorAll(".close")
const successCloseBtn = document.querySelector("#success-close")
// when the x buttons are clicked
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal))
// when "fermer" is clicked
successCloseBtn.addEventListener("click", closeModal)
// when clicking on the backdrop
modaleNode.addEventListener("click", (event) => { 
  if(event.target === modaleNode) closeModal()
})

function closeModal(){
  formBody.style.display="block"
  successBody.style.display="none"
  // TODO : emptying form
  modaleNode.style.display = "none"
}

// modal opening
modalBtn.forEach((btn) => btn.addEventListener("click", openModal));
function openModal() {
  modaleNode.style.display = "block";
}

// switch from the form body to the success one
function switchModalContent(){
  formBody.style.display="none"
  successBody.style.display="flex"
}