const { getInfo } = require('../../utils/downloader')
const lang = require('../other/text.json')

module.exports = {
    name: 'twtdl',
    aliases: ['twt'],
    category: 'Downloader',
    async execute(msg, wa, args) {
        if (!args.length > 0 || !args[0].includes('twitter.com') || args[0].includes('t.co')) return wa.reply(msg.from, 'URL needed', msg)
        getInfo(args[0]).then(async (data) => {
            if (data.type === 'video') {
                const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                await wa.mediaURL(msg.from, content[0].url, { quoted: msg })
            } else if (data.type === 'photo') {
                for (let z = 0; z < data.variants.length; z++) {
                    await wa.mediaURL(msg.from, data.variants[z], { quoted: msg })
                }
            } else if (data.type === 'animated_gif') {
                const content = data.variants[0]['url']
                await wa.mediaURL(msg.from, content, { quoted: msg })
            }
        }).catch(() => { wa.reply(msg.from, `IND:\n${lang.indo.util.download.twittFail}\n\nEN:\n${lang.eng.util.download.twittFail}`, msg) })
    }
}