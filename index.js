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
‎💎 @𝗷𝗮𝗰𝗸𝗽𝗼𝘁 
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
            if (message.body === '@buysc') {
let user = await database.getUser(message.sender.id);
let inventory = await database.getInventory(message.sender.id);

if (user.coins < 300000) return reply("❌ You need 300,000 🪙 for a Second Chance potion.");

user.coins -= 300000;
inventory.second_chance += 1;

await database.saveUser(user);
await database.updateInventory(message.sender.id, inventory);
reply("✅ Purchase Successful! 1 Second Chance potion added to your inventory. Use it to keep your coins after a losing gamble.");
}

if (message.body === '@buyie') {
let user = await database.getUser(message.sender.id);
let inventory = await database.getInventory(message.sender.id);

if (user.coins < 200000) return reply("❌ You need 200,000 🪙 for an Insurance Elixir.");

user.coins -= 200000;
inventory.insurance_elixir += 1;

await database.saveUser(user);
await database.updateInventory(message.sender.id, inventory);
reply("✅ Purchase Successful! 1 Insurance Elixir added to your inventory. Activate it for 5 minutes of 50% loss protection.");
}

            if (message.body === '@buyyumeko') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 1000000000) return reply("❌ You need 1,000,000,000 🔮 Emblems for Yumeko Jabami.");
if (user.characters.yumeko) return reply("✨ You already own the Queen of Games!");

user.emblems -= 1000000000;
user.characters.yumeko = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/yumeko.jpg" },
caption: "✅ TRANSACTION COMPLETE: You have acquired Yumeko Jabami. The table is set, and the stakes are life itself. Use @infoyumeko to view her reality-bending skills."
});
}

if (message.body === '@buylaw') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 250000) return reply("❌ You need 250,000 🔮 Emblems for Trafalgar Law.");
if (user.characters.law) return reply("⚓ You already own the Surgeon of Death!");

user.emblems -= 250000;
user.characters.law = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/law.jpg" },
caption: "✅ TRANSACTION COMPLETE: Trafalgar Law has joined your crew. The operating room is open. Use @infolaw to see what Shambles can do."
});
}

if (message.body === '@buyloki') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 200000) return reply("❌ You need 200,000 🔮 Emblems for Loki Laufeyson.");
if (user.characters.loki) return reply("🐍 The God of Mischief is already in your service!");

user.emblems -= 200000;
user.characters.loki = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "VERSES/MARVEL/loki.jpg" },
caption: "✅ TRANSACTION COMPLETE: Loki has arrived. Prepare to master the Art of Deception. Use @infoloki to view your new tricks."
});
}

if (message.body === '@buysubzero') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 100000) return reply("❌ You need 100,000 🔮 Emblems for Sub-Zero.");
if (user.characters.subzero) return reply("❄️ Sub-Zero is already part of your clan!");

user.emblems -= 100000;
user.characters.subzero = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "VERSES/MK/subzero.jpg" },
caption: "✅ TRANSACTION COMPLETE: Sub-Zero acquired. Grandmaster of the Lin Kuei. Use @infosubzero to see his freezing abilities."
});
}

if (message.body === '@buysuperman') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 100000) return reply("❌ You need 100,000 🔮 Emblems for Superman.");
if (user.characters.superman) return reply("🦸 The Man of Steel is already protecting your account!");

user.emblems -= 100000;
user.characters.superman = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "VERSES/DC/superman.jpg" },
caption: "✅ TRANSACTION COMPLETE: You now possess the power of Superman. Justice will be served. Use @infosuperman to view your stats."
});
}

if (message.body === '@buyironman') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 200000) return reply("❌ You need 200,000 🔮 Emblems for Iron Man.");
if (user.characters.ironman) return reply("🦾 Stark Industries already recognizes you as CEO!");

user.emblems -= 200000;
user.characters.ironman = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "VERSES/MARVEL/ironman.jpg" },
caption: "✅ TRANSACTION COMPLETE: Suit up. Iron Man has joined your inventory. Use @infoironman to view your tech upgrades."
});
}

if (message.body === '@buybatman') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 150000) return reply("❌ You need 150,000 🔮 Emblems for Batman.");
if (user.characters.batman) return reply("🦇 The Dark Knight is already watching over your account.");

user.emblems -= 150000;
user.characters.batman = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "VERSES/DC/batman.jpg" },
caption: "✅ TRANSACTION COMPLETE: I am Vengeance. Batman has been acquired. Use @infobatman to see your tactical options."
});
}

if (message.body === '@buytheflash') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 100000) return reply("❌ You need 100,000 🔮 Emblems for The Flash.");
if (user.characters.theflash) return reply("⚡ You're already fast enough—The Flash is owned!");

user.emblems -= 100000;
user.characters.theflash = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "VERSES/DC/theflash.jpg" },
caption: "✅ TRANSACTION COMPLETE: The Speed Force is yours. Use @infotheflash to view your high-speed skills."
});
}

if (message.body === '@buysasuke') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 90000) return reply("❌ You need 90,000 🔮 Emblems for Sasuke.");
if (user.characters.sasuke) return reply("👁️ The Sharingan is already yours!");

user.emblems -= 90000;
user.characters.sasuke = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/sasuke.jpg" },
caption: "✅ TRANSACTION COMPLETE: Sasuke Uchiha acquired. Use @infosasuke to view his visual prowess."
});
}

if (message.body === '@buymadara') {
let user = await database.getUser(message.sender.id);
if (user.emblems < 90000) return reply("❌ You need 90,000 🔮 Emblems for Madara.");
if (user.characters.madara) return reply("☄️ The Uchiha Legend has already been summoned!");

user.emblems -= 90000;
user.characters.madara = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/madara.jpg" },
caption: "✅ TRANSACTION COMPLETE: Madara has arrived. The world shall know true power. Use @infomadara to view his skills."
});
}

if (message.body === '@buyluffy') {
let user = await database.getUser(message.sender.id);
if (user.coins < 3500000000) return reply("❌ You need 3.5 Billion 🪙 for Monkey D. Luffy.");
if (user.characters.luffy) return reply("🍖 You're already the Captain!");

user.coins -= 3500000000;
user.characters.luffy = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/luffy.jpg" },
caption: "✅ TRANSACTION COMPLETE: You've recruited Luffy! He's going to be King of the Pirates. Use @infoluffy to view his abilities."
});
}

if (message.body === '@buyzoro') {
let user = await database.getUser(message.sender.id);
if (user.coins < 1500000000) return reply("❌ You need 1.5 Billion 🪙 for Zoro.");
if (user.characters.zoro) return reply("⚔️ The Greatest Swordsman is already in your crew!");

user.coins -= 1500000000;
user.characters.zoro = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/zoro.jpg" },
caption: "✅ TRANSACTION COMPLETE: Roronoa Zoro has joined. Watch out, he might get lost. Use @infozoro to see his sword styles."
});
    }

            if (message.body === '@buyshanks') {
let user = await database.getUser(message.sender.id);
if (user.coins < 4100000000) return reply("❌ You need 4.1 Billion 🪙 for Shanks.");
if (user.characters.shanks) return reply("🚩 One of the Four Emperors is already in your crew!");

user.coins -= 4100000000;
user.characters.shanks = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/shanks.jpg" },
caption: "✅ TRANSACTION COMPLETE: Red-Haired Shanks has arrived. His Haki is unmatched. Use @infoshanks to view his power."
});
}

