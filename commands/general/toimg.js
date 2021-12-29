const fs = require('fs');
const con = require('../../core/connect');
const { getRandom } = require('../../utils');
const lang = require('../other/text.json');
const { exec } = require('child_process');

const ev = con.Whatsapp;

module.exports = {
  name: 'toimage',
  aliases: ['toimg', 'tomedia'],
  category: 'general',
  desc: 'Convert your sticker to media (image)',
  async execute(msg, wa) {
    const { quoted, isEphemeral, from, type } = msg;

    const content = JSON.stringify(quoted);
    const isQStick = type === 'extendedTextMessage' && content.includes('stickerMessage');
    const QStickEph = type === 'ephemeralMessage' && content.includes('stickerMessage');

    if (
      (isQStick && quoted.message.stickerMessage.isAnimated === false) ||
      (QStickEph && quoted.message.stickerMessage.isAnimated === false)
    ) {
      const ran = getRandom('.webp');
      const ran1 = getRandom('.png');
      const media = await ev.downloadAndSaveMediaMessage(quoted, `./temp/${ran}`);
      exec(`ffmpeg -i ${media} ./temp/${ran1}`, function (err) {
        fs.unlinkSync(media);
        if (err) return wa.reply(from, `IND:\n${lang.indo.util.toimg.fail}\n\nEN:\n${lang.eng.util.toimg.fail}`, msg);
        wa.image(from, `./temp/${ran1}`, { quoted: msg, caption: 'Done.' });
        fs.unlinkSync(`./temp/${ran1}`);
      });
    } else {
      wa.reply(from, `IND:\n${lang.indo.util.toimg.msg}\n\nEN:\n${lang.eng.util.toimg.msg}`, msg);
    }
  },
};
