const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = require("node-fetch");
const { MessageMedia } = require("whatsapp-web.js");
require("dotenv").config();
const { HolodexApiClient } = require("holodex.js");
const { wiki } = require("vtuber-wiki");

const util = require("./utils/regex.js");

// HOLODEX START
const holo = new HolodexApiClient({
  apiKey: process.env.HOLODEX_APIKEY || "",
});
// HOLODEX END

// Variabel global
const GL_namaBot = "AoBot";
const GL_developer = "Agung";
const GL_versiBot = "0.2.2 2023";

// Create a new client instance
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Client is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Start your client
client.initialize();

// Handle incoming messages
client.on("message", async (msg) => {
  const messageContent = msg.body.toLowerCase();

  if (messageContent === ".arise") {
    client.sendMessage(
      msg.from,
      "terimakasih telah membangkitkan saya, tuan raja bokeb yang maha Agung"
    );
  } else if (messageContent === "!ping") {
    client.sendMessage(msg.from, "pong");
  } else if (messageContent === ".menu") {
    msg.reply(
      `*AoBot by @AoGung shap melayani*
  ~~ Fitur ~~
  ‣ tag everyone: @everyone _(hati-hati)_
  ‣ Bikin stiker: .stiker _(kirim gambar beserta command-nya)_
  ‣ Convert YT to MP3: .yt _<link video yt>_
  ‣ info: ao
  ‣ Main Menu: .menu
  ‣ Cek Ping: .ping
  ‣ Fitur tambahan
  .sapa
  .hi
  .versi
  `
    );
    const media = MessageMedia.fromFilePath("img/hqdefault.jpg");
    client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
  } else if (messageContent === "ao") {
    client.sendMessage(msg.from, `Shap bos 🤡\nAda apa yah?`);
  } else if (messageContent === ".versi") {
    msg.reply(`${GL_developer} ‣ ${GL_namaBot} • ${GL_versiBot}`);
  } else if (messageContent === "@everyone") {
    const chat = await msg.getChat();
    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  } else if (messageContent === ".ping") {
    let rand = Math.floor(Math.random() * 1000);
    let tcext = `Pong! Lt ${rand}ms`;
    msg.reply(tcext);
  } else if (msg.hasMedia && messageContent === ".stiker") {
    const media = await msg.downloadMedia();
    console.log("media downloaded");
    try {
      client.sendMessage(msg.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: "Ao - Bot",
        stickerName: "🐱‍👤",
        stickerCategories: "stiker",
      });
    } catch {
      client.sendMessage(msg.from, "Nope");
    }
  } else if (messageContent === ".jokes") {
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
      );
      const { setup, punchline } = await response.json();
      msg.reply(`${setup}\n${punchline}`);
    } catch (error) {
      console.error("Error fetching joke:", error);
      msg.reply("Sorry, I couldn't fetch a joke at the moment.");
    }
  } else if (messageContent.startsWith(".holo")) {
    const args = messageContent.slice(".holo".length).trim();

    // Check if the command is full
    if (args) {
      const englishNameSearch = args;
      try {
        wiki(englishNameSearch).then(async (data) => {
          if (!data.channel || !data) {
            msg.reply("Tidak ada vdubur dengan nama tersebut");
          } else if (data.channel) {
            let channelId = util.ambilId(data.channel);
            holo
              .getChannel(channelId)
              .then(async (res) => {
                let engName = res.englishName;
                let avatarUrl = res.avatarUrl;
                let originalName = res.name;
                let org = res.organization;
                let subs = res.subscriberCount;
                let isActive = !res.isInactive;
                const media = await MessageMedia.fromUrl(avatarUrl, {
                  unsafeMime: true,
                });
                client.sendMessage(msg.from, media, {
                  caption: `English name: ${engName}\nOriginal Name: ${originalName}\nOrg: ${org}\nSubs: ${subs}\nActive: ${isActive}`,
                });
              })
              .catch((err) => {
                msg.reply("Tidak ada vdubur dengan nama tersebut");
              });
          }
        });
      } catch (error) {
        console.error(error);
        msg.reply("An error occurred while searching for the channel.");
      }
    } else {
      msg.reply(
        "Format salah, yang benar: .holo <englishName> \nContoh: .holo pekora"
      );
    }
  }
});

// Handle message revokes
client.on("message_revoke_everyone", async (after, before) => {
  if (before) {
    const chatId = before.from;
    const messageContent = before.body;
    client.sendMessage(chatId, `Pesan yang dihapus: "${messageContent}"`);
  }
});
