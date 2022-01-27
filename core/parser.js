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
		}
	}
}
