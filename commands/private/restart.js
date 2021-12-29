const { owner } = require('../../config.json')
const pm2 = require('pm2');

module.exports = {
  name: 'restart',
  aliases: ['r'],
  category: 'private',
  desc: 'Restart the bot',
  async execute(msg, wa, args) {
    const { sender, from } = msg;
    if (!owner.includes(sender)) return;
    pm2.restart('main', (err) => {
      if (err) return wa.reply(from, `E: ${err}`, msg);
    });
    wa.reply(from, 'sukses', msg);
  },
};
