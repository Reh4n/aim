/*
const { extract } = require('zs-extract')
const { fromBuffer } = require('file-type')
const { fetchBuffer } = require('../../utils')

module.exports = {
	name: 'zippyshare',
	aliases: ['zippydl', 'zippy'],
	category: 'downloader',
	async execute(msg, wa, args) {
		const { from } = msg
		if (!args[0]) return wa.reply(from, 'URL Needed', msg)
		if (!args[0].includes('zippyshare')) return wa.reply(from, 'Invalid URL', msg)
		await wa.reply(from, 'Loading...', msg)
		let { download, filename } = await extract(args[0])
		download = await fetchBuffer(download)
		let { mime: mimetype } = await fromBuffer(download)
		wa.custom(from, download, 'documentMessage', { quoted: msg, filename, mimetype })
	}
}
*/
