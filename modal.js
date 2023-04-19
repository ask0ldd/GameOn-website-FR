export function editNav() {
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
// const formData = document.querySelector(".formData")
const successBody = document.querySelector("#success-modalbody")
const formBody = document.querySelector("#form-modalbody")
const form = document.querySelector("#reserve")

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
window.addEventListener('keydown', e => {if(e.code == "Escape") return closeModal()}) // add preventdefault?

function closeModal(){
  formBody.style.display = "block"
  form.reset()
  successBody.style.display = "none"
  modaleNode.style.display = "none"
}

// modal opening
modalBtn.forEach((btn) => btn.addEventListener("click", openModal));
function openModal() {
  modaleNode.style.display = "block";
}

// switch from the form body to the success one
export function switchModalContent(){
  formBody.style.display="none"
  successBody.style.display="flex"
}

class modale {

  constructor(){

  }

}

modale.prototype.close = () => {

}