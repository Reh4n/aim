const axios = require('axios')
const cheerio = require('cheerio')
const { toPDF } = require('../../utils')
const ev = require('../../core/connect').Whatsapp

module.exports = {
	name: 'mynimekudl',
	category: 'weebs',
	desc: 'Download anime/manga from web mynimeku.',
	use: '[options] url\n\n- *Options* -\n\n1. anime\n2. manga\n\nEx: !mynimeku anime url',
	async execute(msg, wa, args) {
		try {
			const { from } = msg
			if (!args[0]) return wa.reply(from, 'URL needed', msg)
			switch (args[0].toLowerCase()) {
				case 'anime': {
					if (!args[1]) return wa.reply(from, 'URL needed', msg)
					let { title, thumb, url } = await downloadNimek(args[1])
					let { data: thumbnail } = await axios.get(thumb, { responseType: 'arraybuffer' })
					await wa.reply(from, 'Loading...', msg)
					await ev.sendMessage(from, { url }, 'documentMessage', { quoted: msg, filename: `${title}.mp4`, mimetype: 'video/mp4', thumbnail })
					break
				}
				case 'manga': case 'komik': {
					if (!args[1]) return wa.reply(from, 'URL needed', msg)
					let { title, result } = await downloadKomik(args[1])
					let { data: thumbnail } = await axios.get(result[0], { responseType: 'arraybuffer' })
					await wa.reply(from, 'Loading...', msg)
					data = await toPDF(result)
					await ev.sendMessage(from, data, 'documentMessage', { quoted: msg, filename: `${title}.pdf`, mimetype: 'application/pdf', thumbnail })
					break
				}
				default:
					let { title, thumb, url } = await downloadNimek(args[0])
					let { data: thumbnail } = await axios.get(thumb, { responseType: 'arraybuffer' })
					await wa.reply(from, 'Loading...', msg)
					await ev.sendMessage(from, { url }, 'documentMessage', { quoted: msg, filename: `${title}.mp4`, mimetype: 'video/mp4', thumbnail })
			}
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, String(e), msg)
		}
	}
}

function downloadNimek(url) {
	return new Promise((resolve, reject) => {
		axios.get(url).then(({ data }) => {
			let $ = cheerio.load(data)
			let title = $('title').text()
			let thumb = $('meta[property="og:image"]').attr('content')
			let url = $('#linklist').find('a').attr('href')
			resolve({ title, thumbnail, url })
		}).catch(reject)
	})
}

function downloadKomik(url) {
	return new Promise((resolve, reject) => {
		axios.get(url).then(({ data }) => {
			let $ = cheerio.load(data)
			let title = $('title').text()
			let result = []
			$('div.reader-area > p > img').get().map(v => result.push($(v).attr('src')))
			resolve({ title, result })
		}).catch(reject)
	})
}
