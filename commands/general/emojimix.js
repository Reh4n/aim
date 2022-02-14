const { sticker } = require('../../core/convert')
const { fetchJson, fetchBuffer } = require('../../utils/index')

module.exports = {
	name: 'emojimix',
	desc: 'Mix your emoji.',
	category: 'general',
	async execute(msg, wa, args) {
		try {
			let emo = args.join(' ').split('+')
			if (!emo[0]) return wa.reply(msg.from, 'Emoji?', msg)
			if (!emo[1]) return wa.reply(msg.from, 'Ex:\n!emojimix ðŸ˜±+ðŸ¥´', msg)
			let res = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo[0])}_${encodeURIComponent(emo[1])}`)
			sticker((await fetchBuffer(res.results[0].url)), { isImage: true, withPackInfo: true, cmdType: '2', packInfo: { packname: 'EmojiMix', author: '' }})
			.then((v) => wa.sticker(msg.from, v, { quoted: msg }))
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, 'Error while processing your request...', msg)
		}
	}
}
