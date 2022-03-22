const trAPI = require('@vitalets/google-translate-api')

module.exports = {
  name: 'translate',
  aliases: ['tr'],
  category: 'misc',
  use: '<text> atau reply sebuah pesan teks',
  async execute(msg, wa, args) {
    const { from, quoted } = msg
    try {
      if (quoted) {
        let text = quoted.message[Object.keys(quoted.message)[0]]?.caption || quoted.message.extendedTextMessage.text || quoted.message.conversation
        let res = await translate(text, args[0])
        await wa.reply(from, res, msg)
      } else if (args.length >= 2) {
        let res = await translate(args.slice(1).join(' '), args[0]);
        await wa.reply(from, res, msg)
      } else {
        wa.reply(from, 'Reply sebuah pesan atau ikuti format berikut.\n!tr <bahasa> <teks>\njangan gunakan <> saat menggunakan perintah.\nGunakan format ISO 3166-1 alpha-2 untuk kode bahasa negara :)', msg)
      }
    } catch (e) {
      wa.reply(from, String(e), msg)
    }
  }
}

async function translate(text, lang) {
  try {
    let res = (await trAPI(text, { client: 'gtx', to: lang })).text
    return res
  } catch(e) {
    console.log(e)
    throw 'Failed to translate'
  }
}
