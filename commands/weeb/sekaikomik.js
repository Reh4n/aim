const axios = require("axios");
const cheerio = require("cheerio");
const { toPDF, fetchBuffer } = require('../../utils')
const { generateMessageID, compressImage } = require('@adiwajshing/baileys')

const Base_URL = "https://sekaikomik.live";

module.exports = {
  name: "komik",
  aliases: ["manga"],
  category: "weeb",
  desc: "Download, search, popular, and get Latest komik from sekaikomik.live",
  use: "[options] query|url\n\n- *Options* -\n\n1. pdf\n2. search\n\nEx: !komik pdf https://komikcast.com/chapter/drawing-saikyou-mangaka-wa-oekaki-skill-de-isekai-musou-suru-chapter-01-2-bahasa-indonesia/",
  async execute(msg, wa, args) {
    try {
      const { from } = msg
      let type = (args[0] || '').toLowerCase()
      switch (type) {
        case 'latest': {
          await wa.reply(msg.from, "_*In progress, please wait*_", msg)
          let res = await Latest()
          let thumbnail = await fetchBuffer(res[0].thumb)
          await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nChapter: ${v.chapter}\nRating: ${v.rating}\nLink: ${v.url}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'SEKAIKOMIK', contextInfo: { externalAdReply: { title: res[0].title, body: 'Sekaikomik Latest', thumbnail, sourceUrl: res[0].url }}})
          break
        }
        case 'populer': {
          await wa.reply(msg.from, "_*In progress, please wait*_", msg)
          let res = await Populer()
          let thumbnail = await fetchBuffer(res[0].thumb)
          await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nChapter: ${v.chapter}\nRating: ${v.rating}\nLink: ${v.url}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'SEKAIKOMIK', contextInfo: { externalAdReply: { title: res[0].title, body: 'Sekaikomik Populer', thumbnail, sourceUrl: res[0].url }}})
          break
        }
        case 'search': {
          if (!args[1]) return wa.reply(from, 'Input query', msg)
          await wa.reply(msg.from, "_*In progress, please wait*_", msg)
          let res = await Search(args.slice(1).join(" "))
          let thumbnail = await fetchBuffer(res[0].thumb)
          await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nChapter: ${v.chapter}\nRating: ${v.rating}\nLink: ${v.url}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'SEKAIKOMIK', contextInfo: { externalAdReply: { title: res[0].title, body: 'Sekaikomik Search', thumbnail, sourceUrl: res[0].url }}})
          break
        }
        case 'pdf': {
          if (!args[1]) return wa.reply(from, 'Input code', msg)
          await wa.reply(from, "_*In progress, please wait*_", msg)
          let { title, images } = await Downloads(args[1])
          let buffer = await toPDF(images)
          let thumbnail = await compressImage(images[0])
          await wa.custom(from, buffer, 'documentMessage', { quoted: msg, filename: `${title}.pdf`, mimetype: 'application/pdf', thumbnail })
          break
        }
        default:
        if (args[0] && /https?:\/\//.test(args[0])) {
          await wa.reply(from, "_*In progress, please wait*_", msg)
          let { title, images } = await Downloads(args[0])
          let buffer = await toPDF(images)
          let thumbnail = await compressImage(images[0])
          await wa.custom(from, buffer, 'documentMessage', { quoted: msg, filename: `${title}.pdf`, mimetype: 'application/pdf', thumbnail })
        } else {
          await wa.reply(from, "_*In progress, please wait*_", msg)
          let res = await Latest()
          let thumbnail = await fetchBuffer(res[0].thumb)
          await wa.custom(from, res.map((v, i) => `${i + 1}. Title: ${v.title}\nChapter: ${v.chapter}\nRating: ${v.rating}\nLink: ${v.url}`).join('\n\n'), 'extendedTextMessage', { quoted: msg, messageId: generateMessageID().slice(0, 5) + 'SEKAIKOMIK', contextInfo: { externalAdReply: { title: res[0].title, body: 'Sekaikomik Latest', thumbnail, sourceUrl: res[0].url }}})
        }
      }
    } catch(e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}

async function Downloads(url) {
  let res = await axios.get(url)
  let $ = cheerio.load(res.data)
  let title = $('div.headpost').find('h1').text()
  let data = $('script').map((idx, el) => $(el).html()).toArray()
  data = data.filter(v => /wp-content/i.test(v))
  data = eval(data[0].split('"images":')[1].split('}],')[0])
  return { title, images: data.map(v => encodeURI(v)) }
}

function Populer() {
  return new Promise((res, rej) => {
    axios.get(Base_URL).then(({ data }) => {
      let $ = cheerio.load(data)
      let result = [];
      $('div.bs').get().map(v => {
        let title = $(v).find('a').attr('title')
        let chapter = $(v).find('.epxs').text().trim().replace('Chapter', '').trim()
        let rating = $(v).find('.numscore').text().trim()
        let url = $(v).find('a').attr('href')
        let thumb = $(v).find('img').attr('src')
        result.push({ title, url, thumb, chapter, rating })
      })
      res(result)
    }).catch(rej)
  })
}

function Latest(page = 1) {
  return new Promise((res, rej) => {
    axios.get(`${Base_URL}/manga/?page=${page}&order=update`).then(({ data }) => {
      let $ = cheerio.load(data)
      let result = [];
      $('div.bs').get().map(s => {
        let title = $(s).find('a').attr('title')
        let chapter = $(s).find('.epxs').text().replace('Chapter', '').trim()
        let rating = $(s).find('.numscore').text().trim()
        let thumb = $(s).find('img').attr('src')
        let url = $(s).find('a').attr('href')
        result.push({ title, chapter, rating, thumb, url })
      })
      res(result)
    }).catch(rej)
  })
}

function Search(query, page = 1) {
  return new Promise((res, rej) => {
    axios.get(`${Base_URL}/page/${page}/?s=${query}`).then(({ data }) => {
      let $ = cheerio.load(data)
      let result = [];
      $('div.bs').get().map(s => {
        let title = $(s).find('a').attr('title')
        let chapter = $(s).find('.epxs').text().replace('Chapter', '').trim()
        let rating = $(s).find('.numscore').text().trim()
        let thumb = $(s).find('img').attr('src')
        let url = $(s).find('a').attr('href')
        result.push({ title, chapter, rating, thumb, url })
      })
      res(result)
    }).catch(rej)
  })
}
