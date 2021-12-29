const ev = require('./connect').Whatsapp
const { WAMessageProto, MessageType } = require('@adiwajshing/baileys')

module.exports = {
    async buttonsParser(m) {
        const { from } = m
        let context = m.message.buttonsResponseMessage.selectedDisplayText.toLowerCase()
        let e = WAMessageProto.WebMessageInfo.fromObject({
            key: { ...m.key },
            message: {
                conversation: context
            },
            timestamp: m.timestamp
        })
        switch (context) {
            case "telegram bot":
                await ev.sendMessage(from, "t.me/SecondMidnight_bot\nMy Telegram Bot\nThanks for using my bot.", "conversation", { detectLinks: false, quoted: e })
                break;
            case "":
                break;
        }
    }
}