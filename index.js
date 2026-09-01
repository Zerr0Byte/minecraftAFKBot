// bot.js
// Mineflayer bot, ami 0-24 bent marad a loyaltynetwork.mcsh.io szerveren,
// minimális adatforgalommal (nem kér chunkot, nem mozog, csak keepAlive-ra válaszol).

const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'loyaltynetwork.mcsh.io',
    port: 25565,
    username: 'Bot',
    // viewDistance 0 → ne kérjen chunkot, kevesebb adat
    // (Ez nem hivatalos opció, de a legtöbb szervernél működik, ha a szerver engedi.)
    // Ha hibát okoz, ezt töröld ki.
    version: false // automatikus verziófelismerés
  })

  // Ne csináljon semmit spawn után, csak legyen bent
  bot.on('spawn', () => {
    console.log('Bot csatlakozott a szerverre!')
    // Biztonság kedvéért minden mozgást letiltunk
    bot.clearControlStates()
  })

  // Minimalizáljuk a logolást és az eseménykezelést, hogy ne dolgozzon feleslegesen
  bot.on('chat', () => {})
  bot.on('message', () => {})
  bot.on('kicked', (reason) => {
    console.log('Kickelve:', reason)
  })
  bot.on('error', (err) => {
    console.log('Hiba:', err)
  })

  // Nem reagálunk entity, chunk, stb. eseményekre
  bot._client.on('map_chunk', () => {})
  bot._client.on('entity_metadata', () => {})
  bot._client.on('entity_move', () => {})
  bot._client.on('entity_velocity', () => {})
  bot._client.on('entity_destroy', () => {})
  bot._client.on('rel_entity_move', () => {})
  bot._client.on('rel_entity_move_look', () => {})
  bot._client.on('entity_look', () => {})
  bot._client.on('update_health', () => {})

  // Ha disconnectel, próbáljon újracsatlakozni pár másodperc múlva
  bot.on('end', () => {
    console.log('Kapcsolat megszakadt, újracsatlakozás 10 másodperc múlva...')
    setTimeout(createBot, 10000)
  })
}

createBot()
