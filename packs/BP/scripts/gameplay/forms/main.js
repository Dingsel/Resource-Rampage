import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { Textures, TowerNames, TowerTypes, WallLevels } from "resources";

export const Settings = new ActionFormData()
.title('form.settings.title')
.body('form.settings.body')
.button('Informations')
.button('Towers',Textures.IconTowers)
.button('Build New Wall', Textures.IconWall)
.button('UI Settings', Textures.ColorPicker)
.button('form.close')

export const WallBuildSettings = new ModalFormData()
.title("form.wallBuild.title")
.dropdown("\n%form.wallBuild.dropdown \n§r\n",WallLevels.map((a,i)=>"Level " + i),0)

export const TowerPicker = new ModalFormData()
.title("form.pickTower.title")
.dropdown("\n%form.pickTower.dropdown \n§r\n",Object.getOwnPropertyNames(TowerTypes).map(k=>TowerNames[TowerTypes[k]]),0)

export const Informations = new ActionFormData()
.title('from.informations.title')
.button('form.close')