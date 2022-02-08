const fs = require("fs")
const cp = require("child_process")
const emoji = require("../../utils/emojiped")
const { sticker } = require("../../core/convert")
const { default: Graphemer } = require("graphemer")
const { getRandom, fetchBuffer } = require("../../utils/index")

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
				try {
					let links = await emoji(args[0])
					const r = await sticker((await fetchBuffer(links.whatsapp)), { isImage: true, withPackInfo: true, cmdType: "2", packInfo: { packname: "Emoji", author: "Emojipedia.org" } }).catch(() => wa.reply(msg.from, "an error occurred while processing your request", msg))
					wa.sticker(msg.from, r, { quoted: msg })
				} catch {
					let emo = new Graphemer().splitGraphemes(args.join(' '))
					let links = await emoji(emo[0]), links1 = await emoji(emo[1] == 0 ? emo[2] : emo[1])
					let rand = getRandom('.jpeg'), rand1 = getRandom('.jpeg')
					await fs.promises.writeFile(`./temp/${rand}`, await fetchBuffer(links.whatsapp))
					await fs.promises.writeFile(`./temp/${rand1}`, await fetchBuffer(links1.whatsapp))
					cp.exec(`ffmpeg -i ./temp/${rand} -i ./temp/${rand1} -filter_complex hstack=inputs=2 ./temp/${msg.sender}.png`, function (e) {
						if (e) return wa.reply(msg.from, "ada yang eror.", msg) && fs.unlinkSync(`./temp/${rand}`) && fs.unlinkSync(`./temp/${rand1}`)
						sticker(`./temp/${msg.sender}.png`, { isImage: true, withPackInfo: true, cmdType: "1", packInfo: { packname: "Emoji", author: "Emojipedia.org" }}).then((r) => wa.sticker(msg.from, r, { quoted: msg }))
						/*fs.unlinkSync(`./temp/${rand}`)
						fs.unlinkSync(`./temp/${rand1}`)
						fs.unlinkSync(`./temp/${msg.sender}.png`)*/
					})
				}
			}
		} catch(e) {
			console.log(e)
			wa.reply(msg.from, "an error occurred while processing your request", msg)
		}
	}
}
