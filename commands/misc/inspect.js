const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
  name: 'inspect',
  desc: 'Inspect link group Whatsapp.',
  async execute(msg, wa, args) {
    let linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
    let [, code] = args.join(' ').match(linkRegex) || []
    if (!code) return wa.reply(msg.from, 'Link invalid', msg)
    let res = await ev.query({ json: ["query", "invite", code], expect200: true })
    if (!res) return wa.reply(msg.from, String(res), msg)
    let caption = `*-- [Group Link Inspector] --*\n\n*ID:* ${res.id}\n*Group Name:* ${res.subject}${res.id.includes('-') ? `\n*Group Owner:* @${res.id.split`-`[0]}` : `\n*Group Owner:* @${res.owner.split`@`[0]}`}\n`
    caption += `*Created at:* ${formatDate(res.creation * 1000)}${res.subjectOwner ? `\n*Group Name Changed by:* @${res.subjectOwner.split`@`[0]}`: ''}\n`
    caption += `${res.descOwner ? `\n*Group Desc Changed by:* @${res.descOwner.split`@`[0]}` : ''}\n*Members Size:* ${res.size}${res.desc ? `\n*Desc:*\n${res.desc}` : ''}`.trim()
    let pp = await ev.getProfilePicture(res.id).catch(console.error)
    if (pp) return wa.mediaURL(msg.from, pp, { quoted: msg, caption, contextInfo: { mentionedJid: parseMention(caption) }})
    wa.custom(msg.from, caption, 'extendedTextMessage', { quoted: msg, contextInfo: { mentionedJid: parseMention(caption) }})
  }
}

function formatDate(n, locale = 'id') {
  let d = new Date(n)
  return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
}

function parseMention(text) {
  return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
