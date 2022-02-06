const { Telesticker } = require('xfarr-api')
const { sticker } = require('../../core/convert')
const { fetchBuffer } = require('../../utils/index')
const { stickerTelegram } = require('@bochilteam/scraper')

module.exports = {
	name: 'telesticker',
	aliases: ['telestiker', 'stickertelegram', 'stikertelegram', 'telegramsticker', 'telegramstiker'],
	category: 'Downloader',
	async execute(msg, wa, args) {
		const { from, sender } = msg
		if (args[0] && args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) {
			let res = await Telesticker(args[0])
			await wa.reply(from, `Sending ${res.length} sticker(s)...`, msg)
			if (res.length > 20) {
				await wa.reply(from, 'ID:\nJumlah stiker lebih dari 20, bot akan mengirimkannya di private chat.\n\nEN:\nNumber of stickers more than 20, bot will send them in private chat.', msg)
				for (let i = 0; i < res.length; i++) {
					let buffer = await fetchBuffer(res[i].url)
					sticker(buffer, { isImage: true, cmdType: '1' }).then((v) => wa.sticker(sender, v))
				}
			} else {
				for (let i = 0; i < res.length; i++) {
					let buffer = await fetchBuffer(res[i].url)
					sticker(buffer, { isImage: true, cmdType: '1' }).then((v) => wa.sticker(from, v))
				}
			}
		} else if (args && args.join(' ')) {
			let [query, page] = args.join(' ').split('|')
			let res = await stickerTelegram(query, page)
			wa.reply(from, res.map(v => `*${v.title}*\n_${v.link}_`).join('\n\n'), msg)
		} else wa.reply(from, 'Input Query/URL', msg)
	}
}
