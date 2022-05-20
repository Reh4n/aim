const Booru = require('booru')

module.exports = {
  name: 'yuri',
  category: 'weebs',
  desc: 'Get random yuri image',
  async execute(msg, wa) {
    let list = ['sb', 'kn', 'kc'],
      res = await Booru.search(list[~~(Math.random() * list.length)], ['yuri'], { random: true }),
      url = res[0].fileUrl
    if (msg.isGroup) return wa.custom(msg.from, { url }, 'imageMessage', { viewOnce: true })
    else wa.mediaURL(msg.from, url, { quoted: msg })
  }
}
