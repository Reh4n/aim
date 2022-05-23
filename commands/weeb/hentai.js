const { fetchJson } = require('../../utils')

module.exports = {
  name: 'hentai',
  category: '',
  desc: 'Random anime hentai.',
  async execute(msg, wa) {
    const { url } = await fetchJson('https://hmtai.herokuapp.com/nsfw/hentai')
    if (msg.isGroup) return wa.custom(msg.from, { url }, 'imageMessage', { viewOnce: true })
    else wa.mediaURL(msg.from, url, { quoted: msg })
  }
}
