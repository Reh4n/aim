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
        text += `- Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024).toFixed(2)} MB\n`
        text += `- Platform: ${os.platform()}\n- Hostname: ${os.hostname()}\n\nBOT:\n- Battery: ${ev['battery']['value'] == null ? 100 : ev['battery']['value']}% ${ev['battery']['charge'] ? '🔌Charging....' : '✅Stand by....'}\n`
        text += `- Chats:\n  - Personal: ${personal.length}\n  - Groups: ${group.length}\n- Runtime: ${clockString(process.uptime())}`;
        wa.reply(msg.from, text, msg);
    }
}

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / (3600 * 24))
	let h = isNaN(ms) ? '--' : Math.floor(ms % (3600 * 24) / 3600)
	let m = isNaN(ms) ? '--' : Math.floor(ms % 3600 / 60)
	let s = isNaN(ms) ? '--' : Math.floor(ms % 60)
	let dDisplay = d > 0 ? d + (d == 1 ? ' Hari ' : ' Hari ') : ''
	let hDisplay = h > 0 ? h + (h == 1 ? ' Jam ' : ' Jam ') : ''
	let mDisplay = m > 0 ? m + (m == 1 ? ' Menit ' : ' Menit ') : ''
	let sDisplay = s > 0 ? s + (s == 1 ? ' Detik' : ' Detik') : ''
	return dDisplay + hDisplay + mDisplay + sDisplay
}
