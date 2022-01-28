const yts = require('ytsr')
const { fetchBuffer, fetchText } = require('../../utils')
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
	name: 'play',
	category: 'Downloader',
	desc: 'Play media from YouTube.',
	async execute(msg, wa, args) {
		const { from } = msg
		if (args.length < 1) return wa.reply(from, 'No query given to search.', msg)
		const { items: s } = await yts(args.join(' '))
		if (s.length === 0) return wa.reply(from, 'No video found for that keyword, try another keyword', msg)
		const b = await fetchBuffer(s[0].thumbnails[0].url)
		let dl_link = `https://yt-downloader.akkun3704.repl.co/?url=${s[0].url}&filter=audioonly&quality=highest&contenttype=audio/mp3`
		const res = await fetchBuffer(dl_link)
		const struct = {
			locationMessage: { jpegThumbnail: b.toString('base64') },
			contentText: `📙 Title: ${s[0].title}\n📎 Url: ${s[0].url}\n🚀 Upload: ${s[0].uploadedAt}\n\nWant a video version? click button below, or you don\'t see it? type *!ytv youtube_url*\n\nAudio on progress....`,
			footerText: 'Nyarlathotep-Bot ⬩ Made by XÆ15 - T',
			headerType: 6,
			buttons: [{
				buttonText: { displayText: 'Video' }, buttonId: `#ytv ${s[0].url} SMH`, type: 1
			}]
		}
		await wa.custom(from, struct, 'buttonsMessage', { quoted: msg }).then(async (msg) => {
			try {
				if (res.length > 15000000) {
					let caption = `*Title:* ${items[0].title}\n*Views:* ${items[0].views}\n*Duration:* ${items[0].duration}\n*Download:* ${dl_link}`
					wa.mediaURL(from, s[0].thumbnails[0].url, { quoted: msg, caption })
				} else {
					wa.custom(from, res, 'audioMessage', { mimetype: 'audio/mp4', quoted: msg })
				}
			} catch (e) {
				wa.reply(msg.from, String(e), msg)
			}
		})
	}
}
