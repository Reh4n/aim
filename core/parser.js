const { Whatsapp: ev } = require('./connect')

module.exports = {
	async buttonsParser(m) {
		const { from } = m
		let context = m.message.buttonsResponseMessage.selectedDisplayText.toLowerCase()
		switch (context) {
			case "source code": {
				await ev.sendMessage(from, "https://github.com/FaizBastomi/wbot/", "extendedTextMessage", { detectLinks: true, quoted: m })
				break
			}
			case "owner": {
				await ev.sendMessage(from, { displayName: 'Owner', vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Ripp\nTEL;type=WORK;waid=212706611366:212706611366\nEND:VCARD`.trim() }, 'contactMessage', { quoted: m })
				break
			}
		}
	}
}
