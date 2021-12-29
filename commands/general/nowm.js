const con = require('../../core/connect');
const fs = require('fs');
const { getRandom } = require('../../utils');
const { exec } = require('child_process');

const ev = con.Whatsapp;

module.exports = {
  name: 'nowm',
  aliases: ['delwm', 'wmdel'],
  category: 'general',
  desc: "Erase authorname, packname and link 'view more'",
  async execute(msg, wa) {
    const { quoted, type, from } = msg;

    const content = JSON.stringify(quoted);
    const QStick = type === 'extendedTextMessage' && content.includes('stickerMessage');
    const QStickEph = type === 'ephemeralMessage' && content.includes('stickerMessage');

    if (QStick || QStickEph) {
      const ran = getRandom('.webp');
      const ran1 = getRandom('.webp');
      const media = await ev.downloadAndSaveMediaMessage(quoted, `./temp/${ran}`);
      exec(`webpmux -set exif ./temp/d.exif ${media} -o ./temp/${ran1}`, function (err) {
        fs.unlinkSync(media);
        if (err) return wa.reply(from, 'Ada yang eror.', msg);
        wa.sticker(from, `./temp/${ran1}`, { quoted: msg });
        fs.unlinkSync(`./temp/${ran1}`);
      });
    } else {
      wa.reply(from, "Silahkan reply sticker yang ingin di hapus author, pack dan link 'view more'", msg);
    }
  },
};
