const axios = require("axios")
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const { Boom } = require("@hapi/boom")
const chalk = require("chalk")

let ownerNumber = "16036316635@s.whatsapp.net"
let creatorName = "FRiO"
let economyPath = './economyData.json'
let currentRating = 'pg13'

async function startFrioBot() {
    const { state, saveCreds } = await useMultiFileAuthState('FrioSession')
    const { version } = await fetchLatestBaileysVersion()
    
    const conn = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    })

    if (!conn.authState.creds.registered) {
        console.log(chalk.yellow("Connection stabilizing... code appearing in 10s"))
        setTimeout(async () => {
            try {
                const phoneNumber = "2348076874766"
                const code = await conn.requestPairingCode(phoneNumber.trim())
                console.log(chalk.black(chalk.bgCyan(`Pairing Code: ${code}`)))
            } catch (e) {
                console.log(chalk.red("Error requesting code. Check if number is correct."))
            }
        }, 10000)
    }

    conn.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason !== DisconnectReason.loggedOut) { 
                startFrioBot()
            }
        } else if (connection === "open") {
            console.log(chalk.green("THE-FRiO-BOT is Online"))
        }
    })

    conn.ev.on("creds.update", saveCreds)

    conn.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0]
            if (!m.message) return
            const from = m.key.remoteJid
            const type = Object.keys(m.message)[0]
            const body = (type === 'conversation') ? m.message.conversation : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''

            let db = JSON.parse(fs.readFileSync(economyPath))

const saveDb = () => {
    fs.writeFileSync(economyPath, JSON.stringify(db, null, 2))
}

const sender = m.key.participant || m.key.remoteJid

if (!db[sender]) {
    db[sender] = { 
        coins: 1000, 
        emblems: 0, 
        rank: 'NOOB', 
        collection: [], 
        inventory: [], 
        lastClaim: '', 
        msccount: 0 
    }
    saveDb()
}
            
db[sender].msccount += 1
saveDb()

            
            if (body.startsWith('@ping')) {
                await conn.sendMessage(from, { text: 'Pong! 🏓 THE-FRiO-BOT is active.' }, { quoted: m })
            }

            if (body.startsWith('@rating')) {
    let newRating = body.split(' ')[1]?.toLowerCase()
    
    if (!['pg', 'pg13', 'r'].includes(newRating)) {
        await conn.sendMessage(from, { text: `Usage: @rating pg, pg13, or r\nCurrent rating is: ${currentRating.toUpperCase()}` }, { quoted: m })
        return
    }

    if (currentRating === newRating) {
        await conn.sendMessage(from, { text: `The questions are already rated ${currentRating.toUpperCase()}.` }, { quoted: m })
    } else {
        currentRating = newRating
        await conn.sendMessage(from, { text: `Rating successfully changed to ${currentRating.toUpperCase()}.` }, { quoted: m })
    }
            }

        if (body.startsWith('@dare')) {
    try {
        const response = await axios.get(`https://api.truthordarebot.xyz/api/dare?rating=${currentRating}`)
        await conn.sendMessage(from, { text: `*「 DARE (${currentRating.toUpperCase()}) 」*\n\n${response.data.question}` }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "API Error." }, { quoted: m })
    }
            }

    if (body.startsWith('@truth')) {
    try {
        const res = await axios.get(`https://api.truthordarebot.xyz/api/truth?rating=${currentRating}`)
        await conn.sendMessage(from, { text: `*「 TRUTH (${currentRating.toUpperCase()}) 」*\n\n${res.data.question}` }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "API Error." }, { quoted: m })
    }
}

if (body.startsWith('@wyr')) {
    try {
        const res = await axios.get(`https://api.truthordarebot.xyz/api/wyr?rating=${currentRating}`)
        await conn.sendMessage(from, { text: `*「 WOULD YOU RATHER (${currentRating.toUpperCase()}) 」*\n\n${res.data.question}` }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "API Error." }, { quoted: m })
    }
}

