// helper regrouping validating methods
class Validators {

    // is the passed field value a name ?
    static isName(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const nameRegex =  new RegExp ("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$")
        return nameRegex.test(fieldValue)
    }

    // is the passed field value a number between 0 & 99 ?
    static isBetween_0_and_99(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const numberRegex = new RegExp ("^[0-9]{1,2}$")
        return numberRegex.test(fieldValue)
    }

    // is the passed field value a date ?
    static isDate(fieldId){
        const fieldValue = document.querySelector(fieldId).value.trim()
        const dateRegex = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$")
        return dateRegex.test(fieldValue)
    }

    // is one of the radio buttons selected ?
    static isOneRadioChecked(radiosName){
        const radios = document.getElementsByName(radiosName)

        for (const radio of radios) {
            if (radio.checked === true) {
                return true
            }
        }

        return false
    }

    static isBoxChecked(checkBoxId){
        // happens before the update of the checkbox, so inversion needed
        return !document.querySelector(checkBoxId).checked
    }
}

// class errorNode
class ErrorNode { // gerer erreurs si nodes non existant

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

class FormInput{
    inputNode // the node of the input
    errorNode // the node of the error message
    inputSelector //
    validationRules = []

    constructor(inputSelector){
        this.inputSelector = inputSelector
        this.inputNode = document.querySelector(inputSelector) // gerer erreurs si input non existant
        /*if(errorNodeSelector) this.addErrorNode(errorNodeSelector)*/
    }
    
    set errorMode(bool){
        if(bool){
            this.style='error'
            if(this.errorNode) this.errorNode.display=true
        }else{
            this.style='neutral'
            if(this.errorNode) this.errorNode.display=false
        }
    }

    set style(style){ // style can be neutral or error
        style === 'error' ? this.inputNode.style.border="2px solid #FF4E60" : this.inputNode.style.border="none"
    }

    setErrorNode(errorNodeSelector){
        this.errorNode = new ErrorNode(errorNodeSelector)
    }

    addValidationRule(fn){
        this.validationRules.push(fn)
    }
}

// class form
class Form{

    constructor(formSelector){

        // this.formNode = document.querySelector(formSelector)

        this.inputs = {
            'firstname' : new FormInput('#first'), // deal with non existing node
            'lastname' : new FormInput('#last'),
            'birthdate' : new FormInput('#birthdate'),
            'tourney' : new FormInput('#quantity'),
            'conditions' : new FormInput('#checkbox1')
        }

        this.pairErrorNodesWithRelatedInputs()
        this.addValidationRulesToInputs()
    }

    pairErrorNodesWithRelatedInputs(){
        this.inputs['firstname']?.setErrorNode('#prenomError')
        this.inputs['lastname']?.setErrorNode('#nomError')
        this.inputs['birthdate']?.setErrorNode('#birthdateError')
        this.inputs['tourney']?.setErrorNode('#tourneyError')
        this.inputs['conditions']?.setErrorNode('#conditionsError')
    }

    addValidationRulesToInputs(){
        this.inputs['firstname']?.addValidationRule((inputSelector) => Validators.isName('#first'))
        this.inputs['lastname']?.addValidationRule((inputSelector) => Validators.isName('#last'))
        this.inputs['birthdate']?.addValidationRule((inputSelector) => Validators.isDate('#birthdate'))
        this.inputs['tourney']?.addValidationRule((inputSelector) => Validators.isBetween_0_and_99('#quantity'))
        this.inputs['locations']?.addValidationRule((inputSelector) => Validators.isOneRadioChecked('location'))
        this.inputs['conditions']?.addValidationRule((inputSelector) => Validators.isBoxChecked('#checkbox1'))
    }

    inputValidation(field){

        const isValidationSuccessful = this.inputs[field]?.validationRules.reduce((accu, current) => {
            return (accu === false || current() === false) ? false : true
        }, true)

        if(isValidationSuccessful === false){
            this.inputs[field].errorMode = true
        } else
        {
            this.inputs[field].errorMode = false
        }
    }

    formValidation(){
        // preventdefault
        return false
    }
}

const myForm = new Form("#reserve")