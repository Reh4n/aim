const ev = require('../../core/connect').Whatsapp
const { fetchBuffer, toPDF } = require('../../utils')
const { getLatest, search, getDoujin, getPopular, random } = require('nhentai-node-api')

module.exports = {
	name: 'nhentai',
	category: 'weebs',
	desc: 'Download/Search doujin hentai from web nhentai.',
	use: '[options] quey\n\n- *Options* -\n\n1. pdf\n2. search\n3. latest\n\nEx: !nhentai pdf 212121',
	async execute(msg, wa, args) {
		try {
			const { from } = msg
			let type = (args[0] || '').toLowerCase()
			switch (type) {
				case 'latest': {
					let res = await getLatest()
					let thumbnail = await fetchBuffer(res[0].thumbnail)
					await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLang: ${v.language}\nID: ${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res[0].title, body: 'Nhentai Latest', thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
					break
				}
				case 'search': {
					if (!args[1]) return wa.reply(from, 'Input query', msg)
					await wa.reply(from, 'Loading...', msg)
					let res = await search(args.splice(1).join(' '))
					let thumbnail = await fetchBuffer(res[0].thumbnail)
					await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLang: ${v.language}\nID: ${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res[0].title, body: `~> Query: ${args.splice(1).join(' ')}`, thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
					break
				}
				case 'pdf': {
					if (!args[1]) return wa.reply(from, 'Input code', msg)
					if (isNaN(args[1])) return wa.reply(from, 'Code must be number', msg)
					await wa.reply(from, 'Loading...', msg)
					let { title, cover, pages } = await getDoujin(args[1])
					pages = await toPDF(pages)
					let thumbnail = await fetchBuffer(cover)
					await wa.custom(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail })
					break
				}
				case 'random': {
					await wa.reply(from, 'Loading...', msg)
					let { title, cover, pages } = await random()
					pages = await toPDF(pages)
					let thumbnail = await fetchBuffer(cover)
					await wa.custom(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail })
					break
				}
				default:
					await wa.reply(from, 'Loading...', msg)
					let res = await getPopular()
					let thumbnail = await fetchBuffer(res[0].thumbnail)
					await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLang: ${v.language}\nID: ${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res[0].title, body: 'Nhentai Popular', thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
			}
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, String(e), msg)
		}
	}
}
