const { ttdl } = require('../../utils/ttdl');
const ev = require('../../core/connect').Whatsapp;
const lang = require('../other/text.json');

const errMess = `ID:\n${lang.indo.util.download.ttFail}\n\nEN:\n${lang.eng.util.download.ttFail}`

module.exports = {
    name: 'ttdl',
    aliases: ['tiktok', 'tt', 'tiktokdl', 'tiktokmusic', 'tiktoknowm', 'tiktokwm', 'ttwm',
        'ttnowm', 'ttmusic'],
    category: "Downloader",
    desc: 'Download TikTok Video',
    use: "[options] url\n\n- *Options* -\n\n1. audio\n2. video\n\nEx: !tiktok audio url",
    async execute(msg, wa, args) {
        try {
            let opt = args[0]
            const { url } = parse(args.join(' '))
            if (url === '') { return wa.reply(msg.from, 'No valid URL detected', msg) }
            let data;
            switch (opt) {
                case "audio": case "music":
                    data = await ttdl(url)
                    await ev.sendMessage(msg.from, { url: data.mp3[data.mp3.length - 1] }, "audioMessage", {
                        quoted: msg,
                        mimetype: "audio/mp4"
                    })
                    break;
                case "video":
                    data = await ttdl(url)
                    wa.mediaURL(msg.from, data.mp4[data.mp4.length - 1], { quoted: msg })
                    break;
                default:
                    data = await ttdl(url)
                    wa.mediaURL(msg.from, data.mp4[data.mp4.length - 1], { quoted: msg })
            }
        } catch (e) {
            wa.reply(msg.from, errMess, msg)
        }
    }
}

const parse = (text) => {
    const rex = /(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi
    const url = text.match(rex)
    return { url: url == null ? '' : url[0] }
}
