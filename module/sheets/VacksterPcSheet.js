export default class VacksterPcSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/Vackster/templates/sheets/pc-sheet.hbs",
            classes: ["vackster", "sheet", "pc"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.Vackster;
        data.weapons = data.items.filter(function (item) { return item.type == "weapon"; });
        data.skills = data.items.filter(function (item) { return item.type == "skill"; });
        data.items = data.items.filter(function (item) { return !CONFIG.Vackster.inventoryBlacklist.includes(item.type); });
        
        return data;
    }

    activateListeners(html) {
        html.find(".item-create").click(this._onItemCreate.bind(this));
        html.find(".inline-edit").change(this._onWeaponEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));

        super.activateListeners(html);
    }

    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: "newItem",
            type: element.dataset.type
        };

        console.log(this.getData().actions);

        return this.actor.createOwnedItem(itemData);
    }

    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        return this.actor.deleteOwnedItem(itemId);
    }

    _onWeaponEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.getOwnedItem(itemId);
        let field = element.dataset.field;

        return item.update({ [field]: element.value });
    }
}