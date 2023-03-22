import { ActionFormData } from "@minecraft/server-ui";
import { Textures } from "resources";

export const Settings = new ActionFormData()
.title('from.settings.title')
.body('form.settings.body')
.button('Informations')
.button('Towers',Textures.IconTowers)
.button('Build New Wall', Textures.IconWall)
.button('form.close')


export const Informations = new ActionFormData()
.title('from.informations.title')
.button('form.close')