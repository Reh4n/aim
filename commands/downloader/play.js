const yts = require('ytsr')
const { yta } = require('../../utils/youtube')
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
		if (s.length === 0) return wa.reply(msg.from, 'No video found for that keyword, try another keyword', msg)
		const b = await fetchBuffer(`https://i.ytimg.com/vi/${s[0].id}/0.jpg`)
		const res = await yta(s[0].url)
		const struct = {
			locationMessage: { jpegThumbnail: b.toString('base64') },
			contentText: `📙 Title: ${s[0].title}\n📎 Url: ${s[0].url}\n🚀 Upload: ${s[0].uploadedAt}\n\nWant a video version? click button below, or you don\'t see it? type *!ytv youtube_url*\n\nAudio on progress....`,
			footerText: 'Nyarlathotep-Bot ⬩ Made by XÆ15 - T',
			headerType: 6,
			buttons: [{
				buttonText: { displayText: 'Video' }, buttonId: `#ytv ${s[0].url} SMH`, type: 1
			}]
		}
		await ev.sendMessage(from, struct, 'buttonsMessage', { quoted: msg }).then(async (msg) => {
			try {
				if (res.filesize >= 10 << 10) {
					let short = await fetchText(`https://tinyurl.com/api-create.php?url=${res.dl_link}`)
					let capt = `*Title:* ${res.title}\n*ID:* ${res.id}\n*Quality:* ${res.q}\n*Size:* ${res.filesizeF}\n*Download:* ${short}\n\n_Filesize too big_`
					ev.sendMessage(from, { url: res.thumb }, 'imageMessage', { caption: capt, quoted: msg })
				} else {
					ev.sendMessage(from, { url: res.dl_link }, 'audioMessage', { mimetype: 'audio/mp4', quoted: msg })
				}
			} catch {
				wa.reply(from, 'Something wrong when sending the audio', msg)
			}
		})
	}
}
