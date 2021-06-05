export default class VacksterItemSheet extends ItemSheet {
    get template() {
        return `systems/Vackster/templates/sheets/${this.item.data.type}-sheet.hbs`;
    }

    dragDrop = new DragDrop({
        dragSelector: ".item",
        dropSelector: null,
        permissions: { dragstart: this._canDragStart.bind(this), drop: this._canDragDrop.bind(this) },
        callbacks: { dragstart: this._onDragStart.bind(this), drop: this._onDrop.bind(this) }
    });

    activateListeners(html) {
        if (this.item.type != "action") {
            this.dragDrop.bind(html.find(".actions").get(0));
        }

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

    _canDragStart(selector) {
        return true;
    }

    _canDragDrop(selector) {
        return true;
    }
    
    _onDragStart(event) {
    }

    async _onDrop(event) {
        super._onDrop(event);
        let data = JSON.parse(event.dataTransfer.getData('text/plain'));

        let item = await Item.fromDropData(data);

        return this._addAction(item);
    }

    async _addAction(item) {
        let itemData = duplicate(this.item.data);
        itemData.data.actions.push(item);
        console.log(this.item);
        return this.item.update(itemData);
    }
}