const axios = require('axios')
const cheerio = require('cheerio')
const { toPDF } = require('../../utils')

module.exports = {
	name: 'mynimekudl',
	category: 'weebs',
	desc: 'Download anime/manga from web mynimeku.',
	use: '[options] url\n\n- *Options* -\n\n1. anime\n2. manga\n\nEx: !mynimeku anime url',
	async execute(msg, wa, args) {
		try {
			let data
			switch (args[0].toLowerCase()) {
				case 'anime':
					data = await downloadNimek(args[1])
					console.log(data)
					await ev.sendMessage(msg.from, { url: data }, 'videoMessage', { quoted: msg })
				break
				case 'manga': case 'komik':
					let { title, result } = await downloadKomik(args[1])
					let { data: thumbnail } = await axios.get(result[0], { responseType: 'arraybuffer' })
					console.log(title, result)
					data = await toPDF(result)
					await ev.sendMessage(msg.from, data, 'documentMessage', { quoted: msg, filename: `${title}.pdf`, thumbnail })
				break
				default: 
					data = await downloadNimek(args[0])
					console.log(data)
					await ev.sendMessage(msg.from, { url: data }, 'videoMessage', { quoted: msg })
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
			let result = $('#linklist').find('a').attr('href')
			resolve(result)
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
