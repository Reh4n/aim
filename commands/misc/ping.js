const { calculatePing } = require('../../utils')

module.exports = {
    name: 'ping',
    category: 'misc',
    desc: 'Bot response in second.',
    execute(msg, wa) {
        wa.reply(msg.from, `*_${calculatePing(msg.messageTimestamp, Date.now())} second(s)_*`, msg)
    }
}