const { toAudio } = require('../../core/convert')
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
  name: 'tomp3',
  aliases: ['toaudio'],
  category: 'general',
  description: 'Convert your video to mp3',
  async execute(msg, wa) {
    const { from, quoted, type } = msg
    
    const content = JSON.stringify(quoted)
    const isQAud = type === 'extendedTextMessage' && content.includes('audioMessage')
    const isQVid = type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage')
    
    if (msg.message.videoMessage || isQVid || (isQAud && quoted.message.audioMessage.ptt === true) || (isQDoc && quoted.message.documentMessage.mimetype.includes('video'))) {
      const encmed = quoted ? quoted : msg
      const media = await ev.downloadMediaMessage(encmed, 'buffer')
      toAudio(media, 'mp4').then((r) => {
        ev.sendMessage(from, r, 'audioMessage', { quoted: msg, mimetype: 'audio/mp4' })
      }).catch(() => {
        wa.reply(from, 'Ada yang Error.', msg)
      })         
    } else wa.reply(from, 'IND:\nSilahkan kirim/reply voice note/video/dokumen yang ingin di convert ke audio.\n\nEN:\nPlease send/reply the voice note/video/document you want to convert to a audio.', msg)
  }
}
