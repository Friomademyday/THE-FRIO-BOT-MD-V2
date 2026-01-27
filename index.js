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

            

            
        } catch (err) {
            console.log(err)
        }
    })
}

startFrioBot()
