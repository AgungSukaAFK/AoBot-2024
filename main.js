const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

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

// Send message
client.on("message_create", (message) => {
  if (message.body === ".arise") {
    // send back "pong" to the chat the message was sent in
    client.sendMessage(
      message.from,
      "terimakasih telah membangkitkan saya, tuan raja bokeb yang maha Agung"
    );
  }
});

//variabel global
const GL_namaBot = "AoBot";
const GL_developer = "Agung";
// const GL_prefix = "."
const GL_versiBot = "0.2.2 2023";
// End variabel global

// Replies
client.on("message", (message) => {
  if (message.body === "!ping") {
    client.sendMessage(message.from, "pong");
  }
});

// Menu
client.on("message", (message) => {
  if (message.body.toLowerCase() === ".menu") {
    message.reply(
      `*AoBot by @AoGung shap melayani*
  ~~ Fitur ~~
  ‣ tag everyone: @everyone _(hati-hati)_
  ‣ Bikin stiker: .stiker _(kirim gambar beserta command-nya)_
  ‣ Convert YT to MP3: .yt _<link vidoe yt>_
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
    client.sendMessage(message.from, media, { sendMediaAsSticker: true });
  }
});

// SUMMON
client.on("message", (m) => {
  if (m.body.toLowerCase() === "ao") {
    // let date = new Date();
    // let text = `Sekarang jam ${date.getHours()}:${date.getMinutes()} WIB`
    client.sendMessage(m.from, `Shap bos 🤡\nAda apa yah?`);
  }
});

// bagian cek versi
client.on("message", (m) => {
  if (m.body.toLowerCase() === ".versi") {
    m.reply(`${GL_developer} ‣ ${GL_namaBot} • ${GL_versiBot}`);
  }
});

// bagian mention @everyone
client.on("message", async (msg) => {
  if (msg.body === "@everyone") {
    const chat = await msg.getChat();

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }
});

// bagian ping
client.on("message", (message) => {
  if (message.body === ".ping") {
    let rand = Math.floor(Math.random() * 1000);
    let tcext = `Pong! Lt ${rand}ms`;
    message.reply(tcext);
  }
});

// bagian bikin stiker
client.on("message", async (msg) => {
  if (msg.hasMedia && msg.body.toLowerCase() === ".stiker") {
    const media = await msg.downloadMedia();
    // media setelah didonglot
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
  }
});
