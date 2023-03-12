import {FormResponse, ModalFormResponse} from '@minecraft/server-ui';

Object.defineProperties(FormResponse.prototype, {
    output:{
        get(){
            if(this instanceof ModalFormResponse) return this.formValues;
            return this.selection;
        }
    }
});