if (message.body === '@buynaruto') {
let user = await database.getUser(message.sender.id);
if (user.coins < 2200000000) return reply("❌ You need 2.2 Billion 🪙 for Naruto.");
if (user.characters.naruto) return reply("🍥 The Seventh Hokage is already in your service!");

user.coins -= 2200000000;
user.characters.naruto = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/naruto.jpg" },
caption: "✅ TRANSACTION COMPLETE: Believe it! Naruto Uzumaki has joined you. Use @infonaruto to view his jutsu."
});
}

if (message.body === '@buysanji') {
let user = await database.getUser(message.sender.id);
if (user.coins < 1100000000) return reply("❌ You need 1.1 Billion 🪙 for Sanji.");
if (user.characters.sanji) return reply("🚬 The Vinsmoke cook is already in your kitchen!");

user.coins -= 1100000000;
user.characters.sanji = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/sanji.jpg" },
caption: "✅ TRANSACTION COMPLETE: Sanji joined the crew. Prepare for world-class cuisine and kicks. Use @infosanji to see his skills."
});
}
            if (message.body === '@buysakura') {
let user = await database.getUser(message.sender.id);
if (user.coins < 100) return reply("❌ You don't even have 100 coins? That's rough.");
if (user.characters.sakura) return reply("Unfortunately you already own Sakura.");

user.coins -= 100;
user.characters.sakura = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/sakura.jpg" },
caption: "✅ TRANSACTION COMPLETE: You really bought Sakura for 100 coins 😭😭?? You should've gambled 100 instead twin 😭🙏. Use @infosakura to see... well, to see her."
});
            }

            if (message.body === '@infoyumeko') {
const infoyumekoText = `✨  [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗥𝗔𝗥𝗜𝗧𝗬 ]  ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Yumeko Jabami
🃏 *Origin:* Kakegurui
━━━━━━━━━━━━━━━━━━━━
🎰 *Ultimate skill - kakegurui* -  (@usekakegurui)
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Grants 100% Success on all gambling commands (@gamble, @slots, @coinflip).

⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:* 5 Minutes
💤 *𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻:* 24 Hours
━━━━━━━━━━━━━━━━━━━━
*“Let’s gamble until we go mad!”*`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/yumeko.jpg" },
caption: infoyumekoText
});
}

if (message.body === '@infolaw') {
const infolawText = `✨  [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗥𝗔𝗥𝗜𝗧𝗬 ]  ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Trafalgar Law
🌊 *Origin:* One Piece
━━━━━━━━━━━━━━━━━━━━
🔄 *𝗨𝗹𝘁𝗶𝗺𝗮𝘁𝗲 𝗦𝗸𝗶𝗹𝗹:* Chambles - (@usechambles)
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Low balance? not a problem, swap your balance with any body on the group, this skill swaps bank + wallet balances, no one is safe.

⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:* Instant / 1 Use per activation
💤 *𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻:* 5 Hours
━━━━━━━━━━━━━━━━━━━━

Also unlocks the gifs reactions 
@reroom and @chambles 

*“ROOM 🗿”*`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/law.jpg" },
caption: infolawText
});
}

if (message.body === '@infoloki') {
const infolokiText = `✨  [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗥𝗔𝗥𝗜𝗧𝗬 ]  ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Loki Laufeyson
⚡ *Origin:* Marvel Universe
━━━━━━━━━━━━━━━━━━━━
🎭 *𝗨𝗹𝘁𝗶𝗺𝗮𝘁𝗲 𝗦𝗸𝗶𝗹𝗹:* 𝗔𝗿𝘁 𝗼𝗳 𝗗𝗲𝗰𝗲𝗽𝘁𝗶𝗼𝗻 - (@useillusion)
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* For a short window, every @rob you perform sends a FAKE fail message to the chat while you secretly steal 80% of the target's wallet.

⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:* 2 Minutes
💤 *𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻:* 7 Hours
━━━━━━━━━━━━━━━━━━━━
*“I am burdened with glorious purpose.”*`;
await client.sendMessage(message.from, {
image: { url: "VERSES/MARVEL/loki.jpg" },
caption: infolokiText
});
}

if (message.body === '@infosubzero') {
const infosubzeroText = `✨  [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗥𝗔𝗥𝗜𝗧𝗬 ]  ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Kuai Liang (Sub-Zero)
🐉 *Origin:* Mortal Kombat
━━━━━━━━━━━━━━━━━━━━
🧊 *𝗨𝗹𝘁𝗶𝗺𝗮𝘁𝗲 𝗦𝗸𝗶𝗹𝗹:* 𝗗𝗲𝗲𝗽 𝗙𝗿𝗲𝗲𝘇𝗲 - (@useabsolutezero)
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Freeze a target user's account. While frozen, the target cannot @rob, @gamble, or use any shop items.

⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:* 25 Minutes
💤 *𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻:* 3 Hours
━━━━━━━━━━━━━━━━━━━━
*“Ice so cold it burns.”*`;
await client.sendMessage(message.from, {
image: { url: "VERSES/MK/subzero.jpg" },
caption: infosubzeroText
});
}

if (message.body === '@infosuperman') {
const infosupermanText = `✨  [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗥𝗔𝗥𝗜𝗧𝗬 ]  ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Superman (Clark Kent)
🏙️ *Origin:* DC Universe
━━━━━━━━━━━━━━━━━━━━
🛡️ *𝗣𝗮𝘀𝘀𝗶𝘃𝗲 𝗦𝗸𝗶𝗹𝗹:* 𝗠𝗮𝗻 𝗼𝗳 𝗦𝘁𝗲𝗲𝗹 - (@manofsteelon) to activate
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* You are completely immune to all @rob attempts. No user can steal from your wallet, regardless of their level or skills.

🚫 *𝗪𝗲𝗮𝗸𝗻𝗲𝘀𝘀:* The protection is bypassed ONLY if the attacker uses *Kryptonite*.

🛡️ *𝗦𝘁𝗮𝘁𝘂𝘀:* Always Active (Permanent)
━━━━━━━━━━━━━━━━━━━━
*“Truth, Justice, and a Better Tomorrow.”*`;
await client.sendMessage(message.from, {
image: { url: "VERSES/DC/superman.jpg" },
caption: infosupermanText
});
}
            if (message.body === '@infoironman') {
const infoironmanText = `🏆 [ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗥𝗔𝗥𝗜𝗧𝗬 ] 🏆
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Tony Stark (Iron Man)
🚀 *Origin:* Marvel Universe
━━━━━━━━━━━━━━━━━━━━
💰 *𝗣𝗮𝘀𝘀𝗶𝘃𝗲 𝗦𝗸𝗶𝗹𝗹:* 𝗦𝘁𝗮𝗿𝗸 𝗜𝗻𝗱𝘂𝘀𝘁𝗿𝗶𝗲𝘀
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Automated revenue stream. Once activate it with @starkindustrieson, you receive a salary of 2,000,000 🪙 every 3 hours.

🛡️ *𝗦𝘁𝗮𝘁𝘂𝘀:* Permanent Income
━━━━━━━━━━━━━━━━━━━━
*“I am Iron Man.”*`;
await client.sendMessage(message.from, {
image: { url: "VERSES/MARVEL/ironman.jpg" },
caption: infoironmanText
});
}

