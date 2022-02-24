const sagiri = require('sagiri')
const sauce = sagiri('96a418eb1f0d7581fad16d30e0dbf1dbbdf4d3bd')

const { Whatsapp: ev } = require('../../core/connect')
const { uploaderAPI } = require('../../utils/uploader')

module.exports = {
  name: 'sauce',
  category: 'misc',
  usage: 'Send/reply to a image with caption !sauce',
  async execute(msg, wa) {
    const { from, type, quoted } = msg
    const content = JSON.stringify(quoted)
    const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage')
    try {
      if (type === 'imageMessage' || isQImg || (isQDoc && /image\/(png|jpe?g)/.test(quoted.message.documentMessage.mimetype))) {
        let buffer = await ev.downloadMediaMessage(quoted ? quoted : msg)
        let { data } = await uploaderAPI(buffer, 'telegraph')
        let response = await sauce(data.url)
        let caption = response.map(v => `*Similarity:* ${v.similarity}%\n*Site:* ${v.site}\n*Url:* ${v.url}\n*Thumb:* ${v.thumbnail}${v.authorName ? `\n*Author Name:* ${v.authorName}` : ''}${v.authorUrl ? `\n*Author Url:* ${v.authorUrl}` : ''}`).join('\n\n')
        ev.sendMessage(from, { url: response[0].thumbnail }, 'imageMessage', { quoted: msg, caption })
      } else wa.reply(msg.from, 'ID:\nSilahkan kirim/reply gambar/dokumen yang ingin di cari sumbernya.\n\nEN:\nPlease send/reply the image/document you looking for the source.', msg)
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}
