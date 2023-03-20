import './extensions/import.js';
import "./global.js"
import './gameplay/index.js';
import './tests/import.js';

system.events.gameInitialize.subscribe(()=>{
    setInterval(() => {for (const player of world.getPlayers()) player.onScreenDisplay.setActionBar(`Coins: ${coins}`)}, 1)
});

//iblqzed
//conmaster
//m9