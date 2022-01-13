const cron = require('node-cron')

module.exports = job = (c) => {
    let task = cron.schedule('0 0 * * *', async () => {
     //   c.setMaxListeners(30)
        const getAllId = c.chats.all().filter(v => v.messages).map(v => v.jid)
        try {
            for (let id of getAllId) await c.modifyChat(id, 'clear')
        } catch (e) { }
    }, {
        timezone: "Asia/Jakarta",
        scheduled: true
    })
    task.start()
}
