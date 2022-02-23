const { Whatsapp: ev } = require('../../core/connect')
const { owner } = require('../../config.json')

module.exports = {
  name: 'owner',
  category: 'misc',
  execute(msg, wa) {
    if (owner.length < 2) {
      let name = wa.getContactInfo(owner[0])
      name = name.notify || name.short || name.name || owner[0].split('@')[0]
      let num = owner[0].split('@')[0]
      ev.sendMessage(msg.from, { displayName: 'Owner', vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=WORK;waid=${num}:${num}\nEND:VCARD` }, 'contactMessage', { quoted: msg })
    } else {
      let contacts = []
      for (let x of owner) {
        let name = wa.getContactInfo(x)
        name = name.notify || name.short || name.name || x.split('@')[0]
        let num = x.split('@')[0]
        contacts.push({ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=WORK;waid=${num}:${num}\nEND:VCARD` })
      }
      ev.sendMessage(msg.from, { displayName: contacts.length + ' kontak', contacts }, 'contactsArrayMessage', { quoted: msg })
    }
  }
}
