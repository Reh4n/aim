const axios = require('axios')
const cheerio = require('cheerio')
const { toPDF } = require('../../utils')
const { search, getDoujin } = require('nhentai-node-api')
const { compressImage } = require('@adiwajshing/baileys')

module.exports = {
	name: 'getdoujin',
	aliases: ['getdojin'],
	category: 'weebs',
	use: 'Ex: !getdoujin 1 <reply chat bot>',
	async execute(msg, wa, args) {
		try {
			const { from, quoted } = msg
			if (quoted && quoted.key.fromMe && quoted.key.id.startsWith('3EB0') && quoted.key.id.endsWith('DOUDESU')) {
				if (!args[0]) return wa.reply(from, 'Input code', msg)
				if (isNaN(args[0])) return wa.reply(from, 'Code must be number', msg)
				await wa.reply(from, 'Loading...', msg)
				let quotedText = quoted.message.conversation || quoted.message.extendedTextMessage.text
				let res = await getLink(quotedText.split('\n\n')[args[0] - 1].split('Link: ')[1])
				let { title, images } = await download(res[0])
				let buffer = await toPDF(images)
				let thumbnail = await compressImage(images[0])
				await wa.custom(from, buffer, 'documentMessage', { quoted: msg, filename: `${title}.pdf`, mimetype: 'application/pdf', thumbnail })
			}
		} catch (e) {
			wa.reply(msg.from, String(e), msg)
		}
	}
}

function getLink(url) {
	return new Promise((resolve, reject) => {
		// if (!/https?:\/\//.test(url)) return reject('Invalid url!')
		axios.get(url).then(({ data }) => {
			let $ = cheerio.load(data)
			let result = Array.from($('div.epsright > span.eps').get().map(v => $(v).find('a').attr('href')))
			resolve(result)
		}).catch(reject)
	})
}

function download(url) {
	return new Promise((resolve, reject) => {
		// if (!/https?:\/\//.test(url)) return reject('Invalid url!')
		axios.get(url).then(({ data }) => {
			let $ = cheerio.load(data)
			let title = $('div.lm').find('h1').text()
			let link = $('div.chright').find('a').attr('href')
			let images = Array.from($('div.reader-area > img').get().map(v => $(v).attr('src')))
			resolve({ title, link, images })
		}).catch(reject)
	})
}
