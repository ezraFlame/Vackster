import { Vackster } from "./module/config.js";
import VacksterItem from "./module/items/VacksterItem.js"
import VacksterItemSheet from './module/sheets/VacksterItemSheet.js';
import VacksterPcSheet from "./module/sheets/VacksterPcSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/Vackster/templates/partials/character-stat-block.hbs",
        "systems/Vackster/templates/partials/item-card.hbs"
    ];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function() {
    console.log("vackster | Initializing VacksterRPG Game System!");

    CONFIG.Vackster = Vackster;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("Vackster", VacksterItemSheet, { makeDefault: true });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Vackster", VacksterPcSheet, { makeDefault: true });

    preloadHandlebarsTemplates();
})