const djs = require('@discordjs/collection');
const con = require('../../core/connect');
const crypto = require('crypto')
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
      if (!command) return wa.reply(msg.from, 'Perintah tidak tersedia.', msg);
      else data.push(command.name);
      if (command.aliases) data.push(`*Aliases:* ${command.aliases.join(', ')}`);
      if (command.desc) data.push(`*Description:* ${command.desc}`);
      if (command.use) data.push(`*Usage:* ${prefix}${command.name} ${command.use}\n\nNote: [] = optional, | = or, <> = must filled`);

      return wa.reply(msg.from, `${data.join('\n')}`, msg);
    } else {
      const { sender } = msg;
      const { prefix, commands } = djs;
      const cmds = commands.keys()
      const pushname =
        ev.contacts[sender] !== undefined
          ? ev.contacts[sender].notify || ev.contacts[sender].vname || ev.contacts[sender].name
          : undefined;
      let categories = [];
      for (let cmd of cmds) {
        let info = commands.get(cmd);
        if (!cmd) continue;
        if (!info.category || info.category === 'private') continue;
        if (Object.keys(categories).includes(info.category)) categories[info.category].push(info);
        else {
          categories[info.category] = [];
          categories[info.category].push(info);
        }
      }
      let str = '\t'.repeat(16) + "\`\`\`SMH BOT\`\`\`\n\n"
      +`Hello, ${pushname === undefined ? sender.split("@")[0] : pushname}\n*Here My Command List*\n\n`;
      const keys = Object.keys(categories);
      for (const key of keys) {
        str += `*${key.toUpperCase()}*\n~> \`\`\`${categories[key]
          .map((command) => command.name)
          .join(', ')}\`\`\`\n\n`;
      }
      str += `send ${prefix}help followed by a command name to get detail of command, e.g. ${prefix}help sticker`;
      let buttons = [
        { buttonId: crypto.randomBytes(3).join(''), buttonText: { displayText: 'TELEGRAM BOT' }, type: 1 }
      ]
      wa.sendButtons(msg.from, str, buttons, { quoted: msg })
    }
  },
};
