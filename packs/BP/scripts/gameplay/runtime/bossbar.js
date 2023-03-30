import { Player } from "@minecraft/server"

const { max, min, round } = Math
export class BossBarBuilder {
    useSecondary = false
    /** @private */
    string
    /** @private */
    chars = 150
    /** @private */
    fill = 0
    /** @private */
    fill2 = 0
    constructor(useSecondary = false) {
        this.useSecondary = useSecondary
        this.update()
    }
    /** @param {number} percentage A number between 0 and 100.*/
    setFill(percentage) {
        this.fill = percentage
        this.update()
        return this
    }
    setSecondaryFill(percentage) {
        this.fill2 = percentage
        this.update()
        return this
    }
    clear() {
        this.fill = 0
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
    /** @private*/
    update() {
        let { chars, fill, fill2, useSecondary } = this
        fill = min(max(0, fill), 100)
        const fullChars = round(chars * ((5 >= fill && fill != 0) ? 5 : fill) / 100)
        const emptyChars = chars - fullChars

        if (useSecondary) {
            fill2 = min(max(0, fill2), 100)
            const fullChars2 = round(chars * ((5 >= fill2 && fill2 != 0) ? 5 : fill2) / 100)
            const emptyChars2 = chars - fullChars

            this.string = `boss.${"|".repeat(fullChars)}${",".repeat(emptyChars)}c${"|".repeat(fullChars2)}${",".repeat(emptyChars2)}`
        } else {
            this.string = `boss.${"|".repeat(fullChars)}${",".repeat(emptyChars)}`
        }
    }
}