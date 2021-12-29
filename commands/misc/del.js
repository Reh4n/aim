const cv = require("../../core/connect").Whatsapp

module.exports = {
    name: "delete",
    aliases: ["del"],
    desc: "Delete message sent by bot",
    use: "Reply to message sent by bot",
    async execute(msg, wa, args) {
        const { quoted, from } = msg
        try {
            if (!quoted) return wa.reply(from, "Please reply to message sent by me", msg)

            let m = await cv.loadMessage(from, quoted.stanzaId)
            if (!m.key.fromMe) return wa.reply(from, "Can't delete message sent by other, only message sent by me", msg);
            await cv.deleteMessage(m.key)
        } catch (e) {
            return wa.reply(from, "Error while proccessing your request", msg)
        }
    }
}