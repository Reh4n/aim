const { uploaderAPI } = require("../../utils/uploader");
const con = require('../../core/connect');
const ev = con.Whatsapp;

module.exports = {
    name: "upload",
    aliases: ["upld","tourl"],
    use: "*<hosting>*\nSend/Reply to a message media with caption\n\n"
        + "*Hosting*\n- telegraph\n- uguu\n- anonfiles\n- ichika",
    category: "misc",
    async execute(msg, wa, args) {
        const { from, quoted, type } = msg;
        try {
            let host = args[0];
            const content = JSON.stringify(quoted);
            const isMed = type === "imageMessage" || type === "videoMessage"
            const isQMed = type === "extendedTextMessage" && (content.includes("imageMessage") || content.includes("videoMessage") || content.includes("stickerMessage") || content.includes("audioMessage") || content.includes("documentMessage"));
            if (host === "" || !host) host = "ichika";

            let resUrl
            if (quoted && isQMed) {
                resUrl = await uploaderAPI(await ev.downloadMediaMessage(msg.quoted), host);
                await wa.reply(from, `*Host:* ${resUrl.host}\n*URL:* ${resUrl.data.url}\n*Name:* ${resUrl.data.name}\n*Size:* ${resUrl.data.size}`, msg)
            } else if (isMed) {
                resUrl = await uploaderAPI(await ev.downloadMediaMessage(msg), host);
                await wa.reply(from, `*Host:* ${resUrl.host}\n*URL:* ${resUrl.data.url}\n*Name:* ${resUrl.data.name}\n*Size:* ${resUrl.data.size}`, msg)
            } else {
                await wa.reply(from, "No media message found.\nDocument message currently not supported.", msg)
            }
        } catch (e) {
            wa.reply(msg.from, String(e), msg)
        }
    }
}
