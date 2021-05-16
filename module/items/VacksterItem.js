export default class VacksterItem extends Item {
    chatTemplate = {
        "weapon": ""
    };
    
    static get config() {
        return mergeObject(super.config,  {
            embeddedEntities: {
                "Actions": "items"
            }
        });
    }
}