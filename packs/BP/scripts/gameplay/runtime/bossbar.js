import { Player } from "@minecraft/server"

export class BossBarBuilder {
    /** @private */
    chars = 150
    /** @private */
    fill = 0
    /** @param {string} name The name of the boss bar.*/
    constructor(name) {
        this.name = name
    }
    /** @param {number} percentage A number between 0 and 100.*/
    setFill(percentage) {
        this.fill = percentage
        return this
    }
    clear() {
        this.fill = 0
        return this
    }
    /** @param {string} name The text to display in the boss bar.*/
    updateName(name) {
        this.name = name
        return this
    }
    /**
     * @param {Player} player 
     */
    show(player) {
        const fill = Math.min(Math.max(0, this.fill), 100)
        const fullChars = Math.round(this.chars * ((5 >= fill && fill != 0) ? 5 : fill) / 100)
        const emptyChars = this.chars - fullChars
        player.onScreenDisplay.setTitle(`boss.${"|".repeat(fullChars)}${",".repeat(emptyChars)}${this.name}`)
        return this
    }
}