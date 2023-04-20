import myForm from "./form.js"

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
  
  modalBoundaries

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
    // modal contents refs
    this.form = document.querySelector("#reserve")
    this.formBody = document.querySelector("#form-modalbody")
    this.successBody = document.querySelector("#success-modalbody")
    // modal boundaries to limit the tab rotation
    this.modalBoundaries = [document.querySelector('#modal-close-btn'), document.querySelector('#btn-submit-form')]
  }

  open() {
    this.modaleNode.style.display = "block"
    this.scrollLock(true)
    this.#setFocusTrap()
  }

  close() {
    this.formBody.style.display = "block"
    this.form.reset()
    this.successBody.style.display = "none"
    this.modaleNode.style.display = "none"
    this.scrollLock(false)
    // hide errornodes & reset inputs borders
    Object.entries(myForm.inputs).forEach( input => {
      input[1].errorNode.node.style.display = "none"
      input[1].style="none"
    })
    this.#unsetFocusTrap()
  }

  switchContent() {
    this.formBody.style.display="none"
    this.successBody.style.display="flex"
  }

  #keyboardHandler(e) {

    const KEYCODE_TAB = 9
    const isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB || e.keyCode == 27 || e.code === 'Space') // [i] echap

    if (!isTabPressed) return

    if(e.keyCode == 27)
    {
        return this.close()
    }

    if(e.shiftKey)
    {
        if (document.activeElement === this.modalBoundaries[0]) { e.preventDefault(); this.modalBoundaries[1].focus();}
    }
    else
    {
        if (document.activeElement === this.modalBoundaries[1]) { e.preventDefault(); this.modalBoundaries[0].focus();}
    }

    // custom checkboxs / radioboxs keyboard accessibility
    if(e.code === 'Space'){
      if(document.activeElement === document.querySelector('[for="location1"]')){ 
        document.querySelector('#location1').checked = !document.querySelector('#location1').checked
      }
      if(document.activeElement === document.querySelector('[for="location2"]')){ 
        document.querySelector('#location2').checked = !document.querySelector('#location2').checked
      }
      if(document.activeElement === document.querySelector('[for="location3"]')){ 
        document.querySelector('#location3').checked = !document.querySelector('#location3').checked
      }
      if(document.activeElement === document.querySelector('[for="location4"]')){ 
        document.querySelector('#location4').checked = !document.querySelector('#location4').checked
      }
      if(document.activeElement === document.querySelector('[for="location5"]')){ 
        document.querySelector('#location5').checked = !document.querySelector('#location5').checked
      }
      if(document.activeElement === document.querySelector('[for="location6"]')){ 
        document.querySelector('#location6').checked = !document.querySelector('#location6').checked
      }
      if(document.activeElement === document.querySelector('[for="checkbox1"]')){ 
        document.querySelector('#checkbox1').checked = !document.querySelector('#checkbox1').checked
      }
      if(document.activeElement === document.querySelector('[for="checkbox2"]')){ 
        document.querySelector('#checkbox2').checked = !document.querySelector('#checkbox2').checked
      }
    }

  }

  // set focus trap
  #setFocusTrap()
  {
      this.modalBoundaries[0].focus()
      window.addEventListener('keydown', e => this.#keyboardHandler(e))
  }

  #unsetFocusTrap()
  {
      this.modalBoundaries[0].focus()
      window.removeEventListener('keydown', e => this.#keyboardHandler(e))
  }

  // screenlock behind backdrop
  scrollLock(bool = false)
  {
      if(bool)
      {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop
          let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
          window.onscroll = () => {
              window.scrollTo(scrollLeft, scrollTop)
          }
      }else{
          window.onscroll = () => {}
      }
  }


}

const modal = new Modal()
//modal.keyboardListenersOn()
// window.addEventListener('keydown', e => modal.keyboardHandler(e))

export default modal