import { createRequire } from "module";
import { Client, Events, GatewayIntentBits } from "discord.js";
console.log("a");
const require = createRequire(import.meta.url);
require("dotenv").config({ debug: true });
import fetch from "node-fetch";
const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on(Events.ClientReady, (c) => {
  console.log(`Ready! (${c.user.tag})`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  // if (message.channel.name != "アーカイブ") return;
  message.reply("messageを読み込んだ");
  console.log(message.content);
  const data = {
    date: message.createdAt,
    username: message.author.username,
    content: message.content,
  };
  // Google Apps Script WebアプリケーションのURLにデータを送信
  const gasUrl =
    "https://script.google.com/macros/s/AKfycbyvPyt9toZ9B_d9D7V53G-3eMokPB4NREhiSlx_N68HljP1M3qf6Chjzdwuxm1vWK8lUg/exec";
  try {
    const response = await fetch(gasUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    // レスポンスを受け取る
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    message.reply("GASに送信した");
  } catch (error) {
    console.error("Error sending data to Google Sheets:", error);
  }
});

client.login(discordToken);
