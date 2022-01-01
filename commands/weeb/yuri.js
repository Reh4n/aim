const { fetchJson } = require('../../utils');

module.exports = {
    name: 'yuri',
    category: 'weebs',
    desc: 'Get random yuri image',
    async execute(msg, wa) {
        let list = ['yuri', 'eroyuri']
        const { url } = await fetchJson(`https://nekos.life/api/v2/img/${list[~~(Math.random() * list.length)]}`);
        wa.mediaURL(msg.from, url, { quoted: msg });
    }
}
