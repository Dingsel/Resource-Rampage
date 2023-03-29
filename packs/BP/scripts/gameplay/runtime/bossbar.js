import { Player } from "@minecraft/server"

const { max, min, round } = Math
export class BossBarBuilder {
    /** @private */
    string
    /** @private */
    chars = 150
    /** @private */
    fill = 0
    /** @param {string} name The name of the boss bar.*/
    constructor(name) {
        this.name = name
        this.update()
    }
    /** @param {number} percentage A number between 0 and 100.*/
    setFill(percentage) {
        this.fill = percentage
        this.update()
        return this
    }
    clear() {
        this.fill = 0
        this.update()
        return this
    }
    /** @param {string} name The text to display in the boss bar.*/
    updateName(name) {
        this.name = name
        this.update()
        return this
    }
    /**
     * @param {Player} player 
     */
    show(player) {
        player.onScreenDisplay.setTitle(this.string)
        return this
    }
    /**
     * @private
     */
    update() {
        let { name, chars, fill } = this
        fill = min(max(0, fill), 100)
        const fullChars = round(chars * ((5 >= fill && fill != 0) ? 5 : fill) / 100)
        const emptyChars = chars - fullChars
        this.string = `boss.${"|".repeat(fullChars)}${",".repeat(emptyChars)}${name}`
    }
}