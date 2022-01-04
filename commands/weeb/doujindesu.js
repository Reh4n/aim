const axios = require('axios')
const cheerio = require('cheerio')
const { toPDF, fetchBuffer } = require('../../utils')
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
	name: 'doujindesu',
	aliases: ['dd'],
	category: 'weebs',
	desc: 'Download/Search doujin hentai from web doujindesu.',
	use: '[options] query|url\n\n- *Options* -\n\n1. pdf\n2. search\n\nEx: !doujindesu pdf https://doujindesu.id/2021/11/26/15-fun-no-zangyou/',
	async execute(msg, wa, args) {
		try {
			const { from } = msg
			let type = (args[0] || '').toLowerCase()
			switch (type) {
				case 'latest': {
					await wa.reply(from, 'Loading...', msg)
					let res = await getLatest()
					let thumbnail = await fetchBuffer(res[0].thumb)
					await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nChapter: ${v.chapter.replace('Ch. ', '')}\nType: ${v.type}\nLink: ${v.link}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res[0].title, body: 'Doujindesu Latest', thumbnail, sourceUrl: res[0].link }}})
					break
				}
				case 'search': {
					if (!args[1]) return wa.reply(from, 'Input query', msg)
					await wa.reply(from, 'Loading...', msg)
					let res = await search(args.splice(1).join(' '))
					let thumbnail = await fetchBuffer(res[0].thumb)
					await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nScore: ${v.score}\nType: ${v.type}\nStatus: ${v.status}\nLink: ${v.link}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res[0].title, body: 'Doujindesu Search', thumbnail, sourceUrl: res[0].link }}})
					break
				}
				case 'pdf': {
					if (!args[1]) return wa.reply(from, 'Input code', msg)
					await wa.reply(from, 'Loading...', msg)
					let { title, images } = await download(args[1])
					let buffer = await toPDF(images)
					let thumbnail = await fetchBuffer(images[0])
					await wa.custom(from, buffer, 'documentMessage', { quoted: msg, filename: `${title}.pdf`, mimetype: 'application/pdf', thumbnail })
					break
				}
				default:
					await wa.reply(from, 'Loading...', msg)
					let res = await getLatest()
					let thumbnail = await fetchBuffer(res[0].thumb)
					await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nChapter: ${v.chapter.replace('Ch. ', '')}\nType: ${v.type}\nLink: ${v.link}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, contextInfo: { externalAdReply: { title: res[0].title, body: 'Doujindesu Latest', thumbnail, sourceUrl: res[0].link }}})
			}
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, String(e), msg)
		}
	}
}

function getLatest() {
	return new Promise((resolve, reject) => {
		axios.get(`https://doujindesu.xxx/`).then(({ data }) => {
			let $ = cheerio.load(data)
			let result = []
			$('div.animposx').each(function() {
				let title = $(this).find('a').attr('alt')
				let chapter = $(this).find('div.plyepisode').find('a').text().trim()
				let type = $(this).find('div.type').text()
				let score = $(this).find('div.score').text().trim()
				let thumb = $(this).find('img').attr('src')
				let link = $(this).find('div.plyepisode').find('a').attr('href')
				result.push({ title, chapter, type, score, thumb, link })
			})
			resolve(result)
		}).catch(reject)
	})
}

function search(query) {
	return new Promise((resolve, reject) => {
		axios.get(`https://doujindesu.xxx/?s=${query}`).then(({ data }) => {
			let $ = cheerio.load(data)
			let result = []
			$('div.animposx').each(function() {
				let title = $(this).find('div.title').text().trim()
				let score = $(this).find('div.score').text().trim()
				let type = $(this).find('div.type').text().replace(/publishing|finished/i, '')
				let status = $(this).find('div.type').text().replace(/manhwa|manga|doujinshi/i, '')
				let thumb = $(this).find('img').attr('src')
				let link = $(this).find('a').attr('href')
				result.push({ title, score, type, status, thumb, link })
			})
			resolve(result)
		}).catch(reject)
	})
}

function download(url) {
	return new Promise((resolve, reject) => {
		if (!/https?:\/\//.test(url)) return reject('Invalid url!')
		axios.get(url).then(({ data }) => {
			let $ = cheerio.load(data)
			let title = $('div.lm').find('h1').text()
			let link = $('div.chright').find('a').attr('href')
			let images = []
			$('div.reader-area > img').each(function() {
				images.push($(this).attr('src'))
			})
			resolve({ title, link, images })
		}).catch(reject)
	})
}