if (body.startsWith('@nhie')) {
    try {
        const res = await axios.get(`https://api.truthordarebot.xyz/api/nhie?rating=${currentRating}`)
        await conn.sendMessage(from, { text: `*「 NEVER HAVE I EVER (${currentRating.toUpperCase()}) 」*\n\n${res.data.question}` }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "API Error." }, { quoted: m })
    }
}

if (body.startsWith('@paranoia')) {
    try {
        const res = await axios.get(`https://api.truthordarebot.xyz/api/paranoia?rating=${currentRating}`)
        await conn.sendMessage(from, { text: `*「 PARANOIA (${currentRating.toUpperCase()}) 」*\n\n${res.data.question}` }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "API Error." }, { quoted: m })
    }
                                      }

      if (body.startsWith('@advice')) {
    try {
        const res = await axios.get('https://api.adviceslip.com/advice')
        const advice = res.data.slip.advice
        
        await conn.sendMessage(from, { text: `*「 WISE ADVICE 」*\n\n"${advice}"` }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "Advice API Error." }, { quoted: m })
    }
            }

    if (body.startsWith('@joke')) {
    try {
        let blacklist = 'religious,political,racist,sexist,explicit'
        if (currentRating === 'r') {
            blacklist = 'religious,political' // Still blocking religion/politics but allowing the rest
        }
        
        const res = await axios.get(`https://v2.jokeapi.dev/joke/Any?blacklistFlags=${blacklist}`)
        const joke = res.data
        
        let jokeText = `*「 JOKE (${currentRating.toUpperCase()}) 」*\n\n`
        if (joke.type === 'single') {
            jokeText += joke.joke
        } else {
            jokeText += `${joke.setup}\n\n_... ${joke.delivery}_`
        }
        
        await conn.sendMessage(from, { text: jokeText }, { quoted: m })
    } catch (e) {
        await conn.sendMessage(from, { text: "Joke API Error." }, { quoted: m })
    }
    }

            if (body.startsWith('@collections')) {
    const collectionText = `‎━━━━━━━━━━━━━━━━━━━━
‎[   𝟭 𝗘𝗺𝗯𝗹𝗲𝗺 🔮 = 𝟭𝟬𝟬,𝟬𝟬𝟬 🪙   ] ━━━━━━━━━━━━━━━━━━━━
‎ᴏᴡɴɪɴɢ ᴀ ᴍʏᴛʜɪᴄ ᴍᴇᴀɴs ʏᴏᴜ ɴᴏ ʟᴏɴɢᴇʀ ᴘʟᴀʏ ʙʏ ᴛʜᴇ ʀᴜʟᴇs—ʏᴏᴜ ᴍᴀᴋᴇ ᴛʜᴇᴍ, ɢʀᴀɴᴛɪɴɢ ʏᴏᴜ ʀᴇᴀʟɪᴛʏ-ʙᴇɴᴅɪɴɢ ᴀʙɪʟɪᴛɪᴇs ᴛʜᴀᴛ ᴀʟʟᴏᴡ ʏᴏᴜ ᴛᴏ ʀᴇᴡʀɪᴛᴇ ᴛʜᴇ ʙᴏᴛ's ᴇᴄᴏɴᴏᴍʏ ᴀɴᴅ ʙʀᴇᴀᴋ ᴛʜᴇ ɢᴀᴍᴇ’s ʟᴏɢɪᴄ ᴀᴛ ᴡɪʟʟ.
‎━━━━━━━━━━━━━━━━━━━━    
‎✨   [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗥𝗔𝗥𝗜𝗧𝗬 ]    ✨ ━━━━━━━━━━━━━━━━━━━━ 
‎𝗬𝘂𝗺𝗲𝗸𝗼 𝗝𝗮𝗯𝗮𝗺𝗶 -    𝟭 𝗕𝗶𝗹𝗹𝗶𝗼𝗻 🔮
‎𝗧𝗿𝗮𝗳𝗮𝗹𝗴𝗮𝗿 𝗟𝗮𝘄 -              𝟮𝟱𝟬𝗞 🔮 
‎𝗟𝗼𝗸𝗶 𝗟𝗮𝘂𝗳𝗲𝘆𝘀𝗼𝗻 -           𝟮𝟬𝟬𝗞 🔮 
‎𝗦𝘂𝗯-𝗭𝗲𝗿𝗼 -                       𝟭𝟬𝟬𝗞 🔮
‎𝗦𝘂𝗽𝗲𝗿𝗺𝗮𝗻 -                     𝟭𝟬𝟬𝗸 🔮  ━━━━━━━━━━━━━━━━━━━━  
‎🏆 [ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗥𝗔𝗥𝗜𝗧𝗬 ] 🏆 ━━━━━━━━━━━━━━━━━━━━ 
‎𝗜𝗿𝗼𝗻 𝗠𝗮𝗻 -                       𝟮𝟬𝟬𝗞 🔮
‎𝗕𝗮𝘁𝗠𝗮𝗻 -                         𝟭𝟱𝟬𝗞 🔮
‎𝗧𝗵𝗲 𝗙𝗹𝗮𝘀𝗵 -                     𝟭𝟬𝟬𝗞 🔮
‎𝗦𝗮𝘀𝘂𝗸𝗲 -                            𝟵𝟬𝗞 🔮
‎𝗠𝗮𝗱𝗮𝗿𝗮 -                            𝟵𝟬𝗞 🔮 ━━━━━━━━━━━━━━━━━━━━


‎  𝗘𝗠𝗢𝗧𝗜𝗢𝗡/𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦   ━━━━━━━━━━━━━━━━━━━━ 
‎𝗦𝗵𝗮𝗻𝗸𝘀 -                          𝟰.𝟭 𝗕 🪙
‎𝗟𝘂𝗳𝗳𝘆 -                               𝟯.𝟱 𝗕 🪙
‎𝗭𝗼𝗿𝗼 -                                𝟭.𝟱 𝗕 🪙 
‎𝗦𝗮𝗻𝗷𝗶 -                               𝟭.𝟭 𝗕 🪙 
‎𝗡𝗮𝗿𝘂𝘁𝗼 -                            𝟮.𝟮 𝗕 🪙 
‎𝗦𝗮𝗸𝘂𝗿𝗮 -                              𝟭𝟬𝟬 🪙 
‎_(𝗷𝘂𝘀𝘁 𝘁𝗼 𝗯𝗲 𝗰𝗹𝗲𝗮𝗿 𝗜𝗻𝗰𝗮𝘀𝗲 𝘆𝗼𝘂 𝗱𝗶𝗱𝗻'𝘁 𝗴𝗲𝘁 𝗶𝘁 𝘁𝗵𝗲 𝗳𝗶𝗿𝘀𝘁 𝘁𝗶𝗺𝗲 𝗦𝗮𝗸𝘂𝗿𝗮 𝗶𝘀 "𝗷𝘂𝘀𝘁" 𝟭𝟬𝟬 𝗰𝗼𝗶𝗻𝘀)_ ━━━━━━━━━━━━━━━━━━━━ ━━━━━━━━━━━━━━━━━━━━  
‎𝗣𝗿𝗼 𝗧𝗶𝗽: 𝗬𝘂𝗺𝗲𝗸𝗼'𝘀 𝘂𝗹𝘁𝗶𝗺𝗮𝘁𝗲 𝗦𝗸𝗶𝗹𝗹: "𝗸𝗮𝗴𝗲𝗴𝘂𝗿𝘂𝗶" 𝗘𝗳𝗳𝗲𝗰𝘁: 𝗚𝗿𝗮𝗻𝘁𝘀 𝟭𝟬𝟬% 𝗦𝘂𝗰𝗰𝗲𝘀𝘀 𝗼𝗻 𝗮𝗹𝗹 𝗴𝗮𝗺𝗯𝗹𝗶𝗻𝗴 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 (@𝗴𝗮𝗺𝗯𝗹𝗲, @𝘀𝗹𝗼𝘁𝘀, @𝗰𝗼𝗶𝗻𝗳𝗹𝗶𝗽, @𝗷𝗮𝗰𝗸𝗽𝗼𝘁). 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: 𝟱 𝗠𝗶𝗻𝘂𝘁𝗲𝘀 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: 𝟮𝟰 𝗛𝗼𝘂𝗿𝘀`

    await conn.sendMessage(from, { 
        image: { url: './MENUS/collection.jpg' }, 
        caption: collectionText 
    }, { quoted: m })
            }

    if (body.startsWith('@profile')) {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || sender
    
    if (!db[user]) {
        db[user] = { 
            coins: 1000, 
            emblems: 0, 
            rank: 'NOOB', 
            collection: [], 
            inventory: [], 
            lastClaim: '', 
            msccount: 0 
        }
        saveDb()
    }

    const userStats = db[user]
    const pushname = m.pushName || "User"
    
    let profileMsg = `👤 *USER PROFILE* 👤\n\n`
    profileMsg += `📝 *Name:* ${pushname}\n`
    profileMsg += `🏅 *Rank:* ${userStats.rank}\n`
    profileMsg += `💬 *Messages:* ${userStats.msccount || 0}\n`
    profileMsg += `━━━━━━━━━━━━━━━\n`
    profileMsg += `💰 *Coins:* ${userStats.coins.toLocaleString()} 🪙\n`
    profileMsg += `🔮 *Emblems:* ${userStats.emblems.toLocaleString()} 💎\n`
    profileMsg += `━━━━━━━━━━━━━━━\n`
    profileMsg += `🎴 *Collection:* ${userStats.collection.length} Characters\n`
    profileMsg += `🎒 *Inventory:* ${userStats.inventory.length} Items\n`
    profileMsg += `━━━━━━━━━━━━━━━\n`
    profileMsg += `📅 *Joined:* 2026\n`

    let ppUrl
    try {
        ppUrl = await conn.profilePictureUrl(user, 'image')
    } catch {
        ppUrl = 'https://i.ibb.co/4pDNDk1/avatar.png' 
    }

    await conn.sendMessage(from, { 
        image: { url: ppUrl }, 
        caption: profileMsg,
        mentions: [user]
    }, { quoted: m })
    }


            if (message.body === '@shop') {
const shopMenuText = `‎‎━━━━━━━━━━━━━━━━━━━━
🛒  𝗧𝗛𝗘 𝗙𝗥𝗜𝗢 𝗕𝗢𝗧 𝗦𝗛𝗢𝗣   🛒
 ‎━━━━━━━━━━━━━━━━━━━━ ‎ 


𝗕𝗢𝗢𝗞𝗦
‎━━━━━━━━━━━━━━━━━━━━

📘 𝗠𝗼𝗻𝗲𝘆 𝗛𝗲𝗶𝘀𝘁 101 - 𝗜𝗻𝗰𝗿𝗲𝗮𝘀𝗲𝘀 @𝗿𝗼𝗯 𝘀𝘂𝗰𝗰𝗲𝘀𝘀 𝗿𝗮𝘁𝗲 𝗯𝘆 +5% (𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁). -  𝘁𝗼 𝗯𝘂𝘆 @𝗯𝘂𝘆𝗺𝗵101 - 25,000 🪙

📘 𝗠𝗼𝗻𝗲𝘆 𝗛𝗲𝗶𝘀𝘁 102: 𝗜𝗻𝗰𝗿𝗲𝗮𝘀𝗲𝘀 @𝗿𝗼𝗯 𝘀𝘂𝗰𝗰𝗲𝘀𝘀 𝗿𝗮𝘁𝗲 𝗯𝘆 𝗮𝗻 𝗮𝗱𝗱𝗶𝘁𝗶𝗼𝗻𝗮𝗹 +5% (𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁). ‎𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻𝘁: 𝗠𝘂𝘀𝘁 𝗼𝘄𝗻 𝗠𝗛. 101. - 𝘁𝗼 𝗯𝘂𝘆 @𝗯𝘂𝘆𝗺𝗵102 ‎- 50,000 🪙

📘 𝗠𝗼𝗻𝗲𝘆 𝗛𝗲𝗶𝘀𝘁 103: 𝗜𝗻𝗰𝗿𝗲𝗮𝘀𝗲𝘀 @𝗿𝗼𝗯 𝘀𝘂𝗰𝗰𝗲𝘀𝘀 𝗿𝗮𝘁𝗲 𝗯𝘆 𝗮𝗻 𝗮𝗱𝗱𝗶𝘁𝗶𝗼𝗻𝗮𝗹 +5% (𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁). ‎𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻𝘁: 𝗠𝘂𝘀𝘁 𝗼𝘄𝗻 𝗠𝗛. 102. - 𝘁𝗼 𝗯𝘂𝘆 @𝗯𝘂𝘆𝗺𝗵103 ‎- 75,000 🪙

📘 𝗕𝗔𝗡𝗞𝗜𝗡𝗚 𝗙𝗢𝗥 𝗗𝗨𝗠𝗠𝗜𝗘𝗦: 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁𝗹𝘆 𝗿𝗲𝗱𝘂𝗰𝗲𝘀 𝗮𝗹𝗹 @𝗯𝗮𝗻𝗸 𝘁𝗿𝗮𝗻𝘀𝗮𝗰𝘁𝗶𝗼𝗻 𝗳𝗲𝗲𝘀 𝗯𝘆 50%. (𝘁𝗼 𝗯𝘂𝘆 𝘂𝘀𝗲 @𝗯𝘂𝘆𝗯𝗳𝗱) - 75,000 🪙

📘 𝗧𝗛𝗘 𝗔𝗥𝗧 𝗢𝗙 𝗧𝗛𝗘 𝗛𝗨𝗦𝗧𝗟𝗘: 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁𝗹𝘆 𝗮𝗱𝗱𝘀 𝗮 10𝗸 + 𝗽𝗮𝘆𝗼𝘂𝘁 𝘁𝗼 𝘁𝗵𝗲 @𝗱𝗮𝗶𝗹𝘆 𝗰𝗼𝗺𝗺𝗮𝗻𝗱. - 50,000 🪙
 ‎━━━━━━━━━━━━━━━━━━━━ ‎ ‎
𝗣𝗢𝗧𝗜𝗢𝗡𝗦 ‎ ‎
‎━━━━━━━━━━━━━━━━━━━━

🧪 𝗦𝗘𝗖𝗢𝗡𝗗 𝗖𝗛𝗔𝗡𝗖𝗘 𝗣𝗿𝗶𝗰𝗲: 300,000 🪙 𝗘𝗳𝗳𝗲𝗰𝘁: 𝗢𝗻𝗲-𝘁𝗶𝗺𝗲 𝘂𝘀𝗲; 𝗶𝗳 𝘆𝗼𝘂 𝗹𝗼𝘀𝗲 𝗮 𝗴𝗮𝗺𝗯𝗹𝗲, 𝘆𝗼𝘂 𝗸𝗲𝗲𝗽 𝘆𝗼𝘂𝗿 𝗰𝗼𝗶𝗻𝘀. (@𝗯𝘂𝘆𝘀𝗰) ‎ ‎

🧪 𝗜𝗡𝗦𝗨𝗥𝗔𝗡𝗖𝗘 𝗘𝗟𝗜𝗫𝗜𝗥 (𝗥𝗲𝗽𝗹𝗮𝗰𝗶𝗻𝗴 𝗦𝘁𝗮𝗸𝗲𝗿𝘀) 𝗣𝗿𝗶𝗰𝗲: 200,000 🪙 𝗘𝗳𝗳𝗲𝗰𝘁: 𝗙𝗼𝗿 𝘁𝗵𝗲 𝗻𝗲𝘅𝘁 5 𝗺𝗶𝗻𝘂𝘁𝗲𝘀, 𝗲𝘃𝗲𝗿𝘆 𝗹𝗼𝘀𝗶𝗻𝗴 𝗴𝗮𝗺𝗯𝗹𝗲 𝗼𝗻𝗹𝘆 𝘁𝗮𝗸𝗲𝘀 50% 𝗼𝗳 𝘆𝗼𝘂𝗿 𝘀𝘁𝗮𝗸𝗲 𝗶𝗻𝘀𝘁𝗲𝗮𝗱 𝗼𝗳 100%. (𝗖𝗿𝘂𝗰𝗶𝗮𝗹 𝗳𝗼𝗿 𝗧𝗿𝗶𝗹𝗹𝗶𝗼𝗻-𝗰𝗼𝗶𝗻 𝗯𝗲𝘁𝘀). (@𝗯𝘂𝘆𝗶𝗲) - 
 ‎━━━━━━━━━━━━━━━━━━━━ ‎ ‎
𝗖𝗢𝗟𝗟𝗘𝗖𝗧𝗜𝗢𝗡𝗦 ‎
‎━━━━━━━━━━━━━━━━━━━━

𝘁𝗼 𝗯𝘂𝘆 𝗮 𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿 𝗷𝘂𝘀𝘁 𝘂𝘀𝗲 @𝗯𝘂𝘆𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿𝗻𝗮𝗺𝗲 𝗶.𝗲 @𝗯𝘂𝘆𝗹𝘂𝗳𝗳𝘆 ‎
𝗩𝗶𝗲𝘄 𝗽𝗿𝗶𝗰𝗲𝘀 𝗳𝗿𝗼𝗺 @𝗰𝗼𝗹𝗹𝗲𝗰𝘁𝗶𝗼𝗻𝘀 ‎
𝗡𝗼𝘁𝗲 100000 🪙 / 1 🔮
‎━━━━━━━━━━━━━━━━━━━━

𝗢𝗧𝗛𝗘𝗥𝗦
‎━━━━━━━━━━━━━━━━━━━━

𝗞𝗥𝗬𝗣𝗧𝗢𝗡𝗜𝗧𝗘, 𝗽𝗼𝘀𝘀𝗲𝘀𝘀 𝗮 𝗽𝗶𝗲𝗰𝗲 𝗼𝗳 𝗸𝗿𝘆𝗽𝘁𝗼𝗻𝗶𝘁𝗲 𝘁𝗼 𝗽𝗮𝘀𝘀 𝘁𝗵𝗿𝗼𝘂𝗴𝗵 𝗺𝗮𝗻 𝗼𝗳 𝘀𝘁𝗲𝗲𝗹 (𝘁𝗼 𝗯𝘂𝘆 @𝗯𝘂𝘆𝗸𝗿𝘆𝗽𝘁𝗼𝗻𝗶𝘁𝗲 (𝗳𝗼𝗿 1) - 50,000 🪙 𝗼𝗿 @𝗯𝘂𝘆𝗸𝗿𝘆𝗽𝘁𝗼𝗻𝗶𝘁𝗲𝗰𝗵𝘂𝗻𝗸 (𝗳𝗼𝗿 10) - 450,000 🪙
‎━━━━━━━━━━━━━━━━━━━━`;

await client.sendMessage(message.from, {
image: { url: "MENUS/shop.jpg" },
caption: shopMenuText
});
            }
            
