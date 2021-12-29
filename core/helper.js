const con = require('./connect');
const { Mimetype, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');
const axios = require('axios');
const { fromBuffer } = require('file-type');

const wa = con.Whatsapp;

exports.serialize = async function (chat) {
  m = JSON.parse(JSON.stringify(chat)).messages[0];
  const content = m.message;

  try {
    const tipe = Object.keys(content)[0];
    m.type = tipe;
  } catch {
    m.type = null;
  }

  if (m.type === 'viewOnceMessage') {
    m.message = m.message.viewOnceMessage.message;

    try {
      const tipe = Object.keys(m.message)[0];
      m.type = tipe;
    } catch {
      m.type = null;
    }
  }

  if (m.type === 'ephemeralMessage') {
    m.message = m.message.ephemeralMessage.message;
    const tipe = Object.keys(m.message)[0];

    if (tipe === 'viewOnceMessage') {
      m.message = m.message.viewOnceMessage.message;

      try {
        const tipe = Object.keys(m.message)[0];
        m.type = tipe;
      } catch {
        m.type = null;
      }
    }

    try {
      const tipe = Object.keys(m.message)[0];
      m.type = tipe;
    } catch {
      m.type = null;
    }

    m.isEphemeral = true;
  } else {
    m.isEphemeral = false;
  }

  m.isGroup = m.key.remoteJid.endsWith('@g.us');
  m.from = m.key.remoteJid;

  try {
    const quote = m.message[m.type].contextInfo;
    const mkey = await wa.loadMessage(m.from, quote.stanzaId);
    if (quote.quotedMessage['ephemeralMessage']) {
      const tipe = Object.keys(quote.quotedMessage['ephemeralMessage'].message)[0];
      console.log(tipe);

      if (tipe === 'viewOnceMessage') {
        m.quoted = {
          type: 'view_once',
          key: mkey.key,
          type_msg: Object.keys(quote.quotedMessage.ephemeralMessage.message.viewOnceMessage.message)[0],
          stanzaId: quote.stanzaId,
          participant: quote.participant,
          message: quote.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
        }
      } else {
        m.quoted = {
          type: 'ephemeral',
          key: mkey.key,
          type_msg: Object.keys(quote.quotedMessage.ephemeralMessage.message)[0],
          stanzaId: quote.stanzaId,
          participant: quote.participant,
          message: quote.quotedMessage.ephemeralMessage.message,
        };
      }
    } else if (quote.quotedMessage['viewOnceMessage']) {
      m.quoted = {
        type: 'view_once',
        key: mkey.key,
        type_msg: Object.keys(quote.quotedMessage.viewOnceMessage.message)[0],
        stanzaId: quote.stanzaId,
        participant: quote.participant,
        message: quote.quotedMessage.viewOnceMessage.message
      };
    } else {
      m.quoted= {
        type: 'normal',
        key: mkey.key,
        type_msg: Object.keys(quote.quotedMessage)[0],
        stanzaId: quote.stanzaId,
        participant: quote.participant,
        message: quote.quotedMessage
      }
    }
  } catch {
    m.quoted = null;
  }

  try {
    const mention = m.message[m.type].contextInfo.mentionedJid;
    m.mentionedJid = mention;
  } catch {
    m.mentionedJid = null;
  }

  if (m.isGroup) {
    m.sender = m.participant;
  } else {
    m.sender = m.key.remoteJid;
  }

  if (m.key.fromMe) {
    m.sender = wa.user.jid;
  }

  const txt =
    m.type === 'conversation' && m.message[m.type]
      ? m.message[m.type]
      : m.type == 'imageMessage' && m.message[m.type].caption
      ? m.message[m.type].caption
      : m.type == 'videoMessage' && m.message[m.type].caption
      ? m.message[m.type].caption
      : m.type == 'extendedTextMessage' && m.message[m.type].text
      ? m.message[m.type].text
      : m.type == 'buttonsResponseMessage' && m.message[m.type].selectedButtonId.includes("SMH")
      ? m.message[m.type].selectedButtonId
      : m.type == 'listResponseMessage' && m.message[m.type].singleSelectReply.selectedRowId
      ? m.message[m.type].singleSelectReply.selectedRowId
      : '';
  m.body = txt;

  return m;
};

/**
 * Sending a reply
 * @param jid of the chat
 * @param text your text
 * @param quoted message you want to reply
 */
exports.reply = function (jid, text, quoted) {
  wa.sendMessage(jid, text, MessageType.text, { quoted: quoted });
};

/**
 * Sending text
 * @param jid of the chat
 * @param text your text
 */
exports.sendText = function (jid, text) {
  wa.sendMessage(jid, text, MessageType.text);
};
/**
 * Sending custom message
 * @param jid of the chat
 * @param text your text
 * @param Messagetype MessageType
 * @param options Baileys message options
 */
exports.custom = function (jid, text, Messagetype, options = {}) {
  wa.sendMessage(jid, text, Messagetype, options);
};

/**
 * Sending image
 * @param jid of the chat
 * @param data Buffer or path to file
 * @param options baileys Message Options
 */
exports.image = function (jid, data, options = {}) {
  if (typeof data === 'string') {
    if (data.startsWith('http://') || data.startsWith('https://')) {
      wa.sendMessage(jid, { url: data }, MessageType.image, options);
    } else {
      wa.sendMessage(jid, fs.readFileSync(data), MessageType.image, options);
    }
  } else {
    wa.sendMessage(jid, data, MessageType.image, options);
  }
};

exports.mediaURL = async function (jid, url, options = {}) {
  let res = await download(url);
  const { mime } = await fromBuffer(res);
  let opt = { ...options };
  let mtype = '';
  let temp = undefined;

  if (/image/.test(mime)) (mtype = MessageType.image), (opt.mimetype = 'image/jpeg');
  else if (/video/.test(mime)) (mtype = MessageType.video), (opt.mimetype = 'video/mp4');
  await wa.sendMessage(jid, res, mtype, opt).catch(() => {
    temp = res;
  });

  if (temp) {
    await wa.sendMessage(jid, temp, mtype, opt).catch(async () => {
      await wa.sendMessage(jid, temp, mtype, opt);
      temp = undefined;
    });
  }
};

/**
 * Sending sticker
 * @param jid of the chat
 * @param data Buffer or path to file
 * @param options baileys Message Options
 */
exports.sticker = function (jid, data, options = {}) {
  if (typeof data === 'string') {
    wa.sendMessage(jid, fs.readFileSync(data), MessageType.sticker, options);
  } else {
    wa.sendMessage(jid, data, MessageType.sticker, options);
  }
};

exports.sendButtons = async function (jid, text, buttons = [], options = {}) {
  const struct = {
    contentText: text,
    footerText: 'Kaguya PublicBot ⬩ Made By FaizBastomi',
    headerType: 'EMPTY',
    buttons: [...buttons],
  };
  await wa.sendMessage(jid, struct, MessageType.buttonsMessage, options);
};
/**
 * Get contact info
 * @param jid of your contact
 * @returns Object
 */
exports.getContactInfo = function (jid) {
  const v = wa.contacts[jid];
  return v;
};

const download = function (url) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios({
        method: 'get',
        url,
        headers: {
          DNT: 1,
          'upgrade-Insecure-Request': 1,
        },
        responseType: 'arraybuffer',
      }).catch(reject);
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};
