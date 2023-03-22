import { ActionFormData } from "@minecraft/server-ui";

export const Settings = new ActionFormData()
.title('from.settings.title')
.body('form.settings.body')
.button('Informations')
.button('Towers',"textures/icons/mageTower_1.png")
.button('Build wall')
.button('form.close')


export const Informations = new ActionFormData()
.title('from.informations.title')
.button('form.close')