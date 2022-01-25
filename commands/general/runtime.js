module.exports = {
	name: 'runtime',
	aliases: ['uptime'],
	category: 'general',
	async execute(msg, wa) {
		wa.reply(msg.from, clockString(process.uptime()), msg)
	}
}

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / (3600 * 24))
	let h = isNaN(ms) ? '--' : Math.floor(ms % (3600 * 24) / 3600)
	let m = isNaN(ms) ? '--' : Math.floor(ms % 3600 / 60)
	let s = isNaN(ms) ? '--' : Math.floor(ms % 60)
	let dDisplay = d > 0 ? d + (d == 1 ? ' Hari ' : ' Hari ') : ''
	let hDisplay = h > 0 ? h + (h == 1 ? ' Jam ' : ' Jam ') : ''
	let mDisplay = m > 0 ? m + (m == 1 ? ' Menit ' : ' Menit ') : ''
	let sDisplay = s > 0 ? s + (s == 1 ? ' Detik' : ' Detik') : ''
	return dDisplay + hDisplay + mDisplay + sDisplay
}
