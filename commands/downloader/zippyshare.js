module.exports = {
	name: 'zippyshare',
	aliases: ['zs', 'zippydl'],
	category: 'Downloader',
	async execute(msg, wa, args) {
		try {
			if (!args.join(' ')) return wa.reply(msg.from, 'Input URL', msg)
			await wa.reply(msg.from, 'Loading...', msg)
			let { download, filename } = await require('zs-extract').extract(args[0])
			let mimetype = await require('mime-types').lookup(download)
			await wa.custom(msg.from, { url: download }, 'documentMessage', { quoted: msg, mimetype, filename })
		} catch (e) {
			console.log(e)
			wa.reply(msg.from, String(e), msg)
		}
	}
}
