const { fetchJson } = require('../../utils')

module.exports = {
    name: 'wallpaper',
    aliases: ['wp'],
    category: 'weebs',
    desc: 'Get random wallpaper.',
    async execute(msg, wa) {
        const r = await fetchJson('https://nekos.life/api/v2/img/wallpaper')
        wa.mediaURL(msg.from, r.url, { quoted: msg })
    }
}