const { owner } = require('../../config.json')
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
  name: 'clearchat',
  aliases: ['deletechat', 'mutechat'],
  async execute(msg, wa, args) {
    const { from, body, sender } = msg
    if (!owner.includes(sender)) return
    let chats
    if (/group|gc/i.test(args[0])) chats = ev.chats.array.filter(v => /g.us/.test(v.jid) && !v.pin).map(v => v.jid)
    else if (/chat|private/i.test(args[0])) chats = ev.chats.array.filter(v => /net/.test(v.jid) && !v.pin).map(v => v.jid)
    else if (/all/i.test(args[0])) chats = ev.chats.array.filter(v => v.jid && !v.pin).map(v => v.jid)
    else chats = [from]
    let isDelete = /^(delete)/i.test(body)
    let isClear = /^(clear)/i.test(body)
    for (let id of chats) {
      if (isDelete || isClear) await ev.modifyChat(id, (isDelete ? 'delete' : 'clear')).catch(console.log)
      else await ev.modifyChat(id, 'mute', -Math.floor(new Date / 1e3) * 1e3 - 1e3).catch(console.log)
    }
    wa.reply(from, chats.length + ` chat ${args[0] ? args[0] : ''} telah dib` + ((isDelete || isClear) ? 'ersihkan' : 'isukan selamanya'), msg)
  }
}
