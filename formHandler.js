// helper : grouping all validation fn
// TODO : still need to add the email validation fn
class Validators {

    static isName(inputNode){
        //const fieldValue = document.querySelector(fieldId).value.trim()
        const inputValue = inputNode.value.trim()
        const nameRegex =  new RegExp ("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$")
        return nameRegex.test(inputValue)
    }

    static isBetween_0_and_99(inputNode){
        const inputValue = inputNode.value.trim()
        const numberRegex = new RegExp ("^[0-9]{1,2}$")
        return numberRegex.test(inputValue)
    }

    static isDate(inputNode){
        const inputValue = inputNode.value.trim()
        const dateRegex = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$")
        const isDateYetToCome = (Date.parse(inputValue) - Date.now()) > 0
        return dateRegex.test(inputValue) && isDateYetToCome
    }

    static isEmail(inputNode){
        const inputValue = inputNode.value.trim()
        const emailRegex = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
        return emailRegex.test(inputValue)
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
    validationRules = []

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
}



//
// a reference to the HTML form
//
class Form{

    constructor(formSelector){

        this.formNode = document.querySelector(formSelector)

        // instantiate the references to the form inputs
        this.inputs = {
            'firstname' : new FormInput('#first'), // TODO : deal with non existing node
            'lastname' : new FormInput('#last'),
            'email' : new FormInput('#email'),
            'birthdate' : new FormInput('#birthdate'),
            'tourney' : new FormInput('#quantity'),
            'locations' : new FormInput('#location1'), // TODO : should be acquired through querySelectorAll (on name)
            'conditions' : new FormInput('#checkbox1')
        }

        this.bindErrorNodestoRelatedInputs()
        this.addValidationRulesToInputs()
    }

    // pairing the right error nodes with the right inputs 
    bindErrorNodestoRelatedInputs(){
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
        this.inputs['firstname']?.addValidationRule(() => Validators.isName(this.inputs['firstname'].inputNode))
        this.inputs['lastname']?.addValidationRule(() => Validators.isName(this.inputs['lastname'].inputNode))
        this.inputs['email']?.addValidationRule(() => Validators.isEmail(this.inputs['email'].inputNode))
        this.inputs['birthdate']?.addValidationRule(() => Validators.isDate(this.inputs['birthdate'].inputNode))
        this.inputs['tourney']?.addValidationRule(() => Validators.isBetween_0_and_99(this.inputs['tourney'].inputNode))
        this.inputs['locations']?.addValidationRule(() => Validators.isOneRadioChecked('location'))
        this.inputs['conditions']?.addValidationRule(() => Validators.isBoxChecked(this.inputs['conditions'].inputNode))
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

    // called when the form is submitted
    fullFormValidation(){

        let isFormValidationSuccessful = true
        for (const key in this.inputs){
            const inputValidation =  this.inputValidation(key)
            if(inputValidation === false) isFormValidationSuccessful = false
        }
        
        if(isFormValidationSuccessful === false) return false

        switchModalContent()
        return false // return false despite validation successfull so the form isn't submitted
    }
}

const myForm = new Form("#reserve")