if (message.body === '@infobatman') {
const infobatmanText = `🏆 [ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗥𝗔𝗥𝗜𝗧𝗬 ] 🏆
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Frio 🗿 I'm Batman
🌃 *Origin:* DC Universe
━━━━━━━━━━━━━━━━━━━━
🦇 *𝗣𝗮𝘀𝘀𝗶𝘃𝗲 𝗦𝗸𝗶𝗹𝗹 𝟭:* 𝗩𝗲𝗻𝗴𝗲𝗮𝗻𝗰𝗲
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Criminals beware. If anyone attempts to @rob you, the bot automatically drains 50% of the attacker's BANK balance and transfers it to you.. for justice!🗿

💼 *𝗣𝗮𝘀𝘀𝗶𝘃𝗲 𝗦𝗸𝗶𝗹𝗹 𝟮:* 𝗪𝗮𝘆𝗻𝗲 𝗘𝗻𝘁𝗲𝗿𝗽𝗿𝗶𝘀𝗲𝘀
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Corporate funding. Once activated with @wayneenterpriseson, you receive a salary of 1,500,000 🪙 every 3 hours.

🛡️ *𝗦𝘁𝗮𝘁𝘂𝘀:* Always Active / Passive Income
━━━━━━━━━━━━━━━━━━━━
*“I’m Vengeance.”*`;
await client.sendMessage(message.from, {
image: { url: "VERSES/DC/batman.jpg" },
caption: infobatmanText
});
}

if (message.body === '@infotheflash') {
const infotheflashText = `🏆 [ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗥𝗔𝗥𝗜𝗧𝗬 ] 🏆
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Barry Allen (The Flash)
⚡ *Origin:* DC Universe
━━━━━━━━━━━━━━━━━━━━
🏃‍♂️ *𝗨𝗹𝘁𝗶𝗺𝗮𝘁𝗲 𝗦𝗸𝗶𝗹𝗹:* @𝗿𝘂𝗻𝗯𝗮𝗿𝗿𝘆
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* Enter the Speed Force. For 60 seconds, the 24-hour cooldown on @daily is completely REMOVED. Claim as much as your fingers can type!

⏳ *𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻:* 1 Minute
💤 *𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻:* 5 Hours
━━━━━━━━━━━━━━━━━━━━
*“Life is locomotion. If you're not moving, you're not living.”*`;
await client.sendMessage(message.from, {
image: { url: "VERSES/DC/theflash.jpg" },
caption: infotheflashText
});
}

if (message.body === '@infosasuke') {
const infosasukeText = `🏆 [ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗥𝗔𝗥𝗜𝗧𝗬 ] 🏆
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Sasuke Uchiha
👁️ *Origin:* Naruto Shippuden
━━━━━━━━━━━━━━━━━━━━
💀 *𝗣𝗮𝘀𝘀𝗶𝘃𝗲 𝗦𝗸𝗶𝗹𝗹:* 𝗦𝘂𝘀𝗮𝗻𝗼𝗼 - (@susanoon)
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* An ethereal warrior protects you. When someone tries to @rob you, Susanoo has a high chance to manifest and block the attack completely.

🛡️ *𝗦𝘁𝗮𝘁𝘂𝘀:* Active (May flicker/wear off during combat)
━━━━━━━━━━━━━━━━━━━━
*“I have long since closed my eyes... my only goal is in the darkness.”*`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/sasuke.jpg" },
caption: infosasukeText
});
}

if (message.body === '@infomadara') {
const infomadaraText = `🏆 [ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗥𝗔𝗥𝗜𝗧𝗬 ] 🏆
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Madara Uchiha
☄️ *Origin:* Naruto Shippuden
━━━━━━━━━━━━━━━━━━━━
💀 *𝗣𝗮𝘀𝘀𝗶𝘃𝗲 𝗦𝗸𝗶𝗹𝗹:* 𝗣𝗲𝗿𝗳𝗲𝗰𝘁 𝗦𝘂𝘀𝗮𝗻𝗼𝗼
📝 *𝗘𝗳𝗳𝗲𝗰𝘁:* The ultimate defense. Similar to Sasuke, it provides a massive chance to negate all @rob attempts. No Kryptonite can break this—only luck.

🛡️ *𝗦𝘁𝗮𝘁𝘂𝘀:* Active (Higher block rate than Sasuke)
━━━━━━━━━━━━━━━━━━━━
*“Wake up to reality! Nothing ever goes as planned in this accursed world.”*`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/madara.jpg" },
caption: infomadaraText
});
}

if (message.body === '@infoluffy') {
const infoluffyText = `🏴‍☠️ 𝗘𝗠𝗢𝗧𝗜𝗢𝗡 / 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Monkey D. Luffy
━━━━━━━━━━━━━━━━━━━━
📦 *𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗠𝗼𝘃𝗲𝘀 (𝗚𝗜𝗙𝘀):*
👊 @pistol | 🔥 @redhawk | 🐍 @blackmamba
🥊 @gatling | 🦅 @jetculverin | 🦅 @konggun
⚡ @kaminari

📝 *Usage: Type the command to trigger the animation!*
━━━━━━━━━━━━━━━━━━━━`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/luffy.jpg" },
caption: infoluffyText
});
}

if (message.body === '@infozoro') {
const infozoroText = `🏴‍☠️ 𝗘𝗠𝗢𝗧𝗜𝗢𝗡 / 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Roronoa Zoro
━━━━━━━━━━━━━━━━━━━━
📦 *𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗠𝗼𝘃𝗲𝘀 (𝗚𝗜𝗙𝘀):*
🍙 @onigiri | 🦁 @shishisonson | 🌪️ @dragontwister
😈 @ashura | 🔥 @kingofhell

📝 *Usage: Type the command to trigger the animation!*
━━━━━━━━━━━━━━━━━━━━`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/zoro.jpg" },
caption: infozoroText
});
}

if (message.body === '@infosanji') {
const infosanjiText = `🏴‍☠️ 𝗘𝗠𝗢𝗧𝗜𝗢𝗡 / 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Vinsmoke Sanji
━━━━━━━━━━━━━━━━━━━━
📦 *𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗠𝗼𝘃𝗲𝘀 (𝗚𝗜𝗙𝘀):*
🔥 @diablejambe | ⚡ @ifritjambe
🦵 @spectre | 🍖 @venaison

📝 *Usage: Type the command to trigger the animation!*
━━━━━━━━━━━━━━━━━━━━`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/sanji.jpg" },
caption: infosanjiText
});
}

if (message.body === '@infoshanks') {
const infoshanksText = `🏴‍☠️ 𝗘𝗠𝗢𝗧𝗜𝗢𝗡 / 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Shanks
━━━━━━━━━━━━━━━━━━━━
📦 *𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗠𝗼𝘃𝗲𝘀 (𝗚𝗜𝗙𝘀):*
🗡️ @shanksdd (Divine Departure)

📝 *Usage: Type the command to trigger the animation!*
━━━━━━━━━━━━━━━━━━━━`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/ONEPIECE/shanks.jpg" },
caption: infoshanksText
});
}

if (message.body === '@infonaruto') {
const infonarutoText = `🍥 𝗘𝗠𝗢𝗧𝗜𝗢𝗡 / 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Naruto Uzumaki
━━━━━━━━━━━━━━━━━━━━
📦 *𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗠𝗼𝘃𝗲𝘀 (𝗚𝗜𝗙𝘀):*
🌀 @rasengan | 🌪️ @rasenchuriken
🔥 @kuramachakra

📝 *Usage: Type the command to trigger the animation!*
━━━━━━━━━━━━━━━━━━━━`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/naruto.jpg" },
caption: infonarutoText
});
}

