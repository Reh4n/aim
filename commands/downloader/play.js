const { search, yta } = require('../../utils/youtube')
const { fetchBuffer, fetchText } = require('../../utils')
const { MessageType } = require('@adiwajshing/baileys')
const eq = require('../../core/connect').Whatsapp

module.exports = {
    name: 'play',
    category: 'Downloader',
    desc: 'Play media from YouTube.',
    async execute(msg, wa, args) {
        const { from } = msg
        if (args.length < 1) return wa.reply(from, 'No query given to search.', msg)
        const s = await search(args.join(' '), 'short')
        if (s.length === 0) return wa.reply(msg.from, "No video found for that keyword, try another keyword", msg)
        const b = await fetchBuffer(`https://i.ytimg.com/vi/${s[0].id}/0.jpg`)
        const res = await yta(s[0].url)
        const struct = {
            locationMessage: { jpegThumbnail: b.toString("base64") },
            contentText: `📙 Title: ${s[0].title}\n📎 Url: ${s[0].url}\n🚀 Upload: ${s[0].uploadedAt}\n\nWant a video version? click button below, or you don\'t see it? type *!ytv youtube_url*\n\nAudio on progress....`,
            footerText: 'Kaguya PublicBot ⬩ Made by FaizBastomi',
            headerType: 6,
            buttons: [
                { buttonText: { displayText: 'Video' }, buttonId: `#ytv ${s[0].url} SMH`, type: 1 }
            ]
        }
        await eq.sendMessage(from, struct, MessageType.buttonsMessage, { quoted: msg }).then(async (msg) => {
            try {
                if (res.filesize >= 10 << 10) {
                    let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
                    let capt = `*Title:* ${res.title}\n`
                        + `*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize to big_`
                    await eq.sendMessage(from, { url: res.thumb }, MessageType.image, { caption: capt, quoted: msg })
                } else {
                    await eq.sendMessage(from, { url: res.dl_link }, MessageType.audio, { mimetype: 'audio/mp4', quoted: msg })
                }
            } catch {
                wa.reply(from, "Something wrong when sending the audio", msg)
            }
        })
    }
}