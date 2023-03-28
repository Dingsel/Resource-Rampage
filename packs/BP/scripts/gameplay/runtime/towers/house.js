class Home {
    static structures = {
        "house_1": {
            coins : 1000,
            wood : 250
        },
        "house_2": {
            coins : 2000,
            wood : 500,
            stone : 250
        },
        "house_3": {
        }
    }
    /**@private */
    static upgradeCallbacks = []
    /** @param {function(number):void} callback */
    static onUpgrade(callback) {
        this.upgradeCallbacks.push({ callback: callback })
    }
    upgrade() {
        tier++
        this.upgradeCallbacks.forEach(x => x(tier))
    }
}


Home.onUpgrade((level) => {
    const entries = Object.entries(Home.structures)
    const structureId = entries[level][0]
    if (!structureId) return
})