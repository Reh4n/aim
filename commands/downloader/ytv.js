const axios = require('axios')
const lang = require('../other/text.json')
const { ytv } = require('../../utils/youtube')
const { fetchText, textParse } = require('../../utils')
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
			let res = await ytv(url)
			switch (opt) {
				case '--doc':
				if (res.filesize >= 100 << 10) {
					let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
					let caption = `*Title:* ${res.title}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize too big_`
					await wa.mediaURL(msg.from, res.thumb, { quoted: msg, caption })
				} else {
					await wa.custom(msg.from, await getBuffer(res.dl_link, { skipSSL: true }), 'documentMessage', { mimetype: 'video/mp4', filename: res.title + '.mp4', quoted: msg })
				}
				break
				default:
				if (res.filesize >= 100 << 10) {
					let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
					let caption = `*Title:* ${res.title}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize too big_`
					await wa.mediaURL(msg.from, res.thumb, { quoted: msg, caption })
				} else {
					await wa.custom(msg.from, await getBuffer(res.dl_link, { skipSSL: true }), 'videoMessage', { quoted: msg, caption })
				}
			}
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, 'Something went wrong, check back later.', msg)
		}
	}
}

async function getBuffer(url, opt = {}) {
	if (opt.skipSSL) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
	let res = await axios(url, { responseType: 'arraybuffer' })
	if (res.status !== 200) throw res.statusText
	return res.data
}
