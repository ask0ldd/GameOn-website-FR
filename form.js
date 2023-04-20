import { Validators } from "./src/utils/validators.js"
import FormInput from "./src/components/formInput.js"
import modal from "./modal.js"

class Form{

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
        this.inputs['firstname']?.addValidationRule(() => Validators.isName(this.inputs['firstname'].value))
        this.inputs['lastname']?.addValidationRule(() => Validators.isName(this.inputs['lastname'].value))
        this.inputs['email']?.addValidationRule(() => Validators.isEmail(this.inputs['email'].value))
        this.inputs['birthdate']?.addValidationRule(() => Validators.isDate(this.inputs['birthdate'].value))
        this.inputs['tourney']?.addValidationRule(() => Validators.isBetween_0_and_99(this.inputs['tourney'].value)) // soutenance passing value
        this.inputs['locations']?.addValidationRule(() => Validators.isOneRadioChecked('location')) // soutenance passing
        this.inputs['conditions']?.addValidationRule(() => Validators.isBoxChecked(this.inputs['conditions'].inputNode)) // soutenance passing node
    }

    // called to realtime validate an input (onchange / oninput)
    doesInputPassValidation(field){ // useCallback instead of errormode errorCallback ?
        const isValidationSuccessful = this.inputs[field]?.validationRules.reduce((accu, current) => { // soutenance multiple rules
            return (accu === false || current() === false) ? false : true
        }, true)

        // if validation fails, the input is switching to errorMode
        this.inputs[field].errorMode = false
        if(isValidationSuccessful === false) this.inputs[field].errorMode = true

        return isValidationSuccessful
    }

    // called when the form is submitted
    tryFormValidation(e){
        e.preventDefault()
        e.stopPropagation()
        let isFormValidationSuccessful = true
        for (const key in this.inputs){
            const doesInputPassValidation =  this.doesInputPassValidation(key)
            if(doesInputPassValidation === false) isFormValidationSuccessful = false
        }
        
        if(isFormValidationSuccessful === false) return false

        modal.switchContent()
        return false // return false despite the validation being successfull so the form isn't submitted
    }
}

// init
const myForm = new Form("#reserve")

inputsListenersSetup()

function inputsListenersSetup(){
    document.querySelector('#form-modalbody').addEventListener('submit', (e) => myForm.tryFormValidation(e))
    document.querySelector('#first').addEventListener('input', () => myForm.doesInputPassValidation('firstname'))
    document.querySelector('#last').addEventListener('input', () => myForm.doesInputPassValidation('lastname'))
    document.querySelector('#email').addEventListener('input', () => myForm.doesInputPassValidation('email'))
    document.querySelector('#birthdate').addEventListener('focusout', () => myForm.doesInputPassValidation('birthdate'))
    document.querySelector('#quantity').addEventListener('input', () => myForm.doesInputPassValidation('tourney'))
    for(let i = 1; i<7; i++){
        document.querySelector('#location'+i).addEventListener('change', () => myForm.doesInputPassValidation('locations'))
    }
    document.querySelector('#checkbox1').addEventListener('change', () => myForm.doesInputPassValidation('conditions'))
}

export default myForm