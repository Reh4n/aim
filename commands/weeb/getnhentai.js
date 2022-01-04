const ev = require('../../core/connect').Whatsapp
const { fetchBuffer, toPDF } = require('../../utils')
const { search, getDoujin } = require('nhentai-node-api')

module.exports = {
	name: 'getnhentai',
	aliases: ['gethentai'],
	category: 'weebs',
	use: 'Ex: !gethentai 1 <reply chat bot>',
	async execute(msg, wa, args) {
		try {
			const { from, quoted } = msg
			if (quoted && quoted.key.fromMe && quoted.key.id.startsWith('3EB0')) {
				if (!args[0]) return wa.reply(from, 'Input code', msg)
				if (isNaN(args[0])) return wa.reply(from, 'Code must be number', msg)
				await wa.reply(from, 'Loading...', msg)
				let quotedText = quoted.message.conversation || quoted.message.extendedTextMessage.text
				let res = await search(quotedText.split('\n\n')[args[0] - 1].split('. ')[1])
				let { title, cover, pages } = await getDoujin(res[0].id)
				pages = await toPDF(pages)
				let thumbnail = await fetchBuffer(cover)
				await wa.custom(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail })
			}
		} catch (e) {
			wa.reply(msg.from, String(e), msg)
		}
	}
}
