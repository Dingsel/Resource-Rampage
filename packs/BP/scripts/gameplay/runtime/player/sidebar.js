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
                `Coins: ${coins}`
            ].join('\n'))

        }
    }, 1)
});

export { };