if (message.body === '@infosakura') {
const infosakuraText = `🌸 𝗘𝗠𝗢𝗧𝗜𝗢𝗡 / 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦
━━━━━━━━━━━━━━━━━━━━
👤 *Character:* Sakura Haruno
━━━━━━━━━━━━━━━━━━━━
📦 *𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗠𝗼𝘃𝗲𝘀 (𝗚𝗜𝗙𝘀):*
👊 @sakurapunch | 🌸 @sakura2

📝 *Usage: Type the command to trigger the animation!*
━━━━━━━━━━━━━━━━━━━━`;
await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/sakura.jpg" },
caption: infosakuraText
});
}
            if (body === '@usekakegurui') {
    const userId = sender
    const now = Date.now()
    const cooldown = 24 * 60 * 60 * 1000 // 24 Hours

    
    if (!db[userId].characters || !db[userId].characters.yumeko) {
        return await conn.sendMessage(from, { text: "❌ You don't own Yumeko Jabami! Purchase her for 1B Emblems first." }, { quoted: m })
    }

    
    if (db[userId].yumekoLastUsed && now - db[userId].yumekoLastUsed < cooldown) {
        const remaining = cooldown - (now - db[userId].yumekoLastUsed)
        const hours = Math.floor(remaining / (60 * 60 * 1000))
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
        return await conn.sendMessage(from, { text: `⏳ Yumeko is exhausted. Try again in ${hours}h ${minutes}m.` }, { quoted: m })
    }

    
    db[userId].activeSkill = 'kakegurui'
    db[userId].yumekoLastUsed = now
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "ANIME/CHARACTERS/OTHERS/KAKEGURUII.jpeg" },
        caption: `✨ [ 𝗠𝗬𝗧𝗛𝗜𝗖𝗔𝗟 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗 ] ✨\n\n🎰 *SKILL:* KAKEGURUI\n📝 *EFFECT:* 100% Win rate on all gambling for 5 minutes!\n\n*“Let’s gamble until we go mad!”*`
    }, { quoted: m })

    
    setTimeout(async () => {
        db[userId].activeSkill = null
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        await conn.sendMessage(from, { text: "🃏 *Kakegurui* has timed out. The odds have returned to normal." }, { quoted: m })
    }, 300000) 
            }

            if (body.startsWith('@usechambles')) {
    const userId = sender
    const now = Date.now()
    const cooldown = 5 * 60 * 60 * 1000 
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant

    if (!db[userId].characters?.law) {
        return await conn.sendMessage(from, { text: "❌ You don't own Trafalgar Law!" }, { quoted: m })
    }

    if (db[userId].lawLastUsed && now - db[userId].lawLastUsed < cooldown) {
        const remaining = cooldown - (now - db[userId].lawLastUsed)
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        return await conn.sendMessage(from, { text: `⏳ ROOM is recharging. Wait ${hours}h ${minutes}m.` }, { quoted: m })
    }

    if (!victim || victim === sender) {
        return await conn.sendMessage(from, { text: "🎯 You must tag someone to use Shambles on!" }, { quoted: m })
    }

    if (!db[victim]) {
        db[victim] = { balance: 1000, bank: 0, lastClaim: '', lastClaimExtra: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
    }

    let myWallet = db[userId].balance
    let myBank = db[userId].bank
    let victimWallet = db[victim].balance
    let victimBank = db[victim].bank

    db[userId].balance = victimWallet
    db[userId].bank = victimBank
    db[victim].balance = myWallet
    db[victim].bank = myBank

    db[userId].lawLastUsed = now
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "ANIME/CHARACTERS/ONEPIECE/law.jpeg" },
        caption: `🔄 *SHAMBLES!* 🔄\n\n@${userId.split('@')[0]} has swapped their entire life savings with @${victim.split('@')[0]}!\n\n*“ROOM 🗿”*`,
        mentions: [userId, victim]
    }, { quoted: m })
            }

            if (body.startsWith('@room')) {
    if (!db[sender].characters?.law) return
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!victim) return await conn.sendMessage(from, { text: "Tag someone to trap in your ROOM!" }, { quoted: m })

    await conn.sendMessage(from, { 
        video: { url: './ANIME/CHARACTERS/ONEPIECE/law.jpg' }, 
        gifPlayback: true, 
        caption: `🔵 *ROOM...*\n\n@${sender.split('@')[0]} has trapped @${victim.split('@')[0]} inside their domain!`,
        mentions: [sender, victim]
    }, { quoted: m })
}

if (body.startsWith('@chambles')) {
    if (!db[sender].characters?.law) return
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!victim) return await conn.sendMessage(from, { text: "Tag someone to swap!" }, { quoted: m })

    await conn.sendMessage(from, { 
        video: { url: './BOTMEDIAS/chambles.gif' }, 
        gifPlayback: true, 
        caption: `🔄 *SHAMBLES!*\n\n@${sender.split('@')[0]} messed with @${victim.split('@')[0]}'s orientation!`,
        mentions: [sender, victim]
    }, { quoted: m })
        }

            if (body.startsWith('@useabsolutezero')) {
    const userId = sender
    const now = Date.now()
    const cooldown = 3 * 60 * 60 * 1000 
    const freezeDuration = 25 * 60 * 1000
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant

    if (!db[userId].characters?.subzero) {
        return await conn.sendMessage(from, { text: "❌ You don't own Sub-Zero!" }, { quoted: m })
    }

    if (db[userId].subzeroLastUsed && now - db[userId].subzeroLastUsed < cooldown) {
        const remaining = cooldown - (now - db[userId].subzeroLastUsed)
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        return await conn.sendMessage(from, { text: `⏳ Your ice powers are recharging. Wait ${hours}h ${minutes}m.` }, { quoted: m })
    }

    if (!victim || victim === sender) {
        return await conn.sendMessage(from, { text: "🎯 Tag someone to freeze!" }, { quoted: m })
    }

    if (!db[victim]) {
        db[victim] = { balance: 1000, bank: 0, lastClaim: '', lastClaimExtra: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
    }

    db[victim].isFrozen = true
    db[victim].frozenUntil = now + freezeDuration
    db[userId].subzeroLastUsed = now
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/MK/absolutezero.jpg" },
        caption: `❄️ *DEEP FREEZE* ❄️\n\n@${userId.split('@')[0]} has frozen @${victim.split('@')[0]} for 25 minutes!\n\n🚫 *Target Restrictions:*\n- Cannot @rob\n- Cannot @gamble\n- Cannot use shop items\n\n*“Ice so cold it burns.”*`,
        mentions: [userId, victim]
    }, { quoted: m })

    setTimeout(async () => {
        db[victim].isFrozen = false
        db[victim].frozenUntil = 0
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        await conn.sendMessage(from, { text: `♨️ @${victim.split('@')[0]} has thawed out. Account functions restored.`, mentions: [victim] })
    }, freezeDuration)
            }

        if (body === '@useillusion') {
    const userId = sender
    const now = Date.now()
    const cooldown = 7 * 60 * 60 * 1000 
    const duration = 2 * 60 * 1000

    if (!db[userId].characters?.loki) {
        return await conn.sendMessage(from, { text: "❌ You don't own Loki!" }, { quoted: m })
    }

    if (db[userId].lokiLastUsed && now - db[userId].lokiLastUsed < cooldown) {
        const remaining = cooldown - (now - db[userId].lokiLastUsed)
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        return await conn.sendMessage(from, { text: `⏳ Your illusions are recharging. Wait ${hours}h ${minutes}m.` }, { quoted: m })
    }

    db[userId].activeSkill = 'illusion'
    db[userId].lokiLastUsed = now
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/MARVEL/illusion.jpg" },
        caption: `🎭 *ART OF DECEPTION* 🎭\n\n@${userId.split('@')[0]} has cast an illusion! For the next 2 minutes, their robberies will look like failures...\n\n*“I am burdened with glorious purpose.”*`,
        mentions: [userId]
    }, { quoted: m })

    setTimeout(async () => {
        db[userId].activeSkill = null
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        await conn.sendMessage(from, { text: "🎭 Loki's illusion has faded. You are visible once more." }, { quoted: m })
    }, duration)
    }

            if (body === '@manofsteelon') {
    const userId = sender

    if (!db[userId].characters?.superman) {
        return await conn.sendMessage(from, { text: "❌ You don't own Superman!" }, { quoted: m })
    }

    if (!db[userId].passives) db[userId].passives = []

    if (db[userId].passives.includes('man_of_steel')) {
        return await conn.sendMessage(from, { text: "🛡️ Man of Steel is already active." }, { quoted: m })
    }

    if (db[userId].passives.length >= 2) {
        return await conn.sendMessage(from, { text: "🚫 Passive slots full! You can only have 2 passives active at once." }, { quoted: m })
    }

    db[userId].passives.push('man_of_steel')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/DC/manofsteel.jpg" },
        caption: `🛡️ *MAN OF STEEL: ACTIVATED*\n\nYou are now immune to all @rob attempts 24/7.\n\n⚠️ *Weakness:* Kryptonite.`
    }, { quoted: m })
}

