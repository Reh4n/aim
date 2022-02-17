const axios = require('axios')

module.exports = {
  name: 'npm',
  aliases: ['npms', 'npmjs', 'npmsearch'],
  async execute(msg, wa, arg) {
    if (!arg) return wa.reply(msg.from, 'Query Needed', msg)
    axios.get(`https://api.npms.io/v2/search?q=${arg}`).then(({ data }) => {
      let txt = data.results.map(({ package: pkg }) => `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}$_`).join('\n\n')
      wa.reply(msg.from, txt, msg)
    }).catch(e => wa.reply(msg.from, String(e), msg))
  }
}
