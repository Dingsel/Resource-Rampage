import { Player } from "@minecraft/server"

export class BossBarBuilder {
    chars = 150
    fill = 0
    constructor(name) {
        this.name = name
    }
    setFill(percentage) {
        this.fill = percentage
    }
    clear() {
        this.fill = 0
    }
    updateName(name) {
        this.name = name
    }
    /**
     * @param {Player} player 
     */
    show(player) {
        const fullChars = Math.round(this.chars * ((5 >= this.fill && this.fill != 0) ? 5 : this.fill) / 100)
        const emptyChars = this.chars - fullChars
        player.onScreenDisplay.setTitle(`boss.${"|".repeat(fullChars)}${",".repeat(emptyChars)}${this.name}`)
    }
}