if (message.body === '@economy') {
const economyText = `‎━━━━━━━━━━━━━━━━━━━━
‎🏦        𝗧𝗛𝗘-𝗙𝗥𝗶𝗢 𝗕𝗔𝗡𝗞      🏦
‎━━━━━━━━━━━━━━━━━━━━
‎
‎💰 @𝗯𝗮𝗹𝗮𝗻𝗰𝗲 - 𝗖𝗵𝗲𝗰𝗸 𝘆𝗼𝘂𝗿 𝘄𝗮𝗹𝗹𝗲𝘁 𝗰𝗮𝘀𝗵.
‎🏛️ @𝗯𝗮𝗻𝗸 - 𝗩𝗶𝗲𝘄 𝘆𝗼𝘂𝗿 𝘀𝗲𝗰𝘂𝗿𝗲𝗱 𝘀𝗮𝘃𝗶𝗻𝗴𝘀.
‎📆 @𝗱𝗮𝗶𝗹𝘆 - 𝗖𝗹𝗮𝗶𝗺 𝘆𝗼𝘂𝗿 𝗱𝗮𝗶𝗹𝘆 𝗰𝗼𝗶𝗻 𝗮𝗹𝗹𝗼𝘄𝗮𝗻𝗰𝗲.
‎🎁 @𝗰𝗹𝗮𝗶𝗺 - 𝗣𝗶𝗰𝗸 𝘂𝗽 𝘁𝗶𝗺𝗲𝗱 𝗿𝗲𝘄𝗮𝗿𝗱𝘀.
‎📊 @𝗹𝗯 - 𝗩𝗶𝗲𝘄 𝘁𝗵𝗲 𝗚𝗹𝗼𝗯𝗮𝗹 𝗪𝗲𝗮𝗹𝘁𝗵 𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱.
‎🔄 @𝗰𝗼𝗻𝘃𝗲𝗿𝘁 [𝗮𝗺𝗼𝘂𝗻𝘁] 𝗘𝘅𝗰𝗵𝗮𝗻𝗴𝗲 100,000 🪙 𝗳𝗼𝗿 1 🔮 𝗘𝗺𝗯𝗹𝗲𝗺.
‎
‎━━━━━━━━━━━━━━━━━━━━
‎💸 [ 𝗠𝗢𝗩𝗘𝗠𝗘𝗡𝗧 & 𝗛𝗘𝗜𝗦𝗧𝗦 ]
‎━━━━━━━━━━━━━━━━━━━━
‎📤 @𝗴𝗶𝘃𝗲 [𝘁𝗮𝗴] [𝗮𝗺𝘁] - 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗰𝗼𝗶𝗻𝘀 𝘁𝗼 𝗮 𝗽𝗲𝗲𝗿.
‎🔫 @𝗿𝗼𝗯 [𝘁𝗮𝗴] - 𝗔𝘁𝘁𝗲𝗺𝗽𝘁 𝗮 𝘀𝘁𝗮𝗻𝗱𝗮𝗿𝗱 𝗿𝗼𝗯𝗯𝗲𝗿𝘆.
‎🧨 @𝗵𝗶𝗴𝗵𝗿𝗼𝗯 [𝘁𝗮𝗴] - 𝗛𝗶𝗴𝗵-𝘀𝘁𝗮𝗸𝗲𝘀 𝗵𝗲𝗶𝘀𝘁 (𝗛𝗶𝗴𝗵𝗲𝗿 𝗿𝗶𝘀𝗸).
‎
‎━━━━━━━━━━━━━━━━━━━━
‎🎰 [ 𝗧𝗛𝗘 𝗖𝗔𝗦𝗜𝗡𝗢 ]
‎━━━━━━━━━━━━━━━━━━━━
‎🎲 @𝗴𝗮𝗺𝗯𝗹𝗲 [𝗮𝗺𝘁]
‎🎰 @𝘀𝗹𝗼𝘁𝘀 [𝗮𝗺𝘁]
‎🪙 @𝗰𝗼𝗶𝗻𝗳𝗹𝗶𝗽 [𝗮𝗺𝘁]
‎💎 @𝗷𝗮𝗰𝗸𝗽𝗼𝘁 [𝗮𝗺𝘁]
‎
‎━━━━━━━━━━━━━━━━━━━━
‎𝗔 10% 𝗳𝗲𝗲 𝘄𝗼𝘂𝗹𝗱 𝗯𝗲 𝗱𝗲𝗱𝘂𝗰𝘁𝗲𝗱 𝗽𝗲𝗿 𝗲𝘃𝗲𝗿𝘆 𝗱𝗲𝗽𝗼𝘀𝗶𝘁 𝗳𝗼𝗿 𝘁𝗮𝘅𝗲𝘀, 𝘆𝗲𝘀 𝗜'𝗺 𝘁𝗮𝘅𝗶𝗻𝗴 𝗮𝗹𝗹 𝗼𝗳 𝘆'𝗮𝗹𝗹 𝗻𝗼𝘄 🗿`;

await client.sendMessage(message.from, {
image: { url: "MENUS/economy.jpg" },
caption: economyText
});
}

        if (message.body === '@buymh101') {
let user = await database.getUser(message.sender.id);
if (user.coins < 25000) return reply("❌ You need 25,000 🪙 to buy Money Heist 101.");
if (user.books.mh101) return reply("📘 You already own this book!");

user.coins -= 25000;
user.books.mh101 = true;
user.rob_bonus += 5;

await database.saveUser(user);
reply("✅ Purchase Successful! Your @rob success rate has increased by 5%.");
}

