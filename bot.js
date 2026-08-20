const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// توکنێ نوو ل ژێر دانە
const token = 'YOUR_NEW_TELEGRAM_BOT_TOKEN_HERE';
const bot = new TelegramBot(token, { polling: true });

// کۆگاها Keyێن VIP و کاربەرێن VIP
const vipKeys = new Set(["VIP-1234-5678", "VIP-8888-9999"]); // Keyێن نموونەیی
const vipUsers = new Set(); // ئایدییا کاربەرێن VIP

// فەرمانا /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const isVip = vipUsers.has(chatId);

  const welcomeMessage = `
👋 **سلاڤ! بەخێرهاتی بۆ بۆتێ داگرتنا ڤیدیۆیان**

📌 **باردوخێ تە:** ${isVip ? "⭐ VIP (داگرتن ب کوالیتییا 4K)" : "👤 ئاسایی (داگرتن ب کوالیتییا 1080p)"}

🔗 تەنێ بەستەرێ (Link) ڤیدیۆیەکێ ل تێکتاک، ئینستاگرام، یان یوتیوب بنێرە.
🔑 ئەگەر Keyێ VIP هەیە، بنێرە ب ڤی شێوەیی: \`/vip KEY_YOUR_KEY\`
  `;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// چالاککرنا Keyێ VIP
bot.onText(/\/vip (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const keyInput = match[1].trim();

  if (vipKeys.has(keyInput)) {
    vipUsers.add(chatId);
    vipKeys.delete(keyInput); // Key دهێتە سڕین دا کەسەک دی بکارنەئینێت
    bot.sendMessage(chatId, "🎉 **پیرۆزە! هەژمارا تە بوو ب VIP.** نوکە تۆ دشێی ڤیدیۆیان ب کوالیتییا **4K** دابگری!");
  } else {
    bot.sendMessage(chatId, "❌ **Keyێ ئینخڵاتە یان ژ لایێ کەسەک دی ڤە هاتییە بکارئینان!**");
  }
});

// وەرگرتنا بەستەرێن ڤیدیۆیان
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  const isVip = vipUsers.has(chatId);
  const quality = isVip ? "4K (Ultra HD)" : "1080p (Full HD)";

  bot.sendMessage(chatId, `⏳ **دەرئێنانا ڤیدیۆیێ ب کوالیتییا ${quality}...**`);

  // ل ڤێرە تە دشێی API یا داگرتنێ بکاربینی
  setTimeout(() => {
    bot.sendMessage(chatId, `✅ **ڤیدیۆ ئامادەیە!**\nکوالیتی: ${quality}\n\n*(سێرڤەر ئۆنلاینە و یێ کار دکەت)*`);
  }, 2000);
});

console.log("Bot is running...");
