const yts = require('ytsr')
const { fetchText } = require('../../utils')
const { Whatsapp: ev } = require('../../core/connect')
const { compressImage } = require('@adiwajshing/baileys')

module.exports = {
	name: 'play',
	category: 'Downloader',
	desc: 'Play media from YouTube.',
	async execute(msg, wa, args) {
		const { from } = msg
		if (args.length < 1) return wa.reply(from, 'No query given to search.', msg)
		const { items: s } = await yts(args.join(' '))
		if (s.length === 0) return wa.reply(from, 'No video found for that keyword, try another keyword', msg)
		// const b = await compressImage(s[0].thumbnails[0].url)
		let ytLink = `https://yt-downloader.akkun3704.repl.co/?url=${s[0].url}&filter=audioonly&quality=highest&contenttype=audio/mp3`
		const struct = {
			imageMessage: (await ev.prepareMessageMedia({ url: s[0].thumbnails.url }, 'imageMessage')).imageMessage,
			contentText: `📙 Title: ${s[0].title}\n📎 Url: ${s[0].url}\n🚀 Upload: ${s[0].uploadedAt}\n\nWant a video version? click button below, or you don\'t see it? type *!ytv youtube_url*\n\nAudio on progress....`,
			footerText: 'Nyarlathotep-Bot ⬩ Made by XÆ15 - T',
			headerType: 'IMAGE',
			buttons: [{
				buttonText: { displayText: 'Video' }, buttonId: `#ytv ${s[0].url} SMH`, type: 1
			}]
		}
		await ev.sendMessage(from, struct, 'buttonsMessage', { quoted: msg }).then(async (msg) => {
			try {
				if (s[0].duration.replace(/\D/g, '') > 10000) {
					let caption = `*Title:* ${s[0].title}\n*Views:* ${s[0].views}\n*Duration:* ${s[0].duration}\n*Download:* ${ytLink}\n\n_Filesize too big_`
					await wa.mediaURL(from, s[0].thumbnails[0].url, { quoted: msg, caption })
				} else {
					await wa.custom(from, { url: ytLink }, 'audioMessage', { mimetype: 'audio/mp4', quoted: msg })
				}
			} catch (e) {
				wa.reply(msg.from, String(e), msg)
			}
		})
	}
}
