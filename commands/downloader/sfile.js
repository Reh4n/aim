const cheerio = require("cheerio");
const fetch = require("node-fetch");

module.exports = {
  name: "sfile",
  aliases: ["sfiledl","sfilemobi"],
  category: "Downloader",
  desc: "Download media from sfilemobi",
  use: "<url>\n!sfile https://sfile.mobi/1pWt7I8yOMG7",
  async execute(msg, wa, args) {
    const text = args.join(" ")
    if (text.match(/(https:\/\/sfile.mobi\/)/gi)) {
      let res = await sfileDl(text)
      if (!res) return wa.reply(msg.from, "Error :/", msg)
      await wa.reply(msg.from, "_In progress, please wait..._", msg)
      await wa.custom(msg.from, { url: res.download }, 'documentMessage', { quoted: msg, filename: res.filename, mimetype: res.mimetype })
    } else if (text) {
      let [query, page] = text.split`|`
      let res = await sfileSearch(query, page)
      if (!res) return wa.reply(msg.from, res, msg)
      let txt = res.map((v) => `*Title:* ${v.title}\n*Size:* ${v.size}\n*Link:* ${v.link}`).join`\n\n`
      wa.reply(msg.from, txt, msg)
    }
  }
}

async function sfileSearch(query, page = 1) {
  let res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`)
  let $ = cheerio.load(await res.text())
  let result = []
  $('div.list').each(function () {
    let title = $(this).find('a').text()
    let size = $(this).text().trim().split('(')[1]
    let link = $(this).find('a').attr('href')
    if (link) result.push({ title, size: size.replace(')', ''), link })
  })
  return result
}

async function sfileDl(url) {
  let res = await fetch(url)
  let $ = cheerio.load(await res.text())
  let filename = $('div.w3-row-padding').find('img').attr('alt')
  let mimetype = $('div.list').text().split(' - ')[1].split('\n')[0]
  let filesize = $('#download').text().replace(/Download File/g, '').replace(/\(|\)/g, '').trim()
  let download = $('#download').attr('href') + '&k=' + Math.floor(Math.random() * (15 - 10 + 1) + 10)
  return { filename, filesize, mimetype, download }
}
