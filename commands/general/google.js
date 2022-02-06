const { googleIt } = require('@bochilteam/scraper')

module.exports = {
	name: 'google',
	category: 'general',
	async execute(msg, wa, args) {
		if (!args[0]) return wa.reply(msg.from, 'Query needed', msg)
		let res = await googleIt(args.join(' '))
		let txt = res.articles.map(v => `*${v.title}*\n_${v.url}_\n_${v.description}_`).join('\n\n')
		wa.reply(msg.from, txt, msg)
	}
}
