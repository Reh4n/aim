const { search } = require('../../utils/youtube')
const { fetchBuffer } = require('../../utils')
const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'yts',
    aliases: ['ytsearch'],
    category: 'Downloader',
    desc: 'Search on YouTube.',
    async execute(msg, wa, args) {
        if (args.length < 1) return wa.reply(msg.from, 'No query given to search.', msg)
        const r = await search(args.join(' '), 'long')
        const b = await fetchBuffer(r[0].bestThumbnail.url)
        let txt = `YouTube Search\n   ~> Query: ${args.join(' ')}\n`
        for (let i = 0; i < r.length; i++) {
            txt += `\n📙 Title: ${r[i].title}\n📎 Url: ${r[i].url}\n🚀 Upload: ${r[i].uploadedAt}\n`
        }
        wa.custom(msg.from, b, MessageType.image, { caption: txt, detectLinks: false, quoted: msg })
    }
}