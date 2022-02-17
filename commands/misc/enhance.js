const deepai = require('deepai')
const { Whatsapp: ev } = require('../../core/connect')
const { uploaderAPI } = require('../../utils/uploader')
deepai.setApiKey('31c3da72-e27e-474c-b2f4-a1b685722611')

module.exports = {
  name: 'enhance',
  aliases: ['hd'],
  category: 'misc',
  desc: 'Make your image HD (maybe)',
  async execute(msg, wa) {
    const { from, type, quoted } = msg
    const content = JSON.stringify(quoted)
    const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQStc = type === 'extendedTextMessage' && content.includes('stickerMessage')
    const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage')
    try {
      if (type === 'imageMessage' || isQImg || (isQStc && /false/.test(quoted.message.stickerMessage.isAnimated))|| (isQDoc && /image\/(png|jpe?g)/.test(quoted.message.documentMessage.mimetype))) {
        let buffer = await ev.downloadMediaMessage(quoted ? quoted : msg)
        let { data } = await uploaderAPI(buffer, isQStc ? 'uguu' : 'telegraph')
        let response = await deepai.callStandardApi('waifu2x', { image: data.url })
        ev.sendMessage(from, { url: response.output_url }, 'imageMessage', { quoted: msg })
      } else wa.reply(msg.from, 'ID:\nSilahkan kirim/reply gambar/dokumen yang ingin di enhance.\n\nEN:\nPlease send/reply the image/document you want enhance.', msg)
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}
  
