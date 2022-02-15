const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
  name: 'setppgc',
  aliases: ['setppgroup', 'setppgrup'],
  category: 'Group',
  async execute(msg, wa) {
    try {
      const { from, type, quoted, sender, isGroup } = msg
      const meta = isGroup ? ev.chats.get(from).metadata : ''
      const groupMem = isGroup ? meta.participants : ''
      const admin = isGroup ? getAdmin(groupMem) : ''
      const cekAdmin = (m) => admin.includes(m)
      
      if (!isGroup) return wa.sendText(from, `Only can be executed in group.`)
      if (!cekAdmin(sender)) return wa.reply(from, "you are not the group admin.", msg)
      if (!cekAdmin(ev.user.jid)) return wa.reply(from, "Bots are not group admins.", msg)
      const content = JSON.stringify(quoted)
      const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage')
      const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage')
      if (type === 'imageMessage' || isQImg || (isQDoc && /image/.test(quoted.message.documentMessage.mimetype))) {
        const encmed = (isQImg || isQDoc) ? quoted : msg
        const media = await ev.downloadMediaMessage(encmed)
        ev.updateProfilePicture(from, media).then(() => wa.reply(from, 'Success update profile picture group!', msg))
      }
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}

function getAdmin(a) {
  let admins = []
  for (let _ of a) {
    _.isAdmin ? admins.push(_.jid) : ''
  }
  return admins
}
