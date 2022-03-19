const djs = require('@discordjs/collection');
const con = require('../../core/connect');
const { calculatePing } = require('../../utils')
const crypto = require('crypto')
const os = require('os');
const ev = con.Whatsapp;

module.exports = {
  name: 'help',
  aliases: ['h', 'cmd', 'menu'],
  category: 'general',
  desc: 'show help message.',
  async execute(msg, wa, args) {
    if (args[0]) {
      const data = [];
      const name = args[0].toLowerCase();
      const { commands, prefix } = djs;
      const command = commands.get(name) || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
      if (!command) return wa.reply(msg.from, `No Command of Alias Found || ${name}`, msg);
      else data.push(`🎈 *Command:* ${command.name}`);
      if (command.category) data.push(`⛩ *Category:* ${command.category}`);
      if (command.aliases) data.push(`♦️ *Aliases:* ${command.aliases.join(', ')}`);
      if (command.desc) data.push(`📒 *Description:* ${command.desc}`);
      if (command.use) data.push(`💎 *Usage:* ${prefix}${command.name} ${command.use}\n\nNote: [] = optional, | = or, <> = must filled`);

      return wa.reply(msg.from, `${data.join('\n')}`, msg);
    } else {
      const { sender, from, body } = msg;
      const { commands } = djs;
      const prefix = body.slice(0, 1)
      const cmds = commands.keys()
      const pushname = msg.key.fromMe ? ev.user.name :
        ev.contacts[sender] !== undefined
          ? ev.contacts[sender].notify || ev.contacts[sender].vname || ev.contacts[sender].name
          : undefined;
      let categories = [];
      for (let cmd of cmds) {
        let info = commands.get(cmd);
        if (!cmd) continue;
        if (!info.category) continue;
        if (Object.keys(categories).includes(info.category)) categories[info.category].push(info);
        else {
          categories[info.category] = [];
          categories[info.category].push(info);
        }
      }
      let jam = new Date().toLocaleTimeString('id', { hour: '2-digit', timeZone: 'Asia/Jakarta' })
      let salam = jam > 2 && jam < 4 ? 'Fajar' : jam < 11 ? 'Pagi' : jam < 16 ? 'Siang' : jam < 19 ? 'Sore' : 'Malam'
      let str = `${ev.user.name ? ev.user.name : 'ArtoriaBot'}

*🏠 Hostname*: ${os.hostname()}
*🗓️ Tanggal*: ${new Date().toLocaleString('id', { dateStyle: 'full' })}
*⏰ Runtime*: ${clockString(process.uptime())}
*⚡ Speed*: ${calculatePing(msg.messageTimestamp, Date.now())}
*🕵🏻‍♂️ Github*: LitRHap
*👑 Instagram*: @a_p.th._.29

👋🏻 Hello @${sender.split("@")[0]} Selamat ${salam}!\n\n`;
      const keys = Object.keys(categories);
      for (const key of keys) {
        str += `*${key}*\n${categories[key]
          .map(command => `• ${prefix + command.name}`)
          .join('\n')}\n\n`;
      }
      str += `send ${prefix}help followed by a command name to get detail of command, e.g. ${prefix}help sticker`;
      let buttons = [
        { buttonId: '#owner SMH', buttonText: { displayText: 'Owner' }, type: 1 },
        { buttonId: '#stats SMH', buttonText: { displayText: 'Status' }, type: 1 }
      ]
      wa.sendButtons(msg.from, str, ' ', buttons, { quoted: msg, contextInfo: { mentionedJid: [sender] }})
    }
  },
};

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms % (3600 * 24) / 3600)
  let m = isNaN(ms) ? '--' : Math.floor(ms % 3600 / 60)
  let s = isNaN(ms) ? '--' : Math.floor(ms % 60)
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
