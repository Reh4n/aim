const ev = require("../../core/connect").Whatsapp;

module.exports = {
    name: "join",
    category: "misc",
    desc: "Join to group using invite url.",
    async execute(msg, wa, args) {
        // search for invite url
        const rex1 = /chat.whatsapp.com\/([\w\d]*)/g;
        let code = args.join(" ").match(rex1);
        if (code === null) return wa.reply(msg.from, "No invite url detected.", msg);
        code = code[0].replace("chat.whatsapp.com/", "");
        // check invite code
        const check = await ev.query({ json: ["query","invite",code] });
        if (check.status !== 200) return wa.reply(msg.from, "Invalid invite url.", msg);
        if (check.size < 80) return wa.reply(msg.from, "The minimum requirement for group members must be more than 80 people.", msg);
        // Trying to join group with given invite code
        const check2 = await ev.acceptInvite(code);
        if (check2.status !== 200) return wa.reply(msg.from, "Looks like the group already full or became invalid when I'm trying to join :/", msg);
        wa.reply(msg.from, "Success join into your group.", msg);
    }
}