const { GroupSettingChange, WA_DEFAULT_EPHEMERAL } = require('@adiwajshing/baileys')
const lang = require('../other/text.json')
const ev = require('../../core/connect').Whatsapp

module.exports = {
    name: 'gcset',
    category: 'Group',
    desc: 'Change your group setting.',
    use: '<group_setting> <on|off|admin|everyone>',
    aliases: ['gcst'],
    async execute(msg, wa, args) {
        const { from, sender, isGroup } = msg
        const meta = isGroup ? ev.chats.get(from).metadata : ''
        const members = isGroup ? meta.participants : ''
        const admins = isGroup ? getAdmins(members) : ''
        const cekAdmin = (i) => admins.includes(i)

        if (!isGroup) return wa.sendText(from, `Only can be executed in group.`)
        if (args.length < 1) return wa.reply(from, 'Here all available group setting, ephemeral | edit_group | send_message', msg)
        if (!cekAdmin(sender)) return wa.reply(from, `IND:\n${lang.indo.group.gcset.noPerms}\n\nEN:\n${lang.eng.group.gcset.noPerms}`, msg)
        if (!cekAdmin(ev.user.jid)) return wa.reply(from, `IND:\n${lang.indo.group.gcset.botNoPerms}\n\nEN:\n${lang.eng.group.gcset.botNoPerms}`, msg)

        let setting = args[0].toLowerCase()
        switch (setting) {
            case 'ephemeral':{
                if (args.length < 2) return wa.reply(from, 'Some argument appear to be missing', msg)
                let condition = args[1].toLowerCase()
                switch (condition) {
                    case 'on': case 'aktif':
                        await ev.toggleDisappearingMessages(from, WA_DEFAULT_EPHEMERAL, { waitForAck: true })
                        break;
                    case 'off': case 'mati':
                        await ev.toggleDisappearingMessages(from, 0, { waitForAck: true })
                        break;
                    default:
                        wa.reply(from, 'Select setting condition, on/off', msg)
                }
                break
            }
            case 'edit_group':{
                if (args.length < 2) return wa.reply(from, 'Some argument appear to be missing', msg)
                let condition = args[1].toLowerCase()
                switch (condition) {
                    case 'admin':
                        await ev.groupSettingChange(from, GroupSettingChange.settingsChange, true)
                        break;
                    case 'everyone':
                        await ev.groupSettingChange(from, GroupSettingChange.settingsChange, false)
                        break;
                    default:
                        wa.reply(from, 'Select who can edit group info, admin/everyone', msg)
                }
                break;
            }
            case 'send_message':{
                if (args.length < 2) return wa.reply(from, 'Some argument appear to be missing', msg)
                let condition = args[1].toLowerCase()
                switch (condition) {
                    case 'admin':
                        await ev.groupSettingChange(from, GroupSettingChange.messageSend, true)
                        break;
                    case 'everyone':
                        await ev.groupSettingChange(from, GroupSettingChange.messageSend, false)
                        break;
                    default:
                        wa.reply(from, 'Select who can send message to this group, admin/everyone', msg)
                }
                break;
            }
            default:
                wa.reply(from, 'Here all available group setting, ephemeral | edit_group | send_message', msg)
        }
    }
}

function getAdmins(a) {
    let admins = []
    for (let i of a) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}