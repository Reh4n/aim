const axios = require('axios')
const { load } = require('cheerio')
const { fromBuffer } = require('file-type')
const { fetchBuffer } = require('../../utils')

module.exports = {
	name: 'mediafire',
	category: 'downloader',
	async execute(msg, wa, args) {
		try {
			const { from } = msg
			if (!args[0]) return wa.reply(from, 'Input url', msg)
			// await wa.reply(from, 'Loading...', msg)
			let res = await mediafireDl(args[0])
			await wa.reply(from, JSON.stringify(res, null, 2), msg)
			let buff = await fetchBuffer(res.link)
			let { ext, mime: mimetype } = await fromBuffer(buff)
			// let filename = `${res.title}.${ext}`
			await wa.custom(from, buff, 'documentMessage', { quoted: msg, filename: res.title, mimetype })
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, String(e), msg)
		}
	}
}

function mediafireDl(url) {
	return new Promise((res, rej) => {
		if (!/https?:\/\//.test(url)) return reject('Invalid url!')
		axios(url).then(c => {
			let $ = load(c.data)
			let title = $('div.dl-btn-label').attr('title')
			let size = $('a#downloadButton').text().split('\n')[1].replace(/ /g, '').replace(/\(|\)/g, '').replace('Download', '')
			let link = $('a#downloadButton').attr('href')
			res({ title, size, link })
		}).catch(rej)
	})
}
