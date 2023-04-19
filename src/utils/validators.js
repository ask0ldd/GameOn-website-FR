// helper : grouping all validation fn
// TODO : still need to add the email validation fn
export class Validators {

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