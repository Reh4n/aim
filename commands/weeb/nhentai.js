const { fetchBuffer, toPDF } = require('../../utils')
const { Whatsapp: ev } = require('../../core/connect')
const { generateMessageID } = require('@adiwajshing/baileys')
const { getLatest, search, getDoujin, getPopular, random } = require('nhentai-node-api')

module.exports = {
  name: 'nhentai',
  category: 'weebs',
  desc: 'Download/Search doujin hentai from web nhentai.',
  use: '[options] query|code\n\n- *Options* -\n\n1. pdf\n2. search\n3. latest\n\nEx: !nhentai pdf 212121',
  async execute(msg, wa, args) {
    try {
      const { from } = msg
      let type = (args[0] || '').toLowerCase()
      switch (type) {
        case 'latest': {
          let res = await getLatest()
          let thumbnail = await fetchBuffer(res[0].thumbnail)
          await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLink: https://hiken.xyz/v/${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'NHENTAI', contextInfo: { externalAdReply: { title: res[0].title, body: 'Nhentai Latest', thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
          break
        }
        case 'search': {
          if (!args[1]) return wa.reply(from, 'Input query', msg)
          await wa.reply(from, 'Loading...', msg)
          let res = await search(args.slice(1).join(' '))
          //console.log(args.slice(1).join(' '))
          let thumbnail = await fetchBuffer(res[0].thumbnail)
          await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLink: https://hiken.xyz/v/${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'NHENTAI', contextInfo: { externalAdReply: { title: res[0].title, body: 'Nhentai Search', thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
          break
        }
        case 'pdf': {
          if (!args[1]) return wa.reply(from, 'Input code', msg)
          await wa.reply(from, 'Loading...', msg)
          let { title, language, cover, details, pages } = await getDoujin(args[1].replace(/\D/g, ''), { simplified: true })
          if (pages.length >= 200) return wa.reply(from, `Page nya kebanyakan, download sendiri https://hiken.xyz/g/${args[0]}`, msg)
          pages = await toPDF(pages)
          let thumbnail = await fetchBuffer(cover)
          await ev.sendMessage(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail }).then(c => {
            let caption = `*${title.default}*\n_${title.native}_\nParody: ${details.parodies.join(', ')}\nCharcaters: ${details.characters.join(', ')}\n`
            caption += `Tags: ${details.tags.join(', ')}\nArtists: ${details.artists.join(', ')}\nGroups: ${details.groups.join(', ')}\nCategory: ${details.categories.join(', ')}`
            wa.mediaURL(from, cover, { quoted: c, caption })
          })
          break
        }
        case 'random': {
          await wa.reply(from, 'Loading...', msg)
          let { title, cover, pages } = await random()
          pages = await toPDF(pages)
          let thumbnail = await fetchBuffer(cover)
          await wa.custom(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail })
          break
        }
        default:
        if (args[0] && /^\d+$/.test(args[0])) {
          await wa.reply(from, 'Loading...', msg)
          let { title, language, cover, details, pages } = await getDoujin(args[0], { simplified: true })
          if (pages.length >= 200) return wa.reply(from, `Page nya kebanyakan, download sendiri https://hiken.xyz/g/${args[0]}`, msg)
          pages = await toPDF(pages)
          let thumbnail = await fetchBuffer(cover)
          await ev.sendMessage(from, pages, 'documentMessage', { quoted: msg, filename: `${title.default}.pdf`, mimetype: 'application/pdf', thumbnail }).then(c => {
            let caption = `*${title.default}*\n_${title.native}_\nParody: ${details.parodies.join(', ')}\nCharcaters: ${details.characters.join(', ')}\n`
            caption += `Tags: ${details.tags.join(', ')}\nArtists: ${details.artists.join(', ')}\nGroups: ${details.groups.join(', ')}\nCategory: ${details.categories.join(', ')}`
            wa.mediaURL(from, cover, { quoted: c, caption })
          })
        } else if (args.join(' ') && typeof(args.join(' ')) === 'string' && !args[0].includes('nhentai')) {
          await wa.reply(from, 'Loading...', msg)
          let res = await search(args.join(' '))
          let thumbnail = await fetchBuffer(res[0].thumbnail)
          await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLink: https://hiken.xyz/v/${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'NHENTAI', contextInfo: { externalAdReply: { title: res[0].title, body: 'Nhentai Search', thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
        } else {
          await wa.reply(from, 'Loading...', msg)
          let res = await getPopular()
          let thumbnail = await fetchBuffer(res[0].thumbnail)
          await wa.custom(from, res.map((v, i) => `${i + 1}. ${v.title}\nLink: https://hiken.xyz/v/${v.id}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'NHENTAI', contextInfo: { externalAdReply: { title: res[0].title, body: 'Nhentai Popular', thumbnail, sourceUrl: 'https://hiken.xyz/v/' + res[0].id }}})
        }
      }
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}
