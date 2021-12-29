const ev = require('../../core/connect').Whatsapp;
const os = require('os');

module.exports = {
    name: 'stats',
    aliases: ['status'],
    category: 'misc',
    desc: 'Bot Stats',
    execute(msg, wa) {
        const chats = ev.chats.all()
        const personal = chats.filter(v => v.jid.endsWith('@s.whatsapp.net')).map(v => v.jid)
        const group = chats.filter(v => !v.read_only && v.jid.endsWith('@g.us')).map(v => v.jid)
        let text = ''
        text += `HOST:\n- Arch: ${os.arch()}\n- CPU: ${os.cpus()[0].model}${os.cpus().length > 1 ? (' (' + os.cpus().length + 'x)') : ''}\n- Release: ${os.release()}\n- Version: ${os.version()}\n`
        text += `- Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024).toFixed(2)}MB\n`
        text += `- Platform: ${os.platform()}\n\nBOT:\n- Battery: ${ev['battery']['value'] == null ? 100 : ev['battery']['value']}% ${ev['battery']['charge'] ? '🔌Charging....' : '✅Stand by....'}\n`
        text += `- Power Saver: ${ev['battery']['lowPower'] ? 'on' : 'off'}\n- Chats:\n  - Personal: ${personal.length}\n  - Groups: ${group.length}`;
        wa.reply(msg.from, text, msg);
    }
}