if (body === '@manofsteeloff') {
    const userId = sender

    if (!db[userId].passives || !db[userId].passives.includes('man_of_steel')) {
        return await conn.sendMessage(from, { text: "❌ Man of Steel is not currently active." }, { quoted: m })
    }

    db[userId].passives = db[userId].passives.filter(p => p !== 'man_of_steel')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { text: "🛡️ *MAN OF STEEL: DEACTIVATED*\n\nYour passive slot has been freed." }, { quoted: m })
        }

          if (body === '@starkindustrieson') {
    const userId = sender
    if (!db[userId].characters?.ironman) return await conn.sendMessage(from, { text: "❌ You don't own Iron Man!" }, { quoted: m })
    if (!db[userId].passives) db[userId].passives = []
    if (db[userId].passives.includes('stark_industries')) return await conn.sendMessage(from, { text: "💰 Stark Industries is already running." }, { quoted: m })
    if (db[userId].passives.length >= 2) return await conn.sendMessage(from, { text: "🚫 Passive slots full!" }, { quoted: m })

    db[userId].passives.push('stark_industries')
    db[userId].lastStarkPayout = Date.now()
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/MARVEL/starkindustries.jpg" },
        caption: `🚀 *STARK INDUSTRIES: ONLINE*\n\nSalary: 2,000,000 🪙 every 3 hours.\n\n*“I am Iron Man.”*`
    }, { quoted: m })
}

if (body === '@starkindustriesoff') {
    db[sender].passives = (db[sender].passives || []).filter(p => p !== 'stark_industries')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: "🚀 *STARK INDUSTRIES: OFFLINE*" }, { quoted: m })
        }  


            if (body === '@wayneenterpriseson') {
    const userId = sender
    if (!db[userId].characters?.batman) return await conn.sendMessage(from, { text: "❌ You don't own Batman!" }, { quoted: m })
    if (!db[userId].passives) db[userId].passives = []
    if (db[userId].passives.includes('wayne_enterprises')) return await conn.sendMessage(from, { text: "💼 Wayne Enterprises is already active." }, { quoted: m })
    if (db[userId].passives.length >= 2) return await conn.sendMessage(from, { text: "🚫 Passive slots full!" }, { quoted: m })

    db[userId].passives.push('wayne_enterprises')
    db[userId].lastWaynePayout = Date.now()
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/DC/wayneenterprises.jpg" },
        caption: `💼 *WAYNE ENTERPRISES: ACTIVE*\n\nCorporate Funding: 1,500,000 🪙 every 3 hours.`
    }, { quoted: m })
}

if (body === '@wayneenterprisesoff') {
    db[sender].passives = (db[sender].passives || []).filter(p => p !== 'wayne_enterprises')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: "💼 *WAYNE ENTERPRISES: DEACTIVATED*" }, { quoted: m })
}


            if (body === '@vengeanceon') {
    const userId = sender
    if (!db[userId].characters?.batman) return await conn.sendMessage(from, { text: "❌ You don't own Batman!" }, { quoted: m })
    if (!db[userId].passives) db[userId].passives = []
    if (db[userId].passives.includes('vengeance')) return await conn.sendMessage(from, { text: "🦇 Vengeance is already on." }, { quoted: m })
    if (db[userId].passives.length >= 2) return await conn.sendMessage(from, { text: "🚫 Passive slots full!" }, { quoted: m })

    db[userId].passives.push('vengeance')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/DC/vengeance.jpg" },
        caption: `🦇 *VENGEANCE: ACTIVATED*\n\nCriminals beware. If anyone robs you, they lose 50% of their BANK.\n\n*“I’m Vengeance.”*`
    }, { quoted: m })
}

