const emoji = require("../../utils/emojiped")
const { sticker } = require("../../core/convert")
const { fetchBuffer } = require("../../utils/index")
const { default: Graphemer } = require("graphemer")


module.exports = {
	name: "emoji",
	aliases: ["emote", "moji"],
	desc: "Convert emoji to sticker.",
	category: "general",
	use: "<emoji>",
	async execute(msg, wa, args) {
		try {
			if (!args.length > 0) return wa.reply(msg.from, "No emoji!", msg)
			if (args.length > 1 && args.length === 2) {
				let links = await emoji(args.slice(1)[0])
				let provider = Object.keys(links)
				if (provider.includes(args[0])) {
					sticker((await fetchBuffer(links[args[0]])), { isImage: true, withPackInfo: true, cmdType: "2", packInfo: { packname: "Emoji", author: "Emojipedia.org" }})
					.then((r) => {
						wa.sticker(msg.from, r, { quoted: msg })
					}).catch(() => wa.reply(msg.from, "an error occurred while processing your request", msg))
				} else {
					sticker((await fetchBuffer(links.whatsapp)), { isImage: true, withPackInfo: true, cmdType: "2", packInfo: { packname: "Emoji", author: "Emojipedia.org" }})
					.then((r) => {
						wa.sticker(msg.from, r, { quoted: msg })
					}).catch(() => wa.reply(msg.from, "an error occurred while processing your request", msg))
				}
			} else {
				let emo = new Graphemer().splitGraphemes(args.join(' '))
				let links = await emoji(emo[0])
				const r = await sticker((await fetchBuffer(links.whatsapp)), { isImage: true, withPackInfo: true, cmdType: "2", packInfo: { packname: "Emoji", author: "Emojipedia.org" } }).catch(() => wa.reply(msg.from, "an error occurred while processing your request", msg))
				wa.sticker(msg.from, r, { quoted: msg })
			}
		} catch(e) {
			console.log(e)
			wa.reply(msg.from, "an error occurred while processing your request", msg)
		}
	}
}
