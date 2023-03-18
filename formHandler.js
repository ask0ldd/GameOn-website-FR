// class errorNode
class errorMessageNode {

    constructor(nodeSelector) 
    {
        this.node = document.querySelector(nodeSelector)
    }

    show() 
    { 
        this.node.style.display="block" 
    }

    hide() 
    { 
        this.node.style.display="none"
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
}

const myForm = new Form()