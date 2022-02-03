const { getDoujin } = require('nhentai-node-api')
const { fetchBuffer, toPDF } = require('../../utils')

module.exports = {
	name: 'getnhentai',
	aliases: ['gethentai'],
	category: 'weebs',
	use: 'Ex: !gethentai 1 <reply chat bot>',
	async execute(msg, wa, args) {
		try {
			const { from, quoted } = msg
			if (quoted && quoted.key.fromMe && quoted.key.id.startsWith('3EB0') && quoted.key.id.endsWith('NHENTAI')) {
				if (!args[0]) return wa.reply(from, 'Input code', msg)
				if (isNaN(args[0])) return wa.reply(from, 'Code must be number', msg)
				await wa.reply(from, 'Loading...', msg)
				let quotedText = quoted.message.conversation || quoted.message.extendedTextMessage.text
				let res = quotedText.split('\n\n')[args[0] - 1].split('Link: ')[1]
				let { title, cover, pages } = await getDoujin(res.replace(/\D/g, ''))
				pages = await toPDF(pages)
				let thumbnail = await fetchBuffer(cover)
				await wa.custom(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail })
			} else wa.reply(from, 'Reply chat bot hasil pencarian nhentai!', msg)
		} catch (e) {
			wa.reply(msg.from, String(e), msg)
		}
	}
}
