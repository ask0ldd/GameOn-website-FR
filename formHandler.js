// helper : grouping all validation fn
// TODO : still need to add the email validation fn
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

// a reference to some DOM node containing a message error
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

    validationRules = []

    constructor(inputSelector){ // TODO : deal with non existing input
        this.inputSelector = inputSelector
        this.inputNode = document.querySelector(inputSelector) 
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

    // set a style for the input. allowed values : 'error' || 'neutral' by default.
    set style(style){
        style === 'error' ? this.inputNode.style.border="2px solid #FF4E60" : this.inputNode.style.border="none"
    }

    bindErrorNode(errorNodeSelector){
        this.errorNode = new ErrorNode(errorNodeSelector)
    }

    addValidationRule(fn){
        this.validationRules.push(fn)
    }
}

// a reference to the HTML form
class Form{

    constructor(formSelector){

        this.formNode = document.querySelector(formSelector)

        // instantiate the inputs which are parts of the form
        this.inputs = {
            'firstname' : new FormInput('#first'), // TODO : deal with non existing node
            'lastname' : new FormInput('#last'),
            'birthdate' : new FormInput('#birthdate'),
            'tourney' : new FormInput('#quantity'),
            'locations' : new FormInput('#location1'), // TODO : should be acquired through querySelectorAll on name
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
        this.inputs['firstname']?.addValidationRule((selector) => Validators.isName('#first')) // TODO : dangerous injection ?
        this.inputs['lastname']?.addValidationRule((selector) => Validators.isName('#last'))
        this.inputs['birthdate']?.addValidationRule((selector) => Validators.isDate('#birthdate'))
        this.inputs['tourney']?.addValidationRule((selector) => Validators.isBetween_0_and_99('#quantity'))
        this.inputs['locations']?.addValidationRule((selector) => Validators.isOneRadioChecked('location'))
        this.inputs['conditions']?.addValidationRule((selector) => Validators.isBoxChecked('#checkbox1'))
    }

    // called to realtime validate an input (onchange / oninput)
    inputValidation(field){
        const isValidationSuccessful = this.inputs[field]?.validationRules.reduce((accu, current) => {
            return (accu === false || current() === false) ? false : true
        }, true)

        // if validation fails, the input is switching to errorMode
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