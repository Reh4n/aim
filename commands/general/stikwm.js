const Exif = require('../../utils/exif');
const ex = new Exif();
const con = require('../../core/connect');
const fs = require('fs');
const { getRandom } = require('../../utils');
const { sticker } = require("../../core/convert");
const lang = require('../other/text.json');
const { exec } = require('child_process');

const ev = con.Whatsapp;

module.exports = {
  name: 'stickerwm',
  aliases: ['swm','stickwm', 'stikerwm', 'stikwm'],
  category: 'general',
  desc: 'Create sticker with author and packname',
  use: 'packname|authorname',
  async execute(msg, wa, args, arg) {
    const { quoted, from, sender, type, isEphemeral } = msg;

    let packname = arg.split('|')[0] || '';
    let author = arg.split('|')[1] || '';

    const content = JSON.stringify(quoted);
    const isMedia = type === 'imageMessage' || type === 'videoMessage';
    const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage');
    const isQVid = type === 'extendedTextMessage' && content.includes('videoMessage');
    const isQStick = type === 'extendedTextMessage' && content.includes('stickerMessage');
    const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage');

    if ((isMedia && !msg.message.videoMessage) || isQImg) {
      const encmed = isQImg ? quoted : msg;
      const media = await ev.downloadMediaMessage(encmed, "buffer");
      sticker(media, { isImage: true, withPackInfo: true, cmdType: "1", packInfo: {
        packname: packname.toString(),
        author: author.toString()
      } }).then((r) => {
        wa.sticker(from, r, { quoted: msg });
      }).catch(() => {
        wa.reply(from, "Ada yang Error.");
      });
    } else if (
      (isMedia && msg.message.videoMessage.seconds <= 15 && msg.message.videoMessage.fileLength < 2 << 20) ||
      (isQVid && quoted.message.videoMessage.seconds <= 15 && quoted.message.videoMessage.fileLength < 2 << 20)
    ) {
      const encmed = isQVid ? quoted : msg;
      const media = await ev.downloadMediaMessage(encmed, "buffer");
      sticker(media, { isVideo: true, withPackInfo: true, cmdType: "1", packInfo: {
        packname: packname.toString(),
        author: author.toString()
      } }).then((r) => {
        wa.sticker(from, r, { quoted: msg });
      }).catch(() => {
        wa.reply(from, "Ada yang Error.");
      });
    } else if (isQStick) {
      const rand = getRandom('.webp');
      ex.create(packname.toString(), author.toString(), sender);
      const med = await ev.downloadAndSaveMediaMessage(quoted, `./temp/${rand}`);
      exec(`webpmux -set exif ./temp/${sender}.exif ${med} -o ${med}`, function (e) {
        if (e) return wa.reply(from, 'ada yang eror.', msg) && fs.unlinkSync(med);
        wa.sticker(from, med, { quoted: msg });
        fs.unlinkSync(med);
        fs.unlinkSync(`./temp/${sender}.exif`);
      });
    } else if (
      isQDoc &&
      (/image/.test(quoted.message.documentMessage.mimetype) ||
        (/video/.test(quoted.message.documentMessage.mimetype) && quoted.message.documentMessage.fileLength < 2 << 20))
    ) {
      let ext = /image/.test(quoted.message.documentMessage.mimetype) ? { isImage: true } : /video/.test(quoted.message.documentMessage.mimetype) ? { isVideo: true } : null;
      if (ext === null) return wa.reply(from, `Sepertinya tipe dokumen ini bukan berupa jpg atau mp4`, msg);
      const media = await ev.downloadMediaMessage(quoted, "buffer");
      sticker(media, { ...ext, withPackInfo: true, cmdType: "1", packInfo: {
        packname: packname.toString(),
        author: author.toString()
      } }).then((r) => {
        wa.sticker(from, r, { quoted: msg });
      }).catch(() => {
        wa.reply(from, "Ada yang Error.");
      });
    } else {
      wa.reply(
        from,
        `IND:\n${lang.indo.stick}\n\nEN:\n${lang.eng.stick}`,
        msg,
      );
    }
  },
};
