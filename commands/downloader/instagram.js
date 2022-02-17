const scraper = require('@bochilteam/scraper')
const lang = require('../other/text.json')
const errMes = `ID:\n${lang.indo.util.download.igFail}\n\nEN:\n${lang.eng.util.download.igFail}`

module.exports = {
  name: 'igdl',
  aliases: ['ig'],
  category: 'Downloader',
  desc: 'Download instagram media',
  async execute(msg, wa, args) {
    if (!args.length > 0) return wa.reply(msg.from, 'Ex: !igdl *instagram_url*', msg)
    try {
      let res = await scraper.instagramdl(args[0]).catch(async _ => await scraper.instagramdlv2(args[0]))
      for (let i = 0; i < res.length; i++) await wa.mediaURL(msg.from, res[i].url, { quoted: msg })
    } catch(e) {
      wa.reply(msg.from, errMes, msg)
    }
  }
}