if (message.body === '@buymh102') {
let user = await database.getUser(message.sender.id);
if (!user.books.mh101) return reply("🚫 Requirement failed: You must own Money Heist 101 first!");
if (user.coins < 50000) return reply("❌ You need 50,000 🪙 to buy Money Heist 102.");
if (user.books.mh102) return reply("📘 You already own this book!");

user.coins -= 50000;
user.books.mh102 = true;
user.rob_bonus += 5;

await database.saveUser(user);
reply("✅ Purchase Successful! Your @rob success rate has increased by another 5%.");
}

if (message.body === '@buymh103') {
let user = await database.getUser(message.sender.id);
if (!user.books.mh102) return reply("🚫 Requirement failed: You must own Money Heist 102 first!");
if (user.coins < 75000) return reply("❌ You need 75,000 🪙 to buy Money Heist 103.");
if (user.books.mh103) return reply("📘 You already own this book!");

user.coins -= 75000;
user.books.mh103 = true;
user.rob_bonus += 5;

await database.saveUser(user);
reply("✅ Purchase Successful! Your heist skills are now maxed out.");
}

if (message.body === '@buybfd') {
let user = await database.getUser(message.sender.id);
if (user.coins < 75000) return reply("❌ You need 75,000 🪙 to buy Banking For Dummies.");
if (user.books.bfd) return reply("📘 You already own this book!");

user.coins -= 75000;
user.books.bfd = true;
user.bank_fee_multiplier = 0.5;

await database.saveUser(user);
reply("✅ Purchase Successful! Your bank transaction fees are now reduced by 50%.");
}

