const { googleImage } = require('@bochilteam/scraper')
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
  name: 'image',
  aliases: ['img', 'gimage', 'googleimage'],
  category: 'general',
  async execute(msg, wa, args) {
    let query = args.join(' ')
    if (!query) return wa.reply(msg.from, 'Input Query', msg)
    query = query.endsWith('SMH') ? query.replace('SMH', '') : query
    await wa.reply(msg.from, 'Loading...', msg)
    googleImage(query).then(async (res) => {
      res = res[Math.floor(Math.random() * res.length)]
      wa.custom(msg.from, { imageMessage: (await ev.prepareMessageMedia({ url: res }, 'imageMessage')).imageMessage, contentText: `Result From: ${query}`, footerText: res, headerType: 'IMAGE', buttons: [{ buttonText: { displayText: 'Next' }, buttonId: `#image ${query} SMH`, type: 1 }] }, 'buttonsMessage', { quoted: msg })         
    }).catch(e => wa.reply(msg.from, String(e), msg))
  }
}
