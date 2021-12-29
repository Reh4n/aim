const { fbdl } = require("../../utils/downloader")
const ev = require("../../core/connect").Whatsapp
const lang = require("../other/text.json")

const errMess = `ID:\n${lang.indo.util.download.fbFail}\n\nEN:\n${lang.eng.util.download.fbFail}`

module.exports = {
    name: "fb",
    aliases: ["fbdl","facebook","fbvid"],
    category: "Downloader",
    desc: "Download Facebook video",
    async execute(msg, wa, args) {
        try {
            let data = await fbdl(args[0])

            if (data.length === 0) return wa.reply(msg.from, `ID:\n${lang.indo.util.download.fbPriv}\n\nEN:\n${lang.eng.util.download.fbPriv}`)
            await ev.sendMessage(msg.from, { url: data[data.length - 1] }, "videoMessage", { quoted: msg })
        } catch(e) {
            wa.reply(msg.from, errMess, msg)
        }
    }
}
