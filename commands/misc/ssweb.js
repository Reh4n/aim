const { screenshot } = require('popcat-wrapper')

module.exports = {
	name: 'ssweb',
	aliases: ['ss', 'screenshot'],
	category: 'misc',
	execute(msg, wa, args) {
		if (!args[0]) return wa.reply(msg.from, 'URL Needed.', msg)
		let caption = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
		screenshot(caption).then(async (res) => {
			await wa.reply(msg.from, 'Loading...', msg)
			wa.mediaURL(msg.from, res, { quoted: msg, caption })
		}).catch(wa.reply)
	}
}
