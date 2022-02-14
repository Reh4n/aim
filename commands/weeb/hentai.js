const { fetchJson } = require('../../utils')

module.exports = {
  name: 'hentai',
  category: 'weebs',
  desc: 'Random anime hentai.',
  async execute(msg, wa) {
    const { url } = await fetchJson('https://nekos.life/api/v2/img/hentai')
    if (msg.isGroup) return wa.mediaURL(msg.from, url, { quoted: msg })
    else wa.custom(msg.from, { url }, 'imageMessage', { viewOnce: true, caption: `Nih @${msg.sender.split('@')[0]}`, contextInfo: { mentionedJid: [msg.sender] }})
  }
}
