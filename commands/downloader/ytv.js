const lang = require('../other/text.json')
const { fetchJson, textParse } = require('../../utils')
const { validateURL } = require('../../utils/youtube-url-utils')

module.exports = {
	name: 'ytv',
	aliases: ['ytmp4', 'ytvid', 'ytvideo', 'ytdl', 'yt'],
	category: 'Downloader',
	desc: 'Download YouTube Video',
	async execute(msg, wa, args) {
		try {
			if (args.length < 1) return wa.reply(msg.from, `URL not provided`, msg)
			let { url, opt } = textParse(args.join(' '))
			if (!validateURL(url)) return wa.reply(msg.from, lang.eng.util.download.notYTURL, msg)
			wa.reply(msg.from, `IND:\n${lang.indo.util.download.progress}\n\nEN:\n${lang.eng.util.download.progress}`, msg)
			let { result: res } = await fetchJson(`https://yt-downloader.akkun3704.repl.co/yt?url=${url}`)
			let ytLink = `https://yt-downloader.akkun3704.repl.co/?url=${url}&filter=&quality=&contenttype=`
			switch (opt) {
				case '--doc':
				if (res.videoDetails.lengthSeconds > 1800) {
					let caption = `*Title:* ${res.videoDetails.title}\n*Views:* ${res.videoDetails.viewCount}\n*Duration:* ${clockString(res.videoDetails.lengthSeconds)}\n*Download:* ${ytLink}\n\n_Filesize too big_`
					await wa.mediaURL(msg.from, `https://i.ytimg.com/vi/${res.videoDetails.videoId}/0.jpg`, { quoted: msg, caption })
				} else {
					await wa.custom(msg.from, { url: ytLink }, 'documentMessage', { mimetype: 'video/mp4', filename: res.videoDetails.title + '.mp4', quoted: msg })
				}
				break
				default:
				if (res.videoDetails.lengthSeconds > 1800) {
					let caption = `*Title:* ${res.videoDetails.title}\n*Views:* ${res.videoDetails.viewCount}\n*Duration:* ${clockString(res.videoDetails.lengthSeconds)}\n*Download:* ${ytLink}\n\n_Filesize too big_`
					await wa.mediaURL(msg.from, `https://i.ytimg.com/vi/${res.videoDetails.videoId}/0.jpg`, { quoted: msg, caption })
				} else {
					let caption = `*Title:* ${res.videoDetails.title}`
					await wa.custom(msg.from, { url: ytLink }, 'videoMessage', { quoted: msg, caption })
				}
			}
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, 'Something went wrong, check back later.', msg)
		}
	}
}

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms % (3600 * 24) / 3600)
	let m = isNaN(ms) ? '--' : Math.floor(ms % 3600 / 60)
	let s = isNaN(ms) ? '--' : Math.floor(ms % 60)
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
