const axios = require('axios')
const mime = require('mime-types')
const cheerio = require('cheerio')

module.exports = {
	name: 'mediafire',
	category: 'Downloader',
	async execute(msg, wa, args) {
		const { from } = msg
		if (!args[0]) return wa.reply(from, 'Input url', msg)
		mediafireDl(args[0]).then(async (res) => {
			await wa.reply(from, JSON.stringify(res, null, 2), msg)
			let mimetype = await mime.lookup(res.link)
			await wa.custom(from, { url: res.link }, 'documentMessage', { quoted: msg, filename: res.title, mimetype })
		}).catch(e => wa.reply(msg.from, String(e), msg))
	}
}

function mediafireDl(url) {
	return new Promise((res, rej) => {
		if (!/https?:\/\//.test(url) || !url.includes('mediafire')) return reject('Invalid url!')
		axios(url).then(c => {
			let $ = cheerio.load(c.data)
			let title = $('div.dl-btn-label').attr('title')
			let size = $('a#downloadButton').text().split('\n')[1].replace(/ /g, '').replace(/\(|\)/g, '').replace('Download', '')
			let link = $('a#downloadButton').attr('href')
			res({ title, size, link })
		}).catch(rej)
	})
}
