const con = require('../../core/connect');
const djs = require('@discordjs/collection');
const lang = require('../other/text.json');
const ev = con.Whatsapp

module.exports = {
    name: 'promote',
    category: 'Group',
    desc: 'Promote someone to be admin.',
    async execute(msg, wa) {

        try {
            const { prefix } = djs
            const { mentionedJid, quoted, from, sender, isGroup, body } = msg
            const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

            const meta = isGroup ? await ev.chats.get(from).metadata : ''
            const admin = isGroup ? getAdmin(meta.participants) : ''
            const cekAdmin = (m) => admin.includes(m)
            const checkInGroup = (m) => {
                let members = []
                for (let id of meta.participants) {
                    members.push(id.jid)
                }
                return members.includes(m)
            }

            if (!isGroup) return wa.sendText(from, `Only can be executed in group.`)
            if (!cekAdmin(sender)) return wa.reply(from, `IND:\n${lang.indo.group.promote.noPerms}\n\nEN:\n${lang.eng.group.promote.noPerms}`, msg)
            if (!cekAdmin(ev.user.jid)) return wa.reply(from, `IND:\n${lang.indo.group.promote.botNoPerms}\n\nEN:\n${lang.eng.group.promote.botNoPerms}`, msg)

            if (quoted) {
                const mention = quoted.participant
                if (!checkInGroup(mention)) return wa.reply(from, "Member no longer in group", msg)
                if (cekAdmin(mention)) return wa.reply(from, `IND:\n${lang.indo.group.promote.fail}\n\nEN:\n${lang.eng.group.promote.fail}`, msg)
                await ev.groupMakeAdmin(from, [mention])
                wa.reply(from, `IND:\n${lang.indo.group.promote.success}\n\nEN:\n${lang.eng.group.promote.success}`, msg)
            } else if (mentionedJid) {
                const mention = mentionedJid[0]
                if (!checkInGroup(mention)) return wa.reply(from, "Member no longer in group", msg)
                if (cekAdmin(mention)) return wa.reply(from, `IND:\n${lang.indo.group.promote.fail}\n\nEN:\n${lang.eng.group.promote.fail}`, msg)
                await ev.groupMakeAdmin(from, [mention])
                wa.reply(from, `IND:\n${lang.indo.group.promote.success}\n\nEN:\n${lang.eng.group.promote.success}`, msg)
            } else {
                wa.reply(from, `How to: *${prefix + command} @mentionMember*\nor you can reply someone message with *${prefix + command}*`, msg)
            }
        } catch (e) {
            wa.reply(msg.from, `IND:\n${lang.indo.group.promote.fail}\n\nEN:\n${lang.eng.group.promote.fail}`, msg)
        }
    }
}

function getAdmin(participants) {
    let admins = new Array()
    for (let _ of participants) {
        _.isAdmin ? admins.push(_.jid) : ''
    }
    return admins
}