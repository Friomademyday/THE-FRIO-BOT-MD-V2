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
if (user.coins < 100) return reply("❌ You don't even have 100 coins? That's actually impressive.");
if (user.characters.sakura) return reply("🌸 You already own Sakura. Your inventory is now 100% more pink.");

user.coins -= 100;
user.characters.sakura = true;
await database.saveUser(user);

await client.sendMessage(message.from, {
image: { url: "ANIME/CHARACTERS/OTHERS/sakura.jpg" },
caption: "✅ TRANSACTION COMPLETE: You bought Sakura for 100 coins. She's here. Use @infosakura to see... well, to see her."
});
            }
            
        } catch (err) {
            console.log(err)
        }
    })
}

startFrioBot()
