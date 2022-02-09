const { googleImage } = require('@bochilteam/scraper')

module.exports = {
  name: 'image',
  aliases: ['img', 'gimage', 'googleimage'],
  category: 'general',
  async execute(msg, wa, args) {
    if (!args.join(' ')) wa.reply(msg.from, 'Input Query', msg)
    await wa.reply(msg.from, 'Loading...', msg)
    googleImage(args.join(' ')).then(res => {
      res = res[Math.floor(Math.random() * res.length)]
      wa.mediaURL(msg.from, res, { quoted: msg, caption: `Hasil Pencarian: ${args.join(' ')}\nUrl: ${res}` })
    }).catch(e => wa.reply(msg.from, String(e), msg))
  }
}
