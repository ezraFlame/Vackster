export default class VacksterItem extends Item {
    chatTemplate = {
        "weapon": "systems/vackster/templates/partials/weapon-roll.hbs"
    };

    async roll() {
        let chatData = {
            user: game.user.data._id,
            speaker: ChatMessage.getSpeaker()
        };

        let cardData = {
            ...this.data,
            owner: this.actor.data.id
        };

        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

        chatData.roll = true;

        return ChatMessage.create(chatData);
    }
}