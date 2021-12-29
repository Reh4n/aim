const ev = require('../../core/connect').Whatsapp;
const { owner } = require('../../config.json');

module.exports = {
  name: 'bc',
  aliases: ['broadcast'],
  category: 'private',
  async execute(msg, wa, args) {
    const { sender, quoted, type, from } = msg

    if (!owner.includes(sender)) return;

    let opt = args[0]
    let isMed = type === "imageMessage" || type === "videoMessage" || type === "documentMessage"
    let isQMed = quoted?.message?.imageMessage || quoted?.message?.videoMessage || quoted?.message?.documentMessage
    let isQText = quoted?.message?.conversation || quoted?.message?.extendedTextMessage
    
    let tipe;
    if (quoted && quoted?.type_msg === "documentMessage") {
      if (/image/.test(quoted?.message?.documentMessage?.mimetype)) {
        tipe = "imageMessage"
      } else if (/video/.test(quoted?.message?.documentMessage?.mimetype)) {
        tipe = "videoMessage"
      }
    } else {
      if (quoted) {
        tipe = quoted?.type_msg
      } else {
        tipe = type
      }
    }

    const chats = ev.chats.array.filter((v) => v.jid.endsWith('@s.whatsapp.net')).map((v) => v.jid);
    const groups = ev.chats.all()
      .filter((v) => v.jid.endsWith('@g.us') && !v.read_only && v.messages && !v.announce).map((v) => v.jid);
    const all_id = [...chats];
    for (let id of groups) {
      all_id.push(id)
    }

    switch (opt) {
      case "dm":
        if (isMed || isQMed) {
          let media = await ev.downloadMediaMessage(quoted ? quoted : msg, "buffer");
          let m = await ev.prepareMessage("", media, tipe, { caption: args.slice(1).join(" ") });
          for (let id of chats) await ev.forwardMessage(id, m, true);
          wa.reply(from, "sukses", msg)
        } else {
          if (isQText) {
            for (let id of chats) await ev.forwardMessage(id, quoted, true)
            wa.reply(from, "sukses", msg)
          } else {
            for (let id of chats) await ev.sendMessage(id, args.slice(1).join(" "), "conversation", { contextInfo: { isForwarded: true, forwardingScore: 2 } })
            wa.reply(from, "sukses", msg)
          }
        }
        break;
      case "gc": case "group":
        if (isMed || isQMed) {
          let media = await ev.downloadMediaMessage(quoted ? quoted : msg, "buffer");
          let m = await ev.prepareMessage("", media, tipe, { caption: args.slice(1).join(" ") });
          for (let id of groups) await ev.forwardMessage(id, m, true);
          wa.reply(from, "sukses", msg)
        } else {
          if (isQText) {
            for (let id of groups) await ev.forwardMessage(id, quoted, true)
            wa.reply(from, "sukses", msg)
          } else {
            for (let id of groups) await ev.sendMessage(id, args.slice(1).join(" "), "conversation", { contextInfo: { isForwarded: true, forwardingScore: 2 } })
            wa.reply(from, "sukses", msg)
          }
        }
        break;
      case "all":
        if (isMed || isQMed) {
          let media = await ev.downloadMediaMessage(quoted ? quoted : msg, "buffer");
          let m = await ev.prepareMessage("", media, tipe, { caption: args.slice(1).join(" ") });
          for (let id of all_id) await ev.forwardMessage(id, m, true);
          wa.reply(from, "sukses", msg)
        } else {
          if (isQText) {
            for (let id of all_id) await ev.forwardMessage(id, quoted, true)
            wa.reply(from, "sukses", msg)
          } else {
            for (let id of all_id) await ev.sendMessage(id, args.slice(1).join(" "), "conversation", { contextInfo: { isForwarded: true, forwardingScore: 2 } })
            wa.reply(from, "sukses", msg)
          }
        }
        break;
      default:
        if (isMed || isQMed) {
          let media = await ev.downloadMediaMessage(quoted ? quoted : msg, "buffer");
          let m = await ev.prepareMessage("", media, tipe, { caption: args.join(" ") });
          for (let id of all_id) await ev.forwardMessage(id, m, true);
          wa.reply(from, "sukses", msg)
        } else {
          if (isQText) {
            for (let id of all_id) await ev.forwardMessage(id, quoted, true)
            wa.reply(from, "sukses", msg)
          } else {
            for (let id of all_id) await ev.sendMessage(id, args.join(" "), "conversation", { contextInfo: { isForwarded: true, forwardingScore: 2 } })
            wa.reply(from, "sukses", msg)
          }
        }
    }
  }
}
// const invis = String.fromCharCode(8206);
// const more = invis.repeat(3001);
