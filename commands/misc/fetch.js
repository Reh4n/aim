const fetch = require('node-fetch');
const { format } = require('util');

module.exports = {
  name: 'fetch',
  aliases: ['get'],
  category: 'misc',
  desc: 'Fetch code via url',
  use: '<url>\nEx: !fetch https://ichikaa.xyz',
  async execute(msg, wa, args) {
    const { from } = msg
    const text = args.join(' ')
    if (!/^https?:\/\//.test(text)) return wa.reply(from, 'Param *URL* must be starts with http:// or https://', msg)
    let url = new URL(text)?.href
    let res = await fetch(url)
    if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) throw `Content-Length: ${res.headers.get('content-length')}`
    if (!/text|json/.test(res.headers.get('content-type'))) return wa.mediaURL(from, url, { quoted: msg, caption: text })
    let txt = await res.buffer() 
    try {
      txt = format(JSON.parse(txt + ''))
    } catch (e) {
      txt = txt + ''
    } finally {
      wa.reply(from, txt.slice(0, 65536) + '', msg);
    } 
  }
} 
