const { Whatsapp: ev } = require("../../core/connect")
const { getData } = require("../../databases/group_setting")

module.exports = {
  name: "groupinfo",
  aliases: ["gcinfo", "grupinfo", "grupstats", "groupstats", "gcstats"],
  category: "Group",
  desc: "Show this group information",
  async execute(msg, wa) {
    const { from, isGroup } = msg
    if (!isGroup) return wa.reply(from, "Only can be executed in group", msg)
    try {
      const gcMeta = await ev.groupMetadata(from)
      let dataConf = await getData(from.split("@")[0])
      if (typeof dataConf !== "object") dataConf = {}
      let ppGroup = await ev.getProfilePicture(from).catch(() => 'https://tinyurl.com/yeon6okd')
      let text = `\`\`\`\nSubject: ${gcMeta?.subject}\nOwner: ${gcMeta?.owner}\nID: ${gcMeta?.id}\nSize: ${gcMeta?.participants?.length}\n`
      text += `Created: ${new Date(gcMeta?.creation * 1000).toLocaleString()} \nWelcome: ${dataConf?.["join"]?.["active"] ? "ON" : "OFF"}\nLeft: ${dataConf?.["left"]?.["active"] ? "ON" : "OFF"}\n`
      text += `Desc:\n${gcMeta?.desc ? gcMeta?.desc?.toString() : 'Empty'}\`\`\``
      await ev.sendMessage(from, { url: ppGroup }, "imageMessage", { caption: text, quoted: msg })
    } catch {
      wa.reply(from, "Something bad happend", msg)
    }
  }
}
