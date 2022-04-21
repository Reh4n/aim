const Booru = require('booru')

module.exports = {
  name: 'loli',
  category: 'weebs',
  desc: 'Get random loli image',
  async execute(msg, wa) {
    let list = ['sb', 'kn', 'kc'],
      res = await Booru.search(list[~~(Math.random() * list.length)], ['loli'], { random: true }),
      url = res[0].fileUrl
    wa.mediaURL(msg.from, url, { quoted: msg })
  }
}

