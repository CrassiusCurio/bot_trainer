const TelegramBot = require('node-telegram-bot-api');
const { newGame, restartGame } = require('./options');
const token = '5889904035:AAHQzxr1uTJ88pjsCQHZN4-TME-o4Vu_3JY';
const bot = new TelegramBot(token, { polling: true });
const chats = {};



const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай число от 0 до 9', newGame);
}

const start = () => {
    bot.setMyCommands(
        [
            { command: '/start', description: 'Начнем переписку' },
            { command: '/end', description: 'Пора прощаться' },
            { command: '/info', description: 'Единственная команда' },
            { command: '/game', description: 'Сыграем?' }
        ]
    )

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/6.webp');
            return bot.sendMessage(chatId, `Привет! Начни ввод команды со знака "/", или нажми синюю кнопку "Menu"`);

        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name}. А твой ник: ${msg.from.username}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        if (text === '/end') {
            return bot.sendMessage(chatId, 'Пока!');
        }

        return bot.sendMessage(chatId, 'Не знаю такой команды.');

    })

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;

        if (data === '/restart_game') {
            return startGame(chatId);
        }

        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Да! Я загадал: ${chats[chatId]}`, restartGame)
        }

        else {
            return bot.sendMessage(chatId, `Неправильно. Я загадал: ${chats[chatId]}`, restartGame)
        }
    })
}

start();