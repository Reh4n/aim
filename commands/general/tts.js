const fetch = require("node-fetch");
const list = [
  'Twilight Sparkle', 'Fluttershy', 'Rarity', 'Rainbow Dash', 'Pinkie Pie', 'Applejack', 'SpongeBob SquarePants',
  'Kyu Sugardust', 'Rise Kujikawa', 'Sunset Shimmer', 'Adagio Dazzle', 'Aria Blaze', 'Sonata Dusk',
  'Miss Pauling', 'Scout', 'Soldier', 'Demoman', 'Heavy', 'Engineer', 'Medic', 'Sniper', 'Spy'
]

module.exports = {
  name: "tts",
  category: "General",
  use: "spy|anjimeh luwh",
  async execute(msg, wa, args) {
    let [chara, text] = args.join` `.split`|`
    if (!(chara && text)) return wa.reply(msg.from, `The following is a list of available characters\n\n${list.join('\n')}\n\nEx: !tts fluttershy|hello world`, msg)
    let res = await tts(chara, text)
    await wa.custom(msg.from, { url: res }, 'audioMessage', { quoted: msg, ptt: true, mimetype: 'audio/mpeg' })
  }
}

async function tts(chara, text) {
  let character = list.findIndex(v => v.toLowerCase() == chara.toLowerCase())
  if (character == -1) throw `Character "${chara}" not found!\n\nList Characters:\n\n${list.join('\n')}`
  character = list[character]
  // if (text?.length < 5) throw 'Not enough text, minimum 5 characters' 
  let res = await fetch('https://api.15.ai/app/getAudioFile5', {
    method: 'post',
    headers: {
      'content-type': 'application/json' 
    },
    body: JSON.stringify({ text, character, emotion: 'Contextual' })
  })
  if (res.status !== 200) throw res.statusText
  let json = await res.json()
  return `https://cdn.15.ai/audio/${json.wavNames[0]}`
}
