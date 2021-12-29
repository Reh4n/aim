const { igProfile } = require('../../utils/instagram')

module.exports = {
    name: 'igstalk',
    aliases: ['igprofile'],
    category: 'general',
    execute(msg, wa, args) {
        if (!args.length > 0) return wa.reply(msg.from, "Input valid username!", msg)
        igProfile(args[0]).then((a) => {
            const text = `${Object.keys(a.metadata).map((str) => `${str}: ${a.metadata[str]}`).join('\n')}`
            wa.image(msg.from, a.picUrl.hd, { caption: text, quoted: msg })
        }).catch((err) => {
            wa.reply(msg.from, `${err}`, msg)
        })
    }
}
