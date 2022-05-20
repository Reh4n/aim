const cheerio = require('cheerio')
const fetch = require('node-fetch')
const lang = require('../other/text.json')

const errMess = `ID:\n${lang.indo.util.download.fbFail}\n\nEN:\n${lang.eng.util.download.fbFail}`

module.exports = {
  name: 'fb',
  aliases: ['fbdl', 'facebook'],
  category: 'Downloader',
  desc: 'Download Facebook video',
  async execute(msg, wa, args) {
    try {
      if (!args[0]) return wa.reply(msg.from, 'Input URL', msg)
      let data = await facebookDl(args[0]).catch(_ => null)
      if (!data) return wa.reply(msg.from, `ID:\n${lang.indo.util.download.fbPriv}\n\nEN:\n${lang.eng.util.download.fbPriv}`)
      await wa.mediaURL(msg.from, data?.['720p'] || data?.['360p'], { quoted: msg })
    } catch(e) {
      console.log(e)
      wa.reply(msg.from, errMess, msg)
    }
  }
}

async function facebookDl(url) {
  let res = await fetch('https://fdownloader.net/')
  let $ = cheerio.load(await res.text())
  let token = $('input[name="__RequestVerificationToken"]').attr('value')
  let json = await (await fetch('https://fdownloader.net/api/ajaxSearch', {
    method: 'post',
    headers: {
      cookie: res.headers.get('set-cookie'),
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      referer: 'https://fdownloader.net/'
    },
    body: new URLSearchParams(Object.entries({ __RequestVerificationToken: token, q: url }))
  })).json()
  let $$ = cheerio.load(json.data)
  let result = {}
  $$('.button.is-success.is-small.download-link-fb').each(function () {
    let quality = $$(this).attr('title').split(' ')[1]
    let link = $$(this).attr('href')
    if (link) result[quality] = link
  })
  return result
}
