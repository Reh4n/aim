const { sticker } = require('../../core/convert')
const { fetchBuffer } = require('../../utils/index')

module.exports = {
	name: 'emojimix',
	desc: 'Mix your emoji.',
	category: 'general',
	async execute(msg, wa, args) {
		try {
			let emo = args.join(' ').split('+')
			if (!emo[0]) return wa.reply(msg.from, 'Emoji?', msg)
			if (!emo[1]) return wa.reply(msg.from, 'Ex:\n!emojimix 😱+🥴', msg)
			emo = emo.map(v => 'u' + v.codePointAt(0).toString(16))
			sticker((await fetchBuffer(`https://www.gstatic.com/android/keyboard/emojikitchen/20201001/${emo[0]}/${emo[0]}_${emo[1]}.png`)), { isImage: true, withPackInfo: true, cmdType: '2', packInfo: { packname: 'EmojiMix', author: '' }})
			.then((v) => wa.sticker(msg.from, v, { quoted: msg }))
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, 'Error while processing your request...', msg)
		}
	}
}
