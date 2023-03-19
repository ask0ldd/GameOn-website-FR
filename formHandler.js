// class errorNode
class errorMessageNode { // gerer erreurs si nodes non existant

    constructor(nodeSelector) 
    {
        this.node = document.querySelector(nodeSelector)
    }

    /*show() 
    { 
        this.node.style.display="block" 
    }

    hide() 
    { 
        this.node.style.display="none"
    }*/

    show = () => {
        this.node.style.display="block"
    }

    hide = () => {
        this.node.style.display="none"
    }
}

class formInputNode{
    setStyletoNeutral
    setStyletoError

    constructor(inputSelector){ // gerer erreurs si input non existant
        this.input = document.querySelector(inputSelector)
        if(input.type === "text"){
            setStyletoNeutral = () => {this.input.style.border="1x solid red"}
            setStyletoError = () => {this.input.style.border="none"}
        }
    }

}

// class grouping an input and its related error node
class error_InputCouple{

    constructor(inputSelector, errorNodeSelector){
        this.errorNode = new errorMessageNode(errorNodeSelector)
        this.inputNode = new formInputNode(inputSelector)
    }

}

// class form
class Form{

    constructor(){

        // regroup all HTML error nodes references
        this.errorNodes = {
            'firstname' : new errorMessageNode('#prenomError'),
            'lastname' : new errorMessageNode('#nomError'),
            'birthdate' : new errorMessageNode('#birthdateError'),
            'tourney' : new errorMessageNode('#tourneyError'),
            'locations' : new errorMessageNode('#locationsError'),
            'conditions' : new errorMessageNode('#conditionsError')
        }

        // linking each form input to the its validation function
        this.validationFunctions = {
            'firstname' : () => this.isName('#first'),
            'lastname' : () => this.isName('#last'),
            'birthdate' : () => this.isDate('#birthdate'),
            'tourney' : () => this.isBetween_0_and_99('#quantity'),
            'locations' : () => this.isOneLocationChecked('location'),
            'conditions' : () => !document.querySelector('#checkbox1').checked
        }
    }

    // is the passed field value a name ?
    isName(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const nameRegex =  new RegExp ("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$")
        return nameRegex.test(fieldValue)
    }

    // is the passed field value a number between 0 & 99 ?
    isBetween_0_and_99(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const numberRegex = new RegExp ("^[0-9]{1,2}$")
        return numberRegex.test(fieldValue)
    }

    // is the passed field value a date ?
    isDate(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const dateRegex = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$")
        return dateRegex.test(fieldValue)
    }

    // is one of the radio buttons selected ?
    isOneLocationChecked(radiosName){
        const radios = document.getElementsByName(fieldsName)

        for (const radio of radios) {
            if (radio.checked === true) {
                return true
            }
        }

        return false
    }

    realtimeValidation(field){
        this.validationFunctions[field]() === false ? this.errorNodes[field].show() : this.errorNodes[field].hide()
    }

    fullFormValidation(){

    }
}

const myForm = new Form()