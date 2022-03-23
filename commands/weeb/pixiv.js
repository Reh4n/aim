const { Pixiv } = require('@ibaraki-douji/pixivts')
const { fromBuffer } = require('file-type')
const pixiv = new Pixiv()

module.exports = {
  name: 'pixiv',
  category: 'weebs',
  async execute(msg, wa, args) {
    try {
      if (!args[0]) return wa.reply(msg.from, 'Input Query / Pixiv Url', msg)
      let res = await pixivDl(args.join(' '))
      await wa.reply(msg.from, 'Loading...', msg)
      for (let i = 0; i < res.media.length; i++) {
        let caption = i == 0 ? `${res.caption}\n*By:* ${res.artist}\n*Tags:* ${res.tags.join(', ')}` : ''
        let mime = (await fromBuffer(res.media[i])).mime
        await wa.custom(msg.from, res.media[i], mime.split('/')[0] + 'Message', { quoted: msg, mimetype: mime, caption })
      }
    } catch (e) {
      wa.reply(msg.from, String(e), msg)
    }
  }
}

async function pixivDl(query) {
  if (/https:\/\/www.pixiv.net\/en\/artworks\/[0-9]+/i.test(query)) {
    query = query.replace(/\D/g, '')
    let res = await pixiv.getIllustByID(query).catch(() => null)
    if (!res) throw `ID "${query}" not found :/`
    let media = []
    for (let x = 0; x < res.urls.length; x++) media.push(await pixiv.download(new URL(res.urls[x].original)))
    return { artist: res.user.name, caption: res.title, tags: res.tags.tags.map(v => v.tag), media }
  } else {
    let res = await pixiv.getIllustsByTag(query)
    if (!res.length) throw `Tag's "${query}" not found :/`
    res = res[~~(Math.random() * res.length)].id
    res = await pixiv.getIllustByID(res)
    let media = []
    for (let x = 0; x < res.urls.length; x++) media.push(await pixiv.download(new URL(res.urls[x].original)))
    return { artist: res.user.name, caption: res.title, tags: res.tags.tags.map(v => v.tag), media }
  }
}
