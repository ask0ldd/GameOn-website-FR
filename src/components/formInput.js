import ErrorNode from "./errorNode.js"

// a reference to some DOM form input node. 
// can be binded to some error node. 
// can receive validation rules which will be triggered on input || on submit.
export default class FormInput{

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

    bindErrorNode(errorNodeSelector){
        this.errorNode = new ErrorNode(errorNodeSelector)
    }

    addValidationRule(fn){
        this.validationRules.push(fn)
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

    /* set validationRule(fn){
        this.validationRules.push(fn)
    }*/
}