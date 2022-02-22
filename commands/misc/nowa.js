const con = require('../../core/connect');
const ev = con.Whatsapp;

module.exports = {
  name: 'nowa',
  aliases: ['dork'],
  category: 'Misc',
  desc: 'Dork number',
  use: '<num>',
  async execute(msg, wa, args) {
    let teks = args[0]
    if (!teks) return wa.reply(msg.from, "Input nomor", msg)
    if (!teks.includes('x')) return wa.reply(msg.from, "Ex: !nowa 628828642151x", msg)
    let numberPattern = /\d+/g
    let nomer = teks.match(numberPattern)
    let random_length = teks.length - nomer[0].length
    let random
    if (random_length == 1) random = 10
    else if (random_length == 2) random = 100
    else if (random_length == 3) random = 1000
    else if (random_length == 4) random = 10000
	
    let nomerny = `*Number List*\n\nHave bio\n`
    let no_bio = `\nNo Bio\n`
    let no_watsap = `\nNot Registered\n`
	
    for (let i = 0; i < random; i++) {
	   let nu = ['1','2','3','4','5','6','7','8','9']
	   let dom1 = nu[Math.floor(Math.random() * nu.length)]
	   let dom2 = nu[Math.floor(Math.random() * nu.length)]
	   let dom3 = nu[Math.floor(Math.random() * nu.length)]
	   let dom4 = nu[Math.floor(Math.random() * nu.length)]
	   let rndm
	   if (random_length == 1) rndm = dom1
	   else if (random_length == 2) rndm = dom1 + dom2
	   else if (random_length == 3) rndm = dom1 + dom2 + dom3
	   else if (random_length == 4) rndm = dom1 + dom2 + dom3 + dom4
	
	   let anu = await ev.isOnWhatsApp(nomer[0] + i + '@s.whatsapp.net')
		
	   try {
	      let anu1 = await ev.getStatus(anu.jid)
	      if (anu1.status == 401 || anu1.status == 'Hey there! I am using WhatsApp.') {
	          no_bio += 'wa.me/' + anu.jid.split`@`[0] + '\n'
	      } else {
		      nomerny += 'wa.me/' + anu.jid.split`@`[0] + '\n'
	      }
	   } catch {
	       no_watsap += 'wa.me/' + nomer[0] + i + '\n'
	   }
    }
    wa.reply(msg.from, nomerny + no_bio + no_watsap, msg)
  }
}
