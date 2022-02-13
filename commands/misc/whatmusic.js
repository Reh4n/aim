const acrcloud = require('acrcloud')
const acr = new acrcloud({ host: 'identify-eu-west-1.acrcloud.com', access_key: 'f692756eebf6326010ab8694246d80e7', access_secret: 'm2KQYmHdBCthmD7sOTtBExB9089TL7hiAazcUEmb' })
const { Whatsapp: ev } = require('../../core/connect')

module.exports = {
  name: 'whatmusic',
  category: 'misc',
  desc: 'Identify song.',
  async execute(msg, wa, args) {
    const content = JSON.stringify(msg.quoted)
    const isQAud = msg.type === 'extendedTextMessage' && content.includes('audioMessage')
    const isQVid = msg.type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQDoc = msg.type === 'extendedTextMessage' && content.includes('documentMessage')
    try {
      if (msg.type === 'videoMessage' || isQAud || isQVid || (isQDoc && /mp4|mp3/.test(msg.quoted.message.documentMessage.mimetype))) {
        let buffer = await ev.downloadMediaMessage(msg.quoted ? msg.quoted : msg)
        let res = await acr.identify(buffer)
        if (res.status.code !== 0) return wa.reply(msg.from, res.status.msg, msg)
        let { title, artists, album, genres, release_date } = res.metadata.music[0]
        let txt = `*RESULT FOUND*\n\n*• Title:* ${title}${artists ? `\n*• Artists:* ${artists.map(v => v.name).join(', ')}` : ''}${album ? `\n*• Album:* ${album.name}` : ''}${genres ? `\n*• Genres:* ${genres.map(v => v.name).join(', ')}` : ''}\n*• Release Date:* ${release_date}`
        wa.reply(msg.from, txt.trim(), msg)
      } else wa.reply(msg.from, 'ID:\n\nSilahkan kirim/reply audio/video/dokumen yang ingin dicari judul lagunya.\n\nEN:\n\nPlease send/reply the audio/video/document you want to identify the song.', msg)
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}
