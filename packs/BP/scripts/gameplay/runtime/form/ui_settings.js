import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { MainMenu } from "./default";
import { Textures, uiFormat } from "resources";

MainMenu.UI = {
    action:uisettings,
    content:"UI Settings",
    icon:Textures.ColorPicker
}


/**@param {Player}player */
async function uisettings(player) {
    const reset = () => player.getTags().forEach(t => t.match(/,ui/) && player.removeTag(t)),
        ui = player.getTags().find(t => t.match(/,ui/)) ?? uiFormat.reset,
        [a, b] = ui.split(','), { PaintBrush, ColorBrush, Reset, Back } = Textures,
        { output: S, canceled } = await new ActionFormData()
            .title('pack.description')
            .body(a + `Select an option below to customize this user interface as you please.`)
            .button(a + `Titles & Buttons`, PaintBrush)
            .button(a + `Content`, ColorBrush)
            .button(a.replace(/§k/g, '') + `Reset`, Reset)
            .button(a + `Back`, Back)
            .show(player);
    if (canceled) return;
    if (S == 2) return reset(), player.addTag(uiFormat.reset);
    if (S == 3) return;
    return Apply(player, [a, b, 'ui'], S);
}


async function Apply(player, ui, num) {
    const reset = () => player.getTags().forEach(t => t.match(/,ui/) && player.removeTag(t)),
        [a, b] = ui, type = ui[num], Colours = uiFormat.color,
        which = () => !num ? 'title & buttons' : 'content',
        CLRS = Object.keys(Colours),
        myClr = Object.values(Colours).findIndex(c => type.endsWith(c)),
        { formValues, canceled } = await new ModalFormData()
            .title(a.replace(/§k/g, '') + 'Customize ' + which())
            .toggle(b + `§lBold`, type.includes('§l'))
            .toggle(b + '§oItalic', type.includes('§o'))
            .toggle(b + `§kObfuscated`, type.includes('§k'))
            .toggle(b + '§´Special', type.includes('§´'))
            .dropdown(b + 'Color', CLRS, myClr)
            .show(player);
    if (canceled) return;
    let [B, i, o, s, cl] = formValues, clr = Colours[CLRS[cl]];
    ui[num] = (B ? '§l' : '') + (i ? '§o' : '') + (o ? '§k' : '') + (s ? '§´' : '') + clr;
    reset(); player.addTag(ui.join(','));
}