if (message.body === '@buyaoth') {
let user = await database.getUser(message.sender.id);
if (user.coins < 50000) return reply("❌ You need 50,000 🪙 to buy The Art of the Hustle.");
if (user.books.aoth) return reply("📘 You already own this book!");

user.coins -= 50000;
user.books.aoth = true;
user.daily_bonus += 10000;

await database.saveUser(user);
reply("✅ Purchase Successful! You now receive an extra 10k every time you use @daily.");
}

if (message.body === '@buykryptonite') {
let user = await database.getUser(message.sender.id);
let inventory = await database.getInventory(message.sender.id);
if (user.coins < 50000) return reply("❌ You need 50,000 🪙 for 1 piece of Kryptonite.");

user.coins -= 50000;
inventory.kryptonite += 1;

await database.saveUser(user);
await database.updateInventory(message.sender.id, inventory);
reply("✅ Success! You bought 1 Kryptonite. Use it to pass through Man of Steel.");
}

if (message.body === '@buykryptonitechunk') {
let user = await database.getUser(message.sender.id);
let inventory = await database.getInventory(message.sender.id);
if (user.coins < 450000) return reply("❌ You need 450,000 🪙 for a Kryptonite Chunk.");

user.coins -= 450000;
inventory.kryptonite += 10;

await database.saveUser(user);
await database.updateInventory(message.sender.id, inventory);
reply("✅ Success! You bought a Kryptonite Chunk (10 pieces).");
}
            
        } catch (err) {
            console.log(err)
        }
    })
}

startFrioBot()
