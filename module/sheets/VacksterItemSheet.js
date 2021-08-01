export default class VacksterItemSheet extends ItemSheet {
    get template() {
        return `systems/Vackster/templates/sheets/${this.item.data.type}-sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["vackster", "sheet", "item"]
        });
    }

    activateListeners(html) {
        this.form.ondrop = ev => this._onDrop(ev);

        html.find(".item-delete").click(this._onItemDelete.bind(this));

        super.activateListeners(html);
    }

    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let itemIndex = this.item.data.data.actions.findIndex(function (element) { return element._id == itemId; });
        let data = duplicate(this.item.data);
        data.data.actions.splice(itemIndex, 1);
        this.item.update(data);
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.Vackster;

        data.actions = this.item.actions;

        return data;
    }

    async _onDrop(event) {
        super._onDrop(event);
        let data = JSON.parse(event.dataTransfer.getData('text/plain'));
        let item = await Item.fromDropData(data);

        console.log(item);

        if (this.item.type == "weapon") {
            return this._addAction(item);
        } else if (this.item.type == "action" && item.type == "skill") {
            let skillKey = item.data.data.key;
            this.item.update({"data.skillKey": skillKey});
            console.log(this.item.data.data.skillKey);
            return;
        }
    }

    async _addAction(item) {
        let actions = this.item.data.data.actions;
        actions.push(item);
        return this.item.update({"data.actions": actions});
    }
}