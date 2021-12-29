const { checkData, modifyData } = require("../../databases/group_setting")
const ev = require("../../core/connect").Whatsapp
const lang = require("../other/text.json")

module.exports = {
    name: "welcome",
    desc: "Setting warm welcome message in your group",
    category: "Group",
    use: "_options_ _value_\n\n"
        + "*Options*\n~ on - turned on warm welcome message\n"
        + "~ off - turned off warm welcome message\n"
        + "~ message - set custom message\n\n"
        + "Ex:\n!welcome on\n!welcome off\n\n"
        + "For custom message:\n%member - tag new member\n%group - group name\n%desc - group description\n\n"
        + "Ex: !welcome message Hello %member, welcome to %group. Don't forget read our %desc",
    async execute(msg, wa, args) {
        const { from, isGroup, sender } = msg
        const gM = isGroup ? await ev.groupMetadata(from) : ''
        const admin = isGroup ? getAdmin(gM.participants) : ''
        const cekAdmin = (m) => admin.includes(m)

        if (!isGroup) return wa.sendText(from, `Only can be executed in group.`)
        if (!cekAdmin(sender)) return wa.reply(from, `IND:\n${lang.indo.group.promote.noPerms}\n\nEN:\n${lang.eng.group.promote.noPerms}`, msg)
        if (!args.length > 0) return wa.reply(from, "Please check *#help welcome*", msg)

        // Command
        let opt = args[0]
        let filename = from.split('@')[0]
        let dataOn
        switch (opt) {
            case "on":
                dataOn = checkData(filename, "on/join")
                if (dataOn === "active") {
                    return wa.reply(from, "```Already active/Sudah aktif```", msg)
                } else if (dataOn === "no_file" || dataOn === "inactive") {
                    modifyData(filename, "on/join");
                    return wa.reply(from, "```Activated/Telah diaktifkan```", msg)
                }
                break;
            case "off":
                dataOn = checkData(filename, "on/join")
                if (dataOn === "inactive") {
                    return wa.reply(from, "```Never active/Tidak pernah aktif```", msg)
                } else if (dataOn === "no_file") {
                    return wa.reply(from, "```Please actived this feature first/Harap aktifkan fitur ini dahulu```", msg)
                } else if (dataOn === "active") {
                    modifyData(filename, "on/join")
                    return wa.reply(from, "```Success deactivated/Berhasil di nonaktifkan```", msg)
                }
                break;
            case "message":
                modifyData(filename, "join", args.slice(1).join(" "))
                wa.reply(from, "```Custom message edited successfully/Pesan custom berhasil di edit```", msg);
                break;
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