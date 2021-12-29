const { fetchJson } = require('../../utils')

module.exports = {
    name: 'neko',
    aliases: ['nekogirl','catgirl'],
    category: 'weebs',
    desc: 'Get random NekoGirl image.',
    async execute(msg, wa) {
        const r = await fetchJson('https://nekos.life/api/v2/img/neko')
        wa.mediaURL(msg.from, r.url, { quoted: msg })
    }
}