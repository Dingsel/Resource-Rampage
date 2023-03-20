import { world } from "@minecraft/server";
import { Base, DataBaseSessions } from "utils.js";
import { promise } from './enchantments_load.js';

const {overworld} = world;
let inventory = null, database = null;
async function loadDB(){
    await promise;
    let e = null;
    for (const entityDB of overworld.getEntities({type:"dest:world_db"})){
        if(e) {
            console.log("killing entity");
            entityDB.kill(); continue;
        }
        e=entityDB;
    }
    if(!e){
        e = overworld.spawnEntity("dest:world_db",{x:0,y:-64,z:0});
    }
    inventory = e.inventory;
    try {
        database = new Base(inventory);
        const session = await database.getSession(DataBaseSessions.Testing);
        if(!session.has('test')) session.set("test",0);
        const test = session.get("test");
        const n = Date.now();
        console.log(session.get("test2").substring(0,100));
        for (let i = 0; i < 100; i++) {
            session.set("test", test + 1);
            session.set("test2",test_text)
        }
        console.log("db_test: ", test);
        console.log("100x in ",Date.now() - n,"ms");
    } catch (error) {
        errorHandle(error);
    }

}
export const promise = loadDB();

const test_text = `The latest Minecraft update has arrived! This release brings several quality of life improvements to the game, changes to horse breeding, plus early versions of Archaeology and the Sniffer as new experimental features from the upcoming 1.20 update. Let’s see what’s inside!

Fixed multiple crashes that could occur during gameplay
When breeding horses, the baby horse now has a chance of being better than its parents in speed, jump strength, and health
Improvements to player emotes
Take an early look at archaeology and the sniffer mob with experimental features
Fixes to over 30 community-reported issues
Please continue to upvote and report any new bugs at bugs.mojang.com and leave us your feedback at feedback.minecraft.net.

patchnotes_r19u7.png

Changes:

Player Emotes

Several improvements have come to the emote system in Bedrock Edition!

Emote usage now appears in chat
The emote wheel now has four slots with an improved interface
Quick emoting with new hotkeys
Easier sorting of emotes
Creating a new character now automatically applies four default emotes
Check out the New Emote Features for Bedrock Edition article for more details.


Vanilla Parity:

Improvements have been made with vanilla parity to align with Java Edition, especially with horse breeding, mobs, and blocks.

Gameplay

Fixed an issue where night could not be skipped if one or more players were on the death screen
Eating and drinking animations are now always centered, regardless of screen aspect ratio
Mobs

Breeding horses can now produce random variants (MCPE-129071)
When breeding horses, the baby Horse now has a chance of being better than its parents in speed, jump strength, and health. This change is intended to make Horse breeding a viable way of getting great Horses, if a player starts with good parents and puts in enough time and Golden Carrots
Horses cannot be pushed over Fences covered by Carpets anymore (MCPE-164717)
Ghasts’ sound volume will now fade the further they are from the player (MCPE-35222)
Villagers will now emit anger particles when hit by a player outside of a village
Fixed a bug where Zombified Piglins would spawn in the Nether in light levels above 11
Minecarts can now eject mobs into liquid blocks (MCPE-120078)
Witches will now drink a Fire Resistance Potion when standing on a Campfire
Blocks

Bells that are connected to multiple blocks no longer drop when one block is broken
Note Block sound attenuation over a distance is now linear (MCPE-164935)
Impact sounds of projectiles on Amethyst blocks and clusters are now audible
Dead Bush will now drop Sticks when broken with any tool except Shears, even those with the Silk Touch enchantment. Vines will drop nothing in the same situation (MCPE-163246)

Experimental Features:

The Sniffer and Archaeology are now available for testing that are coming to Minecraft 1.20, now known as Trails & Tales! The sniffer and archeology are two experimental features that you can try out in this release.

As these features are still incomplete, in development, and considered a work in progress, be sure to backup your worlds before enabling experimental features. The features can be enabled by turning on the “Next Major Update” toggle in world settings.

Archaeology

Added the Brush item
Added the Decorated Pot block
Added four Pottery Shards (Arms Up, Skull, Prize, and Archer)
Added the Suspicious Sand block
Added Suspicious Sand to the Desert Temple
Added Suspicious Sand to the Desert Well
Brush

The Brush is a craftable item you can use to brush things
Pottery Shards and Decorated Pots

Pottery Shards have pictures on them. They cannot be crafted and must be found in the world. Hint: you will need a Brush! By crafting four of these together you can create a Decorated Pot with a picture on each side.
You can also use Brick items instead of Pottery Shards in the crafting recipe. The sides that were made from Brick items will not have pictures.
Smash a Decorated Pot with any block-breaking tool to break it apart and get the Pottery Shards back! Or hit it with your fist to pick up the pot without breaking it.
Suspicious Sand

Desert Temples and Desert Wells now contain Suspicious Sand. This fragile block is hard to spot and easy to destroy, so be careful!
If you manage to find the Suspicious Sand and brush it with your Brush, you will extract objects that were buried long ago.
We're giving you an early look at these Archaeology features. We want to spend more time developing them. Please let us know where you think we can improve or expand!
Sniffer

The Sniffer is the mob vote winner of Minecraft Live 2022 and the first [HS1] extinct mob brought to life and added to the game
Sniffers cannot be tempted or tamed
Sniffers are passive friendly mobs
Sniffer sniffs in the air and occasionally dig for seeds
Torchflower

The Torchflower seed can be planted on farmland and grows into a flower
The seed can be used to breed two Sniffers
The full-grown flower can be harvested and replanted but can also be crafted into a dye

Fixes:

Stability and Performance

Fixed an issue where simultaneously pressing the "Mine" and "Place" button on any input device while targeting a Structure Block could cause the game to crash (MCPE-155689)
Fixed a crash on Nintendo Switch when attempting to log in while set to local network mode
Fixed a crash that could occur when entering a 1.7.1.0 world in 1.8 or above (MCPE-165564)
Gameplay

The player's crosshair now properly mines/interacts with items in front of them while swimming/gliding, rather than 1 block above their position (MCPE-57257)
Players no longer take rapid damage when touching damaging blocks (MCPE-165347)
Projectiles shot while swimming/gliding no longer spawn from above the player's position (MCPE-31896)
Items dropped while swimming/gliding, manually or on death, no longer spawn from above the player's position (MCPE-31896)
Mobs

Fixed a bug where an Allay holding a Lead wasn't able to be leashed unless the player held a full stack of 64 Leads in hand
Parrots will no longer shake while on a player riding a Horse that is turning mid-jump
Fixed a bug causing global entities (e.g. Ender Dragon and projectiles) to stop rendering when out of normal entity render distance (MCPE-161136)
Blocks

Sounds from all Button types and Lever are now controlled by "Blocks" slider in Audio Settings (MCPE-166420)
Redstone source can now power a single block from different sides at the same time (MCPE-163651)
Destroying Mangrove Log or Mangrove Wood now properly cause leaves to decay
End Crystals occupying the same space as a block will no longer cause that block to disappear
Players are now able to place top Slabs in blocks that are only partially blocked by an entity (MCPE-155016)
Players can no longer see through partial blocks when sneaking or riding in third person (MCPE-156273)
Composter now always consumes an item when becoming full (MCPE-162020)
Importing experimental blocks into a non-experimental world using the Structure Block will now correctly place unknown blocks, which are not interactable
Error messages about building outside the world height limits no longer appear when simply interacting with blocks at the world height limits from certain angles (MCPE-152935)
Fixed a bug where Observers would not detect changes due to corrupted data (MCPE-150506)
Hoppers now pull in items from above them through all blocks that have a lower height than a full block (MCPE-55824)
Items

Crossbows now shake while charging arrows (MCPE-152952)
Spawn eggs for Snow Golem, Wither, and Trader Llama now appear correctly in the inventory and hotbar
Written Books can now be moved in the inventory even when the player has identical Written Books
Touch Controls

Updated the How to Play screen with information on new touch controls
Changing input modes from Gamepad to Touch while an item is selected will return the selected to the inventory or drop it
Fixed an issue on the Furnace screen where double-tapping the output window caused other slots to become unselectable (MCPE-164589)
Fixed a bug where stack splitting was automatically initiated on the first slot when opening a small Chest
Allowed left and right D-pad buttons to keep input when the forward button is pressed (MCPE-155199)
Added the leave Boat button when the player falls from a height within in the Boat (MCPE-158489)
Fixed an issue that prevented players from removing equipped armor by tapping on an item or block in the Creative inventory (MCPE-165790)
Tweaked the keyboard interaction on Android devices for text input fields
User Interface

Fixed an issue where the "Mine" tooltip was appearing when targeting a block with a Trident in Creative game mode (MCPE-44846)
Navigating right with controller left stick on the Marketplace sidebar now collapses it
Added a new 'Marketplace' icon to the Marketplace screen sidebar
Ocean Explorer, Woodland Explorer, and Treasure Maps now show the proper icon in the inventory (MCPE-163464)
Fixed a bug where mouse scrolling on the Friend Options dropdown would not scroll the dropdown contents
Resolved an issue where graphical elements of the Sign-In/Sign-Up screen could extend beyond the bounds of the dialog container
When starting a new world in Pocket UI, removed the "Press Open Chat to open chat" message for players with text-to-speech turned off
Double-clicking on the Furnace output slot will no longer drop the item (MCPE-165079)
Fixed a bug where moving the player or camera with a controller while text-to-speech for UI was turned on would cause the narrator to say "X of Y"
Fixed a bug where the Edit World screen couldn't be opened for a world if the corresponding world directory had a space in it (MCPE-166763)
The loading screen no longer flickers when entering the Nether in immersive VR mode
The swap item animation now plays when switching hotbar items of the same type with the same durability
Spectator Mode

Phasing through blocks in third person view no longer makes the camera zoom in and out towards the player’s head (MCPE-160467)
End Gateways can no longer be used in Spectator Mode (MCPE-165689)
Realms

Added a Sign In button on the Realms screen if player is not yet signed in
Fixed the issue that the "Find Friends" button and the "Close Realm" buttons would be autofocused when the "Members" or "Subscription" tab was clicked
Fixed a bug where players were not able to create another world on Realms if the first Create World on Realms attempt was interrupted
Fixed a bug where players could see duplicate applied packs with unknown titles the first time they entered the Realms settings screen
Resetting a Realms World now correctly updates the World settings
Removed the Close button in the Play on Realm popup dialog when using controllers
Updated the reset/replace world confirmation text to make it clearer what each function does
Fixed the world list not updating with a new Realm immediately after accepting an invite
In Realms Settings->Members, the dropdown '...' menu can now be open/closed with the Enter key and navigated with arrow keys

Technical Updates:

Updated Add-On Template Packs

Updated Add-On templates for 1.19.70 with new resources, behaviors, and documentation are available to download at aka.ms/MCAddonPacks
General

Behavior packs with scripts can now be removed from worlds
Item loot table conditions are no longer ignored in-game when used inside functions (MCPE-164582)
Carrots now display the proper name in item tooltips when used in can_place_on and can_destroy item components (MCPE-160838)
In JSON formats 1.19.70 and later, blocks fail to load if the "condition" field in Block Permutations is not a valid Molang string
Crafting Table component no longer appends "tile." when defaulting to use block name for crafting table label
Wool Blocks

Wool has been flattened into separate blocks, namely:

white_wool
orange_wool
magenta_wool
light_blue_wool
yellow_wool
lime_wool
pink_wool
gray_wool
light_gray_wool
cyan_wool
purple_wool
blue_wool
brown_wool
green_wool
red_wool
black_wool
Commands, recipes, loot tables, etc. will still work with wool and an aux value or color state, but wool will not be suggested in the command prompt. Instead, the new wool block names will.

Commands

Fixed a crash with deferred command execution when the executing actor is removed before execution (MCPE-165374)
Summon command no longer causes some entities to be spawned in at an angle
Removed support for field "data" in commands /clone, /execute, /fill, /setblock and /testforblock beyond version 1.19.70, eg. /setblock ~ ~ ~ minecraft:wool 1 will only have its equivalent /setblock ~ ~ ~ minecraft:wool ["color":"orange"] supported
Here are some additional examples[JW1] [JW2] [JW3] :
/setblock ~~~ green_wool [] [] is equivalent to the old 0
/setblock ~~~ wood ["wood_type": "oak"]
/setblock ~~~ coral ["dead_bit" : true , "coral_color" : "blue" ]
/setblock ~~~ coral_fan ["coral_fan_direction" : 1, "coral_color" : "pink"]
/setblock ~~~ wool ["color": "blue"]
/fill ~ ~ ~ ~5 ~5 ~5 gold_block [] replace airets items that can be fed to the entity
Removed property dropItems
Removed property feedItems
EntityBreathableComponent
Added function getBreatheBlocks(): BlockPermutation[] - Gets blocks entity can breathe in
Added function getNonBreatheBlocks(): BlockPermutation[] - Gets blocks entity can't breathe in
Removed property breatheBlocks
Removed property nonBreatheBlocks
EntityHealableComponent
Added function getFeedItems(): FeedItem[] - Gets healing items for the EntityHealableComponent
Removed property items
Converted EntityHitInformation to an interface
EntityRideableComponent
Added function getFamilyTypes(): string[] - Gets supported rider entity types
Added function getSeats(): Seat[] - Gets rider information for each seat
Removed property familyTypes
Removed property seats
EntityTameableComponent
Added function getTameItems(): string[] - Gets tame items of the EntityTameableComponent
Removed property tameItems
FeedItem
Added function getEffects(): FeedItemEffect[] - Gets effect of the FeedItem
Removed property effects
IntBlockProperty
Added function getValidValues(): number[] - Gets all valid integer values for the IntBlockProperty
Removed property validValues
ItemDurabilityComponent
Added function getDamageRange(): NumberRange - Gets the range of numbers that describes the chance of the item losing durability
Removed property damageRange
Converted NumberRange to an interface
ProjectileHitEvent
Added function getBlockHit(): BlockHitInformation - Gets block hit information from the ProjectileHitEvent
Added function getEntityHit(): EntityHitInformation - Gets entity hit information from the ProjectileHitEvent
Removed property blockHit
Removed property entityHit
StringBlockProperty
Added function getValidValues(): string[] - Gets all valid string values for the StringBlockProperty
Removed property validValues
ItemStack
ItemStack can now be constructed using a string identifier
Removed constructor parameter data
Removed property data
Removed function clearLore - To clear lore, call setLore with an empty array or undefined
Setting nameTag to an empty string will now clear the name tag
Setting nameTag to a string longer than 255 characters will now result in an exception
Setting amount greater than the maximum stack size will now clamp the value to the maximum stack size
Setting amount to a value less than 1 will now result in an exception
Item lore can now be cleared by calling setLore(undefined) or setLore([])
Fixed a bug where calling function ItemStack.getComponent or ItemStack.getComponents would fail on ItemStacks returned from EntityItemComponent.itemStack
Added read-only property getMaxAmount: number - Returns the maximum stack size for the item
Added read-only property isStackable: bool - Returns whether the item is stackable
Added function isStackableWith(itemStack: ItemStack): bool - Returns whether the item can be stacked with the given item
Added read-only property type: ItemType - Returns the type of the item
Added function clone(): ItemStack - Returns a copy of the item stack
Added property keepOnDeath: bool - Sets whether the item is kept on death
Added property lockMode: ItemLockMode - Sets whether the item can be moved or dropped
Added function setCanPlaceOn(blockIdentifiers?: string[]) - Sets which blocks the item can be placed on
Added function setCanDestroy(blockIdentifiers?: string[]) - Sets which blocks this item can destroy
ContainerSlot
Removed function clearItem - To clear the item, call setItem with undefined
Removed function clearLore - To clear lore, call setLore with an empty array or undefined
General changes to more consistently use methods when working with simple data-only objects vs. properties:

BeforeExplosionEvent
Added function getImpactedBlocks(): Vector3[] - Gets the blocks locations that are impacted the by the explosion
Added function setImpactedBlocks(blocks: Vector3[]): void - Sets the blocks locations that are impacted the by the explosion
Removed property impactedBlocks
BeforeItemUseOnEvent
Added function getBlockLocation(): Vector3 - Gets the location of the block being impacted
Removed property blockLocation
BlockInventoryComponent
Removed property location
BlockLavaContainerComponent
Removed property location
BlockPistonComponent
Added function getAttachedBlocks(): Vector3[] - Gets the blocks locations that are impacted by the activation of this piston
Removed property attachedBlocks
Removed property location
BlockPotionContainerComponent
Removed property location
BlockRecordPlayerComponent
Removed property location
BlockSignComponent
Removed property location
BlockSnowContainerComponent
Removed property location
BlockWaterContainerComponent
Removed property location
Added function getHeadLocation(): Vector3 - Gets the head location of the Entity
Removed property headLocation
ExplosionEvent
Added function getImpactedBlocks(): Vector3[] - Gets the blocks locations that are impacted the by the explosion
Removed property impactedBlocks
ItemStartUseOnEvent
Added function getBlockLocation(): Vector3 - Gets the location of the block being impacted
Added function getBuildBlockLocation(): Vector3 - Gets the location of the resulting build block
Removed property blockLocation
Removed property buildBlockLocation
ItemStopUseOnEvent
Added function getBlockLocation(): Vector3 - Gets the location of the block being impacted
Removed property blockLocation
ItemUseOnEvent
Added function getBlockLocation(): Vector3 - Gets the location of the block being impacted
Removed property blockLocation
NavigationResult
Added function getPath(): Vector3[] - Gets the locations of the blocks that comprise the navigation route
Removed property path
Player
Added function getHeadLocation(): Vector3 - Gets the head location of the Player
Removed property headLocation
Block
Added function isAir - Returns if the block is an air block (i.e. empty space)
Added function isLiquid - Returns if the block is a liquid (e.g., a water block and a lava black are liquid, while an air block and a stone block are not)
Added function isSolid - Returns if the block is solid (e.g., a cobblestone block and a diamond block are solid, while a ladder block and a fence block are not)
The following blocks now have an inventory component:
Barrel
Beacon
Blast Furnace
Brewing Stand
Dispenser
Dropper
Furnace
Hopper
Jukebox
Lectern
Smoker
BlockPermutation

BlockPermutation has been significantly refactored! Every BlockPermutation now share a unique JavaScript handle so exact equality (===) will work for permutations that share exactly the same state values. We've also added utility methods that make interacting with permutations easier, which includes the removal of the XBlockProperty classes and now directly return properties (boolean | number | string) or a while collection of properties ( Record<string, boolean | number | string>)

Added method matches(blockName: string, properties?: BlockProperties): boolean which is used to match a block with optional states against a BlockPermutation
Added method withProperty(name: string, value: boolean | number | string): BlockPermutation; which returns a new block permutation with a given property set to a specific value. Throws if the provided data cannot be resolved as a valid block permutation
Added function static resolve(blockName: string, properties?: BlockProperties): BlockPermutation which resolve a BlockPermutation from a block name and optional states. Throws if the provided data cannot be resolved as a valid block permutation
Updated methods getProperty and getAllProperties to return values directly instead of wrapped into class objects. Example code:
Before:

const blockPermutation = MinecraftBlockTypes.stoneSlab.createDefaultBlockPermutation();
blockPermutation.getProperty(MinecraftBlockProperties.stoneSlabType).value = 'stone_brick';
blockPermutation.getProperty(MinecraftBlockProperties.topSlotBit).value = true;
Now:

const blockPermutation = BlockPermutation.resolve('minecraft:stone_slab', {
    stone_slab_type: 'stone_brick',
    top_slot_bit: true,
});
BlockProperties

Added new class to expose BlockPropertyType
BlockPropertyType

Added new class to track "definitional" data about block properties. This is how you can find which values are valid for each block property
Data-Driven Custom Blocks

Released block properties and permutations out of experimental in JSON formats 1.19.70 and higher
Added a content warning when loading world with more than 65536 custom block permutations. Custom block permutation counts are logged in debug log`;