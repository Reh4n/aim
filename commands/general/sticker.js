const con = require('../../core/connect');
const { sticker } = require("../../core/convert");
const lang = require('../other/text.json');

const ev = con.Whatsapp;

module.exports = {
  name: 'sticker',
  aliases: ['s','stick', 'stik', 'stiker', 'stickergif', 'stikergif', 'gifstiker', 'gifsticker'],
  category: 'general',
  desc: 'Creating sticker for you',
  async execute(msg, wa) {
    const { quoted, from, type, isEphemeral } = msg;

    const content = JSON.stringify(quoted);
    const isMedia = type === 'imageMessage' || type === 'videoMessage';
    const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage');
    const isQVid = type === 'extendedTextMessage' && content.includes('videoMessage');
    const isQDoc = type === 'extendedTextMessage' && content.includes('documentMessage');

    if ((isMedia && !msg.message.videoMessage) || isQImg) {
      const encmed = isQImg ? quoted : msg;
      const media = await ev.downloadMediaMessage(encmed, "buffer");
      sticker(media, { isImage: true, withPackInfo: true, cmdType: "1", packInfo: { packname: `Made by ${ev.user.name}`, author: '' }}).then((r) => {
        wa.sticker(from, r, { quoted: msg });
      }).catch(() => {
        wa.reply(from, "Ada yang Error.", msg);
      });
    } else if ((isMedia && msg.message.videoMessage.fileLength < 2 << 20) || (isQVid && quoted.message.videoMessage.fileLength < 2 << 20)) {
      const encmed = isQVid ? quoted : msg;
      const media = await ev.downloadMediaMessage(encmed, "buffer");
      sticker(media, { isVideo: true, withPackInfo: true, cmdType: "1", packInfo: { packname: `Created by LitRHap`, author: 'Afh Iyh' }}).then((r) => {
        wa.sticker(from, r, { quoted: msg });
      }).catch(() => {
        wa.reply(from, "Ada yang Error.", msg);
      });
    } else if (isQDoc && (/image/.test(quoted.message.documentMessage.mimetype) || (/video/.test(quoted.message.documentMessage.mimetype) && quoted.message.documentMessage.fileLength < 2 << 20))) {
      let ext = /image/.test(quoted.message.documentMessage.mimetype) ? { isImage: true } : /video/.test(quoted.message.documentMessage.mimetype) ? { isVideo: true } : null;
      if (ext === null) return wa.reply(from, `Sepertinya tipe dokumen ini bukan berupa jpg atau mp4`, msg);
      const media = await ev.downloadMediaMessage(quoted, "buffer");
      sticker(media, { ...ext, withPackInfo: true, cmdType: "1", packInfo: { packname: `Made by ${ev.user.name}`, author: '' }}).then((r) => {
        wa.sticker(from, r, { quoted: msg });
      }).catch(() => {
        wa.reply(from, "Ada yang Error.", msg);
      });
    } else {
      wa.reply(from, `IND:\n${lang.indo.stick}\n\nEN:\n${lang.eng.stick}`, msg);
    }
  },
};
