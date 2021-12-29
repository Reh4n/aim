const wiki = require("../../utils/wiki");

module.exports = {
    name: "wiki",
    aliases: ["wk"],
    desc: "Search on Wikipedia\nLang: id and en",
    use: "[en|id] <query>",
    category: "information",
    async execute(msg, wa, args) {
        const { from } = msg
        if (!args.length > 0) return wa.reply(from, 'No query given to search', msg);
        const lang = args[0];
        switch (lang) {
            case 'en':{
                let text = await wiki(args.slice(1).join(" "), "en");
                wa.reply(from, text, msg);
                break;
            }
            case 'id':{
                let text = await wiki(args.slice(1).join(" "), "id");
                wa.reply(from, text, msg);
                break;
            }
            default:
                let text = await wiki(args.join(" "), "en");
                wa.reply(from, text, msg);
                break;
        }
    }
}