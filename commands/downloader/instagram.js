const { insta } = require('../../utils/instagram')
const lang = require('../other/text.json')
const errMes = `ID:\n${lang.indo.util.download.igFail}\n\nEN:\n${lang.eng.util.download.igFail}`

module.exports = {
    name: 'igdl',
    aliases: ['ig'],
    category: 'Downloader',
    desc: 'Download instagram media',
    async execute(msg, wa, args) {
        if (!args.length > 0) return wa.reply(msg.from, 'Ex: !igdl *instagram_url*', msg)
        try {
            const ar = await insta(args[0])
            if (ar.uriType === "igHigh") {
                wa.mediaURL(msg.from, ar.media[0].url, { quoted: msg })
            } else if (ar.uriType === "igStory") {
                wa.mediaURL(msg.from, ar.media[0].url, { quoted: msg })
            } else {
                ar.url.map((r) => {
                    wa.mediaURL(msg.from, r, { quoted: msg })
                })
            }
        } catch(e) {
            wa.reply(msg.from, errMes, msg)
        }
    }
}
