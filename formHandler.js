// helper grouping all validation methods
// TODO : still need to add the email validation method
class Validators {

    // is the input value a name ?
    static isName(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const nameRegex =  new RegExp ("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$")
        return nameRegex.test(fieldValue)
    }

    // is the input value a number between 0 & 99 ?
    static isBetween_0_and_99(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const numberRegex = new RegExp ("^[0-9]{1,2}$")
        return numberRegex.test(fieldValue)
    }

    // is the input value a date ?
    static isDate(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const dateRegex = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$")
        // !!! TODO check if date > current date // should trigger a different message or invalid date is enough?
        return dateRegex.test(fieldValue)
    }

    // is one of the related radio buttons selected ?
    static isOneRadioChecked(radiosName){
        const radios = document.getElementsByName(radiosName)

        for (const radio of radios) {
            if (radio.checked) {
                return true
            }
        }

        return false
    }

    static isBoxChecked(checkBoxId){
        return document.querySelector(checkBoxId).checked
    }
}

// a representation of a error message container which is hard coded into the HTML file
// TODO : should extends the Node class instead?
class ErrorNode { // TODO : deal with non existing node

    constructor(nodeSelector) 
    {
        this.node = document.querySelector(nodeSelector)
    }

    set display(bool){
        bool ? this.node.style.display="block" : this.node.style.display="none"
    }

    set message(message){
        this.message = message
    }
}

// a representation of a form input coded into the HTML file
// TODO : should extends Node class instead?
class FormInput{

    // validation rules that this input must pass to not trigger an error on submit
    validationRules = []

    constructor(inputSelector){ // TODO : deal with non existing input
        this.inputSelector = inputSelector
        this.inputNode = document.querySelector(inputSelector) 
    }
    
    // switch an input to error mode : input style set to error + error node set to visible
    set errorMode(bool){
        if(bool){
            this.style='error'
            if(this.errorNode) this.errorNode.display=true
        }else{
            this.style='neutral'
            if(this.errorNode) this.errorNode.display=false
        }
    }

    // set a style for the input. allowed values : 'neutral' || 'error'. 'neutral' by default.
    set style(style){
        style === 'error' ? this.inputNode.style.border="2px solid #FF4E60" : this.inputNode.style.border="none"
    }

    // used to bind a specific error node to an input
    bindErrorNode(errorNodeSelector){
        this.errorNode = new ErrorNode(errorNodeSelector)
    }

    addValidationRule(fn){
        this.validationRules.push(fn)
    }
}

// a representation of the main form
class Form{

    constructor(formSelector){

        this.formNode = document.querySelector(formSelector)

        // instantiate the inputs which are parts of the form
        this.inputs = {
            'firstname' : new FormInput('#first'), // !!! deal with non existing node
            'lastname' : new FormInput('#last'),
            'birthdate' : new FormInput('#birthdate'),
            'tourney' : new FormInput('#quantity'),
            'locations' : new FormInput('#location1'), // !!! devrait etre recupere via name via querySelectorAll
            'conditions' : new FormInput('#checkbox1')
        }

        this.bindErrorNodestoRelatedInputs()
        this.addValidationRulesToInputs()
    }

    // binds all the right error nodes to the right inputs 
    bindErrorNodestoRelatedInputs(){
        this.inputs['firstname']?.bindErrorNode('#prenomError')
        this.inputs['lastname']?.bindErrorNode('#nomError')
        this.inputs['birthdate']?.bindErrorNode('#birthdateError')
        this.inputs['tourney']?.bindErrorNode('#tourneyError')
        this.inputs['locations']?.bindErrorNode('#locationsError')
        this.inputs['conditions']?.bindErrorNode('#conditionsError')
    }

    // set for each input the right validation rules
    addValidationRulesToInputs(){
        this.inputs['firstname']?.addValidationRule((selector) => Validators.isName('#first')) // dependancy injection ?
        this.inputs['lastname']?.addValidationRule((selector) => Validators.isName('#last'))
        this.inputs['birthdate']?.addValidationRule((selector) => Validators.isDate('#birthdate'))
        this.inputs['tourney']?.addValidationRule((selector) => Validators.isBetween_0_and_99('#quantity'))
        this.inputs['locations']?.addValidationRule((selector) => Validators.isOneRadioChecked('location'))
        this.inputs['conditions']?.addValidationRule((selector) => Validators.isBoxChecked('#checkbox1'))
    }

    // called at realtime validation (onchange / oninput)
    inputValidation(field){
        // check if the input is passing all associated validation rules
        const isValidationSuccessful = this.inputs[field]?.validationRules.reduce((accu, current) => {
            return (accu === false || current() === false) ? false : true
        }, true)

        // if not, the input is switching to errorMode
        if(isValidationSuccessful === false){
            this.inputs[field].errorMode = true
        } else
        {
            this.inputs[field].errorMode = false
        }

        return isValidationSuccessful
    }

    // called when the form submitted
    fullFormValidation(){

        let isFormValidationSuccessful = true
        for (const key in this.inputs){
            const inputValidation =  this.inputValidation(key)
            if(inputValidation === false) isFormValidationSuccessful = false
        }
        
        if(isFormValidationSuccessful === false) return false

        console.log('success')

    }
}

const myForm = new Form("#reserve")