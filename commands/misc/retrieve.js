const eq = require('../../core/connect').Whatsapp;
const { WAMessageProto } = require('@adiwajshing/baileys');

module.exports = {
    name: 'retrieve',
    aliases: ['rvo'],
    category: 'misc',
    desc: 'Retrieve viewOnceMessage.',
    async execute(msg, wa) {
        const { quoted, from } = msg;
        if (quoted) {
            if (quoted.type === 'view_once') {
                const mtype = Object.keys(quoted.message)[0];
                delete quoted.message[mtype].viewOnce;
                const msgs = WAMessageProto.Message.fromObject({
                    ...quoted.message
                })
                const prep = eq.prepareMessageFromContent(from, msgs, {
                    quoted: msg
                });
                await eq.relayWAMessage(prep);
            } else {
                wa.reply(from, 'please, reply to viewOnceMessage', msg);
            }
        } else {
            wa.reply(from, 'please, reply to viewOnceMessage', msg);
        }
    },
};
