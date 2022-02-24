const { lyrics, lyricsv2 } = require('@bochilteam/scraper')

module.exports = {
  name: 'lyrics',
  aliases: ['lirik', 'lyric', 'liriklagu'],
  category: 'information',
  desc: 'Search song lyrics',
  use: '<query>',
  async execute(msg, wa, args) {
    try {
      let query = args.join(' ')
      if (!query) return wa.reply(msg.from, 'Query needed', msg)
      let res = await lyrics(query).catch(async _ => await lyricsv2(query))
      wa.reply(msg.from, `*${res.title}*\n\n${res.lyrics}\n\n_${res.link}_`, msg)
    } catch (e) {
      wa.reply(msg.from, String(e), msg)
    }
  }
}
