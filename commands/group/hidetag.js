const con = require('../../core/connect')
const lang = require('../other/text.json')
const ev = con.Whatsapp

module.exports = {
    name: 'hidetag',
    aliases: ['htag'],
    desc: 'Tag all member',
    category: 'Group',
    async execute(msg, wa, args) {
        const { from, sender, isGroup } = msg
        const meta = isGroup ? ev.chats.get(from).metadata : ''
        const groupMem = isGroup ? meta.participants : ''
        const admin = isGroup ? getAdmin(groupMem) : ''
        const cekAdmin = (m) => admin.includes(m)
        
        if (!isGroup) return wa.sendText(from, `Only can be executed in group.`)
        if (!cekAdmin(sender)) return wa.reply(from, `IND:\n${lang.indo.group.tagall.noPerms}\n\nEN:\n${lang.eng.group.tagall.noPerms}`, msg)
        let mems_id = []
        let text = args.length > 0 ? args.join(' ') : ''
        for (let i of groupMem) {
            mems_id.push(i.jid)
        }
        await ev.sendMessage(from, text, 'extendedTextMessage', { contextInfo: { mentionedJid: mems_id } })
    }
}

function getAdmin(a) {
    let admins = []
    for (let _ of a) {
        _.isAdmin ? admins.push(_.jid) : ''
    }
    return admins
}
