const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
	name: 'owner',
	category: 'misc',
	execute(msg) {
		ev.sendMessage(msg.from, { displayName: 'Owner', vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Ripp\nTEL;type=WORK;waid=212706611366:212706611366\nEND:VCARD`.trim() }, 'contactMessage', { quoted: msg })
	}
}
