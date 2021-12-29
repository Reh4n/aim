const { yta } = require('../../utils/youtube')
const { fetchText, textParse } = require('../../utils')
const { MessageType } = require('@adiwajshing/baileys')
const lang = require('../other/text.json')
const eq = require('../../core/connect').Whatsapp
const { validateURL } = require('../../utils/youtube-url-utils')

module.exports = {
    name: 'yta',
    aliases: ['ytmp3', 'ytaudio'],
    category: 'Downloader',
    desc: 'Download YouTube Audio',
    async execute(msg, wa, args) {
        try {
            if (args.length < 1) return wa.reply(msg.from, `URL not provided`, msg)
            let { url, opt } = textParse(args.join(" "))
            if (!validateURL(url)) return wa.reply(msg.from, lang.eng.util.download.notYTURL, msg)
            wa.reply(msg.from, `IND:\n${lang.indo.util.download.progress}\n\nEN:\n${lang.eng.util.download.progress}`, msg)

            const res = await yta(url)
            switch (opt) {
                case "--doc":
                    if (res.filesize >= 15 << 10) {
                        let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
                        let capt = `*Title:* ${res.title}\n`
                            + `*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                        await eq.sendMessage(msg.from, { url: res.thumb }, MessageType.image, { caption: capt, quoted: msg })
                    } else {
                        await eq.sendMessage(msg.from, { url: res.dl_link }, MessageType.document, {
                            mimetype: "audio/mp4",
                            filename: res.title + ".mp3",
                            quoted: msg
                        })
                    }
                    break
                case "--ptt":
                    if (res.filesize >= 15 << 10) {
                        let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
                        let capt = `*Title:* ${res.title}\n`
                            + `*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                        await eq.sendMessage(msg.from, { url: res.thumb }, MessageType.image, { caption: capt, quoted: msg })
                    } else {
                        await eq.sendMessage(msg.from, { url: res.dl_link }, MessageType.audio, { quoted: msg, ptt: true, mimetype: "audio/mp4" })
                    }
                    break
                default:
                    if (res.filesize >= 15 << 10) {
                        let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
                        let capt = `*Title:* ${res.title}\n`
                            + `*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                        await eq.sendMessage(msg.from, { url: res.thumb }, MessageType.image, { caption: capt, quoted: msg })
                    } else {
                        await eq.sendMessage(msg.from, { url: res.dl_link }, MessageType.audio, { quoted: msg, mimetype: "audio/mp4" })
                    }
            }

        } catch (e) {
            console.log(e)
            wa.reply(msg.from, 'Something went wrong, check back later.', msg)
        }
    }
}
