const { fetchJson } = require('../../utils')

module.exports = {
  name: 'hentai',
  category: 'weebs',
  desc: 'Random anime hentai.',
  async execute(msg, wa) {
    const { url } = await fetchJson('https://nekos.life/api/v2/img/hentai')
    if (msg.isGroup) return wa.custom(msg.from, { url }, 'imageMessage', { viewOnce: true })
    else wa.mediaURL(msg.from, url, { quoted: msg })
  }
}
