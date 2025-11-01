const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');

// -----------------------------
// ТЫ ПРИСОХРАНИЛ ТОКЕНЫ В КОДЕ — ОНИ ЗДЕСЬ (как просил)
// -----------------------------
const TELEGRAM_TOKEN = '8535824512:AAEXuFVbbGl_Pr4Jea1NO7GbmKzMgMTQ_Xc';
const OPENAI_API_KEY = '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';

if (!TELEGRAM_TOKEN || !OPENAI_API_KEY) {
  console.error('❌ Ошибка: не найден TELEGRAM_TOKEN или OPENAI_API_KEY');
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Salom, ${msg.from.first_name}! 👋\nMen GPT asosidagi botman. Menga yozing – men javob beraman! 🤖`
  );
});

// message handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/start')) return;

  try {
    await bot.sendChatAction(chatId, 'typing');

    // В зависимости от версии SDK, интерфейс может немного отличаться.
    // Этот вызов работает с версией openai, где есть chat.completions.create
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Ты дружелюбный Telegram-бот, отвечай кратко и по существу.' },
        { role: 'user', content: text }
      ],
    });

    const reply = response.choices && response.choices[0] && response.choices[0].message
      ? response.choices[0].message.content
      : 'Извините, ответ не получен.';

    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error('OpenAI Error:', err);
    bot.sendMessage(chatId, '⚠️ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.');
  }
});