if (body === '@vengeanceoff') {
    db[sender].passives = (db[sender].passives || []).filter(p => p !== 'vengeance')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: "🦇 *VENGEANCE: DEACTIVATED*" }, { quoted: m })
}

            if (body === '@runbarry') {
    const userId = sender
    const now = Date.now()
    const cooldown = 5 * 60 * 60 * 1000 
    const speedForceDuration = 60000 

    if (!db[userId].characters?.flash) {
        return await conn.sendMessage(from, { text: "❌ You don't own The Flash!" }, { quoted: m })
    }

    if (db[userId].flashLastUsed && now - db[userId].flashLastUsed < cooldown) {
        const remaining = cooldown - (now - db[userId].flashLastUsed)
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        return await conn.sendMessage(from, { text: `⏳ The Speed Force is depleted. Wait ${hours}h ${minutes}m.` }, { quoted: m })
    }

    db[userId].activeSkill = 'speedforce'
    db[userId].flashLastUsed = now
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "VERSES/DC/runbarry.jpg" },
        caption: `⚡ *SPEED FORCE ACTIVATED* ⚡\n\n@${userId.split('@')[0]} is moving faster than time! For the next 60 seconds, the *@daily* cooldown is GONE.\n\n*“Life is locomotion. If you're not moving, you're not living.”*`,
        mentions: [userId]
    }, { quoted: m })

    setTimeout(async () => {
        db[userId].activeSkill = null
        fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
        await conn.sendMessage(from, { text: "⚡ *The Speed Force has faded.* Back to normal speed." }, { quoted: m })
    }, speedForceDuration)
            }

            if (body === '@susanoon') {
    const userId = sender
    if (!db[userId].characters?.sasuke) return await conn.sendMessage(from, { text: "❌ You don't own Sasuke!" }, { quoted: m })
    if (!db[userId].passives) db[userId].passives = []
    if (db[userId].passives.includes('susanoo')) return await conn.sendMessage(from, { text: "👁️ Susanoo is already active." }, { quoted: m })
    if (db[userId].passives.length >= 2) return await conn.sendMessage(from, { text: "🚫 Passive slots full!" }, { quoted: m })

    db[userId].passives.push('susanoo')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "ANIME/CHARACTERS/OTHERS/sasukesusano.jpg" },
        caption: `👁️ *SUSANOO: ACTIVATED*\n\nThe Ethereal Warrior protects you. High chance to negate robberies.\n\n*“My only goal is in the darkness.”*`
    }, { quoted: m })
}

            if (body.startsWith('@convert')) {
    const args = body.split(' ')
    const amountStr = args[1]
    
    if (!amountStr) return await conn.sendMessage(from, { text: '❌ Please specify the amount of coins to convert! Example: *@convert 100000*' }, { quoted: m })
    
    let amountToConvert = parseInt(amountStr)
    
    if (isNaN(amountToConvert) || amountToConvert <= 0) {
        return await conn.sendMessage(from, { text: '❌ Please enter a valid number.' }, { quoted: m })
    }

    if (amountToConvert % 100000 !== 0) {
        return await conn.sendMessage(from, { text: '❌ Invalid amount! You can only convert in multiples of 100,000.\n\nExamples:\n💰 100,000 🪙 = 1 💠\n💰 200,000 🪙 = 2 💠\n💰 500,000 🪙 = 5 💠' }, { quoted: m })
    }

    if (db[sender].coins < amountToConvert) {
        return await conn.sendMessage(from, { text: `❌ Insufficient coins! You need ${amountToConvert.toLocaleString()} 🪙 but you only have ${db[sender].coins.toLocaleString()} 🪙.` }, { quoted: m })
    }

    let emblemsGained = amountToConvert / 100000

    db[sender].coins -= amountToConvert
    db[sender].emblems = (db[sender].emblems || 0) + emblemsGained
    
    saveDb()

    await conn.sendMessage(from, { 
        text: `💠 *CONVERSION SUCCESSFUL* 💠\n\n📉 *Coins Deducted:* ${amountToConvert.toLocaleString()} 🪙\n📈 *Emblems Received:* ${emblemsGained.toLocaleString()} 💠\n\nYour emblems are safely stored in your bank wallet.` 
    }, { quoted: m })
                          }

                if (body.startsWith('@highrob')) {
    let highTarget = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    
    if (!highTarget) return await conn.sendMessage(from, { text: '❌ You must tag or reply to someone to attempt a High Stakes robbery!' }, { quoted: m })
    if (highTarget === sender) return await conn.sendMessage(from, { text: '❌ You cannot rob yourself.' }, { quoted: m })
    
    if ((db[sender].coins || 0) < 70000) {
        return await conn.sendMessage(from, { text: '❌ You need at least 70,000 🪙 in your wallet to attempt a High Stakes robbery. You aren\'t "high stakes" enough yet!' }, { quoted: m })
    }

    if (!db[highTarget] || (db[highTarget].coins || 0) < 100000) {
        return await conn.sendMessage(from, { text: '❌ This target is too poor for a High Stakes robbery. They need at least 100,000 🪙 in their wallet.' }, { quoted: m })
    }

    let highStakesAmount = Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
    if (highStakesAmount > (db[highTarget].coins || 0)) highStakesAmount = db[highTarget].coins

    let highSuccessRoll = Math.random()
    let isHighSuccess = false

    if (highStakesAmount > 80000) {
        if (highSuccessRoll <= 0.10) isHighSuccess = true
    } else {
        if (highSuccessRoll <= 0.25) isHighSuccess = true
    }

    if (isHighSuccess) {
        db[sender].coins = (db[sender].coins || 0) + highStakesAmount
        db[highTarget].coins -= highStakesAmount
        saveDb()

        await conn.sendMessage(from, { 
            text: `🥷 *HIGH STAKES SUCCESS* 🥷\n\n🎯 *Target:* @${highTarget.split('@')[0]}\n💰 *Stolen:* ${highStakesAmount.toLocaleString()} 🪙\n\nYou managed to evade the authorities and made off with the loot!`, 
            mentions: [highTarget] 
        }, { quoted: m })
    } else {
        let highFinePercent = (Math.floor(Math.random() * (75 - 55 + 1)) + 55) / 100
        let highFineAmount = Math.floor((db[sender].coins || 0) * highFinePercent)
        
        db[sender].coins -= highFineAmount
        if (db[sender].coins < 0) db[sender].coins = 0
        saveDb()

        await conn.sendMessage(from, { 
            text: `🚨 *BUSTED BY THE AUTHORITIES* 🚨\n\n@${sender.split('@')[0]}, you were caught trying to rob @${highTarget.split('@')[0]}!\n\n💸 *Fine:* ${highFineAmount.toLocaleString()} 🪙 (${(highFinePercent * 100).toFixed(0)}% of your wallet)`,
            mentions: [sender, highTarget]
        }, { quoted: m })
    }
                }

            if (body.startsWith('@slot')) {
    const args = body.split(' ')
    const amountStr = args[1]
    
    if (!amountStr) return await conn.sendMessage(from, { text: '❌ Specify an amount for the slots! Example: *@slot 1000*' }, { quoted: m })
    
    let slotBet = parseInt(amountStr)
    
    if (isNaN(slotBet) || slotBet <= 0) return await conn.sendMessage(from, { text: '❌ Enter a valid number.' }, { quoted: m })
    if (db[sender].coins < slotBet) return await conn.sendMessage(from, { text: `❌ Insufficient funds!` }, { quoted: m })

    const emojis = ["🍎", "🍋", "🍒", "💎", "🔔", "⭐"]
    let isYumekoActive = db[sender].activeSkill === 'kakegurui'
    
    let a, b, c
    if (isYumekoActive) {
        let winEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        a = winEmoji
        b = winEmoji
        c = winEmoji
    } else {
        a = emojis[Math.floor(Math.random() * emojis.length)]
        b = emojis[Math.floor(Math.random() * emojis.length)]
        c = emojis[Math.floor(Math.random() * emojis.length)]
    }

    let slotResult = `🎰 *SLOT MACHINE* 🎰\n\n[ ${a} | ${b} | ${c} ]\n\n`
    
    if (a === b && b === c) {
        let jackpot = slotBet * 3
        db[sender].coins += jackpot
        slotResult += `🎉 *JACKPOT!* You won ${jackpot.toLocaleString()} 🪙!`
        if (isYumekoActive) slotResult += `\n✨ *Kakegurui Luck!*`
    } else {
        db[sender].coins -= slotBet
        slotResult += `❌ *LOST!* You lost ${slotBet.toLocaleString()} 🪙.`
    }

    saveDb()
    await conn.sendMessage(from, { text: slotResult }, { quoted: m })
            }

            if (body.startsWith('@gamble')) {
    const args = body.split(' ')
    const gambleAmount = parseInt(args[1])
    const userId = sender
    let currentBalance = db[userId].coins || 0

    if (isNaN(gambleAmount) || gambleAmount <= 0) {
        return await conn.sendMessage(from, { text: "Please specify a valid amount to gamble. Example: *@gamble 500*" }, { quoted: m })
    }

    if (gambleAmount > currentBalance) {
        return await conn.sendMessage(from, { text: `❌ You don't have enough! Your balance is ${currentBalance.toLocaleString()} 🪙.` }, { quoted: m })
    }

    let isYumekoActive = db[userId].activeSkill === 'kakegurui'
    let gambleResult = (isYumekoActive || Math.random() < 0.5) ? "win" : "lose"
    
    if (gambleResult === "win") {
        db[userId].coins += gambleAmount
        saveDb()
        
        let winMsg = `🎰 *KAKEGURUI!!* ✅\n\n`
        winMsg += `✨ *Outcome:* YOU WON!\n`
        winMsg += `💰 *New Balance:* ${db[userId].coins.toLocaleString()} 🪙\n\n`
        winMsg += isYumekoActive ? `🎰 *Yumeko Jabami dictates the house!*` : `*“Let’s gamble until we go mad!”*`
        
        await conn.sendMessage(from, { text: winMsg }, { quoted: m })
    } else {
        db[userId].coins -= gambleAmount
        
        if (!gdb[from]) gdb[from] = { antilink: false, jackpot: 0 }
        gdb[from].jackpot = (gdb[from].jackpot || 0) + gambleAmount
        
        saveDb()
        fs.writeFileSync('./groupData.json', JSON.stringify(gdb, null, 2))
        
        let loseMsg = `🎰 *KAKEGURUI!!* ❌\n\n`
        loseMsg += `💀 *Outcome:* YOU LOST!\n`
        loseMsg += `💸 *Lost:* ${gambleAmount.toLocaleString()} 🪙\n`
        loseMsg += `🏦 *Note:* Your losses moved to the Group Jackpot.\n\n`
        loseMsg += `*Lmao you ain't Yumeko Jabami's twin* 😭💔`
        
        await conn.sendMessage(from, { text: loseMsg }, { quoted: m })
    }
            }


            if (body.startsWith('@deposit')) {
    const args = body.split(' ')
    const amountStr = args[1]
    
    if (!amountStr) return await conn.sendMessage(from, { text: '❌ Please specify an amount! Example: *@deposit 500* or *@deposit all*' }, { quoted: m })
    
    let val = amountStr === 'all' ? (db[sender].balance || 0) : parseInt(amountStr)
    
    if (isNaN(val) || val <= 0) return await conn.sendMessage(from, { text: '❌ Provide a valid number or "all".' }, { quoted: m })
    if (db[sender].balance < val) return await conn.sendMessage(from, { text: `❌ You only have ${db[sender].balance.toLocaleString()} 🪙 in your wallet.` }, { quoted: m })

    let taxRate = db[sender].books?.bfd ? 0.05 : 0.10
    let tax = Math.floor(val * taxRate)
    let amountToBank = val - tax

    db[sender].balance -= val
    db[sender].bank = (db[sender].bank || 0) + amountToBank
    
    saveDb()

    await conn.sendMessage(from, { 
        text: `🏦 *DEPOSIT SUCCESSFUL*\n\n💰 *Total From Wallet:* ${val.toLocaleString()} 🪙\n📈 *Added to Bank:* ${amountToBank.toLocaleString()} 🪙\n💸 *Tax (${taxRate * 100}%):* ${tax.toLocaleString()} 🪙${db[sender].books?.bfd ? '\n📘 *BFD Discount Applied!*' : ''}` 
    }, { quoted: m })
}

