import { InfoMapProperties } from "resources";
import { GameDatabase } from "utils";

const {
    parse, stringify, Array: { from: map, isArray }
} = {
    parse: JSON.parse.bind(JSON), stringify: JSON.stringify.bind(JSON), Array
};

system.events.gameInitialize.subscribe(() => {
    setInterval(() => {
        for (const player of world.getPlayers()) {

            player.onScreenDisplay.setTitle([
                ``,
                `Coins: ${global.infoMap.get(InfoMapProperties.coins)}`
            ].join('\n'))

        }
    }, 15)
});
export { };
