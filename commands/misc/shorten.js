const axios = require('axios')

module.exports = {
     name: 'shortlink',
     aliases: ['short','shorturl'],
     category: 'Misc',
     desc: 'Shorten url',
     use: '<url>\nEx: !shortlink https://justnino.xyz',
     async execute(msg, wa, args) {
        if (!args.length > 0) return wa.reply(msg.from, "URL needed", msg)
        short(args[0]).then(r => wa.reply(msg.from, r, msg))
     }
}

async function short(url) {
    const res = await axios.get('https://s.ichikaa.xyz/shortlink/short?url='+url)
    return res.data.url
}
