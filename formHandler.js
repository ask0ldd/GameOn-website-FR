import { Validators } from "./starterOnly/src/validators.js"

/*
// helper : grouping all validation fn
// TODO : still need to add the email validation fn
class Validators {

    static isName(inputValue){
        //const fieldValue = document.querySelector(fieldId).value.trim()
        const trimmedValue = inputValue.trim()
        const nameRegex =  new RegExp ("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$")
        return nameRegex.test(trimmedValue)
    }

    static isBetween_0_and_99(inputValue){
        const trimmedValue = inputValue.trim()
        const numberRegex = new RegExp ("^[0-9]{1,2}$")
        return numberRegex.test(trimmedValue)
    }

    static isDate(inputValue){
        const trimmedValue = inputValue.trim()
        const dateRegex = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$")
        const isDateYetToCome = (Date.parse(trimmedValue) - Date.now()) > 0
        return dateRegex.test(trimmedValue) && isDateYetToCome
    }

    static isEmail(inputValue){
        const trimmedValue = inputValue.trim()
        const emailRegex = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
        return emailRegex.test(trimmedValue)
    }

    static isOneRadioChecked(radiosName){
        const radios = document.getElementsByName(radiosName)

        for (const radio of radios) {
            if (radio.checked) {
                return true
            }
        }

        return false
    }

    static isBoxChecked(inputNode){
        return inputNode.checked
    }
}
*/


//
// a reference to some DOM error message node
//
class ErrorNode { 

    constructor(nodeSelector) 
    {
        // TODO : deal with non existing node
        this.node = document.querySelector(nodeSelector)
    }

    set display(bool){
        bool ? this.node.style.display="block" : this.node.style.display="none"
    }

    set message(message){
        this.message = message
    }
}



// a reference to some DOM form input node. 
// can be binded to some error node. 
// can receive validation rules which will be triggered on input || on submit.
class FormInput{

    #inputNode
    validationRules = [] // TODO private + getter

    constructor(inputSelector){ // TODO : deal with non existing input
        this.inputSelector = inputSelector
        this.#inputNode = document.querySelector(inputSelector) 
    }
    
    // self switching to error mode : style() + displaying related error node
    set errorMode(bool){
        if(bool){
            this.style='error'
            if(this.errorNode) this.errorNode.display=true
        }else{
            this.style='neutral'
            if(this.errorNode) this.errorNode.display=false
        }
    }

    get inputNode(){
        return this.#inputNode
    }

    get value(){
        return this.#inputNode.value
    }

    // set a style for the input. allowed values : 'error' || 'neutral' by default.
    set style(style){
        style === 'error' ? this.#inputNode.style.border="2px solid #FF4E60" : this.#inputNode.style.border="none"
    }

    bindErrorNode(errorNodeSelector){
        this.errorNode = new ErrorNode(errorNodeSelector)
    }

    addValidationRule(fn){
        this.validationRules.push(fn)
    }

    /* set validationRule(fn){
        this.validationRules.push(fn)
    }*/
}



//
// a reference to the HTML form
//
class Form{

    inputs

    constructor(formSelector){

        this.formNode = document.querySelector(formSelector)

        // instantiate the references to the form inputs
        this.inputs = {
            'firstname' : new FormInput('#first'),
            'lastname' : new FormInput('#last'),
            'email' : new FormInput('#email'),
            'birthdate' : new FormInput('#birthdate'),
            'tourney' : new FormInput('#quantity'),
            'locations' : new FormInput('#location1'),
            'conditions' : new FormInput('#checkbox1')
        }

        this.bindErrorNodestoRelatedInputs()
        this.addValidationRulesToInputs()
    }

    // pairing the right error nodes with the right inputs 
    bindErrorNodestoRelatedInputs(){ // try catch & throw error into binderrornode if queryselector doesn't find the node
        this.inputs['firstname']?.bindErrorNode('#prenomError')
        this.inputs['lastname']?.bindErrorNode('#nomError')
        this.inputs['email']?.bindErrorNode('#emailError')
        this.inputs['birthdate']?.bindErrorNode('#birthdateError')
        this.inputs['tourney']?.bindErrorNode('#tourneyError')
        this.inputs['locations']?.bindErrorNode('#locationsError')
        this.inputs['conditions']?.bindErrorNode('#conditionsError')
    }

    // set the right validation rules for each input
    addValidationRulesToInputs(){
        this.inputs['firstname']?.addValidationRule(() => Validators.isName(this.inputs['firstname'].value))
        this.inputs['lastname']?.addValidationRule(() => Validators.isName(this.inputs['lastname'].value))
        this.inputs['email']?.addValidationRule(() => Validators.isEmail(this.inputs['email'].value))
        this.inputs['birthdate']?.addValidationRule(() => Validators.isDate(this.inputs['birthdate'].value))
        this.inputs['tourney']?.addValidationRule(() => Validators.isBetween_0_and_99(this.inputs['tourney'].value))
        this.inputs['locations']?.addValidationRule(() => Validators.isOneRadioChecked('location'))
        this.inputs['conditions']?.addValidationRule(() => Validators.isBoxChecked(this.inputs['conditions'].inputNode))
    }

    // called to realtime validate an input (onchange / oninput)
    isInputValid(field){ // useCallback instead of errormode errorCallback ?
        const isValidationSuccessful = this.inputs[field]?.validationRules.reduce((accu, current) => {
            return (accu === false || current() === false) ? false : true
        }, true)

        // if validation fails, the input is switching to errorMode
        this.inputs[field].errorMode = false
        if(isValidationSuccessful === false) this.inputs[field].errorMode = true

        return isValidationSuccessful
    }

    // called when the form is submitted
    tryFormValidation(){
        //TODO preventdefault
        let isFormValidationSuccessful = true
        for (const key in this.inputs){
            const isInputValid =  this.isInputValid(key) // TODO rename isInputValid here nad in HTML
            if(isInputValid === false) isFormValidationSuccessful = false
        }
        
        if(isFormValidationSuccessful === false) return false

        switchModalContent()
        return false // return false despite validation successfull so the form isn't submitted
    }
}

const myForm = new Form("#reserve")
document.querySelector('#form-modalbody').addEventListener('submit', () => myForm.tryFormValidation())
document.querySelector('#first').addEventListener('input', () => myForm.isInputValid('firstname'))
document.querySelector('#last').addEventListener('input', () => myForm.isInputValid('lastname'))
document.querySelector('#email').addEventListener('input', () => myForm.isInputValid('email'))
document.querySelector('#birthdate').addEventListener('focusout', () => myForm.isInputValid('birthdate'))
document.querySelector('#quantity').addEventListener('input', () => myForm.isInputValid('tourney'))
document.querySelector('#location1').addEventListener('change', () => myForm.isInputValid('locations'))
document.querySelector('#location2').addEventListener('change', () => myForm.isInputValid('locations'))
document.querySelector('#location3').addEventListener('change', () => myForm.isInputValid('locations'))
document.querySelector('#location4').addEventListener('change', () => myForm.isInputValid('locations'))
document.querySelector('#location5').addEventListener('change', () => myForm.isInputValid('locations'))
document.querySelector('#location6').addEventListener('change', () => myForm.isInputValid('locations'))
document.querySelector('#checkbox1').addEventListener('change', () => myForm.isInputValid('conditions'))