
function dropMenu(){
  const menuItems = document.querySelectorAll('.menu-item')
  return menuItems[0].style.display !== "flex" ? menuItems.forEach(item => item.style.display = "flex") : menuItems.forEach(item => item.style.display = "none")
}

document.querySelector(".hamburger-li").addEventListener('click', ()=> dropMenu())

function menuBehaviorOnResize(){
  const menuItems = document.querySelectorAll('.menu-item')
  if(window.innerWidth >= 1180 && menuItems[0].style.display !== "flex") menuItems.forEach(item => item.style.display = "flex")
  if(window.innerWidth < 1180 && menuItems[0].style.display !== "none") menuItems.forEach(item => item.style.display = "none")
}

window.onresize = menuBehaviorOnResize

class Modal {
  constructor(){
    // modale closing buttons refs
    this.closeBtns = document.querySelectorAll(".close")
    this.successCloseBtn = document.querySelector("#success-close")
    this.closeBtns.forEach((btn) => btn.addEventListener("click", () => this.close()))
    // clicking on the backdrop should close the modale
    this.modaleNode = document.querySelector(".bground")
    this.modaleNode.addEventListener("click", (event) => { 
      if(event.target === this.modaleNode) this.close()
    })
    this.successCloseBtn.addEventListener("click", () => this.close())
    // open
    this.modalBtns = document.querySelectorAll(".modal-btn")
    this.modalBtns.forEach((btn) => btn.addEventListener("click", () => this.open()))
    // modale contents refs
    this.form = document.querySelector("#reserve")
    this.formBody = document.querySelector("#form-modalbody")
    this.successBody = document.querySelector("#success-modalbody")
  }

  open() {
    this.modaleNode.style.display = "block"
  }

  close() {
    this.formBody.style.display = "block"
    this.form.reset()
    this.successBody.style.display = "none"
    this.modaleNode.style.display = "none"
  }

  switchContent() {
    this.formBody.style.display="none"
    this.successBody.style.display="flex"
  }

  keyboardListenerOn() {
    window.addEventListener('keydown', e => {if(e.code == "Escape") return this.close()})
  }
}

const modal = new Modal()
modal.keyboardListenerOn()

export {modal}