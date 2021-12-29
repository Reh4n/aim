const { ytv } = require('../../utils/youtube')
const { fetchText, textParse, fetchBuffer } = require('../../utils')
const { MessageType } = require('@adiwajshing/baileys')
const lang = require('../other/text.json')
const eq = require('../../core/connect').Whatsapp
const { validateURL } = require('../../utils/youtube-url-utils')

module.exports = {
    name: 'ytv',
    aliases: ['ytmp4', 'ytvid', 'ytvideo'],
    category: 'Downloader',
    desc: 'Download YouTube Video',
    async execute(msg, wa, args) {
        try {
            if (args.length < 1) return wa.reply(msg.from, `URL not provided`, msg)
            let { url, opt } = textParse(args.join(" "))
            if (!validateURL(url)) return wa.reply(msg.from, lang.eng.util.download.notYTURL, msg)
            wa.reply(msg.from, `IND:\n${lang.indo.util.download.progress}\n\nEN:\n${lang.eng.util.download.progress}`, msg)

            const res = await ytv(url)
            switch (opt) {
                case "--doc":
                    if (res.filesize >= 30 << 10) {
                        let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
                        let capt = `*Title:* ${res.title}\n`
                            + `*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                        await eq.sendMessage(msg.from, (await fetchBuffer(res.thumb)), MessageType.image, { caption: capt, quoted: msg })
                    } else {
                        await eq.sendMessage(msg.from, { url: res.dl_link }, MessageType.document, { mimetype: 'video/mp4', filename: res.title + ".mp4", quoted: msg })
                    }
                    break
                default:
                    if (res.filesize >= 30 << 10) {
                        let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
                        let capt = `*Title:* ${res.title}\n`
                            + `*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                        await eq.sendMessage(msg.from, (await fetchBuffer(res.thumb)), MessageType.image, { caption: capt, quoted: msg })
                    } else {
                        let capt = `Title: ${res.title}\nSize: ${res.filesizeF}`
                        await eq.sendMessage(msg.from, { url: res.dl_link }, MessageType.video, { mimetype: 'video/mp4', caption: capt, quoted: msg })
                    }
            }
        } catch (e) {
            console.log(e)
            wa.reply(msg.from, 'Something went wrong, check back later.', msg)
        }
    }
}
