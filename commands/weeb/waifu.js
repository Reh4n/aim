const { fetchJson } = require('../../utils')

module.exports = {
  name: "waifu",
  category: "weebs",
  desc: "Random images waifu",
  async execute(msg, wa, args) {
    const data = await fetchJson("https://api.waifu.pics/sfw/waifu")
    wa.mediaURL(msg.from, data.url, { quoted: msg })
  }
}
