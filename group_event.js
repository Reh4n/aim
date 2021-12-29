const ev = require("./core/connect").Whatsapp
const { checkData, getData, deleteData } = require("./databases/group_setting")

module.exports = joinHandler = async (data) => {
    // For Bot
    const gM = await ev.groupMetadata(data.jid);
    if (data.action === "add" && data.participants.includes(ev.user.jid)) {
        if (gM.participants.length < 80) {
            await ev.sendMessage(data.jid, "Sorry, but this group member is not more than 80 members, I leave soon.", "conversation")
            .then(async () => {
                await ev.groupLeave(data.jid);
                setTimeout(async () => { await ev.modifyChat(data.jid, "delete") }, 5000);
            })
        } else {
            let ids = [];
            for (let id of gM.participants) {
                id.isAdmin ? ids.push(id.jid) : ''
            }
            await ev.sendMessage(data.jid, "Thanks for letting me join your group :D", "conversation", { contextInfo: { mentionedJid: ids } });
        }
    } else if (data.action === "remove" && data.participants.includes(ev.user.jid)) {
        let info = checkData(data.jid.split('@')[0])
        if (info !== "no_file") { deleteData(data.jid.split('@')[0]) }
    }

    // For User
    if (data.action === "add" && !data.participants.includes(ev.user.jid)) {
        let id = data.jid.split('@')[0]
        let info = checkData(id)
        let replace = {
            '%': '%',
            member: data.participants.length > 0 ? (data.participants.map((v) => {
                return "@" + v.split('@')[0]
            })).join(' ') : "@" + data.participants[0].split('@')[0],
            user: data.participants.length > 0 ? (data.participants.map((v) => {
                return "@" + v.split('@')[0]
            })).join(' ') : "@" + data.participants[0].split('@')[0],
            group: gM?.subject,
            desc: gM?.desc
        }
        if (info !== "no_file") {
            const dataConf = getData(id)
            let text = dataConf["join"]["msg"].replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, "g"), (_, name) => '' + replace[name])
            if (dataConf["join"]["active"]) {
                await ev.sendMessage(data.jid, text, "conversation", { contextInfo: { mentionedJid: data.participants } })
            }
        }
    } else if (data.action === "remove" && !data.participants.includes(ev.user.jid)) {
        let id = data.jid.split('@')[0]
        let info = checkData(id)
        let replace = {
            '%': '%',
            member: data.participants.length > 0 ? (data.participants.map((v) => {
                return "@" + v.split('@')[0]
            })).join(' ') : "@" + data.participants[0].split('@')[0],
            user: data.participants.length > 0 ? (data.participants.map((v) => {
                return "@" + v.split('@')[0]
            })).join(' ') : "@" + data.participants[0].split('@')[0],
            group: gM?.subject,
            desc: gM?.desc
        }
        if (info !== "no_file") {
            const dataConf = getData(id)
            let text = dataConf["left"]["msg"].replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, "g"), (_, name) => '' + replace[name])
            if (dataConf["left"]["active"]) {
                await ev.sendMessage(data.jid, text, "conversation", { contextInfo: { mentionedJid: data.participants } })
            }
        }
    }
}