if (body.startsWith('@withdraw')) {
    const args = body.split(' ')
    const amountStr = args[1]
    
    if (!amountStr) return await conn.sendMessage(from, { text: '❌ Please specify an amount! Example: *@withdraw 500* or *@withdraw all*' }, { quoted: m })
    
    let val = amountStr === 'all' ? (db[sender].bank || 0) : parseInt(amountStr)
    
    if (isNaN(val) || val <= 0) return await conn.sendMessage(from, { text: '❌ Provide a valid number or "all".' }, { quoted: m })
    if ((db[sender].bank || 0) < val) return await conn.sendMessage(from, { text: `❌ You only have ${db[sender].bank.toLocaleString()} 🪙 in your bank.` }, { quoted: m })

    let taxRate = db[sender].books?.bfd ? 0.05 : 0.10
    let tax = Math.floor(val * taxRate)
    let amountToWallet = val - tax

    db[sender].bank -= val
    db[sender].balance = (db[sender].balance || 0) + amountToWallet
    
    saveDb()

    await conn.sendMessage(from, { 
        text: `📤 *WITHDRAWAL SUCCESSFUL*\n\n🏦 *Taken from Bank:* ${val.toLocaleString()} 🪙\n👛 *Added to Wallet:* ${amountToWallet.toLocaleString()} 🪙\n💸 *Tax (${taxRate * 100}%):* ${tax.toLocaleString()} 🪙${db[sender].books?.bfd ? '\n📘 *BFD Discount Applied!*' : ''}` 
    }, { quoted: m })
        }
            

            if (body.startsWith('@balance')) {
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

    let currentCoins = db[user].coins || 0

    await conn.sendMessage(from, { 
        text: `💰 *USER ASSETS* 💰\n\n👤 *User:* @${user.split('@')[0]}\n👛 *Coins:* ${currentCoins.toLocaleString()} 🪙\n\n💳 *Total Wallet:* ${currentCoins.toLocaleString()} 🪙`, 
        mentions: [user] 
    }, { quoted: m })
}

if (body.startsWith('@bank')) {
    const userEmblems = db[sender].emblems || 0
    const userCoins = db[sender].coins || 0
    
    await conn.sendMessage(from, { 
        image: fs.readFileSync('./BOTMEDIAS/finance.jpg'),
        caption: `🏦 *FINANCE HUB* 🏦\n\n*User:* @${sender.split('@')[0]}\n*Emblems:* ${userEmblems.toLocaleString()} 💠\n*Coins:* ${userCoins.toLocaleString()} 🪙\n\n━━━━━━━━━━━━━━━\nℹ️ *BANKING INFO:*\n💠 Emblems are secured assets and cannot be robbed.\n🛍️ Use Emblems directly in the shop without withdrawing.\n━━━━━━━━━━━━━━━`,
        mentions: [sender]
    }, { quoted: m })
}



        if (body === '@daily') {
    const userId = sender
    const now = Date.now()
    const dailyCooldown = 24 * 60 * 60 * 1000
    const lastClaim = db[userId].lastClaim ? parseInt(db[userId].lastClaim) : 0

    if (db[userId].activeSkill === 'speedforce') {
        db[userId].coins = (db[userId].coins || 0) + 10000
        saveDb()
        return await conn.sendMessage(from, { text: `⚡ *SPEED FORCE DAILY* ⚡\n\n💰 +10,000 Coins added!\nCooldown bypassed.` }, { quoted: m })
    }

    if (now - lastClaim < dailyCooldown) {
        const remaining = dailyCooldown - (now - lastClaim)
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        return await conn.sendMessage(from, { text: `🕒 Wait ${hours}h ${minutes}m for your next Daily reward.` }, { quoted: m })
    }

    db[userId].coins = (db[userId].coins || 0) + 10000
    db[userId].lastClaim = now.toString()
    saveDb()

    await conn.sendMessage(from, { 
        image: { url: './BOTMEDIAS/daily.jpg' },
        caption: `🎁 *DAILY REWARD* 🎁\n\n💰 You received *10,000* Coins!\n\n*Current Wallet:* ${(db[userId].coins).toLocaleString()} 🪙` 
    }, { quoted: m })
        }

            
            if (body === '@claim') {
    const userId = sender
    const now = Date.now()
    const claimCooldown = 24 * 60 * 60 * 1000
    const lastClaimExtra = db[userId].lastClaimExtra ? parseInt(db[userId].lastClaimExtra) : 0
    let randomReward = Math.floor(Math.random() * (40000 - 10000 + 1)) + 10000

    if (db[userId].activeSkill === 'speedforce') {
        db[userId].coins = (db[userId].coins || 0) + randomReward
        saveDb()
        return await conn.sendMessage(from, { text: `⚡ *SPEED FORCE CLAIM* ⚡\n\n💰 +${randomReward.toLocaleString()} Coins added!\nSpam detected!` }, { quoted: m })
    }

    if (now - lastClaimExtra < claimCooldown) {
        const remaining = claimCooldown - (now - lastClaimExtra)
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        return await conn.sendMessage(from, { text: `⏳ Your extra claim is cooling down. Return in ${hours}h ${minutes}m.` }, { quoted: m })
    }

    db[userId].coins = (db[userId].coins || 0) + randomReward
    db[userId].lastClaimExtra = now.toString()
    saveDb()

    await conn.sendMessage(from, { 
        image: { url: './BOTMEDIAS/claim.jpg' },
        caption: `🎟️ *EXTRA CLAIM* 🎟️\n\n💰 Luck was on your side! You claimed *${randomReward.toLocaleString()}* Coins!\n\n*Current Wallet:* ${(db[userId].coins).toLocaleString()} 🪙` 
    }, { quoted: m })
            }


            

