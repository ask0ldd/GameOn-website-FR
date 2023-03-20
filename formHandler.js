// helper grouping validating methods
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
        // !!! if date > current date
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

    validationRules = []

    constructor(inputSelector){ // gerer erreurs si input non existant
        this.inputSelector = inputSelector
        this.inputNode = document.querySelector(inputSelector) 
    }
    
    // if true : input highlighted + error message displayed
    set errorMode(bool){
        if(bool){
            this.style='error'
            if(this.errorNode) this.errorNode.display=true
            //this.errorNode?.display=true
        }else{
            this.style='neutral'
            if(this.errorNode) this.errorNode.display=false
            //this.errorNode?.display=false
        }
    }

    // values allowed for style : 'neutral' || 'error'
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

// class form
class Form{

    constructor(formSelector){

        this.formNode = document.querySelector(formSelector)

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

    // binds the right error nodes to the right inputs 
    bindErrorNodestoRelatedInputs(){
        this.inputs['firstname']?.bindErrorNode('#prenomError')
        this.inputs['lastname']?.bindErrorNode('#nomError')
        this.inputs['birthdate']?.bindErrorNode('#birthdateError')
        this.inputs['tourney']?.bindErrorNode('#tourneyError')
        this.inputs['locations']?.bindErrorNode('#locationsError')
        this.inputs['conditions']?.bindErrorNode('#conditionsError')
    }

    // gives each input its validation rules
    addValidationRulesToInputs(){
        this.inputs['firstname']?.addValidationRule((selector) => Validators.isName('#first')) // dependancy injection ?
        this.inputs['lastname']?.addValidationRule((selector) => Validators.isName('#last'))
        this.inputs['birthdate']?.addValidationRule((selector) => Validators.isDate('#birthdate'))
        this.inputs['tourney']?.addValidationRule((selector) => Validators.isBetween_0_and_99('#quantity'))
        this.inputs['locations']?.addValidationRule((selector) => Validators.isOneRadioChecked('location'))
        this.inputs['conditions']?.addValidationRule((selector) => Validators.isBoxChecked('#checkbox1'))
    }

    // called for realtime validation (onchange / oninput)
    inputValidation(field){
        // check if the input is passing all associated validation rules
        const isValidationSuccessful = this.inputs[field]?.validationRules.reduce((accu, current) => {
            return (accu === false || current() === false) ? false : true
        }, true)

        // if not, input is switching to errorMode
        if(isValidationSuccessful === false){
            this.inputs[field].errorMode = true
        } else
        {
            this.inputs[field].errorMode = false
        }

        return isValidationSuccessful
    }

    // called when form submitted
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