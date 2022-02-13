const axios = require('axios')
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
	name: 'pinterest',
	aliases: ['pin'],
	category: 'general',
	desc: 'Search image from pinterest.',
	async execute(msg, wa, args) {
		let q = args.join(' ')
		if (!q) return wa.reply(msg.from, 'Input query', msg)
		q = q.endsWith('SMH') ? q.replace('SMH', '') : q
		await wa.reply(msg.from, 'Loading...', msg)
		pinterest(q).then(async (res) => {
			if (/gif|video\/mp4/.test(res)) return wa.custom(msg.from, { url: res }, 'videoMessage', { quoted: msg, caption: `Result From: ${q}\nUrl: ${res}` })
			let buttonsMessage = {
				imageMessage: (await ev.prepareMessageMedia({ url: res }, 'imageMessage')).imageMessage,
				contentText: `Result From: ${q}`,
				footerText: res,
				headerType: 'IMAGE',
				buttons: [{
					buttonText: { displayText: 'Next' }, buttonId: `#pin ${q} SMH`, type: 1
				}]
			}
			wa.custom(msg.from, buttonsMessage, 'buttonsMessage', { quoted: msg })
		}).catch(e => wa.reply(msg.from, String(e), msg))
	}
}

function pinterest(query) {
	return new Promise((resolve, reject) => {
		axios(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`).then(({ data }) => {
			resolve(data.resource_response.data.results[Math.floor(Math.random() * (data.resource_response.data.results.length))].images.orig.url)
		}).catch(reject)
	})
}
