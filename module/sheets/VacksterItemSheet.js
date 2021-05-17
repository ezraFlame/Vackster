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
        super.activateListeners(html);
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
        let data = JSON.parse(event.dataTransfer.getData('text/plain'));

        let item = await Item.fromDropData(data);

        return this._addAction(item);
    }

    async _addAction(item) {
        let data = {
            data: {
                type: item.data.data.type
            },
            _id: item.data._id,
            name: item.data.name
        }
        console.log(this.item.data.data);
        return this.item.data.data.actions.push(data);
    }
}