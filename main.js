const con = require('./core/connect');
const wa = require('./core/helper');
const { color } = require('./utils');
const { buttonsParser } = require('./core/parser');
const cron = require('./utils/cronjob');
const fs = require('fs');
const moment = require('moment-timezone');
const djs = require('@discordjs/collection');
const joinHandler = require("./group_event");

const ev = con.Whatsapp;
const prefix = '!';
const multi_pref = new RegExp('^[' + '!#$%&?/;:,.<>~-+='.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
const time = moment.tz('Asia/jakarta').format('DD/MM/YY HH:mm:ss');

djs.commands = new djs.Collection();
const cooldown = new djs.Collection();
djs.prefix = prefix;

function readCmd() {
  let dir = fs.readdirSync('./commands');
  dir.forEach(async (res) => {
    const commandFiles = fs.readdirSync(`./commands/${res}`).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${res}/${file}`);
      djs.commands.set(command.name, command);
    }
  });
  console.log(color('[SYS]', 'yellow'), 'command loaded!');
}
readCmd();

con.connect();
process.on('uncaughtException', console.error);

function printLog(isCmd, sender, groupName, isGroup) {
  const time = moment.tz('Asia/Jakarta').format('DD/MM/YY HH:mm:ss');
  if (isCmd && isGroup) {
    return console.log(
      color(`[${time}]`, 'yellow'),
      color('[EXEC]', 'aqua'),
      color(`${sender.split('@')[0]}`, 'lime'),
      'in',
      color(`${groupName}`, 'lime'),
    );
  }
  if (isCmd && !isGroup) {
    return console.log(color(`[${time}]`, 'yellow'), color('[EXEC]', 'aqua'), color(`${sender.split('@')[0]}`, 'lime'));
  }
}

/* Cron */
cron(ev);

ev.on('CB:action,,battery', (b) => {
  ev['battery']['value'] = parseInt(b[2][0][1].value)
  ev['battery']['charge'] = b[2][0][1].live === 'false' ? false : true
  ev['battery']['lowPower'] = b[2][0][1].powersave === 'false' ? false : true
});

ev.on("group-participants-update", async (json) => {
  joinHandler(json)
});

ev.on('chat-update', async (msg) => {
  try {
    if (!msg.hasNewMessage) return;
    msg = await wa.serialize(msg);
    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return;
    // if (!msg.key.fromMe) return;
    let { body } = msg;
    let temp_pref = multi_pref.test(body) ? body.split('').shift() : '!';
    if (body === 'prefix' || body === 'cekprefix') {
      wa.reply(msg.from, `My prefix ${prefix}`, msg);
    }
    const { type, isGroup, sender, from } = msg;
    if (type === 'buttonsResponseMessage' && !body.startsWith(temp_pref)) {
      buttonsParser(msg);
    } else if (type === 'buttonsResponseMessage' && body.startsWith(temp_pref)) {
      msg.message = { conversation: msg.message.buttonsResponseMessage.selectedDisplayText };
    }
    body =
      type === 'conversation' && body.startsWith(temp_pref)
        ? body : (type === 'imageMessage' || type === 'videoMessage') && body && body.startsWith(temp_pref)
          ? body : type === 'ephemeralMessage' && body.startsWith(temp_pref)
            ? body : type === 'extendedTextMessage' && body.startsWith(temp_pref)
              ? body : type === 'buttonsResponseMessage' && body.startsWith(temp_pref)
                ? body : type === 'listResponseMessage' && body.startsWith(temp_pref) ? body : '';
    const arg = body.substring(body.indexOf(' ') + 1);
    const args = body.trim().split(/ +/).slice(1);
    const isCmd = body.startsWith(temp_pref);

    const groupMeta = isGroup ? await ev.groupMetadata(from) : '';
    const groupSubject = isGroup ? groupMeta.subject : '';

    // Log
    printLog(isCmd, sender, groupSubject, isGroup);

    const commandName = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
    const command =
      djs.commands.get(commandName) || djs.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldown.has(from)) {
      cooldown.set(from, new djs.Collection());
    }

    const now = Date.now();
    const timestamps = cooldown.get(from);
    const cooldownAmount = (command.cooldown || 5) * 1000;

    if (timestamps.has(from)) {
      const expirationTime = timestamps.get(from) + cooldownAmount;

      if (now < expirationTime) {
        if (isGroup) {
          let timeLeft = (expirationTime - now) / 1000;
          console.log(
            color(`[${time}]`, 'yellow'),
            color('[SPAM]', 'red'),
            color(`${sender.split('@')[0]}`, 'lime'),
            'in',
            color(groupSubject, 'lime'),
          );
          return wa.reply(from, `This group is on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`, msg)
        }
        if (!isGroup) {
          let timeLeft = (expirationTime - now) / 1000;
          console.log(
            color(`[${time}]`, 'yellow'),
            color('[SPAM]', 'red'),
            color(`${sender.split('@')[0]}`, 'lime'),
          );
          return wa.reply(from, `You are on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`, msg)
        }
      }
    }

    timestamps.set(from, now);
    setTimeout(() => timestamps.delete(from), cooldownAmount);

    try {
      command.execute(msg, wa, args, arg);
    } catch (err) {
      console.error(err);
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
});
