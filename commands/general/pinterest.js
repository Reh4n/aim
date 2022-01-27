module.exports = {
	name: 'pinterest',
	aliases: ['pin'],
	category: 'general',
	desc: 'Search image from pinterest.',
	async execute(msg, wa, args) {
		if (!args.join(' ')) return wa.reply(msg.from, 'Input query', msg)
		await wa.reply(msg.from, 'Loading...', msg)
		pinterest(args.join(' ')).then(res => {
			wa.mediaURL(msg.from, res, { quoted: msg, caption: `Hasil Pencarian: ${args.join(' ')}\nUrl: ${res}` })
		}).catch(wa.reply)
	}
}

function pinterest(query) {
	return new Promise((resolve, reject) => {
		require('axios')(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`).then(({ data }) => {
			resolve(data.resource_response.data.results[Math.floor(Math.random() * (data.resource_response.data.results.length))].images.orig.url)
		}).catch(reject)
	})
}
