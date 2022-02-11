const { owner } = require('../../config.json');

module.exports = {
  name: 'restart',
  aliases: ['r'],
  category: 'private',
  desc: 'Restart the bot',
  async execute(msg, wa, args) {
    const { sender, from } = msg;
    if (!owner.includes(sender)) return;
    // pm2.restart('main', (err) => {
    //  if (err) return wa.reply(from, `E: ${err}`, msg);
    // });
    process.send('reset')
    wa.reply(from, 'sukses', msg);
  },
};
