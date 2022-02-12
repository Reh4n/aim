const lang = require('../other/text.json')
const { fetchJson, textParse } = require('../../utils')
const { validateURL } = require('../../utils/youtube-url-utils')

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
			let { result: res } = await fetchJson(`https://yt-downloader.akkun3704.repl.co/yt?url=${url}`)
			let ytLink = `https://yt-downloader.akkun3704.repl.co/?url=${url}&filter=audioonly&quality=highest&contenttype=audio/mp3`
			switch (opt) {
				case '--doc':
					if (res.videoDetails.lengthSeconds > 3600) {
						let caption = `*Title:* ${res.videoDetails.title}\n*Views:* ${res.videoDetails.viewCount}\n*Duration:* ${clockString(res.videoDetails.lengthSeconds)}\n*Download:* ${ytLink}\n\n_Filesize too big_`
						await wa.mediaURL(from, `https://i.ytimg.com/vi/${res.videoDetails.videoId}/0.jpg`, { quoted: msg, caption })
					} else {
						wa.custom(from, { url: ytLink }, 'documentMessage', { mimetype: 'audio/mp4', filename: res.videoDetails.title + '.mp3', quoted: msg })
					}
					break
				case '--ptt':
					if (res.videoDetails.lengthSeconds > 3600) {
						let caption = `*Title:* ${res.videoDetails.title}\n*Views:* ${res.videoDetails.viewCount}\n*Duration:* ${clockString(res.videoDetails.lengthSeconds)}\n*Download:* ${ytLink}\n\n_Filesize too big_`
						await wa.mediaURL(from, `https://i.ytimg.com/vi/${res.videoDetails.videoId}/0.jpg`, { quoted: msg, caption })
					} else {
						wa.custom(from, { url: ytLink }, 'audioMessage', { mimetype: 'audio/mp4', ptt: true, quoted: msg })
					}
					break
				default:
					if (res.videoDetails.lengthSeconds > 3600) {
						let caption = `*Title:* ${res.videoDetails.title}\n*Views:* ${res.videoDetails.viewCount}\n*Duration:* ${clockString(res.videoDetails.lengthSeconds)}\n*Download:* ${ytLink}\n\n_Filesize too big_`
						await wa.mediaURL(from, `https://i.ytimg.com/vi/${res.videoDetails.videoId}/0.jpg`, { quoted: msg, caption })
					} else {
						wa.custom(from, { url: ytLink }, 'audioMessage', { mimetype: 'audio/mp4', quoted: msg })
					}
			}
		} catch (e) {
			wa.reply(msg.from, String(e), msg)
		}
	}
}

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms % (3600 * 24) / 3600)
	let m = isNaN(ms) ? '--' : Math.floor(ms % 3600 / 60)
	let s = isNaN(ms) ? '--' : Math.floor(ms % 60)
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
