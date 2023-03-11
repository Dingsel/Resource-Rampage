import { Player, world } from "@minecraft/server"

Object.defineProperties(Player.prototype, {
    coins: {
        get() {
            return this.getDynamicProperty("coins")
        },
        set(value) {
            this.setDynamicProperty("coins", value)
        }
    },
    scores: {
        get() {
            const player = this
            return new Proxy({}, {
                get(_, property) {
                    try {
                        return world.scoreboard.getObjective(property).getScore(player.scoreboard)
                    } catch {
                        return NaN
                    }
                },
                set(_, property, value) {
                    player.runCommandAsync(`scoreboard players set @s "${property}" ${value}`)
                }
            })
        }
    }
})