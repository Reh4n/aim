const { recognize } = require('node-tesseract-ocr')
const { Whatsapp: ev } = require('../../core/connect');

module.exports = {
  name: 'ocr',
  category: 'general',
  desc: 'To move text from image into text form',
  use: 'Reply image/send image with caption !ocr',
  async execute(msg, wa) {
    const { from, type, quoted } = msg
      
    const content = JSON.stringify(quoted)
    const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage')
    if (type === 'imageMessage' || isQImg || (isQDoc && /image/.test(quoted.message.documentMessage.mimetype))) {
      const encmed = (isQImg || isQDoc) ? quoted : msg
      const media = await ev.downloadMediaMessage(encmed)
      recognize(media,{}).then(v => wa.reply(from, v, msg))
    }
  }
}
