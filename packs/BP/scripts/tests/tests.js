import { ScriptEventCommandMessageEvent } from "@minecraft/server";
import {ActionFormData} from '@minecraft/server-ui';

/**@type {[k: string]:(arg: ScriptEventCommandMessageEvent)=>boolean } */
export const tests = {
    async show_end_form(data){
        let form = new ActionFormData();
        form.title("§0§1§rThe Title") //§0§1 is prefix for conditional rendering
        form.body("The details multiline")
        form.button("The Close Button");
        await nextTick;
        form.show(data.sourceEntity);
        return true;
    }
}