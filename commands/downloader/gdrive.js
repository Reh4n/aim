const fetch = require('node-fetch')
const { formatSize } = require('../../utils/index')

module.exports = {
  name: 'gdrive',
  category: 'downloader',
  async execute(msg, wa, args) {
    try {
      if (!args[0]) return wa.reply(msg.from, 'Input URL', msg)
      let res = await GDriveDl(args[0])
      await wa.reply(msg.from, JSON.stringify(res, null, 2), msg)
      await wa.custom(msg.from, { url: res.downloadUrl }, 'documentMessage', { filename: res.fileName, mimetype: res.mimetype, quoted: msg })
    } catch (e) {
      console.log(e)
      wa.reply(msg.from, String(e), msg)
    }
  }
}

async function GDriveDl(url) {
  let id
  if (!(url && url.match(/drive\.google/i))) throw 'Invalid URL'
  id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]
  if (!id) throw 'ID Not Found'
  let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
    method: 'post',
    headers: {
      'accept-encoding': 'gzip, deflate, br',
      'content-length': 0,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'origin': 'https://drive.google.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
      'x-drive-first-party': 'DriveWebUi',
      'x-json-requested': 'true' 
    }
  })
  let { fileName, sizeBytes, downloadUrl } =  JSON.parse((await res.text()).slice(4))
  if (!downloadUrl) throw 'Link Download Limit!'
  let data = await fetch(downloadUrl)
  if (data.status !== 200) throw data.statusText
  return { downloadUrl, fileName, fileSize: formatSize(sizeBytes), mimetype: data.headers.get('content-type') }
}
