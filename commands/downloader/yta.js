const ytsr = require('ytsr')
const lang = require('../other/text.json')
const { Whatsapp: ev } = require('../../core/connect')
const { validateURL } = require('../../utils/youtube-url-utils')
const { fetchBuffer, fetchText, textParse } = require('../../utils')

module.exports = {
	name: 'yta',
	aliases: ['ytmp3', 'ytaudio'],
	category: 'Downloader',
	desc: 'Download YouTube Audio',
	async execute(msg, wa, args) {
		try {
			const { from } = msg
			if (args.length < 1) return wa.reply(from, `URL not provided`, msg)
			let { url, opt } = textParse(args.join(' '))
			if (!validateURL(url)) return wa.reply(from, lang.eng.util.download.notYTURL, msg)
			wa.reply(from, `IND:\n${lang.indo.util.download.progress}\n\nEN:\n${lang.eng.util.download.progress}`, msg)
			let { items } = await ytsr(args[0])
			let ytLink = `https://yt-downloader.akkun3704.repl.co/?url=${url}&filter=audioonly&quality=highest&contenttype=audio/mp3`
			const res = await fetchBuffer(ytLink)
			switch (opt) {
				case '--doc':
					// if (res.length > 15000000) {
						let caption = `*Title:* ${items[0].title}\n*Views:* ${items[0].views}\n*Duration:* ${items[0].duration}\n*Download:* ${ytLink}`
						await wa.mediaURL(from, items[0].thumbnails[0].url, { quoted: msg, caption })
					// } else {
						ev.sendMessage(from, res, 'documentMessage', { mimetype: 'audio/mp4', filename: items[0].title + '.mp3', quoted: msg })
					// }
					break
				case '--ptt':
					// if (res.length > 15000000) {
						let caption = `*Title:* ${items[0].title}\n*Views:* ${items[0].views}\n*Duration:* ${items[0].duration}\n*Download:* ${ytLink}`
						await wa.mediaURL(from, items[0].thumbnails[0].url, { quoted: msg, caption })
					// } else {
						ev.sendMessage(from, res, 'audioMessage', { mimetype: 'audio/mp4', ptt: true, quoted: msg })
					// }
					break
				default:
					// if (res.length > 15000000) {
						let caption = `*Title:* ${items[0].title}\n*Views:* ${items[0].views}\n*Duration:* ${items[0].duration}\n*Download:* ${ytLink}`
						await wa.mediaURL(from, items[0].thumbnails[0].url, { quoted: msg, caption })
					// } else {
						ev.sendMessage(from, res, 'audioMessage', { mimetype: 'audio/mp4', quoted: msg })
					// }
			}
		} catch (e) {
			wa.reply(msg.from, String(e), msg)
		}
	}
}
