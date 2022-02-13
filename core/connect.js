const { WAConnection, Browsers, WAMetric } = require('@adiwajshing/baileys');
const Jimp = require('jimp');
const fs = require('fs');
global.db = JSON.parse(fs.readFileSync('./database.json'))
const conn = new WAConnection();
conn['battery'] = { value: null, charge: false, lowPower: false };
conn['updateProfilePicture'] = async (jid, img) => {
  const data = await generateProfilePicture(img)
  const tag = conn.generateMessageTag()
  const query = ['picture', { jid: jid, id: tag, type: 'set' }, [['image', null, data.img], ['preview', null, data.preview]]]
  const response = await (conn.setQuery([query], [WAMetric.picture, 136], tag))
  if (jid === conn.user.jid) conn.user.imgUrl = response.eurl
  else if (conn.chats.get(jid)) {
    conn.chats.get(jid).imgUrl = response.eurl
    conn.emit('chat-update', { jid, imgUrl: response.eurl })
  }
  return response
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer)
  const min = jimp.getWidth()
  const max = jimp.getHeight()
  const cropped = jimp.crop(0, 0, min, max)
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
  }
}

exports.Whatsapp = conn;

exports.connect = async () => {
  // Custom browser
  conn.browserDescription = ['Windows', 'Desktop', '3.0'];

  conn.on('open', () => {
    fs.writeFileSync('./Midnight.json', JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'));
    console.log('Credential has been updated');
  });

  conn.on('qr', () => {
    console.log('\033[1;32mScan the QR code above.\x1b[0m');
  });

  fs.existsSync('./Midnight.json') && conn.loadAuthInfo('./Midnight.json');

  await conn.connect({ timeoutMs: 3 * 1000 });
  global.db.data = { users: {}, groups: {}, msgs: {}, stats: {}, ...(global.db.data || {}) }
  fs.writeFileSync('./Midnight.json', JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'));
  console.log('='.repeat(50));
  console.log(`| + WA Version: ${conn.user.phone.wa_version}`);
  console.log(`| + Device: ${conn.user.phone.device_manufacturer}`);
  console.log('='.repeat(50));
  return conn;
};
