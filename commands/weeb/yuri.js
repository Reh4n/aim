const { fetchJson } = require('../../utils');

module.exports = {
  name: 'yuri',
  category: 'weebs',
  desc: 'Get random yuri image',
  async execute(msg, wa) {
    // let list = ['yuri', 'eroyuri']
    const { url } = await fetchJson(`https://hmtai.herokuapp.com/v2/nsfw/yuri`)
    if (msg.isGroup) return wa.custom(msg.from, { url }, 'imageMessage', { viewOnce: true })
    else wa.mediaURL(msg.from, url, { quoted: msg })
  }
}
