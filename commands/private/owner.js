const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
	name: 'owner',
	category: 'misc',
	execute(msg) {
		ev.sendMessage(msg.from, { displayName: 'Owner', vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:LitRHap\nTEL;type=WORK;waid=818056745907:818056745907\nEND:VCARD`.trim() }, 'contactMessage', { quoted: msg })
	}
}
