export default class VacksterPcSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/Vackster/templates/sheets/pc-sheet.hbs",
            classes: ["vackster", "sheet", "pc"]
        });
    }

    getData() {
        const data = super.getData();
        data.weapons = data.items.filter(function (item) { return item.type == "weapon"; });
        data.skills = data.items.filter(function (item) { return item.type == "skill"; });
        data.items = data.items.filter(function (item) { return !CONFIG.Vackster.inventoryBlacklist.includes(item.type); });

        for (let i = 0; i < data.skills.length; i++) {
            let skill = data.skills[i];

            let modifier = 0;
            
            if (skill.data.modifiers.str == true) {
                modifier += data.data.data.abilities.str;
            }
            if (skill.data.modifiers.dex == true) {
                modifier += data.data.data.abilities.dex;
            }
            if (skill.data.modifiers.int == true) {
                modifier += data.data.data.abilities.int;
            }
            if (skill.data.modifiers.wis == true) {
                modifier += data.data.data.abilities.wis;
            }
            if (skill.data.modifiers.con == true) {
                modifier += data.data.data.abilities.con;
            }
            if (skill.data.modifiers.soul == true) {
                modifier += data.data.data.abilities.soul;
            }

            // skill.data.modifiers.total = modifier;
            this.actor.items.get(skill._id).update({"data.modifiers.total": modifier});
        }
        
        return data;
    }

    activateListeners(html) {
        html.find(".item-create").click(this._onItemCreate.bind(this));
        html.find(".inline-edit").change(this._onWeaponEdit.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".skill-edit").click(this._onSkillEdit.bind(this));
        html.find(".item-roll").click(this._onItemRoll.bind(this));
        html.find(".skill-check").click(this._onSkillCheck.bind(this));

        super.activateListeners(html);
    }

    _onSkillCheck(event) {
        const itemId = event.currentTarget.closest(".skill").dataset.itemId;
        const item = this.actor.items.get(itemId);

        let rollFormula = `${item.data.data.dnum}d${item.data.data.dtype} + @mod`;

        let rollData = {
            mod: item.data.data.modifiers.total
        };

        let messageData = {
            speaker: ChatMessage.getSpeaker()
        };

        new Roll(rollFormula, rollData).roll().toMessage(messageData);
    }

    _onItemRoll(event) {
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.roll();
    }

    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: "newItem",
            type: element.dataset.type
        };

        return this.actor.createOwnedItem(itemData);
    }

    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        return this.actor.items.get(itemId).delete();
    }

    _onWeaponEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let field = element.dataset.field;

        return item.update({ [field]: element.value });
    }

    _onSkillEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }
}