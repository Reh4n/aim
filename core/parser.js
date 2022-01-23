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
            case "source code":
                await ev.sendMessage(from, "https://github.com/FaizBastomi/wbot/", "conversation", { detectLinks: true, quoted: e })
                break;
            case "":
                break;
        }
    }
}
