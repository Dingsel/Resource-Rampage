import { ActionFormData } from "@minecraft/server-ui";

export class MenuFormData extends ActionFormData{
    #actions;
    #onClose;
    constructor(){
        super();
        this.#actions = [];
        this.#onClose = ()=>{};
    }
    onClose(onClose){this.#onClose = onClose;}
    addAction(action,content,icon = undefined){
        this.#actions.push(action??(()=>undefined));
        this.button(...[content,icon]);
        return this;
    }
    async show(player){
        const {output,canceled} = await super.show(player);
        return canceled?(await this.#onClose(player)):(await this.#actions[output]?.(player));
    }
}