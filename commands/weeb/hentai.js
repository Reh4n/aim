const { fetchJson } = require('../../utils')

module.exports = {
    name: 'hentai',
    category: 'weebs',
    desc: 'Random anime hentai.',
    async execute(msg, wa) {
        // if (msg.isGroup) return wa.reply(msg.from, "Only private chat", msg)
        const { url } = await fetchJson('https://nekos.life/api/v2/img/hentai')
        wa.custom(msg.from, { url }, 'imageMessage', { quoted: msg, viewOnce: true })
    }
}
