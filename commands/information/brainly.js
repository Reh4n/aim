const fetch = require('node-fetch')

module.exports = {
  name: 'brainly',
  category: 'information',
  desc: 'Looking for answers on the brainly site.',
  async execute(msg, wa, args) {
    try {
      let query = args.join` `
      if (!query) return wa.reply(msg.from, 'Input question', msg)
      let res = await (await fetch(`https://violetics.pw/api/media/brainly?apikey=beta&query=${query}`)).json()
      if (!res.result.length) return wa.reply(msg.from, `Question "${query}" not found!`, msg)
      let txt = res.result.map(v => `*${v.pertanyaan}*\n_${v.source}_\n${v.jawaban}`).join`\n\n`
      wa.reply(msg.from, txt, msg)
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}
