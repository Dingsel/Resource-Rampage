class Home {
    static structures = ["house_1", "house_2", "house_3"]
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

})