if (body.startsWith('@lb')) {
    let board = Object.keys(db)
        .filter(id => id !== botNumber)
        .map(id => ({ id, total: (db[id].balance || 0) + (db[id].bank || 0) }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
    
    let text = `🏆 *THE-FRiO-BOT-v2 LEADERBOARD*\n\n`
    board.forEach((user, i) => {
        let medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤'
        text += `${medal} ${i + 1}. @${user.id.split('@')[0]} - ${user.total.toLocaleString()} 🪙\n`
    })
    
    await conn.sendMessage(from, { text, mentions: board.map(u => u.id) }, { quoted: m })
}

if (body.startsWith('@give')) {
    let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    const args = body.split(' ')
    let amount = parseInt(args[args.length - 1])

    if (!user) return await conn.sendMessage(from, { text: '❌ You must tag someone or reply to their message to give coins!' }, { quoted: m })
    if (user === sender) return await conn.sendMessage(from, { text: '❌ You cannot give coins to yourself.' }, { quoted: m })
    if (isNaN(amount) || amount <= 0) return await conn.sendMessage(from, { text: '❌ Specify a valid amount! Example: @give @user 5000' }, { quoted: m })
    
    if (db[sender].balance < amount) {
        return await conn.sendMessage(from, { text: `❌ Insufficient funds! You only have ${db[sender].balance.toLocaleString()} 🪙 in your wallet.` }, { quoted: m })
    }
    
    if (!db[user]) {
        db[user] = { balance: 1000, bank: 0, lastClaim: '', lastClaimExtra: '', msccount: 0, rank: 'NOOB', bonusesClaimed: [] }
    }
    
    db[sender].balance -= amount
    db[user].balance += amount
    
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    
    await conn.sendMessage(from, { 
        text: `✅ *TRANSFER SUCCESSFUL*\n\n💰 *Sent:* ${amount.toLocaleString()} 🪙\n👤 *Recipient:* @${user.split('@')[0]}\n\nYour new wallet balance: ${db[sender].balance.toLocaleString()} 🪙`, 
        mentions: [user] 
    }, { quoted: m })
}

if (body === '@susanooff') {
    db[sender].passives = (db[sender].passives || []).filter(p => p !== 'susanoo')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: "👁️ *SUSANOO: DEACTIVATED*" }, { quoted: m })
}

            if (body === '@perfectsusanoon') {
    const userId = sender
    if (!db[userId].characters?.madara) return await conn.sendMessage(from, { text: "❌ You don't own Madara!" }, { quoted: m })
    if (!db[userId].passives) db[userId].passives = []
    if (db[userId].passives.includes('perfect_susanoo')) return await conn.sendMessage(from, { text: "☄️ Perfect Susanoo is already active." }, { quoted: m })
    if (db[userId].passives.length >= 2) return await conn.sendMessage(from, { text: "🚫 Passive slots full!" }, { quoted: m })

    db[userId].passives.push('perfect_susanoo')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))

    await conn.sendMessage(from, { 
        image: { url: "ANIME/CHARACTERS/OTHERS/madarasusano.jpg" },
        caption: `☄️ *PERFECT SUSANOO: is under your control. The ultimate defense is online.\n\n*“Wake up to reality!”*`
    }, { quoted: m })
}

if (body === '@perfectsusanooff') {
    db[sender].passives = (db[sender].passives || []).filter(p => p !== 'perfect_susanoo')
    fs.writeFileSync('./economyData.json', JSON.stringify(db, null, 2))
    await conn.sendMessage(from, { text: "☄️ *PERFECT SUSANOO: DEACTIVATED*" }, { quoted: m })
                     }

                 const luffyMoves = ['pistol', 'redhawk', 'blackmamba', 'gatling', 'jetculverin', 'konggun', 'kaminari']
luffyMoves.forEach(move => {
    if (body.startsWith(`@${move}`)) {
        let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
        if (!victim) return await conn.sendMessage(from, { text: "Tag someone to attack!" }, { quoted: m })
        
        await conn.sendMessage(from, { 
            video: { url: `./ANIME/ANIME-ACTIONS/ONEPIECE/LUFFY/${move.toUpperCase()}.gif` }, 
            gifPlayback: true, 
            caption: `👊 *LUFFY:* @${sender.split('@')[0]} used *${move.toUpperCase()}* on @${victim.split('@')[0]}!`,
            mentions: [sender, victim]
        }, { quoted: m })
    }
})

            const zoroMoves = ['onigiri', 'shishisonson', 'dragontwister', 'ashura', 'kingofhell']
zoroMoves.forEach(move => {
    if (body.startsWith(`@${move}`)) {
        let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
        if (!victim) return await conn.sendMessage(from, { text: "Tag someone to slice!" }, { quoted: m })
        
        await conn.sendMessage(from, { 
            video: { url: `./ANIME/ANIME-ACTIONS/ONEPIECE/ZORO/${move.toUpperCase()}.gif` }, 
            gifPlayback: true, 
            caption: `⚔️ *ZORO:* @${sender.split('@')[0]} unleashed *${move.toUpperCase()}* against @${victim.split('@')[0]}!`,
            mentions: [sender, victim]
        }, { quoted: m })
    }
})

            const sanjiMoves = ['diablejambe', 'ifritjambe', 'spectre', 'venaison']
sanjiMoves.forEach(move => {
    if (body.startsWith(`@${move}`)) {
        let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
        if (!victim) return await conn.sendMessage(from, { text: "Tag someone to kick!" }, { quoted: m })
        
        await conn.sendMessage(from, { 
            video: { url: `./ANIME/ANIME-ACTIONS/ONEPIECE/SANJI/${move.toUpperCase()}.gif` }, 
            gifPlayback: true, 
            caption: `🦵 *SANJI:* @${sender.split('@')[0]} landed a *${move.toUpperCase()}* on @${victim.split('@')[0]}!`,
            mentions: [sender, victim]
        }, { quoted: m })
    }
})

            const narutoMoves = ['rasengan', 'rasenchuriken', 'kuramachakra']
narutoMoves.forEach(move => {
    if (body.startsWith(`@${move}`)) {
        let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
        if (!victim) return await conn.sendMessage(from, { text: "Tag someone for your Jutsu!" }, { quoted: m })
        
        await conn.sendMessage(from, { 
            video: { url: `./ANIME/ANIME-ACTIONS/NARUTO/${move.toUpperCase()}.gif` }, 
            gifPlayback: true, 
            caption: `🍥 *NARUTO:* @${sender.split('@')[0]} hit @${victim.split('@')[0]} with a *${move.toUpperCase()}*!`,
            mentions: [sender, victim]
        }, { quoted: m })
    }
})

            if (body.startsWith('@shanksdd')) {
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!victim) return await conn.sendMessage(from, { text: "Tag a rival!" }, { quoted: m })
    await conn.sendMessage(from, { 
        video: { url: './ANIME/ANIME-ACTIONS/ONEPIECE/SHANKS/shanksdd.gif' }, 
        gifPlayback: true, 
        caption: `🗡️ *SHANKS:* @${sender.split('@')[0]} used *DIVINE DEPARTURE* on @${victim.split('@')[0]}!`,
        mentions: [sender, victim]
    }, { quoted: m })
}

if (body.startsWith('@sakurapunch') || body.startsWith('@sakura2')) {
    const move = body.includes('punch') ? 'SAKURAPUNCH' : 'SAKURA2'
    let victim = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant
    if (!victim) return await conn.sendMessage(from, { text: "Tag someone to smash!" }, { quoted: m })
    await conn.sendMessage(from, { 
        video: { url: `./ANIME/ANIME-ACTIONS/NARUTO/${move}.gif` }, 
        gifPlayback: true, 
        caption: `🌸 *SAKURA:* @${sender.split('@')[0]} pummeled @${victim.split('@')[0]}!`,
        mentions: [sender, victim]
    }, { quoted: m })
}
            
        } catch (err) {
            console.log(err)
        }
    })
}

startFrioBot()
